// `sfide`: l'hub delle sfide. Sfida del giorno (10 domande uguali per tutti, scelte dalla data), duello con un amico tramite link,
// le tue sfide (storico locale) e le schede Classifica e Amici. Senza server né account: nessun altro utente è inventato.
import { useState } from 'react';
import { ChevronRight, Swords, CalendarCheck2, Clock } from 'lucide-react';
import { useExtra } from '../contesto';
import { playTapSound } from '../../../lib/audio';
import { nuovoSeme, semeDelGiorno, DOMANDE_SFIDA, SECONDI_SFIDA } from '../../../lib/sfide/seme';
import { estraiCodice, pulisciNome, NOME_MAX } from '../../../lib/sfide/codice';
import { confronta, idVoce, tempoBreve, type VoceSfida } from '../../../lib/sfide/risultati';
import { useProfiloSfide, useStorico } from './dati';
import { IconaTono } from '../ui';
import { Bottone, Campo, Carta, EtichettaEsito, Pagina, SchedeSfide, Sezione, dataBreve, dataLunga } from './comuni';

function titoloVoce(v: VoceSfida): string {
  if (v.tipo === 'giorno') return `Sfida del giorno · ${dataBreve(v.quando)}`;
  if (v.avversario) return `Duello con ${v.avversario.nome}`;
  return 'Duello · in attesa dell\'amico';
}

/** Una riga dello storico: la tessera dice il tipo (verde il giorno, corallo il duello), l'etichetta a destra l'esito. */
function RigaStorico({ voce, onApri }: { voce: VoceSfida; onApri: () => void }) {
  const avv = voce.avversario;
  const giorno = voce.tipo === 'giorno';
  return (
    <li>
      <button type="button" onClick={() => { playTapSound(); onApri(); }} className="brand-premibile w-full flex items-center gap-3 rounded-[12px] bg-superficie-2 p-3 text-left">
        <IconaTono tono={giorno ? 'alto' : 'basso'}>{giorno ? <CalendarCheck2 size={20} /> : <Swords size={20} />}</IconaTono>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[14.5px] leading-[19px] font-bold text-testo">{titoloVoce(voce)}</span>
          <span className="block text-[12.5px] leading-[17px] tabular-nums text-testo-tenue">
            {avv ? `${voce.corrette} a ${avv.corrette}` : `${voce.corrette}/${voce.totale}`} · {tempoBreve(voce.secondi)}{!giorno ? ` · ${dataBreve(voce.quando)}` : ''}
          </span>
        </span>
        {avv ? <EtichettaEsito esito={confronta(voce, avv)} /> : null}
        <ChevronRight size={20} className="shrink-0 -mr-1 text-testo-tenue" aria-hidden />
      </button>
    </li>
  );
}

