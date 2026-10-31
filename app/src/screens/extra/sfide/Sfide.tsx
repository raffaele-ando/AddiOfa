// `sfide` (voce «Oggi»): la sfida del giorno in evidenza (concept 06 e 22: carta verde con la coppa, «10 domande · 5 minuti» scritto), poi due righe uguali
// («Sfida un amico», «Ho ricevuto una sfida»: i campi di testo stanno in un foglio, non in pagina) e le ultime sfide. Senza server né account: nessun altro
// utente è inventato; lo storico vuoto è una riga di testo. Regole dietro la «i».
import { useState } from 'react';
import { Icona } from '../../../brand/icone/Icona';
import { useExtra } from '../contesto';
import { playTapSound } from '../../../lib/audio';
import { nuovoSeme, semeDelGiorno, DOMANDE_SFIDA, SECONDI_SFIDA } from '../../../lib/sfide/seme';
import { estraiCodice, pulisciNome, NOME_MAX } from '../../../lib/sfide/codice';
import { confronta, idVoce, tempoBreve, type VoceSfida } from '../../../lib/sfide/risultati';
import { useProfiloSfide, useStorico } from './dati';
import { FoglioInfo, GruppoRighe, Riga, Sezione } from '../ui';
import { Bottone, Campo, Carta, DatiSfida, PillolaEsito, dataBreve } from './comuni';
import { Regole, SchedaProveSfide } from './scheda';

