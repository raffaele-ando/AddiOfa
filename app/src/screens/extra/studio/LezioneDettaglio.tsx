// Una lezione (params.id = id dell'argomento di teoria): tre passi a icone (teoria, esercizi, verifica) con avanzamento vero e tempo.
// Concept: 31 («dettaglio lezione», 12) e 49. Passi con la parola, minuti con l'unità, un solo ▶. La verifica è la misura: quante domande sono imparate.
import { useMemo, type ReactNode } from 'react';
import { useExtra } from '../contesto';
import { Icona, type NomeIcona } from '../../../brand/icone/Icona';
import { lezioniPercorso, filtroArgomento, titoloBreve } from '../../../lib/studio/percorso';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';
import { famigliaDi } from '../../../lib/studio/famiglie';
import { Pagina, Bottone, StatoVuoto, BarraTono, IconaTono, ChipLivello, Arte, type Tono } from './comune';

const CLASSE_RIGA = 'w-full flex items-center gap-3 rounded-[12px] bg-superficie-2 p-3 text-left';

function Minuti({ n }: { n: number }) {
  return <span className="shrink-0 text-[12.5px] leading-[17px] tabular-nums text-testo-tenue">{n} min</span>;
}

/** Un passo che si apre (teoria, esercizi): icona nel suo tono, nome, minuti, e a destra la freccia o il ▶. */
function PassoAzione({ icona, tono, nome, minuti, fatto, fine, onClick }: {
  icona: NomeIcona; tono: Tono; nome: string; minuti?: number; fatto?: boolean; fine: ReactNode; onClick: () => void;
}) {
  return (
    <li>
      <button type="button" onClick={() => { playTapSound(); onClick(); }} aria-label={`${nome}${fatto ? ', fatto' : ''}`} className={cn(CLASSE_RIGA, 'brand-premibile')}>
        <IconaTono tono={fatto ? 'alto' : tono} lato={44}><Icona nome={fatto ? 'stato-imparata' : icona} size={24} /></IconaTono>
        <span className="flex-1 min-w-0 text-[15px] leading-[20px] font-bold text-testo">{nome}</span>
        {minuti !== undefined && minuti > 0 && <Minuti n={minuti} />}
        {fine}
      </button>
    </li>
  );
}

export default function LezioneDettaglio() {
  const { appState, params, vai, indietro, apriTeoria, avviaEsercizi } = useExtra();
  const lezioni = useMemo(() => lezioniPercorso(appState), [appState]);
  const i = lezioni.findIndex(l => l.topic.id === params.id);
  const l = i >= 0 ? lezioni[i] : null;

  if (!l) {
    return (
      <Pagina titolo="Lezione" onIndietro={indietro}>
        <div className="mt-6">
          <StatoVuoto illustrazione={{ nome: 'ricerca-scintille' }} titolo="Lezione non trovata" testo="Scegline un'altra dal percorso.">
            <Bottone onClick={() => vai('percorso')} icona={<Icona nome="percorso" size={18} />}>Apri il percorso</Bottone>
          </StatoVuoto>
        </div>
      </Pagina>
    );
  }

  const { topic } = l;
  const totaleDomande = l.intere;
  const percento = totaleDomande > 0 ? Math.round((l.imparate / totaleDomande) * 100) : 0;
  const imparata = l.stato === 'imparata';
  const successiva = lezioni[i + 1];

  const apriLaTeoria = () => apriTeoria(topic.id);
  const esercitati = () => avviaEsercizi('category', filtroArgomento(topic));

  return (
    <Pagina titolo={titoloBreve(topic)} onIndietro={indietro}
      destra={<Arte nome={famigliaDi(topic.id).illustrazione} lato={40} />}
      sotto={
        <span className="inline-flex items-center gap-3">
          <ChipLivello livello={topic.livello} /><span className="sr-only">Livello {topic.livello}</span>
          <span className="inline-flex items-center gap-1 tabular-nums"><Icona nome="tempo" size={15} />{l.minuti.totale} min</span>
          <span className="tabular-nums">Lezione {l.numero} di {lezioni.length}</span>
        </span>
      }>
      <ol className="mt-5 flex flex-col gap-2.5" aria-label="Passi della lezione">
        <PassoAzione icona="teoria" tono="azione" nome="Teoria" minuti={l.minuti.teoria}
          onClick={apriLaTeoria}
          fine={<span className="shrink-0 text-testo-tenue"><Icona nome="avanti" size={22} /></span>} />

        <PassoAzione icona="esercizi" tono="medio" nome="Esercizi" minuti={l.minuti.esercizi}
          fatto={l.intere > 0 && l.viste >= l.intere}
          onClick={esercitati}
          fine={<span aria-hidden="true" className="shrink-0 grid h-9 w-9 place-items-center rounded-full bg-azione text-azione-su"><Icona nome="studia" size={18} /></span>} />

        <li className={CLASSE_RIGA} aria-label={`Verifica: ${l.imparate} domande imparate su ${totaleDomande}${imparata ? ', lezione imparata' : ''}`}>
          <IconaTono tono="alto" lato={44}><Icona nome={imparata ? 'stato-imparata' : 'verifica'} size={24} /></IconaTono>
          <span className="flex-1 min-w-0">
            <span className="block text-[15px] leading-[20px] font-bold text-testo">Verifica</span>
            <span className="mt-1.5 block"><BarraTono valore={percento} tono={imparata ? 'alto' : 'azione'} className="h-2" /></span>
          </span>
          <span aria-hidden="true" className={cn('shrink-0 text-[22px] leading-[24px] font-extrabold tabular-nums', imparata ? 'text-alto-numero' : 'text-azione-testo')}>
            {l.imparate}<span className="text-[14px] font-bold text-testo-tenue">/{totaleDomande}</span>
          </span>
        </li>
      </ol>

      {imparata && (
        <div className="mt-5 flex flex-col items-center gap-3 rounded-[16px] bg-superficie-2 px-4 py-4">
          <Arte nome="documento-completato" gruppo="stati" lato={96} />
          {successiva && (
            <Bottone onClick={() => vai('lezione-dettaglio', { id: successiva.topic.id })} icona={<Icona nome="studia" size={18} />}>Lezione successiva</Bottone>
          )}
        </div>
      )}

      {successiva && !imparata && (
        <button type="button" aria-label={`Lezione successiva: ${titoloBreve(successiva.topic)}`}
          onClick={() => { playTapSound(); vai('lezione-dettaglio', { id: successiva.topic.id }); }}
          className={cn(CLASSE_RIGA, 'brand-premibile mt-5 border border-linea bg-superficie')}>
          <span aria-hidden="true" className="shrink-0 grid h-9 w-9 place-items-center rounded-[10px] bg-superficie-2 text-[14px] font-extrabold tabular-nums text-testo-tenue">{successiva.numero}</span>
          <span className="flex-1 min-w-0 text-[14.5px] leading-[20px] font-bold text-testo break-words">{titoloBreve(successiva.topic)}</span>
          <span aria-hidden="true" className="shrink-0 text-testo-tenue"><Icona nome="avanti" size={22} /></span>
        </button>
      )}
    </Pagina>
  );
}
