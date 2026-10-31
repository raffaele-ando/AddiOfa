// «NOI» (concept 49 schermate 11-13, 30/34): la classifica. Quella vera la dà ATLAS, e solo se risponde: se non è collegato o non risponde, la schermata lo dice
// con una riga e non mostra nessuna posizione, nessun utente, nessun numero inventato. Partecipare è un permesso a parte, spento di partenza.
import { useCallback, useEffect, useState } from 'react';
import { Illustrazione } from '../../../brand/Illustrazione';
import { Icona } from '../../../brand/icone/Icona';
import { useExtra } from '../contesto';
import { SCHERMATE } from '../registro';
import { BottoneAzione, BottoneSecondario, Nota, Pagina, Sezione, Testata } from './comuni';
import { Carta } from '../ui';
import { linkRemoto, messaggioErrore, useAccesso, useSincronizzaCollegamento } from './hooks';
import { atlas, type Leaderboard } from '../../../lib/atlas';
import { aggiornaProgetto, leggiProgetto } from '../../../lib/progetto/profilo';
import { statoNoi, valoriNoi, type StatoNoi } from '../../../lib/progetto/noi';
import { ECOSYSTEM, REQUIRED_SCOPES, type ScopeId } from '../../../config/ecosystem';
import { cn } from '../../../lib/utils';

const TESTO_STATO: Record<StatoNoi, { titolo: string; testo: string }> = {
  'non-collegato': { titolo: 'Non attiva su questo sito', testo: `La classifica ${ECOSYSTEM.rankingName} non è attiva su questo sito. I tuoi numeri restano su questo dispositivo.` },
  'senza-accesso': { titolo: 'Solo lettura', testo: 'In questa versione non c\'è l\'accesso con Google: puoi leggere la classifica ma non entrarci.' },
  'da-accedere': { titolo: 'Non hai effettuato l\'accesso', testo: `Per entrare in classifica serve il ${ECOSYSTEM.accountName}. Poi decidi tu se aderire.` },
  'da-aderire': { titolo: 'Non hai aderito', testo: 'Finché non aderisci, nessuno vede il tuo nome utente né i tuoi numeri. Se entri, saranno visibili il tuo @nome utente, le domande imparate e il miglior punteggio.' },
  aderito: { titolo: 'Hai aderito', testo: 'Il tuo @nome utente, le domande imparate e il miglior punteggio sono visibili agli altri partecipanti. Puoi uscire quando vuoi.' },
};

type Dati = { fase: 'carico' } | { fase: 'ok'; classifica: Leaderboard } | { fase: 'errore'; testo: string };
const MEDAGLIA = ['bg-medio-pieno text-medio-su', 'bg-testo-tenue text-azione-su', 'bg-basso-pieno text-basso-su'];

