// «Project ID» (concept 30/34/36), con la classifica NOI e Agorà: tre righe-icona con il loro stato. Ogni riga ha la «i» che apre
// il foglio con la spiegazione onesta di cosa è e perché (non) è attiva. Nessun login finto: la riga Project ID, quando il collegamento
// è attivo, porta alle Impostazioni; spento, c'è solo la spiegazione.
import { useEffect, useState, type ReactNode } from 'react';
import { Icona, type NomeIcona } from '../../../brand/icone/Icona';
import { useExtra } from '../contesto';
import { Pagina } from './componenti';
import { FoglioInfo, IconaTono, PulsanteInfo, TONI, type Tono } from '../ui';
import { ATLAS_API_URL, ECOSYSTEM, SCOPES } from '../../../config/ecosystem';
import { FEATURE_FLAGS } from '../../../config/offer';
import { atlas } from '../../../lib/atlas';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';
import { statoCollegamento, statoNoi, valoriNoi, type MotivoSpento, type StatoNoi } from '../../../lib/servizi/collegamento';

// Spiegazioni oneste, dentro il foglio (mai in pagina).
const SPIEGAZIONE_SPENTO: Record<MotivoSpento, string> = {
  demo: 'In questa versione dimostrativa non c\'è nessun accesso: non viene creato nessun account e nessun dato esce dal tuo dispositivo.',
  flag: `Il collegamento al ${ECOSYSTEM.accountName} non è ancora attivo in AddiOFA. Non hai perso niente: tutto lo studio funziona senza, e i tuoi progressi restano su questo dispositivo.`,
  atlas: `Il servizio ${ECOSYSTEM.engineName}, che gestisce l'account, non è ancora raggiungibile da questa versione dell'app. Riprova quando sarà attivo: per studiare non serve.`,
};
const TESTO_NOI: Record<StatoNoi, string> = {
  demo: `In questa versione dimostrativa non c'è nessun accesso, quindi non esiste una classifica ${ECOSYSTEM.rankingName}: nessun altro utente è collegato e nessun dato esce dal tuo dispositivo.`,
  'project-id-spento': `La classifica ${ECOSYSTEM.rankingName} richiede il ${ECOSYSTEM.accountName}, che in AddiOFA non è ancora attivo. Tutto il resto dell'app funziona senza.`,
  'classifica-spenta': `Il ${ECOSYSTEM.accountName} c'è, ma la classifica ${ECOSYSTEM.rankingName} non è stata ancora accesa. Quando lo sarà, entrerà solo chi sceglie di farlo.`,
  atlas: `La classifica ${ECOSYSTEM.rankingName} sta sul servizio ${ECOSYSTEM.engineName}, che questa versione non raggiunge. Riprova più avanti.`,
  'da-collegare': `Per entrare in classifica devi prima collegare il ${ECOSYSTEM.accountName} dalle Impostazioni. Poi decidi tu se aderire.`,
  'da-aderire': `Sei collegato, ma non hai dato il permesso per la classifica: finché non lo dai, nessuno vede il tuo nome utente né i tuoi numeri.`,
  aderito: 'Il tuo @nome utente, le domande imparate e il miglior punteggio sono visibili agli altri partecipanti. Puoi uscire quando vuoi.',
};

// Un colore per ogni permesso, lo stesso che ha quella cosa nel resto dell'app.
const TONO_SCOPE: Record<string, Tono> = { profile: 'azione', 'progress.share': 'azione', 'noi.leaderboard': 'medio', 'atlas.personalize': 'alto' };

type Posizione = { stato: 'carico' } | { stato: 'ok'; rank: number; totale: number } | { stato: 'fuori' } | { stato: 'errore' };

