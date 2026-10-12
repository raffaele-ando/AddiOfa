import { useState } from 'react';
import { Check } from 'lucide-react';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';
import { AVATAR, CORSO_MAX, NOME_MAX, NOME_DI_RIPIEGO, normalizzaProfilo, type ProfiloDati } from '../../../lib/profilo/dati';
import { useExtra } from '../contesto';
import { Avatar, Pagina, Sezione, useProfilo } from './componenti';

const CAMPO = 'w-full h-12 rounded-[12px] bg-superficie-2 border border-linea px-3.5 text-[16px] text-testo placeholder:text-testo-tenue focus:outline-none focus:border-azione';

/** Modifica nome, avatar e corso di studi. Si salva solo con «Salva»; «Indietro» lascia tutto com'era. */
export default function ProfiloModifica() {
  const { indietro } = useExtra();
  const { profilo, salva } = useProfilo();
  const [bozza, setBozza] = useState<ProfiloDati>(profilo);
  const modificato = JSON.stringify(normalizzaProfilo(bozza)) !== JSON.stringify(profilo);
  const aggiorna = (p: Partial<ProfiloDati>) => setBozza(b => ({ ...b, ...p }));
  const anteprima = normalizzaProfilo(bozza);

  const conferma = () => { salva(bozza); indietro(); };

  return (
    <Pagina titolo="Modifica profilo" indietro={indietro}>
      <div className="mt-5 flex justify-center"><Avatar profilo={anteprima} lato={96} /></div>

      <Sezione titolo="Avatar" id="titolo-avatar">
        <div role="radiogroup" aria-label="Avatar" className="grid grid-cols-4 gap-2.5">
          {[{ id: 'iniziale', etichetta: 'Lettera' }, ...AVATAR].map(a => {
            const on = bozza.avatar === a.id;
            return (
              <button key={a.id} type="button" role="radio" aria-checked={on} aria-label={a.etichetta}
                onClick={() => { playTapSound(); aggiorna({ avatar: a.id }); }}
                className={cn('brand-premibile relative rounded-[14px] p-1.5 flex flex-col items-center gap-1 border-2', on ? 'border-azione bg-azione-tinta' : 'border-transparent bg-superficie-2')}>
                <Avatar profilo={{ ...anteprima, avatar: a.id }} lato={56} />
                <span className="text-[11.5px] leading-[14px] text-testo-tenue">{a.etichetta}</span>
                {on && <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-azione text-azione-su grid place-items-center" aria-hidden="true"><Check size={13} strokeWidth={3} /></span>}
              </button>
            );
          })}
        </div>
        <p className="text-[12px] leading-[17px] text-testo-tenue">Un'illustrazione o la lettera del tuo nome. Non servono foto.</p>
      </Sezione>

      <Sezione titolo="Nome" id="titolo-nome">
        <input type="text" value={bozza.nome} maxLength={NOME_MAX} onChange={e => aggiorna({ nome: e.target.value })}
          aria-labelledby="titolo-nome" placeholder={NOME_DI_RIPIEGO} autoComplete="off" className={CAMPO} />
        <p className="text-[12px] leading-[17px] text-testo-tenue">Lo vedi solo tu, resta su questo dispositivo. Se lo lasci vuoto resti «{NOME_DI_RIPIEGO}».</p>
      </Sezione>

      <Sezione titolo="Corso di studi (facoltativo)" id="titolo-corso">
        <input type="text" value={bozza.corso} maxLength={CORSO_MAX} onChange={e => aggiorna({ corso: e.target.value })}
          aria-labelledby="titolo-corso" placeholder="Per esempio: Ingegneria informatica" autoComplete="off" className={CAMPO} />
      </Sezione>

      <div className="mt-7 flex gap-3">
        <button type="button" onClick={() => { playTapSound(); indietro(); }} className="brand-premibile flex-1 h-12 rounded-[12px] bg-superficie-2 text-testo text-[15px] font-semibold">Annulla</button>
        <button type="button" onClick={() => { playTapSound(); conferma(); }} disabled={!modificato}
          className="brand-premibile flex-1 h-12 rounded-[12px] bg-azione text-azione-su text-[15px] font-bold">Salva</button>
      </div>
    </Pagina>
  );
}
