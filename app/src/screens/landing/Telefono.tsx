import { motion, useReducedMotion } from 'motion/react';
import { BookOpen, Dumbbell, Home, ListChecks, Timer, BarChart3 } from 'lucide-react';
import Indicatore from '../../components/home/Indicatore';
import { BarraCresce } from '../../components/home/comune';
import { APP_NAME } from '../../config/offer';
import { urlIcona } from '../../brand/risorse';
import { cn } from '../../lib/utils';

// Telefono con la home dell'app: usa il vero Indicatore con un valore di esempio, dichiarato tale.
// Tutto il disegno è decorativo (aria-hidden): il testo della pagina dice già le stesse cose.

function Galleggia({ children, ampiezza = 8, durata = 5, ritardo = 0, className }: { children: React.ReactNode; ampiezza?: number; durata?: number; ritardo?: number; className?: string }) {
  const riduci = useReducedMotion();
  if (riduci) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} animate={{ y: [0, -ampiezza, 0] }} transition={{ duration: durata, delay: ritardo, repeat: Infinity, ease: 'easeInOut' }}>
      {children}
    </motion.div>
  );
}

function Pillola({ Icona, children, className, ritardo }: { Icona: typeof Timer; children: string; className?: string; ritardo?: number }) {
  return (
    <Galleggia ampiezza={6} durata={4.5} ritardo={ritardo} className={cn('absolute z-10 hidden sm:block', className)}>
      <span className="flex items-center gap-2 whitespace-nowrap rounded-full border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] px-3.5 py-2 text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] shadow-[0_10px_24px_rgba(15,23,42,0.12)] dark:shadow-[0_10px_24px_rgba(0,0,0,0.4)]">
        <Icona size={15} className="text-azione dark:text-azione-chiaro" aria-hidden />
        {children}
      </span>
    </Galleggia>
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
      <div aria-hidden className="absolute left-1/2 top-1/2 h-[88%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-[56px] bg-gradient-to-br from-[#BFDBFE] via-[#93C5FD] to-azione/70 dark:from-azione-tinta-scura dark:via-[#1D3F9A] dark:to-azione/50 rotate-[6deg]" />
      <div aria-hidden className="absolute -right-2 top-4 h-24 w-24 rounded-full bg-azione-tinta dark:bg-azione-tinta-scura/70 blur-sm" />

      <Pillola Icona={Timer} className="-left-4 top-20" ritardo={0.2}>Diagnostico gratis</Pillola>
      <Pillola Icona={BookOpen} className="-right-4 top-[46%]" ritardo={1.1}>Teoria in italiano</Pillola>
      <Pillola Icona={ListChecks} className="bottom-14 -left-10" ritardo={0.7}>Simulazioni 30/15</Pillola>

      <Galleggia ampiezza={10} durata={6} className="relative mx-auto w-[272px]">
        <div aria-hidden className="relative rounded-[42px] border-[8px] border-[#0F172A] dark:border-[#334155] bg-[#F6F8FC] dark:bg-[#111B21] shadow-[0_30px_60px_rgba(30,64,175,0.28)] dark:shadow-[0_30px_60px_rgba(0,0,0,0.5)] overflow-hidden">
          <div className="mx-auto mt-2 h-4 w-20 rounded-full bg-[#0F172A] dark:bg-[#334155]" />
          <div className="px-3.5 pb-3 pt-2">
            <div className="flex items-center gap-1.5">
              <img src={urlIcona} alt="" className="h-6 w-6 rounded-lg" />
              <span className="text-sm font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">{APP_NAME}</span>
              <span className="ml-auto rounded-full bg-azione-tinta dark:bg-azione-tinta-scura px-2 py-0.5 text-[10px] font-bold text-azione-scuro dark:text-[#BFDBFE]">Esempio</span>
            </div>

            <div className="mt-2 rounded-2xl border border-[#E8ECF3] dark:border-[#334155] bg-white dark:bg-[#1E293B] px-1 pb-1 pt-2">
              {/* l'Indicatore vero, rimpicciolito: dentro il telefono ha lo stesso disegno della home */}
              <div className="relative mx-auto h-[172px] w-full overflow-hidden">
                <div className="absolute left-1/2 top-0 w-[340px] origin-top -translate-x-1/2 scale-[.67]">
                  <Indicatore percento={62} livello="medio" etichetta="Probabilità stimata" sotto="" />
                </div>
              </div>
            </div>

            <div className="mt-2 rounded-2xl border border-[#E8ECF3] dark:border-[#334155] bg-white dark:bg-[#1E293B] p-3">
              <p className="text-[11px] font-bold text-[#0F172A] dark:text-[#F8FAFC]">Dove sei più solido</p>
              <div className="mt-2 space-y-2">
                {[['Grammatica', 72], ['Traduzione', 48]].map(([nome, v], i) => (
                  <div key={nome}>
                    <div className="mb-1 flex justify-between text-[10px] font-semibold text-gray-600 dark:text-gray-300"><span>{nome}</span><span>{v}%</span></div>
                    <BarraCresce valore={Number(v)} colore="#2563EB" ritardo={0.4 + i * 0.15} alta={6} />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-2.5 rounded-xl bg-azione py-2.5 text-center text-xs font-bold text-white">Continua a studiare</div>
          </div>

          <div className="flex justify-around border-t border-[#E8ECF3] dark:border-[#334155] bg-white dark:bg-[#1E293B] py-2">
            {SCHEDE.map(({ Icona, nome, attiva }) => (
              <span key={nome} className={cn('flex flex-col items-center gap-0.5 text-[9px] font-bold', attiva ? 'text-azione dark:text-azione-chiaro' : 'text-gray-500 dark:text-gray-400')}>
                <Icona size={16} />{nome}
              </span>
            ))}
          </div>
        </div>
      </Galleggia>

      <figcaption className="mt-5 text-center text-xs font-semibold text-gray-600 dark:text-gray-400">
        Schermata di esempio con dati di prova.
      </figcaption>
    </figure>
  );
}