/** Una riga: tessera con l'icona, nome di una o due parole, icona di stato e «i». Se `onClick` c'è, la riga si tocca. */
function Riga({ icona, tono, nome, stato, valore, onInfo, onClick }: {
  icona: NomeIcona; tono: Tono; nome: string; stato: { icona: NomeIcona; tono?: Tono; nome: string }; valore?: ReactNode; onInfo: () => void; onClick?: () => void;
}) {
  const corpo = (
    <>
      <IconaTono tono={tono} lato={44} className="rounded-[13px] bg-superficie"><Icona nome={icona} size={24} /></IconaTono>
      <span className="flex-1 min-w-0 text-[16px] leading-[22px] font-bold text-testo">{nome}</span>
      {valore}
      <span role="img" aria-label={stato.nome} className={cn('grid h-8 w-8 shrink-0 place-items-center rounded-full', stato.tono ? `${TONI[stato.tono].tinta} ${TONI[stato.tono].icona}` : 'bg-superficie text-testo-tenue')}><Icona nome={stato.icona} size={18} /></span>
    </>
  );
  return (
    <li className="flex items-center gap-1.5 rounded-[14px] bg-superficie-2 pr-1.5">
      {onClick
        ? <button type="button" onClick={() => { playTapSound(); onClick(); }} className="brand-premibile flex min-w-0 flex-1 items-center gap-3 rounded-[14px] p-3 text-left">{corpo}</button>
        : <div className="flex min-w-0 flex-1 items-center gap-3 p-3">{corpo}</div>}
      <PulsanteInfo onClick={onInfo} etichetta={`Informazioni: ${nome}`} />
    </li>
  );
}

