// La schermata `accesso-sbloccato` non esiste più nelle sfide (l'accesso sbloccato vive dentro `pass`).
// Restano solo i due pezzi che usa ancora `screens/Invites.tsx`; si cancella questo file quando Invites viene rifatto dentro `pass`.
import { useAccess } from '../../../access/context';
import { IllustrazioneAnimata } from '../../../brand/IllustrazioneAnimata';
import { PASS } from '../../../config/offer';
import { Bottone, Carta } from './comuni';

/** Vero se il Pass è attivo grazie agli inviti. */
export function sbloccatoConInviti(e: { tier: string; source: string; expiresAt: number | null }, ora: number = Date.now()): boolean {
  return e.tier === 'pass' && e.source === 'invite' && (e.expiresAt === null || e.expiresAt > ora);
}

const dataEstesa = (ms: number) => new Date(ms).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });

/** Il blocco «Accesso sbloccato»: mostra solo il caso vero. */
export function BloccoSbloccato({ onInizia }: { onInizia: () => void }) {
  const { entitlement } = useAccess();
  return (
    <Carta tono="alto" className="flex flex-col items-center text-center">
      <IllustrazioneAnimata nome="successo" lato={120} />
      <h2 className="mt-2 text-[24px] leading-[30px] font-extrabold text-testo">{PASS.name}</h2>
      {entitlement.expiresAt ? <p className="mt-1 text-[14.5px] font-bold tabular-nums text-testo">{dataEstesa(entitlement.expiresAt)}</p> : null}
      <div className="mt-4 w-full"><Bottone icona="studia" aria="Inizia a studiare" onClick={onInizia} /></div>
    </Carta>
  );
}
