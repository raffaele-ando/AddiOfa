// «Segnala» (concept 13/16/17, pulsante vicino alle domande): una segnalazione si compone qui e resta SUL DISPOSITIVO.
// L'app è un sito statico e non ha un canale che la invii: la schermata lo dice (dietro la «i») e dà un testo da copiare. Mai «inviato» se non è inviato. Parametri: `domanda` (id), `tipo`, `errore` (testo breve di un errore).
import { useId, useMemo, useState } from 'react';
import { Icona, type NomeIcona } from '../../../brand/icone/Icona';
import { useExtra, useExtraDati } from '../contesto';
import { Disegno, Pagina, copiaTesto, BottoneAzione } from './componenti';
import { FoglioInfo, IconaTono, PulsanteInfo, TONI, type Tono } from '../ui';
import { questions } from '../../../data/questions';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';
import {
  LUNGHEZZA_MAX, TIPI_SEGNALAZIONE, accorcia, aggiungi, creaSegnalazione, eTipo, leggiSalvate, rimuovi, testoDaCopiare, testoValido,
  MAX_ERRORE, type Segnalazione, type TipoSegnalazione,
} from '../../../lib/servizi/segnalazioni';

// Il tipo di segnalazione ha la sua icona e una parola; la selezione è sempre blu (come ovunque nell'app). Il segnaposto cambia con il tipo.
const STILE_TIPO: Record<TipoSegnalazione, { tono: Tono; icona: NomeIcona; parola: string }> = {
  domanda: { tono: 'basso', icona: 'segnala-domanda', parola: 'Domanda' },
  spiegazione: { tono: 'viola', icona: 'segnala-spiegazione', parola: 'Spiegazione' },
  app: { tono: 'medio', icona: 'segnala-app', parola: 'App' },
  idea: { tono: 'azione', icona: 'segnala-idea', parola: 'Idea' },
};

const SEGNAPOSTO: Record<TipoSegnalazione, string> = {
  domanda: 'Quale domanda ha un problema, e cosa non torna?',
  spiegazione: 'Quale spiegazione non è chiara?',
  app: 'Cosa non funziona, e su che telefono?',
  idea: 'Cosa vorresti trovare in AddiOFA?',
};

const quando = (ms: number) => new Date(ms).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' });
const nuovoId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

function BloccoTesto({ testo, id }: { testo: string; id: string }) {
  const [esito, setEsito] = useState<'' | 'ok' | 'no'>('');
  return (
    <div>
      <label htmlFor={id} className="sr-only">Testo da copiare</label>
      <textarea id={id} data-testo-ok readOnly value={testo} rows={Math.min(9, testo.split('\n').length + 1)} onFocus={e => e.currentTarget.select()}
        className="w-full resize-none rounded-[12px] border border-bordo-campo bg-superficie-2 p-3 text-[13px] leading-[19px] text-testo outline-none focus:outline focus:outline-2 focus:outline-azione" />
      <button type="button" onClick={async () => { playTapSound(); setEsito((await copiaTesto(testo)) ? 'ok' : 'no'); }}
        className="brand-premibile mt-2 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[14px] bg-azione px-4 py-3 text-[16px] font-bold text-azione-su">
        <Icona nome={esito === 'ok' ? 'stato-ok' : 'copia'} size={20} />{esito === 'ok' ? 'Copiato' : 'Copia il testo'}
      </button>
      {esito === 'no' && <p className="mt-2 inline-flex items-center gap-1.5 text-[13px] text-testo-tenue" role="status"><Icona nome="stato-attenzione" size={15} />Selezionalo a mano</p>}
    </div>
  );
}

