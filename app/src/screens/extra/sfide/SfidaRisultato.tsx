// `sfida-risultato`: l'esito di una partita (risposte giuste, tempo, correzioni) e, per il duello, il confronto con l'amico
// e il foglio per condividere il link. Parametro: `voce` (l'identificativo della partita nello storico locale).
import { useState } from 'react';
import { Clock, Share2, Check, Loader2 } from 'lucide-react';
import { useExtra } from '../contesto';
import { useAccess } from '../../../access/context';
import CorrezioniComplete from '../../../components/esito/CorrezioniComplete';
import { cn } from '../../../lib/utils';
import { IllustrazioneAnimata } from '../../../brand/IllustrazioneAnimata';
import { codificaSfida, estraiCodice, linkSfida } from '../../../lib/sfide/codice';
import { confronta, fraseEsito, tempoBreve, type VoceSfida } from '../../../lib/sfide/risultati';
import { indirizzoApp, useBancoSfide, useProfiloSfide, useStorico } from './dati';
import { caricaCorrezioni, type Correzioni } from './correzioni';
import FoglioCondividi from './FoglioCondividi';
import { Bottone, Campo, Carta, Pagina, Sezione, dataLunga } from './comuni';

function Colonna({ nome, corrette, totale, secondi, evidenza }: { nome: string; corrette: number; totale: number; secondi: number; evidenza?: boolean }) {
  return (
    <div className={cn('min-w-0 flex-1 rounded-[14px] p-3 text-center', evidenza ? 'bg-azione-tinta' : 'bg-superficie')}>
      <p className="truncate text-[13px] font-bold text-testo-tenue">{nome}</p>
      <p className="mt-1 text-[30px] leading-[34px] font-extrabold tabular-nums text-testo">{corrette}<span className="text-[16px] font-bold text-testo-tenue">/{totale}</span></p>
      <p className="mt-1 inline-flex items-center gap-1 text-[13px] font-semibold tabular-nums text-testo-tenue"><Clock size={13} aria-hidden /> {tempoBreve(secondi)}</p>
    </div>
  );
}

function RivediRisposte({ voce }: { voce: VoceSfida }) {
  const { apriTeoria } = useExtra();
  const { provider } = useAccess();
  const [stato, setStato] = useState<'chiuso' | 'carico' | 'pronto' | 'errore'>('chiuso');
  const [c, setC] = useState<Correzioni | null>(null);
  const apri = async () => {
    setStato('carico');
    try {
      setC(await caricaCorrezioni(provider, voce));
      setStato('pronto');
    } catch {
      setStato('errore');
    }
  };
  if (stato === 'chiuso') return <Bottone variante="secondario" onClick={() => void apri()}>Rivedi le risposte e le spiegazioni</Bottone>;
  if (stato === 'carico') return <p role="status" className="flex items-center justify-center gap-2 py-3 text-[14px] font-semibold text-testo-tenue"><Loader2 size={16} className="animate-spin" aria-hidden /> Carico le correzioni…</p>;
  if (stato === 'errore' || !c) {
    return (
      <Carta tono="medio">
        <p role="alert" className="text-[14px] font-bold text-medio-testo">Non riesco a caricare le correzioni. Controlla la connessione e riprova.</p>
        <div className="mt-3"><Bottone variante="secondario" onClick={() => void apri()}>Riprova</Bottone></div>
      </Carta>
    );
  }
  return <CorrezioniComplete questions={c.domande} perQuestion={c.perQuestion} answers={c.risposte} onOpenTheory={id => apriTeoria(id)} />;
}

