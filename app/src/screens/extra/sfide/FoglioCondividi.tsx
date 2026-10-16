// Il foglio di condivisione: link per WhatsApp, Telegram e Messaggi, «Altre app» (se il dispositivo lo permette) e «Copia link».
// Instagram non ha un indirizzo di condivisione per il web: non lo si finge, si dice come fare (copiare il link e incollarlo).
// Si usa come schermata (`condividi`, parametri `testo` e `url`) e come foglio dentro un'altra schermata (Inviti, risultato di una sfida).
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link2, MessageCircle, MessageSquare, Send, Share2, X } from 'lucide-react';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';

/** Apre il link di condivisione: sempre da un clic dell'utente (un pulsante, non un collegamento scritto nella pagina). */
function apriLink(l: { id: string; href: string }) {
  if (l.id === 'messaggi') window.location.assign(l.href);
  else window.open(l.href, '_blank', 'noopener,noreferrer');
}

export interface LinkCondivisione { id: string; nome: string; href: string }

/** Gli indirizzi di condivisione. Funzione pura (si prova senza interfaccia). */
export function linkCondivisione(testo: string, url: string): LinkCondivisione[] {
  const messaggio = url ? `${testo}\n${url}` : testo;
  return [
    { id: 'whatsapp', nome: 'WhatsApp', href: `https://wa.me/?text=${encodeURIComponent(messaggio)}` },
    { id: 'telegram', nome: 'Telegram', href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(testo)}` },
    { id: 'messaggi', nome: 'Messaggi', href: `sms:?body=${encodeURIComponent(messaggio)}` },
  ];
}

const ICONE: Record<string, ReactNode> = {
  whatsapp: <MessageCircle size={24} />, telegram: <Send size={24} />, messaggi: <MessageSquare size={24} />,
};

const piastrella = 'brand-premibile flex flex-col items-center gap-1.5 rounded-[14px] bg-superficie-2 border border-linea px-1 py-3 text-center text-[12.5px] font-semibold text-testo';
const cerchio = 'w-11 h-11 rounded-full flex items-center justify-center';
// Un colore per canale (come nel concept): WhatsApp verde, Telegram blu, Messaggi viola; «Altre app» e «Copia link» restano neutri.
const COLORE_CANALE: Record<string, string> = {
  whatsapp: 'bg-alto-tinta text-alto-numero',
  telegram: 'bg-azione-tinta text-azione-scuro',
  messaggi: 'bg-viola-tinta text-viola',
};
const NEUTRO = 'bg-superficie text-testo-tenue border border-linea';

export function OpzioniCondivisione({ testo, url, mostraAnteprima = true }: { testo: string; url: string; mostraAnteprima?: boolean }) {
  const [stato, setStato] = useState<string | null>(null);
  const campo = useRef<HTMLInputElement>(null);
  const puoCondividere = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const copia = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setStato('Link copiato.');
    } catch {
      campo.current?.focus();
      campo.current?.select();
      setStato('Copia non riuscita: il link è selezionato qui sopra, copialo a mano.');
    }
  };

  const condividiAltro = async () => {
    try {
      await navigator.share({ text: testo, url });
    } catch (e) {
      if ((e as { name?: string }).name !== 'AbortError') setStato('Questo dispositivo non ha permesso di condividere: usa «Copia link».');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {mostraAnteprima && (
        <p className="rounded-[14px] bg-superficie-2 border border-linea p-3 text-[14px] leading-[20px] text-testo whitespace-pre-line break-words">{testo}</p>
      )}
      <ul className="grid grid-cols-3 gap-2.5">
        {linkCondivisione(testo, url).map(l => (
          <li key={l.id}>
            <button type="button" onClick={() => { playTapSound(); apriLink(l); }} className={cn(piastrella, 'w-full')}>
              <span className={cn(cerchio, COLORE_CANALE[l.id] ?? NEUTRO)} aria-hidden>{ICONE[l.id]}</span>{l.nome}
            </button>
          </li>
        ))}
        {puoCondividere && (
          <li>
            <button type="button" onClick={() => { playTapSound(); void condividiAltro(); }} className={cn(piastrella, 'w-full')}>
              <span className={cn(cerchio, NEUTRO)} aria-hidden><Share2 size={24} /></span>Altre app
            </button>
          </li>
        )}
        <li>
          <button type="button" onClick={() => { playTapSound(); void copia(); }} className={cn(piastrella, 'w-full')}>
            <span className={cn(cerchio, NEUTRO)} aria-hidden><Link2 size={24} /></span>Copia link
          </button>
        </li>
      </ul>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="condividi-link" className="text-[12.5px] font-bold text-testo-tenue">Il link</label>
        <input id="condividi-link" ref={campo} readOnly value={url} onFocus={e => e.currentTarget.select()}
          className="min-w-0 rounded-2xl border border-linea bg-superficie px-4 py-3 text-[13px] font-semibold text-testo focus:outline-none focus:border-azione focus:ring-2 focus:ring-azione/30" />
        <p role="status" className="min-h-[18px] text-[13px] font-bold text-alto-testo">{stato}</p>
      </div>
      <p className="text-[12.5px] leading-[18px] text-testo-tenue">
        Per Instagram non esiste un pulsante di condivisione dal web: copia il link e incollalo in un messaggio o nelle storie.
      </p>
    </div>
  );
}

/** Foglio a comparsa dal basso (con sfondo che si chiude toccandolo o con Esc). */
export default function FoglioCondividi({ aperto, onChiudi, testo, url, titolo = 'Condividi' }: {
  aperto: boolean; onChiudi: () => void; testo: string; url: string; titolo?: string;
}) {
  const chiudi = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (aperto) chiudi.current?.focus(); }, [aperto]);
  if (!aperto) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4" onClick={onChiudi}>
      <div role="dialog" aria-modal="true" aria-labelledby="foglio-condividi-titolo" onClick={e => e.stopPropagation()}
        onKeyDown={e => { if (e.key === 'Escape') onChiudi(); }}
        className="w-full max-w-[440px] max-h-[92dvh] overflow-y-auto rounded-t-[24px] sm:rounded-[24px] bg-superficie border border-linea p-5 shadow-xl dark:shadow-none">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 id="foglio-condividi-titolo" className="text-[20px] font-extrabold text-testo">{titolo}</h2>
          <button ref={chiudi} type="button" onClick={() => { playTapSound(); onChiudi(); }} aria-label="Chiudi"
            className="brand-premibile p-1.5 rounded-full text-testo-tenue hover:text-testo"><X size={22} strokeWidth={2.5} /></button>
        </div>
        <OpzioniCondivisione testo={testo} url={url} />
      </div>
    </div>
  );
}