export default function Noi() {
  const { appState, aggiorna, vai } = useExtra();
  const { collegamento } = leggiProgetto(appState);
  const acc = useAccesso(!!collegamento);
  useSincronizzaCollegamento(acc.me, aggiorna);
  // il punteggio si invia solo se è il servizio a dire che si partecipa (altrimenti darebbe 403)
  const serverInClassifica = !!linkRemoto(acc.me)?.scopes.includes('noi.leaderboard');
  const inClassifica = !!collegamento?.scopes.includes('noi.leaderboard');
  const stato = statoNoi({ atlasOnline: acc.atlasOnline, loginDisponibile: acc.loginDisponibile, connesso: !!acc.utente, inClassifica });
  const mio = valoriNoi(appState);
  const haSimulazioni = (appState.history ?? []).length > 0;
  const [dati, setDati] = useState<Dati>({ fase: 'carico' });
  const [lavoro, setLavoro] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);

  // Con ATLAS configurato: se si partecipa si aggiorna prima il proprio punteggio (i numeri veri di questo dispositivo), poi si legge la classifica.
  const carica = useCallback(async () => {
    if (!acc.atlasOnline) return;
    setDati({ fase: 'carico' });
    try {
      if (serverInClassifica) await atlas.postScore(ECOSYSTEM.appId, mio.imparate, mio.migliorSimulazione);
      setDati({ fase: 'ok', classifica: await atlas.leaderboard(ECOSYSTEM.appId) });
    } catch (e) {
      setDati({ fase: 'errore', testo: messaggioErrore(e) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [acc.atlasOnline, serverInClassifica, mio.imparate, mio.migliorSimulazione]);
  useEffect(() => { if (!acc.controllo) void carica(); }, [carica, acc.controllo]);

  const cambiaPermesso = async (aderisci: boolean) => {
    setLavoro(true); setErrore(null);
    const scopi = new Set<ScopeId>(collegamento?.scopes ?? REQUIRED_SCOPES);
    if (aderisci) scopi.add('noi.leaderboard'); else scopi.delete('noi.leaderboard');
    const elenco = Array.from(scopi);
    try {
      const r = await atlas.setLink(ECOSYSTEM.appId, elenco);
      const link = r.links.find(l => l.appId === ECOSYSTEM.appId);
      aggiorna(s => aggiornaProgetto(s, p => ({ ...p, collegamento: { scopes: Array.from(new Set([...REQUIRED_SCOPES, ...(link?.scopes ?? elenco)])), collegatoIl: link?.grantedAt ?? Date.now(), aggiornatoIl: Date.now(), projectId: r.account.id, handle: r.account.handle } })));
    } catch (e) { setErrore(messaggioErrore(e)); } finally { setLavoro(false); }
  };

  const t = TESTO_STATO[stato];
  const c = dati.fase === 'ok' ? dati.classifica : null;

  return (
    <Pagina titolo={ECOSYSTEM.rankingName}>
      <Testata nome="successo" />

      {!acc.controllo && (
        <Nota tono={stato === 'aderito' ? 'riuscito' : 'neutro'} className="mt-4">
          <p className="font-bold" data-testo-ok>{t.titolo}</p>
          <p className="mt-0.5" data-testo-ok>{t.testo}</p>
        </Nota>
      )}

      {acc.atlasOnline && (
        <Sezione id="noi-classifica" titolo="Classifica">
          {dati.fase === 'carico' && <div role="status" aria-label="Carico la classifica" className="mx-auto my-3 h-7 w-7 animate-spin rounded-full border-[3px] border-azione/30 border-t-azione" />}
          {dati.fase === 'errore' && (
            <div role="alert" className="flex flex-col items-center gap-2 rounded-[16px] border border-errore/30 bg-errore-tinta p-4 text-center dark:bg-superficie">
              <p data-testo-ok className="text-[14px] font-bold text-errore-testo">{dati.testo}</p>
              <BottoneSecondario onClick={() => { void carica(); }} icona={<Icona nome="riprova" size={18} />}>Riprova</BottoneSecondario>
            </div>
          )}
          {c && c.me && (
            <div role="status" className="flex items-center justify-between rounded-[16px] border border-azione/25 bg-azione-tinta p-4 text-azione-testo dark:border-azione/45 dark:bg-superficie">
              <span className="font-bold">La tua posizione</span>
              <span className="text-[26px] font-extrabold tabular-nums">#{c.me.rank} <span className="text-[14px] font-bold">su {c.total}</span></span>
            </div>
          )}
          {c && c.entries.length > 0 && (
            <ol className="flex flex-col gap-2">
              {c.entries.map(e => (
                <li key={e.handle} className={cn('flex items-center gap-3 rounded-[14px] border p-3', e.isMe ? 'border-azione/40 bg-azione-tinta dark:bg-superficie dark:border-azione/60' : 'border-linea bg-superficie')}>
                  <span className={cn('grid h-8 w-8 shrink-0 place-items-center rounded-full text-[14px] font-bold tabular-nums', e.rank <= 3 ? MEDAGLIA[e.rank - 1] : 'bg-superficie-2 text-testo-tenue')}>{e.rank}</span>
                  {/* solo il @nome utente: è ciò che il consenso dice che si vede */}
                  <span data-testo-ok className="min-w-0 flex-1 truncate text-[15px] font-bold text-testo">@{e.handle}</span>
                  <span className="text-right leading-tight"><span className="block font-bold tabular-nums text-alto-testo">{e.mastered}</span><span className="block text-[12px] font-semibold text-testo-tenue tabular-nums">imparate · {e.bestSim}/30</span></span>
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
        <div className="grid grid-cols-2 gap-3">
          <Carta className="p-3.5">
            <p className="text-[26px] leading-[30px] font-extrabold tabular-nums text-testo">{mio.imparate}</p>
            <p data-testo-ok className="mt-0.5 text-[13px] leading-[18px] text-testo-tenue">domande imparate</p>
          </Carta>
          <Carta className="p-3.5">
            <p className="text-[26px] leading-[30px] font-extrabold tabular-nums text-testo">{haSimulazioni ? `${mio.migliorSimulazione}/30` : '–'}</p>
            <p data-testo-ok className="mt-0.5 text-[13px] leading-[18px] text-testo-tenue">{haSimulazioni ? 'miglior simulazione' : 'nessuna simulazione'}</p>
          </Carta>
        </div>
        <p data-testo-ok className="text-[13px] leading-[18px] text-testo-tenue">Alla classifica arrivano solo se aderisci.</p>
      </Sezione>

      {errore && <p role="alert" data-testo-ok className="mt-4 rounded-[14px] border border-errore/30 bg-errore-tinta p-3 text-center text-[14px] font-bold text-errore-testo dark:bg-superficie">{errore}</p>}
      <div className="mt-6 flex flex-col gap-2.5">
        {stato === 'da-aderire' && <BottoneAzione disabled={lavoro} onClick={() => { void cambiaPermesso(true); }}>Entra in classifica</BottoneAzione>}
        {stato === 'aderito' && <BottoneSecondario disabled={lavoro} onClick={() => { void cambiaPermesso(false); }}>Esci dalla classifica</BottoneSecondario>}
        {(stato === 'da-accedere' || stato === 'da-aderire') && <BottoneSecondario onClick={() => vai('projectid')} icona={<Icona nome="projectid" size={20} />}>{ECOSYSTEM.accountName}</BottoneSecondario>}
        {'classifica' in SCHERMATE && <BottoneSecondario onClick={() => vai('classifica')} icona={<Icona nome="classifica" size={20} />}>Classifica tra amici</BottoneSecondario>}
      </div>
    </Pagina>
  );
}
