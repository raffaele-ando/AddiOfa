import type { ReactNode } from 'react';
import { Icona, type NomeIcona } from '../../brand/icone/Icona';
import { Illustrazione } from '../../brand/Illustrazione';
import { EXAM } from '../../config/offer';
import { cn } from '../../lib/utils';

/**
 * Telefono e schermate d'esempio della landing (hero da 1024 px e «Come funziona»): la cornice di un telefono con la barra in basso e le schermate
 * dell'app disegnate con gli stessi token, ferme. Ogni schermata porta la scritta «Esempio» (11 px) perché i valori sono d'esempio, non dati di nessuno.
 * Testo minimo 11 px in tutto il telefono; il corpo delle schermate sta a 13-15 px.
 */

const OPZIONI = ['go', 'goes', 'going', 'to go'];
const LETTERE = ['A', 'B', 'C', 'D'];

function Dash({ pieni, di }: { pieni: number; di: number }) {
  return (
    <div className="flex gap-1">{Array.from({ length: di }, (_, i) => <span key={i} className={cn('h-1.5 flex-1 rounded-full', i < pieni ? 'bg-azione' : 'bg-linea')} />)}</div>
  );
}

export function SchermoTest() {
  return (
    <div className="flex h-full flex-col gap-3">
      <Dash pieni={3} di={10} />
      <p className="text-[12px] font-semibold text-testo-tenue">3/10</p>
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

export function SchermoRipasso() {
  const tessere: { icona: NomeIcona; nome: string }[] = [
    { icona: 'modo-punti-deboli', nome: 'Punti deboli' }, { icona: 'modo-blitz', nome: 'Blitz' },
    { icona: 'modo-richiamo', nome: 'Richiamo' }, { icona: 'modo-argomento', nome: 'Argomento' },
  ];
  return (
    <div className="flex h-full flex-col gap-2.5">
      <p className="text-[19px] font-extrabold tracking-[-0.02em] text-testo">Esercizi</p>
      <div className="rounded-2xl bg-azione-tinta p-3">
        <div className="flex justify-center"><Illustrazione nome="quiz-test-lista" lato={84} /></div>
        <div className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-azione py-2.5 text-[13px] font-bold text-azione-su"><Icona nome="studia" size={16} />Allenamento consigliato</div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {tessere.map(t => (
          <div key={t.nome} className="flex flex-col items-center gap-1.5 rounded-xl bg-superficie-2 py-3 text-[12px] font-bold text-testo">
            <Icona nome={t.icona} size={22} className="text-azione-testo" />{t.nome}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SchermoSimulazione() {
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1 rounded-full bg-medio-tinta px-2.5 py-1 text-[12px] font-extrabold text-medio-testo"><Icona nome="tempo" size={13} />14:32</span>
        <span className="ml-auto text-[12px] font-semibold text-testo-tenue">12/{EXAM.questions}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-linea"><div className="h-full w-[40%] rounded-full bg-azione" /></div>
      <p className="text-[15px] font-extrabold leading-snug text-testo">I have _____ finished my dinner.</p>
      <ul className="flex flex-col gap-2">
        {['ever', 'already', 'yet', 'since'].map((o, i) => (
          <li key={o} className={cn('flex items-center gap-2.5 rounded-xl border px-2.5 py-2 text-[13px] font-bold', i === 1 ? 'border-azione bg-azione-tinta text-azione-testo' : 'border-linea bg-superficie text-testo')}>
            <span className={cn('grid h-6 w-6 place-items-center rounded-full text-[12px]', i === 1 ? 'bg-azione text-azione-su' : 'bg-superficie-2 text-testo-tenue')}>{LETTERE[i]}</span>{o}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Esito d'esempio di una simulazione: i numeri sono inventati per mostrare com'è fatta la schermata e lo dice la scritta «Esempio» sul telefono. */
export function SchermoEsito() {
  return (
    <div className="flex h-full flex-col items-center gap-2 text-center">
      <Illustrazione nome="superamento" lato={96} />
      <p className="text-[34px] font-extrabold leading-none tracking-[-0.03em] text-testo">27<span className="text-[16px] text-testo-tenue">/{EXAM.questions}</span></p>
      <span className="flex items-center gap-1 rounded-full bg-alto-tinta px-3 py-1 text-[12px] font-extrabold text-alto-testo"><Icona nome="stato-ok" size={14} />Soglia raggiunta</span>
      <div className="mt-2 grid w-full grid-cols-3 gap-2">
        {[['27', 'stato-risposta-giusta'], ['3', 'stato-risposta-sbagliata'], ['0', 'stato-risposta-omessa']].map(([n, ic]) => (
          <div key={ic} className="flex flex-col items-center gap-1 rounded-xl bg-superficie-2 py-2 text-[15px] font-extrabold text-testo"><Icona nome={ic as NomeIcona} size={16} className="text-testo-tenue" />{n}</div>
        ))}
      </div>
      <div className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-azione py-3 text-[13px] font-bold text-azione-su"><Icona nome="correzioni" size={15} />Correzioni</div>
    </div>
  );
}

export type SchedaTelefono = 'home' | 'esercizi' | 'sfide';
const SCHEDE: { id: SchedaTelefono; icona: NomeIcona; nome: string }[] = [
  { id: 'home', icona: 'home', nome: 'Home' }, { id: 'esercizi', icona: 'esercizi', nome: 'Esercizi' }, { id: 'sfide', icona: 'sfide', nome: 'Sfide' },
];

/**
 * La cornice: bordo scuro, tacca, barra di stato con la scritta «Esempio», la schermata (altezza fissa) e la barra in basso.
 * `larghezza` è quella esterna in px; la schermata non si scala mai, così il testo resta della misura scritta.
 */
export function Telefono({ larghezza = 280, altezzaSchermo = 420, scheda = 'home', children, className }: { larghezza?: number; altezzaSchermo?: number; scheda?: SchedaTelefono; children: ReactNode; className?: string }) {
  return (
    <div aria-hidden data-testo-ok style={{ width: larghezza }} className={cn('relative overflow-hidden rounded-[40px] border-[8px] border-[var(--landing-blocco-scuro-da)] bg-fondo shadow-[0_30px_60px_-20px_rgba(30,64,175,0.45)] dark:border-tacca dark:shadow-none', className)}>
      <div className="mx-auto mt-2 h-4 w-20 rounded-full bg-[var(--landing-blocco-scuro-da)] dark:bg-tacca" />
      <div className="flex items-center justify-between px-4 pt-2 text-[11px] font-bold text-testo-tenue">
        <span>9:41</span><span className="rounded-full bg-azione-tinta px-2 py-0.5 text-azione-testo">Esempio</span>
      </div>
      <div style={{ height: altezzaSchermo }} className="px-4 pb-3 pt-3">{children}</div>
      <div className="flex justify-around border-t border-linea bg-superficie py-2">
        {SCHEDE.map(s => (
          <span key={s.id} className={cn('flex flex-col items-center gap-0.5 text-[11px] font-bold', s.id === scheda ? 'text-azione-testo' : 'text-testo-tenue')}>
            <Icona nome={s.icona} size={18} />{s.nome}
          </span>
        ))}
      </div>
    </div>
  );
}
