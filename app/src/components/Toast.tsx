// Messaggi brevi dentro la pagina (al posto di alert, che nell'Artifact non esiste).
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

type Tipo = 'ok' | 'errore' | 'info';
interface Messaggio { id: number; testo: string; tipo: Tipo }
type Mostra = (testo: string, tipo?: Tipo) => void;

const ToastContext = createContext<Mostra | null>(null);

/** Mostra un messaggio. Fuori dal ToastProvider non fa nulla (le schermate restano usabili in prova). */
export function useToast(): Mostra {
  return useContext(ToastContext) ?? (() => undefined);
}

const ICONE = { ok: CheckCircle2, errore: AlertCircle, info: Info } as const;
const COLORI: Record<Tipo, string> = {
  ok: 'text-[#16A34A]',
  errore: 'text-[#EF4444]',
  info: 'text-[#2563EB] dark:text-[#60A5FA]',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [lista, setLista] = useState<Messaggio[]>([]);
  const contatore = useRef(0);
  const timer = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const chiudi = useCallback((id: number) => {
    const t = timer.current.get(id);
    if (t) clearTimeout(t);
    timer.current.delete(id);
    setLista(l => l.filter(m => m.id !== id));
  }, []);

  const mostra = useCallback<Mostra>((testo, tipo = 'info') => {
    const id = ++contatore.current;
    setLista(l => [...l.slice(-2), { id, testo, tipo }]);
    timer.current.set(id, setTimeout(() => chiudi(id), tipo === 'errore' ? 8000 : 5000));
  }, [chiudi]);

  useEffect(() => { const t = timer.current; return () => { t.forEach(clearTimeout); }; }, []);
  const valore = useMemo(() => mostra, [mostra]);

  return (
    <ToastContext.Provider value={valore}>
      {children}
      <div className="fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center gap-2 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pointer-events-none" aria-live="polite" role="status">
        {lista.map(m => {
          const Icona = ICONE[m.tipo];
          return (
            <div key={m.id} className="pointer-events-auto w-full max-w-sm flex items-start gap-2.5 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] px-3.5 py-3 shadow-lg">
              <Icona size={18} className={`mt-0.5 shrink-0 ${COLORI[m.tipo]}`} aria-hidden="true" />
              <p className="flex-1 min-w-0 text-sm text-[#0F172A] dark:text-[#F8FAFC] break-words">{m.testo}</p>
              <button type="button" onClick={() => chiudi(m.id)} aria-label="Chiudi il messaggio" className="shrink-0 text-[#6B7280] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] p-0.5">
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