export default function ProjectId() {
  const { appState, demo, apriImpostazioni } = useExtra();
  const ingressi = { demo, flagProjectId: FEATURE_FLAGS.projectId, flagClassifica: FEATURE_FLAGS.leaderboard, atlasOnline: !!ATLAS_API_URL, permessi: appState.projectLink?.scopes };
  const stato = statoCollegamento(ingressi);
  const noi = statoNoi(ingressi);
  const link = appState.projectLink;
  const mio = valoriNoi(appState);
  const [aperto, setAperto] = useState<'projectid' | 'noi' | 'agora' | null>(null);
  const [pos, setPos] = useState<Posizione>({ stato: 'carico' });

  // La posizione si chiede al servizio solo se ci si è iscritti: altrimenti non esiste e non si mostra.
  useEffect(() => {
    if (noi !== 'aderito') return;
    let vivo = true;
    atlas.leaderboard(ECOSYSTEM.appId).then(d => {
      if (!vivo) return;
      setPos(d.me ? { stato: 'ok', rank: d.me.rank, totale: d.total } : { stato: 'fuori' });
    }).catch(() => { if (vivo) setPos({ stato: 'errore' }); });
    return () => { vivo = false; };
  }, [noi]);

  const spento = { icona: 'stato-non-attivo' as const, nome: 'Non attivo' };
  const acceso = { icona: 'stato-ok' as const, tono: 'alto' as const, nome: 'Attivo' };
  const statoPid = stato.attivo && link ? { ...acceso, nome: 'Collegato' } : stato.attivo ? { icona: 'stato-attenzione' as const, tono: 'medio' as const, nome: 'Da collegare' } : spento;

  return (
    <Pagina titolo="Project ID">
      <ul className="mt-5 flex flex-col gap-2.5">
        <Riga icona="projectid" tono="azione" nome="Project ID" stato={statoPid} onInfo={() => setAperto('projectid')} onClick={stato.attivo ? apriImpostazioni : undefined} />
        <Riga icona="classifica-noi" tono="medio" nome={`Classifica ${ECOSYSTEM.rankingName}`} stato={noi === 'aderito' ? acceso : spento} onInfo={() => setAperto('noi')}
          valore={noi === 'aderito' && pos.stato === 'ok' ? <span className="text-[15px] font-extrabold tabular-nums text-testo">#{pos.rank}<span className="text-testo-tenue">/{pos.totale}</span></span> : undefined} />
        <Riga icona="agora" tono="viola" nome="Agorà" stato={spento} onInfo={() => setAperto('agora')} />
      </ul>

      <FoglioInfo aperto={aperto === 'projectid'} onChiudi={() => setAperto(null)} titolo="Project ID">
        <p>{stato.attivo
          ? (link ? `Collegato su questo dispositivo dal ${new Date(link.grantedAt).toLocaleDateString('it-IT')}: dalle Impostazioni puoi cambiare il consenso o revocarlo.` : 'Il collegamento è disponibile: dalle Impostazioni accedi e scegli, uno per uno, cosa condividere.')
          : SPIEGAZIONE_SPENTO[stato.motivo!]}</p>
        <p className="mt-2">È un solo account facoltativo per le app {ECOSYSTEM.name}: serve a ritrovare i tuoi progressi su più app e, se vuoi, a partecipare alla classifica {ECOSYSTEM.rankingName}. Non serve per studiare. {ECOSYSTEM.engineName} è il nome dell'algoritmo e dell'infrastruttura che sta dietro.</p>
        <h3 className="mt-4 font-bold">Cosa si condivide, solo se lo scegli</h3>
        <ul className="mt-1.5 flex flex-col gap-2">
          {SCOPES.map(s => {
            const concesso = link ? (s.required || link.scopes.includes(s.id)) : null;
            return (
              <li key={s.id} className="flex gap-2.5">
                <span className={cn('mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full', TONI[TONO_SCOPE[s.id] ?? 'azione'].tinta, TONI[TONO_SCOPE[s.id] ?? 'azione'].icona)} aria-hidden="true">
                  <Icona nome={s.required ? 'blocco' : concesso ? 'stato-ok' : 'stato-non-attivo'} size={14} />
                </span>
                <span><span className="font-bold">{s.title}</span> <span className="text-testo-tenue">{s.description}</span></span>
              </li>
            );
          })}
        </ul>
        <h3 className="mt-4 font-bold">Cosa non si condivide</h3>
        <ul className="mt-1.5 flex list-disc flex-col gap-1.5 pl-5">
          <li>Matricola e codice fiscale: l'app non li chiede.</li>
          <li>L'email del Politecnico: il Project ID non la richiede.</li>
          <li>Le tue singole risposte e i tuoi errori: in classifica {ECOSYSTEM.rankingName} si vedono solo il tuo @nome utente, le domande imparate e il miglior punteggio.</li>
          <li>Niente di nascosto: puoi revocare un permesso o eliminare il tuo Project ID quando vuoi.</li>
        </ul>
        <p className="mt-3 text-testo-tenue">I testi sul trattamento dei dati sono bozze, da far rivedere a un professionista prima del lancio.</p>
      </FoglioInfo>

      <FoglioInfo aperto={aperto === 'noi'} onChiudi={() => setAperto(null)} titolo={`Classifica ${ECOSYSTEM.rankingName}`}>
        <p>{TESTO_NOI[noi]}</p>
        <p className="mt-2">Chi sa più regole: domande imparate, poi miglior simulazione. Solo per chi sceglie di partecipare. Si compare con il proprio @nome utente: gli altri vedono le domande imparate e il miglior punteggio in simulazione, niente altro.</p>
        <p className="mt-2">I due numeri che userebbe, sul tuo dispositivo: <span className="font-bold tabular-nums">{mio.imparate}</span> domande imparate, {(appState.history ?? []).length > 0 ? <>miglior simulazione <span className="font-bold tabular-nums">{mio.migliorSimulazione}/30</span></> : 'nessuna simulazione ancora'}. Non sono una posizione.</p>
        {noi === 'aderito' && (
          <p className="mt-2 font-bold" role="status">
            {pos.stato === 'ok' ? `La tua posizione: ${pos.rank} su ${pos.totale}.` : pos.stato === 'carico' ? 'Cerco la tua posizione…' : pos.stato === 'fuori' ? 'Non risulti ancora in classifica: il punteggio si aggiorna quando torni alla Home.' : 'Non riesco a leggere la classifica adesso. Riprova più tardi.'}
          </p>
        )}
      </FoglioInfo>

      <FoglioInfo aperto={aperto === 'agora'} onChiudi={() => setAperto(null)} titolo="Agorà">
        <p>Agorà è il forum degli studenti, ma non è ancora collegata ad AddiOFA: qui non c'è nessuna discussione, nessun commento e nessun utente da mostrarti. Quando il collegamento esisterà, lo troverai qui.</p>
        <p className="mt-2">Nei piani servirà a fare domande ad altri studenti, proporre idee e leggere le esperienze di chi ha già fatto il test. È lo scopo previsto, non una funzione già pronta e non una data di uscita.</p>
        <p className="mt-2">È un servizio separato dall'app: il collegamento previsto passa dal {ECOSYSTEM.accountName}, che è facoltativo e non serve per studiare. Niente viene condiviso senza il tuo consenso.</p>
      </FoglioInfo>
    </Pagina>
  );
}
