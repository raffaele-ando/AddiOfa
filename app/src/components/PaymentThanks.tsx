import { useEffect, useState } from 'react';
import { IllustrazioneAnimata } from '../brand/IllustrazioneAnimata';
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
        <IllustrazioneAnimata nome="celebrazione" lato={170} />
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-testo">Grazie</h1>
      <p className="text-center font-semibold text-testo-tenue">
        Se il pagamento è andato a buon fine, riceverai la ricevuta via email.
      </p>
      <div className="rounded-2xl border border-linea bg-superficie-2 p-4 text-center" role="status">
        {pass ? (
          <p className="font-bold text-alto-testo">Il Pass è attivo{scadenza ? ` fino al ${scadenza}` : ''}.</p>
        ) : (
          <p className="text-sm font-semibold text-testo-tenue">
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
            className="mt-3 rounded-xl border border-azione text-azione-scuro font-bold text-sm px-4 py-2.5 disabled:opacity-40"
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