/** Una riga dello storico: la tessera dice il tipo (verde il giorno, corallo il duello), a destra la parola dell'esito. */
function RigaStorico({ voce, onApri }: { voce: VoceSfida; onApri: () => void }) {
  const avv = voce.avversario;
  const giorno = voce.tipo === 'giorno';
  const aria = giorno ? `Sfida del giorno, ${dataBreve(voce.quando)}` : avv ? `Duello con ${avv.nome}, ${dataBreve(voce.quando)}` : `Duello in attesa, ${dataBreve(voce.quando)}`;
  return (
    <Riga icona={giorno ? 'sfida-giorno' : 'duello'} tono={giorno ? 'alto' : 'basso'} onClick={onApri}
      titolo={<span aria-label={aria} className="tabular-nums">{avv ? `${voce.corrette} – ${avv.corrette}` : `${voce.corrette}/${voce.totale}`}</span>}
      sottotitolo={<span className="tabular-nums">{giorno ? 'Sfida del giorno' : avv ? `Duello con ${avv.nome}` : 'Duello'} · {dataBreve(voce.quando)} · {tempoBreve(voce.secondi)}</span>}
      destra={(
        <span className="flex shrink-0 items-center gap-1">
          {avv ? <PillolaEsito esito={confronta(voce, avv)} /> : !giorno ? <span className="inline-flex items-center gap-1 rounded-full bg-medio-tinta px-2.5 py-[3px] text-[12px] leading-[16px] font-bold text-medio-testo dark:bg-superficie-2"><Icona nome="stato-attesa" size={13} />In attesa</span> : null}
          <Icona nome="avanti" size={20} className="text-testo-tenue" />
        </span>
      )} />
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
  const [foglio, setFoglio] = useState<null | 'amico' | 'link'>(null);

  const oggi = voci.find(v => v.id === idVoce('giorno', semeDelGiorno(), 'solo'));

  const iniziaDuello = () => {
    const n = pulisciNome(nome);
    if (!n) { setErroreNome('Scrivi il tuo nome.'); return; }
    setFoglio(null);
    vai('sfida-gioco', { tipo: 'duello', ruolo: 'sfidante', seme: nuovoSeme(), nome: n });
  };
  const apriLink = () => {
    const c = estraiCodice(link);
    if (!c) { setErroreLink('Link non riconosciuto.'); return; }
    setFoglio(null);
    vai('sfida-accetta', { sfida: c });
  };

  const info = (
    <Regole righe={[
      `${DOMANDE_SFIDA} domande, ${SECONDI_SFIDA / 60} minuti, senza correzioni finché non consegni.`,
      'Sfida del giorno: le stesse domande per tutti, una al giorno.',
      'Sfida un amico: giochi tu, mandi il link a un amico, gioca le stesse domande e vedete chi ha vinto.',
      'Vince chi dà più risposte giuste; a parità, il più veloce.',
      'Nessun account e nessun server: il link contiene solo il tuo nome, le domande e il tuo risultato. Il risultato dell\'amico arriva dal suo link e non è verificato.',
      'Di solito basta toccare il link ricevuto: l\'app si apre da sola sulla sfida.',
    ]} />
  );

  return (
    <SchedaProveSfide sezione="sfide" info={info} titoloInfo="Regole delle sfide">
      {/* La scheda in evidenza (concept 06.1): la sfida del giorno, in verde, con la coppa. Il pulsante pieno è «Gioca» finché non l'hai giocata. */}
      <Carta tono="alto" className="mt-4">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="text-[22px] leading-[28px] font-extrabold tracking-[-0.01em] text-testo">Sfida del giorno</h2>
            <DatiSfida domande={DOMANDE_SFIDA} minuti={SECONDI_SFIDA / 60} className="mt-1" />
            <p data-testo-ok className="mt-0.5 text-[13px] leading-[18px] text-testo-tenue">Le stesse domande per tutti, ogni giorno.</p>
          </div>
        </div>
        {oggi ? (
          <button type="button" aria-label={`Sfida del giorno: ${oggi.corrette} su ${oggi.totale}, tempo ${tempoBreve(oggi.secondi)}`} onClick={() => { playTapSound(); vai('sfida-risultato', { voce: oggi.id }); }}
            className="brand-premibile mt-4 flex w-full items-center gap-3 rounded-[14px] border border-linea bg-superficie p-3 text-left">
            <Icona nome="stato-ok" size={22} className="text-alto-numero" />
            <span className="text-[26px] leading-[30px] font-extrabold tabular-nums text-testo">{oggi.corrette}<span className="text-[16px] font-bold text-testo-tenue">/{oggi.totale}</span></span>
            <span className="flex-1 text-[14px] font-semibold tabular-nums text-medio-testo"><span className="inline-flex items-center gap-1"><Icona nome="tempo" size={15} />{tempoBreve(oggi.secondi)}</span></span>
            <span className="text-[13px] font-semibold text-testo-tenue">La prossima domani</span>
            <Icona nome="avanti" size={20} className="text-testo-tenue" />
          </button>
        ) : (
          <Bottone className="mt-4" icona="sfida-giorno" onClick={() => vai('sfida-gioco', { tipo: 'giorno', seme: semeDelGiorno() })}>Gioca la sfida</Bottone>
        )}
      </Carta>

      {/* Due righe uguali: i campi di testo si aprono in un foglio */}
      <div className="mt-3">
        <GruppoRighe etichetta="Sfide con gli amici">
          <Riga icona="duello" tono="basso" titolo="Sfida un amico" sottotitolo={`Un duello da ${DOMANDE_SFIDA} domande: gli mandi un link.`} onClick={() => setFoglio('amico')} />
          <Riga icona="incolla" tono="azione" titolo="Ho ricevuto una sfida" sottotitolo="Incolla il link per accettarla." onClick={() => setFoglio('link')} />
        </GruppoRighe>
      </div>

      <Sezione id="titolo-storico" titolo="Ultime sfide">
        {voci.length === 0 ? (
          <p data-testo-ok className="text-[15px] leading-[21px] text-testo-tenue">Non hai ancora giocato sfide.</p>
        ) : (
          <GruppoRighe etichetta="Ultime sfide">
            {voci.slice(0, 8).map(v => <RigaStorico key={v.id} voce={v} onApri={() => vai('sfida-risultato', { voce: v.id })} />)}
          </GruppoRighe>
        )}
      </Sezione>

      <FoglioInfo aperto={foglio === 'amico'} onChiudi={() => setFoglio(null)} titolo="Sfida un amico">
        <p data-testo-ok className="text-testo-tenue">Crea un link e mandalo a chi vuoi sfidare.</p>
        <Campo className="mt-4" id="nome-sfida" etichetta="Il tuo nome" valore={nome} onCambia={v => { setNome(v); setErroreNome(null); }}
          segnaposto="Come ti chiami?" maxLength={NOME_MAX} errore={erroreNome} onInvio={iniziaDuello} />
        <Bottone className="mt-4" icona="crea-link" onClick={iniziaDuello}>Crea link</Bottone>
      </FoglioInfo>
      <FoglioInfo aperto={foglio === 'link'} onChiudi={() => setFoglio(null)} titolo="Ho ricevuto una sfida">
        <Campo id="link-sfida" etichetta="Il link della sfida" valore={link} onCambia={v => { setLink(v); setErroreLink(null); }}
          segnaposto="Incolla qui il link" errore={erroreLink} onInvio={apriLink} />
        <Bottone className="mt-4" icona="avanti" disabled={!link.trim()} onClick={apriLink}>Apri la sfida</Bottone>
      </FoglioInfo>
    </SchedaProveSfide>
  );
}

