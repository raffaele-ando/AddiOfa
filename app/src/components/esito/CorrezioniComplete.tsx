// Correzioni complete: tutte le domande, numerate come nella prova, con filtro e spiegazione.
// Lo stato di ogni riga si capisce da icona e parola, non solo dal colore.
import { useId, useState } from 'react';
import { BookOpen, Check, ChevronDown, Minus, X } from 'lucide-react';
import type { ExamQuestionResult, PublicQuestion } from '../../access/provider';
import { cn } from '../../lib/utils';
import { playTapSound } from '../../lib/audio';

type Stato = 'giusta' | 'sbagliata' | 'vuota';
type Filtro = 'tutte' | Stato;

const FILTRI: { id: Filtro; etichetta: string; attivo: string }[] = [
  { id: 'tutte', etichetta: 'Tutte', attivo: 'bg-azione-tinta text-azione-scuro border-azione' },
  { id: 'sbagliata', etichetta: 'Sbagliate', attivo: 'bg-basso-tinta text-basso-testo border-basso' },
  { id: 'vuota', etichetta: 'Senza risposta', attivo: 'bg-medio-tinta text-medio-testo border-medio' },
  { id: 'giusta', etichetta: 'Giuste', attivo: 'bg-alto-tinta text-alto-testo border-alto' },
];

// Ogni riga ha la sua carta neutra: il colore sta nel badge e nelle caselle della risposta (giusta verde, sbagliata corallo, vuota ambra).
const STATO = {
  giusta: { parola: 'Giusta', Icona: Check, badge: 'bg-alto-pieno text-azione-su' },
  sbagliata: { parola: 'Sbagliata', Icona: X, badge: 'bg-basso-pieno text-azione-su' },
  vuota: { parola: 'Senza risposta', Icona: Minus, badge: 'bg-medio-pieno text-azione-su' },
} as const;

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
      <h3 id={`${idBase}-titolo`} className="text-xl font-bold text-testo">Correzioni</h3>
      <p className="text-sm font-semibold text-testo-tenue mb-3">
        {conteggi.giusta} su {righe.length} risposte esatte. Le domande sono numerate come nella prova.
      </p>

      <div role="tablist" aria-label="Filtra le correzioni" className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1"
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
                'shrink-0 inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-bold border transition-colors duration-100 min-h-[40px]',
                attivo ? f.attivo : 'bg-superficie text-testo-tenue border-linea hover:bg-superficie-2'
              )}>
              {f.etichetta}
              <span className="tabular-nums text-xs">{conteggi[f.id]}</span>
            </button>
          );
        })}
      </div>

      <div role="tabpanel" id={`${idBase}-pannello`} aria-labelledby={`${idBase}-${filtro}`} className="mt-2 space-y-3">
        {visibili.length === 0 && (
          <p className="text-sm font-semibold text-testo-tenue text-center py-6 rounded-[12px] border border-dashed border-linea">
            {filtro === 'sbagliata' ? 'Nessuna risposta sbagliata.' : filtro === 'vuota' ? 'Hai risposto a tutte le domande.' : 'Nessuna domanda in questo elenco.'}
          </p>
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
                <span className={cn('inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full pl-1.5 pr-2.5 py-0.5 text-xs font-bold', s.badge)}>
                  <s.Icona size={13} strokeWidth={3.5} aria-hidden /> {s.parola}
                </span>
                <span className="ml-auto min-w-0 text-[11px] font-semibold text-testo-tenue text-right truncate">{q.grammarTopic || q.category}</span>
              </div>
              <p className="font-bold text-[15px] sm:text-base text-testo leading-snug mb-2.5">{q.prompt}</p>

              {stato === 'giusta' ? (
                <dl className="text-sm">
                  <div className="rounded-[10px] border border-alto/30 bg-alto-tinta p-2.5">
                    <dt className="flex items-center gap-1 text-xs font-bold text-alto-testo"><Check size={13} strokeWidth={3.5} aria-hidden /> La tua risposta</dt>
                    <dd className="mt-1 font-semibold text-testo break-words">{dato !== undefined && dato >= 0 ? <>{lettera(dato)}{q.options[dato]}</> : 'Giusta'}</dd>
                  </div>
                </dl>
              ) : (
                // Confronto affiancato: a sinistra cosa hai risposto, a destra la risposta corretta
                <dl className="grid grid-cols-2 gap-2 text-sm">
                  <div className={cn('rounded-[10px] border p-2.5', dato === undefined ? 'border-medio/30 bg-medio-tinta' : 'border-basso/30 bg-basso-tinta')}>
                    <dt className={cn('flex items-center gap-1 text-xs font-bold', dato === undefined ? 'text-medio-testo' : 'text-basso-testo')}>
                      {dato === undefined ? <Minus size={13} strokeWidth={3.5} aria-hidden /> : <X size={13} strokeWidth={3.5} aria-hidden />} La tua risposta
                    </dt>
                    <dd className={cn('mt-1 font-semibold break-words', dato === undefined ? 'italic text-testo' : 'text-testo')}>
                      {dato === undefined
                        ? 'Nessuna risposta'
                        : dato < 0 || q.options[dato] === undefined
                          ? <span className="italic text-testo-tenue">Sbagliata (il testo scelto non è salvato)</span>
                          : <>{lettera(dato)}<span className="line-through decoration-basso/60">{q.options[dato]}</span></>}
                    </dd>
                  </div>
                  <div className="rounded-[10px] border border-alto/30 bg-alto-tinta p-2.5">
                    <dt className="flex items-center gap-1 text-xs font-bold text-alto-testo"><Check size={13} strokeWidth={3.5} aria-hidden /> Risposta corretta</dt>
                    <dd className="mt-1 font-bold text-alto-testo break-words">{r ? <>{lettera(r.correctIndex)}{q.options[r.correctIndex]}</> : '…'}</dd>
                  </div>
                </dl>
              )}

              {compatta && r?.explanation && (
                <button type="button" onClick={() => { playTapSound(); alterna(q.id); }} aria-expanded={apertaSpieg} aria-controls={idSpieg}
                  className="mt-2.5 inline-flex items-center gap-1 text-xs font-bold text-azione-scuro">
                  {apertaSpieg ? 'Nascondi la spiegazione' : 'Vedi la spiegazione'}
                  <ChevronDown size={14} strokeWidth={3} className={apertaSpieg ? 'rotate-180' : undefined} aria-hidden />
                </button>
              )}
              {!compatta && !r?.explanation && (
                <p className="mt-2.5 text-xs font-semibold text-testo-tenue">Spiegazione non disponibile per questa domanda.</p>
              )}
              {apertaSpieg && (r?.explanation || (r?.theoryId && onOpenTheory)) && (
                <div id={idSpieg} className="mt-2.5">
                  {r?.explanation && (
                    <div className="text-[13.5px] font-medium leading-relaxed text-testo bg-superficie rounded-[10px] p-3">
                      <p className="text-xs font-bold text-testo-tenue mb-1">Spiegazione</p>
                      <p>{r.explanation}</p>
                    </div>
                  )}
                  {r?.theoryId && onOpenTheory && (
                    <button type="button" onClick={() => { playTapSound(); onOpenTheory(r.theoryId!); }}
                      className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-azione-scuro underline underline-offset-2 min-h-[32px]">
                      <BookOpen size={15} aria-hidden /> Studia la regola
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
