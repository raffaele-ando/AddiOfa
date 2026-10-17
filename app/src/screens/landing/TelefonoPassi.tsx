import { useState, type ReactNode } from 'react';
import { Icona, type NomeIcona } from '../../brand/icone/Icona';
import { Illustrazione } from '../../brand/Illustrazione';
import { cn } from '../../lib/utils';

/**
 * «Come funziona» da telefono (concept 12 e 45): un telefono vero, grande, a tutta colonna, con la schermata del passo scelto
 * (Test iniziale → Ripasso → Allenati → Supera l'OFA); si cambia passo toccando 1-4, subito, senza animazioni.
 * Le schermate sono disegnate con i token dell'app, ferme, con un valore d'esempio dichiarato tale («Esempio»).
 */

const OPZIONI = ['go', 'goes', 'going', 'to go'];
const LETTERE = ['A', 'B', 'C', 'D'];

function Dash({ pieni, di }: { pieni: number; di: number }) {
  return (
    <div className="flex gap-1">{Array.from({ length: di }, (_, i) => <span key={i} className={cn('h-1.5 flex-1 rounded-full', i < pieni ? 'bg-azione' : 'bg-linea')} />)}</div>
  );
}

function SchermoTest() {
  return (
    <div className="flex h-full flex-col gap-3">
      <Dash pieni={3} di={10} />
      <p className="text-[11px] font-semibold text-testo-tenue">3/10</p>
      <p className="text-[15px] font-extrabold leading-snug text-testo">She _____ to Milan every day.</p>
      <ul className="flex flex-col gap-2">
        {OPZIONI.map((o, i) => (
          <li key={o} className={cn('flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-[13px] font-bold', i === 1 ? 'border-azione bg-azione-tinta text-azione-testo' : 'border-linea bg-superficie text-testo')}>
            <span className={cn('grid h-4 w-4 place-items-center rounded-full border-2', i === 1 ? 'border-azione bg-azione' : 'border-tacca')} />{o}
          </li>
        ))}
      </ul>
      <div className="mt-auto rounded-xl bg-azione py-3 text-center text-[13px] font-bold text-azione-su">Avanti</div>
    </div>
  );
}

function SchermoRipasso() {
  const tessere: { icona: NomeIcona; nome: string }[] = [
    { icona: 'modo-punti-deboli', nome: 'Punti deboli' }, { icona: 'modo-blitz', nome: 'Blitz' },
    { icona: 'modo-richiamo', nome: 'Richiamo' }, { icona: 'modo-argomento', nome: 'Argomento' },
  ];
  return (
    <div className="flex h-full flex-col gap-2.5">
      <p className="text-[19px] font-extrabold tracking-[-0.02em] text-testo">Esercizi</p>
      <div className="rounded-2xl bg-azione-tinta p-3">
        <div className="flex justify-center"><Illustrazione nome="quiz-test" kit="kit-luminoso" lato={84} /></div>
        <div className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-azione py-2.5 text-[13px] font-bold text-azione-su"><Icona nome="studia" size={16} />Intelligente</div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {tessere.map(t => (
          <div key={t.nome} className="flex flex-col items-center gap-1.5 rounded-xl bg-superficie-2 py-3 text-[11.5px] font-bold text-testo">
            <Icona nome={t.icona} size={22} className="text-azione-testo" />{t.nome}
          </div>
        ))}
      </div>
    </div>
  );
}

