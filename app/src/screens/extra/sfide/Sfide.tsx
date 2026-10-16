// `sfide`: la sfida del giorno (▶), il duello con un amico (nome + ▶), il link ricevuto (incolla) e lo storico a icone.
// Senza server né account: nessun altro utente è inventato. Le regole stanno dietro la «i».
import { useState } from 'react';
import { Icona } from '../../../brand/icone/Icona';
import { useExtra } from '../contesto';
import { playTapSound } from '../../../lib/audio';
import { nuovoSeme, semeDelGiorno, DOMANDE_SFIDA, SECONDI_SFIDA } from '../../../lib/sfide/seme';
import { estraiCodice, pulisciNome, NOME_MAX } from '../../../lib/sfide/codice';
import { confronta, idVoce, tempoBreve, type VoceSfida } from '../../../lib/sfide/risultati';
import { useProfiloSfide, useStorico } from './dati';
import { IconaTono } from '../ui';
import { Bottone, Campo, Carta, DatiSfida, IconaEsito, dataBreve } from './comuni';
import { Regole, SchedaProveSfide } from './scheda';

/** Una riga dello storico: la tessera dice il tipo (verde il giorno, corallo il duello), a destra l'esito. */
function RigaStorico({ voce, onApri }: { voce: VoceSfida; onApri: () => void }) {
  const avv = voce.avversario;
  const giorno = voce.tipo === 'giorno';
  const aria = giorno ? `Sfida del giorno, ${dataBreve(voce.quando)}` : avv ? `Duello con ${avv.nome}, ${dataBreve(voce.quando)}` : `Duello in attesa, ${dataBreve(voce.quando)}`;
  return (
    <li>
      <button type="button" aria-label={aria} onClick={() => { playTapSound(); onApri(); }} className="brand-premibile flex w-full items-center gap-3 rounded-[12px] bg-superficie-2 p-3 text-left">
        <IconaTono tono={giorno ? 'alto' : 'basso'}><Icona nome={giorno ? 'sfida-giorno' : 'sfide'} size={20} /></IconaTono>
        <span className="min-w-0 flex-1">
          <span className="block text-[20px] leading-[24px] font-extrabold tabular-nums text-testo">
            {avv ? `${voce.corrette} – ${avv.corrette}` : <>{voce.corrette}<span className="text-[14px] font-bold text-testo-tenue">/{voce.totale}</span></>}
          </span>
          <span className="flex items-center gap-1.5 truncate text-[12.5px] leading-[17px] tabular-nums text-testo-tenue">
            {avv && <span className="truncate font-semibold text-testo">{avv.nome}</span>}
            <span>{dataBreve(voce.quando)}</span>
            <span className="inline-flex items-center gap-1 text-medio-testo"><Icona nome="tempo" size={12} />{tempoBreve(voce.secondi)}</span>
          </span>
        </span>
        {avv ? <IconaEsito esito={confronta(voce, avv)} /> : !giorno ? <IconaTono tono="medio" lato={34} className="rounded-full"><Icona nome="stato-attesa" size={18} /></IconaTono> : null}
        <Icona nome="avanti" size={20} className="shrink-0 -mr-1 text-testo-tenue" />
      </button>
    </li>
  );
}

