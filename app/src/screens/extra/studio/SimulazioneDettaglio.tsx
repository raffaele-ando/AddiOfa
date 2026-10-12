// Dettaglio di una simulazione. Senza params.id: cosa contiene, regole e limite gratuito prima di iniziare (concept 36 scheda 9, 18 scheda 7).
// Con params.id (una simulazione già svolta): risultato, riepilogo per argomento e correzioni (concept 36 schede 10-11).
import { useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2, Clock, FileText, Info, ListChecks, Lock, Timer, XCircle } from 'lucide-react';
import { useExtra } from '../contesto';
import { useAccess } from '../../../access/context';
import type { ExamQuestionResult, PublicQuestion, DataProvider } from '../../../access/provider';
import { FORMATS } from '../../../config/offer';
import { entrataStorico, FORMATO_SIMULAZIONE, limiteGratuito, perArgomentoSimulazione, trovaSimulazione } from '../../../lib/studio/simulazioni';
import MisuratoreEsito from '../../../components/esito/MisuratoreEsito';
import CorrezioniComplete from '../../../components/esito/CorrezioniComplete';
import InfoPunteggio from '../../../components/esito/InfoPunteggio';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';
import { Pagina, Carta, Barra, Bottone, StatoVuoto, TitoloSezione, coloreValore, dataBreve, minSec } from './comune';
import type { ExamHistory } from '../../../types';

// ---- Prima di iniziare
function PrimaDiIniziare() {
  const { appState, pass, vai, indietro, avviaSimulazione } = useExtra();
  const f = FORMATS[FORMATO_SIMULAZIONE];
  const limite = useMemo(() => limiteGratuito(appState, pass), [appState, pass]);
  const [info, setInfo] = useState(false);
  const bloccata = !pass && !limite.puoiIniziare;
  return (
    <Pagina titolo="Simulazione d’esame" onIndietro={indietro} sotto="Il test di recupero, con le stesse regole.">
      <Carta className="mt-4 p-4">
        <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-testo-tenue">Cosa contiene</p>
        <ul className="mt-2.5 grid grid-cols-1 gap-2.5">
          {([
            [ListChecks, `${f.questions} domande`, `Grammatica e traduzione, ${f.options} opzioni per domanda, una sola esatta.`],
            [Timer, `${f.minutes} minuti`, 'Il tempo è unico per tutta la prova: se finisce, la simulazione si consegna da sola.'],
            [FileText, `Soglia ${f.passMark} su ${f.questions}`, `Con ${f.passMark} risposte esatte o più la simulazione è superata.`],
          ] as const).map(([Icona, titolo, testo]) => (
            <li key={titolo} className="flex items-start gap-3">
              <span aria-hidden="true" className="shrink-0 grid place-items-center w-[38px] h-[38px] rounded-[11px] bg-superficie text-azione dark:border dark:border-linea"><Icona size={20} /></span>
              <span className="min-w-0"><span className="block text-[15px] leading-[20px] font-bold text-testo">{titolo}</span><span className="block text-[13.5px] leading-[19px] text-testo-tenue">{testo}</span></span>
            </li>
          ))}
        </ul>
      </Carta>

      <section aria-labelledby="titolo-regole" className="mt-6 flex flex-col gap-2">
        <TitoloSezione id="titolo-regole">Le regole</TitoloSezione>
        <ul className="list-disc pl-5 text-[14.5px] leading-[22px] text-testo marker:text-testo-tenue space-y-1">
          <li>Nessuna penalità: una risposta sbagliata o lasciata vuota vale zero.</li>
          <li>Il risultato è il numero di risposte esatte su {f.questions}, non c’è un punteggio più complicato.</li>
          <li>Durante la prova non vedi se hai risposto bene: le correzioni e le spiegazioni arrivano alla consegna.</li>
          <li>È una simulazione: ti dice come stai andando, non prevede il risultato del test vero.</li>
        </ul>
        <button type="button" onClick={() => { playTapSound(); setInfo(true); }}
          className="self-start inline-flex items-center gap-1.5 min-h-[40px] text-[14px] font-semibold text-azione underline underline-offset-2">
          <Info size={16} aria-hidden="true" /> Come viene calcolato il punteggio
        </button>
      </section>

      <section aria-labelledby="titolo-limite" className="mt-6 flex flex-col gap-2">
        <TitoloSezione id="titolo-limite">Quante ne puoi fare</TitoloSezione>
        <Carta className="p-4">
          {pass ? (
            <p className="text-[14.5px] leading-[21px] text-testo">Con il Pass le simulazioni sono <span className="font-bold">illimitate</span>.</p>
          ) : limite.puoiIniziare ? (
            <p className="text-[14.5px] leading-[21px] text-testo">
              Gratis hai <span className="font-bold">{limite.restanti === 1 ? '1 simulazione completa' : `${limite.restanti} simulazioni complete`}</span> ({limite.fatte} su {limite.gratuite} già fatta). Le altre sono nel Pass.
            </p>
          ) : (
            <p className="text-[14.5px] leading-[21px] text-testo">
              La simulazione gratuita l’hai già fatta. Per farne altre serve il Pass: pagamento una tantum, nessun abbonamento.
            </p>
          )}
        </Carta>
      </section>

      <div className="mt-6 flex flex-col gap-2.5">
        <Bottone onClick={avviaSimulazione} icona={bloccata ? <Lock size={17} aria-hidden="true" /> : undefined}>
          {bloccata ? 'Altre simulazioni con il Pass' : 'Inizia'}
        </Bottone>
        <Bottone variante="secondario" onClick={() => vai('simulazioni')}>Le mie simulazioni</Bottone>
      </div>
      <InfoPunteggio format={f} aperto={info} onChiudi={() => setInfo(false)} />
    </Pagina>
  );
}

