// Conferma dentro la pagina: nell'Artifact alert/confirm/prompt non esistono (confirm risponde sempre "no").
import { useEffect, useRef } from 'react';

interface Props {
  open: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Conferma', cancelLabel = 'Annulla', danger, onConfirm, onCancel }: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (open) ref.current?.focus(); }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="dlg-titolo" onKeyDown={e => { if (e.key === 'Escape') onCancel(); }}>
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#1E293B] p-5 shadow-xl">
        <h2 id="dlg-titolo" className="text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC]">{title}</h2>
        {message && <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{message}</p>}
        <div className="mt-5 flex gap-3">
          <button type="button" onClick={onCancel} className="flex-1 rounded-xl border border-gray-300 dark:border-gray-600 py-3 font-semibold text-gray-700 dark:text-gray-200">{cancelLabel}</button>
          <button ref={ref} type="button" onClick={onConfirm} className={`flex-1 rounded-xl py-3 font-semibold text-white ${danger ? 'bg-red-600' : 'bg-[#EF4444]'}`}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
