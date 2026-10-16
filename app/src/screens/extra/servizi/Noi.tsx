// «Classifica NOI» (concept 30/34): stato onesto. La classifica richiede il Project ID e la partecipazione di chi sceglie di entrare;
// qui non c'è nessuna posizione né nessun altro utente a meno che il servizio risponda davvero.
import { useEffect, useState } from 'react';
import { useExtra } from '../contesto';
import { BottoneAzione, BottoneSecondario, Nota, Pagina, Sezione } from './componenti';
import { ATLAS_API_URL, ECOSYSTEM } from '../../../config/ecosystem';
import { FEATURE_FLAGS } from '../../../config/offer';
import { atlas } from '../../../lib/atlas';
import { statoNoi, valoriNoi, type StatoNoi } from '../../../lib/servizi/collegamento';
import { SCHERMATE } from '../registro';

const TESTO_STATO: Record<StatoNoi, { titolo: string; testo: string }> = {
  demo: { titolo: 'Non disponibile in questa versione', testo: `In questa versione dimostrativa non c'è nessun accesso, quindi non esiste una classifica ${ECOSYSTEM.rankingName}: nessun altro utente è collegato e nessun dato esce dal tuo dispositivo.` },
  'project-id-spento': { titolo: 'Non è ancora attiva', testo: `La classifica ${ECOSYSTEM.rankingName} richiede il ${ECOSYSTEM.accountName}, che in AddiOFA non è ancora attivo. Tutto il resto dell'app funziona senza.` },
  'classifica-spenta': { titolo: 'Non è ancora attiva', testo: `Il ${ECOSYSTEM.accountName} c'è, ma la classifica ${ECOSYSTEM.rankingName} non è stata ancora accesa. Quando lo sarà, entrerà solo chi sceglie di farlo.` },
  atlas: { titolo: 'Il servizio non è raggiungibile', testo: `La classifica ${ECOSYSTEM.rankingName} sta sul servizio ${ECOSYSTEM.engineName}, che questa versione non raggiunge. Riprova più avanti.` },
  'da-collegare': { titolo: `Serve il ${ECOSYSTEM.accountName}`, testo: `Per entrare in classifica devi prima collegare il ${ECOSYSTEM.accountName} dalle Impostazioni. Poi decidi tu se aderire.` },
  'da-aderire': { titolo: 'Non hai ancora aderito', testo: `Sei collegato, ma non hai dato il permesso per la classifica: finché non lo dai, nessuno vede il tuo nome utente né i tuoi numeri. Puoi darlo dal ${ECOSYSTEM.accountName}.` },
  aderito: { titolo: 'Hai aderito', testo: 'Il tuo @nome utente, le domande imparate e il miglior punteggio sono visibili agli altri partecipanti. Puoi uscire quando vuoi.' },
};

type Posizione = { stato: 'carico' } | { stato: 'ok'; rank: number; totale: number } | { stato: 'fuori' } | { stato: 'errore' };

