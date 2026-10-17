// `sfida-gioco`: 10 domande a tempo (5 minuti), senza feedback fino alla consegna, come la simulazione ma più breve.
// Parametri: `tipo` ('giorno' | 'duello'), `seme`; per il duello anche `ruolo` ('sfidante' | 'sfidato'), `nome` e, per chi accetta, `codice`.
// Le domande e le correzioni passano dal provider locale (le domande stanno nel sito, tutto gira nel browser).
import { useEffect, useMemo, useRef, useState } from 'react';
import { Icona } from '../../../brand/icone/Icona';
import { Illustrazione } from '../../../brand/Illustrazione';
import { FoglioInfo, PulsanteInfo } from '../ui';
import { useExtra } from '../contesto';
import { provider } from '../../../access';
import type { PublicQuestion } from '../../../access/provider';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';
import { FONT } from '../../../brand/tokens';
import { DOMANDE_SFIDA, SECONDI_SFIDA, scegliDomande, semeDelGiorno } from '../../../lib/sfide/seme';
import { decodificaSfida, pulisciNome } from '../../../lib/sfide/codice';
import { idVoce, type RuoloSfida, type TipoSfida, type VoceSfida } from '../../../lib/sfide/risultati';
import { useBancoSfide, useProfiloSfide, useStorico } from './dati';
import { correggi, preparaDomande, ricordaCorrezioni, type DomandeSfida } from './correzioni';
import { Bottone, DatiSfida } from './comuni';
import { Regole } from './scheda';

type Fase = 'carico' | 'pronto' | 'in-corso' | 'consegna' | 'errore-carico' | 'errore-consegna';

