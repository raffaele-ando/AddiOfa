// «Esplora» (concept 49 e 13): hub delle carte. Ogni carta dice se è disponibile ora o richiede un collegamento;
// niente numeri, utenti o novità inventati.
import type { ReactNode } from 'react';
import { ChevronRight, CircleHelp, Flag, Fingerprint, MessagesSquare, Radar, Route, Trophy, UserPlus, Quote, Compass } from 'lucide-react';
import { useExtra } from '../contesto';
import { SCHERMATE } from '../registro';
import { Pagina, Sezione } from './componenti';
import { TONI, type Tono } from '../ui';
import { FEATURE_FLAGS } from '../../../config/offer';
import { ECOSYSTEM, ATLAS_API_URL } from '../../../config/ecosystem';
import { statoCollegamento } from '../../../lib/servizi/collegamento';
import { CARTE_ESPLORA, ETICHETTA_DISPONIBILITA, disponibilitaCarta, type CartaEsplora, type Disponibilita } from '../../../lib/servizi/esplora';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';

// Ogni carta ha il colore del suo significato (non a rotazione): analisi del livello = verde (ciò che sai), frasi = viola (apprendimento),
// percorso e guida = blu (studio), Project ID = azzurro pieno (l'account, a parte), classifica NOI = ambra (trofeo), Agorà = viola,
// inviti = corallo (persone, confronto), segnala = ambra (attenzione).
type ToneCarta = Tono | 'azzurro';
interface Testi { titolo: string; testo: string; icona: ReactNode; tono: ToneCarta }

const TESTI: Record<string, Testi> = {
  'atlas-analisi': { titolo: 'Analisi del livello', testo: 'Argomento per argomento: dove sei solido e cosa ripassare, calcolato sulle tue risposte.', icona: <Radar size={24} />, tono: 'alto' },
  frasi: { titolo: 'Frasi', testo: 'Frasi in inglese da leggere e ripassare.', icona: <Quote size={24} />, tono: 'viola' },
  percorso: { titolo: 'Percorso', testo: 'Il tuo percorso di studio, un passo alla volta.', icona: <Route size={24} />, tono: 'azione' },
  projectid: { titolo: ECOSYSTEM.accountName, testo: 'L\'account unico per le app Project: cosa condivide e cosa no.', icona: <Fingerprint size={24} />, tono: 'azzurro' },
  noi: { titolo: `Classifica ${ECOSYSTEM.rankingName}`, testo: 'Chi sa più regole, per chi sceglie di partecipare.', icona: <Trophy size={24} />, tono: 'medio' },
  agora: { titolo: 'Agorà', testo: 'Il forum degli studenti: domande, idee, confronto.', icona: <MessagesSquare size={24} />, tono: 'viola' },
  faq: { titolo: 'Guida e FAQ', testo: 'Risposte su test, Pass, dati e app.', icona: <CircleHelp size={24} />, tono: 'azione' },
  inviti: { titolo: 'Inviti', testo: 'Il tuo codice e le regole per avere il Pass invitando dei compagni.', icona: <UserPlus size={24} />, tono: 'basso' },
  segnala: { titolo: 'Segnala', testo: 'Una domanda sbagliata o un problema dell\'app.', icona: <Flag size={24} />, tono: 'medio' },
};

/** Tessera dell'icona: tinta chiara del tono; l'azzurro del Project ID è pieno, così si distingue dal blu dello studio. */
const TESSERA: Record<ToneCarta, string> = {
  azione: `${TONI.azione.tinta} ${TONI.azione.icona}`,
  alto: `${TONI.alto.tinta} ${TONI.alto.icona}`,
  medio: `${TONI.medio.tinta} ${TONI.medio.icona}`,
  basso: `${TONI.basso.tinta} ${TONI.basso.icona}`,
  viola: `${TONI.viola.tinta} ${TONI.viola.icona}`,
  azzurro: 'bg-azione-chiaro text-testo dark:text-azione-su',
};

// L'etichetta compare solo quando la carta NON è utilizzabile adesso: dice perché (una sola volta, niente nota ripetuta).
const STILE_ETICHETTA: Record<Disponibilita, string> = {
  ora: 'bg-alto-tinta text-alto-testo',
  collegamento: 'bg-medio-tinta text-medio-testo',
  presto: 'bg-superficie text-testo-tenue',
};

function Carta({ carta, disp, etichetta, onClick }: { carta: CartaEsplora; disp: Disponibilita; etichetta?: string; onClick: () => void }) {
  const t = TESTI[carta.id];
  return (
    <li>
      <button type="button" onClick={() => { playTapSound(); onClick(); }}
        className="brand-premibile w-full flex items-start gap-3.5 rounded-[12px] bg-superficie-2 p-[12px] pr-3 text-left">
        <span className={cn('mt-0.5 w-[44px] h-[44px] rounded-[11px] flex items-center justify-center shrink-0', TESSERA[t.tono])} aria-hidden="true">{t.icona}</span>
        <span className="flex-1 min-w-0">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-[15.5px] leading-[20px] font-bold text-testo">{t.titolo}</span>
            {(disp !== 'ora' || etichetta) && <span className={cn('rounded-full px-2 py-[2px] text-[11.5px] leading-[16px] font-bold', STILE_ETICHETTA[disp])}>{etichetta ?? ETICHETTA_DISPONIBILITA[disp]}</span>}
          </span>
          <span className="mt-0.5 block text-[13px] leading-[18px] text-testo-tenue">{t.testo}</span>
        </span>
        <ChevronRight size={22} strokeWidth={2} className="mt-3 shrink-0 -mr-1 text-testo-tenue" aria-hidden="true" />
      </button>
    </li>
  );
}

export default function Esplora() {
  const { vai, apriInviti, demo } = useExtra();
  const collegamento = statoCollegamento({ demo, flagProjectId: FEATURE_FLAGS.projectId, flagClassifica: FEATURE_FLAGS.leaderboard, atlasOnline: !!ATLAS_API_URL });
  const schermate = new Set(Object.keys(SCHERMATE));

  const gruppo = (g: CartaEsplora['gruppo']) => CARTE_ESPLORA.filter(c => c.gruppo === g).map(c => {
    const d = disponibilitaCarta(c, schermate, collegamento.attivo);
    // il Project ID spento ha una pagina di sole informazioni: non è «disponibile ora» come uno strumento
    const etichetta = c.id === 'projectid' && !collegamento.attivo && d === 'ora' ? 'Solo informazioni' : undefined;
    return <Carta key={c.id} carta={c} disp={etichetta ? 'presto' : d} etichetta={etichetta} onClick={() => ('schermata' in c.vai ? vai(c.vai.schermata) : apriInviti())} />;
  });

  return (
    <Pagina titolo="Esplora" sottotitolo="Gli strumenti di AddiOFA e i servizi collegati.">
      <Sezione id="esplora-studio" titolo="Per studiare"><ul className="flex flex-col gap-[8px]">{gruppo('studio')}</ul></Sezione>
      <Sezione id="esplora-eco" titolo={`Ecosistema ${ECOSYSTEM.name}`}><ul className="flex flex-col gap-[8px]">{gruppo('ecosistema')}</ul></Sezione>
      <Sezione id="esplora-aiuto" titolo="Aiuto"><ul className="flex flex-col gap-[8px]">{gruppo('aiuto')}</ul></Sezione>
    </Pagina>
  );
}
