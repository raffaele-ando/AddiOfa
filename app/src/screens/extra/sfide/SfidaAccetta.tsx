// `sfida-accetta`: l'App apre questa schermata quando l'indirizzo ha `?sfida=<codice>` (o quando si incolla un link nelle Sfide).
// Il codice porta il seme delle domande, il nome e il risultato di chi sfida. Due casi:
//  - «d»: una sfida nuova → si sceglie un nome e si gioca (sfida-gioco, ruolo «sfidato»);
//  - «r»: un amico rimanda il suo risultato di un duello lanciato da te → si aggancia al tuo duello e si vede il confronto.
// Illustrazioni dal piano d'uso (docs/design/ILLUSTRAZIONI.md §3.2): la sfida da accettare ha la coppa luminosa, gli stati la loro illustrazione.
// Le regole stanno dietro la «i».
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Illustrazione } from '../../../brand/Illustrazione';
import { useExtra } from '../contesto';
import { decodificaSfida, pulisciNome, NOME_MAX } from '../../../lib/sfide/codice';
import { DOMANDE_SFIDA, SECONDI_SFIDA } from '../../../lib/sfide/seme';
import { agganciaRisposta, confronta, idVoce, tempoBreve } from '../../../lib/sfide/risultati';
import { useBancoSfide, useProfiloSfide, useStorico } from './dati';
import { FoglioInfo, PulsanteInfo, type Tono } from '../ui';
import { Bottone, Campo, Carta, DatiSfida, Fermo, PannelloEsito, Pagina, Tempo } from './comuni';
import { Regole } from './scheda';

/** Uno stato che ferma la strada: l'illustrazione dello stato (documento con la croce per link rotto e versioni diverse, clessidra per «tua sfida»),
 *  al massimo una riga corta e UN pulsante pieno (di norma «Sfide») più, se serve, un'azione migliore prima. */
function Messaggio({ titolo, testo, illustrazione, azione }: { titolo: string; testo?: string; illustrazione: string; azione?: ReactNode; tono?: Tono }) {
  const { vai, vaiHome } = useExtra();
  return (
    <Pagina titolo="Sfida" onBack={vaiHome}>
      <Fermo illustrazione={{ nome: illustrazione }} titolo={titolo} causa={testo}>
        {azione}
        <Bottone variante={azione ? 'secondario' : 'primario'} icona="sfide" onClick={() => vai('sfide')}>Vai alle sfide</Bottone>
      </Fermo>
    </Pagina>
  );
}

