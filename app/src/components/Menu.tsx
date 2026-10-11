import { useMemo, useState } from 'react';
import { AppState, CorpusType, PaywallReason } from '../types';
import { User } from 'lucide-react';
import { getQuestionsByCorpus } from '../data/questions';
import { useAccess } from '../access/context';
import { remainingFreeSims } from '../access/entitlement';
import { playTapSound } from '../lib/audio';
import { FONT } from '../brand/tokens';
import Marchio from '../brand/Marchio';
import Navigazione, { Scheda } from './Navigazione';
import Cta from './home/Cta';
import FoglioStima from './FoglioStima';
import { StimaSezione, BannerStato, chiaveBanner } from './home/Stima';
import GraficoStime from './home/GraficoStime';
import ProssimoObiettivo from './home/Lezione';
import { TrendingUp } from 'lucide-react';
import { calcolaFattori, calcolaStima, lezioneConsigliata, livelloDi, progressoArgomento, serieStime } from './home/stima';

interface MenuProps {
  appState: AppState;
  /** Corpus in uso (nella parte gratuita è sempre il nucleo). */
  corpus?: CorpusType;
  onStartSmart: () => void;
  onStartExam: () => void;
  onNeedPass: (reason: PaywallReason) => void;
  onOpenTheory: () => void;
  /** Apre la scheda di teoria di un argomento (id di TheoryTopic). Assente = si apre l'elenco con onOpenTheory. */
  onOpenTheoryTopic?: (id: string) => void;
  onOpenDiagnostic?: () => void;
  /** Icona profilo in alto a destra. */
  onOpenImpostazioni?: () => void;
  onNaviga?: (s: Scheda) => void;
}

/**
 * Home: la schermata del concept 14 e niente altro. Intestazione (marchio e profilo), misuratore, banner di stato,
 * pulsante principale, prossimo obiettivo, grafico delle stime misurate, barra a tre voci.
 * Tutto il resto (teoria, esercizi, progressi, impostazioni) sta in Lezioni e in Impostazioni.
 */
export default function Menu({ appState, corpus, onStartSmart, onStartExam, onNeedPass, onOpenTheory, onOpenTheoryTopic, onOpenDiagnostic, onOpenImpostazioni, onNaviga }: MenuProps) {
  const { pass, entitlement, simsDone } = useAccess();
  const [foglio, setFoglio] = useState(false);

  const simBloccata = !pass && remainingFreeSims(entitlement, simsDone) === 0;
  const selectedCorpus: CorpusType = corpus ?? appState.selectedCorpus ?? 'all';
  const activeQuestions = getQuestionsByCorpus(selectedCorpus);

  // Tutti i numeri vengono da qui: stima, serie misurata, argomento da studiare
  const dati = useMemo(() => ({
    stima: calcolaStima(appState),
    risposte: calcolaFattori(appState).risposteTotali,
    lezione: lezioneConsigliata(appState, pass),
    punti: serieStime(appState),
  }), [appState, pass]);
  const { stima, risposte, lezione, punti } = dati;
  const livello = stima ? livelloDi(stima.p) : 'basso';
  const progresso = useMemo(
    () => (lezione ? progressoArgomento(appState, lezione.topic.id, new Set(activeQuestions.map(q => q.id))) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [appState, lezione, selectedCorpus],
  );

  const faiSimulazione = () => (simBloccata ? onNeedPass('simulazione') : onStartExam());
  const apriLezione = () => {
    if (!lezione) return;
    if (lezione.bloccata) onNeedPass('teoria');
    else if (onOpenTheoryTopic) onOpenTheoryTopic(lezione.topic.id);
    else onOpenTheory();
  };

  // Il pulsante principale cambia con la fascia: diagnostico, inizia, continua, mettiti alla prova
  const cta = !stima
    ? (onOpenDiagnostic
      ? { etichetta: 'Fai il diagnostico gratuito', azione: onOpenDiagnostic }
      : { etichetta: 'Inizia a studiare', azione: onStartSmart })
    : livello === 'alto' && !simBloccata
      ? { etichetta: 'Fai una simulazione', azione: onStartExam }
      : { etichetta: livello === 'basso' && risposte < 30 ? 'Inizia a studiare' : 'Continua a studiare', azione: onStartSmart };
  const chiave = chiaveBanner(stima, livello);
  const azioneBanner = !stima ? cta.azione : livello === 'alto' && !simBloccata ? onStartExam : onStartSmart;

  return (
    <div className="h-full w-full bg-superficie text-testo sm:rounded-[28px] sm:border sm:border-linea overflow-hidden flex flex-col" style={{ fontFamily: FONT }}>
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
        <div className="mx-auto w-full max-w-[440px] px-6 pt-[max(16px,env(safe-area-inset-top))] corto:pt-[max(10px,env(safe-area-inset-top))] pb-4">
          {/* intestazione: marchio testuale a sinistra, una sola icona tonda a destra */}
          <header className="flex items-center justify-between h-9">
            <Marchio disposizione="orizzontale" altezza={34} />
            {onOpenImpostazioni && (
              <button type="button" onClick={() => { playTapSound(); onOpenImpostazioni(); }} aria-label="Impostazioni e profilo"
                className="brand-premibile w-9 h-9 rounded-full bg-superficie-2 text-testo grid place-items-center">
                <User size={20} strokeWidth={1.8} aria-hidden="true" />
              </button>
            )}
          </header>

          {/* misuratore a tutta larghezza (senza stima: arco vuoto e nessun numero) */}
          <div className="-mx-6 mt-[20px] corto:mt-[10px]">
            <div className="mx-auto corto:max-w-[340px]">
              <StimaSezione stima={stima} livello={livello} onInfo={stima ? () => setFoglio(true) : undefined} />
            </div>
          </div>

          <div className="mt-[14px] corto:mt-[8px]"><BannerStato chiave={chiave} onClick={azioneBanner} /></div>
          <div className="mt-[9px]"><Cta onClick={cta.azione}>{cta.etichetta}</Cta></div>

          {/* prossimo obiettivo: argomento più debole, o la prima scheda gratuita */}
          {lezione && progresso && (
            <div className="mt-[26px] corto:mt-[18px]">
              <ProssimoObiettivo lezione={lezione} progresso={progresso} onApri={apriLezione} onPercorso={onOpenTheory} />
            </div>
          )}

          {/* solo punti misurati: diagnostico e simulazioni */}
          <div className="mt-[20px] corto:mt-[14px]">
            {punti.length > 0
              ? <GraficoStime punti={punti} onSimulazione={faiSimulazione} onInfo={() => setFoglio(true)} />
              : (
                <div className="flex items-center gap-3 rounded-[12px] bg-superficie-2 px-4 py-[14px] text-[13.5px] text-testo-tenue">
                  <TrendingUp size={20} className="shrink-0 text-azione" aria-hidden="true" />
                  Qui vedrai come cambia la tua probabilità
                </div>
              )}
          </div>
        </div>
      </div>
      {stima && <FoglioStima aperto={foglio} onChiudi={() => setFoglio(false)} tipo={stima.fonte === 'diagnostico' ? 'diagnostico' : 'simulazione'} risposte={stima.risposte} />}
      {onNaviga && <Navigazione attiva="home" onVai={onNaviga} />}
    </div>
  );
}