export default function Segnala() {
  const { params, indietro } = useExtra();
  const [salvate, salva] = useExtraDati<Segnalazione[]>('segnalazioni', []);
  const lista = useMemo(() => leggiSalvate(salvate), [salvate]);
  const domanda = useMemo(() => (params.domanda ? questions.find(q => q.id === params.domanda) : undefined), [params.domanda]);
  const errore = accorcia(params.errore, MAX_ERRORE);
  const [tipo, setTipo] = useState<TipoSegnalazione>(eTipo(params.tipo) ? params.tipo : domanda ? 'domanda' : 'app');
  const [testo, setTesto] = useState('');
  const [fatta, setFatta] = useState<Segnalazione | null>(null);
  const [info, setInfo] = useState(false);
  const campo = useId();

  const invia = () => {
    if (!testoValido(testo)) return;
    const s = creaSegnalazione({ tipo, testo, domandaId: domanda?.id, domandaTesto: domanda?.prompt, errore }, Date.now(), nuovoId());
    salva(prec => aggiungi(leggiSalvate(prec), s));
    setFatta(s);
    setTesto('');
  };

  return (
    <Pagina titolo="Segnala un problema" destra={<PulsanteInfo onClick={() => setInfo(true)} etichetta="Cosa succede alla segnalazione" />}>

      {fatta ? (
        <div className="mt-5 flex flex-col gap-3" role="status">
          {/* «in corso», non «completato»: la segnalazione è pronta ma non è partita, la spedisce chi la copia */}
          <div className="flex justify-center"><Disegno nome="documento-in-corso" lato={96} /></div>
          <p className="inline-flex items-center gap-2 self-center rounded-full bg-medio-tinta px-3 py-1.5 text-[14px] font-bold text-medio-testo dark:bg-superficie-2">
            <Icona nome="stato-attenzione" size={18} />Non inviata
          </p>
          <p data-testo-ok className="text-center text-[14px] leading-[20px] text-testo-tenue">Copia il testo e mandalo tu.</p>
          <div className="rounded-[16px] border border-linea bg-superficie p-3.5 shadow-sm dark:shadow-none">
            <BloccoTesto id={`${campo}-fatta`} testo={testoDaCopiare(fatta)} />
          </div>
          <div className="mt-1 flex flex-col gap-2.5">
            <button type="button" onClick={() => { playTapSound(); setFatta(null); }}
              className="brand-premibile flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[14px] border border-tacca bg-superficie px-4 py-3 text-[16px] font-bold text-testo"><Icona nome="segnala" size={20} />Un'altra segnalazione</button>
            <button type="button" onClick={() => { playTapSound(); indietro(); }}
              className="brand-premibile flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[14px] px-4 py-3 text-[16px] font-bold text-azione-testo"><Icona nome="indietro" size={20} />Indietro</button>
          </div>
        </div>
      ) : (
        <>
          <div role="radiogroup" aria-label="Di cosa vuoi parlare" className="mt-3 grid grid-cols-4 gap-2">
            {TIPI_SEGNALAZIONE.map(t => {
              const on = tipo === t.id;
              const st = STILE_TIPO[t.id];
              return (
                <button key={t.id} type="button" role="radio" aria-checked={on} onClick={() => { playTapSound(); setTipo(t.id); }}
                  className={cn('brand-premibile flex min-h-[78px] flex-col items-center justify-center gap-1.5 rounded-[14px] border px-1 py-2.5', on ? 'border-azione border-[1.5px] bg-azione-tinta text-azione-testo' : 'border-linea bg-superficie text-testo-tenue')}>
                  <Icona nome={st.icona} size={22} />
                  <span className={cn('text-[13px] leading-[17px]', on ? 'font-bold text-azione-testo' : 'font-semibold text-testo')}>{st.parola}</span>
                </button>
              );
            })}
          </div>

          {params.domanda && (
            <div className="mt-4 flex items-start gap-2.5 rounded-[16px] border border-linea bg-superficie p-3.5">
              <Icona nome="segnala-domanda" size={20} className="mt-0.5 shrink-0 text-basso-numero" />
              {domanda
                ? <p data-testo-ok className="text-[14px] leading-[20px] text-testo">{domanda.prompt}</p>
                : <p className="text-[14px] leading-[20px] text-testo-tenue">«{params.domanda.slice(0, 20)}»</p>}
            </div>
          )}

          {errore && (
            <div className="mt-3 flex items-start gap-2.5 rounded-[16px] border border-linea bg-superficie p-3.5">
              <Icona nome="segnala-app" size={20} className="mt-0.5 shrink-0 text-medio-numero" />
              <p data-testo-ok className="break-words text-[13px] leading-[18px] text-testo-tenue">{errore}</p>
            </div>
          )}

          <div className="mt-4">
            <label htmlFor={campo} className="mb-1.5 block text-[15px] leading-[21px] font-bold text-testo">Cosa vuoi dirci?</label>
            <textarea id={campo} value={testo} onChange={e => setTesto(e.target.value.slice(0, LUNGHEZZA_MAX))} rows={5} maxLength={LUNGHEZZA_MAX}
              placeholder={SEGNAPOSTO[tipo]}
              className="w-full resize-y rounded-[14px] border border-bordo-campo bg-superficie p-3.5 text-[15px] leading-[22px] text-testo placeholder:text-testo-tenue outline-none focus:outline focus:outline-2 focus:outline-azione" />
            <p className="text-right text-[12px] tabular-nums text-testo-tenue">{testo.length}/{LUNGHEZZA_MAX}</p>
          </div>
          <div className="mt-3">
            <BottoneAzione disabled={!testoValido(testo)} icona={<Icona nome="segnala" size={20} />} onClick={invia}>Prepara il testo</BottoneAzione>
            <p data-testo-ok className="mt-2 text-center text-[13px] leading-[18px] text-testo-tenue">Non parte da qui: copi il testo e lo mandi tu.</p>
          </div>
        </>
      )}

      {lista.length > 0 && (
        <section aria-labelledby="seg-salvate" className="mt-7 flex flex-col gap-3">
          <h2 id="seg-salvate" className="text-[17px] leading-[24px] font-bold text-testo">Salvate <span className="tabular-nums text-testo-tenue">{lista.length}</span></h2>
          <ul className="flex flex-col gap-[8px]">
            {lista.map(s => (
              <li key={s.id} className="rounded-[16px] border border-linea bg-superficie p-3.5 shadow-sm dark:shadow-none">
                <p className="flex items-center gap-2 text-[13px] text-testo-tenue">
                  <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-[2px] text-[12px] leading-[16px] font-bold', TONI[STILE_TIPO[s.tipo].tono].tinta, TONI[STILE_TIPO[s.tipo].tono].testo)}><Icona nome={STILE_TIPO[s.tipo].icona} size={13} />{STILE_TIPO[s.tipo].parola}</span>
                  <span className="tabular-nums">{quando(s.quando)}</span>
                </p>
                <p data-testo-ok className="mt-1 text-[13.5px] leading-[20px] text-testo break-words">{accorcia(s.testo, 140)}</p>
                <div className="mt-2 flex gap-2">
                  <button type="button" onClick={() => { playTapSound(); setFatta(s); }}
                    className="brand-premibile inline-flex min-h-[44px] items-center gap-1.5 rounded-[12px] border border-tacca px-3.5 text-[14px] font-bold text-azione-testo"><Icona nome="copia" size={18} />Rivedi e copia</button>
                  <button type="button" onClick={() => { playTapSound(); salva(prec => rimuovi(leggiSalvate(prec), s.id)); }}
                    className="brand-premibile inline-flex min-h-[44px] items-center gap-1.5 rounded-[12px] px-3 text-[14px] font-bold text-testo-tenue"><Icona nome="cancella" size={18} />Elimina</button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <FoglioInfo aperto={info} onChiudi={() => setInfo(false)} titolo="Segnala">
        <p>Una domanda sbagliata, una spiegazione confusa o un problema dell'app. La segnalazione viene <strong>salvata solo su questo dispositivo</strong> e ti prepariamo un testo da copiare.</p>
        <p className="mt-2">L'app non la invia da sola: non ha un indirizzo a cui spedirla. Copia il testo e mandalo tu al contatto da cui hai conosciuto AddiOFA. Nel testo ci sono solo quello che hai scritto e, se c'è, la domanda: niente progressi né dati personali.</p>
      </FoglioInfo>
    </Pagina>
  );
}
