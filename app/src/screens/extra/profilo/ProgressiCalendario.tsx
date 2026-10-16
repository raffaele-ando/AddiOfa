import { useMemo, useState } from 'react';
import { Icona } from '../../../brand/icone/Icona';
import { Carta } from '../../../components/home/comune';
import { playTapSound } from '../../../lib/audio';
import { cn, chiaveGiorno } from '../../../lib/utils';
import {
  datiDelGiorno, formatoDurata, giornoStudiato, INTESTAZIONE_SETTIMANA, leggiData, meseCalendario, NOMI_MESI, registroGiorni, spostaMese, totaliPeriodo, ultimiGiorniAttivita,
  type GiornoRecente,
} from '../../../lib/profilo/giorni';
import { normalizzaObiettivi, type ObiettiviDati, OBIETTIVI_INIZIALI } from '../../../lib/profilo/obiettivi';
import { TONI, type Tono } from '../ui';
import { useExtra, useExtraDati } from '../contesto';
import { Disegno } from '../servizi/componenti';
import { useOggi } from './componenti';

const GIORNI = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
const GIORNI_BREVI = ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'];
const breve = (data: string) => { const d = leggiData(data)!; return `${d.getDate()} ${NOMI_MESI[d.getMonth()].slice(0, 3)}`; };
const lungo = (data: string) => { const d = leggiData(data)!; return `${GIORNI_BREVI[d.getDay()]} ${breve(data)}`; };
const nomeGiorno = (data: string) => { const d = leggiData(data)!; return `${GIORNI[d.getDay()]} ${d.getDate()} ${NOMI_MESI[d.getMonth()]}`; };

