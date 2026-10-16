import { useMemo } from 'react';
import { Icona, type NomeIcona } from '../../../brand/icone/Icona';
import { useAccess } from '../../../access/context';
import { playTapSound } from '../../../lib/audio';
import { nomeVisibile } from '../../../lib/profilo/dati';
import { livelloConNucleo, SOGLIA_LIVELLO } from '../../../lib/profilo/livello';
import { SCHERMATE } from '../registro';
import { BarraTono, TONI, type Tono } from '../ui';
import { useExtra } from '../contesto';
import { Avatar, Pagina, TesseraIcona, useBanco, useProfilo } from './componenti';

/** Pass in forma di icona + stato: attivo (spunta), in prova (provetta), gratuito (lucchetto). Non si tocca: il Pass si apre dalla tessera. */
function CartaPass({ pass, prova }: { pass: boolean; prova: boolean }) {
  const stato: { icona: NomeIcona; tono: Tono; parola: string } = !pass
    ? { icona: 'blocco', tono: 'medio', parola: 'Gratis' }
    : prova ? { icona: 'stato-prova', tono: 'medio', parola: 'Prova' } : { icona: 'stato-ok', tono: 'alto', parola: 'Attivo' };
  return (
    <div role="status" aria-label={`Pass: ${stato.parola}`} className="flex items-center gap-2 rounded-full bg-superficie py-1 pl-2.5 pr-3 text-[13.5px] font-bold text-testo">
      <Icona nome="pass" size={18} className={TONI.medio.icona} />
      <span aria-hidden="true" className="h-4 w-px bg-linea" />
      <Icona nome={stato.icona} size={17} className={TONI[stato.tono].icona} />
      {stato.parola}
    </div>
  );
}

/** Profilo: chi sei (avatar, nome, livello, Pass) e cinque tessere con una parola. L'ingranaggio porta alle Impostazioni. */
export default function Profilo() {
  const { appState, pass, vai, indietro, apriImpostazioni } = useExtra();
  const { entitlement } = useAccess();
  const { profilo } = useProfilo();
  const { pool, nucleo } = useBanco();

  const livello = useMemo(() => livelloConNucleo(appState.stats, pool, nucleo), [appState.stats, pool, nucleo]);
  const prossimo = livello.prossimo;
  const necessarie = prossimo ? Math.ceil(SOGLIA_LIVELLO * prossimo.totale - 1e-9) : 0;
  const esiste = (id: string) => !!SCHERMATE[id];

  const tessere: { id: string; icona: NomeIcona; tono: Tono; parola: string }[] = [
    { id: 'progressi', icona: 'progressi', tono: 'azione', parola: 'Progressi' },
    { id: 'obiettivi', icona: 'obiettivi', tono: 'alto', parola: 'Obiettivi' },
    { id: 'badge', icona: 'badge', tono: 'viola', parola: 'Badge' },
    { id: 'pass', icona: 'pass', tono: 'medio', parola: 'Pass' },
    { id: 'projectid', icona: 'projectid', tono: 'azione', parola: 'Project ID' },
  ];

  return (
    <Pagina titolo="Profilo" indietro={indietro} destra={
      <button type="button" onClick={() => { playTapSound(); apriImpostazioni(); }} aria-label="Impostazioni"
        className="brand-premibile w-10 h-10 rounded-full bg-superficie-2 text-testo grid place-items-center">
        <Icona nome="impostazioni" size={22} />
      </button>
    }>
      <section aria-label="Il tuo profilo" className="mt-4 rounded-[14px] bg-superficie-2 p-4">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => { playTapSound(); vai('profilo-modifica'); }} aria-label="Modifica il profilo" className="brand-premibile relative shrink-0 rounded-full">
            <Avatar profilo={profilo} lato={72} />
            <span className="absolute -right-1 -bottom-1 grid h-7 w-7 place-items-center rounded-full border-2 border-superficie-2 bg-azione text-azione-su" aria-hidden="true"><Icona nome="modifica" size={14} /></span>
          </button>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-[22px] leading-[28px] font-extrabold text-testo">{nomeVisibile(profilo)}</h2>
            {profilo.corso && <p className="truncate text-[13.5px] leading-[18px] text-testo-tenue">{profilo.corso}</p>}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2.5">
          <div role="status" aria-label={`Livello: ${livello.livello ?? 'da definire'}`} className="flex items-center gap-2 rounded-full bg-superficie py-1 pl-2.5 pr-3.5 text-[13.5px] font-bold text-testo">
            <Icona nome="livello" size={18} className="text-viola" />
            <span className={livello.livello ? 'text-viola-testo text-[16px]' : 'text-testo-tenue'}>{livello.livello ?? '–'}</span>
            {prossimo && <span className="text-[12.5px] font-semibold tabular-nums text-testo-tenue">{prossimo.imparate}/{necessarie}</span>}
          </div>
          <CartaPass pass={pass} prova={entitlement.source === 'demo'} />
        </div>
        {prossimo && <div className="mt-3"><BarraTono tono="viola" valore={Math.min(1, prossimo.imparate / necessarie) * 100} /></div>}
      </section>

      <nav aria-label="Aree del profilo" className="mt-4 grid grid-cols-3 gap-2.5">
        {tessere.filter(t => esiste(t.id)).map(t => (
          <TesseraIcona key={t.id} icona={<Icona nome={t.icona} size={24} />} tono={t.tono} parola={t.parola} onClick={() => vai(t.id)} />
        ))}
      </nav>
    </Pagina>
  );
}
