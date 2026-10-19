// «Community» (id `esplora`, concetti 49 e 13): l'indice di ciò che sta attorno ad AddiOFA. Quattro card tutte uguali (Project ID, ATLAS, NOI, Agorà): illustrazione
// in una casella fissa, titolo, UNA riga e UNA pillola di stato vera. Niente foto dei concept, niente numeri o utenti inventati.
// Pillole: «Su questo dispositivo», «Non attivo», il nome del servizio esterno («Instagram»), più gli stati veri dell'iscrizione.
import { Icona } from '../../../brand/icone/Icona';
import { Illustrazione } from '../../../brand/Illustrazione';
import { useExtra } from '../contesto';
import { Etichetta, Pagina, type TonoStato } from './comuni';
import { useInvio } from './hooks';
import { ATLAS_API_URL, FRASE_PROJECT } from '../../../config/ecosystem';
import { descriviInvio, type ChiaveStato } from '../../../lib/progetto/coda';
import { leggiProgetto } from '../../../lib/progetto/profilo';
import { playTapSound } from '../../../lib/audio';

interface Carta { id: string; titolo: string; riga: string; arte: string; stato: { testo: string; tono: TonoStato } }

// il colore c'è solo dove dice qualcosa: ambra = non attivo o da completare, rosso = rifiutata
const TONO_INVIO: Record<ChiaveStato, TonoStato> = { inviata: 'neutro', 'in-attesa': 'medio', invio: 'neutro', rifiutata: 'errore', 'solo-locale': 'neutro' };

export default function Esplora() {
  const { appState, vai } = useExtra();
  const invio = useInvio();
  const { profilo, collegamento } = leggiProgetto(appState);
  const sInvio = descriviInvio(invio, Date.now());

  const statoProjectId: Carta['stato'] = collegamento ? { testo: 'Collegato', tono: 'neutro' }
    : !profilo ? { testo: 'Da completare', tono: 'medio' }
    : { testo: sInvio.chiave === 'solo-locale' ? 'Su questo dispositivo' : sInvio.titolo, tono: TONO_INVIO[sInvio.chiave] };
  const statoNoi: Carta['stato'] = !ATLAS_API_URL ? { testo: 'Non attivo', tono: 'medio' }
    : collegamento?.scopes.includes('noi.leaderboard') ? { testo: 'Aderito', tono: 'neutro' } : { testo: 'Non hai aderito', tono: 'neutro' };

  const carte: Carta[] = [
    { id: 'projectid', titolo: 'Project ID', riga: 'Il tuo profilo di iscrizione', arte: 'verifica-utente', stato: statoProjectId },
    { id: 'atlas-analisi', titolo: 'ATLAS', riga: 'Quanto sei pronto o pronta', arte: 'progressi-statistiche', stato: { testo: 'Su questo dispositivo', tono: 'neutro' } },
    { id: 'noi', titolo: 'NOI', riga: 'Classifica degli studenti', arte: 'successo', stato: statoNoi },
    { id: 'agora', titolo: 'Agorà', riga: 'Idee e domande tra studenti', arte: 'messaggi-supporto', stato: { testo: 'Instagram', tono: 'neutro' } },
  ];

  return (
    <Pagina titolo="Community" sottotitolo="Account, classifica e community per chi prepara l'OFA.">
      <ul className="mt-4 flex flex-col gap-3">
        {carte.map(c => (
          <li key={c.id}>
            <button type="button" onClick={() => { playTapSound(); vai(c.id); }}
              className="brand-premibile flex min-h-[96px] w-full items-center gap-4 rounded-[16px] border border-linea bg-superficie p-3.5 text-left shadow-sm dark:shadow-none">
              <span className="grid h-16 w-16 shrink-0 place-items-center"><Illustrazione nome={c.arte} lato={60} /></span>
              <span className="min-w-0 flex-1">
                <span className="block text-[20px] leading-[26px] font-extrabold tracking-[-0.01em] text-testo">{c.titolo}</span>
                <span data-testo-ok className="block text-[14px] leading-[19px] text-testo-tenue">{c.riga}</span>
                <Etichetta tono={c.stato.tono} className="mt-1.5">{c.stato.testo}</Etichetta>
              </span>
              <Icona nome="avanti" size={22} className="shrink-0 text-testo-tenue" />
            </button>
          </li>
        ))}
      </ul>
      <p data-testo-ok className="mt-6 text-center text-[13px] leading-[19px] text-testo-tenue">{FRASE_PROJECT}</p>
    </Pagina>
  );
}