export default function SfidaGioco() {
  const { params, indietro, vai } = useExtra();
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
    tipo === 'duello' && !/^[a-z0-9-]{3,24}$/.test(seme) ? 'Link non valido.'
    : ruolo === 'sfidato' && (!avversario || avversario.seme !== seme) ? 'Link non valido o modificato.'
    : ruolo === 'sfidato' && avversario && avversario.banco !== impronta ? 'Versione diversa: confronto non valido.'
    : null;

  const [fase, setFase] = useState<Fase>(giaGiocata.current || erroreIniziale ? 'errore-carico' : 'carico');
  const [errore, setErrore] = useState<string | null>(erroreIniziale);
  const [base, setBase] = useState<DomandeSfida | null>(null);
  const [risposte, setRisposte] = useState<Record<string, number>>({});
  const [indice, setIndice] = useState(0);
  const [restano, setRestano] = useState(SECONDI_SFIDA);
  const [conferma, setConferma] = useState<null | 'esci' | 'consegna'>(null);
  const [info, setInfo] = useState(false);

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
      setErrore('Domande non pronte. Riprova.');
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
      setErrore('Consegna non riuscita. Riprova.');
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
  const cornice = 'relative h-full w-full bg-superficie text-testo sm:rounded-[28px] sm:border sm:border-linea overflow-hidden flex flex-col';

  // ================== Schermate di attesa e di errore ==================
  if (fase === 'carico' || fase === 'consegna') {
    return (
      <div className={cn(cornice, 'items-center justify-center gap-3 p-8 text-center')} style={{ fontFamily: FONT }} role="status">
        <Illustrazione nome="attesa-caricamento" lato={110} />
        <p className="font-bold text-testo">{fase === 'carico' ? 'Preparo le domande…' : 'Consegno e correggo…'}</p>
      </div>
    );
  }
  if (fase === 'errore-carico' || fase === 'errore-consegna') {
    return (
      <div className={cn(cornice, 'items-center justify-center gap-4 p-8 text-center')} style={{ fontFamily: FONT }}>
        {giaGiocata.current ? (
          <Icona nome="stato-caricamento" size={28} className="animate-spin text-testo-tenue" />
        ) : (
          <>
            <Illustrazione nome="documento-errore" lato={104} />
            <p role="alert" className="max-w-sm text-[15px] leading-[22px] font-bold text-testo">{errore}</p>
            <div className="flex w-full max-w-xs gap-2">
              {fase === 'errore-consegna' && <Bottone icona="riprova" aria="Riprova a consegnare" onClick={() => void consegna()} />}
              {fase === 'errore-carico' && !erroreIniziale && <Bottone icona="riprova" aria="Riprova" onClick={() => void prepara()} />}
              <Bottone variante="secondario" icona="indietro" aria="Indietro" className={erroreIniziale ? '' : 'w-16 shrink-0 px-0'} onClick={indietro} />
            </div>
          </>
        )}
      </div>
    );
  }

  // ================== Pronto? ==================
  if (fase === 'pronto') {
    const regole = (
      <Regole righe={[
        tipo === 'giorno' ? 'Le stesse domande per tutti, oggi.'
          : ruolo === 'sfidato' ? `Giochi le stesse domande di ${avversario?.nome}: il suo risultato lo vedi alla fine.`
          : 'Giochi, poi mandi il link a un amico: gioca le stesse domande e vi confrontate.',
        'Puoi tornare sulle domande e cambiare risposta finché non consegni.',
        'Le correzioni arrivano alla consegna.',
        'Conta quante risposte giuste dai e in quanto tempo: a parità di risposte vince chi è più veloce.',
      ]} />
    );
    return (
      <div className={cornice} style={{ fontFamily: FONT }}>
        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
          <div className="mx-auto w-full max-w-[440px] px-6 pt-[max(16px,env(safe-area-inset-top))] pb-8">
            <div className="flex items-center justify-between">
              <button type="button" onClick={() => { playTapSound(); indietro(); }} aria-label="Indietro" className="brand-premibile -ml-2 grid h-10 w-10 place-items-center rounded-full text-testo-tenue hover:text-testo">
                <Icona nome="indietro" size={28} />
              </button>
              <PulsanteInfo onClick={() => setInfo(true)} etichetta="Regole" />
            </div>
            <div className="mt-1 flex flex-col items-center text-center">
              <Illustrazione nome="quiz-test" lato={120} />
              <h1 className="mt-2 text-[28px] leading-[34px] font-extrabold tracking-[-0.02em] text-testo">{titoloSfida}</h1>
            </div>
            <DatiSfida domande={domande.length} minuti={SECONDI_SFIDA / 60} className="mt-5 justify-center" />
            <div className="mt-6"><Bottone icona="studia" onClick={avvia}>Inizia</Bottone></div>
          </div>
        </div>
        <FoglioInfo aperto={info} onChiudi={() => setInfo(false)} titolo="Regole">{regole}</FoglioInfo>
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
            <Icona nome="chiudi" size={22} />
          </button>
          <div role="timer" aria-label="Tempo rimasto" className={cn('rounded-full px-3 py-1 font-bold tabular-nums text-base sm:text-xl flex items-center gap-1.5', restano < 60 ? 'bg-basso-tinta text-basso-testo' : 'bg-medio-tinta text-medio-testo')}>
            <Icona nome="tempo" size={18} /> {tempo}
          </div>
          {indice < domande.length - 1 ? (
            <button type="button" onClick={() => (rimaste > 0 ? setConferma('consegna') : void consegna())}
              className="text-[12px] font-bold text-azione-testo hover:bg-azione-tinta border border-azione/60 px-4 py-2 rounded-xl transition-colors duration-100">
              Consegna
            </button>
          ) : <span className="w-[84px]" aria-hidden />}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[12px] font-bold text-testo-tenue w-10 text-right tabular-nums">{indice + 1}/{domande.length}</span>
          <div className="flex-1 bg-tacca h-3 rounded-full overflow-hidden">
            <div className="bg-azione h-full rounded-full" style={{ width: `${((indice + 1) / domande.length) * 100}%` }} />
          </div>
        </div>
      </header>

      <main className="flex-1 min-h-0 p-4 sm:p-8 flex flex-col w-full overflow-y-auto scrollbar-hide">
        <div className="mb-4 flex items-center justify-between gap-2">
          <span role="img" aria-label={tipo === 'giorno' ? 'Sfida del giorno' : titoloSfida}
            className={cn('grid h-8 w-8 place-items-center rounded-full', tipo === 'giorno' ? 'bg-alto-tinta text-alto-numero' : 'bg-basso-tinta text-basso-numero')}>
            <Icona nome={tipo === 'giorno' ? 'sfida-giorno' : 'sfide'} size={17} />
          </span>
          <span role="img" aria-label={rimaste === 0 ? 'Hai risposto a tutte' : `${rimaste} senza risposta`}
            className={cn('inline-flex items-center gap-1 text-[15px] font-extrabold tabular-nums', rimaste === 0 ? 'text-alto-testo' : 'text-medio-testo')}>
            <Icona nome={rimaste === 0 ? 'stato-risposta-giusta' : 'stato-risposta-omessa'} size={16} />{rimaste}
          </span>
        </div>
        <h2 data-testo-ok className="text-xl sm:text-2xl font-bold text-testo mb-5 leading-snug">{q.prompt}</h2>
        <div data-testo-ok className="grid grid-cols-1 gap-2.5 content-start">
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
            className="p-2 text-testo-tenue disabled:opacity-30 rounded-xl hover:bg-linea transition-colors duration-100"><Icona nome="indietro" size={28} /></button>
          <div className="flex flex-1 max-w-[220px] gap-1 items-center justify-center">
            {domande.map((d, i) => (
              <button key={d.id} type="button" onClick={() => setIndice(i)} aria-label={`Vai alla domanda ${i + 1}`} aria-current={i === indice ? 'step' : undefined}
                className={cn('h-2 min-w-[8px] flex-1 rounded-full transition-colors duration-100',
                  i === indice ? 'bg-testo h-3' : risposte[d.id] !== undefined ? 'bg-azione' : 'bg-tacca')} />
            ))}
          </div>
          {indice < domande.length - 1 ? (
            <button type="button" onClick={() => setIndice(i => Math.min(domande.length - 1, i + 1))} aria-label="Domanda successiva"
              className="p-2 text-testo-tenue rounded-xl hover:bg-linea transition-colors duration-100"><Icona nome="avanti" size={28} /></button>
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

