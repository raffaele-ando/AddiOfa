import { useMemo, useState } from 'react';
import { CalendarDays, Check, Clock, ListChecks, X, type LucideIcon } from 'lucide-react';
import { Carta } from '../../../components/home/comune';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';
import { simulazioniRecenti } from '../../../lib/profilo/attivita';
import { formatoDurata, giornoStudiato, leggiData, NOMI_MESI, registroGiorni, totaliPeriodo, ultimiGiorniAttivita, type GiornoRecente } from '../../../lib/profilo/giorni';
import { TONI, type Tono } from '../ui';
import { useExtra } from '../contesto';
import { Pagina, Sezione, useOggi } from './componenti';

const GIORNI_BREVI = ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'];
const breve = (data: string) => { const d = leggiData(data)!; return `${d.getDate()} ${NOMI_MESI[d.getMonth()].slice(0, 3)}`; };
const lungo = (data: string) => { const d = leggiData(data)!; return `${GIORNI_BREVI[d.getDay()]} ${breve(data)}`; };

/** Barre statiche in CSS, una per giorno: altezza proporzionale al valore più alto del periodo. */
function Barre({ giorni, valore, titolo, unita, tono }: { giorni: GiornoRecente[]; valore: (g: GiornoRecente) => number; titolo: string; unita: string; tono: Tono }) {
  const max = Math.max(1, ...giorni.map(valore));
  const sottile = giorni.length > 10;
  const descrizione = `${titolo}: ${giorni.map(g => `${lungo(g.data)} ${valore(g)}`).join(', ')}`;
  return (
    <Carta className="p-4">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-[15px] font-bold text-testo">{titolo}</h3>
        <span className="text-[12px] text-testo-tenue tabular-nums">massimo {max} {unita}</span>
      </div>
      <div className="mt-3 flex items-end h-[120px] border-b border-tacca" style={{ gap: sottile ? 2 : 6 }} role="img" aria-label={descrizione}>
        {giorni.map(g => {
          const v = valore(g);
          return <span key={g.data} className={cn('flex-1 rounded-t-[3px]', v > 0 ? TONI[tono].barra : 'bg-linea')} style={{ height: v > 0 ? `${Math.max(4, Math.round((v / max) * 116))}px` : '2px' }} />;
        })}
      </div>
      {sottile ? (
        <div className="mt-1.5 flex justify-between text-[11.5px] text-testo-tenue" aria-hidden="true"><span>{breve(giorni[0].data)}</span><span>{breve(giorni[giorni.length - 1].data)}</span></div>
      ) : (
        <div className="mt-1.5 flex" style={{ gap: 6 }} aria-hidden="true">
          {giorni.map(g => <span key={g.data} className="flex-1 text-center text-[11.5px] text-testo-tenue">{g.lettera}</span>)}
        </div>
      )}
    </Carta>
  );
}

