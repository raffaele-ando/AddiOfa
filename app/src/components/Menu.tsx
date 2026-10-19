import { useEffect, useMemo, useState } from 'react';
import { AppState } from '../types';
import { Icona } from '../brand/icone/Icona';
import { playTapSound } from '../lib/audio';
import { FONT } from '../brand/tokens';
import Marchio from '../brand/Marchio';
import Navigazione, { Scheda } from './Navigazione';
import Cta from './home/Cta';
import FoglioStima from './FoglioStima';
import { StimaSezione, BannerStato } from './home/Stima';
import GraficoStime from './home/GraficoStime';
import Lezioni from './home/Lezione';
import Aree from './home/Aree';
import Simulazione from './home/Simulazione';
import { calcolaFattori, calcolaStima, livelloDi, serieStime } from './home/stima';
import { chiaveBanner, ctaPrincipale, rigaSaluto, variazioneDaPrima } from './home/stato';
import { lezioniPercorso } from '../lib/studio/percorso';
import { elencoSimulazioni } from '../lib/studio/simulazioni';
import { leggiProgetto } from '../lib/progetto/profilo';
import { cn } from '../lib/utils';
import { useColonnaLarga } from './Layout';

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
  /**
   * Tocco su una riga di «Le tue aree»: avvia l'allenamento su quell'area (filtro di selectPracticeIds: «category:Grammatica», «level:A1»).
   * In App.tsx: `setLearnMode('category'); setLearnCategory(filtro); setView('learn')`. Senza, le righe non sono toccabili.
   */
  onAllenaArea?: (filtro: string) => void;
}

/** Vero da `px` di larghezza in su (la Home mette la Simulazione in un posto diverso sul desktop; si disegna una volta sola). */
function usePiuLargoDi(px: number): boolean {
  const q = `(min-width: ${px}px)`;
  const [vero, setVero] = useState(() => typeof window !== 'undefined' && !!window.matchMedia?.(q).matches);
  useEffect(() => {
    if (!window.matchMedia) return;
    const m = window.matchMedia(q);
    const aggiorna = () => setVero(m.matches);
    aggiorna();
    m.addEventListener('change', aggiorna);
    return () => m.removeEventListener('change', aggiorna);
  }, [q]);
  return vero;
}

const SCHEDE_DESKTOP: { id: Scheda; nome: string; icona: 'home' | 'esercizi' | 'sfide' }[] = [
  { id: 'home', nome: 'Home', icona: 'home' },
  { id: 'esercizi', nome: 'Esercizi', icona: 'esercizi' },
  { id: 'sfide', nome: 'Sfide', icona: 'sfide' },
];

/**
 * Home «completa»: stato e prossime azioni (concept 14, 01, 33, 21, 03; revisione 18/10). Dall'alto: intestazione (marchio e profilo), saluto con nome (solo se
 * il nome esiste e lo schermo è alto), misuratore con la «i», fascia di stato (glifo, titolo, riga), un solo pulsante che dice cosa fa, prossima lezione,
 * le tue aree (dalla più debole), ultima simulazione, andamento, barra a tre voci.
 * Da 1024 px (colonna da 960 px del guscio, `useColonnaLarga`): due colonne (a sinistra misuratore, fascia, pulsante e simulazione, fissi; a destra lezione, aree, andamento) e navigazione in alto.
 * Strumenti, frasi e prontuario stanno in Esercizi (docs/design/ARCHITETTURA.md).
 */
