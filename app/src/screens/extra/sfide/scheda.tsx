// La scheda «Simulazioni» con le sue due metà: Prove e Sfide. Stessa testata (titolo + profilo a destra), stessa barra in basso evidenziata;
// un selettore a due icone passa da una metà all'altra, e dentro Sfide un secondo a tre icone (sfide, amici, classifica).
// La «i» sta sempre accanto al profilo: le regole non si scrivono in pagina, si aprono lì.
import { useState, type ReactNode } from 'react';
import { Icona, type NomeIcona } from '../../../brand/icone/Icona';
import { FONT } from '../../../brand/tokens';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';
import { useExtra } from '../contesto';
import { FoglioInfo, PulsanteInfo, TestataScheda } from '../ui';

export type SezioneScheda = 'prove' | 'sfide' | 'amici' | 'classifica';

const META: ReadonlyArray<{ id: 'prove' | 'sfide'; vista: string; icona: NomeIcona; nome: string }> = [
  { id: 'prove', vista: 'simulazioni', icona: 'simulazioni', nome: 'Prove' },
  { id: 'sfide', vista: 'sfide', icona: 'sfide', nome: 'Sfide' },
];

const SOTTO: ReadonlyArray<{ id: 'sfide' | 'amici' | 'classifica'; icona: NomeIcona; nome: string }> = [
  { id: 'sfide', icona: 'sfide', nome: 'Sfide' },
  { id: 'amici', icona: 'amici', nome: 'Amici' },
  { id: 'classifica', icona: 'classifica', nome: 'Classifica' },
];

/** Il selettore Prove | Sfide: due segmenti con icona e una parola, quello aperto in tinta blu (non è un pulsante pieno). */
function SelettoreMeta({ sezione }: { sezione: SezioneScheda }) {
  const { vai } = useExtra();
  const attiva = sezione === 'prove' ? 'prove' : 'sfide';
  return (
    <nav aria-label="Prove e sfide" className="mt-3 flex gap-1 rounded-full bg-superficie-2 p-1">
      {META.map(m => {
        const on = m.id === attiva;
        return (
          <button key={m.id} type="button" aria-current={on ? 'page' : undefined} aria-label={m.nome}
            onClick={() => { if (!(on && sezione === m.id)) { playTapSound(); vai(m.vista); } }}
            className={cn('flex h-11 flex-1 items-center justify-center gap-2 rounded-full border text-[14.5px] font-bold transition-colors duration-100',
              on ? 'border-azione/40 bg-azione-tinta text-azione-scuro' : 'border-transparent text-testo-tenue hover:text-testo')}>
            <Icona nome={m.icona} size={22} />{m.nome}
          </button>
        );
      })}
    </nav>
  );
}

/** I tre segmenti dentro Sfide: solo icone; quello aperto mostra anche il nome ed è sottolineato. */
function SelettoreSfide({ sezione }: { sezione: SezioneScheda }) {
  const { vai } = useExtra();
  return (
    <nav aria-label="Sezioni delle sfide" className="mt-3 flex border-b border-linea">
      {SOTTO.map(s => {
        const on = s.id === sezione;
        return (
          <button key={s.id} type="button" aria-current={on ? 'page' : undefined} aria-label={s.nome}
            onClick={() => { if (!on) { playTapSound(); vai(s.id); } }}
            className={cn('-mb-px flex h-11 flex-1 items-center justify-center gap-1.5 border-b-2 text-[13.5px] font-bold transition-colors duration-100',
              on ? 'border-azione text-azione-scuro' : 'border-transparent text-testo-tenue hover:text-testo')}>
            <Icona nome={s.icona} size={22} />{on && s.nome}
          </button>
        );
      })}
    </nav>
  );
}

/** Cornice della scheda: testata, selettori, contenuto e (se c'è) il foglio della «i». */
export function SchedaProveSfide({ sezione, info, titoloInfo = 'Regole', children }: {
  sezione: SezioneScheda; info?: ReactNode; titoloInfo?: string; children: ReactNode;
}) {
  const { vai } = useExtra();
  const [aperto, setAperto] = useState(false);
  return (
    <div className="relative h-full w-full bg-superficie text-testo sm:rounded-[28px] sm:border sm:border-linea overflow-hidden flex flex-col" style={{ fontFamily: FONT }}>
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
        <div className="mx-auto w-full max-w-[440px] px-6 pt-[max(14px,env(safe-area-inset-top))] pb-8">
          <TestataScheda titolo="Simulazioni" onProfilo={() => vai('profilo')}
            destra={info ? <PulsanteInfo onClick={() => setAperto(true)} etichetta={titoloInfo} /> : undefined} />
          <SelettoreMeta sezione={sezione} />
          {sezione !== 'prove' && <SelettoreSfide sezione={sezione} />}
          {children}
        </div>
      </div>
      {info && <FoglioInfo aperto={aperto} onChiudi={() => setAperto(false)} titolo={titoloInfo}>{info}</FoglioInfo>}
    </div>
  );
}

/** Elenco di regole brevi per il foglio della «i»: una riga per regola. */
export function Regole({ righe }: { righe: ReactNode[] }) {
  return (
    <ul className="flex list-disc flex-col gap-2 pl-5 marker:text-testo-tenue">
      {righe.map((r, i) => <li key={i}>{r}</li>)}
    </ul>
  );
}
