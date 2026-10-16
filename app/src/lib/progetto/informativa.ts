// Informativa breve del passo dei consensi: che cosa si raccoglie, dove va, a che cosa servono i consensi. Il testo intero è in legal/privacy.ts.
import { ECOSYSTEM } from '../../config/ecosystem';
import { CONTACT_EMAIL, TITOLARE } from '../../config/offer';

export const INFORMATIVA_BREVE =
  `Titolare: ${TITOLARE.nome}${TITOLARE.responsabile ? ` (${TITOLARE.responsabile})` : ''}. Nome, email, corso, sede e provenienza servono a creare la tua iscrizione e vengono inviati ad ${ECOSYSTEM.engineName}, il servizio di ${ECOSYSTEM.name}, appena possibile; fino ad allora restano su questo dispositivo. I consensi li usiamo solo per le tre cose indicate e li puoi cambiare o ritirare quando vuoi.${CONTACT_EMAIL ? ` Contatto: ${CONTACT_EMAIL}.` : ''}`;
