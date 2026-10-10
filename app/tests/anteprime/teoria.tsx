// Anteprima isolata della schermata Teoria, con AccessContext finto. Solo per lavorare in locale.
// Uso: http://localhost:<porta>/tests/anteprime/teoria.html?  tema=dark  pass=1  dati=finti|reali  aperto=<id>
// Con dati=finti riempie alcune schede in memoria (theory.ts non si tocca).
import { StrictMode, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../../src/index.css';
import { Layout } from '../../src/components/Layout';
import { AccessContext, type AccessValue } from '../../src/access/context';
import type { DataProvider, Entitlement } from '../../src/access/provider';
import { theoryTopics } from '../../src/data/theory';

const q = new URLSearchParams(location.search);
if (q.get('tema') === 'dark') document.documentElement.classList.add('dark');
const conPass = q.get('pass') === '1';

if (q.get('dati') === 'finti') {
  // indici scelti per avere schede pronte in tutti e tre i livelli
  [0, 1, 3, 2, 5].forEach((i, n) => {
    const t = theoryTopics[i];
    Object.assign(t, {
      pronta: true,
      regola: [
        'Si forma con il *soggetto + verbo base*; alla terza persona singolare si aggiunge **-s**.',
        'Si usa per abitudini, fatti sempre veri e orari fissi: una regola un po\' più lunga per vedere come va a capo la riga di testo a 400 pixel.',
      ],
      esempi: [
        { en: 'She works in a hospital every day.', it: 'Lavora in un ospedale ogni giorno.' },
        { en: 'Water boils at one hundred degrees.', it: "L'acqua bolle a cento gradi." },
        { en: 'Does your brother speak a very long sentence like this one to check wrapping?', it: 'Tuo fratello parla una frase lunghissima?' },
      ],
      errori: [
        { sbagliato: 'She work in a hospital.', giusto: 'She works in a hospital.', perche: 'Alla terza persona singolare il verbo vuole la -s.' },
        { sbagliato: 'Do she like tea?', giusto: 'Does she like tea?', perche: 'Con she, he, it l\'ausiliare è does.' },
      ],
      consiglio: 'Se il soggetto è he, she o it, cerca la *-s* sul verbo prima di rispondere.',
      domande: ['q1', 'q2', 'q3'],
    });
    if (n === 4) t.titolo += ' (titolo molto lungo per provare il ritorno a capo senza scorrimento orizzontale)';
  });
}

const NUOVO: Entitlement = { tier: 'free', source: 'none', expiresAt: null };
const CON_PASS: Entitlement = { tier: 'pass', source: 'demo', expiresAt: Date.now() + 365 * 864e5 };
const provider = { mode: 'demo', track: () => {} } as unknown as DataProvider;

const { default: Theory } = await import('../../src/screens/Theory');

function App() {
  const [ent, setEnt] = useState<Entitlement>(conPass ? CON_PASS : NUOVO);
  const [log, setLog] = useState('');
  const access = useMemo<AccessValue>(() => ({
    provider, entitlement: ent, pass: ent.tier === 'pass', simsDone: 0,
    refresh: async () => {}, unlockDemo: async () => setEnt(CON_PASS), track: () => {},
  }), [ent]);
  return (
    <AccessContext.Provider value={access}>
      <Layout>
        <Theory onBack={() => setLog('back')} onOpenPaywall={() => setLog('paywall')} initialTopicId={q.get('aperto') ?? undefined} />
      </Layout>
      <output id="log" className="sr-only">{log}</output>
      <button id="sblocca" className="sr-only" onClick={() => setEnt(CON_PASS)}>sblocca</button>
    </AccessContext.Provider>
  );
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
