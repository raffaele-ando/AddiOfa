import { Illustrazione } from '../brand/Illustrazione';
import { Screen, PrimaryButton } from './ui';

// Pagina di ritorno dal provider di pagamento (?pagamento=ok).
// Da sola non prova che il pagamento sia avvenuto: l'accesso a pagamento va verificato lato server.
export default function PaymentThanks({ onContinue }: { onContinue: () => void }) {
  return (
    <Screen>
      <div className="mx-auto my-6 flex items-center justify-center">
        <Illustrazione kit="kit-blu" nome="celebrazione" lato={170} />
      </div>
      <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#0F172A] dark:text-[#F8FAFC]">Grazie!</h2>
      <p className="text-center font-semibold text-gray-500 dark:text-gray-400">
        Se il pagamento è andato a buon fine riceverai la ricevuta via email. Ora puoi iniziare a prepararti.
      </p>
      <div className="mt-auto">
        <PrimaryButton onClick={onContinue}>Inizia a prepararti</PrimaryButton>
      </div>
    </Screen>
  );
}
