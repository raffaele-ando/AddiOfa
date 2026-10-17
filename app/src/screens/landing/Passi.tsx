import type { ReactNode } from 'react';
import { Icona, type NomeIcona } from '../../brand/icone/Icona';
import { Illustrazione } from '../../brand/Illustrazione';
import { BottoneAzione, Colonna } from './comune';
import TelefonoPassi from './TelefonoPassi';

// Mini-schermate dei passi: disegnate con gli stessi token dell'app, ferme.
function Schermo({ children, inclina }: { children: ReactNode; inclina: string }) {
  return <div aria-hidden data-testo-ok className={`vetro vetro-forte mx-auto hidden h-[15.5rem] w-full max-w-[16.5rem] rounded-[24px] p-4 lg:block ${inclina}`}>{children}</div>;
}

const OPZIONI = ['go', 'goes', 'going', 'to go'];
function SchermoDiagnostico() {
  return (
    <Schermo inclina="lg:rotate-[-1deg]">
      <div className="mb-2 flex gap-1" aria-hidden>{[0, 1, 2].map(i => <span key={i} className={`h-1.5 flex-1 rounded-full ${i === 0 ? 'bg-azione' : 'bg-linea'}`} />)}</div>
      <p className="text-[10px] font-semibold text-testo-tenue">Scegli la forma corretta</p>
      <p className="mt-0.5 text-[13px] font-bold text-testo">She ___ to Milan every day.</p>
      <ul className="mt-2.5 space-y-1.5">
        {OPZIONI.map((o, i) => (
          <li key={o} className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold ${i === 1 ? 'border-azione bg-azione-tinta text-azione-scuro' : 'border-linea bg-superficie text-testo'}`}>
            <span className={`h-3 w-3 rounded-full border-2 ${i === 1 ? 'border-azione bg-azione' : 'border-tacca'}`} />{o}
          </li>
        ))}
      </ul>
    </Schermo>
  );
}

function SchermoRipasso() {
  const righe = ['Domande sbagliate', 'Quiz mirati', 'Teoria in italiano'];
  return (
    <Schermo inclina="lg:rotate-[1deg]">
      <p className="text-[10px] font-semibold text-testo-tenue">Ripasso su misura</p>
      <ul className="mt-2.5 space-y-2.5">
        {righe.map(r => (
          <li key={r} className="flex items-center gap-2.5 rounded-xl border border-linea bg-superficie px-3 py-2.5 text-[12px] font-bold text-testo">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-alto-tinta text-alto-pieno"><Icona nome="stato-incluso" size={14} /></span>{r}
          </li>
        ))}
      </ul>
    </Schermo>
  );
}

function SchermoSimulazione() {
  return (
    <Schermo inclina="lg:rotate-[-1deg]">
      <p className="text-[10px] font-semibold text-testo-tenue">Simulazione</p>
      <div className="mt-2 flex items-center gap-2 text-[12px] font-bold text-testo"><Icona nome="tempo" size={15} className="text-azione" /><span className="h-1.5 w-16 rounded-full bg-testo/15" /></div>
      <div className="mt-1.5 flex items-center gap-2 text-[12px] font-bold text-testo"><Icona nome="risposte" size={15} className="text-azione" /><span className="h-1.5 w-20 rounded-full bg-testo/15" /></div>
      <div className="mt-1.5 flex items-center gap-2 text-[12px] font-bold text-testo"><Icona nome="soglia" size={15} className="text-azione" /><span className="h-1.5 w-12 rounded-full bg-testo/15" /></div>
      <div className="mt-4 rounded-xl bg-azione py-2.5 text-center text-xs font-bold text-azione-su">Inizia la simulazione</div>
    </Schermo>
  );
}

// I quattro passi (concetti 51 e 12): numero, titolo, un pannello con la schermata vera dell'app (colonne da 1024 px) e una riga di spiegazione.
const PASSI: { n: string; titolo: string; testo: string; Schermo: () => ReactNode }[] = [
  { n: '01', titolo: 'Test iniziale', testo: 'Scopri il tuo livello e la probabilità di superare l\'OFA.', Schermo: SchermoDiagnostico },
  { n: '02', titolo: 'Ripasso su misura', testo: 'Ripassi ciò che sbagli: domande, quiz mirati e teoria in italiano.', Schermo: SchermoRipasso },
  { n: '03', titolo: 'Allenati', testo: 'Simulazioni nel formato del test, con timer e correzioni dettagliate.', Schermo: SchermoSimulazione },
  {
    n: '04', titolo: 'Supera l\'OFA', testo: 'Togli l\'OFA e vai avanti con il piano degli studi.',
    Schermo: () => (
      <Schermo inclina="lg:rotate-[1deg]">
        <div className="flex h-full items-center justify-center"><Illustrazione nome="superamento" lato={150} /></div>
      </Schermo>
    ),
  },
];

// «Come funziona»: da 1024 px titolo a sinistra e quattro colonne con le mini-schermate; da telefono, un telefono grande con selettore dei passi (concetti 12 e 45).
export default function Passi({ onStart }: { onStart(): void }) {
  return (
    <section id="come-funziona" aria-labelledby="t-passi" className="scroll-mt-20 py-14 sm:py-20">
      <Colonna>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_2.9fr] lg:gap-8">
          <div className="lg:pt-8" data-testo-ok>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-azione-scuro dark:text-azione">Come funziona</p>
            <h2 id="t-passi" className="mt-3 text-[2.3rem] font-extrabold leading-[1.05] tracking-[-0.03em] text-testo sm:text-5xl lg:text-[2.25rem]">
              Un percorso su misura, in <span className="text-azione">4 passi</span>
            </h2>
            <p className="mt-4 max-w-sm text-base leading-relaxed text-testo-tenue">Dal test iniziale alla simulazione, tutto in un'unica app.</p>
            <div className="mt-6 hidden lg:block">
              <BottoneAzione onClick={onStart} className="whitespace-nowrap">Fai il diagnostico</BottoneAzione>
            </div>
          </div>

          {/* da telefono: telefono grande con il passo scelto (TelefonoPassi); da 1024 px: quattro colonne con le mini-schermate */}
          <TelefonoPassi />
          <ol className="relative hidden lg:grid lg:grid-cols-4 lg:gap-4" data-testo-ok>
            {PASSI.map(p => (
              <li key={p.titolo} className="relative">
                <div className="mb-4 flex items-center gap-3">
                  <span aria-hidden className="grid h-9 w-9 place-items-center rounded-full bg-azione-tinta text-[13px] font-extrabold text-azione-scuro">{p.n}</span>
                  <h3 className="text-base font-extrabold leading-snug text-testo">{p.titolo}</h3>
                </div>
                {p.Schermo()}
                <p className="mt-4 text-center text-[13.5px] leading-snug text-testo-tenue">{p.testo}</p>
              </li>
            ))}
          </ol>
        </div>
      </Colonna>
    </section>
  );
}
