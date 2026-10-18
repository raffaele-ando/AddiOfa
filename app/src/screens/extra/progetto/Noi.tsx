// «NOI» (concept 49 schermate 11-13, 30/34): la classifica. Quella vera la dà ATLAS, e solo se risponde: se non è collegato o non risponde, la schermata lo dice
// con una riga e non mostra nessuna posizione, nessun utente, nessun numero inventato. Entrare è una casella a parte (spenta di partenza), che si spegne
// da qui con un tocco: il punteggio sparisce subito e l'account resta. Serve il Project ID (con l'età dichiarata lì); il nome in classifica è il @nome utente.
import { useCallback, useEffect, useState } from 'react';
import { Illustrazione } from '../../../brand/Illustrazione';
import { Icona } from '../../../brand/icone/Icona';
import { useExtra } from '../contesto';
import { SCHERMATE } from '../registro';
import { BottoneSecondario, Nota, Pagina, Sezione, Testata } from './comuni';
import { CasellaConsenso } from './registrazione';
import { messaggioErrore, useAccesso, useSincronizzaCollegamento } from './hooks';
import { atlas, type Leaderboard } from '../../../lib/atlas';
import { INFORMATIVA_NOI } from '../../../lib/progetto/informativa';
import { leggiProgetto } from '../../../lib/progetto/profilo';
import { statoNoi, valoriNoi, type StatoNoi } from '../../../lib/progetto/noi';
import { ECOSYSTEM } from '../../../config/ecosystem';
import { cn } from '../../../lib/utils';

const TESTO_STATO: Partial<Record<StatoNoi, { titolo: string; testo: string }>> = {
  'non-collegato': { titolo: 'Non collegato', testo: `${ECOSYSTEM.engineName} non è collegato in questa versione: non c'è nessuna classifica da mostrare. I tuoi numeri restano su questo dispositivo.` },
  'senza-accesso': { titolo: 'Solo lettura', testo: 'In questa versione non c\'è l\'accesso: puoi leggere la classifica ma non entrarci.' },
  'da-accedere': { titolo: 'Serve il Project ID', testo: `Per entrare in classifica serve il ${ECOSYSTEM.accountName}. Poi decidi tu se entrare: finché non lo fai nessuno vede niente di te.` },
};

type Dati = { fase: 'carico' } | { fase: 'ok'; classifica: Leaderboard } | { fase: 'errore'; testo: string };
const MEDAGLIA = ['bg-medio-pieno text-medio-su', 'bg-testo-tenue text-azione-su', 'bg-basso-pieno text-basso-su'];

