// Conferma dentro la pagina: nell'Artifact alert/confirm/prompt non esistono (confirm risponde sempre "no").
import { useEffect, useRef, type ReactNode } from 'react';

interface Props {
  open: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  /** Disegno sopra il titolo (un'illustrazione del Brand Kit, 64-80 px); senza, il dialogo resta com'era. */
  illustrazione?: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Conferma', cancelLabel = 'Annulla', danger, illustrazione, onConfirm, onCancel }: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (open) ref.current?.focus(); }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-labelledby="dlg-titolo" onKeyDown={e => { if (e.key === 'Escape') onCancel(); }}>
      <div className={`w-full max-w-sm rounded-2xl bg-superficie-2 border border-linea p-5 shadow-xl dark:shadow-none${illustrazione ? ' text-center' : ''}`}>
        {illustrazione && <div aria-hidden="true" className="mb-3 flex justify-center">{illustrazione}</div>}
        <h2 id="dlg-titolo" className="text-lg font-bold text-testo">{title}</h2>
        {message && <p className="mt-2 text-sm text-testo-tenue">{message}</p>}
        <div className="mt-5 flex gap-3">
          <button type="button" onClick={onCancel} className="flex-1 rounded-xl border border-tacca py-3 font-semibold text-testo">{cancelLabel}</button>
          <button ref={ref} type="button" onClick={onConfirm} className={`flex-1 rounded-xl py-3 font-semibold ${danger ? 'bg-errore text-errore-su' : 'bg-azione text-azione-su'}`}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
