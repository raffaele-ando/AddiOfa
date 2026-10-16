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
import { Bottone, Campo, Carta, EtichettaEsito, Pagina, SchedeSfide, Sezione, dataBreve, dataLunga } from './comuni';

function titoloVoce(v: VoceSfida): string {
  if (v.tipo === 'giorno') return `Sfida del giorno · ${dataBreve(v.quando)}`;
  if (v.avversario) return `Duello con ${v.avversario.nome}`;
  return 'Duello · in attesa dell\'amico';
}

function RigaStorico({ voce, onApri }: { voce: VoceSfida; onApri: () => void }) {
  const avv = voce.avversario;
  return (
    <li>
      <button type="button" onClick={() => { playTapSound(); onApri(); }} className="brand-premibile w-full flex items-center gap-3 rounded-[12px] bg-superficie-2 p-3 text-left">
        <span className="w-10 h-10 shrink-0 rounded-[10px] bg-superficie text-azione flex items-center justify-center border border-linea" aria-hidden>
          {voce.tipo === 'giorno' ? <CalendarCheck2 size={20} /> : <Swords size={20} />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[14.5px] leading-[19px] font-bold text-testo">{titoloVoce(voce)}</span>
          <span className="block text-[12.5px] leading-[17px] tabular-nums text-testo-tenue">
            {voce.corrette}/{voce.totale} · {tempoBreve(voce.secondi)}{avv ? ` · lui ${avv.corrette}/${avv.totale}` : ''}{voce.tipo === 'duello' ? ` · ${dataBreve(voce.quando)}` : ''}
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
    <Pagina titolo="Sfide" sottotitolo="Domande vere, contro il tempo e contro gli amici. Contano le risposte giuste e il tempo: nessun punto da collezionare."
      onBack={indietro}>
      <SchedeSfide attiva="sfide" />

      <Sezione id="titolo-giorno" titolo="Sfida del giorno" destra={<span className="text-[12.5px] font-semibold text-testo-tenue">{dataLunga()}</span>}>
        <Carta tono="alto">
          <p className="text-[15px] leading-[21px] font-bold text-testo">{DOMANDE_SFIDA} domande, le stesse per tutti oggi</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-[13.5px] leading-[19px] text-testo-tenue"><Clock size={14} aria-hidden /> {SECONDI_SFIDA / 60} minuti · domande del nucleo gratuito</p>
          {oggi ? (
            <>
              <p className="mt-3 text-[15px] font-bold text-testo" role="status">
                Oggi hai fatto <span className="tabular-nums">{oggi.corrette}/{oggi.totale}</span> in <span className="tabular-nums">{tempoBreve(oggi.secondi)}</span>.
              </p>
              <p className="mt-0.5 text-[13px] text-testo-tenue">Domani ce ne sarà un'altra.</p>
              <div className="mt-3"><Bottone variante="secondario" onClick={() => vai('sfida-risultato', { voce: oggi.id })}>Vedi il risultato</Bottone></div>
            </>
          ) : (
            <div className="mt-3"><Bottone onClick={() => vai('sfida-gioco', { tipo: 'giorno', seme: semeDelGiorno() })}>Inizia la sfida</Bottone></div>
          )}
        </Carta>
      </Sezione>

      <Sezione id="titolo-amico" titolo="Sfida un amico">
        <Carta>
          <p className="text-[14px] leading-[20px] text-testo">Giochi {DOMANDE_SFIDA} domande e mandi il link: il tuo amico gioca le stesse e vedete chi ha vinto.</p>
          <div className="mt-3 flex flex-col gap-3">
            <Campo id="nome-sfida" etichetta="Il nome con cui ti vedrà il tuo amico" valore={nome} onCambia={v => { setNome(v); setErroreNome(null); }}
              segnaposto="Il tuo nome" maxLength={NOME_MAX} errore={erroreNome} onInvio={iniziaDuello} />
            <Bottone onClick={iniziaDuello}><Swords size={18} aria-hidden /> Inizia il duello</Bottone>
          </div>
          <p className="mt-3 text-[12.5px] leading-[18px] text-testo-tenue">Senza account e senza server: il link contiene il tuo nome e il tuo risultato, e basta. Chi lo apre vede solo quello.</p>
        </Carta>
      </Sezione>

      <Sezione id="titolo-link" titolo="Hai ricevuto una sfida?">
        <div className="flex flex-col gap-2">
          <Campo id="link-sfida" etichetta="Incolla qui il link" valore={link} onCambia={v => { setLink(v); setErroreLink(null); }} segnaposto="Incolla il link" errore={erroreLink} onInvio={apriLink} />
          <Bottone variante="secondario" onClick={apriLink} disabled={!link.trim()}>Apri la sfida</Bottone>
          <p className="text-[12.5px] leading-[18px] text-testo-tenue">Di solito basta toccare il link: l'app si apre da sola sulla sfida.</p>
        </div>
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