// ---- Correzioni di una simulazione svolta
type Correzioni =
  | { fase: 'carico' }
  | { fase: 'errore' }
  | { fase: 'assenti' } // lo storico non ha le risposte domanda per domanda (salvataggio vecchio)
  | { fase: 'ok'; domande: PublicQuestion[]; perQ: Map<string, ExamQuestionResult>; risposte: Record<string, number> };

/**
 * Ricostruisce le correzioni dai log salvati. Le opzioni di ogni domanda erano rimescolate durante la prova e l'ordine non è stato salvato:
 * si sa se la risposta era giusta, sbagliata o vuota e qual è l'esatta (dal banco), ma non il testo dell'opzione sbagliata scelta.
 */
async function caricaCorrezioni(provider: DataProvider, h: ExamHistory): Promise<Correzioni> {
  const logs = Array.isArray(h.questionLogs) ? h.questionLogs : [];
  if (logs.length === 0) return { fase: 'assenti' };
  const ids = (Array.isArray(h.questionIds) && h.questionIds.length > 0 ? h.questionIds : logs.map(l => l.questionId)).filter((x, i, a) => a.indexOf(x) === i);
  const lette: PublicQuestion[] = [];
  for (let i = 0; i < ids.length; i += 80) lette.push(...await provider.getQuestions(ids.slice(i, i + 80)));
  const perId = new Map(lette.map(q => [q.id, q]));
  const domande = ids.map(id => perId.get(id)).filter((q): q is PublicQuestion => !!q);
  if (domande.length === 0) return { fase: 'errore' };
  const giudizi = await Promise.all(domande.map(async q => {
    try { return [q.id, await provider.grade(q.id, -1)] as const; } catch { return [q.id, null] as const; }
  }));
  const voti = new Map(giudizi);
  const logPer = new Map(logs.map(l => [l.questionId, l]));
  const perQ = new Map<string, ExamQuestionResult>();
  const risposte: Record<string, number> = {};
  for (const q of domande) {
    const g = voti.get(q.id);
    const l = logPer.get(q.id);
    if (!g || !l) continue;
    const data = l.userAnswerIndex !== null && l.userAnswerIndex !== undefined;
    perQ.set(q.id, { id: q.id, correct: data ? l.isCorrect === true : null, correctIndex: g.correctIndex, explanation: g.explanation, ...(g.theoryId ? { theoryId: g.theoryId } : {}) });
    if (data) risposte[q.id] = l.isCorrect === true ? g.correctIndex : -1; // -1 = data ma sbagliata (il testo scelto non è salvato)
  }
  const complete = domande.filter(q => perQ.has(q.id));
  return complete.length > 0 ? { fase: 'ok', domande: complete, perQ, risposte } : { fase: 'errore' };
}