export default function Noi() {
  const { appState, demo, vai, apriImpostazioni, vaiHome } = useExtra();
  const ingressi = { demo, flagProjectId: FEATURE_FLAGS.projectId, flagClassifica: FEATURE_FLAGS.leaderboard, atlasOnline: !!ATLAS_API_URL, permessi: appState.projectLink?.scopes };
  const stato = statoNoi(ingressi);
  const mio = valoriNoi(appState);
  const haSimulazioni = (appState.history ?? []).length > 0;
  const [pos, setPos] = useState<Posizione>({ stato: 'carico' });

  // La posizione si chiede al servizio solo se ci si è iscritti: altrimenti non esiste e non si mostra.
  useEffect(() => {
    if (stato !== 'aderito') return;
    let vivo = true;
    atlas.leaderboard(ECOSYSTEM.appId).then(d => {
      if (!vivo) return;
      setPos(d.me ? { stato: 'ok', rank: d.me.rank, totale: d.total } : { stato: 'fuori' });
    }).catch(() => { if (vivo) setPos({ stato: 'errore' }); });
    return () => { vivo = false; };
  }, [stato]);

  const t = TESTO_STATO[stato];
  const haClassificaAmici = 'classifica' in SCHERMATE;
  const daCollegare = stato === 'da-collegare' || stato === 'da-aderire';

  return (
    <Pagina titolo={`Classifica ${ECOSYSTEM.rankingName}`} sottotitolo="Chi sa più regole: domande imparate, poi miglior simulazione. Solo per chi sceglie di partecipare.">

      <Nota tono={stato === 'aderito' ? 'riuscito' : 'attenzione'} className="mt-5">
        <p className="font-bold">{t.titolo}</p>
        <p className="mt-0.5">{t.testo}</p>
      </Nota>

      {stato === 'aderito' && (
        <div className="mt-3 rounded-[12px] bg-superficie-2 p-4 text-testo" role="status">
          {pos.stato === 'ok' && <p className="flex items-baseline justify-between"><span className="font-bold">La tua posizione</span><span className="text-[26px] font-extrabold tabular-nums">#{pos.rank} <span className="text-[14px] font-bold text-testo-tenue">su {pos.totale}</span></span></p>}
          {pos.stato === 'carico' && <p className="font-bold">Cerco la tua posizione…</p>}
          {pos.stato === 'fuori' && <p className="font-bold">Non risulti ancora in classifica: il punteggio si aggiorna quando torni alla Home.</p>}
          {pos.stato === 'errore' && <p className="font-bold">Non riesco a leggere la classifica adesso. Riprova più tardi.</p>}
        </div>
      )}

      <Sezione id="noi-come" titolo="Come sarà">
        <ol className="flex flex-col gap-2.5">
          {[
            [`Colleghi il ${ECOSYSTEM.accountName}`, 'L\'account facoltativo delle app Project, dalle Impostazioni.'],
            ['Aderisci alla classifica', 'Un permesso a parte, che parte spento: lo dai solo se vuoi.'],
            ['Compari con il tuo @nome utente', 'Gli altri vedono il @nome utente, le domande imparate e il miglior punteggio in simulazione. Niente altro.'],
          ].map(([titolo, testo], i) => (
            <li key={titolo} className="flex gap-3 rounded-[12px] bg-superficie-2 p-3.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-azione text-[14px] font-bold text-azione-su" aria-hidden="true">{i + 1}</span>
              <span className="min-w-0"><span className="block text-[14.5px] leading-[20px] font-bold text-testo">{titolo}</span><span className="block text-[13px] leading-[19px] text-testo-tenue">{testo}</span></span>
            </li>
          ))}
        </ol>
      </Sezione>

      <Sezione id="noi-numeri" titolo="I tuoi numeri, sul tuo dispositivo">
        <div className="grid grid-cols-2 gap-2.5">
          <div className="rounded-[12px] bg-superficie-2 p-3.5">
            <p className="text-[26px] leading-[30px] font-extrabold tabular-nums text-alto-numero">{mio.imparate}</p>
            <p className="mt-0.5 text-[12.5px] leading-[17px] text-testo-tenue">domande imparate</p>
          </div>
          <div className="rounded-[12px] bg-superficie-2 p-3.5">
            <p className={`text-[26px] leading-[30px] font-extrabold tabular-nums ${haSimulazioni ? 'text-azione-scuro' : 'text-testo-tenue'}`}>{haSimulazioni ? `${mio.migliorSimulazione}/30` : '–'}</p>
            <p className="mt-0.5 text-[12.5px] leading-[17px] text-testo-tenue">{haSimulazioni ? 'miglior simulazione' : 'nessuna simulazione ancora'}</p>
          </div>
        </div>
        <p className="text-[13px] leading-[19px] text-testo-tenue">
          Sono i due numeri che la classifica userebbe: restano qui finché non aderisci e non sono una posizione.
        </p>
      </Sezione>

      <div className="mt-6 flex flex-col gap-2.5">
        {daCollegare && <BottoneAzione onClick={apriImpostazioni}>Apri le Impostazioni</BottoneAzione>}
        {haClassificaAmici && (daCollegare
          ? <BottoneSecondario onClick={() => vai('classifica')}>Vai alla classifica tra amici</BottoneSecondario>
          : <BottoneAzione onClick={() => vai('classifica')}>Vai alla classifica tra amici</BottoneAzione>)}
        <BottoneSecondario onClick={() => vai('projectid')}>{`Cos'è il ${ECOSYSTEM.accountName}`}</BottoneSecondario>
        {!haClassificaAmici && <BottoneSecondario onClick={vaiHome}>Torna alla Home</BottoneSecondario>}
      </div>
    </Pagina>
  );
}
