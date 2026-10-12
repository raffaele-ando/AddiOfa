// `accesso-sbloccato`: l'esito vero degli inviti. Si mostra la festa solo se il Pass è davvero attivo PER INVITO (entitlement con
// source «invite», che il server concede a chi ha 3 compagni verificati). Altrimenti dice com'è la situazione, senza fingere.
// In questa versione dimostrativa (LocalProvider) la verifica delle email non esiste, quindi l'accesso non si sblocca mai da qui.
import { useEffect, useState } from 'react';
import { Gift } from 'lucide-react';
import { useExtra } from '../contesto';
import { useAccess } from '../../../access/context';
import type { InviteProgress } from '../../../access/provider';
import { IllustrazioneAnimata } from '../../../brand/IllustrazioneAnimata';
import { PASS } from '../../../config/offer';
import { Bottone, Carta, Pagina } from './comuni';

/** Vero se il Pass è attivo grazie agli inviti. */
export function sbloccatoConInviti(e: { tier: string; source: string; expiresAt: number | null }, ora: number = Date.now()): boolean {
  return e.tier === 'pass' && e.source === 'invite' && (e.expiresAt === null || e.expiresAt > ora);
}

const dataEstesa = (ms: number) => new Date(ms).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });

/** Il blocco «Accesso sbloccato»: lo usano la schermata e Inviti. Mostra solo il caso vero. */
export function BloccoSbloccato({ onInizia }: { onInizia: () => void }) {
  const { entitlement } = useAccess();
  return (
    <Carta tono="alto" className="flex flex-col items-center text-center">
      <IllustrazioneAnimata nome="successo" lato={120} />
      <h2 className="mt-2 text-[24px] leading-[30px] font-extrabold text-testo">Accesso sbloccato</h2>
      <p className="mt-1 text-[14.5px] leading-[21px] text-testo">
        Hai invitato compagni che hanno confermato l'email e finito il diagnostico: il {PASS.name} è tuo
        {entitlement.expiresAt ? ` fino al ${dataEstesa(entitlement.expiresAt)}` : ''}.
      </p>
      <div className="mt-4 w-full"><Bottone onClick={onInizia}>Inizia a studiare</Bottone></div>
    </Carta>
  );
}

export default function AccessoSbloccato() {
  const { indietro, vaiHome, apriInviti } = useExtra();
  const { entitlement, provider, pass } = useAccess();
  const [avanzamento, setAvanzamento] = useState<InviteProgress | null>(null);
  const sbloccato = pass && sbloccatoConInviti(entitlement);

  useEffect(() => {
    if (sbloccato) return;
    let vivo = true;
    provider.inviteProgress().then(p => { if (vivo) setAvanzamento(p); }).catch(() => undefined);
    return () => { vivo = false; };
  }, [provider, sbloccato]);

  return (
    <Pagina titolo="Inviti" onBack={indietro}>
      <div className="mt-5">
        {sbloccato ? (
          <BloccoSbloccato onInizia={vaiHome} />
        ) : (
          <Carta className="flex flex-col items-center text-center">
            <span className="w-14 h-14 rounded-full bg-azione-tinta text-azione-scuro flex items-center justify-center" aria-hidden><Gift size={26} /></span>
            <h2 className="mt-3 text-[20px] leading-[26px] font-extrabold text-testo">Nessun accesso sbloccato con gli inviti, per ora</h2>
            <p className="mt-1 text-[14px] leading-[20px] text-testo-tenue">
              {avanzamento
                ? `Compagni verificati: ${Math.min(avanzamento.verified, avanzamento.required)} su ${avanzamento.required}. `
                : ''}
              Il {PASS.name} si sblocca solo quando i compagni invitati hanno confermato l'email e finito il diagnostico: lo decide il server, questa schermata non può farlo da sola.
              {entitlement.source === 'demo' && pass ? ' In questa versione dimostrativa il Pass è già in prova e la verifica delle email non è attiva.' : ''}
            </p>
            <div className="mt-4 w-full flex flex-col gap-2">
              <Bottone onClick={apriInviti}>Vai agli inviti</Bottone>
              <Bottone variante="secondario" onClick={vaiHome}>Torna alla home</Bottone>
            </div>
          </Carta>
        )}
      </div>
    </Pagina>
  );
}
