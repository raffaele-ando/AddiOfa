// «Segnala» (concept 13/16/17, pulsante vicino alle domande): una segnalazione si compone qui e resta SUL DISPOSITIVO.
// L'app non ha un canale che la invii (access/provider.ts ha solo eventi fissi, non testi liberi): la schermata lo dice (dietro la «i»)
// e dà un testo da copiare. Mai «inviato» se non è inviato. Parametri: `domanda` (id), `tipo`, `errore` (testo breve di un errore).
import { useId, useMemo, useState } from 'react';
import { Icona, type NomeIcona } from '../../../brand/icone/Icona';
import { useExtra, useExtraDati } from '../contesto';
import { Pagina, copiaTesto } from './componenti';
import { FoglioInfo, IconaTono, PulsanteInfo, TONI, type Tono } from '../ui';
import { questions } from '../../../data/questions';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';
import {
  LUNGHEZZA_MAX, TIPI_SEGNALAZIONE, accorcia, aggiungi, creaSegnalazione, eTipo, leggiSalvate, rimuovi, testoDaCopiare, testoValido,
  MAX_ERRORE, type Segnalazione, type TipoSegnalazione,
} from '../../../lib/servizi/segnalazioni';

// Il tipo di segnalazione ha il suo colore e la sua icona: domanda sbagliata = corallo (errore), spiegazione confusa = viola (apprendimento),
// problema dell'app = ambra (attenzione), suggerimento = blu. Sotto l'icona, una parola.
const STILE_TIPO: Record<TipoSegnalazione, { tono: Tono; icona: NomeIcona; parola: string }> = {
  domanda: { tono: 'basso', icona: 'segnala-domanda', parola: 'Domanda' },
  spiegazione: { tono: 'viola', icona: 'segnala-spiegazione', parola: 'Spiegazione' },
  app: { tono: 'medio', icona: 'segnala-app', parola: 'App' },
  idea: { tono: 'azione', icona: 'segnala-idea', parola: 'Idea' },
};

const quando = (ms: number) => new Date(ms).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' });
const nuovoId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