export default function SfidaRisultato() {
  const { params, indietro, vai } = useExtra();
  const { voci } = useStorico();
  const { profilo } = useProfiloSfide();
  const { impronta } = useBancoSfide();
  const [foglio, setFoglio] = useState(false);
  const [incolla, setIncolla] = useState('');
  const [erroreIncolla, setErroreIncolla] = useState<string | null>(null);

  const voce = voci.find(v => v.id === params.voce);
  if (!voce) {
    return (
      <Pagina titolo="Sfida non trovata" onBack={indietro}>
        <Carta className="mt-5"><p className="text-[14px] text-testo-tenue">Non trovo questa partita nello storico di questo dispositivo.</p></Carta>
        <div className="mt-4"><Bottone onClick={() => vai('sfide')}>Vai alle sfide</Bottone></div>
      </Pagina>
    );
  }

  const duello = voce.tipo === 'duello';
  const avv = voce.avversario;
  const esito = avv ? confronta(voce, avv) : null;
  const nomeMio = voce.nome ?? profilo.nome ?? 'Tu';
  const mio = { corrette: voce.corrette, totale: voce.totale, secondi: voce.secondi };

  // il link da condividere: se sei tu a sfidare, la sfida con il tuo risultato; se hai accettato, il tuo risultato da rimandare
  const sfidato = voce.ruolo === 'sfidato';
  const url = duello && profilo.id
    ? linkSfida(indirizzoApp(), codificaSfida({ tipo: sfidato ? 'r' : 'd', seme: voce.seme, banco: impronta, id: profilo.id, nome: nomeMio, ...mio }))
    : '';
  const testo = sfidato
    ? 'Ho giocato la tua sfida su AddiOFA. Apri il link per vedere come è andata.'
    : 'Ti sfido su AddiOFA: 10 domande d\'inglese, le stesse per tutti e due. Io ho già giocato. Riesci a battermi?';

  const apriRisposta = () => {
    const cod = estraiCodice(incolla);
    if (!cod) { setErroreIncolla('Non riconosco il link. Incolla il link intero che ti ha mandato il tuo amico.'); return; }
    vai('sfida-accetta', { sfida: cod });
  };

  return (
    <Pagina titolo={voce.tipo === 'giorno' ? 'Sfida del giorno' : 'Duello'} sottotitolo={voce.tipo === 'giorno' ? dataLunga(new Date(voce.quando)) : undefined} onBack={indietro}>
      <Carta tono="azione" className="mt-5 flex items-center gap-4">
        <IllustrazioneAnimata nome="quiz-test" lato={84} />
        <div className="min-w-0">
          <p className="text-[13px] font-bold text-testo-tenue">Il tuo risultato</p>
          <p className="text-[34px] leading-[38px] font-extrabold tabular-nums text-testo">{voce.corrette}<span className="text-[18px] font-bold text-testo-tenue"> su {voce.totale}</span></p>
          <p className="mt-0.5 inline-flex items-center gap-1.5 text-[14px] font-semibold tabular-nums text-testo-tenue"><Clock size={14} aria-hidden /> {tempoBreve(voce.secondi)} su {tempoBreve(300)}</p>
        </div>
      </Carta>

      {duello && avv && esito && (
        <Sezione id="titolo-confronto" titolo="Il confronto">
          <Carta>
            <p className={cn('mb-3 text-center text-[18px] font-extrabold', esito === 'vinto' ? 'text-alto-testo' : esito === 'perso' ? 'text-basso-testo' : 'text-testo')} role="status">
              {fraseEsito(esito, avv.nome)}
            </p>
            <div className="flex gap-2.5">
              <Colonna nome={nomeMio} {...mio} evidenza />
              <Colonna nome={avv.nome} corrette={avv.corrette} totale={avv.totale} secondi={avv.secondi} />
            </div>
            <p className="mt-3 text-[12.5px] leading-[18px] text-testo-tenue">Vince chi dà più risposte giuste; a parità, chi è stato più veloce. Il risultato dell'amico arriva dal suo link: non è verificato da nessun server.</p>
          </Carta>
        </Sezione>
      )}

      {duello && (sfidato || !avv) && (
        <Sezione id="titolo-condividi" titolo={sfidato ? `Rimanda il risultato a ${avv?.nome ?? 'chi ti ha sfidato'}` : 'Manda la sfida a un amico'}>
          {!sfidato && !avv && (
            <Carta tono="medio">
              <p className="text-[14px] leading-[20px] text-testo"><strong>In attesa dell'amico.</strong> Manda il link: gioca le tue stesse 10 domande e ti rimanda il suo risultato con un altro link. Aprilo qui sotto e vedrai il confronto.</p>
            </Carta>
          )}
          {sfidato && (
            <p className="text-[14px] leading-[20px] text-testo-tenue">Il link contiene il tuo nome e il tuo risultato: {avv?.nome ?? 'chi ti ha sfidato'} lo apre e vede il confronto. Nessun server, nessun account.</p>
          )}
          {url ? (
            <>
              <Bottone onClick={() => setFoglio(true)}><Share2 size={18} aria-hidden /> Condividi il link</Bottone>
              <FoglioCondividi aperto={foglio} onChiudi={() => setFoglio(false)} testo={testo} url={url} titolo={sfidato ? 'Rimanda il risultato' : 'Manda la sfida'} />
            </>
          ) : (
            <p className="text-[14px] text-testo-tenue">Non riesco a preparare il link su questo dispositivo.</p>
          )}
          {!sfidato && !avv && (
            <div className="mt-2 flex flex-col gap-2">
              <Campo id="incolla-risposta" etichetta="Hai ricevuto il risultato dell'amico? Incolla qui il suo link" valore={incolla}
                onCambia={v => { setIncolla(v); setErroreIncolla(null); }} segnaposto="Incolla il link" errore={erroreIncolla} onInvio={apriRisposta} />
              <Bottone variante="secondario" onClick={apriRisposta} disabled={!incolla.trim()}><Check size={16} aria-hidden /> Vedi il confronto</Bottone>
            </div>
          )}
        </Sezione>
      )}

      <Sezione id="titolo-risposte" titolo="Le risposte">
        <RivediRisposte voce={voce} />
      </Sezione>

      <div className="mt-6"><Bottone onClick={indietro}>Fatto</Bottone></div>
    </Pagina>
  );
}
