import { Icona, type NomeIcona } from '../../brand/icone/Icona';
import { ChipLivello } from '../../screens/extra/studio/comune';
import { TitoloSezione } from './Stima';
import { PIENO_FASCIA } from './comune';
import { AREA_DEBOLE, areeOrdinate, nomeArea } from './stato';
import { livelloDi, MIN_RISPOSTE, type Fattore } from './stima';
import { playTapSound } from '../../lib/audio';

// Grammatica e Traduzione hanno la loro icona; i tre livelli (A1, A2, B1) non possono avere la stessa: ognuno mostra il proprio chip di testo.
const ICONA_CATEGORIA = (f: Fattore): NomeIcona => f.nome === 'Traduzione' ? 'frasi' : 'teoria-regola';
const eLivello = (f: Fattore) => f.filtro.startsWith('level:');

const TESTO_PERCENTO = { basso: 'text-basso-testo', medio: 'text-medio-testo', alto: 'text-alto-testo' } as const;

/**
 * Una riga compatta (secondaria): icona da 22 in un riquadro da 32, nome e percentuale SULLA STESSA RIGA (percentuale a destra), sotto la barra da 6 px.
 * Sotto il 40 % la parola «Da migliorare» con il suo segno (il colore non è l'unico segnale); con meno di 5 risposte «–», barra vuota e la causa.
 */
function Riga({ f, onVai }: { f: Fattore; onVai?: (filtro: string) => void }) {
  const dato = f.percento !== null;
  const liv = dato ? livelloDi(f.percento! / 100) : null;
  const debole = dato && f.percento! < AREA_DEBOLE;
  const nome = nomeArea(f);
  const corpo = (
    <>
      <span aria-hidden="true" className="w-8 h-8 shrink-0 grid place-items-center text-azione">
        {eLivello(f) ? <ChipLivello livello={f.nome} className="text-s1 leading-[15px] px-1.5 py-0.5" /> : <Icona nome={ICONA_CATEGORIA(f)} size={22} />}
      </span>
      <span className="flex-1 min-w-0">
        <span className="flex items-baseline justify-between gap-2">
          <span className="min-w-0 truncate text-s2 leading-[20px] font-semibold text-testo">{nome}</span>
          <span className={`shrink-0 text-s2 leading-[20px] tabular-nums ${dato ? `font-bold ${TESTO_PERCENTO[liv!]}` : 'font-medium text-testo-tenue'}`}>{dato ? `${f.percento}%` : '–'}</span>
        </span>
        <span className="mt-1.5 block h-[6px] rounded-full bg-linea dark:bg-tacca overflow-hidden">
          {dato && f.percento! > 0 && <span className="block h-full rounded-full" style={{ width: `${Math.max(4, Math.min(100, f.percento!))}%`, background: PIENO_FASCIA[liv!] }} />}
        </span>
        {debole && (
          <span className="mt-1 inline-flex items-center gap-1 text-s1 leading-[16px] font-semibold text-basso-testo">
            <Icona nome="stato-attenzione" size={14} />Da migliorare
          </span>
        )}
        {!dato && <span className="mt-1 block text-s1 leading-[16px] text-testo-tenue">Meno di {MIN_RISPOSTE} risposte</span>}
      </span>
      {onVai && <Icona nome="avanti" size={18} className="shrink-0 text-testo-tenue" />}
    </>
  );
  const classe = 'flex items-center gap-3 w-full px-3 py-2 text-left min-w-0';
  return onVai
    ? <button type="button" onClick={() => { playTapSound(); onVai(f.filtro); }} className={`brand-premibile ${classe}`}
        aria-label={`Allenati su ${nome}: ${dato ? `${f.percento} %` : 'ancora nessun dato'}`}>{corpo}</button>
    : <div className={classe} role="group" aria-label={`${nome}: ${dato ? `${f.percento} %` : 'ancora nessun dato'}`}>{corpo}</div>;
}

/**
 * «Le tue aree»: categorie e livelli reali (calcolaFattori, la stessa fonte dell'analisi ATLAS), dalla più debole, in una lista a una colonna con
 * bordo leggero (secondaria). Senza nessun dato, una riga che dice la causa.
 */
export default function Aree({ categorie, livelli, onVai }: { categorie: Fattore[]; livelli: Fattore[]; onVai?: (filtro: string) => void }) {
  const righe = areeOrdinate(categorie, livelli);
  const conDati = righe.some(f => f.percento !== null);
  return (
    <section aria-labelledby="titolo-aree" className="flex flex-col gap-3">
      <TitoloSezione id="titolo-aree">Le tue aree</TitoloSezione>
      {!conDati ? (
        <div role="status" className="flex items-center gap-3 rounded-xl border border-linea dark:border-tacca bg-superficie px-3 py-3">
          <span aria-hidden="true" className="w-8 h-8 shrink-0 grid place-items-center rounded-xl bg-superficie-2 text-testo-tenue"><Icona nome="argomenti" size={18} /></span>
          <span className="min-w-0">
            <span className="block text-s2 leading-[20px] font-bold text-testo">Nessun dato per area</span>
            <span data-testo-ok className="block text-s1 leading-[16px] text-testo-tenue">Rispondi ad almeno {MIN_RISPOSTE} domande per area.</span>
          </span>
        </div>
      ) : (
        <ul className="rounded-xl border border-linea dark:border-tacca bg-superficie py-0.5">
          {righe.map((f, i) => (
            <li key={f.id} className={i > 0 ? 'border-t border-linea dark:border-tacca' : ''}>
              <Riga f={f} onVai={onVai} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