function BloccoTesto({ testo, id }: { testo: string; id: string }) {
  const [esito, setEsito] = useState<'' | 'ok' | 'no'>('');
  return (
    <div>
      <label htmlFor={id} className="sr-only">Testo da copiare</label>
      <textarea id={id} data-testo-ok readOnly value={testo} rows={Math.min(9, testo.split('\n').length + 1)} onFocus={e => e.currentTarget.select()}
        className="w-full resize-none rounded-[10px] bg-superficie p-3 text-[13px] leading-[19px] text-testo outline-none focus:outline focus:outline-2 focus:outline-azione" />
      <button type="button" onClick={async () => { playTapSound(); setEsito((await copiaTesto(testo)) ? 'ok' : 'no'); }}
        className="brand-premibile mt-2 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-[13px] bg-superficie-2 px-4 py-3 text-[15px] font-bold text-testo">
        <Icona nome={esito === 'ok' ? 'stato-ok' : 'copia'} size={18} />{esito === 'ok' ? 'Copiato' : 'Copia'}
      </button>
      {esito === 'no' && <p className="mt-2 inline-flex items-center gap-1.5 text-[12.5px] text-testo-tenue" role="status"><Icona nome="stato-attenzione" size={15} />Selezionalo a mano</p>}
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
    <Pagina titolo="Segnala" destra={<PulsanteInfo onClick={() => setInfo(true)} etichetta="Cosa succede alla segnalazione" />}>

      {fatta ? (
        <div className="mt-5 flex flex-col gap-3" role="status">
          <p className="inline-flex items-center gap-2 self-start rounded-full bg-medio-tinta px-3 py-1.5 text-[14.5px] font-bold text-medio-testo">
            <Icona nome="stato-attenzione" size={18} />Non inviata
          </p>
          <div className="rounded-[12px] bg-superficie-2 p-3.5">
            <BloccoTesto id={`${campo}-fatta`} testo={testoDaCopiare(fatta)} />
          </div>
          <div className="mt-1 flex flex-col gap-2.5">
            <button type="button" onClick={() => { playTapSound(); setFatta(null); }}
              className="brand-premibile flex min-h-[48px] w-full items-center justify-center gap-2 rounded-[13px] bg-superficie-2 px-4 py-3 text-[15px] font-bold text-testo"><Icona nome="segnala" size={18} />Un'altra</button>
            <button type="button" onClick={() => { playTapSound(); indietro(); }}
              className="brand-premibile flex min-h-[48px] w-full items-center justify-center gap-2 rounded-[13px] px-4 py-3 text-[15px] font-bold text-azione-scuro"><Icona nome="indietro" size={18} />Indietro</button>
          </div>
        </div>
      ) : (
        <>
          <div role="radiogroup" aria-label="Tipo" className="mt-5 grid grid-cols-4 gap-2">
            {TIPI_SEGNALAZIONE.map(t => {
              const on = tipo === t.id;
              const st = STILE_TIPO[t.id];
              return (
                <button key={t.id} type="button" role="radio" aria-checked={on} aria-label={t.nome} onClick={() => { playTapSound(); setTipo(t.id); }}
                  className={cn('brand-premibile flex flex-col items-center gap-1.5 rounded-[12px] border-2 px-1 py-3', on ? `${TONI[st.tono].tinta} ${TONI[st.tono].bordo}` : 'border-transparent bg-superficie-2')}>
                  <IconaTono tono={st.tono} lato={38} className={on ? 'bg-superficie' : undefined}><Icona nome={st.icona} size={21} /></IconaTono>
                  <span className="text-[12.5px] leading-[16px] font-bold text-testo">{st.parola}</span>
                </button>
              );
            })}
          </div>

          {params.domanda && (
            <div className="mt-4 flex items-start gap-2.5 rounded-[12px] bg-superficie-2 p-3.5">
              <Icona nome="segnala-domanda" size={20} className="mt-0.5 shrink-0 text-basso-numero" />
              {domanda
                ? <p data-testo-ok className="text-[13.5px] leading-[20px] text-testo">{domanda.prompt}</p>
                : <p className="text-[13.5px] leading-[20px] text-testo-tenue">«{params.domanda.slice(0, 20)}»</p>}
            </div>
          )}

          {errore && (
            <div className="mt-3 flex items-start gap-2.5 rounded-[12px] bg-superficie-2 p-3.5">
              <Icona nome="segnala-app" size={20} className="mt-0.5 shrink-0 text-medio-numero" />
              <p data-testo-ok className="break-words text-[12.5px] leading-[18px] text-testo-tenue">{errore}</p>
            </div>
          )}

          <div className="mt-4">
            <label htmlFor={campo} className="sr-only">Cosa non va?</label>
            <textarea id={campo} value={testo} onChange={e => setTesto(e.target.value.slice(0, LUNGHEZZA_MAX))} rows={5} maxLength={LUNGHEZZA_MAX}
              placeholder="Cosa non va?"
              className="w-full resize-y rounded-[12px] bg-superficie-2 p-3.5 text-[15px] leading-[22px] text-testo placeholder:text-testo-tenue outline-none focus:outline focus:outline-2 focus:outline-azione" />
            <p className="text-right text-[12px] tabular-nums text-testo-tenue">{testo.length}/{LUNGHEZZA_MAX}</p>
          </div>
          <div className="mt-3">
            <button type="button" onClick={() => { playTapSound(); invia(); }} disabled={!testoValido(testo)}
              className="brand-premibile flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[13px] bg-azione px-4 py-3 text-[16px] font-bold text-azione-su disabled:opacity-40 disabled:pointer-events-none">
              <Icona nome="segnala" size={20} />Prepara
            </button>
          </div>
        </>
      )}

      {lista.length > 0 && (
        <section aria-labelledby="seg-salvate" className="mt-[24px] flex flex-col gap-[10px]">
          <h2 id="seg-salvate" className="text-[15.5px] leading-[20px] font-bold text-testo">Salvate <span className="tabular-nums text-testo-tenue">{lista.length}</span></h2>
          <ul className="flex flex-col gap-[8px]">
            {lista.map(s => (
              <li key={s.id} className="rounded-[12px] bg-superficie-2 p-3.5">
                <p className="flex items-center gap-2 text-[13px] text-testo-tenue">
                  <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-[2px] text-[11.5px] leading-[16px] font-bold', TONI[STILE_TIPO[s.tipo].tono].tinta, TONI[STILE_TIPO[s.tipo].tono].testo)}><Icona nome={STILE_TIPO[s.tipo].icona} size={13} />{STILE_TIPO[s.tipo].parola}</span>
                  <span className="tabular-nums">{quando(s.quando)}</span>
                </p>
                <p data-testo-ok className="mt-1 text-[13.5px] leading-[20px] text-testo break-words">{accorcia(s.testo, 140)}</p>
                <div className="mt-2 flex gap-2">
                  <button type="button" onClick={() => { playTapSound(); setFatta(s); }} aria-label="Rivedi e copia"
                    className="brand-premibile grid h-10 w-10 place-items-center rounded-[10px] bg-superficie text-azione-scuro"><Icona nome="copia" size={18} /></button>
                  <button type="button" onClick={() => { playTapSound(); salva(prec => rimuovi(leggiSalvate(prec), s.id)); }} aria-label="Elimina questa segnalazione"
                    className="brand-premibile grid h-10 w-10 place-items-center rounded-[10px] bg-superficie text-testo-tenue"><Icona nome="cancella" size={18} /></button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <FoglioInfo aperto={info} onChiudi={() => setInfo(false)} titolo="Segnala">
        <p>Una domanda sbagliata, una spiegazione confusa o un problema dell'app. La segnalazione viene <strong>salvata solo su questo dispositivo</strong> e ti prepariamo un testo da copiare.</p>
        <p className="mt-2">L'app non la invia da sola: non ha ancora un indirizzo a cui spedirla. Copia il testo e mandalo tu al contatto da cui hai conosciuto AddiOFA. Nel testo ci sono solo quello che hai scritto e, se c'è, la domanda: niente progressi né dati personali.</p>
      </FoglioInfo>
    </Pagina>
  );
}
