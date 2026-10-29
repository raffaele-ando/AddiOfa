// La pagina «Sfide» della barra (Home | Esercizi | Sfide): titolo, profilo e «i» in testata, una riga che dice cosa si fa qui, sotto il selettore a tre voci
// Oggi | Amici | Classifica (le parole, come in tutta l'app: il controllo è `Segmenti` di ../ui). La «i» sta accanto al profilo: le regole si aprono lì.
// `SchedaProveSfide` resta per la scheda Simulazioni (area studio), che la usa con `sezione="prove"`: lì la testata è quella di prima e il fondo resta bianco
// (passando `velata` prende il fondo velato come le altre pagine).
import { useState, type ReactNode } from 'react';
import { Icona } from '../../../brand/icone/Icona';
import { FONT } from '../../../brand/tokens';
import { cn } from '../../../lib/utils';
import { useExtra } from '../contesto';
import { FoglioInfo, PulsanteInfo, Segmenti, TestataScheda } from '../ui';

export type SezioneScheda = 'prove' | 'sfide' | 'amici' | 'classifica';

/** Le tre voci della pagina Sfide: la sfida del giorno (e il duello), gli amici, la classifica. */
const VOCI: ReadonlyArray<{ id: 'sfide' | 'amici' | 'classifica'; nome: string }> = [
  { id: 'sfide', nome: 'Oggi' },
  { id: 'amici', nome: 'Amici' },
  { id: 'classifica', nome: 'Classifica' },
];

/** Selettore a tre voci con le parole. */
function SelettoreSfide({ sezione }: { sezione: SezioneScheda }) {
  const { vai } = useExtra();
  return (
    <Segmenti<'sfide' | 'amici' | 'classifica'> className="mt-3" nome="Sezioni delle sfide" voci={[...VOCI]}
      valore={sezione === 'amici' || sezione === 'classifica' ? sezione : 'sfide'} onScegli={id => vai(id)} />
  );
}

/** Cornice della pagina: testata, selettore, contenuto e (se c'è) il foglio della «i».
 *  Per `sfide`, `amici` e `classifica` la testata dice «Sfide»; per `prove` (le simulazioni, aperte dalla Home) c'è la freccia di ritorno. */
export function SchedaProveSfide({ sezione, info, titoloInfo = 'Regole', velata, children }: {
  sezione: SezioneScheda; info?: ReactNode; titoloInfo?: string; velata?: boolean; children: ReactNode;
}) {
  const { vai, indietro } = useExtra();
  const [aperto, setAperto] = useState(false);
  const prove = sezione === 'prove';
  const fondoVelato = velata ?? !prove;
  return (
    <div className={cn('relative h-full w-full text-testo overflow-hidden flex flex-col', fondoVelato ? 'bg-fondo' : 'bg-superficie')} style={{ fontFamily: FONT }}>
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
        <div className="mx-auto w-full max-w-[440px] px-6 pt-[max(14px,env(safe-area-inset-top))] pb-8">
          {prove ? (
            // Le simulazioni si aprono dalla Home: freccia di ritorno e «i», niente selettore né profilo (Sfide ha la sua voce in barra).
            <header className="flex items-center gap-1">
              <button type="button" onClick={() => indietro()} aria-label="Indietro"
                className="brand-premibile -ml-3 grid h-11 w-11 shrink-0 place-items-center rounded-full text-testo-tenue hover:text-testo">
                <Icona nome="indietro" size={28} />
              </button>
              <h1 className="min-w-0 flex-1 text-[26px] leading-[40px] font-extrabold tracking-[-0.02em] text-testo">Simulazioni</h1>
              {info && <PulsanteInfo onClick={() => setAperto(true)} etichetta={titoloInfo} />}
            </header>
          ) : (
            <>
              <TestataScheda titolo="Sfide" onProfilo={() => vai('profilo')}
                destra={info ? <PulsanteInfo onClick={() => setAperto(true)} etichetta={titoloInfo} /> : undefined} />
              <p data-testo-ok className="-mt-0.5 text-[15px] leading-[21px] text-testo-tenue">Gioca la sfida del giorno o sfida un amico.</p>
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
