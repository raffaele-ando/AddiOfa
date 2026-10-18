// Le tre informative brevi, una per punto di raccolta (docs/design/PRIVACY-LEGGE.md §5.2). Il titolare e il contatto compaiono solo se `TITOLARE.nome` e
// `CONTACT_EMAIL` (config/offer.ts) sono compilati: finché mancano il testo non nomina nessuno (niente nomi finti). Il testo intero è in legal/privacy.ts.
import { ECOSYSTEM } from '../../config/ecosystem';
import { CONTACT_EMAIL, TITOLARE } from '../../config/offer';

/** «Titolare: Nome Cognome (contatto@…). » oppure vuoto. */
export function prefissoTitolare(): string {
  if (!TITOLARE.nome) return CONTACT_EMAIL ? `Contatto: ${CONTACT_EMAIL}. ` : '';
  return `Titolare: ${TITOLARE.nome}${CONTACT_EMAIL ? ` (${CONTACT_EMAIL})` : ''}. `;
}

export const INFORMATIVA_ACCOUNT = (): string =>
  `${prefissoTitolare()}Per creare il tuo ${ECOSYSTEM.accountName} salviamo il tuo indirizzo email e un identificativo su ${ECOSYSTEM.engineName}, il servizio di ${ECOSYSTEM.name} ospitato da Cloudflare; l'accesso è gestito da Google (Firebase), anche negli Stati Uniti, con le garanzie previste dalla legge. Li teniamo finché non elimini il ${ECOSYSTEM.accountName}. Puoi accedere, correggere, cancellare ed esportare i dati e reclamare al Garante.`;

export const INFORMATIVA_NOI = (): string =>
  `${prefissoTitolare()}Se accendi la casella, il tuo @nome utente, le domande imparate e il miglior punteggio compaiono nella classifica e li vedono tutti. Spegnendo la casella il punteggio sparisce subito.`;

export const INFORMATIVA_COMUNICAZIONI = (): string =>
  `${prefissoTitolare()}Usiamo la tua email solo per scriverti di ${ECOSYSTEM.name} e di ${ECOSYSTEM.agoraName}. Prima serve la conferma con un link. Ti disiscrivi da qui, con un tocco, in qualsiasi momento.`;

/** La riga di apertura (primo avvio e schermate dei dati). Vera solo finché l'app non chiede né invia dati all'avvio. */
export const RIGA_APERTURA =
  `Non ti chiediamo nessun dato: domande, correzione e progressi restano sul tuo dispositivo. Account, classifica e messaggi sono facoltativi e li trovi in «${ECOSYSTEM.accountName}».`;

/** Per le scelte facoltative salvate solo nel dispositivo (percorso di studi, come ci hai conosciuto, badge studente). */
export const RIGA_SOLO_DISPOSITIVO = 'Resta sul tuo dispositivo: non lo inviamo a nessuno.';
