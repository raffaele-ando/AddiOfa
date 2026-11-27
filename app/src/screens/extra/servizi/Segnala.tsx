// «Segnala» (concept 13/16/17, pulsante vicino alle domande): una segnalazione si compone qui e resta SUL DISPOSITIVO.
// L'app è un sito statico e non ha un canale che la invii: la schermata lo dice (dietro la «i») e dà un testo da copiare. Mai «inviato» se non è inviato. Parametri: `domanda` (id), `tipo`, `errore` (testo breve di un errore).
import { useId, useMemo, useState } from 'react';
import { Icona, type NomeIcona } from '../../../brand/icone/Icona';
import { useExtra, useExtraDati } from '../contesto';
import { Disegno, Pagina, copiaTesto, BottoneAzione } from './componenti';
import { FoglioInfo, IconaTono, PulsanteInfo, TONI, type Tono } from '../ui';
import { questions } from '../../../data/questions';
import { CONTACT_EMAIL } from '../../../config/offer';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';
import {
  LUNGHEZZA_MAX, LUNGHEZZA_MIN, TIPI_SEGNALAZIONE, accorcia, aggiungi, creaSegnalazione, eTipo, leggiSalvate, rimuovi, testoDaCopiare, testoValido,
  MAX_ERRORE, type Segnalazione, type TipoSegnalazione,
} from '../../../lib/servizi/segnalazioni';

// Il tipo di segnalazione ha la sua icona e una parola; la selezione è sempre blu (come ovunque nell'app). Il segnaposto cambia con il tipo.
const STILE_TIPO: Record<TipoSegnalazione, { tono: Tono; icona: NomeIcona; parola: string }> = {
  domanda: { tono: 'basso', icona: 'segnala-domanda', parola: 'Domanda' },
  spiegazione: { tono: 'azione', icona: 'segnala-spiegazione', parola: 'Spiegazione' },
  app: { tono: 'medio', icona: 'segnala-app', parola: 'App' },
  idea: { tono: 'azione', icona: 'segnala-idea', parola: 'Idea' },
};

const SEGNAPOSTO: Record<TipoSegnalazione, string> = {
  domanda: 'Copia l\'inizio della domanda e scrivi cosa non torna.',
  spiegazione: 'Quale spiegazione non è chiara?',
  app: 'Cosa non funziona, e su che telefono?',
  idea: 'Cosa vorresti trovare in AddiOFA?',
};

const quando = (ms: number) => new Date(ms).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' });
const nuovoId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

function BloccoTesto({ testo, id }: { testo: string; id: string }) {
  const mailto = CONTACT_EMAIL ? `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(testo.split('\n')[0])}&body=${encodeURIComponent(testo)}` : null;
  const [esito, setEsito] = useState<'' | 'ok' | 'no'>('');
  return (
    <div>
      <label htmlFor={id} className="sr-only">Testo da copiare</label>
      <textarea id={id} data-testo-ok readOnly value={testo} rows={Math.min(9, testo.split('\n').length + 1)} onFocus={e => e.currentTarget.select()}
        className="w-full resize-none rounded-xl border border-bordo-campo bg-superficie-2 p-3 text-s1 leading-[19px] text-testo outline-none focus:outline focus:outline-2 focus:outline-azione" />
      <button type="button" onClick={async () => { playTapSound(); setEsito((await copiaTesto(testo)) ? 'ok' : 'no'); }}
        className="brand-premibile mt-2 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-azione px-4 py-3 text-s2 font-bold text-azione-su">
        <Icona nome={esito === 'ok' ? 'stato-ok' : 'copia'} size={20} />{esito === 'ok' ? 'Copiato' : 'Copia il testo'}
      </button>
      {esito === 'no' && <p className="mt-2 inline-flex items-center gap-1.5 text-s1 text-testo-tenue" role="status"><Icona nome="stato-attenzione" size={15} />Selezionalo a mano</p>}
      {mailto && (
        <a href={mailto} onClick={() => playTapSound()}
          className="brand-premibile mt-2 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl border border-tacca bg-superficie px-4 py-3 text-s2 font-bold text-azione-testo">
          <Icona nome="segnala" size={20} />Manda per email
        </a>
      )}
    </div>
  );
}

