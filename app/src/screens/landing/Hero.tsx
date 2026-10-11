import { motion, useReducedMotion } from 'motion/react';
import { Clock, UserX, Gift } from 'lucide-react';
import { DISCLAIMER, FREE_LIMITS } from '../../config/offer';
import { BottoneAzione, BottoneContorno, Colonna, Evidenza } from './comune';
import Telefono from './Telefono';

const FATTI = [
  { Icona: Gift, testo: 'Gratis' },
  { Icona: UserX, testo: 'Senza account' },
  { Icona: Clock, testo: 'Circa 3 minuti' },
];

export default function Hero({ onStart, onSkip }: { onStart(): void; onSkip(): void }) {
  const riduci = useReducedMotion();
  // ingresso in sequenza: ogni elemento parte un poco dopo il precedente
  const entra = (i: number) => riduci
    ? { initial: false as const }
    : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.55, delay: 0.08 + i * 0.1, ease: [0.22, 1, 0.36, 1] as const } };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#EAF1FF] via-[#F3F7FF] to-[#F6F8FC] dark:from-[#14213D] dark:via-[#111B21] dark:to-[#111B21]">
      <div aria-hidden className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-azione/10 dark:bg-azione/15 blur-3xl" />
      <Colonna className="relative grid items-center gap-10 pb-12 pt-10 sm:pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6 lg:pb-20 lg:pt-16">
        <div>
          <motion.p {...entra(0)} className="inline-block rounded-full border border-azione/20 bg-white/80 dark:bg-[#1E293B]/80 px-3.5 py-1.5 text-xs font-bold text-azione-scuro dark:text-[#BFDBFE]">
            Per chi deve fare l'inglese dell'OFA
          </motion.p>
          <motion.h1 {...entra(1)} className="mt-4 text-[2.6rem] sm:text-6xl font-extrabold leading-[1.05] tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
            Hai l'OFA di <Evidenza>inglese?</Evidenza>
          </motion.h1>
          <motion.p {...entra(2)} className="mt-5 max-w-xl text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300">
            AddiOFA ti aiuta a prepararti al test d'inglese del Politecnico di Milano. Parti dal diagnostico gratuito: {FREE_LIMITS.diagnostic} domande
            e una probabilità stimata di superare il test, con gli argomenti da ripassare. Vale anche se prepari il test d'ingresso e vuoi evitare l'OFA.
          </motion.p>
          <motion.div {...entra(3)} className="mt-7 flex flex-col gap-3 sm:flex-row">
            <BottoneAzione onClick={onStart} className="sm:min-w-[17rem]">Fai il diagnostico gratuito</BottoneAzione>
            <BottoneContorno onClick={onSkip}>Salta e vai all'app</BottoneContorno>
          </motion.div>
          <motion.ul {...entra(4)} className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-gray-700 dark:text-gray-300" aria-label="In breve">
            {FATTI.map(({ Icona, testo }) => (
              <li key={testo} className="flex items-center gap-1.5">
                <Icona size={16} className="text-azione dark:text-azione-chiaro" aria-hidden />{testo}
              </li>
            ))}
          </motion.ul>
          <motion.p {...entra(5)} className="mt-3 max-w-md text-xs font-medium text-gray-600 dark:text-gray-400">
            La probabilità è una stima prudente: con così poche domande resta approssimativa e non garantisce l'esito del test.
          </motion.p>
          <motion.p {...entra(6)} className="mt-2 max-w-md text-xs font-semibold text-gray-700 dark:text-gray-300">
            {DISCLAIMER}
          </motion.p>
        </div>

        <motion.div {...(riduci ? { initial: false as const } : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] as const } })}>
          <Telefono />
        </motion.div>
      </Colonna>
    </div>
  );
}
