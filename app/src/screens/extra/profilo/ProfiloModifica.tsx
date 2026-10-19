import { useState } from 'react';
import { Icona } from '../../../brand/icone/Icona';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';
import { AVATAR, CORSO_MAX, NOME_MAX, normalizzaProfilo, type ProfiloDati } from '../../../lib/profilo/dati';
import { useExtra } from '../contesto';
import { BottoneAzione } from '../servizi/componenti';
import { Avatar, Pagina, useProfilo } from './componenti';

const CAMPO = 'h-12 w-full rounded-[12px] border border-bordo-campo bg-superficie px-3.5 text-[16px] font-semibold text-testo placeholder:font-normal placeholder:text-testo-tenue focus:border-azione focus:outline-none focus:ring-2 focus:ring-azione/30';

/** Modifica nome, avatar e corso di studi. Si salva solo con «Salva» (fisso in basso, attivo quando qualcosa è cambiato); la freccia indietro lascia tutto com'era.
 *  Ogni campo ha la sua etichetta sopra, vicina; nessuna illustrazione fra l'etichetta e il campo; l'avatar scelto fa da anteprima. */
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
      piede={<BottoneAzione disabled={!modificato} icona={<Icona nome="stato-ok" size={20} />} onClick={conferma}>Salva</BottoneAzione>}>
      <div className="mt-3 flex flex-col gap-5 rounded-[16px] border border-linea bg-superficie p-4 shadow-sm dark:shadow-none">
        <div role="radiogroup" aria-labelledby="mod-avatar">
          <h2 id="mod-avatar" className="text-[15px] leading-[21px] font-bold text-testo">Avatar</h2>
          <div className="mt-2.5 grid grid-cols-4 gap-2.5">
            {[{ id: 'iniziale', etichetta: 'Lettera' }, ...AVATAR].map(a => {
              const on = bozza.avatar === a.id;
              return (
                <button key={a.id} type="button" role="radio" aria-checked={on} aria-label={a.etichetta}
                  onClick={() => { playTapSound(); aggiorna({ avatar: a.id }); }}
                  className={cn('brand-premibile relative grid aspect-square place-items-center rounded-[16px] border-2', on ? 'border-azione bg-azione-tinta' : 'border-linea bg-transparent')}>
                  <Avatar profilo={{ ...anteprima, avatar: a.id }} lato={52} />
                  {on && <span className="absolute -right-1.5 -top-1.5 grid h-6 w-6 place-items-center rounded-[8px] bg-azione text-azione-su" aria-hidden="true"><Icona nome="stato-ok" size={14} /></span>}
                </button>
              );
            })}
          </div>
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
