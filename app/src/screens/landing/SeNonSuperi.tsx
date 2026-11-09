import { OFA_DEADLINES, OFA_RULES_NOTE, RETAKE_COST_EUR, EXAM } from '../../config/offer';
import { Icona } from '../../brand/icone/Icona';
import { BottoneLink, InfoFoglio, Sezione, TitoloSezione, Evidenza } from './comune';
import { TestoOfa } from './dati';

// «Cos’è l’OFA di inglese?»: titolo e due righe in alto, poi quattro conseguenze (cifre vere da config/offer.ts, tutte diritte) e la carta blu che porta al test.
// Telefono 2x2 con la carta blu a tutta larghezza; da 1024 px cinque carte in fila, la blu staccata da un segno di passaggio.
// Le quattro conseguenze stanno in card di solo testo: nessuna illustrazione per carta.
const CARTE: { titolo: string; sotto: string }[] = [
  { titolo: `Sotto ${EXAM.passMark} su ${EXAM.questions}`, sotto: 'il test non è superato' },
  { titolo: `Circa ${RETAKE_COST_EUR} € a tentativo`, sotto: 'presso gli enti convenzionati' },
  { titolo: 'Piano di studi limitato', sotto: 'solo esami del 1° anno' },
  { titolo: 'Scadenze del 2° anno', sotto: 'tra fine agosto e fine settembre' },
];

function PiuDettagli() {
  return (
    <InfoFoglio titolo="OFA di inglese: cosa succede se non lo superi" etichetta="Cosa succede se non superi il test"
      bottone={apri => <BottoneLink onClick={apri}>Se non lo superi</BottoneLink>}>
      <TestoOfa />
      <dl className="mt-3 grid grid-cols-3 gap-2">
        {OFA_DEADLINES.map(d => (
          <div key={d.scuola} className="rounded-xl bg-medio-tinta px-2 py-2 text-center">
            <dt className="text-s1 font-semibold text-medio-testo">{d.scuola}</dt>
            <dd className="text-s2 font-extrabold text-testo">{d.data}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-s1 text-testo-tenue">Scadenze del calendario 2026/27 per avere il piano completo del 2° anno. {OFA_RULES_NOTE}</p>
    </InfoFoglio>
  );
}

export default function SeNonSuperi({ onStart }: { onStart(): void }) {
  return (
    <Sezione id="ofa" titoloId="t-ofa">
      <div data-testo-ok>
        <TitoloSezione id="t-ofa" occhiello="Prima del test">
          Cos’è l’<Evidenza>OFA di inglese?</Evidenza>
        </TitoloSezione>
        <p className="mt-4 max-w-xl text-s2 leading-relaxed text-testo-tenue lg:text-s3">
          L’OFA è un obbligo formativo aggiuntivo. Finché non superi il test d’inglese, il tuo piano di studi resta limitato agli esami del primo anno. Ogni nuovo tentativo costa.
        </p>
      </div>

      <ol data-testo-ok className="mt-6 grid grid-cols-2 gap-3 lg:mt-10 lg:grid-cols-[repeat(4,minmax(0,1fr))_minmax(0,1.25fr)] lg:gap-4">
        {CARTE.map(c => (
          <li key={c.titolo} className="flex min-h-[7.5rem] flex-col justify-center rounded-2xl border border-linea bg-superficie p-4 lg:min-h-[9rem]">
            <span className="block text-s2 font-extrabold leading-tight text-testo">{c.titolo}</span>
            <span className="mt-1 block text-s1 font-medium leading-snug text-testo-tenue">{c.sotto}</span>
          </li>
        ))}
        <li className="relative col-span-2 flex min-h-[7rem] flex-col justify-between gap-4 rounded-2xl border border-azione/45 bg-azione-tinta p-5 lg:col-span-1 lg:min-h-[11.5rem]">
          <Icona nome="avanti" size={26} className="absolute -left-[1.35rem] top-1/2 hidden -translate-y-1/2 text-azione lg:block" />
          <p className="text-s3 font-extrabold leading-snug text-testo">Con AddiOFA arrivi <span className="text-azione-testo">al test preparato.</span></p>
          <button type="button" onClick={onStart}
            className="inline-flex min-h-11 items-center gap-1.5 self-start rounded-xl text-s2 font-bold text-azione-testo underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azione">
            Inizia il test di livello<Icona nome="avanti" size={18} />
          </button>
        </li>
      </ol>
      <div className="mt-3 lg:mt-5"><PiuDettagli /></div>
    </Sezione>
  );
}
