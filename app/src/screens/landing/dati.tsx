import { Icona, type NomeIcona } from '../../brand/icone/Icona';
import { FORMATS, FREE_LIMITS, PASS, RETAKE_COST_EUR, currentPriceEur, formatEur, isLaunchPrice } from '../../config/offer';
import type { PaywallReason } from '../../types';
import { IconaTono, type Tono } from '../extra/ui';
import { cn } from '../../lib/utils';
import { InfoFoglio, dataCorta } from './comune';

// Dati a icone usati da più schermate dell'ingresso (landing, risultato del diagnostico, Pass): una sola fonte, così «Gratis / Pass»
// e «Se non superi» dicono le stesse cose negli stessi simboli. I numeri vengono da config/offer.ts.

export type Valore = string | boolean;

export interface RigaConfronto {
  id: string;
  icona: NomeIcona;
  etichetta: string;
  tono: Tono;
  gratis: Valore;
  pass: Valore;
  /** Il motivo per cui si arriva al Pass: la riga corrispondente si evidenzia. */
  motivi?: PaywallReason[];
}

/** Gratis e Pass a confronto. `true` = incluso, `false` = nel Pass (lucchetto), `'∞'` = illimitato, un numero = quanti. */
export const CONFRONTO: RigaConfronto[] = [
  { id: 'diagnostico', icona: 'diagnostico', etichetta: 'Diagnostico', tono: 'azione', gratis: String(FREE_LIMITS.diagnostic), pass: true },
  { id: 'esercizi', icona: 'esercizi', etichetta: 'Esercizi', tono: 'azione', gratis: String(FREE_LIMITS.coreQuestions), pass: '∞', motivi: ['domande'] },
  { id: 'simulazioni', icona: 'simulazioni', etichetta: 'Simulazioni', tono: 'medio', gratis: String(FREE_LIMITS.freeSimulations), pass: '∞', motivi: ['simulazione', 'teng'] },
  { id: 'spiegazioni', icona: 'spiegazioni', etichetta: 'Spiegazioni', tono: 'viola', gratis: false, pass: true },
  { id: 'teoria', icona: 'teoria', etichetta: 'Teoria', tono: 'viola', gratis: String(FREE_LIMITS.freeTheoryTopics), pass: '31', motivi: ['teoria'] },
  { id: 'errori', icona: 'errori', etichetta: 'Errori', tono: 'basso', gratis: false, pass: true, motivi: ['errori'] },
  { id: 'progressi', icona: 'progressi', etichetta: 'Progressi', tono: 'alto', gratis: false, pass: true, motivi: ['statistiche'] },
];

/** Cella del confronto: spunta, lucchetto, infinito o numero. */
export function Cella({ v, pieno }: { v: Valore; pieno?: boolean }) {
  if (v === true) return <Icona nome="stato-incluso" size={22} className={pieno ? 'text-white' : 'text-alto-numero'} titolo="Incluso" />;
  if (v === false) return <Icona nome="blocco" size={18} className={pieno ? 'text-white/70' : 'text-testo-tenue'} titolo="Nel Pass" />;
  if (v === '∞') return <Icona nome="illimitato" size={22} className={pieno ? 'text-white' : 'text-azione-scuro'} titolo="Illimitato" />;
  return <span className={`text-[15px] font-extrabold tabular-nums ${pieno ? 'text-white' : 'text-testo'}`}>{v}</span>;
}

/** Titolo breve (1-3 parole) dell'intestazione del Pass per ogni motivo di arrivo. */
export const MOTIVI_PASS: Record<PaywallReason, { titolo: string; icona: NomeIcona }> = {
  simulazione: { titolo: 'Simulazioni', icona: 'simulazioni' },
  domande: { titolo: 'Tutte le domande', icona: 'esercizi' },
  teng: { titolo: 'Formato TENG', icona: 'simulazioni' },
  teoria: { titolo: 'Teoria completa', icona: 'teoria' },
  errori: { titolo: 'Ripasso errori', icona: 'errori' },
  statistiche: { titolo: 'Progressi', icona: 'progressi' },
  generico: { titolo: 'Pass AddiOFA', icona: 'pass' },
};

export interface Conseguenza { icona: NomeIcona; valore: string; etichetta: string; tono: Tono }

