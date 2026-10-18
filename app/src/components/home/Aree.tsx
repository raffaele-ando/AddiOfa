import { Icona, type NomeIcona } from '../../brand/icone/Icona';
import { Illustrazione } from '../../brand/Illustrazione';
import { TitoloSezione } from './Stima';
import { sfumaturaFascia } from './comune';
import { AREA_DEBOLE, areeOrdinate, nomeArea } from './stato';
import { livelloDi, MIN_RISPOSTE, type Fattore } from './stima';
import { playTapSound } from '../../lib/audio';

const ICONA_AREA = (f: Fattore): NomeIcona => f.filtro.startsWith('level:') ? 'livello' : f.nome === 'Traduzione' ? 'frasi' : 'teoria-regola';

const TESTO_PERCENTO = { basso: 'text-basso-testo', medio: 'text-medio-testo', alto: 'text-alto-testo' } as const;

/**
 * Una riga (concept 21): icona da 28 px in un riquadro da 40, nome e percentuale SULLA STESSA RIGA (percentuale a destra), sotto la barra da 6 px.
 * Il testo parte a 68 px dal bordo (16 + 40 + 12), come la fascia di stato e il pulsante. Sotto il 40 % la parola «Da migliorare» con il suo segno
 * (il colore non è l'unico segnale); con meno di 5 risposte «–», barra vuota e la causa.
 */
function Riga({ f, onVai }: { f: Fattore; onVai?: (filtro: string) => void }) {
  const dato = f.percento !== null;
  const liv = dato ? livelloDi(f.percento! / 100) : null;
  const debole = dato && f.percento! < AREA_DEBOLE;
  const nome = nomeArea(f);
  const corpo = (
    <>
      <span aria-hidden="true" className="w-10 h-10 shrink-0 grid place-items-center text-azione"><Icona nome={ICONA_AREA(f)} size={28} /></span>
      <span className="flex-1 min-w-0">
        <span className="flex items-baseline justify-between gap-2">
          <span className="min-w-0 truncate text-[15px] leading-[20px] font-semibold text-testo">{nome}</span>
          <span className={`shrink-0 text-[15px] leading-[20px] tabular-nums ${dato ? `font-bold ${TESTO_PERCENTO[liv!]}` : 'font-medium text-testo-tenue'}`}>{dato ? `${f.percento}%` : '–'}</span>
        </span>
        <span className="mt-[7px] block h-[6px] rounded-full bg-linea dark:bg-tacca overflow-hidden">
          {dato && f.percento! > 0 && <span className="block h-full rounded-full" style={{ width: `${Math.max(4, Math.min(100, f.percento!))}%`, background: sfumaturaFascia(liv!) }} />}
        </span>
        {debole && (
          <span className="mt-1 inline-flex items-center gap-1 text-[12.5px] leading-[16px] font-semibold text-basso-testo">
            <Icona nome="stato-attenzione" size={14} />Da migliorare
          </span>
        )}
        {!dato && <span className="mt-1 block text-[12.5px] leading-[16px] text-testo-tenue">Meno di {MIN_RISPOSTE} risposte</span>}
      </span>
      {onVai && <Icona nome="avanti" size={18} className="shrink-0 text-testo-tenue" />}
    </>
  );
  const classe = 'flex items-center gap-3 w-full px-4 py-[10px] text-left min-w-0';
  return onVai
    ? <button type="button" onClick={() => { playTapSound(); onVai(f.filtro); }} className={`brand-premibile ${classe}`}
        aria-label={`Allenati su ${nome}: ${dato ? `${f.percento} %` : 'ancora nessun dato'}`}>{corpo}</button>
    : <div className={classe} role="group" aria-label={`${nome}: ${dato ? `${f.percento} %` : 'ancora nessun dato'}`}>{corpo}</div>;
}

/**
 * «Le tue aree»: categorie e livelli reali (calcolaFattori, la stessa fonte dell'analisi ATLAS), dalla più debole, in una carta a una colonna
 * (sul desktop sta nella colonna di destra, accanto alla simulazione). Senza nessun dato, una carta vuota che dice la causa.
 */
export default function Aree({ categorie, livelli, onVai }: { categorie: Fattore[]; livelli: Fattore[]; onVai?: (filtro: string) => void }) {
  const righe = areeOrdinate(categorie, livelli);
  const conDati = righe.some(f => f.percento !== null);
  return (
    <section aria-labelledby="titolo-aree" className="flex flex-col gap-3">
      <TitoloSezione id="titolo-aree">Le tue aree</TitoloSezione>
      {!conDati ? (
        <div role="status" className="flex items-center gap-[14px] rounded-[16px] bg-superficie-2 p-[14px]">
          <span aria-hidden="true" className="w-[68px] h-[56px] shrink-0 grid place-items-center"><Illustrazione nome="progressi-statistiche-scheda" lato={64} /></span>
          <span className="min-w-0">
            <span className="block text-[16px] leading-[22px] font-bold text-testo">Nessun dato per area</span>
            <span data-testo-ok className="block text-[14px] leading-[19px] text-testo-tenue">Rispondi ad almeno {MIN_RISPOSTE} domande per area.</span>
          </span>
        </div>
      ) : (
        <ul className="rounded-[16px] bg-superficie-2 py-1">
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
