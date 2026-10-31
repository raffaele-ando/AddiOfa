import { useState } from 'react';
import { Icona } from '../../../brand/icone/Icona';
import { cn } from '../../../lib/utils';
import { CORSO_MAX, NOME_MAX, normalizzaProfilo, type ProfiloDati } from '../../../lib/profilo/dati';
import { useExtra } from '../contesto';
import { BottoneAzione } from '../servizi/componenti';
import { Avatar, Pagina, useProfilo } from './componenti';

const CAMPO = 'h-12 w-full rounded-[12px] border border-bordo-campo bg-superficie px-3.5 text-[16px] font-semibold text-testo placeholder:font-normal placeholder:text-testo-tenue focus:border-azione focus:outline-none focus:ring-2 focus:ring-azione/30';

/** Modifica nome e corso di studi. Si salva solo con «Salva» (fisso in basso, attivo quando qualcosa è cambiato); la freccia indietro lascia tutto com'era.
 *  Ogni campo ha la sua etichetta sopra, vicina; nessuna illustrazione fra l'etichetta e il campo; in alto la lettera dell'avatar, che segue il nome. */
export default function ProfiloModifica() {
  const { indietro } = useExtra();
  const { profilo, salva } = useProfilo();
  const [bozza, setBozza] = useState<ProfiloDati>(profilo);
  const modificato = JSON.stringify(normalizzaProfilo(bozza)) !== JSON.stringify(profilo);
  const aggiorna = (p: Partial<ProfiloDati>) => setBozza(b => ({ ...b, ...p }));
  const anteprima = normalizzaProfilo(bozza);
  const conferma = () => { salva(bozza); indietro(); };

  return (
    <Pagina titolo="Modifica profilo" indietro={indietro}
      piede={<BottoneAzione disabled={!modificato} icona={<Icona nome="salva" size={20} />} onClick={conferma}>Salva</BottoneAzione>}>
      <div className="mt-3 flex flex-col gap-5 rounded-[16px] border border-linea bg-superficie p-4 shadow-sm dark:shadow-none">
        <div className="flex items-center gap-3.5">
          <Avatar profilo={anteprima} lato={56} />
          <p data-testo-ok className="min-w-0 flex-1 text-[14px] leading-[20px] text-testo-tenue">L&apos;avatar è la prima lettera del tuo nome.</p>
        </div>

        <div>
          <label htmlFor="mod-nome" className="block text-[15px] leading-[21px] font-bold text-testo">Nome</label>
          <input id="mod-nome" type="text" value={bozza.nome} maxLength={NOME_MAX} onChange={e => aggiorna({ nome: e.target.value })}
            placeholder="Come ti chiami?" autoComplete="off" className={cn(CAMPO, 'mt-2')} />
        </div>

        <div>
          <label htmlFor="mod-corso" className="block text-[15px] leading-[21px] font-bold text-testo">Corso di studi</label>
          <input id="mod-corso" type="text" value={bozza.corso} maxLength={CORSO_MAX} onChange={e => aggiorna({ corso: e.target.value })}
            placeholder="Es. Ingegneria informatica" autoComplete="off" className={cn(CAMPO, 'mt-2')} />
        </div>
      </div>
    </Pagina>
  );
}
