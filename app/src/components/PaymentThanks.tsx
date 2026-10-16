import { useEffect, useState } from 'react';
import { IllustrazioneAnimata } from '../brand/IllustrazioneAnimata';
import { Icona } from '../brand/icone/Icona';
import { useAccess } from '../access/context';
import { playTapSound } from '../lib/audio';
import { Screen, PrimaryButton } from './ui';
import { InfoFoglio } from '../screens/landing/comune';

// Pagina di ritorno dal provider di pagamento (?pagamento=ok).
// Da sola non prova che il pagamento sia avvenuto: l'accesso a pagamento lo conferma il server,
// quindi qui si ricontrolla il Pass invece di darlo per attivo. L'esito è un'icona e, se c'è, la scadenza.
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
    ? new Date(entitlement.expiresAt).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : null;

  return (
    <Screen>
      <div className="mx-auto my-4 flex items-center justify-center" style={{ minHeight: 140 }}>
        {/* la festa solo quando il Pass è davvero attivo: finché non è confermato, l'illustrazione resta quella neutra del «fatto» */}
        <IllustrazioneAnimata nome={pass ? 'celebrazione' : 'successo'} lato={170} />
      </div>
      <div className="flex items-center justify-center gap-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-testo">Grazie</h1>
        <InfoFoglio titolo="Il pagamento" etichetta="Informazioni sul pagamento">
          <p>Se il pagamento è andato a buon fine, riceverai la ricevuta via email. Questa pagina da sola non lo conferma: l'accesso lo conferma il server e qui si ricontrolla il Pass.</p>
        </InfoFoglio>
      </div>
      <div className={`flex items-center justify-center gap-3 rounded-2xl p-4 text-center ${pass ? 'bg-alto-tinta' : provato && !controllo ? 'bg-medio-tinta' : 'bg-superficie-2 border border-linea'}`} role="status">
        {pass ? (
          <>
            <Icona nome="stato-ok" size={28} className="text-alto-numero" titolo="Pass attivo" />
            <Icona nome="pass" size={24} className="text-alto-testo" />
            {scadenza && <span className="inline-flex items-center gap-1.5 font-bold text-alto-testo"><Icona nome="scadenza" size={20} />{scadenza}</span>}
          </>
        ) : controllo ? (
          <span className="inline-block h-6 w-6 animate-spin rounded-full border-[3px] border-azione/30 border-t-azione" aria-label="Controllo" />
        ) : (
          <>
            <Icona nome="stato-attesa" size={28} className="text-medio-testo" titolo="Pass non ancora attivo" />
            <button
              onClick={() => { playTapSound(); void ricontrolla(); }}
              aria-label="Ricontrolla il Pass"
              className="inline-flex items-center gap-2 rounded-xl border border-azione bg-superficie text-azione-scuro font-bold text-sm px-4 py-2.5"
            >
              <Icona nome="ricontrolla" size={18} />Ricontrolla
            </button>
          </>
        )}
      </div>
      <div className="mt-auto">
        <PrimaryButton onClick={onContinue}>{pass ? 'Inizia' : 'Vai all\'app'}</PrimaryButton>
      </div>
    </Screen>
  );
}
