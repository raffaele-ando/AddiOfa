import { useEffect, useState } from 'react';
import { Illustrazione } from '../brand/Illustrazione';
import { useAccess } from '../access/context';
import { playTapSound } from '../lib/audio';
import { Screen, PrimaryButton } from './ui';

// Pagina di ritorno dal provider di pagamento (?pagamento=ok).
// Da sola non prova che il pagamento sia avvenuto: l'accesso a pagamento lo conferma il server,
// quindi qui si ricontrolla il Pass invece di darlo per attivo.
export default function PaymentThanks({ onContinue }: { onContinue: () => void }) {
  const { pass, entitlement, refresh } = useAccess();
  const [controllo, setControllo] = useState(false);
  const [provato, setProvato] = useState(false);
  const scuro = document.documentElement.classList.contains('dark');

  const ricontrolla = async () => {
    setControllo(true);
    try { await refresh(); } catch { /* resta lo stato precedente */ }
    setControllo(false);
    setProvato(true);
  };

  useEffect(() => { void ricontrolla(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const scadenza = entitlement.expiresAt
    ? new Date(entitlement.expiresAt).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  return (
    <Screen>
      <div className="mx-auto my-4 flex items-center justify-center" style={{ minHeight: 140 }}>
        <Illustrazione kit="kit-rosso" nome="celebrazione" gruppo="stati" lato={170} fondoScuro={scuro} />
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-[#0F172A] dark:text-[#F8FAFC]">Grazie</h1>
      <p className="text-center font-semibold text-gray-500 dark:text-gray-400">
        Se il pagamento è andato a buon fine, riceverai la ricevuta via email.
      </p>
      <div className="rounded-2xl border border-gray-200 dark:border-[#334155] bg-gray-50 dark:bg-[#0F172A] p-4 text-center" role="status">
        {pass ? (
          <p className="font-bold text-[#15803D] dark:text-[#34D399]">Il Pass è attivo{scadenza ? ` fino al ${scadenza}` : ''}.</p>
        ) : (
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
            {controllo
              ? 'Controllo il tuo Pass…'
              : provato
                ? 'Non vedo ancora il Pass attivo. La conferma può arrivare con qualche minuto di ritardo: ricontrolla tra poco.'
                : 'Questa pagina da sola non conferma il pagamento: controllo il tuo Pass.'}
          </p>
        )}
        {!pass && (
          <button
            onClick={() => { playTapSound(); void ricontrolla(); }}
            disabled={controllo}
            className="mt-3 rounded-xl border border-[#EF4444] text-[#B91C1C] dark:text-[#FCA5A5] font-bold text-sm px-4 py-2.5 disabled:opacity-40"
          >
            Ricontrolla il Pass
          </button>
        )}
      </div>
      <div className="mt-auto">
        <PrimaryButton onClick={onContinue}>{pass ? 'Inizia a prepararti' : 'Vai all\'app'}</PrimaryButton>
      </div>
    </Screen>
  );
}
