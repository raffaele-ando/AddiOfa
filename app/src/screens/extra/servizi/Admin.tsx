// Pagina dell'autore (non è in nessun menu): si apre da `?vista=admin`. Con la password ADMIN_TOKEN scarica le iscrizioni di ATLAS in un file CSV
// (si apre in Excel o Fogli Google). La password non si salva: resta solo nel campo finché la pagina è aperta.
import { useState } from 'react';
import { ATLAS_API_URL } from '../../../config/ecosystem';
import { BottoneAzione, BottoneSecondario, Pagina } from './componenti';

type Esito = { tipo: 'ok' | 'errore'; testo: string } | null;

const ERRORI: Record<number, string> = {
  401: 'Password non valida.',
  404: 'Non attivo: manca la password (ADMIN_TOKEN) nel server.',
  429: 'Troppi tentativi: riprova tra un minuto.',
};

export default function Admin() {
  const [password, setPassword] = useState('');
  const [occupato, setOccupato] = useState(false);
  const [esito, setEsito] = useState<Esito>(null);

  const scarica = async (soloComunicazioni: boolean) => {
    if (!ATLAS_API_URL) { setEsito({ tipo: 'errore', testo: 'Server non collegato: apri il sito pubblicato (https).' }); return; }
    setOccupato(true); setEsito(null);
    try {
      const r = await fetch(`${ATLAS_API_URL}/v1/admin/signups?formato=csv${soloComunicazioni ? '&comunicazioni=1' : ''}`, { headers: { Authorization: `Bearer ${password.trim()}` } });
      if (!r.ok) { setEsito({ tipo: 'errore', testo: ERRORI[r.status] ?? `Errore ${r.status}.` }); return; }
      const blob = await r.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = soloComunicazioni ? 'contatti.csv' : 'iscrizioni.csv';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      setEsito({ tipo: 'ok', testo: 'File scaricato. Contiene dati personali: non condividerlo.' });
    } catch {
      setEsito({ tipo: 'errore', testo: 'Nessuna risposta dal server: controlla la rete.' });
    } finally { setOccupato(false); }
  };

  return (
    <Pagina titolo="Iscrizioni">
      <div className="mt-4 flex flex-col gap-3">
        <label htmlFor="admin-password" className="text-s2 font-bold text-testo">Password dell'autore</label>
        <input id="admin-password" type="password" autoComplete="off" value={password} onChange={e => setPassword(e.target.value)}
          className="w-full rounded-xl border border-bordo-campo bg-superficie-2 px-3.5 py-3 text-s2 text-testo outline-none focus:outline focus:outline-2 focus:outline-azione" />
        <BottoneAzione onClick={() => void scarica(false)} disabled={occupato || password.trim().length < 8}>Scarica tutte le iscrizioni</BottoneAzione>
        <BottoneSecondario onClick={() => void scarica(true)} disabled={occupato || password.trim().length < 8}>Solo chi accetta le email</BottoneSecondario>
        {esito && <p role="status" data-testo-ok className={esito.tipo === 'ok' ? 'text-s2 font-bold text-alto-testo' : 'text-s2 font-bold text-errore-testo'}>{esito.testo}</p>}
      </div>
    </Pagina>
  );
}