export default function Menu({ appState, onStartSmart, onOpenTheory, onOpenTheoryTopic, onApriLezione, onOpenDiagnostic, onOpenImpostazioni, onNaviga, onStartExam, onApriExtra, onAllenaArea }: MenuProps) {
  const [foglio, setFoglio] = useState(false);
  useColonnaLarga(); // da 1024 px la colonna del guscio passa a 960 px: due colonne
  const largo = usePiuLargoDi(1024);

  // Tutti i numeri vengono da qui (la stessa fonte delle altre schermate): stima, serie misurata, aree, lezioni del percorso, ultima simulazione
  const dati = useMemo(() => ({
    stima: calcolaStima(appState),
    tutti: serieStime(appState, 0),
    fattori: calcolaFattori(appState),
    prossime: lezioniPercorso(appState).filter(l => l.stato !== 'imparata').slice(0, 3),
    ultima: elencoSimulazioni(appState.history)[0] ?? null,
    nome: leggiProgetto(appState).profilo?.nome ?? '',
  }), [appState]);
  const { stima, tutti, fattori, prossime, ultima, nome } = dati;
  const punti = tutti.slice(-5);
  const livello = stima ? livelloDi(stima.p) : 'basso';
  const chiave = chiaveBanner(stima, livello);
  const areeConDati = [...fattori.categorie, ...fattori.livelli].some(f => f.percento !== null);
  const variazione = variazioneDaPrima(tutti);

  const apriLezione = (id: string) => {
    if (onApriLezione) onApriLezione(id);
    else if (onOpenTheoryTopic) onOpenTheoryTopic(id);
    else onOpenTheory();
  };

  // Un solo pulsante, che cambia con lo stato: test iniziale, allenamento o simulazione
  const cta = ctaPrincipale(stima, livello, !!onOpenDiagnostic, !!onStartExam);
  const azione = cta.azione === 'diagnostico' ? onOpenDiagnostic ?? onStartSmart : cta.azione === 'simulazione' ? onStartExam ?? onStartSmart : onStartSmart;

  const sezioneSimulazione = (
    <Simulazione ultima={ultima} onInizia={onStartExam}
      onApriUltima={onApriExtra && ultima ? () => onApriExtra('simulazione-dettaglio', { id: ultima.id }) : undefined}
      onTutte={onApriExtra ? () => onApriExtra('simulazioni') : undefined} />
  );

  return (
    <div className="h-full w-full bg-superficie text-testo overflow-hidden flex flex-col" style={{ fontFamily: FONT }}>
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
        <div className="w-full px-6 lg:px-8 pt-[max(16px,env(safe-area-inset-top))] corto:pt-[max(10px,env(safe-area-inset-top))] lg:pt-6 pb-6">
          {/* intestazione: marchio più leggero del numero a sinistra, il profilo a destra; da 1024 px anche le tre schede */}
          <header className="flex items-center justify-between gap-4 h-9">
            <Marchio disposizione="orizzontale" altezza={28} />
            {onNaviga && (
              <nav aria-label="Sezioni" className="hidden lg:flex items-center gap-1">
                {SCHEDE_DESKTOP.map(v => (
                  <button key={v.id} type="button" onClick={() => { playTapSound(); onNaviga(v.id); }} aria-current={v.id === 'home' ? 'page' : undefined}
                    className={cn('brand-premibile inline-flex items-center gap-2 h-10 px-4 rounded-[12px] text-[15px] leading-[20px]',
                      v.id === 'home' ? 'bg-azione-tinta text-azione-testo font-bold' : 'text-testo-tenue font-semibold hover:text-testo')}>
                    <Icona nome={v.icona} size={20} />{v.nome}
                  </button>
                ))}
              </nav>
            )}
            {onOpenImpostazioni && (
              <button type="button" onClick={() => { playTapSound(); onOpenImpostazioni(); }} aria-label="Profilo"
                className="brand-premibile w-9 h-9 rounded-full bg-superficie-2 text-testo grid place-items-center">
                <Icona nome="profilo" size={22} />
              </button>
            )}
          </header>

          <div className="lg:grid lg:grid-cols-[400px_minmax(0,1fr)] lg:gap-8 lg:mt-6 lg:items-start">
            {/* sinistra: misuratore, fascia di stato, pulsante (sul desktop restano fermi mentre a destra si scorre) */}
            <div className="lg:sticky lg:top-6">
              {nome && (
                <div className="mt-3 corto:hidden lg:block!">
                  <p className="text-[24px] leading-[30px] font-extrabold tracking-[-0.01em] text-testo break-words">Ciao, {nome}</p>
                  <p className="text-[14px] leading-[20px] text-testo-tenue">{rigaSaluto(chiave)}</p>
                </div>
              )}

              {/* misuratore a tutta larghezza (senza stima: arco vuoto e nessun numero) */}
              <div className="-mx-6 lg:mx-0 mt-[20px] corto:mt-[10px]">
                <div className="mx-auto max-w-[440px] corto:max-w-[340px] lg:max-w-[400px]">
                  <StimaSezione stima={stima} livello={livello} onInfo={stima ? () => setFoglio(true) : undefined} />
                </div>
              </div>

              <div className="mt-[14px] corto:mt-[8px]"><BannerStato chiave={chiave} stima={stima} areeConDati={areeConDati} variazione={variazione} /></div>
              <div className="mt-[9px]"><Cta onClick={azione} sotto={cta.sotto}>{cta.etichetta}</Cta></div>
              {/* sul desktop la Simulazione sta sotto il pulsante: resta visibile senza scorrere */}
              {largo && <div className="mt-8">{sezioneSimulazione}</div>}
            </div>

            {/* destra (sul telefono sotto): prossima lezione, aree, simulazione, andamento */}
            <div className="mt-8 corto:mt-6 lg:mt-0 flex flex-col gap-8 corto:gap-6 lg:gap-8">
              <Lezioni lezioni={prossime} onApri={apriLezione} onTutte={onApriExtra ? () => onApriExtra('percorso') : undefined} />
              <Aree categorie={fattori.categorie} livelli={fattori.livelli} onVai={onAllenaArea} />
              {!largo && sezioneSimulazione}
              {/* Andamento: solo punti misurati (diagnostico e simulazioni) */}
              <GraficoStime punti={punti} onInfo={stima ? () => setFoglio(true) : undefined} />
            </div>
          </div>
        </div>
      </div>
      {stima && <FoglioStima aperto={foglio} onChiudi={() => setFoglio(false)} tipo={stima.fonte === 'diagnostico' ? 'diagnostico' : 'simulazione'} risposte={stima.risposte} />}
      {onNaviga && <div className="shrink-0 lg:hidden"><Navigazione attiva="home" onVai={onNaviga} /></div>}
    </div>
  );
}
