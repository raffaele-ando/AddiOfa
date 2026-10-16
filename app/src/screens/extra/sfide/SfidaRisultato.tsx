// `sfida-risultato`: l'esito di una partita (risposte giuste, tempo, correzioni) e, per il duello, il confronto con l'amico
// e il foglio per condividere il link. Parametro: `voce` (l'identificativo della partita nello storico locale).
import { useState } from 'react';
import { CalendarCheck2, Check, Hourglass, Loader2, Share2, Swords } from 'lucide-react';
import { useExtra } from '../contesto';
import { useAccess } from '../../../access/context';
import CorrezioniComplete from '../../../components/esito/CorrezioniComplete';
import { cn } from '../../../lib/utils';
import { SECONDI_SFIDA } from '../../../lib/sfide/seme';
import { IconaTono } from '../ui';
import { codificaSfida, estraiCodice, linkSfida } from '../../../lib/sfide/codice';
import { confronta, tempoBreve, type VoceSfida } from '../../../lib/sfide/risultati';
import { indirizzoApp, useBancoSfide, useProfiloSfide, useStorico } from './dati';
import { caricaCorrezioni, type Correzioni } from './correzioni';
import FoglioCondividi from './FoglioCondividi';
import { Bottone, Campo, Carta, Pagina, PannelloEsito, Sezione, Tempo, dataBreve, dataLunga } from './comuni';

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

  const nomeAvv = avv?.nome ?? 'chi ti ha sfidato';
  // Con il duello deciso, il blocco tinto è l'esito; altrimenti è il tuo risultato (verde per la sfida del giorno, neutro per il duello in attesa).
  const haEsito = duello && avv && esito;
  const condivisione = duello && (sfidato || !avv);

  return (
    <Pagina titolo={voce.tipo === 'giorno' ? 'Sfida del giorno' : 'Duello'}
      sottotitolo={voce.tipo === 'giorno' ? dataLunga(new Date(voce.quando)) : avv ? `Contro ${avv.nome} · ${dataBreve(voce.quando)}` : dataBreve(voce.quando)} onBack={indietro}>
      {haEsito ? (
        <PannelloEsito className="mt-5" esito={esito} nomeMio={nomeMio} io={mio} nomeAltro={avv.nome} altro={avv} />
      ) : (
        <Carta tono={duello ? 'neutro' : 'alto'} className="mt-5 flex items-center gap-3">
          <span aria-hidden className={cn('grid h-12 w-12 shrink-0 place-items-center rounded-[13px] bg-superficie', duello ? 'text-basso-numero' : 'text-alto-numero')}>
            {duello ? <Swords size={24} /> : <CalendarCheck2 size={24} />}
          </span>
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-testo-tenue">Il tuo risultato</p>
            <p className="text-[34px] leading-[38px] font-extrabold tabular-nums text-testo">{voce.corrette}<span className="text-[18px] font-bold text-testo-tenue"> su {voce.totale}</span></p>
            <p className="mt-0.5 text-[14px] font-semibold text-testo-tenue"><Tempo secondi={voce.secondi} /> su {tempoBreve(SECONDI_SFIDA)}</p>
          </div>
        </Carta>
      )}
      {haEsito && <p className="mt-3 text-[12.5px] leading-[18px] text-testo-tenue">Vince chi dà più risposte giuste; a parità, chi è più veloce. Il risultato dell'amico arriva dal suo link: non è verificato da nessun server.</p>}

      {condivisione && (
        <Sezione id="titolo-condividi" titolo={sfidato ? `Rimanda il risultato a ${nomeAvv}` : 'Manda la sfida a un amico'}>
          {!sfidato && !avv && (
            <Carta tono="medio" className="flex items-start gap-3">
              <IconaTono tono="medio" className="bg-superficie"><Hourglass size={20} /></IconaTono>
              <p className="text-[14px] leading-[20px] text-testo"><strong>In attesa dell'amico.</strong> Manda il link: gioca le tue stesse {voce.totale} domande e ti rimanda il suo risultato con un altro link. Aprilo qui sotto e vedrai il confronto.</p>
            </Carta>
          )}
          {sfidato && (
            <p className="text-[14px] leading-[20px] text-testo-tenue">Il link contiene il tuo nome e il tuo risultato: {nomeAvv} lo apre e vede il confronto. Nessun server, nessun account.</p>
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

      {/* Un solo pulsante pieno: se c'è il link da mandare è quello; altrimenti «Fatto». */}
      <div className="mt-6"><Bottone variante={condivisione ? 'testo' : 'primario'} onClick={indietro}>{condivisione ? 'Torna indietro' : 'Fatto'}</Bottone></div>
    </Pagina>
  );
}
