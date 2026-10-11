import { BookOpen, Dumbbell, Home, ListChecks, Timer, BarChart3 } from 'lucide-react';
import Indicatore from '../../components/home/Indicatore';
import { Barra } from '../../components/home/comune';
import Marchio from '../../brand/Marchio';
import { cn } from '../../lib/utils';

// Telefono con la home dell'app: usa il vero Indicatore con un valore di esempio, dichiarato tale.
// Tutto il disegno è decorativo (aria-hidden): il testo della pagina dice già le stesse cose.

function Pillola({ Icona, children, className }: { Icona: typeof Timer; children: string; className?: string }) {
  return (
    <div className={cn('absolute z-10 hidden sm:block', className)}>
      <span className="flex items-center gap-2 whitespace-nowrap rounded-full border border-linea bg-superficie px-3.5 py-2 text-xs font-bold text-testo shadow-[0_10px_24px_rgba(15,23,42,0.12)] dark:shadow-none dark:shadow-[0_10px_24px_rgba(0,0,0,0.4)]">
        <Icona size={15} className="text-azione " aria-hidden />
        {children}
      </span>
    </div>
  );
}

const SCHEDE = [
  { Icona: Home, nome: 'Home', attiva: true },
  { Icona: Dumbbell, nome: 'Esercizi' },
  { Icona: BookOpen, nome: 'Teoria' },
  { Icona: BarChart3, nome: 'Progressi' },
];

export default function Telefono() {
  return (
    <figure className="relative mx-auto w-full max-w-[520px] pb-2 pt-6 m-0">
      {/* alone e forme dietro il telefono */}
      <div aria-hidden className="absolute left-1/2 top-1/2 h-[88%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-[56px] bg-gradient-to-br from-azione-tinta via-azione/30 to-azione/50 rotate-[6deg]" />
      <div aria-hidden className="absolute -right-2 top-4 h-24 w-24 rounded-full bg-azione-tinta blur-sm" />

      <Pillola Icona={Timer} className="-left-4 top-20">Diagnostico gratis</Pillola>
      <Pillola Icona={BookOpen} className="-right-4 top-[46%]">Teoria in italiano</Pillola>
      <Pillola Icona={ListChecks} className="bottom-14 -left-10">Simulazioni 30/15</Pillola>

      <div className="relative mx-auto w-[272px]">
        <div aria-hidden className="relative rounded-[42px] border-[8px] border-[#0E1B3F] dark:border-tacca bg-fondo shadow-[0_30px_60px_rgba(30,64,175,0.28)] dark:shadow-none dark:shadow-[0_30px_60px_rgba(0,0,0,0.5)] overflow-hidden">
          <div className="mx-auto mt-2 h-4 w-20 rounded-full bg-[#0E1B3F] dark:bg-tacca" />
          <div className="px-3.5 pb-3 pt-2">
            <div className="flex items-center gap-1.5">
              <Marchio disposizione="orizzontale" altezza={22} />
              <span className="ml-auto rounded-full bg-azione-tinta px-2 py-0.5 text-[10px] font-bold text-azione-scuro">Esempio</span>
            </div>

            <div className="mt-2 rounded-2xl border border-linea bg-superficie px-1 pb-1 pt-2">
              {/* l'Indicatore vero, rimpicciolito: dentro il telefono ha lo stesso disegno della home */}
              <div className="relative mx-auto h-[172px] w-full overflow-hidden">
                <div className="absolute left-1/2 top-0 w-[340px] origin-top -translate-x-1/2 scale-[.67]">
                  <Indicatore percento={62} livello="medio" etichetta="Probabilità stimata" sotto="" />
                </div>
              </div>
            </div>

            <div className="mt-2 rounded-2xl border border-linea bg-superficie p-3">
              <p className="text-[11px] font-bold text-testo">Dove sei più solido</p>
              <div className="mt-2 space-y-2">
                {[['Grammatica', 72], ['Traduzione', 48]].map(([nome, v]) => (
                  <div key={nome}>
                    <div className="mb-1 flex justify-between text-[10px] font-semibold text-testo-tenue"><span>{nome}</span><span>{v}%</span></div>
                    <Barra valore={Number(v)} colore="var(--color-azione)" alta={6} />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-2.5 rounded-xl bg-azione py-2.5 text-center text-xs font-bold text-azione-su">Continua a studiare</div>
          </div>

          <div className="flex justify-around border-t border-linea bg-superficie py-2">
            {SCHEDE.map(({ Icona, nome, attiva }) => (
              <span key={nome} className={cn('flex flex-col items-center gap-0.5 text-[9px] font-bold', attiva ? 'text-azione ' : 'text-testo-tenue')}>
                <Icona size={16} />{nome}
              </span>
            ))}
          </div>
        </div>
      </div>

      <figcaption className="mt-5 text-center text-xs font-semibold text-testo-tenue">
        Schermata di esempio con dati di prova.
      </figcaption>
    </figure>
  );
}
