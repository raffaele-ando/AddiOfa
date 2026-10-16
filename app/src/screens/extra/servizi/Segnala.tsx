// «Segnala» (concept 13/16/17, pulsante vicino alle domande): una segnalazione si compone qui e resta SUL DISPOSITIVO.
// L'app non ha un canale che la invii (access/provider.ts ha solo eventi fissi, non testi liberi): la schermata lo dice
// e dà un testo da copiare. Mai «inviato» se non è inviato. Parametri: `domanda` (id), `tipo`, `errore` (testo breve di un errore).
import { useId, useMemo, useState } from 'react';
import { Check, Copy, Flag, Trash2 } from 'lucide-react';
import { useExtra, useExtraDati } from '../contesto';
import { BottoneAzione, BottoneSecondario, Nota, Pagina, Sezione, copiaTesto } from './componenti';
import { questions } from '../../../data/questions';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';
import {
  LUNGHEZZA_MAX, TIPI_SEGNALAZIONE, accorcia, aggiungi, creaSegnalazione, eTipo, leggiSalvate, rimuovi, testoDaCopiare, testoValido,
  MAX_ERRORE, type Segnalazione, type TipoSegnalazione,
} from '../../../lib/servizi/segnalazioni';

const quando = (ms: number) => new Date(ms).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
const nuovoId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

