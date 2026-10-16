import { useMemo, useState } from 'react';
import { AppState } from '../types';
import { Icona } from '../brand/icone/Icona';
import { playTapSound } from '../lib/audio';
import { FONT } from '../brand/tokens';
import Marchio from '../brand/Marchio';
import Navigazione, { Scheda } from './Navigazione';
import Cta from './home/Cta';
import FoglioStima from './FoglioStima';
import { StimaSezione, BannerStato, chiaveBanner } from './home/Stima';
import GraficoStime from './home/GraficoStime';
import Lezioni from './home/Lezione';
import Simulazione from './home/Simulazione';
import { calcolaStima, livelloDi, serieStime } from './home/stima';
import { lezioniPercorso } from '../lib/studio/percorso';
import { elencoSimulazioni } from '../lib/studio/simulazioni';

interface MenuProps {
  appState: AppState;
  onStartSmart: () => void;
  onOpenTheory: () => void;
  /** Apre la scheda di teoria di un argomento (id di TheoryTopic). Usato solo se manca onApriLezione. */
  onOpenTheoryTopic?: (id: string) => void;
  /** Apre la schermata `lezione-dettaglio` dell'argomento (id di TheoryTopic): `vaiExtra('lezione-dettaglio', { id })`. */
  onApriLezione?: (id: string) => void;
  onOpenDiagnostic?: () => void;
  /** Icona profilo in alto a destra. */
  onOpenImpostazioni?: () => void;
  onNaviga?: (s: Scheda) => void;
  /** ▶ della carta «Simulazione» (avvia la simulazione di 30 domande). Senza, la carta non ha il ▶. */
  onStartExam?: () => void;
  /**
   * Apre una schermata extra: «Tutte» delle Lezioni → `onApriExtra('percorso')`, «Tutte» della Simulazione → `onApriExtra('simulazioni')`,
   * e il tocco sull'ultimo risultato → `onApriExtra('simulazione-dettaglio', { id })`. Senza, i «Tutte» non compaiono.
   * Stessa firma di `vaiExtra` in App.tsx.
   */
  onApriExtra?: (id: string, params?: Record<string, string>) => void;
}

/**
 * Home «completa»: stato e prossime azioni. Intestazione (marchio e profilo), misuratore con la «i», fascia di stato,
 * un solo pulsante ▶, le prossime tre lezioni, l'ultima simulazione, l'andamento della probabilità, barra a tre voci.
 * Strumenti, frasi e prontuario stanno in Esercizi (docs/design/ARCHITETTURA.md). Concept 14, 01, 03, 11, 21, 33, 39.
 */
export default function Menu({ appState, onStartSmart, onOpenTheory, onOpenTheoryTopic, onApriLezione, onOpenDiagnostic, onOpenImpostazioni, onNaviga, onStartExam, onApriExtra }: MenuProps) {
  const [foglio, setFoglio] = useState(false);

  // Tutti i numeri vengono da qui: stima, serie misurata, lezioni del percorso, ultima simulazione
  const dati = useMemo(() => ({
    stima: calcolaStima(appState),
    punti: serieStime(appState),
    prossime: lezioniPercorso(appState).filter(l => l.stato !== 'imparata').slice(0, 3),
    ultima: elencoSimulazioni(appState.history)[0] ?? null,
  }), [appState]);
  const { stima, punti, prossime, ultima } = dati;
  const livello = stima ? livelloDi(stima.p) : 'basso';

  const apriLezione = (id: string) => {
    if (onApriLezione) onApriLezione(id);
    else if (onOpenTheoryTopic) onOpenTheoryTopic(id);
    else onOpenTheory();
  };

  // Un solo pulsante: chi non ha mai fatto il diagnostico vede «Diagnostico», tutti gli altri «Continua» (sessione intelligente)
  const cta = !stima && onOpenDiagnostic
    ? { etichetta: 'Diagnostico', azione: onOpenDiagnostic }
    : { etichetta: 'Continua', azione: onStartSmart };
  const chiave = chiaveBanner(stima, livello);

  return (
    <div className="h-full w-full bg-superficie text-testo sm:rounded-[28px] sm:border sm:border-linea overflow-hidden flex flex-col" style={{ fontFamily: FONT }}>
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
        <div className="mx-auto w-full max-w-[440px] px-6 pt-[max(16px,env(safe-area-inset-top))] corto:pt-[max(10px,env(safe-area-inset-top))] pb-4">
          {/* intestazione: marchio testuale a sinistra, il profilo a destra */}
          <header className="flex items-center justify-between h-9">
            <Marchio disposizione="orizzontale" altezza={34} />
            {onOpenImpostazioni && (
              <button type="button" onClick={() => { playTapSound(); onOpenImpostazioni(); }} aria-label="Profilo"
                className="brand-premibile w-9 h-9 rounded-full bg-superficie-2 text-testo grid place-items-center">
                <Icona nome="profilo" size={22} />
              </button>
            )}
          </header>

          {/* misuratore a tutta larghezza (senza stima: arco vuoto e nessun numero) */}
          <div className="-mx-6 mt-[20px] corto:mt-[10px]">
            <div className="mx-auto corto:max-w-[340px]">
              <StimaSezione stima={stima} livello={livello} onInfo={stima ? () => setFoglio(true) : undefined} />
            </div>
          </div>

          <div className="mt-[14px] corto:mt-[8px]"><BannerStato chiave={chiave} /></div>
          <div className="mt-[9px]"><Cta onClick={cta.azione}>{cta.etichetta}</Cta></div>

          {/* Lezioni: le prossime tre del percorso */}
          <div className="mt-[24px] corto:mt-[18px]">
            <Lezioni lezioni={prossime} onApri={apriLezione} onTutte={onApriExtra ? () => onApriExtra('percorso') : undefined} />
          </div>

          {/* Simulazione: ultimo risultato e ▶ */}
          <div className="mt-[24px] corto:mt-[18px]">
            <Simulazione ultima={ultima} onInizia={onStartExam}
              onApriUltima={onApriExtra && ultima ? () => onApriExtra('simulazione-dettaglio', { id: ultima.id }) : undefined}
              onTutte={onApriExtra ? () => onApriExtra('simulazioni') : undefined} />
          </div>

          {/* Andamento: solo punti misurati (diagnostico e simulazioni) */}
          <div className="mt-[24px] corto:mt-[18px]">
            <GraficoStime punti={punti} onInfo={stima ? () => setFoglio(true) : undefined} />
          </div>
        </div>
      </div>
      {stima && <FoglioStima aperto={foglio} onChiudi={() => setFoglio(false)} tipo={stima.fonte === 'diagnostico' ? 'diagnostico' : 'simulazione'} risposte={stima.risposte} />}
      {onNaviga && <Navigazione attiva="home" onVai={onNaviga} />}
    </div>
  );
}
