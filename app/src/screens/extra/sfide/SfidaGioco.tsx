// `sfida-gioco`: 10 domande a tempo (5 minuti), senza feedback fino alla consegna, come la simulazione ma più breve.
// Parametri: `tipo` ('giorno' | 'duello'), `seme`; per il duello anche `ruolo` ('sfidante' | 'sfidato'), `nome` e, per chi accetta, `codice`.
// Le domande e le correzioni passano dal DataProvider (in produzione le risposte esatte non sono nel bundle).
import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, X } from 'lucide-react';
import { useExtra } from '../contesto';
import { useAccess } from '../../../access/context';
import type { PublicQuestion } from '../../../access/provider';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';
import { FONT } from '../../../brand/tokens';
import { IllustrazioneAnimata } from '../../../brand/IllustrazioneAnimata';
import { DOMANDE_SFIDA, SECONDI_SFIDA, scegliDomande, semeDelGiorno } from '../../../lib/sfide/seme';
import { decodificaSfida, pulisciNome } from '../../../lib/sfide/codice';
import { idVoce, type RuoloSfida, type TipoSfida, type VoceSfida } from '../../../lib/sfide/risultati';
import { useBancoSfide, useProfiloSfide, useStorico } from './dati';
import { correggi, preparaDomande, ricordaCorrezioni, type DomandeSfida } from './correzioni';
import { Bottone, Carta } from './comuni';

type Fase = 'carico' | 'pronto' | 'in-corso' | 'consegna' | 'errore-carico' | 'errore-consegna';

