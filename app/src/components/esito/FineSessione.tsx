// Fine di una sessione di studio: tre tessere (giuste, da riprendere, tempo), le domande imparate prima e dopo, le domande da riprendere, ▶ per continuare.
// Niente punti, livelli o serie: solo numeri veri presi dalle risposte della sessione. Le spiegazioni stanno dietro la «i».
import { useState } from 'react';
import { Icona, type NomeIcona } from '../../brand/icone/Icona';
import { IllustrazioneAnimata } from '../../brand/IllustrazioneAnimata';
import { cn, formatDuration } from '../../lib/utils';
import { REGOLA_IMPARATA } from '../home/comune';
import { playTapSound } from '../../lib/audio';
import { FoglioInfo, IconaTono, PulsanteInfo, type Tono } from '../../screens/extra/ui';

export interface DomandaDaRiprendere { id: string; prompt: string; argomento: string }

interface Props {
  corrette: number;          // giuste al primo tentativo
  totale: number;
  secondi: number;
  /** Domande imparate prima e dopo la sessione, sul gruppo di domande che l'utente può studiare. */
  prima: number;
  dopo: number;
  gruppo: number;
  nuove: number;             // domande del gruppo mai viste
  daRiprendere: DomandaDaRiprendere[];
  /** L'argomento in cui si è sbagliato di più, se ha una scheda di teoria. */
  regola?: { nome: string; theoryId: string };
  prossima: string;          // a parole, cosa farà la prossima sessione (ora è l'etichetta del ▶, non si scrive in pagina)
  onContinua: () => void;
  onExit: () => void;
  onOpenTheory?: (id: string) => void;
}

function Tessera({ nome, tono, valore, aria }: { nome: NomeIcona; tono: Tono; valore: string; aria: string }) {
  return (
    <div role="group" aria-label={aria} className="rounded-[12px] bg-superficie-2 px-2 py-3 flex flex-col items-center gap-1.5">
      <IconaTono tono={tono} lato={36} className="rounded-full"><Icona nome={nome} size={19} /></IconaTono>
      <span aria-hidden className="text-[26px] leading-[28px] font-extrabold tabular-nums text-testo">{valore}</span>
    </div>
  );
}

