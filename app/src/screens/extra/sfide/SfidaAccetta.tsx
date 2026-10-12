// `sfida-accetta`: l'App apre questa schermata quando l'indirizzo ha `?sfida=<codice>` (o quando si incolla un link nelle Sfide).
// Il codice porta il seme delle domande, il nome e il risultato di chi sfida. Due casi:
//  - «d»: una sfida nuova → si sceglie un nome e si gioca (sfida-gioco, ruolo «sfidato»);
//  - «r»: un amico rimanda il suo risultato di un duello lanciato da te → si aggancia al tuo duello e si vede il confronto.
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Swords } from 'lucide-react';
import { useExtra } from '../contesto';
import { IllustrazioneAnimata } from '../../../brand/IllustrazioneAnimata';
import { decodificaSfida, pulisciNome, NOME_MAX } from '../../../lib/sfide/codice';
import { SECONDI_SFIDA } from '../../../lib/sfide/seme';
import { agganciaRisposta, confronta, fraseEsito, idVoce, tempoBreve } from '../../../lib/sfide/risultati';
import { useBancoSfide, useProfiloSfide, useStorico } from './dati';
import { Bottone, Campo, Carta, Pagina } from './comuni';
import { cn } from '../../../lib/utils';

function Messaggio({ titolo, testo, azione }: { titolo: string; testo: string; azione?: ReactNode }) {
  const { vai, vaiHome } = useExtra();
  return (
    <Pagina titolo={titolo} onBack={vaiHome}>
      <Carta className="mt-5" tono="medio"><p role="alert" className="text-[14.5px] leading-[21px] text-testo">{testo}</p></Carta>
      <div className="mt-4 flex flex-col gap-2">
        {azione}
        <Bottone variante="secondario" onClick={() => vai('sfide')}>Vai alle sfide</Bottone>
      </div>
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
    return <Messaggio titolo="Link non valido" testo="Questo link di sfida non è valido: è incompleto o è stato modificato. Chiedi al tuo amico di rimandarlo, oppure copialo di nuovo per intero." />;
  }
  if (dati.banco !== impronta) {
    return <Messaggio titolo="Domande diverse" testo={`${dati.nome} ha creato questa sfida con una versione dell'app che ha domande diverse dalle tue: giocandola il confronto non sarebbe valido. Aggiorna l'app (o riapri il link da quella più recente) e riprova.`} />;
  }

  // ---- Il risultato di un amico a una tua sfida
  if (dati.tipo === 'r' && mioDuello) {
    const io = mioDuello;
    const altro = { corrette: dati.corrette, totale: dati.totale, secondi: dati.secondi };
    const esito = confronta(io, altro);
    return (
      <Pagina titolo={`${dati.nome} ha giocato`} sottotitolo="Ha rimandato il suo risultato alla tua sfida." onBack={() => vai('sfide')}>
        <Carta className="mt-5" tono={esito === 'vinto' ? 'alto' : 'neutro'}>
          <p role="status" className="text-center text-[20px] font-extrabold text-testo">{fraseEsito(esito, dati.nome)}</p>
          <div className="mt-3 flex gap-2.5 text-center">
            {[[io.nome ?? 'Tu', io.corrette, io.totale, io.secondi], [dati.nome, dati.corrette, dati.totale, dati.secondi]].map(([n, c, t, s], i) => (
              <div key={i} className={cn('min-w-0 flex-1 rounded-[14px] p-3', i === 0 ? 'bg-azione-tinta' : 'bg-superficie')}>
                <p className="truncate text-[13px] font-bold text-testo-tenue">{n}</p>
                <p className="mt-1 text-[30px] leading-[34px] font-extrabold tabular-nums text-testo">{c}<span className="text-[16px] font-bold text-testo-tenue">/{t}</span></p>
                <p className="mt-1 text-[13px] font-semibold tabular-nums text-testo-tenue">{tempoBreve(s as number)}</p>
              </div>
            ))}
          </div>
        </Carta>
        <div className="mt-4 flex flex-col gap-2">
          <Bottone onClick={() => vai('sfida-risultato', { voce: mioDuello.id })}>Vedi il tuo risultato e le risposte</Bottone>
          <Bottone variante="secondario" onClick={() => vai('amici')}>Vai agli amici</Bottone>
        </div>
      </Pagina>
    );
  }

  // ---- Una sfida da giocare (anche un «risultato» di cui qui non c'è il duello: si può giocare le stesse domande)
  const giaGiocata = voci.find(v => v.id === idVoce('duello', dati.seme, 'sfidato'));
  const mioSuo = dati.id === profilo.id;
  const proprio = voci.find(v => v.id === idVoce('duello', dati.seme, 'sfidante'));

  if (mioSuo || (proprio && dati.tipo === 'd')) {
    return <Messaggio titolo="È la tua sfida" testo="Questo link l'hai creato tu: va mandato a un amico, non aperto da te. Quando lui ti rimanda il suo risultato, aprilo qui." azione={proprio && <Bottone onClick={() => vai('sfida-risultato', { voce: proprio.id })}>Vedi la tua partita</Bottone>} />;
  }
  if (giaGiocata) {
    return (
      <Pagina titolo="Hai già giocato" sottotitolo={`La sfida di ${dati.nome}.`} onBack={() => vai('sfide')}>
        <Carta className="mt-5"><p className="text-[14.5px] leading-[21px] text-testo">Hai già giocato queste domande: {giaGiocata.corrette}/{giaGiocata.totale} in {tempoBreve(giaGiocata.secondi)}. Ogni sfida si gioca una volta sola.</p></Carta>
        <div className="mt-4 flex flex-col gap-2">
          <Bottone onClick={() => vai('sfida-risultato', { voce: giaGiocata.id })}>Vedi il confronto</Bottone>
          <Bottone variante="secondario" onClick={() => vai('sfide')}>Vai alle sfide</Bottone>
        </div>
      </Pagina>
    );
  }

  const gioca = () => {
    const n = pulisciNome(nome);
    if (!n) { setErroreNome('Scrivi il nome con cui ti vedrà ' + dati.nome + '.'); return; }
    vai('sfida-gioco', { tipo: 'duello', ruolo: 'sfidato', seme: dati.seme, nome: n, codice: params.sfida ?? '' });
  };

  return (
    <Pagina titolo={`${dati.nome} ti sfida`} sottotitolo="10 domande d'inglese, le stesse per tutti e due." onBack={() => vai('sfide')}
      destra={<IllustrazioneAnimata nome="quiz-test" lato={84} />}>
      <Carta className="mt-5" tono="azione">
        <ul className="flex flex-col gap-1.5 text-[14.5px] leading-[20px] text-testo">
          <li><strong>10 domande</strong> in {SECONDI_SFIDA / 60} minuti, senza feedback finché non consegni.</li>
          <li>{dati.nome} ha già giocato: il suo risultato lo vedi alla fine, a confronto con il tuo.</li>
          <li>Vince chi dà più risposte giuste; a parità, chi è più veloce.</li>
        </ul>
      </Carta>
      <div className="mt-5 flex flex-col gap-3">
        <Campo id="nome-accetta" etichetta={`Il nome con cui ti vedrà ${dati.nome}`} valore={nome} onCambia={v => { setNome(v); setErroreNome(null); }}
          segnaposto="Il tuo nome" maxLength={NOME_MAX} errore={erroreNome} onInvio={gioca} />
        <Bottone onClick={gioca}><Swords size={18} aria-hidden /> Accetta e gioca</Bottone>
      </div>
      <p className="mt-4 text-[12.5px] leading-[18px] text-testo-tenue">
        Nessun account e nessun server: il link contiene solo il nome di {dati.nome}, il suo risultato e le domande. Alla fine potrai rimandargli il tuo con un altro link.
      </p>
    </Pagina>
  );
}
