// «Esplora» (concept 49 schermata 8, e 13): l'hub dell'ecosistema di cui AddiOFA fa parte. Quattro carte illustrate (Project ID, ATLAS, NOI, Agorà),
// ognuna con una riga vera sul proprio stato. Niente foto dei concept, niente numeri o utenti inventati.
import { Icona } from '../../../brand/icone/Icona';
import { Illustrazione } from '../../../brand/Illustrazione';
import { useExtra } from '../contesto';
import { Etichetta, Pagina, Testata } from './comuni';
import { ATLAS_API_URL, FRASE_PROJECT } from '../../../config/ecosystem';
import { RIGA_APERTURA } from '../../../lib/progetto/informativa';
import { leggiProgetto } from '../../../lib/progetto/profilo';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';
import type { Tono } from '../ui';

interface Carta { id: string; titolo: string; riga: string; arte: string; tono: Tono; stato: { testo: string; tono: Tono | 'neutro' } }

const FONDO: Record<Tono, string> = { azione: 'bg-azione-tinta', alto: 'bg-alto-tinta', medio: 'bg-medio-tinta', basso: 'bg-basso-tinta', viola: 'bg-viola-tinta' };

export default function Esplora() {
  const { appState, vai } = useExtra();
  const { collegamento } = leggiProgetto(appState);

  // Ogni carta dice com'è, in una riga vera: niente è attivo finché l'utente non lo sceglie.
  const statoProjectId: Carta['stato'] = collegamento ? { testo: 'Accesso attivo', tono: 'alto' } : { testo: 'Facoltativo', tono: 'neutro' };
  const statoNoi: Carta['stato'] = !ATLAS_API_URL ? { testo: 'Non collegato', tono: 'neutro' }
    : collegamento?.scopes.includes('noi.leaderboard') ? { testo: 'Ci sei', tono: 'alto' } : { testo: 'Facoltativo', tono: 'neutro' };

  const carte: Carta[] = [
    { id: 'projectid', titolo: 'Project ID', riga: 'Il tuo account', arte: 'verifica-utente', tono: 'viola', stato: statoProjectId },
    { id: 'atlas-analisi', titolo: 'ATLAS', riga: 'Il tuo livello', arte: 'progressi-statistiche', tono: 'azione', stato: { testo: 'Sul dispositivo', tono: 'neutro' } },
    { id: 'noi', titolo: 'NOI', riga: 'Classifica', arte: 'successo', tono: 'alto', stato: statoNoi },
    { id: 'agora', titolo: 'Agorà', riga: 'La pagina degli studenti', arte: 'messaggi-supporto', tono: 'medio', stato: { testo: 'Instagram', tono: 'neutro' } },
  ];

  return (
    <Pagina titolo="Esplora">
      <Testata nome="mondo-internazionale" kit="kit-luminoso" lato={168} className="mt-1" />
      <ul className="mt-3 flex flex-col gap-3">
        {carte.map(c => (
          <li key={c.id}>
            <button type="button" onClick={() => { playTapSound(); vai(c.id); }}
              className={cn('brand-premibile flex w-full items-center gap-3.5 rounded-[18px] p-3.5 text-left', FONDO[c.tono])}>
              <Illustrazione nome={c.arte} lato={84} />
              <span className="min-w-0 flex-1">
                <span className="block text-[20px] leading-[26px] font-extrabold tracking-[-0.01em] text-testo">{c.titolo}</span>
                <span data-testo-ok className="block text-[14px] leading-[19px] text-testo-tenue">{c.riga}</span>
                <Etichetta tono={c.stato.tono} className="mt-1.5">{c.stato.testo}</Etichetta>
              </span>
              <Icona nome="avanti" size={24} className="shrink-0 text-testo-tenue" />
            </button>
          </li>
        ))}
      </ul>
      <p data-testo-ok className="mt-6 text-center text-[13px] leading-[19px] text-testo">{RIGA_APERTURA}</p>
      <p data-testo-ok className="mt-3 text-center text-[12.5px] leading-[18px] text-testo-tenue">{FRASE_PROJECT}</p>
    </Pagina>
  );
}
