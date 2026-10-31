// Correzioni complete: tutte le domande, numerate come nella prova, con filtro a parole (icona, nome e numero) e il confronto tra la tua risposta e quella esatta.
// Lo stato di ogni riga è un'icona nel suo colore (verde giusta, corallo sbagliata, ambra senza risposta) con l'`aria-label`. Domande, risposte e
// spiegazioni sono contenuto (`data-testo-ok`): sono l'unico testo lungo ammesso.
import { useId, useState } from 'react';
import { Icona, type NomeIcona } from '../../brand/icone/Icona';
import { Illustrazione } from '../../brand/Illustrazione';
import type { ExamQuestionResult, PublicQuestion } from '../../access/provider';
import { cn } from '../../lib/utils';
import { playTapSound } from '../../lib/audio';
import { tipografiche } from '../../screens/extra/studio/comune';

type Stato = 'giusta' | 'sbagliata' | 'vuota';
type Filtro = 'tutte' | Stato;

const FILTRI: { id: Filtro; nome: NomeIcona; aria: string; attivo: string }[] = [
  { id: 'tutte', nome: 'risposte', aria: 'Tutte', attivo: 'bg-azione-tinta text-azione-testo border-azione' },
  { id: 'sbagliata', nome: 'stato-risposta-sbagliata', aria: 'Sbagliate', attivo: 'bg-errore-tinta text-errore-testo border-errore' },
  { id: 'vuota', nome: 'stato-risposta-omessa', aria: 'Senza risposta', attivo: 'bg-medio-tinta text-medio-testo border-medio' },
  { id: 'giusta', nome: 'stato-risposta-giusta', aria: 'Giuste', attivo: 'bg-alto-tinta text-alto-testo border-alto' },
];

// Ogni riga ha la sua carta neutra: il colore sta nell'icona di stato e nelle caselle della risposta.
const STATO = {
  giusta: { parola: 'Giusta', nome: 'stato-risposta-giusta', badge: 'bg-alto-pieno text-alto-su' },
  sbagliata: { parola: 'Sbagliata', nome: 'stato-risposta-sbagliata', badge: 'bg-errore text-errore-su' },
  vuota: { parola: 'Senza risposta', nome: 'stato-risposta-omessa', badge: 'bg-medio-pieno text-medio-su' },
} as const satisfies Record<Stato, { parola: string; nome: NomeIcona; badge: string }>;

interface Props {
  questions: PublicQuestion[];
  perQuestion: Map<string, ExamQuestionResult>;
  answers: Record<string, number>;
  onOpenTheory?: (id: string) => void;
  /** Per le simulazioni già svolte: l'ordine delle opzioni visto durante la prova non è salvato, quindi le lettere A, B, C, D non si mostrano. */
  senzaLettere?: boolean;
}

function statoDi(r: ExamQuestionResult | undefined, dato: number | undefined): Stato {
  if (dato === undefined) return 'vuota';
  return r?.correct === true ? 'giusta' : 'sbagliata';
}

