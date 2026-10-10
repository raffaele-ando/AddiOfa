// Invio email: l'interfaccia c'e', il fornitore va collegato.
// Senza EMAIL_API_KEY le rotte che devono mandare email rispondono 501 `email_not_configured`.

import type { Env } from './env';
import { HttpError } from './http';

export interface EmailMessage {
  to: string;
  subject: string;
  text: string;
}

export function emailConfigured(env: Env): boolean {
  return typeof env.EMAIL_API_KEY === 'string' && env.EMAIL_API_KEY.length > 0;
}

/**
 * Invia un'email. Implementazione per Resend (https://resend.com/docs/api-reference/emails/send-email):
 * serve un dominio verificato su Resend e EMAIL_FROM con quel dominio. NON provata contro il servizio reale.
 *
 * Per Brevo basta cambiare queste righe:
 *   POST https://api.brevo.com/v3/smtp/email
 *   header  api-key: <EMAIL_API_KEY>
 *   body    { sender: { email, name }, to: [{ email: to }], subject, textContent: text }
 */
export async function sendEmail(env: Env, msg: EmailMessage): Promise<void> {
  if (!emailConfigured(env)) {
    throw new HttpError(501, 'email_not_configured', "L'invio delle email non è ancora configurato.");
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.EMAIL_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: env.EMAIL_FROM, to: [msg.to], subject: msg.subject, text: msg.text }),
  });
  if (!res.ok) {
    console.error('invio email fallito', res.status);
    throw new HttpError(502, 'email_send_failed', "Non sono riuscito a inviare l'email. Riprova tra poco.");
  }
}