function BloccoTesto({ testo, id }: { testo: string; id: string }) {
  const [esito, setEsito] = useState<'' | 'ok' | 'no'>('');
  return (
    <div>
      <label htmlFor={id} className="sr-only">Testo da copiare</label>
      <textarea id={id} readOnly value={testo} rows={Math.min(9, testo.split('\n').length + 1)} onFocus={e => e.currentTarget.select()}
        className="w-full resize-none rounded-[10px] bg-superficie p-3 text-[13px] leading-[19px] text-testo outline-none focus:outline focus:outline-2 focus:outline-azione" />
      <BottoneSecondario className="mt-2" icona={esito === 'ok' ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
        onClick={async () => setEsito((await copiaTesto(testo)) ? 'ok' : 'no')}>
        {esito === 'ok' ? 'Copiato' : 'Copia il testo'}
      </BottoneSecondario>
      {esito === 'no' && <p className="mt-2 text-[12.5px] leading-[18px] text-testo-tenue" role="status">Il browser non mi lascia copiare da solo: tocca il testo qui sopra, selezionalo e copialo a mano.</p>}
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
  const campo = useId();

  const invia = () => {
    if (!testoValido(testo)) return;
    const s = creaSegnalazione({ tipo, testo, domandaId: domanda?.id, domandaTesto: domanda?.prompt, errore }, Date.now(), nuovoId());
    salva(prec => aggiungi(leggiSalvate(prec), s));
    setFatta(s);
    setTesto('');
  };

  return (
    <Pagina titolo="Segnala" sottotitolo="Una domanda sbagliata, una spiegazione confusa o un problema dell'app.">

      {fatta ? (
        <div className="mt-5" role="status">
          <Nota tono="azione">
            <p className="font-bold">Segnalazione salvata su questo dispositivo</p>
            <p className="mt-0.5">Non è stata inviata a nessuno: l'app non ha ancora un indirizzo a cui spedirla. Copia il testo qui sotto e mandalo tu al contatto da cui hai conosciuto AddiOFA.</p>
          </Nota>
          <div className="mt-3 rounded-[12px] bg-superficie-2 p-3.5">
            <h2 className="mb-2 text-[14.5px] font-bold text-testo">Riepilogo da inviare</h2>
            <BloccoTesto id={`${campo}-fatta`} testo={testoDaCopiare(fatta)} />
            <p className="mt-2 text-[12px] leading-[17px] text-testo-tenue">Nel testo ci sono solo quello che hai scritto e, se c'è, la domanda. Non ci sono i tuoi progressi né dati personali.</p>
          </div>
          <div className="mt-4 flex flex-col gap-2.5">
            <BottoneAzione onClick={indietro}>Torna a quello che stavi facendo</BottoneAzione>
            <BottoneSecondario onClick={() => setFatta(null)}>Scrivi un'altra segnalazione</BottoneSecondario>
          </div>
        </div>
      ) : (
        <>
          <Sezione id="seg-tipo" titolo="Di cosa si tratta?">
            <div role="radiogroup" aria-labelledby="seg-tipo" className="flex flex-col gap-[8px]">
              {TIPI_SEGNALAZIONE.map(t => {
                const on = tipo === t.id;
                return (
                  <button key={t.id} type="button" role="radio" aria-checked={on} onClick={() => { playTapSound(); setTipo(t.id); }}
                    className={cn('brand-premibile flex w-full items-start gap-3 rounded-[12px] p-3.5 text-left', on ? 'bg-azione-tinta' : 'bg-superficie-2')}>
                    <span className={cn('mt-[2px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2', on ? 'border-azione bg-azione text-azione-su' : 'border-tacca')} aria-hidden="true">
                      {on && <Check size={12} strokeWidth={3.5} />}
                    </span>
                    <span className="min-w-0"><span className="block text-[14.5px] leading-[20px] font-bold text-testo">{t.nome}</span><span className="block text-[12.5px] leading-[18px] text-testo-tenue">{t.aiuto}</span></span>
                  </button>
                );
              })}
            </div>
          </Sezione>

          {params.domanda && (
            <Sezione id="seg-domanda" titolo="La domanda">
              <div className="rounded-[12px] bg-superficie-2 p-3.5">
                {domanda
                  ? <><p className="text-[13.5px] leading-[20px] text-testo">{domanda.prompt}</p><p className="mt-1 text-[12px] text-testo-tenue">Id: {domanda.id}</p></>
                  : <p className="text-[13.5px] leading-[20px] text-testo-tenue">Non trovo la domanda «{params.domanda.slice(0, 20)}»: scrivi nel testo quale è.</p>}
              </div>
            </Sezione>
          )}

          {errore && (
            <Sezione id="seg-errore" titolo="Dettaglio tecnico allegato">
              <p className="break-words rounded-[12px] bg-superficie-2 p-3.5 text-[12.5px] leading-[18px] text-testo-tenue">{errore}</p>
            </Sezione>
          )}

          <Sezione id="seg-testo" titolo="Cosa non va?">
            <label htmlFor={campo} className="sr-only">Descrivi il problema</label>
            <textarea id={campo} value={testo} onChange={e => setTesto(e.target.value.slice(0, LUNGHEZZA_MAX))} rows={5} maxLength={LUNGHEZZA_MAX}
              placeholder={tipo === 'domanda' ? 'Per esempio: la risposta esatta dovrebbe essere la C, perché…' : 'Racconta cosa è successo e cosa ti aspettavi.'}
              className="w-full resize-y rounded-[12px] bg-superficie-2 p-3.5 text-[15px] leading-[22px] text-testo placeholder:text-testo-tenue outline-none focus:outline focus:outline-2 focus:outline-azione" />
            <p className="text-right text-[12px] tabular-nums text-testo-tenue">{testo.length}/{LUNGHEZZA_MAX}</p>
          </Sezione>

          <Nota className="mt-4">
            <p>Cosa succede davvero: la segnalazione viene <strong>salvata solo su questo dispositivo</strong> e ti prepariamo un testo da copiare. L'app non la invia da sola e non ci sono i tuoi dati personali.</p>
          </Nota>
          <div className="mt-4">
            <BottoneAzione onClick={invia} disabled={!testoValido(testo)}>Prepara la segnalazione</BottoneAzione>
            {!testoValido(testo) && <p className="mt-2 text-center text-[12.5px] text-testo-tenue">Scrivi almeno qualche parola per continuare.</p>}
          </div>
        </>
      )}

      {lista.length > 0 && (
        <Sezione id="seg-salvate" titolo={`Le tue segnalazioni (${lista.length})`}>
          <p className="text-[12.5px] leading-[18px] text-testo-tenue">Salvate su questo dispositivo, non inviate.</p>
          <ul className="flex flex-col gap-[8px]">
            {lista.map(s => (
              <li key={s.id} className="rounded-[12px] bg-superficie-2 p-3.5">
                <p className="text-[13px] font-bold text-testo">{TIPI_SEGNALAZIONE.find(t => t.id === s.tipo)?.nome} <span className="font-normal text-testo-tenue">· {quando(s.quando)}</span></p>
                <p className="mt-1 text-[13.5px] leading-[20px] text-testo break-words">{accorcia(s.testo, 140)}</p>
                <div className="mt-2 flex gap-2">
                  <button type="button" onClick={() => setFatta(s)} className="brand-premibile min-h-[40px] rounded-[10px] bg-superficie px-3 text-[13px] font-bold text-azione-scuro">Rivedi e copia</button>
                  <button type="button" onClick={() => salva(prec => rimuovi(leggiSalvate(prec), s.id))} aria-label="Elimina questa segnalazione"
                    className="brand-premibile inline-flex min-h-[40px] items-center gap-1.5 rounded-[10px] bg-superficie px-3 text-[13px] font-bold text-testo-tenue"><Trash2 size={15} aria-hidden="true" />Elimina</button>
                </div>
              </li>
            ))}
          </ul>
        </Sezione>
      )}
    </Pagina>
  );
}
