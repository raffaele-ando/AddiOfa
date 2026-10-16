// «Esplora» (concept 49 e 13): hub delle carte. Ogni carta dice se è disponibile ora o richiede un collegamento;
// niente numeri, utenti o novità inventati.
import type { ReactNode } from 'react';
import { ChevronRight, CircleHelp, Flag, Fingerprint, MessagesSquare, Radar, Route, Trophy, UserPlus, Quote, Compass } from 'lucide-react';
import { useExtra } from '../contesto';
import { SCHERMATE } from '../registro';
import { Pagina, Sezione } from './componenti';
import { FEATURE_FLAGS } from '../../../config/offer';
import { ECOSYSTEM, ATLAS_API_URL } from '../../../config/ecosystem';
import { statoCollegamento } from '../../../lib/servizi/collegamento';
import { CARTE_ESPLORA, ETICHETTA_DISPONIBILITA, disponibilitaCarta, type CartaEsplora, type Disponibilita } from '../../../lib/servizi/esplora';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';

interface Testi { titolo: string; testo: string; icona: ReactNode }

const TESTI: Record<string, Testi> = {
  'atlas-analisi': { titolo: 'Analisi del livello', testo: 'Argomento per argomento: dove sei solido e cosa ripassare, calcolato sulle tue risposte.', icona: <Radar size={24} /> },
  frasi: { titolo: 'Frasi', testo: 'Frasi in inglese da leggere e ripassare.', icona: <Quote size={24} /> },
  percorso: { titolo: 'Percorso', testo: 'Il tuo percorso di studio, un passo alla volta.', icona: <Route size={24} /> },
  projectid: { titolo: ECOSYSTEM.accountName, testo: 'L\'account unico per le app Project: cosa condivide e cosa no.', icona: <Fingerprint size={24} /> },
  noi: { titolo: `Classifica ${ECOSYSTEM.rankingName}`, testo: 'Chi sa più regole, per chi sceglie di partecipare.', icona: <Trophy size={24} /> },
  agora: { titolo: 'Agorà', testo: 'Il forum degli studenti: domande, idee, confronto.', icona: <MessagesSquare size={24} /> },
  faq: { titolo: 'Guida e FAQ', testo: 'Risposte su test, Pass, dati e app.', icona: <CircleHelp size={24} /> },
  inviti: { titolo: 'Inviti', testo: 'Il tuo codice e le regole per avere il Pass invitando dei compagni.', icona: <UserPlus size={24} /> },
  segnala: { titolo: 'Segnala', testo: 'Una domanda sbagliata o un problema dell\'app.', icona: <Flag size={24} /> },
};

const STILE_ETICHETTA: Record<Disponibilita, string> = {
  ora: 'bg-alto-tinta text-alto-testo',
  collegamento: 'bg-medio-tinta text-medio-testo',
  presto: 'bg-superficie text-testo-tenue',
};

function Carta({ carta, disp, nota, etichetta, onClick }: { carta: CartaEsplora; disp: Disponibilita; nota?: string; etichetta?: string; onClick: () => void }) {
  const t = TESTI[carta.id];
  return (
    <li>
      <button type="button" onClick={() => { playTapSound(); onClick(); }}
        className="brand-premibile w-full flex items-start gap-3.5 rounded-[12px] bg-superficie-2 p-[12px] pr-3 text-left">
        <span className="mt-0.5 w-[44px] h-[44px] rounded-[11px] bg-superficie text-azione flex items-center justify-center shrink-0 dark:border dark:border-linea" aria-hidden="true">{t.icona}</span>
        <span className="flex-1 min-w-0">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-[15.5px] leading-[20px] font-bold text-testo">{t.titolo}</span>
            {(disp !== 'ora' || etichetta) && <span className={cn('rounded-full px-2 py-[2px] text-[11.5px] leading-[16px] font-bold', STILE_ETICHETTA[disp])}>{etichetta ?? ETICHETTA_DISPONIBILITA[disp]}</span>}
          </span>
          <span className="mt-0.5 block text-[13px] leading-[18px] text-testo-tenue">{t.testo}</span>
          {nota && <span className="mt-1 block text-[12.5px] leading-[17px] text-testo-tenue">{nota}</span>}
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

  const nota = (c: CartaEsplora, d: Disponibilita): string | undefined => {
    if (c.id === 'projectid') return collegamento.attivo ? undefined : 'Qui trovi le informazioni; il collegamento non è ancora attivo.';
    if (c.id === 'noi' && d === 'collegamento') return `Serve il collegamento al ${ECOSYSTEM.accountName} e la tua adesione; oggi non sono attivi.`;
    if (c.id === 'agora') return 'Qui non ci sono discussioni: la pagina spiega a cosa servirà.';
    if (d === 'presto') return 'Questa schermata non è ancora stata aggiunta all\'app.';
    return undefined;
  };

  const gruppo = (g: CartaEsplora['gruppo']) => CARTE_ESPLORA.filter(c => c.gruppo === g).map(c => {
    const d = disponibilitaCarta(c, schermate, collegamento.attivo);
    // il Project ID spento ha una pagina di sole informazioni: non è «disponibile ora» come uno strumento
    const etichetta = c.id === 'projectid' && !collegamento.attivo && d === 'ora' ? 'Solo informazioni' : undefined;
    return <Carta key={c.id} carta={c} disp={etichetta ? 'presto' : d} etichetta={etichetta} nota={nota(c, d)} onClick={() => ('schermata' in c.vai ? vai(c.vai.schermata) : apriInviti())} />;
  });

  return (
    <Pagina titolo="Esplora" sottotitolo="Gli strumenti di AddiOFA e i servizi collegati. Se una carta non è disponibile, te lo dice.">
      <Sezione id="esplora-studio" titolo="Per studiare"><ul className="flex flex-col gap-[8px]">{gruppo('studio')}</ul></Sezione>
      <Sezione id="esplora-eco" titolo={`Ecosistema ${ECOSYSTEM.name}`}><ul className="flex flex-col gap-[8px]">{gruppo('ecosistema')}</ul></Sezione>
      <Sezione id="esplora-aiuto" titolo="Aiuto"><ul className="flex flex-col gap-[8px]">{gruppo('aiuto')}</ul></Sezione>
    </Pagina>
  );
}