function SchermoSimulazione() {
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1 rounded-full bg-medio-tinta px-2.5 py-1 text-[12px] font-extrabold text-medio-testo"><Icona nome="tempo" size={13} />14:32</span>
        <span className="ml-auto text-[11px] font-semibold text-testo-tenue">12/30</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-linea"><div className="h-full w-[40%] rounded-full bg-azione" /></div>
      <p className="text-[15px] font-extrabold leading-snug text-testo">I have _____ finished my dinner.</p>
      <ul className="flex flex-col gap-2">
        {['ever', 'already', 'yet', 'since'].map((o, i) => (
          <li key={o} className={cn('flex items-center gap-2.5 rounded-xl border px-2.5 py-2 text-[13px] font-bold', i === 1 ? 'border-azione bg-azione-tinta text-azione-testo' : 'border-linea bg-superficie text-testo')}>
            <span className={cn('grid h-6 w-6 place-items-center rounded-full text-[11px]', i === 1 ? 'bg-azione text-azione-su' : 'bg-superficie-2 text-testo-tenue')}>{LETTERE[i]}</span>{o}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SchermoEsito() {
  return (
    <div className="flex h-full flex-col items-center gap-2 text-center">
      <Illustrazione nome="celebrazione" lato={96} />
      <p className="text-[34px] font-extrabold leading-none tracking-[-0.03em] text-testo">27<span className="text-[16px] text-testo-tenue">/30</span></p>
      <span className="flex items-center gap-1 rounded-full bg-alto-tinta px-3 py-1 text-[12px] font-extrabold text-alto-testo"><Icona nome="stato-ok" size={14} />Superata</span>
      <div className="mt-2 grid w-full grid-cols-3 gap-2">
        {[['27', 'stato-risposta-giusta'], ['3', 'stato-risposta-sbagliata'], ['0', 'stato-risposta-omessa']].map(([n, ic]) => (
          <div key={ic} className="flex flex-col items-center gap-1 rounded-xl bg-superficie-2 py-2 text-[15px] font-extrabold text-testo"><Icona nome={ic as NomeIcona} size={16} className="text-testo-tenue" />{n}</div>
        ))}
      </div>
      <div className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-azione py-3 text-[13px] font-bold text-azione-su"><Icona nome="correzioni" size={15} />Correzioni</div>
    </div>
  );
}

type Passo = { n: number; titolo: string; testo: string; pillola: { icona: NomeIcona; testo: string; lato: 'sx' | 'dx' }; tab: 'home' | 'esercizi' | 'sfide'; Schermo: () => ReactNode };
const PASSI: Passo[] = [
  { n: 1, titolo: 'Test iniziale', testo: 'Scopri il tuo livello e la probabilità di superare l\'OFA.', pillola: { icona: 'diagnostico', testo: 'Diagnostico', lato: 'sx' }, tab: 'home', Schermo: SchermoTest },
  { n: 2, titolo: 'Ripasso su misura', testo: 'Ripassi ciò che sbagli: domande, quiz mirati e teoria in italiano.', pillola: { icona: 'errori', testo: 'Punti deboli', lato: 'dx' }, tab: 'esercizi', Schermo: SchermoRipasso },
  { n: 3, titolo: 'Allenati', testo: 'Simulazioni nel formato del test, con timer e correzioni dettagliate.', pillola: { icona: 'simulazioni', testo: '30 · 15 min', lato: 'sx' }, tab: 'home', Schermo: SchermoSimulazione },
  { n: 4, titolo: 'Supera l\'OFA', testo: 'Togli l\'OFA e vai avanti con il piano degli studi.', pillola: { icona: 'obiettivi', testo: 'Obiettivo raggiunto', lato: 'dx' }, tab: 'home', Schermo: SchermoEsito },
];
const SCHEDE: { id: 'home' | 'esercizi' | 'sfide'; icona: NomeIcona; nome: string }[] = [
  { id: 'home', icona: 'home', nome: 'Home' }, { id: 'esercizi', icona: 'esercizi', nome: 'Esercizi' }, { id: 'sfide', icona: 'sfide', nome: 'Sfide' },
];

export default function TelefonoPassi() {
  const [attivo, setAttivo] = useState(0);
  const p = PASSI[attivo];
  const Schermo = p.Schermo;
  return (
    <div data-scheda className="mt-8 lg:hidden">
      {/* scelta del passo: quattro cerchi numerati con il nome sotto */}
      <div role="group" aria-label="Passi" className="grid grid-cols-4 gap-1" data-testo-ok>
        {PASSI.map((x, i) => {
          const on = i === attivo;
          return (
            <button key={x.n} type="button" aria-pressed={on} onClick={() => setAttivo(i)} className="brand-premibile flex flex-col items-center gap-1.5 rounded-2xl px-1 py-2">
              <span className={cn('grid h-11 w-11 place-items-center rounded-full text-[15px] font-extrabold transition-colors duration-100', on ? 'bg-azione text-azione-su' : 'bg-azione-tinta text-azione-testo')}>{x.n}</span>
              <span className={cn('text-[11.5px] leading-tight font-bold', on ? 'text-testo' : 'text-testo-tenue')}>{x.titolo.replace('Supera l\'OFA', 'Supera')}</span>
            </button>
          );
        })}
      </div>

      {/* il telefono, a tutta colonna, su una lastra blu inclinata come nei concept */}
      <div className="relative mx-auto mt-6 w-full max-w-[330px] pb-4 pt-5">
        <div aria-hidden className="absolute left-1/2 top-1/2 h-[92%] w-[82%] -translate-x-1/2 -translate-y-1/2 rotate-[5deg] rounded-[44px] bg-gradient-to-br from-azione-tinta via-azione/25 to-azione/45" />
        <div className={cn('absolute top-0 z-10', p.pillola.lato === 'sx' ? 'left-0' : 'right-0')} aria-hidden>
          <span className="flex items-center gap-2 whitespace-nowrap rounded-full border border-linea bg-superficie px-3 py-2 text-[12px] font-bold text-testo shadow-[0_10px_24px_rgba(15,23,42,0.14)] dark:shadow-none">
            <Icona nome={p.pillola.icona} size={15} className="text-azione-testo" />{p.pillola.testo}
          </span>
        </div>
        <div aria-hidden data-testo-ok className="relative mx-auto w-[262px] overflow-hidden rounded-[40px] border-[8px] border-[var(--landing-blocco-scuro-da)] bg-fondo shadow-[0_30px_60px_rgba(30,64,175,0.28)] dark:border-tacca dark:shadow-none">
          <div className="mx-auto mt-2 h-4 w-20 rounded-full bg-[var(--landing-blocco-scuro-da)] dark:bg-tacca" />
          <div className="flex items-center justify-between px-4 pt-2 text-[10px] font-bold text-testo-tenue">
            <span>9:41</span><span className="rounded-full bg-azione-tinta px-2 py-0.5 text-azione-testo">Esempio</span>
          </div>
          <div className="h-[384px] px-4 pb-3 pt-3"><Schermo /></div>
          <div className="flex justify-around border-t border-linea bg-superficie py-2">
            {SCHEDE.map(s => (
              <span key={s.id} className={cn('flex flex-col items-center gap-0.5 text-[10px] font-bold', s.id === p.tab ? 'text-azione-testo' : 'text-testo-tenue')}>
                <Icona nome={s.icona} size={18} />{s.nome}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-2 text-center" data-testo-ok aria-live="polite">
        <h3 className="text-lg font-extrabold text-testo">{p.n}. {p.titolo}</h3>
        <p className="mx-auto mt-1 max-w-[20rem] text-[14px] leading-snug text-testo-tenue">{p.testo}</p>
      </div>
    </div>
  );
}