export default function Segnala() {
  const { params } = useExtra();
  const [salvate, salva] = useExtraDati<Segnalazione[]>('segnalazioni', []);
  const lista = useMemo(() => leggiSalvate(salvate), [salvate]);
  const domanda = useMemo(() => (params.domanda ? questions.find(q => q.id === params.domanda) : undefined), [params.domanda]);
  const errore = accorcia(params.errore, MAX_ERRORE);
  const [tipo, setTipo] = useState<TipoSegnalazione>(eTipo(params.tipo) ? params.tipo : domanda ? 'domanda' : 'app');
  const [testo, setTesto] = useState('');
  const [fatta, setFatta] = useState<Segnalazione | null>(null);
  const [info, setInfo] = useState(false);
  const [daEliminare, setDaEliminare] = useState<string | null>(null);
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
          <p className="inline-flex items-center gap-2 self-center rounded-full bg-medio-tinta px-3 py-1.5 text-s2 font-bold text-medio-testo dark:bg-superficie-2">
            <Icona nome="stato-attenzione" size={18} />Non inviata
          </p>
          <p data-testo-ok className="text-center text-s2 leading-[20px] text-testo-tenue">{CONTACT_EMAIL ? <>Mandala per email a <strong className="break-all text-testo">{CONTACT_EMAIL}</strong>: il testo è già pronto.</> : 'Copia il testo e mandalo tu.'}</p>
          <div className="rounded-xl border border-linea bg-superficie p-3.5 shadow-sm dark:shadow-none">
            <BloccoTesto id={`${campo}-fatta`} testo={testoDaCopiare(fatta)} />
          </div>
          <div className="mt-1 flex flex-col gap-2.5">
            <button type="button" onClick={() => { playTapSound(); setFatta(null); }}
              className="brand-premibile flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl border border-tacca bg-superficie px-4 py-3 text-s2 font-bold text-testo"><Icona nome="segnala" size={20} />Un'altra segnalazione</button>
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
                  className={cn('brand-premibile flex min-h-[78px] flex-col items-center justify-center gap-1.5 rounded-xl border px-1 py-2.5', on ? 'border-azione border-[1.5px] bg-azione-tinta text-azione-testo' : 'border-linea bg-superficie text-testo-tenue')}>
                  <Icona nome={st.icona} size={22} />
                  <span className={cn('text-s1 leading-[17px]', on ? 'font-bold text-azione-testo' : 'font-semibold text-testo')}>{st.parola}</span>
                </button>
              );
            })}
          </div>

          {params.domanda && (
            <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-linea bg-superficie p-3.5">
              <Icona nome="segnala-domanda" size={20} className="mt-0.5 shrink-0 text-basso-numero" />
              {domanda
                ? <p data-testo-ok className="text-s2 leading-[20px] text-testo">{domanda.prompt}</p>
                : <p className="text-s2 leading-[20px] text-testo-tenue">«{params.domanda.slice(0, 20)}»</p>}
            </div>
          )}

          {errore && (
            <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-linea bg-superficie p-3.5">
              <Icona nome="segnala-app" size={20} className="mt-0.5 shrink-0 text-medio-numero" />
              <p data-testo-ok className="break-words text-s1 leading-[18px] text-testo-tenue">{errore}</p>
            </div>
          )}

          <div className="mt-4">
            <label htmlFor={campo} className="mb-1.5 block text-s2 leading-[21px] font-bold text-testo">Cosa vuoi dirci?</label>
            <textarea id={campo} value={testo} onChange={e => setTesto(e.target.value.slice(0, LUNGHEZZA_MAX))} rows={5} maxLength={LUNGHEZZA_MAX}
              placeholder={SEGNAPOSTO[tipo]}
              className="w-full resize-y rounded-xl border border-bordo-campo bg-superficie p-3.5 text-s2 leading-[22px] text-testo placeholder:text-testo-tenue outline-none focus:outline focus:outline-2 focus:outline-azione" />
            <p className="text-right text-s1 tabular-nums text-testo-tenue">{testo.length}/{LUNGHEZZA_MAX}</p>
          </div>
          <div className="mt-3">
            <BottoneAzione disabled={!testoValido(testo)} icona={<Icona nome="segnala" size={20} />} onClick={invia}>Prepara il testo</BottoneAzione>
            <p data-testo-ok className="mt-2 text-center text-s1 leading-[18px] text-testo-tenue">{testoValido(testo) ? 'Non parte da sola: al passo dopo la mandi tu per email.' : `Scrivi almeno ${LUNGHEZZA_MIN} caratteri per preparare il testo.`}</p>
          </div>
        </>
      )}

      {lista.length > 0 && (
        <section aria-labelledby="seg-salvate" className="mt-7 flex flex-col gap-3">
          <h2 id="seg-salvate" className="text-s3 leading-[24px] font-bold text-testo">Salvate <span className="tabular-nums text-testo-tenue">{lista.length}</span></h2>
          <ul className="flex flex-col gap-[8px]">
            {lista.map(s => (
              <li key={s.id} className="rounded-xl border border-linea bg-superficie p-3.5 shadow-sm dark:shadow-none">
                <p className="flex items-center gap-2 text-s1 text-testo-tenue">
                  <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-[2px] text-s1 leading-[16px] font-bold', TONI[STILE_TIPO[s.tipo].tono].tinta, TONI[STILE_TIPO[s.tipo].tono].testo)}><Icona nome={STILE_TIPO[s.tipo].icona} size={13} />{STILE_TIPO[s.tipo].parola}</span>
                  <span className="tabular-nums">{quando(s.quando)}</span>
                </p>
                <p data-testo-ok className="mt-1 text-s1 leading-[20px] text-testo break-words">{accorcia(s.testo, 140)}</p>
                <div className="mt-2 flex gap-2">
                  <button type="button" onClick={() => { playTapSound(); setFatta(s); }}
                    className="brand-premibile inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-tacca px-3.5 text-s2 font-bold text-azione-testo"><Icona nome="copia" size={18} />Rivedi e copia</button>
                  {daEliminare === s.id ? (
                    <>
                      <button type="button" onClick={() => { playTapSound(); salva(prec => rimuovi(leggiSalvate(prec), s.id)); setDaEliminare(null); }}
                        className="brand-premibile inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-basso-numero px-3 text-s2 font-bold text-basso-testo"><Icona nome="cancella" size={18} />Sì, elimina</button>
                      <button type="button" onClick={() => { playTapSound(); setDaEliminare(null); }}
                        className="brand-premibile inline-flex min-h-[44px] items-center rounded-xl px-3 text-s2 font-bold text-testo-tenue">Annulla</button>
                    </>
                  ) : (
                    <button type="button" onClick={() => { playTapSound(); setDaEliminare(s.id); }}
                      className="brand-premibile inline-flex min-h-[44px] items-center gap-1.5 rounded-xl px-3 text-s2 font-bold text-testo-tenue"><Icona nome="cancella" size={18} />Elimina</button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <FoglioInfo aperto={info} onChiudi={() => setInfo(false)} titolo="Segnala">
        <p>Una domanda sbagliata, una spiegazione confusa o un problema dell'app. La segnalazione viene <strong>salvata solo su questo dispositivo</strong> e ti prepariamo un testo da copiare.</p>
        <p className="mt-2">L'app non la invia da sola: con «Manda per email» si apre la tua app di posta con il testo già scritto{CONTACT_EMAIL ? `, indirizzato a ${CONTACT_EMAIL}` : ''}. Nel testo ci sono solo quello che hai scritto e, se c'è, la domanda: niente progressi né dati personali.</p>
      </FoglioInfo>
    </Pagina>
  );
}