export default function Sfide() {
  const { vai, indietro } = useExtra();
  const { voci } = useStorico();
  const { profilo } = useProfiloSfide();
  const [nome, setNome] = useState(profilo.nome ?? '');
  const [erroreNome, setErroreNome] = useState<string | null>(null);
  const [link, setLink] = useState('');
  const [erroreLink, setErroreLink] = useState<string | null>(null);

  const oggi = voci.find(v => v.id === idVoce('giorno', semeDelGiorno(), 'solo'));

  const iniziaDuello = () => {
    const n = pulisciNome(nome);
    if (!n) { setErroreNome('Scrivi il nome con cui i tuoi amici ti riconoscono.'); return; }
    vai('sfida-gioco', { tipo: 'duello', ruolo: 'sfidante', seme: nuovoSeme(), nome: n });
  };
  const apriLink = () => {
    const c = estraiCodice(link);
    if (!c) { setErroreLink('Non riconosco il link. Incolla il link intero che ti ha mandato il tuo amico.'); return; }
    vai('sfida-accetta', { sfida: c });
  };

  return (
    <Pagina titolo="Sfide" sottotitolo="Una sfida al giorno e i duelli con gli amici: contano risposte giuste e tempo." onBack={indietro}>
      <SchedeSfide attiva="sfide" />

      {/* Il solo blocco in evidenza: la sfida del giorno, verde. Il bottone è blu pieno finché non l'hai giocata. */}
      <Sezione id="titolo-giorno" titolo="Sfida del giorno" destra={<span className="text-[12.5px] font-semibold text-testo-tenue">{dataLunga()}</span>}>
        <Carta tono="alto">
          <div className="flex items-start gap-3">
            <span aria-hidden className="grid h-11 w-11 shrink-0 place-items-center rounded-[12px] bg-superficie text-alto-numero"><CalendarCheck2 size={22} /></span>
            <div className="min-w-0">
              <p className="text-[15px] leading-[21px] font-bold text-testo">{DOMANDE_SFIDA} domande, le stesse per tutti oggi</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-[13.5px] leading-[19px] text-testo-tenue"><Clock size={14} className="text-medio-numero" aria-hidden /> {SECONDI_SFIDA / 60} minuti · domande gratuite</p>
            </div>
          </div>
          {oggi ? (
            <>
              <p className="mt-3 text-[15px] font-bold text-testo" role="status">
                Oggi hai fatto <span className="tabular-nums text-alto-testo">{oggi.corrette}/{oggi.totale}</span> in <span className="tabular-nums">{tempoBreve(oggi.secondi)}</span>.
              </p>
              <p className="mt-0.5 text-[13px] text-testo-tenue">Domani ce ne sarà un'altra.</p>
              <div className="mt-3"><Bottone variante="secondario" onClick={() => vai('sfida-risultato', { voce: oggi.id })}>Vedi il risultato</Bottone></div>
            </>
          ) : (
            <div className="mt-3"><Bottone onClick={() => vai('sfida-gioco', { tipo: 'giorno', seme: semeDelGiorno() })}>Inizia la sfida</Bottone></div>
          )}
        </Carta>
      </Sezione>

      {/* Il duello è corallo (confronto con un altro). Se la sfida del giorno è ancora da fare, il bottone è secondario: un solo pulsante pieno per schermata. */}
      <Sezione id="titolo-amico" titolo="Sfida un amico">
        <Carta>
          <div className="flex items-start gap-3">
            <IconaTono tono="basso" lato={44} className="rounded-[12px]"><Swords size={22} /></IconaTono>
            <p className="text-[14px] leading-[20px] text-testo">Giochi {DOMANDE_SFIDA} domande e mandi il link: il tuo amico gioca le stesse e vedete chi ha vinto.</p>
          </div>
          <div className="mt-3 flex flex-col gap-3">
            <Campo id="nome-sfida" etichetta="Il nome con cui ti vedrà il tuo amico" valore={nome} onCambia={v => { setNome(v); setErroreNome(null); }}
              segnaposto="Il tuo nome" maxLength={NOME_MAX} errore={erroreNome} onInvio={iniziaDuello} />
            <Bottone variante={oggi ? 'primario' : 'secondario'} onClick={iniziaDuello}><Swords size={18} aria-hidden /> Inizia il duello</Bottone>
          </div>
          <p className="mt-3 text-[12.5px] leading-[18px] text-testo-tenue">Senza account e senza server: il link contiene solo il tuo nome e il tuo risultato.</p>
        </Carta>
      </Sezione>

      <Sezione id="titolo-link" titolo="Hai ricevuto una sfida?">
        <div className="flex gap-2">
          <input id="link-sfida" value={link} onChange={e => { setLink(e.target.value); setErroreLink(null); }} placeholder="Incolla qui il link" aria-label="Il link della sfida"
            autoComplete="off" spellCheck={false} onKeyDown={e => { if (e.key === 'Enter') apriLink(); }} aria-invalid={erroreLink ? true : undefined} aria-describedby={erroreLink ? 'link-sfida-err' : undefined}
            className="min-w-0 flex-1 rounded-2xl border border-linea bg-superficie-2 px-4 py-3 text-[15px] font-semibold text-testo placeholder:text-testo-tenue placeholder:font-medium focus:outline-none focus:border-azione focus:ring-2 focus:ring-azione/30" />
          <button type="button" onClick={() => { playTapSound(); apriLink(); }} disabled={!link.trim()}
            className="brand-premibile shrink-0 rounded-2xl border border-azione bg-superficie px-5 text-[15px] font-bold text-azione-scuro transition-colors duration-100 disabled:opacity-40 disabled:pointer-events-none">Apri</button>
        </div>
        {erroreLink && <p id="link-sfida-err" role="alert" className="text-[13px] font-bold text-basso-testo">{erroreLink}</p>}
        <p className="text-[12.5px] leading-[18px] text-testo-tenue">Di solito basta toccare il link: l'app si apre da sola sulla sfida.</p>
      </Sezione>

      <Sezione id="titolo-storico" titolo="Le tue sfide">
        {voci.length === 0 ? (
          <Carta><p className="text-[14px] leading-[20px] text-testo-tenue">Qui compariranno le sfide che giochi: quella del giorno e i duelli con gli amici.</p></Carta>
        ) : (
          <ul className="flex flex-col gap-2">
            {voci.slice(0, 8).map(v => <RigaStorico key={v.id} voce={v} onApri={() => vai('sfida-risultato', { voce: v.id })} />)}
          </ul>
        )}
      </Sezione>
    </Pagina>
  );
}
