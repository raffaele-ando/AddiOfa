// `sfida-risultato`: l'esito di una partita (risposte giuste, tempo) e, per il duello, il confronto con l'amico, il pulsante per condividere
// il link e le correzioni. Solo numeri, icone e un pulsante; le regole dietro la «i». Parametro: `voce` (la partita nello storico locale).
import { useState } from 'react';
import { Icona } from '../../../brand/icone/Icona';
import { useExtra } from '../contesto';
import { useAccess } from '../../../access/context';
import CorrezioniComplete from '../../../components/esito/CorrezioniComplete';
import { SECONDI_SFIDA } from '../../../lib/sfide/seme';
import { FoglioInfo, IconaTono, PulsanteInfo } from '../ui';
import { codificaSfida, estraiCodice, linkSfida } from '../../../lib/sfide/codice';
import { confronta, tempoBreve, type VoceSfida } from '../../../lib/sfide/risultati';
import { indirizzoApp, useBancoSfide, useProfiloSfide, useStorico } from './dati';
import { caricaCorrezioni, type Correzioni } from './correzioni';
import FoglioCondividi from './FoglioCondividi';
import { Bottone, Campo, Carta, Fermo, Pagina, PannelloEsito, Tempo } from './comuni';
import { Regole } from './scheda';

function RivediRisposte({ voce, primario }: { voce: VoceSfida; primario: boolean }) {
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
  if (stato === 'chiuso') return <Bottone variante={primario ? 'primario' : 'secondario'} icona="correzioni" aria="Correzioni" onClick={() => void apri()}>Correzioni</Bottone>;
  if (stato === 'carico') return <p role="status" aria-label="Carico" className="flex items-center justify-center py-3 text-testo-tenue"><Icona nome="stato-caricamento" size={22} className="animate-spin" /></p>;
  if (stato === 'errore' || !c) {
    return (
      <Carta tono="medio" className="flex items-center gap-3">
        <Icona nome="stato-attenzione" size={22} className="shrink-0 text-medio-numero" />
        <p role="alert" className="flex-1 text-[14px] font-bold text-medio-testo">Correzioni non disponibili.</p>
        <Bottone variante="secondario" icona="riprova" aria="Riprova" className="w-14 px-0" onClick={() => void apri()} />
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
  const [info, setInfo] = useState(false);
  const [incolla, setIncolla] = useState('');
  const [erroreIncolla, setErroreIncolla] = useState<string | null>(null);

  const voce = voci.find(v => v.id === params.voce);
  if (!voce) {
    return (
      <Pagina titolo="Sfida" onBack={indietro}>
        <Fermo icona="stato-attenzione" tono="basso" testo="Sfida non trovata.">
          <Bottone icona="sfide" aria="Vai alle sfide" onClick={() => vai('sfide')} />
        </Fermo>
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
    if (!cod) { setErroreIncolla('Link non riconosciuto.'); return; }
    vai('sfida-accetta', { sfida: cod });
  };

  // Con il duello deciso, il blocco tinto è l'esito; altrimenti è il tuo risultato (verde per la sfida del giorno, neutro per il duello in attesa).
  const haEsito = duello && avv && esito;
  const condivisione = duello && (sfidato || !avv);

  const regole = (
    <Regole righe={[
      'Vince chi dà più risposte giuste; a parità, chi è più veloce.',
      'Il risultato dell\'amico arriva dal suo link: nessun server lo verifica.',
      ...(condivisione ? ['Il link contiene il tuo nome e il tuo risultato: chi lo apre vede il confronto. Nessun account, nessun server.'] : []),
      ...(!sfidato && !avv ? ['Il tuo amico gioca le tue stesse domande e ti rimanda il suo risultato con un altro link: incollalo qui per vedere il confronto.'] : []),
    ]} />
  );

  return (
    <div className="relative h-full">
      <Pagina titolo={voce.tipo === 'giorno' ? 'Sfida del giorno' : 'Duello'} onBack={indietro} destra={<PulsanteInfo onClick={() => setInfo(true)} etichetta="Regole" />}>
        {haEsito ? (
          <PannelloEsito className="mt-5" esito={esito} nomeMio={nomeMio} io={mio} nomeAltro={avv.nome} altro={avv} />
        ) : (
          <Carta tono={duello ? 'neutro' : 'alto'} className="mt-5 flex items-center gap-4">
            <span aria-hidden className={`grid h-12 w-12 shrink-0 place-items-center rounded-[13px] bg-superficie ${duello ? 'text-basso-numero' : 'text-alto-numero'}`}>
              <Icona nome={duello ? 'sfide' : 'sfida-giorno'} size={26} />
            </span>
            <div className="min-w-0" role="status" aria-label={`${voce.corrette} su ${voce.totale}, tempo ${tempoBreve(voce.secondi)} su ${tempoBreve(SECONDI_SFIDA)}`}>
              <p aria-hidden className="text-[34px] leading-[38px] font-extrabold tabular-nums text-testo">{voce.corrette}<span className="text-[18px] font-bold text-testo-tenue">/{voce.totale}</span></p>
              <p aria-hidden className="mt-0.5 text-[14px] font-semibold text-testo-tenue"><Tempo secondi={voce.secondi} /> / {tempoBreve(SECONDI_SFIDA)}</p>
            </div>
            {duello && !avv && <IconaTono tono="medio" className="ml-auto bg-superficie"><Icona nome="stato-attesa" size={22} /></IconaTono>}
          </Carta>
        )}

        {condivisione && (
          <div className="mt-4 flex flex-col gap-3">
            {url ? (
              <>
                <Bottone icona="condividi" aria={sfidato ? 'Rimanda il risultato' : 'Manda la sfida'} onClick={() => setFoglio(true)}>Condividi</Bottone>
                <FoglioCondividi aperto={foglio} onChiudi={() => setFoglio(false)} testo={testo} url={url} titolo="Condividi" />
              </>
            ) : (
              <p role="alert" className="flex items-center gap-2 text-[14px] font-bold text-basso-testo"><Icona nome="stato-attenzione" size={18} />Link non disponibile.</p>
            )}
            {!sfidato && !avv && (
              <div className="flex items-start gap-3">
                <IconaTono tono="azione" lato={48} className="rounded-[13px]"><Icona nome="incolla" size={26} /></IconaTono>
                <Campo id="incolla-risposta" aria="Il link con il risultato dell'amico" valore={incolla} onCambia={v => { setIncolla(v); setErroreIncolla(null); }}
                  segnaposto="Incolla il link" errore={erroreIncolla} onInvio={apriRisposta} className="flex-1" />
                <Bottone icona="avanti" aria="Vedi il confronto" variante="secondario" disabled={!incolla.trim()} className="w-14 shrink-0 px-0" onClick={apriRisposta} />
              </div>
            )}
          </div>
        )}

        <div className="mt-4">
          <RivediRisposte voce={voce} primario={!condivisione} />
        </div>
      </Pagina>
      <FoglioInfo aperto={info} onChiudi={() => setInfo(false)} titolo="Regole">{regole}</FoglioInfo>
    </div>
  );
}