export default function Sfide() {
  const { vai } = useExtra();
  const { voci } = useStorico();
  const { profilo } = useProfiloSfide();
  const [nome, setNome] = useState(profilo.nome ?? '');
  const [erroreNome, setErroreNome] = useState<string | null>(null);
  const [link, setLink] = useState('');
  const [erroreLink, setErroreLink] = useState<string | null>(null);

  const oggi = voci.find(v => v.id === idVoce('giorno', semeDelGiorno(), 'solo'));

  const iniziaDuello = () => {
    const n = pulisciNome(nome);
    if (!n) { setErroreNome('Scrivi il tuo nome.'); return; }
    vai('sfida-gioco', { tipo: 'duello', ruolo: 'sfidante', seme: nuovoSeme(), nome: n });
  };
  const apriLink = () => {
    const c = estraiCodice(link);
    if (!c) { setErroreLink('Link non riconosciuto.'); return; }
    vai('sfida-accetta', { sfida: c });
  };

  const info = (
    <Regole righe={[
      `${DOMANDE_SFIDA} domande, ${SECONDI_SFIDA / 60} minuti, senza correzioni finché non consegni.`,
      'Sfida del giorno: le stesse domande per tutti, una al giorno.',
      'Duello: giochi tu, mandi il link a un amico, gioca le stesse domande e vedete chi ha vinto.',
      'Vince chi dà più risposte giuste; a parità, il più veloce.',
      'Nessun account e nessun server: il link contiene solo il tuo nome, le domande e il tuo risultato. Il risultato dell\'amico arriva dal suo link e non è verificato.',
      'Di solito basta toccare il link ricevuto: l\'app si apre da sola sulla sfida.',
    ]} />
  );

  return (
    <SchedaProveSfide sezione="sfide" info={info} titoloInfo="Regole delle sfide">
      {/* Il solo blocco in evidenza: la sfida del giorno, verde. Il ▶ è blu pieno finché non l'hai giocata. */}
      <Carta tono="alto" className="mt-4">
        <div className="flex items-center gap-3">
          <span aria-hidden className="grid h-12 w-12 shrink-0 place-items-center rounded-[13px] bg-superficie text-alto-numero"><Icona nome="sfida-giorno" size={26} /></span>
          <DatiSfida domande={DOMANDE_SFIDA} minuti={SECONDI_SFIDA / 60} className="flex-1 justify-end" />
        </div>
        {oggi ? (
          <button type="button" aria-label={`Sfida del giorno: ${oggi.corrette} su ${oggi.totale}, tempo ${tempoBreve(oggi.secondi)}`} onClick={() => { playTapSound(); vai('sfida-risultato', { voce: oggi.id }); }}
            className="brand-premibile mt-3 flex w-full items-center gap-3 rounded-[14px] bg-superficie p-3 text-left">
            <Icona nome="stato-risposta-giusta" size={22} className="text-alto-numero" />
            <span className="text-[26px] leading-[30px] font-extrabold tabular-nums text-testo">{oggi.corrette}<span className="text-[16px] font-bold text-testo-tenue">/{oggi.totale}</span></span>
            <span className="flex-1 text-[14px] font-semibold tabular-nums text-medio-testo"><span className="inline-flex items-center gap-1"><Icona nome="tempo" size={15} />{tempoBreve(oggi.secondi)}</span></span>
            <Icona nome="avanti" size={22} className="text-testo-tenue" />
          </button>
        ) : (
          <Bottone className="mt-3" icona="studia" aria="Inizia la sfida del giorno" onClick={() => vai('sfida-gioco', { tipo: 'giorno', seme: semeDelGiorno() })} />
        )}
      </Carta>

      {/* Duello (corallo: il confronto con un altro). Se la sfida del giorno è ancora da fare il ▶ è secondario: un solo pieno per schermata. */}
      <Carta className="mt-3">
        <div className="flex items-start gap-3">
          <IconaTono tono="basso" lato={48} className="rounded-[13px]"><Icona nome="sfide" size={26} /></IconaTono>
          <Campo id="nome-sfida" aria="Il tuo nome" valore={nome} onCambia={v => { setNome(v); setErroreNome(null); }}
            segnaposto="Il tuo nome" maxLength={NOME_MAX} errore={erroreNome} onInvio={iniziaDuello} className="flex-1" />
          <Bottone icona="studia" aria="Inizia il duello" variante={oggi ? 'primario' : 'secondario'} className="w-14 shrink-0 px-0" onClick={iniziaDuello} />
        </div>
      </Carta>

      {/* Il link ricevuto da un amico */}
      <Carta className="mt-3">
        <div className="flex items-start gap-3">
          <IconaTono tono="azione" lato={48} className="rounded-[13px]"><Icona nome="incolla" size={26} /></IconaTono>
          <Campo id="link-sfida" aria="Il link della sfida" valore={link} onCambia={v => { setLink(v); setErroreLink(null); }}
            segnaposto="Incolla il link" errore={erroreLink} onInvio={apriLink} className="flex-1" />
          <Bottone icona="avanti" aria="Apri la sfida" variante="secondario" disabled={!link.trim()} className="w-14 shrink-0 px-0" onClick={apriLink} />
        </div>
      </Carta>

      <section aria-labelledby="titolo-storico" className="mt-6 flex flex-col gap-2.5">
        <h2 id="titolo-storico" className="flex items-center gap-2 text-[15.5px] leading-[20px] font-bold text-testo"><Icona nome="storico" size={20} className="text-testo-tenue" />Storico</h2>
        {voci.length === 0 ? (
          <Carta className="flex flex-col items-center py-6 text-center">
            <IconaTono tono="basso" lato={52} className="rounded-full"><Icona nome="sfide" size={26} /></IconaTono>
            <p className="mt-3 text-[16px] leading-[22px] font-bold text-testo">Nessuna sfida</p>
          </Carta>
        ) : (
          <ul className="flex flex-col gap-2">
            {voci.slice(0, 8).map(v => <RigaStorico key={v.id} voce={v} onApri={() => vai('sfida-risultato', { voce: v.id })} />)}
          </ul>
        )}
      </section>
    </SchedaProveSfide>
  );
}