export default function CorrezioniComplete({ questions, perQuestion, answers, onOpenTheory, senzaLettere }: Props) {
  const [filtro, setFiltro] = useState<Filtro>('tutte');
  const [aperte, setAperte] = useState<Set<string>>(new Set());
  const idBase = useId();

  const righe = questions.map((q, i) => ({ q, n: i + 1, r: perQuestion.get(q.id), stato: statoDi(perQuestion.get(q.id), answers[q.id]) }));
  const conteggi: Record<Filtro, number> = {
    tutte: righe.length,
    giusta: righe.filter(x => x.stato === 'giusta').length,
    sbagliata: righe.filter(x => x.stato === 'sbagliata').length,
    vuota: righe.filter(x => x.stato === 'vuota').length,
  };
  const visibili = righe.filter(x => filtro === 'tutte' || x.stato === filtro);
  const alterna = (id: string) => setAperte(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });

  return (
    <section aria-labelledby={`${idBase}-titolo`} className="text-left">
      <h3 id={`${idBase}-titolo`} className="flex items-center gap-2 text-[15.5px] leading-[20px] font-bold text-testo">
        <Icona nome="correzioni" size={20} className="text-viola" />Correzioni
      </h3>

      <div role="tablist" aria-label="Filtra le correzioni" className="mt-3 grid grid-cols-2 gap-2"
        onKeyDown={e => {
          if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
          const i = FILTRI.findIndex(f => f.id === filtro);
          const prossimo = FILTRI[(i + (e.key === 'ArrowRight' ? 1 : FILTRI.length - 1)) % FILTRI.length];
          setFiltro(prossimo.id);
          document.getElementById(`${idBase}-${prossimo.id}`)?.focus();
          e.preventDefault();
        }}>
        {FILTRI.map(f => {
          const attivo = filtro === f.id;
          return (
            <button key={f.id} type="button" role="tab" id={`${idBase}-${f.id}`} aria-selected={attivo} aria-controls={`${idBase}-pannello`} tabIndex={attivo ? 0 : -1}
              onClick={() => { playTapSound(); setFiltro(f.id); }}
              className={cn(
                'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border px-3 text-[14px] font-bold transition-colors duration-100',
                attivo ? f.attivo : 'bg-superficie text-testo border-linea hover:bg-superficie-2'
              )}>
              <Icona nome={f.nome} size={18} />{f.aria}<span className="tabular-nums font-extrabold">{conteggi[f.id]}</span>
            </button>
          );
        })}
      </div>

      <div role="tabpanel" id={`${idBase}-pannello`} aria-labelledby={`${idBase}-${filtro}`} className="mt-3 space-y-3">
        {visibili.length === 0 && (
          // Nessuna sbagliata o vuota: tutto in ordine (`documento-completato`); nessuna giusta: `vuoto`.
          <div role="status" aria-label={filtro === 'giusta' ? 'Nessuna giusta' : 'Nessuna'} className="flex flex-col items-center rounded-[12px] border border-dashed border-linea py-5">
            <Illustrazione nome={filtro === 'giusta' ? 'vuoto' : 'documento-completato'} lato={88} />
            <span data-testo-ok className="mt-1 text-[15px] font-semibold text-testo-tenue">{filtro === 'giusta' ? 'Nessuna risposta giusta' : filtro === 'sbagliata' ? 'Nessuna risposta sbagliata' : 'Nessuna domanda senza risposta'}</span>
          </div>
        )}
        {visibili.map(({ q, n, r, stato }) => {
          const s = STATO[stato];
          const dato = answers[q.id];
          const lettera = (i: number) => (senzaLettere ? '' : `${String.fromCharCode(65 + i)}. `);
          const compatta = stato === 'giusta';
          const apertaSpieg = !compatta || aperte.has(q.id);
          const idSpieg = `${idBase}-sp-${q.id}`;
          return (
            <article key={`${filtro}-${q.id}`}
              aria-label={`Domanda ${n}: ${s.parola.toLowerCase()}`}
              className="rounded-[12px] bg-superficie-2 p-3.5 sm:p-4">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="w-7 h-7 rounded-full bg-superficie text-xs font-bold tabular-nums text-testo-tenue flex items-center justify-center shrink-0">{n}</span>
                <span role="img" aria-label={s.parola} className={cn('grid h-7 w-7 shrink-0 place-items-center rounded-full', s.badge)}><Icona nome={s.nome} size={16} /></span>
                <span data-testo-ok className="ml-auto min-w-0 truncate text-right text-[11px] font-semibold text-testo-tenue">{q.grammarTopic || q.category}</span>
              </div>
              <p data-testo-ok className="font-bold text-[15px] sm:text-base text-testo leading-snug mb-2.5">{q.prompt}</p>

              {stato === 'giusta' ? (
                <div className="flex items-start gap-2 rounded-[10px] border border-alto/30 bg-alto-tinta p-2.5 text-sm">
                  <Icona nome="stato-risposta-giusta" size={17} className="mt-0.5 shrink-0 text-alto-testo" />
                  <p data-testo-ok className="min-w-0 font-semibold text-testo break-words">{dato !== undefined && dato >= 0 ? <>{lettera(dato)}{q.options[dato]}</> : ''}</p>
                </div>
              ) : (
                // Confronto affiancato: a sinistra cosa hai risposto, a destra la risposta esatta
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className={cn('flex items-start gap-2 rounded-[10px] border p-2.5', dato === undefined ? 'border-medio/30 bg-medio-tinta' : 'border-errore/30 bg-errore-tinta')}>
                    <Icona nome={dato === undefined ? 'stato-risposta-omessa' : 'stato-risposta-sbagliata'} size={17} className={cn('mt-0.5 shrink-0', dato === undefined ? 'text-medio-testo' : 'text-errore-testo')} />
                    <div className="min-w-0">
                    <p className="mb-0.5 text-[12px] font-semibold text-testo-tenue">La tua</p>
                    <p data-testo-ok className="min-w-0 font-semibold text-testo break-words">
                      {dato === undefined
                        ? '–'
                        : dato < 0 || q.options[dato] === undefined
                          ? <span className="text-testo-tenue">?</span>
                          : <>{lettera(dato)}<span className="line-through decoration-errore/60">{q.options[dato]}</span></>}
                    </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 rounded-[10px] border border-alto/30 bg-alto-tinta p-2.5">
                    <Icona nome="stato-risposta-giusta" size={17} className="mt-0.5 shrink-0 text-alto-testo" />
                    <div className="min-w-0">
                    <p className="mb-0.5 text-[12px] font-semibold text-testo-tenue">Esatta</p>
                    <p data-testo-ok className="min-w-0 font-bold text-alto-testo break-words">{r ? <>{lettera(r.correctIndex)}{q.options[r.correctIndex]}</> : '…'}</p>
                    </div>
                  </div>
                </div>
              )}

              {compatta && r?.explanation && (
                <button type="button" onClick={() => { playTapSound(); alterna(q.id); }} aria-expanded={apertaSpieg} aria-controls={idSpieg}
                  className="mt-2 inline-flex min-h-[44px] items-center gap-1.5 text-[14px] font-bold text-azione-testo">
                  <Icona nome="spiegazioni" size={18} />Spiegazione<Icona nome="espandi" size={16} className={apertaSpieg ? 'rotate-180' : undefined} />
                </button>
              )}
              {apertaSpieg && (r?.explanation || (r?.theoryId && onOpenTheory)) && (
                <div id={idSpieg} className="mt-2.5">
                  {r?.explanation && (
                    <p data-testo-ok className="rounded-[10px] bg-superficie p-3 text-[14.5px] font-normal leading-[22px] text-testo">{tipografiche(r.explanation)}</p>
                  )}
                  {r?.theoryId && onOpenTheory && (
                    <button type="button" onClick={() => { playTapSound(); onOpenTheory(r.theoryId!); }}
                      className="mt-1 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-bold text-azione-testo underline underline-offset-2">
                      <Icona nome="teoria" size={16} /> Rivedi la teoria
                    </button>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