/** Attività dell'ultima settimana o dell'ultimo mese, con i numeri veri: domande, minuti, simulazioni. */
export default function Attivita() {
  const { appState, indietro, avviaEsercizi } = useExtra();
  const oggi = useOggi();
  const [periodo, setPeriodo] = useState<7 | 30>(7);
  const registro = useMemo(() => registroGiorni(appState), [appState]);
  const giorni = useMemo(() => ultimiGiorniAttivita(registro, oggi, periodo), [registro, oggi, periodo]);
  const totali = useMemo(() => totaliPeriodo(giorni), [giorni]);
  const sim = useMemo(() => simulazioniRecenti(appState, 5), [appState]);
  const conDati = giorni.filter(g => giornoStudiato(g) || g.secondi > 0).reverse();

  return (
    <Pagina titolo="Attività" indietro={indietro}>
      <div role="radiogroup" aria-label="Periodo" className="mt-4 grid grid-cols-2 gap-1 p-1 rounded-[12px] bg-superficie-2">
        {([[7, 'Ultimi 7 giorni'], [30, 'Ultimi 30 giorni']] as const).map(([p, nome]) => (
          <button key={p} type="button" role="radio" aria-checked={periodo === p} onClick={() => { playTapSound(); setPeriodo(p); }}
            className={cn('rounded-[9px] py-2.5 text-[13px] font-semibold', periodo === p ? 'bg-superficie text-testo shadow-[0_1px_3px_rgba(15,23,42,0.08)] dark:shadow-none dark:border dark:border-linea' : 'text-testo-tenue')}>{nome}</button>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2.5">
        {([
          [String(totali.domande), totali.domande === 1 ? 'domanda' : 'domande', ListChecks, 'azione'],
          [formatoDurata(totali.secondi), 'di studio', Clock, 'medio'],
          [`${totali.giorniDiStudio}/${totali.giorni}`, 'giorni di studio', CalendarDays, 'medio'],
        ] as [string, string, LucideIcon, Tono][]).map(([v, e, Icona, tono]) => (
          <Carta key={e} className="py-3 px-2 flex flex-col items-center text-center">
            <Icona size={18} className={TONI[tono].icona} aria-hidden="true" />
            <p className="mt-1.5 text-[18px] leading-[24px] font-extrabold text-testo tabular-nums whitespace-nowrap">{v}</p>
            <p className="text-[12px] leading-[16px] text-testo-tenue">{e}</p>
          </Carta>
        ))}
      </div>

      {conDati.length === 0 ? (
        <Carta className="mt-3 p-4 flex items-center gap-3">
          <p className="flex-1 text-[13.5px] leading-[19px] text-testo-tenue">Nessuna attività in questo periodo. Appena studi, le barre si riempiono.</p>
          <button type="button" onClick={() => { playTapSound(); avviaEsercizi('smart'); }} className="brand-premibile shrink-0 h-9 px-4 rounded-full bg-azione text-azione-su text-[13.5px] font-semibold">Inizia</button>
        </Carta>
      ) : (
        <div className="mt-3 flex flex-col gap-3">
          <Barre giorni={giorni} valore={g => g.domande} titolo="Domande per giorno" unita={totali.domande === 1 ? 'domanda' : 'domande'} tono="azione" />
          <Barre giorni={giorni} valore={g => g.minuti} titolo="Minuti di studio per giorno" unita="min" tono="medio" />
        </div>
      )}

      {conDati.length > 0 && (
        <Sezione titolo="Giorno per giorno" id="titolo-giorni">
          <ul className="rounded-[12px] bg-superficie-2 overflow-hidden divide-y divide-linea">
            {conDati.slice(0, 14).map(g => (
              <li key={g.data} className="flex items-center justify-between gap-3 px-3.5 py-2.5 text-[13.5px]">
                <span className="font-semibold text-testo">{lungo(g.data)}</span>
                <span className="text-testo-tenue text-right tabular-nums">
                  {g.domande} {g.domande === 1 ? 'domanda' : 'domande'} · {formatoDurata(g.secondi)}{g.simulazioni > 0 ? ` · ${g.simulazioni} ${g.simulazioni === 1 ? 'simulazione' : 'simulazioni'}` : ''}
                </span>
              </li>
            ))}
          </ul>
        </Sezione>
      )}

      <Sezione titolo="Simulazioni recenti" id="titolo-sim">
        {sim.length === 0 ? (
          <p className="rounded-[12px] bg-superficie-2 p-4 text-[13.5px] leading-[19px] text-testo-tenue">Non hai ancora fatto simulazioni.</p>
        ) : (
          <ul className="rounded-[12px] bg-superficie-2 overflow-hidden divide-y divide-linea">
            {sim.map(s => (
              <li key={s.id} className="flex items-center gap-3 px-3.5 py-3">
                <span className={cn('w-8 h-8 rounded-full grid place-items-center shrink-0', s.superata ? 'bg-alto-tinta text-alto-testo' : 'bg-basso-tinta text-basso-testo')} aria-hidden="true">
                  {s.superata ? <Check size={18} strokeWidth={3} /> : <X size={18} strokeWidth={3} />}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-[14.5px] font-semibold text-testo tabular-nums">{s.esatte} su {s.totale}</span>
                  <span className={cn('block text-[12.5px]', s.superata ? 'text-alto-testo font-semibold' : 'text-testo-tenue')}>{s.superata ? 'Soglia superata' : `Soglia ${s.soglia}, non raggiunta`}</span>
                </span>
                <span className="text-[12.5px] text-testo-tenue text-right">{new Date(s.data).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })}</span>
              </li>
            ))}
          </ul>
        )}
      </Sezione>
    </Pagina>
  );
}