export default function FineSessione({ corrette, totale, secondi, prima, dopo, gruppo, nuove, daRiprendere, regola, prossima, onContinua, onExit, onOpenTheory }: Props) {
  const [info, setInfo] = useState(false);
  const pc = (n: number) => (gruppo > 0 ? Math.max(0, Math.min(100, (n / gruppo) * 100)) : 0);
  const differenza = dopo - prima;
  const mostraPrimaDopo = gruppo > 0;
  const mm = Math.floor(secondi / 60);
  const ss = String(secondi % 60).padStart(2, '0');

  return (
    <div className="relative flex flex-col h-full w-full sm:max-h-[calc(100dvh-3rem)] bg-superficie sm:rounded-[32px] sm:border sm:border-linea overflow-hidden shadow-sm dark:shadow-none transition-colors duration-100">
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
        <div className="max-w-xl mx-auto w-full p-4 sm:p-6 flex flex-col gap-4">
          <div className="flex flex-col items-center text-center pt-1">
            <div className="flex w-full justify-end"><PulsanteInfo onClick={() => setInfo(true)} etichetta="Come si contano le domande imparate" /></div>
            <IllustrazioneAnimata nome="successo" lato={104} />
            <h2 className="text-2xl sm:text-3xl font-bold text-testo mt-1">Finita</h2>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <Tessera nome="stato-risposta-giusta" tono="alto" valore={`${corrette}/${totale}`} aria={`${corrette} giuste su ${totale} al primo tentativo`} />
            <Tessera nome="riprova" tono="basso" valore={String(daRiprendere.length)} aria={`${daRiprendere.length} da riprendere`} />
            <Tessera nome="tempo" tono="medio" valore={`${mm}:${ss}`} aria={`Tempo: ${formatDuration(secondi)}`} />
          </div>

          {mostraPrimaDopo && (
            <section aria-label="Domande imparate prima e dopo" className="rounded-[12px] bg-superficie-2 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="flex items-center gap-2 text-[15.5px] leading-[20px] font-bold text-testo"><Icona nome="imparate" size={20} className="text-alto-numero" />Imparate</h3>
                {differenza > 0 && (
                  <span role="img" aria-label={`${differenza} ${differenza === 1 ? 'nuova' : 'nuove'}`} className="inline-flex items-center gap-1 rounded-full bg-alto-tinta text-alto-testo text-sm font-extrabold tabular-nums px-2.5 py-1">
                    +{differenza}
                  </span>
                )}
              </div>
              <div className="mt-3 flex items-center justify-center gap-3 sm:gap-5 text-center">
                <span className="text-3xl font-extrabold tabular-nums leading-none text-testo-tenue" aria-label={`Prima ${prima}`}>{prima}</span>
                <Icona nome="avanti" size={24} className="shrink-0 text-testo-tenue" />
                <span className="text-3xl font-extrabold tabular-nums leading-none text-alto-numero" aria-label={`Dopo ${dopo}`}>{dopo}</span>
                <span className="pl-1 text-sm font-bold tabular-nums text-testo-tenue" aria-label={`su ${gruppo} domande`}>/ {gruppo}</span>
              </div>
              <div className="mt-3 relative h-3 rounded-full bg-tacca overflow-hidden" role="img" aria-label={`Prima ${prima}, dopo ${dopo}, su ${gruppo} domande`}>
                <div className="absolute inset-y-0 left-0 rounded-full bg-alto" style={{ width: `${pc(dopo)}%` }} />
                <div className="absolute inset-y-0 w-0.5 bg-testo" style={{ left: `${pc(prima)}%` }} aria-hidden />
              </div>
            </section>
          )}

          {daRiprendere.length > 0 && (
            <section aria-label="Domande da riprendere" className="rounded-[12px] bg-superficie-2 p-4 text-left">
              <h3 className="mb-2.5 flex items-center gap-2 text-[15.5px] leading-[20px] font-bold text-testo"><Icona nome="riprova" size={20} className="text-basso-numero" />Da riprendere</h3>
              <ul data-testo-ok className="divide-y divide-linea">
                {daRiprendere.slice(0, 5).map(d => (
                  <li key={d.id} className="py-2 first:pt-0 last:pb-0">
                    <p className="text-sm font-semibold text-testo leading-snug">{d.prompt}</p>
                    <p className="text-[11px] font-bold text-testo-tenue mt-0.5">{d.argomento}</p>
                  </li>
                ))}
              </ul>
              {daRiprendere.length > 5 && <p className="mt-2 text-xs font-bold tabular-nums text-testo-tenue">+{daRiprendere.length - 5}</p>}
              {regola && onOpenTheory && (
                <button type="button" onClick={() => { playTapSound(); onOpenTheory(regola.theoryId); }}
                  className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-azione/60 text-azione-scuro font-bold text-sm py-2.5 hover:bg-azione-tinta/40 transition-colors duration-100">
                  <Icona nome="teoria" size={18} /> {regola.nome}
                </button>
              )}
            </section>
          )}
        </div>
      </div>

      <div className="shrink-0 border-t border-linea bg-superficie p-3 sm:p-4">
        <div className="max-w-xl mx-auto w-full flex gap-2.5">
          <button type="button" onClick={() => { playTapSound(); onContinua(); }} aria-label={`Continua. ${prossima}${nuove > 0 ? ` Ancora mai viste: ${nuove}.` : ''}`}
            className={cn('flex h-[54px] flex-1 items-center justify-center gap-2 rounded-[12px] bg-azione text-azione-su transition-colors duration-100 hover:bg-azione-scuro')}>
            <Icona nome="studia" size={26} />
            {nuove > 0 && <span className="text-[13px] font-bold tabular-nums opacity-90">+{nuove}</span>}
          </button>
          <button type="button" onClick={() => { playTapSound(); onExit(); }} aria-label="Home"
            className="grid h-[54px] w-16 shrink-0 place-items-center rounded-[12px] border border-azione/60 bg-superficie text-azione-scuro transition-colors duration-100 hover:bg-azione-tinta">
            <Icona nome="home" size={24} />
          </button>
        </div>
      </div>
      <FoglioInfo aperto={info} onChiudi={() => setInfo(false)} titolo="Domande imparate">
        <ul className="flex list-disc flex-col gap-2 pl-5 marker:text-testo-tenue">
          <li>{REGOLA_IMPARATA}</li>
          <li>Il segno nero è dove eri prima della sessione.</li>
          <li>Le domande risposte bene una sola volta sono «in corso»: la seconda risposta esatta, a distanza di tempo, le fa contare.</li>
          <li>Se qualche domanda torna da ripassare è perché hai sbagliato qualcosa che sembrava già saputo: il ripasso la riprende.</li>
        </ul>
      </FoglioInfo>
    </div>
  );
}
