import { useMemo, useState } from 'react';
import { AppState } from '../types';
import { Icona } from '../brand/icone/Icona';
import { questions } from '../data/questions';
import { playTapSound } from '../lib/audio';
import { FONT } from '../brand/tokens';
import Marchio from '../brand/Marchio';
import Navigazione, { Scheda } from './Navigazione';
import Cta from './home/Cta';
import FoglioStima from './FoglioStima';
import { StimaSezione, BannerStato, chiaveBanner } from './home/Stima';
import GraficoStime from './home/GraficoStime';
import ProssimoObiettivo from './home/Lezione';
import { calcolaFattori, calcolaStima, lezioneConsigliata, livelloDi, progressoArgomento, serieStime } from './home/stima';

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
}

/**
 * Home: stato e prossima azione, e niente altro. Intestazione (marchio e profilo), misuratore con la «i», fascia di stato,
 * un solo pulsante ▶, la prossima lezione, l'andamento della probabilità, barra a tre voci.
 * Strumenti, statistiche e simulazioni stanno nelle altre destinazioni (docs/design/ARCHITETTURA.md).
 */
export default function Menu({ appState, onStartSmart, onOpenTheory, onOpenTheoryTopic, onApriLezione, onOpenDiagnostic, onOpenImpostazioni, onNaviga }: MenuProps) {
  const [foglio, setFoglio] = useState(false);

  // Tutti i numeri vengono da qui: stima, serie misurata, argomento da studiare
  const dati = useMemo(() => ({
    stima: calcolaStima(appState),
    risposte: calcolaFattori(appState).risposteTotali,
    lezione: lezioneConsigliata(appState),
    punti: serieStime(appState),
  }), [appState]);
  const { stima, lezione, punti } = dati;
  const livello = stima ? livelloDi(stima.p) : 'basso';
  const progresso = useMemo(
    () => (lezione ? progressoArgomento(appState, lezione.topic.id, new Set(questions.map(q => q.id))) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [appState, lezione],
  );

  const apriLezione = () => {
    if (!lezione) return;
    if (onApriLezione) onApriLezione(lezione.topic.id);
    else if (onOpenTheoryTopic) onOpenTheoryTopic(lezione.topic.id);
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

          {/* prossima lezione: argomento più debole, o la prima scheda */}
          {lezione && progresso && (
            <div className="mt-[24px] corto:mt-[18px]">
              <ProssimoObiettivo lezione={lezione} progresso={progresso} onApri={apriLezione} />
            </div>
          )}

          {/* andamento: solo punti misurati (diagnostico e simulazioni) */}
          {punti.length > 0 && (
            <div className="mt-[24px] corto:mt-[14px]">
              <GraficoStime punti={punti} />
            </div>
          )}
        </div>
      </div>
      {stima && <FoglioStima aperto={foglio} onChiudi={() => setFoglio(false)} tipo={stima.fonte === 'diagnostico' ? 'diagnostico' : 'simulazione'} risposte={stima.risposte} />}
      {onNaviga && <Navigazione attiva="home" onVai={onNaviga} />}
    </div>
  );
}
