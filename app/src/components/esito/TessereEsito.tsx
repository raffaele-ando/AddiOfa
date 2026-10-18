// Tessere dell'esito di una simulazione: giuste (verde-acqua), sbagliate (errore, cremisi), senza risposta (ambra): icona, numero e la parola sotto.
// Servono alla consegna (EsitoSimulazione) e alle simulazioni già svolte (SimulazioneDettaglio).
import { Icona, type NomeIcona } from '../../brand/icone/Icona';
import { IconaTono, type Tono } from '../../screens/extra/ui';
import { minSec } from '../../screens/extra/studio/comune';

function Tessera({ nome, valore, tono, aria, parola }: { nome: NomeIcona; valore: string; tono: Tono | 'errore'; aria: string; parola: string }) {
  return (
    <div role="group" aria-label={aria} className="rounded-[12px] bg-superficie-2 px-2 py-3 flex flex-col items-center gap-1.5 min-w-0">
      {tono === 'errore'
        ? <span aria-hidden="true" className="grid shrink-0 place-items-center rounded-full bg-errore-tinta text-errore" style={{ width: 36, height: 36 }}><Icona nome={nome} size={19} /></span>
        : <IconaTono tono={tono} lato={36} className="rounded-full"><Icona nome={nome} size={19} /></IconaTono>}
      <span className="text-[26px] leading-[28px] font-extrabold tabular-nums text-testo" aria-hidden="true">{valore}</span>
      <span className="text-[12.5px] leading-[16px] font-semibold text-testo-tenue text-center" aria-hidden="true">{parola}</span>
    </div>
  );
}

/** `sbagliate` e `vuote` null = dato non salvato (simulazioni vecchie). */
export function TessereEsito({ giuste, sbagliate, vuote }: { giuste: number; sbagliate: number | null; vuote: number | null }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <Tessera nome="stato-risposta-giusta" tono="alto" parola="Giuste" valore={String(giuste)} aria={`${giuste} risposte giuste`} />
      <Tessera nome="stato-risposta-sbagliata" tono="errore" parola="Sbagliate" valore={sbagliate === null ? '–' : String(sbagliate)} aria={sbagliate === null ? 'Sbagliate: dato non salvato' : `${sbagliate} risposte sbagliate`} />
      <Tessera nome="stato-risposta-omessa" tono="medio" parola="Senza risposta" valore={vuote === null ? '–' : String(vuote)} aria={vuote === null ? 'Senza risposta: dato non salvato' : `${vuote} domande senza risposta`} />
    </div>
  );
}

/** «Tempo 10:40 su 15 min»: il tempo è ambra in tutta l'app. Se la prova è finita perché il tempo è scaduto, accanto c'è il segno «Scaduto» (corallo: è una scadenza, non un errore). */
export function RigaTempo({ secondi, minuti, scaduto }: { secondi: number; minuti: number; scaduto?: boolean }) {
  if (!(secondi > 0)) return null;
  return (
    <span className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
      <span className="inline-flex items-center gap-1.5 text-[14px] font-bold text-medio-testo" role="img" aria-label={`Tempo usato: ${minSec(secondi)} su ${minuti} minuti${scaduto ? '. Tempo scaduto' : ''}`}>
        <Icona nome="tempo" size={17} />Tempo <span className="tabular-nums">{minSec(secondi)}</span><span className="text-[13px] font-semibold text-testo-tenue">su {minuti} min</span>
      </span>
      {scaduto && <span aria-hidden="true" className="inline-flex items-center rounded-full bg-basso-tinta px-2.5 py-0.5 text-[12.5px] font-extrabold text-basso-testo">Scaduto</span>}
    </span>
  );
}