export default function SfidaGioco() {
  const { params, indietro, vai } = useExtra();
  const { provider } = useAccess();
  const { voci, aggiungi } = useStorico();
  const { profilo, imposta } = useProfiloSfide();
  const { banco, impronta } = useBancoSfide();

  const tipo: TipoSfida = params.tipo === 'duello' ? 'duello' : 'giorno';
  const ruolo: RuoloSfida = tipo === 'giorno' ? 'solo' : params.ruolo === 'sfidato' ? 'sfidato' : 'sfidante';
  const seme = tipo === 'giorno' ? semeDelGiorno() : (params.seme ?? '');
  const id = idVoce(tipo, seme, ruolo);
  const avversario = useMemo(() => (ruolo === 'sfidato' ? decodificaSfida(params.codice ?? '') : null), [ruolo, params.codice]);
  const nome = pulisciNome(params.nome ?? profilo.nome ?? '') || 'Giocatore';

  // Se questa sfida è già stata giocata (si torna indietro dal risultato) non si rigioca: si torna alla schermata precedente.
  const giaGiocata = useRef(voci.some(v => v.id === id));
  const saltato = useRef(false);
  useEffect(() => {
    if (giaGiocata.current && !saltato.current) { saltato.current = true; indietro(); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const erroreIniziale: string | null =
    tipo === 'duello' && !/^[a-z0-9-]{3,24}$/.test(seme) ? 'Il link di questa sfida non è valido.'
    : ruolo === 'sfidato' && (!avversario || avversario.seme !== seme) ? 'Il link di questa sfida non è valido o è stato modificato.'
    : ruolo === 'sfidato' && avversario && avversario.banco !== impronta ? 'Questa sfida è stata creata con una versione dell\'app con domande diverse: il confronto non sarebbe valido.'
    : null;

  const [fase, setFase] = useState<Fase>(giaGiocata.current || erroreIniziale ? 'errore-carico' : 'carico');
  const [errore, setErrore] = useState<string | null>(erroreIniziale);
  const [base, setBase] = useState<DomandeSfida | null>(null);
  const [risposte, setRisposte] = useState<Record<string, number>>({});
  const [indice, setIndice] = useState(0);
  const [restano, setRestano] = useState(SECONDI_SFIDA);
  const [conferma, setConferma] = useState<null | 'esci' | 'consegna'>(null);

  const vivo = useRef(true);
  const risposteRef = useRef<Record<string, number>>({});
  const scadenza = useRef(0);
  const inizio = useRef(0);
  const inviata = useRef(false);
  const secondiFinali = useRef(0);
  useEffect(() => { vivo.current = true; return () => { vivo.current = false; }; }, []);

  // ---- Preparazione delle domande
  const prepara = async () => {
    setFase('carico');
    setErrore(null);
    try {
      const ids = scegliDomande(banco, seme, DOMANDE_SFIDA);
      if (ids.length < DOMANDE_SFIDA) throw new Error('banco_corto');
      const b = await preparaDomande(provider, ids, seme);
      if (!vivo.current) return;
      setBase(b);
      setFase('pronto');
    } catch {
      if (!vivo.current) return;
      setErrore('Non riesco a preparare le domande. Controlla la connessione e riprova.');
      setFase('errore-carico');
    }
  };
  useEffect(() => {
    if (!giaGiocata.current && !erroreIniziale) void prepara();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const domande: PublicQuestion[] = base?.domande ?? [];

  // ---- Avvio e tempo (dalla scadenza, non contando i secondi: non si sfasa se la scheda va in secondo piano)
  const avvia = () => {
    const ora = Date.now();
    inizio.current = ora;
    scadenza.current = ora + SECONDI_SFIDA * 1000;
    risposteRef.current = {};
    inviata.current = false;
    setRisposte({});
    setIndice(0);
    setRestano(SECONDI_SFIDA);
    setFase('in-corso');
  };

  useEffect(() => {
    if (fase !== 'in-corso') return;
    const t = setInterval(() => {
      const left = Math.max(0, Math.ceil((scadenza.current - Date.now()) / 1000));
      setRestano(p => (p === left ? p : left));
      if (left === 0) void consegna();
    }, 250);
    return () => clearInterval(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fase]);

  // ---- Consegna: si corregge dal provider e si salva la partita
  const consegna = async () => {
    if (!base || inviata.current) return;
    inviata.current = true;
    if (!secondiFinali.current) secondiFinali.current = Math.min(SECONDI_SFIDA, Math.max(1, Math.round((Date.now() - inizio.current) / 1000)));
    setConferma(null);
    setFase('consegna');
    try {
      const { perQuestion, corrette } = await correggi(provider, base, risposteRef.current);
      if (!vivo.current) return;
      const voce: VoceSfida = {
        id, tipo, ruolo, seme, quando: Date.now(),
        ...(tipo === 'duello' ? { nome } : {}),
        corrette, totale: domande.length, secondi: secondiFinali.current,
        ids: domande.map(q => q.id),
        risposte: domande.map(q => (risposteRef.current[q.id] === undefined ? -1 : base.ordini[q.id][risposteRef.current[q.id]])),
        ...(avversario ? { avversario: { id: avversario.id, nome: avversario.nome, corrette: avversario.corrette, totale: avversario.totale, secondi: avversario.secondi } } : {}),
      };
      ricordaCorrezioni(id, { ...base, perQuestion, risposte: { ...risposteRef.current } });
      if (tipo === 'duello') imposta(nome);
      aggiungi(voce);
      vai('sfida-risultato', { voce: id });
    } catch {
      inviata.current = false;
      if (!vivo.current) return;
      setErrore('Non riesco a correggere. Le tue risposte sono ancora qui e il tempo è fermo: riprova.');
      setFase('errore-consegna');
    }
  };

  const scegli = (qid: string, i: number) => {
    if (fase !== 'in-corso') return;
    playTapSound();
    risposteRef.current = { ...risposteRef.current, [qid]: i };
    setRisposte(risposteRef.current);
  };

  const rimaste = domande.length - Object.keys(risposte).length;
  const titoloSfida = tipo === 'giorno' ? 'Sfida del giorno' : ruolo === 'sfidato' ? `Duello con ${avversario?.nome ?? ''}` : 'Duello';
  const cornice = 'h-full w-full bg-superficie text-testo sm:rounded-[28px] sm:border sm:border-linea overflow-hidden flex flex-col';

  // ================== Schermate di attesa e di errore ==================
  if (fase === 'carico' || fase === 'consegna') {
    return (
      <div className={cn(cornice, 'items-center justify-center gap-3 p-8 text-center')} style={{ fontFamily: FONT }} role="status">
        <IllustrazioneAnimata nome="attesa-caricamento" lato={110} />
        <p className="font-bold text-testo">{fase === 'carico' ? 'Preparo le domande…' : 'Consegno e correggo…'}</p>
      </div>
    );
  }
  if (fase === 'errore-carico' || fase === 'errore-consegna') {
    return (
      <div className={cn(cornice, 'items-center justify-center gap-4 p-8 text-center')} style={{ fontFamily: FONT }}>
        {giaGiocata.current ? (
          <p role="status" className="font-bold text-testo">Un momento…</p>
        ) : (
          <>
            <p role="alert" className="max-w-sm font-bold text-basso-testo">{errore}</p>
            <div className="flex w-full max-w-xs flex-col gap-2">
              {fase === 'errore-consegna' && <Bottone onClick={() => void consegna()}>Riprova a consegnare</Bottone>}
              {fase === 'errore-carico' && !erroreIniziale && <Bottone onClick={() => void prepara()}>Riprova</Bottone>}
              <Bottone variante="secondario" onClick={indietro}>Indietro</Bottone>
            </div>
          </>
        )}
      </div>
    );
  }

  // ================== Pronto? ==================
  if (fase === 'pronto') {
    return (
      <div className={cornice} style={{ fontFamily: FONT }}>
        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
          <div className="mx-auto w-full max-w-[440px] px-6 pt-[max(16px,env(safe-area-inset-top))] pb-8">
            <button type="button" onClick={() => { playTapSound(); indietro(); }} aria-label="Indietro" className="brand-premibile -ml-2 p-1 rounded-full text-testo-tenue hover:text-testo">
              <ChevronLeft size={26} strokeWidth={2.5} />
            </button>
            <div className="mt-1 flex flex-col items-center text-center">
              <IllustrazioneAnimata nome="quiz-test" lato={120} />
              <h1 className="mt-2 text-[28px] leading-[34px] font-extrabold tracking-[-0.02em] text-testo">{titoloSfida}</h1>
              <p className="mt-1 text-[14px] leading-[20px] text-testo-tenue">
                {tipo === 'giorno' ? 'Le stesse 10 domande per tutti, oggi.'
                  : ruolo === 'sfidato' ? `Giochi le stesse 10 domande di ${avversario?.nome}. Il suo risultato lo vedi alla fine.`
                  : 'Giochi 10 domande, poi mandi il link a un amico: gioca le stesse e vi confrontate.'}
              </p>
            </div>
            <Carta className="mt-5">
              <dl className="grid grid-cols-3 gap-2 text-center">
                <div><dt className="text-[12px] font-bold text-testo-tenue">Domande</dt><dd className="text-[20px] font-extrabold text-testo">{domande.length}</dd></div>
                <div><dt className="text-[12px] font-bold text-testo-tenue">Tempo</dt><dd className="text-[20px] font-extrabold text-testo">{SECONDI_SFIDA / 60} min</dd></div>
                <div><dt className="text-[12px] font-bold text-testo-tenue">Feedback</dt><dd className="text-[20px] font-extrabold text-testo">alla fine</dd></div>
              </dl>
            </Carta>
            <ul className="mt-4 flex list-disc flex-col gap-1.5 pl-5 text-[14px] leading-[20px] text-testo">
              <li>Puoi tornare sulle domande e cambiare risposta finché non consegni.</li>
              <li>Conta quante risposte giuste dai e in quanto tempo: a parità di risposte vince chi è più veloce.</li>
              <li>Nessun punto: il risultato è solo il tuo.</li>
            </ul>
            <div className="mt-6"><Bottone onClick={avvia}>Inizia</Bottone></div>
          </div>
        </div>
      </div>
    );
  }

  // ================== Prova in corso ==================
  const q = domande[indice];
  const m = Math.floor(restano / 60), s = restano % 60;
  const tempo = `${m}:${String(s).padStart(2, '0')}`;
  const dialogo = (
    <ConfirmDialog
      open={conferma !== null}
      title={conferma === 'esci' ? 'Uscire dalla sfida?' : 'Consegnare adesso?'}
      message={conferma === 'esci'
        ? 'La partita non viene salvata. Potrai rigiocarla da capo.'
        : `Hai ancora ${rimaste} ${rimaste === 1 ? 'domanda' : 'domande'} senza risposta. Dopo la consegna non si torna indietro.`}
      confirmLabel={conferma === 'esci' ? 'Esci' : 'Consegna'}
      cancelLabel={conferma === 'esci' ? 'Resta' : 'Continua'}
      danger={conferma === 'esci'}
      onCancel={() => setConferma(null)}
      onConfirm={() => { const c = conferma; setConferma(null); if (c === 'esci') indietro(); else void consegna(); }}
    />
  );
  return (
    <div className={cornice} style={{ fontFamily: FONT }}>
      <header className="flex flex-col gap-2 p-3 sm:p-4 border-b border-linea shrink-0">
        <div className="flex items-center justify-between">
          <button type="button" onClick={() => { if (Object.keys(risposte).length > 0) setConferma('esci'); else indietro(); }}
            aria-label="Esci dalla sfida" className="p-1 sm:p-2 text-testo-tenue hover:text-testo hover:bg-linea rounded-full transition-colors duration-100">
            <X size={20} strokeWidth={3} />
          </button>
          <div role="timer" aria-label="Tempo rimasto" className={cn('font-bold tabular-nums text-base sm:text-xl flex items-center gap-1.5', restano < 60 ? 'text-basso-testo' : 'text-testo')}>
            <Clock size={18} strokeWidth={3} aria-hidden /> {tempo}
          </div>
          <button type="button" onClick={() => (rimaste > 0 ? setConferma('consegna') : void consegna())}
            className="text-[12px] font-bold text-azione hover:bg-azione-tinta border border-azione/60 px-4 py-2 rounded-xl transition-colors duration-100">
            Consegna
          </button>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[11px] font-bold text-testo-tenue w-9 text-right tabular-nums">{domande.length - rimaste}/{domande.length}</span>
          <div className="flex-1 bg-tacca h-3 rounded-full overflow-hidden">
            <div className="bg-azione h-full rounded-full transition-colors duration-100" style={{ width: `${((domande.length - rimaste) / domande.length) * 100}%` }} />
          </div>
        </div>
      </header>

      <main className="flex-1 min-h-0 p-4 sm:p-8 flex flex-col w-full overflow-y-auto scrollbar-hide">
        <div className="mb-4 flex items-center justify-between gap-2">
          <span className="text-xs sm:text-sm font-semibold text-testo-tenue">Domanda {indice + 1} di {domande.length}</span>
          <span className="text-xs font-bold text-testo-tenue">{titoloSfida}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-testo mb-5 leading-snug">{q.prompt}</h2>
        <div className="grid grid-cols-1 gap-2.5 content-start">
          {q.options.map((opt, i) => {
            const on = risposte[q.id] === i;
            return (
              <button key={i} type="button" onClick={() => scegli(q.id, i)} aria-pressed={on}
                className={cn('p-3 text-left border rounded-2xl transition-colors duration-100 flex items-center min-h-[56px]',
                  on ? 'bg-azione-tinta border-azione text-testo' : 'border-linea bg-superficie-2 hover:bg-linea hover:border-tacca text-testo')}>
                <span className="flex items-center gap-4 w-full">
                  <span className={cn('w-8 h-8 text-sm flex shrink-0 items-center justify-center border rounded-full font-bold transition-colors duration-100',
                    on ? 'border-azione bg-azione text-azione-su' : 'border-linea text-testo bg-superficie')}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-[15px] sm:text-base font-semibold leading-snug flex-1">{opt}</span>
                </span>
              </button>
            );
          })}
        </div>
      </main>

      <div className="p-3 sm:p-4 border-t border-linea bg-superficie shrink-0 flex items-center min-h-[70px]">
        <div className="w-full flex justify-between items-center gap-2 px-1">
          <button type="button" onClick={() => setIndice(i => Math.max(0, i - 1))} disabled={indice === 0} aria-label="Domanda precedente"
            className="p-2 text-testo-tenue disabled:opacity-30 rounded-xl hover:bg-linea transition-colors duration-100"><ChevronLeft size={26} strokeWidth={3} /></button>
          <div className="flex flex-1 max-w-[220px] gap-1 items-center justify-center">
            {domande.map((d, i) => (
              <button key={d.id} type="button" onClick={() => setIndice(i)} aria-label={`Vai alla domanda ${i + 1}`} aria-current={i === indice ? 'step' : undefined}
                className={cn('h-2 min-w-[8px] flex-1 rounded-full transition-colors duration-100',
                  i === indice ? 'bg-testo h-3' : risposte[d.id] !== undefined ? 'bg-azione' : 'bg-tacca')} />
            ))}
          </div>
          {indice < domande.length - 1 ? (
            <button type="button" onClick={() => setIndice(i => Math.min(domande.length - 1, i + 1))} aria-label="Domanda successiva"
              className="p-2 text-testo-tenue rounded-xl hover:bg-linea transition-colors duration-100"><ChevronRight size={26} strokeWidth={3} /></button>
          ) : (
            <button type="button" onClick={() => (rimaste > 0 ? setConferma('consegna') : void consegna())} aria-label="Consegna"
              className="rounded-xl bg-azione px-4 py-2 text-[13px] font-bold text-azione-su hover:bg-azione-scuro transition-colors duration-100">Consegna</button>
          )}
        </div>
      </div>
      {dialogo}
    </div>
  );
}