export default function SfidaAccetta() {
  const { params, vai } = useExtra();
  const { voci, modifica } = useStorico();
  const { profilo } = useProfiloSfide();
  const { impronta } = useBancoSfide();
  const dati = useMemo(() => decodificaSfida(params.sfida ?? ''), [params.sfida]);
  const [nome, setNome] = useState(profilo.nome ?? '');
  const [erroreNome, setErroreNome] = useState<string | null>(null);
  const [info, setInfo] = useState(false);

  // Il risultato rimandato da un amico: si aggancia (una volta, in modo idempotente) al duello lanciato da te.
  const mioDuello = dati ? voci.find(v => v.id === idVoce('duello', dati.seme, 'sfidante')) : undefined;
  const risposta = dati?.tipo === 'r' && mioDuello !== undefined;
  const agganciato = useRef(false);
  useEffect(() => {
    if (!dati || !risposta || agganciato.current) return;
    agganciato.current = true;
    modifica(prec => agganciaRisposta(prec, dati).voci);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dati, risposta]);

  if (!dati) {
    return <Messaggio illustrazione="documento-errore" titolo="Link non valido" testo="Chiedi a chi te l'ha mandato di rimandarlo." />;
  }
  if (dati.banco !== impronta) {
    return <Messaggio tono="medio" illustrazione="documento-errore" titolo="Versioni diverse" testo="Chi ti sfida ha una versione diversa: aggiorna la pagina e riprova." />;
  }

  // ---- Il risultato di un amico a una tua sfida
  if (dati.tipo === 'r' && mioDuello) {
    const io = mioDuello;
    const altro = { corrette: dati.corrette, totale: dati.totale, secondi: dati.secondi };
    const esito = confronta(io, altro);
    return (
      <Pagina titolo={`${dati.nome} ha giocato`} onBack={() => vai('sfide')}>
        <PannelloEsito className="mt-5" esito={esito} nomeMio={io.nome ?? 'Tu'} io={io} nomeAltro={dati.nome} altro={altro} />
        <div className="mt-4 flex gap-2">
          <Bottone icona="correzioni" onClick={() => vai('sfida-risultato', { voce: mioDuello.id })}>Rivedi le risposte</Bottone>
          <Bottone variante="secondario" icona="amici" className="w-auto shrink-0 px-4" onClick={() => vai('amici')}>Amici</Bottone>
        </div>
      </Pagina>
    );
  }

  // ---- Una sfida da giocare (anche un «risultato» di cui qui non c'è il duello: si può giocare le stesse domande)
  const giaGiocata = voci.find(v => v.id === idVoce('duello', dati.seme, 'sfidato'));
  const mioSuo = dati.id === profilo.id;
  const proprio = voci.find(v => v.id === idVoce('duello', dati.seme, 'sfidante'));

  if (mioSuo || (proprio && dati.tipo === 'd')) {
    return <Messaggio tono="azione" illustrazione="attesa" titolo="Questa è una tua sfida" testo="L'hai creata tu: la gioca chi la riceve."
      azione={proprio && <Bottone icona="correzioni" onClick={() => vai('sfida-risultato', { voce: proprio.id })}>Vedi il tuo risultato</Bottone>} />;
  }
  if (giaGiocata) {
    return (
      <Pagina titolo="Hai già giocato" onBack={() => vai('sfide')}>
        <Carta tono="alto" className="mt-5 flex items-center gap-4">
          <div className="min-w-0 flex-1" role="status" aria-label={`${giaGiocata.corrette} su ${giaGiocata.totale}, tempo ${tempoBreve(giaGiocata.secondi)}`}>
            <p aria-hidden className="text-[34px] leading-[38px] font-extrabold tabular-nums text-testo">{giaGiocata.corrette}<span className="text-[18px] font-bold text-testo-tenue">/{giaGiocata.totale}</span></p>
            <p aria-hidden className="mt-0.5 text-[14px] font-semibold text-testo-tenue"><Tempo secondi={giaGiocata.secondi} /></p>
          </div>
          <Illustrazione nome="documento-completato" lato={84} />
        </Carta>
        <div className="mt-4">
          <Bottone icona="correzioni" onClick={() => vai('sfida-risultato', { voce: giaGiocata.id })}>Vedi il risultato</Bottone>
        </div>
      </Pagina>
    );
  }

  const gioca = () => {
    const n = pulisciNome(nome);
    if (!n) { setErroreNome('Scrivi il tuo nome.'); return; }
    vai('sfida-gioco', { tipo: 'duello', ruolo: 'sfidato', seme: dati.seme, nome: n, codice: params.sfida ?? '' });
  };

  const regole = (
    <Regole righe={[
      `Le stesse ${DOMANDE_SFIDA} domande per tutti e due.`,
      `${SECONDI_SFIDA / 60} minuti, senza correzioni finché non consegni.`,
      'Vince chi dà più risposte giuste; a parità, il più veloce.',
      `${dati.nome} ha già giocato: il suo risultato lo vedi alla fine, a confronto con il tuo.`,
      `Nessun account e nessun server: il link contiene solo il nome di ${dati.nome}, il suo risultato e le domande. Alla fine potrai rimandargli il tuo con un altro link.`,
    ]} />
  );

  return (
    <div className="relative h-full">
      <Pagina titolo={`${dati.nome} ti sfida`} onBack={() => vai('sfide')} destra={<PulsanteInfo onClick={() => setInfo(true)} etichetta="Regole" />}>
        <div className="mt-3 flex justify-center">
          <Illustrazione kit="kit-luminoso" nome="successo" lato={128} />
        </div>
        <DatiSfida domande={DOMANDE_SFIDA} minuti={SECONDI_SFIDA / 60} className="mt-3 text-center" />
        <Carta className="mt-5 flex flex-col gap-3">
          <Campo id="nome-accetta" etichetta="Il tuo nome" valore={nome} onCambia={v => { setNome(v); setErroreNome(null); }}
            segnaposto="Come ti chiami?" maxLength={NOME_MAX} errore={erroreNome} onInvio={gioca} />
          <Bottone icona="studia" onClick={gioca}>Accetta la sfida</Bottone>
        </Carta>
      </Pagina>
      <FoglioInfo aperto={info} onChiudi={() => setInfo(false)} titolo="Regole">{regole}</FoglioInfo>
    </div>
  );
}