export default function Noi() {
  const { appState, aggiorna, vai } = useExtra();
  const { collegamento } = leggiProgetto(appState);
  const acc = useAccesso(!!collegamento);
  useSincronizzaCollegamento(acc.me, aggiorna);
  // il punteggio si invia solo se è il servizio a dire che si partecipa (altrimenti darebbe 403)
  const inClassifica = !!acc.me?.consensi.noi;
  const stato = statoNoi({ atlasOnline: acc.atlasOnline, loginDisponibile: acc.loginDisponibile, connesso: !!acc.utente, inClassifica });
  const mio = valoriNoi(appState);
  const haSimulazioni = (appState.history ?? []).length > 0;
  const [dati, setDati] = useState<Dati>({ fase: 'carico' });
  const attesaAccount = !!acc.utente && !acc.me && !acc.errore;

  // Con ATLAS configurato: se si partecipa si aggiorna prima il proprio punteggio (i numeri veri di questo dispositivo), poi si legge la classifica.
  const carica = useCallback(async () => {
    if (!acc.atlasOnline) return;
    setDati({ fase: 'carico' });
    try {
      if (inClassifica) await atlas.postScore(ECOSYSTEM.appId, mio.imparate, mio.migliorSimulazione);
      setDati({ fase: 'ok', classifica: await atlas.leaderboard(ECOSYSTEM.appId) });
    } catch (e) {
      setDati({ fase: 'errore', testo: messaggioErrore(e) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [acc.atlasOnline, inClassifica, mio.imparate, mio.migliorSimulazione]);
  useEffect(() => { if (!acc.controllo && !attesaAccount) void carica(); }, [carica, acc.controllo, attesaAccount]);

  const cambia = async (entra: boolean) => {
    const r = await acc.esegui(() => atlas.modifica({ consensi: { noi: entra } }));
    if (r) acc.impostaMe(r);
  };

  const t = TESTO_STATO[stato];
  const c = dati.fase === 'ok' ? dati.classifica : null;

  return (
    <Pagina titolo={ECOSYSTEM.rankingName}>
      <Testata nome="successo" lato={130} />

      {!acc.controllo && t && (
        <Nota tono={stato === 'non-collegato' ? 'attenzione' : 'neutro'} className="mt-4">
          <p className="font-bold" data-testo-ok>{t.titolo}</p>
          <p className="mt-0.5" data-testo-ok>{t.testo}</p>
        </Nota>
      )}

      {acc.utente && acc.me && (
        <Sezione id="noi-casella" titolo="La tua partecipazione">
          <CasellaConsenso spuntata={inClassifica} onChange={v => { void cambia(v); }} occupato={acc.occupato}
            titolo={`Voglio comparire nella classifica ${ECOSYSTEM.rankingName}`}
            testo="Si vedono il mio @nome utente, le domande imparate e il miglior punteggio in simulazione, e li vedono tutti i partecipanti. Posso uscire quando voglio da qui, con un tocco, e il mio punteggio sparisce subito. Non cambia nulla nello studio."
            informativa={INFORMATIVA_NOI()}>
            <p data-testo-ok className="text-[13px] leading-[18px] font-semibold text-testo">Ti vedranno come @{acc.me.account.handle}. Lo cambi in {ECOSYSTEM.accountName}.</p>
          </CasellaConsenso>
          {acc.errore && <p role="alert" data-testo-ok className="rounded-[12px] bg-errore-tinta p-3 text-center text-[13px] font-bold text-errore-testo">{acc.errore}</p>}
        </Sezione>
      )}

      {acc.atlasOnline && (
        <Sezione id="noi-classifica" titolo="Classifica">
          {dati.fase === 'carico' && <div role="status" aria-label="Carico la classifica" className="mx-auto my-3 h-7 w-7 animate-spin rounded-full border-[3px] border-azione/30 border-t-azione" />}
          {dati.fase === 'errore' && (
            <div role="alert" className="flex flex-col items-center gap-2 rounded-[14px] bg-errore-tinta p-4 text-center">
              <p data-testo-ok className="text-[14px] font-bold text-errore-testo">{dati.testo}</p>
              <BottoneSecondario onClick={() => { void carica(); }} icona={<Icona nome="riprova" size={18} />}>Riprova</BottoneSecondario>
            </div>
          )}
          {c && c.me && (
            <div role="status" className="flex items-center justify-between rounded-[14px] bg-azione-tinta p-4 text-azione-testo">
              <span className="font-bold">La tua posizione</span>
              <span className="text-[26px] font-extrabold tabular-nums">#{c.me.rank} <span className="text-[14px] font-bold">su {c.total}</span></span>
            </div>
          )}
          {c && c.entries.length > 0 && (
            <ol className="flex flex-col gap-2">
              {c.entries.map(e => (
                <li key={e.handle} className={cn('flex items-center gap-3 rounded-[14px] p-3', e.isMe ? 'bg-azione-tinta' : 'bg-superficie-2')}>
                  <span className={cn('grid h-8 w-8 shrink-0 place-items-center rounded-full text-[14px] font-bold tabular-nums', e.rank <= 3 ? MEDAGLIA[e.rank - 1] : 'bg-superficie text-testo-tenue')}>{e.rank}</span>
                  {/* solo il @nome utente: è ciò che il consenso dice che si vede */}
                  <span data-testo-ok className="min-w-0 flex-1 truncate text-[15px] font-bold text-testo">@{e.handle}{e.isMe ? ' (tu)' : ''}</span>
                  <span className="text-right leading-tight"><span className="block font-bold tabular-nums text-alto-testo">{e.mastered}</span><span className="block text-[11px] font-bold text-testo-tenue tabular-nums">imparate · {e.bestSim}/30</span></span>
                </li>
              ))}
            </ol>
          )}
          {c && c.entries.length === 0 && (
            <div role="status" className="flex flex-col items-center gap-1 py-3 text-center">
              <Illustrazione nome="vuoto" lato={110} />
              <p data-testo-ok className="text-[14.5px] font-bold text-testo-tenue">Ancora nessuno in classifica</p>
            </div>
          )}
        </Sezione>
      )}

      <Sezione id="noi-numeri" titolo="I tuoi numeri">
        <div className="grid grid-cols-2 gap-2.5">
          <div className="rounded-[12px] bg-superficie-2 p-3.5">
            <p className="text-[26px] leading-[30px] font-extrabold tabular-nums text-alto-numero">{mio.imparate}</p>
            <p data-testo-ok className="mt-0.5 text-[12.5px] leading-[17px] text-testo-tenue">domande imparate</p>
          </div>
          <div className="rounded-[12px] bg-superficie-2 p-3.5">
            <p className={cn('text-[26px] leading-[30px] font-extrabold tabular-nums', haSimulazioni ? 'text-azione-testo' : 'text-testo-tenue')}>{haSimulazioni ? `${mio.migliorSimulazione}/30` : '–'}</p>
            <p data-testo-ok className="mt-0.5 text-[12.5px] leading-[17px] text-testo-tenue">{haSimulazioni ? 'miglior simulazione' : 'nessuna simulazione'}</p>
          </div>
        </div>
        <p data-testo-ok className="text-[12.5px] leading-[18px] text-testo-tenue">Dati di questo dispositivo: la classifica li usa solo se la casella è accesa. Non sono una posizione.</p>
      </Sezione>

      <div className="mt-6 flex flex-col gap-2.5">
        {(stato === 'da-accedere' || stato === 'da-aderire' || stato === 'aderito') && <BottoneSecondario onClick={() => vai('projectid')} icona={<Icona nome="projectid" size={20} />}>{ECOSYSTEM.accountName}</BottoneSecondario>}
        {'classifica' in SCHERMATE && <BottoneSecondario onClick={() => vai('classifica')} icona={<Icona nome="amici" size={20} />}>Tra amici</BottoneSecondario>}
      </div>
    </Pagina>
  );
}
