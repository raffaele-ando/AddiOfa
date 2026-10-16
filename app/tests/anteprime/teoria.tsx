// Anteprima isolata della schermata Teoria. Solo per lavorare in locale.
// Uso: http://localhost:<porta>/tests/anteprime/teoria.html?  tema=dark  dati=finti|reali  aperto=<id>
// Con dati=finti riempie alcune schede in memoria (theory.ts non si tocca).
import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../../src/index.css';
import { Layout } from '../../src/components/Layout';
import { theoryTopics } from '../../src/data/theory';

const q = new URLSearchParams(location.search);
if (q.get('tema') === 'dark') document.documentElement.classList.add('dark');

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

const { default: Theory } = await import('../../src/screens/Theory');

function App() {
  const [log, setLog] = useState('');
  return (
    <>
      <Layout>
        <Theory onBack={() => setLog('back')} initialTopicId={q.get('aperto') ?? undefined} />
      </Layout>
      <output id="log" className="sr-only">{log}</output>
    </>
  );
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