/** Tre numeri con icona (risposte, tempo, simulazioni o giorni): al posto delle frasi di riepilogo. */
function Numeri({ voci }: { voci: { icona: 'risposte' | 'tempo' | 'simulazioni' | 'giorni-studio'; valore: string; nome: string; tono: Tono }[] }) {
  return (
    <dl className="grid grid-cols-3 gap-2 text-center">
      {voci.map(v => (
        <div key={v.nome} className="rounded-[10px] bg-superficie py-2.5 px-1">
          <dt className="sr-only">{v.nome}</dt>
          <Icona nome={v.icona} size={18} className={cn('mx-auto', TONI[v.tono].icona)} />
          <dd className="mt-1 text-[17px] leading-[22px] font-extrabold text-testo tabular-nums whitespace-nowrap">{v.valore}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Barre statiche in CSS, una per giorno: altezza proporzionale al valore più alto del periodo. */
function Barre({ giorni, valore, titolo, icona, tono }: { giorni: GiornoRecente[]; valore: (g: GiornoRecente) => number; titolo: string; icona: 'risposte' | 'tempo'; tono: Tono }) {
  const max = Math.max(1, ...giorni.map(valore));
  const sottile = giorni.length > 10;
  const descrizione = `${titolo}: ${giorni.map(g => `${lungo(g.data)} ${valore(g)}`).join(', ')}`;
  return (
    <Carta className="p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="inline-flex items-center gap-2 text-[15px] font-bold text-testo"><Icona nome={icona} size={18} className={TONI[tono].icona} /><span className="sr-only">{titolo}</span></h3>
        <span className="text-[12.5px] font-bold text-testo-tenue tabular-nums">max {max}</span>
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

/** Calendario del mese (giorni in cui hai studiato) e attività a barre di 7 o 30 giorni. */
export default function ProgressiCalendario() {
  const { appState } = useExtra();
  const [grezzi] = useExtraDati<ObiettiviDati>('obiettivi', OBIETTIVI_INIZIALI);
  const dataTest = normalizzaObiettivi(grezzi).dataTest;
  const oggi = useOggi();
  const chiaveOggi = chiaveGiorno(oggi);
  const [vista, setVista] = useState({ anno: oggi.getFullYear(), mese: oggi.getMonth() });
  const [scelto, setScelto] = useState(chiaveOggi);
  const [periodo, setPeriodo] = useState<7 | 30>(7);

  const registro = useMemo(() => registroGiorni(appState), [appState]);
  const mese = useMemo(() => meseCalendario(vista.anno, vista.mese, registro, oggi, dataTest), [vista, registro, oggi, dataTest]);
  const giorno = datiDelGiorno(registro, scelto);
  const eTest = scelto === dataTest;
  const sposta = (delta: number) => { playTapSound(); setVista(v => spostaMese(v.anno, v.mese, delta)); };
  const giorni = useMemo(() => ultimiGiorniAttivita(registro, oggi, periodo), [registro, oggi, periodo]);
  const attivi = useMemo(() => totaliPeriodo(giorni), [giorni]);
  const haAttivita = giorni.some(g => giornoStudiato(g) || g.secondi > 0);

  return (
    <div className="flex flex-col gap-3">
      <Carta className="p-3.5">
        <div className="flex items-center justify-between">
          <button type="button" onClick={() => sposta(-1)} aria-label="Mese precedente" className="brand-premibile w-10 h-10 rounded-full grid place-items-center text-azione"><Icona nome="indietro" size={26} /></button>
          <h3 className="text-[16px] font-bold text-testo" aria-live="polite">{mese.etichetta}</h3>
          <button type="button" onClick={() => sposta(1)} aria-label="Mese successivo" className="brand-premibile w-10 h-10 rounded-full grid place-items-center text-azione"><Icona nome="avanti" size={26} /></button>
        </div>
        <div className="mt-1 grid grid-cols-7 text-center text-[12px] font-semibold text-testo-tenue" aria-hidden="true">
          {INTESTAZIONE_SETTIMANA.map((l, i) => <span key={i} className="py-1.5">{l}</span>)}
        </div>
        <div className="grid grid-cols-7 gap-y-1" role="group" aria-label={`${mese.etichetta}, ${totaliPeriodo(mese.settimane.flat().filter(c => c.delMese).map(c => datiDelGiorno(registro, c.data))).giorniDiStudio} giorni di studio`}>
          {mese.settimane.flat().map(c => c.delMese ? (
            <button key={c.data} type="button" aria-pressed={scelto === c.data}
              aria-label={`${nomeGiorno(c.data)}${c.studiato ? ', hai studiato' : ''}${c.oggi ? ', oggi' : ''}${c.test ? ', data del test' : ''}`}
              onClick={() => { playTapSound(); setScelto(c.data); }}
              className="relative h-11 grid place-items-center">
              <span className={cn('w-10 h-10 rounded-full grid place-items-center text-[14.5px] tabular-nums',
                c.studiato ? 'bg-medio-chiaro text-testo dark:bg-medio dark:text-azione-su font-bold' : c.futuro ? 'text-testo-tenue' : 'text-testo',
                c.oggi && !c.studiato && 'border-2 border-azione font-bold',
                c.oggi && c.studiato && 'ring-2 ring-offset-2 ring-azione ring-offset-superficie-2',
                scelto === c.data && !c.studiato && !c.oggi && 'bg-azione-tinta font-bold',
                scelto === c.data && c.studiato && 'ring-2 ring-offset-2 ring-testo ring-offset-superficie-2',
              )}>{c.giorno}</span>
              {c.test && <Icona nome="data-test" size={13} className="absolute top-0.5 right-0.5 text-medio-numero" />}
            </button>
          ) : <span key={c.data} aria-hidden="true" />)}
        </div>
      </Carta>

      <Carta className="p-4">
        <h3 className="flex items-center gap-2 text-[15.5px] font-bold text-testo" aria-live="polite">
          {nomeGiorno(scelto)}{scelto === chiaveOggi ? ' (oggi)' : ''}
          {eTest && <span role="img" aria-label="Data del test" className="text-medio-numero"><Icona nome="data-test" size={18} /></span>}
        </h3>
        <div className="mt-2">
          <Numeri voci={[
            { icona: 'risposte', valore: String(giorno.domande), nome: 'Risposte', tono: 'azione' },
            { icona: 'tempo', valore: formatoDurata(giorno.secondi), nome: 'Tempo', tono: 'medio' },
            { icona: 'simulazioni', valore: String(giorno.simulazioni), nome: 'Simulazioni', tono: 'alto' },
          ]} />
        </div>
      </Carta>

      <div className="mt-3 flex items-center justify-between gap-3">
        <h3 className="inline-flex items-center gap-2 text-[15.5px] font-bold text-testo"><Icona nome="giorni-studio" size={20} className="text-medio-numero" /><span className="sr-only">Attività</span><span className="tabular-nums">{attivi.giorniDiStudio}/{attivi.giorni}</span></h3>
        <div role="radiogroup" aria-label="Periodo" className="grid grid-cols-2 gap-1 rounded-[10px] bg-superficie-2 p-1">
          {([7, 30] as const).map(p => (
            <button key={p} type="button" role="radio" aria-checked={periodo === p} aria-label={`Ultimi ${p} giorni`} onClick={() => { playTapSound(); setPeriodo(p); }}
              className={cn('h-8 min-w-[44px] rounded-[7px] px-2.5 text-[13.5px] font-bold tabular-nums', periodo === p ? 'bg-superficie text-azione-scuro shadow-[0_1px_3px_rgba(15,23,42,0.08)] dark:shadow-none dark:border dark:border-linea' : 'text-testo-tenue')}>{p}</button>
          ))}
        </div>
      </div>
      {haAttivita ? (
        <>
          <Numeri voci={[
            { icona: 'risposte', valore: String(attivi.domande), nome: 'Risposte', tono: 'azione' },
            { icona: 'tempo', valore: formatoDurata(attivi.secondi), nome: 'Tempo', tono: 'medio' },
            { icona: 'giorni-studio', valore: `${attivi.giorniDiStudio}/${attivi.giorni}`, nome: 'Giorni', tono: 'medio' },
          ]} />
          <Barre giorni={giorni} valore={g => g.domande} titolo="Risposte per giorno" icona="risposte" tono="azione" />
          <Barre giorni={giorni} valore={g => g.minuti} titolo="Minuti per giorno" icona="tempo" tono="medio" />
        </>
      ) : (
        <div role="status" aria-label="Nessuna attività" className="flex items-center justify-center rounded-[12px] bg-superficie-2 py-5"><Disegno nome="piano-superamento" lato={96} /></div>
      )}
    </div>
  );
}
