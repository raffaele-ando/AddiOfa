import { Icona } from '../../brand/icone/Icona';
import { Illustrazione } from '../../brand/Illustrazione';
import { TitoloSezione, LinkTutte } from './Stima';
import type { RiepilogoSimulazione } from '../../lib/studio/simulazioni';
import { EXAM } from '../../config/offer';
import { playTapSound } from '../../lib/audio';
import { cn } from '../../lib/utils';

function dataBreve(t: number): string {
  try { return new Date(t).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' }); } catch { return ''; }
}

/** I tre dati del formato (30 domande, 15 minuti, soglia 25/30), con icona, per chi non ha ancora svolto nessuna simulazione. */
function DatiFormato() {
  const dato = (icona: 'risposte' | 'tempo' | 'soglia', valore: string, aria: string) => (
    <span role="img" aria-label={aria} className="inline-flex items-center gap-1 text-[14px] leading-[18px] font-bold tabular-nums text-testo">
      <Icona nome={icona} size={16} className="text-azione-testo" />{valore}
    </span>
  );
  return (
    <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
      {dato('risposte', String(EXAM.questions), `${EXAM.questions} domande`)}
      {dato('tempo', `${EXAM.minutes} min`, `${EXAM.minutes} minuti`)}
      {dato('soglia', `${EXAM.passMark}/${EXAM.questions}`, `Soglia ${EXAM.passMark} su ${EXAM.questions}`)}
    </span>
  );
}

/**
 * «Simulazione»: una carta con l'ultimo risultato (x/30, esito con segno e parola, data; sotto soglia anche la soglia) e un pulsante con la parola
 * per iniziarne una nuova; senza simulazioni svolte, i tre dati del formato. Toccando il risultato si apre il dettaglio. «Tutte le simulazioni» apre l'elenco.
 */
export default function Simulazione({ ultima, onInizia, onApriUltima, onTutte }: {
  ultima: RiepilogoSimulazione | null; onInizia?: () => void; onApriUltima?: () => void; onTutte?: () => void;
}) {
  const corpo = ultima ? (
    <span className="block min-w-0">
      <span className="flex items-baseline gap-1.5">
        <span aria-hidden="true" className={cn('text-[30px] leading-[32px] font-extrabold tabular-nums', ultima.superata ? 'text-alto-numero' : 'text-basso-numero')}>{ultima.esatte}</span>
        <span aria-hidden="true" className="text-[14px] leading-[18px] font-bold tabular-nums text-testo-tenue">/{ultima.totale}</span>
        <span aria-hidden="true" className={cn('ml-1 inline-flex items-center gap-1 text-[12.5px] leading-[16px] font-semibold', ultima.superata ? 'text-alto-testo' : 'text-basso-testo')}>
          <Icona nome={ultima.superata ? 'stato-ok' : 'stato-attenzione'} size={14} />{ultima.superata ? 'Superata' : 'Sotto soglia'}
        </span>
      </span>
      <span aria-hidden="true" className="block text-[13px] leading-[17px] text-testo-tenue">
        {dataBreve(ultima.data)}{!ultima.superata && <> · soglia {EXAM.passMark} su {EXAM.questions}</>}
      </span>
    </span>
  ) : <DatiFormato />;

  const etichettaUltima = ultima ? `Ultima simulazione, ${dataBreve(ultima.data)}: ${ultima.esatte} su ${ultima.totale}, ${ultima.superata ? 'superata' : `sotto soglia (soglia ${EXAM.passMark})`}` : '';
  const arte = <span aria-hidden="true" className="w-[56px] h-[56px] shrink-0 grid place-items-center"><Illustrazione nome="simulazione-esame" lato={54} /></span>;
  const classiCorpo = 'flex flex-1 min-w-0 items-center gap-3 text-left';

  return (
    <section aria-labelledby="titolo-simulazione" className="flex flex-col gap-3">
      <TitoloSezione id="titolo-simulazione" destra={onTutte ? <LinkTutte onClick={onTutte} aria="Tutte le simulazioni" testo="Tutte le simulazioni" /> : undefined}>Simulazione</TitoloSezione>
      <div className="rounded-[16px] bg-superficie-2 p-4">
        {ultima && onApriUltima ? (
          <button type="button" onClick={() => { playTapSound(); onApriUltima(); }} aria-label={etichettaUltima} className={cn(classiCorpo, 'brand-premibile w-full rounded-[10px]')}>
            {arte}{corpo}<Icona nome="avanti" size={20} className="ml-auto shrink-0 text-testo-tenue" />
          </button>
        ) : (
          <div className={classiCorpo} role={ultima ? 'img' : undefined} aria-label={ultima ? etichettaUltima : undefined}>{arte}{corpo}</div>
        )}
        {onInizia && (
          <button type="button" onClick={() => { playTapSound(); onInizia(); }}
            className="brand-premibile mt-3 w-full min-h-[48px] flex items-center justify-center gap-2 rounded-[12px] bg-azione-tinta text-azione-testo text-[15px] leading-[20px] font-bold">
            <Icona nome="studia" size={18} />{ultima ? 'Fai un’altra simulazione' : 'Fai una simulazione'}
          </button>
        )}
      </div>
    </section>
  );
}
