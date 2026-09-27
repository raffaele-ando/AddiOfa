import { PartyPopper } from 'lucide-react';
import { Screen, PrimaryButton } from './ui';

// Pagina di ritorno dal provider di pagamento (?pagamento=ok).
// Da sola non prova che il pagamento sia avvenuto: l'accesso a pagamento va verificato lato server.
export default function PaymentThanks({ onContinue }: { onContinue: () => void }) {
  return (
    <Screen>
      <div className="mx-auto my-6 w-32 h-32 sm:w-40 sm:h-40 rounded-[40px] flex items-center justify-center bg-[#DCFCE7] text-[#22C55E] dark:bg-[#064E3B]/40">
        <PartyPopper className="w-16 h-16 sm:w-20 sm:h-20" strokeWidth={2} />
      </div>
      <h2 className="text-3xl sm:text-4xl font-black text-center text-[#0F172A] dark:text-[#F8FAFC]">Grazie!</h2>
      <p className="text-center font-semibold text-gray-500 dark:text-gray-400">
        Se il pagamento è andato a buon fine riceverai la ricevuta via email. Ora puoi iniziare a prepararti.
      </p>
      <div className="mt-auto">
        <PrimaryButton onClick={onContinue}>Inizia a prepararti</PrimaryButton>
      </div>
    </Screen>
  );
}