function Svolta({ chiave }: { chiave: string }) {
  const { appState, pass, vai, indietro, apriTeoria, avviaSimulazione } = useExtra();
  const { provider } = useAccess();
  const s = useMemo(() => trovaSimulazione(appState.history, chiave), [appState.history, chiave]);
  const entrata = useMemo(() => (s ? entrataStorico(appState.history, s.id) : undefined), [appState.history, s]);
  const [corr, setCorr] = useState<Correzioni>({ fase: 'carico' });
  const [tentativo, setTentativo] = useState(0);
  const correzioniRef = useRef<HTMLDivElement>(null);
  const [info, setInfo] = useState(false);

  useEffect(() => {
    if (!entrata) return;
    let vivo = true;
    setCorr({ fase: 'carico' });
    caricaCorrezioni(provider, entrata).then(r => { if (vivo) setCorr(r); }).catch(() => { if (vivo) setCorr({ fase: 'errore' }); });
    return () => { vivo = false; };
  }, [provider, entrata, tentativo]);

  if (!s || !entrata) {
    return (
      <Pagina titolo="Simulazione" onIndietro={indietro}>
        <div className="mt-6">
          <StatoVuoto titolo="Simulazione non trovata" testo="Non trovo questa simulazione tra quelle svolte su questo dispositivo.">
            <Bottone onClick={() => vai('simulazioni')}>Le mie simulazioni</Bottone>
          </StatoVuoto>
        </div>
      </Pagina>
    );
  }

  const f = FORMATS[s.formato];
  const { righe, per } = perArgomentoSimulazione(entrata);
  const mancano = s.soglia - s.esatte;
  const limite = limiteGratuito(appState, pass);

  return (
    <Pagina titolo={`Simulazione ${s.numero}`} onIndietro={indietro} sotto={dataBreve(s.data)}
      destra={<button type="button" onClick={() => { playTapSound(); setInfo(true); }} aria-label="Come viene calcolato il punteggio" aria-haspopup="dialog"
        className="shrink-0 grid place-items-center w-10 h-10 -mr-2 mt-[2px] rounded-full text-azione hover:bg-azione-tinta/60"><Info size={22} aria-hidden="true" /></button>}>
      <Carta className="mt-4 px-4 pt-3 pb-4 text-center">
        <MisuratoreEsito giuste={s.esatte} totale={s.totale} soglia={s.soglia} superata={s.superata} />
        <div className="-mt-1 flex justify-center">
          <span className={cn('inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[16px] font-extrabold', s.superata ? 'bg-alto-tinta text-alto-testo' : 'bg-basso-tinta text-basso-testo')}>
            {s.superata ? <CheckCircle2 size={18} strokeWidth={2.8} aria-hidden="true" /> : <XCircle size={18} strokeWidth={2.8} aria-hidden="true" />}
            {s.superata ? 'Superata' : 'Non superata'}
          </span>
        </div>
        <p className="mt-2.5 text-[14px] font-semibold text-testo">
          {s.superata ? `Soglia ${s.soglia} su ${s.totale}: raggiunta.` : `Soglia ${s.soglia} su ${s.totale}: ${mancano === 1 ? 'ti è mancata 1 risposta' : `ti sono mancate ${mancano} risposte`}.`}
        </p>
      </Carta>

      <div className="mt-3 grid grid-cols-2 min-[460px]:grid-cols-4 gap-2" role="list" aria-label="Riepilogo">
        {([
          ['Giuste', String(s.esatte)],
          ['Sbagliate', s.sbagliate === null ? '–' : String(s.sbagliate)],
          ['Senza risposta', s.omesse === null ? '–' : String(s.omesse)],
          [`Tempo su ${f.minutes} min`, s.tempoSecondi > 0 ? minSec(s.tempoSecondi) : '–'],
        ] as const).map(([nome, valore]) => (
          <div key={nome} role="listitem" className="rounded-[12px] bg-superficie-2 px-2 py-3 text-center">
            <p className="text-[22px] leading-[26px] font-extrabold tabular-nums text-testo">{valore}</p>
            <p className="mt-0.5 text-[11.5px] leading-[15px] font-semibold text-testo-tenue flex items-center justify-center gap-1">
              {nome.startsWith('Tempo') && <Clock size={12} aria-hidden="true" />}{nome}
            </p>
          </div>
        ))}
      </div>

      {righe.length > 0 && (
        <section aria-labelledby="titolo-argomenti" className="mt-7 flex flex-col gap-2.5">
          <TitoloSezione id="titolo-argomenti">{per === 'argomento' ? 'Per argomento' : 'Per area'}</TitoloSezione>
          <Carta className="p-4">
            <ul className="flex flex-col gap-3.5">
              {righe.map(r => (
                <li key={r.nome}>
                  <div className="flex items-baseline justify-between gap-3 text-[14px]">
                    <span className="font-semibold text-testo break-words min-w-0">{r.nome}</span>
                    <span className="shrink-0 font-bold tabular-nums text-testo">{r.esatte}/{r.totale} <span className="text-[12px] font-medium text-testo-tenue">({r.percento}%)</span></span>
                  </div>
                  <div className="mt-1.5"><Barra valore={r.percento} colore={coloreValore(r.percento)} alta={7} /></div>
                </li>
              ))}
            </ul>
          </Carta>
        </section>
      )}

      <div ref={correzioniRef} className="mt-7 scroll-mt-3">
        {corr.fase === 'carico' && <p role="status" className="text-[14px] text-testo-tenue">Carico le correzioni…</p>}
        {corr.fase === 'errore' && (
          <StatoVuoto titolo="Non riesco a caricare le correzioni" testo="Controlla la connessione e riprova.">
            <Bottone variante="secondario" onClick={() => setTentativo(n => n + 1)}>Riprova</Bottone>
          </StatoVuoto>
        )}
        {corr.fase === 'assenti' && (
          <StatoVuoto titolo="Correzioni non disponibili" testo="Di questa simulazione sono salvati il punteggio e il tempo, ma non le risposte domanda per domanda." />
        )}
        {corr.fase === 'ok' && <CorrezioniComplete questions={corr.domande} perQuestion={corr.perQ} answers={corr.risposte} onOpenTheory={apriTeoria} senzaLettere />}
      </div>

      <div className="mt-7 flex flex-col gap-2.5">
        <Bottone onClick={avviaSimulazione} icona={!pass && !limite.puoiIniziare ? <Lock size={17} aria-hidden="true" /> : undefined}>
          {!pass && !limite.puoiIniziare ? 'Altre simulazioni con il Pass' : 'Nuova simulazione'}
        </Bottone>
        <Bottone variante="secondario" onClick={() => vai('simulazioni')}>Le mie simulazioni</Bottone>
      </div>
      <InfoPunteggio format={f} aperto={info} onChiudi={() => setInfo(false)} />
    </Pagina>
  );
}

export default function SimulazioneDettaglio() {
  const { params } = useExtra();
  return params.id ? <Svolta chiave={params.id} /> : <PrimaDiIniziare />;
}