/** «Se non superi»: tre fatti veri (config/offer.ts), ciascuno icona + numero. */
export const CONSEGUENZE: Conseguenza[] = [
  { icona: 'stato-risposta-sbagliata', valore: `<${FORMATS.ente.passMark}/${FORMATS.ente.questions}`, etichetta: 'Non superi', tono: 'basso' },
  { icona: 'costo', valore: `~${RETAKE_COST_EUR} €`, etichetta: 'Ogni tentativo', tono: 'basso' },
  { icona: 'blocco', valore: '1° anno', etichetta: 'Solo esami', tono: 'basso' },
];

/** Spiegazione a richiesta di «Se non superi» (dietro la «i»). */
export function TestoOfa() {
  return (
    <div className="flex flex-col gap-2">
      <p>L'OFA di inglese è un obbligo formativo aggiuntivo: per toglierlo si supera un test di recupero ({FORMATS.ente.questions} domande in {FORMATS.ente.minutes} minuti, soglia {FORMATS.ente.passMark} su {FORMATS.ente.questions}).</p>
      <p>Se non lo superi, un nuovo tentativo costa circa {RETAKE_COST_EUR} € presso gli enti convenzionati e finché c'è l'OFA nel piano degli studi puoi inserire solo esami del 1° anno.</p>
      <p>AddiOFA non cambia le regole né sostituisce il test: ti aiuta a sapere a che punto sei prima di affrontarlo.</p>
    </div>
  );
}

/** Tabella Gratis / Pass: una riga per funzione (icona + una parola), spunte, lucchetti e numeri. La riga del motivo di arrivo si evidenzia. */
export function TabellaConfronto({ evidenzia }: { evidenzia?: PaywallReason }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-linea">
      <table className="w-full table-fixed" aria-label="Confronto tra la parte gratuita e il Pass">
        <thead className="bg-superficie-2">
          <tr>
            <th scope="col" className="w-[52%] p-2.5"><span className="sr-only">Funzione</span></th>
            <th scope="col" className="w-[24%] p-2.5 text-center"><Icona nome="gratis" size={22} className="mx-auto text-alto-numero" titolo="Gratis" /></th>
            <th scope="col" className="w-[24%] bg-azione-tinta p-2.5 text-center text-azione-scuro"><Icona nome="pass" size={22} className="mx-auto" titolo="Pass" /></th>
          </tr>
        </thead>
        <tbody>
          {CONFRONTO.map(r => (
            <tr key={r.id} className={cn('border-t border-linea', evidenzia && r.motivi?.includes(evidenzia) && 'bg-azione-tinta/60')}>
              <th scope="row" className="p-2 text-left">
                <span className="flex items-center gap-2.5">
                  <IconaTono tono={r.tono} lato={34}><Icona nome={r.icona} size={19} /></IconaTono>
                  <span className="text-[14px] font-bold text-testo">{r.etichetta}</span>
                </span>
              </th>
              <td className="p-2 text-center"><Cella v={r.gratis} /></td>
              <td className="bg-azione-tinta/40 p-2 text-center"><Cella v={r.pass} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Prezzo vero (lancio fino al 31/01/2027 se vale ancora), validità e pagamento unico: numeri e icone; la regola per intero dietro la «i». */
export function BloccoPrezzo() {
  const prezzo = currentPriceEur();
  const lancio = isLaunchPrice();
  return (
    <div className="rounded-2xl border border-azione/30 bg-azione-tinta/50 p-4">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-4xl font-bold text-testo">{formatEur(prezzo)}</span>
        {lancio && <span className="text-lg font-semibold text-testo-tenue"><span className="sr-only">invece di </span><s>{formatEur(PASS.priceEur)}</s></span>}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm font-bold text-testo">
        {lancio && <span className="inline-flex items-center gap-1.5 text-azione-scuro"><Icona nome="scadenza" size={18} /><span className="sr-only">Prezzo di lancio fino al </span>{dataCorta(PASS.launchUntil)}</span>}
        <span className="inline-flex items-center gap-1.5"><Icona nome="validita" size={18} className="text-testo-tenue" />{PASS.validMonths} mesi</span>
        <span className="inline-flex items-center gap-1.5"><Icona nome="pagamento-unico" size={18} className="text-testo-tenue" />1×</span>
        <InfoFoglio titolo="Il Pass" etichetta="Informazioni sul Pass">
          <p>Un solo pagamento, valido {PASS.validMonths} mesi, nessun abbonamento e nessun rinnovo.</p>
        </InfoFoglio>
      </div>
    </div>
  );
}
