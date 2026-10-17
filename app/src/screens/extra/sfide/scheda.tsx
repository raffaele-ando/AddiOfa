// La pagina «Sfide» della barra (Home | Esercizi | Sfide): titolo, profilo e «i» in testata, sotto il selettore a tre voci Oggi | Amici | Classifica
// (icona e nome su ogni voce, come nel concept 06: la voce aperta in tinta blu). La «i» sta accanto al profilo: le regole si aprono lì.
// `SchedaProveSfide` resta per la scheda Simulazioni (area studio), che la usa con `sezione="prove"`: lì la testata è quella di prima.
import { useState, type ReactNode } from 'react';
import { Icona, type NomeIcona } from '../../../brand/icone/Icona';
import { FONT } from '../../../brand/tokens';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';
import { useExtra } from '../contesto';
import { FoglioInfo, PulsanteInfo, TestataScheda } from '../ui';

export type SezioneScheda = 'prove' | 'sfide' | 'amici' | 'classifica';


/** Le tre voci della pagina Sfide: la sfida del giorno (e il duello), gli amici, la classifica. */
const VOCI: ReadonlyArray<{ id: 'sfide' | 'amici' | 'classifica'; icona: NomeIcona; nome: string }> = [
  { id: 'sfide', icona: 'sfida-giorno', nome: 'Oggi' },
  { id: 'amici', icona: 'amici', nome: 'Amici' },
  { id: 'classifica', icona: 'classifica', nome: 'Classifica' },
];

/** Selettore a tre voci: una pillola con tre segmenti uguali, icona e nome su tutti; quello aperto in tinta blu (non un pulsante pieno). */
function SelettoreSfide({ sezione }: { sezione: SezioneScheda }) {
  const { vai } = useExtra();
  return (
    <nav aria-label="Sezioni delle sfide" className="mt-3 flex gap-1 rounded-full bg-superficie-2 p-1">
      {VOCI.map(v => {
        const on = v.id === sezione;
        return (
          <button key={v.id} type="button" aria-current={on ? 'page' : undefined}
            onClick={() => { if (!on) { playTapSound(); vai(v.id); } }}
            className={cn('flex h-11 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full border text-[14px] font-bold transition-colors duration-100',
              on ? 'border-azione/40 bg-azione-tinta text-azione-scuro' : 'border-transparent text-testo-tenue hover:text-testo')}>
            <Icona nome={v.icona} size={20} /><span className="truncate">{v.nome}</span>
          </button>
        );
      })}
    </nav>
  );
}


/** Cornice della pagina: testata, selettore, contenuto e (se c'è) il foglio della «i».
 *  Per `sfide`, `amici` e `classifica` la testata dice «Sfide»; per `prove` (le simulazioni, aperte dalla Home) c'è la freccia di ritorno. */
export function SchedaProveSfide({ sezione, info, titoloInfo = 'Regole', children }: {
  sezione: SezioneScheda; info?: ReactNode; titoloInfo?: string; children: ReactNode;
}) {
  const { vai, indietro } = useExtra();
  const [aperto, setAperto] = useState(false);
  const prove = sezione === 'prove';
  return (
    <div className="relative h-full w-full bg-superficie text-testo sm:rounded-[28px] sm:border sm:border-linea overflow-hidden flex flex-col" style={{ fontFamily: FONT }}>
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
        <div className="mx-auto w-full max-w-[440px] px-6 pt-[max(14px,env(safe-area-inset-top))] pb-8">
          {prove ? (
            // Le simulazioni si aprono dalla Home: freccia di ritorno e «i», niente selettore né profilo (Sfide ha la sua voce in barra).
            <header className="flex items-center gap-1">
              <button type="button" onClick={() => indietro()} aria-label="Indietro"
                className="brand-premibile -ml-3 grid h-10 w-10 shrink-0 place-items-center rounded-full text-testo-tenue hover:text-testo">
                <Icona nome="indietro" size={28} />
              </button>
              <h1 className="min-w-0 flex-1 text-[26px] leading-[40px] font-extrabold tracking-[-0.02em] text-testo">Simulazioni</h1>
              {info && <PulsanteInfo onClick={() => setAperto(true)} etichetta={titoloInfo} />}
            </header>
          ) : (
            <>
              <TestataScheda titolo="Sfide" onProfilo={() => vai('profilo')}
                destra={info ? <PulsanteInfo onClick={() => setAperto(true)} etichetta={titoloInfo} /> : undefined} />
              <SelettoreSfide sezione={sezione} />
            </>
          )}
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
