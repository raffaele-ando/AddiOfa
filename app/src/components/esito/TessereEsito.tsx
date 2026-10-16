// Tessere dell'esito di una simulazione: giuste (verde), sbagliate (corallo), senza risposta (ambra), più la riga del tempo (ambra).
// Solo icona e numero: la parola sta nell'`aria-label`. Servono alla consegna (EsitoSimulazione) e alle simulazioni già svolte (SimulazioneDettaglio).
import { Icona, type NomeIcona } from '../../brand/icone/Icona';
import { IconaTono, type Tono } from '../../screens/extra/ui';
import { minSec } from '../../screens/extra/studio/comune';

function Tessera({ nome, valore, tono, aria }: { nome: NomeIcona; valore: string; tono: Tono; aria: string }) {
  return (
    <div role="group" aria-label={aria} className="rounded-[12px] bg-superficie-2 px-2 py-3 flex flex-col items-center gap-1.5 min-w-0">
      <IconaTono tono={tono} lato={36} className="rounded-full"><Icona nome={nome} size={19} /></IconaTono>
      <span className="text-[26px] leading-[28px] font-extrabold tabular-nums text-testo" aria-hidden="true">{valore}</span>
    </div>
  );
}

/** `sbagliate` e `vuote` null = dato non salvato (simulazioni vecchie). */
export function TessereEsito({ giuste, sbagliate, vuote }: { giuste: number; sbagliate: number | null; vuote: number | null }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <Tessera nome="stato-risposta-giusta" tono="alto" valore={String(giuste)} aria={`${giuste} risposte giuste`} />
      <Tessera nome="stato-risposta-sbagliata" tono="basso" valore={sbagliate === null ? '–' : String(sbagliate)} aria={sbagliate === null ? 'Sbagliate: dato non salvato' : `${sbagliate} risposte sbagliate`} />
      <Tessera nome="stato-risposta-omessa" tono="medio" valore={vuote === null ? '–' : String(vuote)} aria={vuote === null ? 'Senza risposta: dato non salvato' : `${vuote} domande senza risposta`} />
    </div>
  );
}

/** «10:40 / 15 min»: il tempo è ambra in tutta l'app. */
export function RigaTempo({ secondi, minuti }: { secondi: number; minuti: number }) {
  if (!(secondi > 0)) return null;
  return (
    <span className="inline-flex items-center gap-1.5 text-[14px] font-bold text-medio-testo" role="img" aria-label={`Tempo usato: ${minSec(secondi)} su ${minuti} minuti`}>
      <Icona nome="tempo" size={17} /><span className="tabular-nums">{minSec(secondi)}</span><span className="text-[12.5px] font-semibold text-testo-tenue">/ {minuti} min</span>
    </span>
  );
}
