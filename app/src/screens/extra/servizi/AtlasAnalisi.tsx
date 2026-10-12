// «Analisi del livello» (concept 30/34 «Risultati ATLAS», 36 radar, 21/25 «Fattori»): calcolata SUI DATI VERI dell'utente.
// Niente confronto con altri studenti, niente «intelligenza artificiale»: sono conti sulle sue risposte, spiegati qui sotto.
import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, GraduationCap, Radar as IconaRadar } from 'lucide-react';
import { useExtra } from '../contesto';
import { BottoneAzione, BottoneSecondario, Disegno, Nota, Pagina, Sezione } from './componenti';
import Radar from './Radar';
import { StimaSezione } from '../../../components/home/Stima';
import { Barra, Carta, RigaIntervallo, coloreValore, REGOLA_IMPARATA } from '../../../components/home/comune';
import { formatIntervallo, formatProbabilita } from '../../../lib/diagnostic';
import { REAL_TEST_PASS_MARK, REAL_TEST_QUESTIONS } from '../../../config/offer';
import { ECOSYSTEM } from '../../../config/ecosystem';
import { MIN_RISPOSTE } from '../../../components/home/stima';
import { analizzaLivello, argomentiRadar, descriviFonte, MIN_RISPOSTE_ARGOMENTO, SOGLIA_DA_MIGLIORARE, type ArgomentoAnalisi } from '../../../lib/servizi/analisi';

function RigaArgomento({ a, onTeoria }: { a: ArgomentoAnalisi; onTeoria?: () => void }) {
  const dato = a.percento !== null;
  const corpo = (
    <>
      <span className="flex items-center justify-between gap-2">
        <span className="min-w-0 text-[14px] leading-[19px] font-semibold text-testo">{a.titolo}</span>
        <span className={`shrink-0 text-[13px] tabular-nums ${dato ? 'font-bold text-testo' : 'text-testo-tenue'}`}>{dato ? `${a.percento}%` : '–'}</span>
      </span>
      <span className="mt-2 block"><Barra valore={dato ? a.percento! : 0} colore={dato ? coloreValore(a.percento!) : 'transparent'} alta={6} /></span>
      <span className="mt-1.5 block text-[11.5px] leading-[15px] text-testo-tenue">
        {a.livello} · {a.risposte === 0 ? 'nessuna risposta' : dato ? `${a.risposte} risposte` : `${a.risposte} ${a.risposte === 1 ? 'risposta' : 'risposte'}, ancora poche`} · {a.imparate} su {a.totaleDomande} imparate
      </span>
    </>
  );
  return onTeoria
    ? <button type="button" onClick={onTeoria} className="brand-premibile block w-full rounded-[10px] bg-superficie px-3 py-2.5 text-left" aria-label={`Apri la teoria: ${a.titolo}`}>{corpo}</button>
    : <div className="rounded-[10px] bg-superficie px-3 py-2.5">{corpo}</div>;
}

export default function AtlasAnalisi() {
  const { appState, vai, vaiHome, apriTeoria, avviaEsercizi } = useExtra();
  const an = useMemo(() => analizzaLivello(appState), [appState]);
  const [tutti, setTutti] = useState(false);
  const [come, setCome] = useState(false);
  const radar = useMemo(() => argomentiRadar(an.argomenti), [an.argomenti]);
  const { stima } = an;

  if (!an.haDati) {
    return (
      <Pagina titolo="Analisi del livello" sottotitolo="Calcolata sulle tue risposte, argomento per argomento.">
        <div className="mt-8 flex flex-col items-center text-center" role="status">
          <Disegno nome="ricerca" lato={168} />
          <h2 className="mt-4 text-[20px] leading-[26px] font-extrabold text-testo">Non c'è ancora niente da analizzare</h2>
          <p className="mt-2 text-[14.5px] leading-[21px] text-testo-tenue">
            L'analisi si basa solo sulle tue risposte, e per ora non ce ne sono. Il quiz diagnostico dura circa 3 minuti, 10 domande: ti dà la prima stima e ti dice da dove partire.
          </p>
          <div className="mt-6 flex w-full flex-col gap-2.5">
            <BottoneAzione onClick={vaiHome}>Vai alla Home per il diagnostico</BottoneAzione>
            <BottoneSecondario onClick={() => avviaEsercizi('smart')}>Oppure comincia con qualche domanda</BottoneSecondario>
          </div>
        </div>
      </Pagina>
    );
  }

  return (
    <Pagina titolo="Analisi del livello" sottotitolo="Calcolata sulle tue risposte. Nessun confronto con altri studenti.">
      {/* 1. La stima */}
      {stima ? (
        <section aria-labelledby="an-stima" className="mt-5">
          <h2 id="an-stima" className="sr-only">Probabilità stimata di superare il test</h2>
          <StimaSezione stima={stima} livello={an.livelloStima!} />
          <RigaIntervallo intervallo={stima.intervallo} className="mt-2" />
          <p className="mt-1 text-center text-[12.5px] leading-[18px] text-testo-tenue">
            Con l'80 % di credibilità la probabilità sta {formatIntervallo(stima.intervallo)}. Stima su {stima.risposte} risposte.
          </p>
        </section>
      ) : (
        <Nota className="mt-5" tono="attenzione">
          <p className="font-bold">La stima non c'è ancora</p>
          <p className="mt-0.5">La calcolano il quiz diagnostico e le simulazioni: le risposte di ripasso mostrano gli argomenti, ma non misurano il livello. Qui sotto vedi già dove stai andando bene.</p>
        </Nota>
      )}

      {/* 2. Radar */}
      <Sezione id="an-radar" titolo="Profilo per argomento">
        {radar.length > 0 ? (
          <Carta className="p-3.5">
            <Radar assi={radar.map(a => ({ nome: a.nome, valore: a.percento ?? 0 }))}
              descrizione={`Radar dell'accuratezza su ${radar.length} argomenti: ${radar.map(a => `${a.nome} ${a.percento} per cento`).join(', ')}.`} />
            <p className="mt-1 text-[12px] leading-[17px] text-testo-tenue">
              {radar.length < an.conDati ? `Gli ${radar.length} argomenti su cui hai risposto di più, tra i ${an.conDati} con dati sufficienti. ` : ''}
              La linea tratteggiata è l'{SOGLIA_DA_MIGLIORARE} %: sotto, l'argomento è da migliorare. Tutti i valori sono scritti anche nelle liste qui sotto.
            </p>
          </Carta>
        ) : (
          <Nota>
            <p>Il radar compare quando almeno 3 argomenti hanno {MIN_RISPOSTE_ARGOMENTO} o più risposte. Ora ne hai {an.conDati}. Più rispondi, più il profilo si riempie.</p>
          </Nota>
        )}
      </Sezione>

      {/* 3. Aree da migliorare */}
      <Sezione id="an-aree" titolo="Aree da migliorare">
        {an.daMigliorare.length > 0 ? (
          <>
            <p className="text-[13px] leading-[19px] text-testo-tenue">Argomenti sotto l'{SOGLIA_DA_MIGLIORARE} % di risposte esatte, dal più debole. Toccane uno per aprire la teoria.</p>
            <ul className="flex flex-col gap-[8px]">
              {an.daMigliorare.slice(0, 6).map(a => <li key={a.id}><RigaArgomento a={a} onTeoria={() => apriTeoria(a.id)} /></li>)}
            </ul>
            {an.daMigliorare.length > 6 && <p className="text-[12.5px] text-testo-tenue">Altri {an.daMigliorare.length - 6} argomenti sono nell'elenco completo.</p>}
          </>
        ) : an.conDati > 0 ? (
          <Nota tono="azione"><p>Nessun argomento con dati sufficienti è sotto l'{SOGLIA_DA_MIGLIORARE} %. Continua così e prova una simulazione per confermarlo.</p></Nota>
        ) : (
          <Nota><p>Servono almeno {MIN_RISPOSTE_ARGOMENTO} risposte su un argomento per dire se è da migliorare. Per ora non ne ha nessuno.</p></Nota>
        )}
      </Sezione>

      {/* 4. Tutti gli argomenti */}
      <Sezione id="an-tutti" titolo={`Tutti i ${an.argomenti.length} argomenti`}>
        <button type="button" onClick={() => setTutti(v => !v)} aria-expanded={tutti}
          className="brand-premibile flex w-full items-center justify-between rounded-[12px] bg-superficie-2 px-3.5 py-3 text-left text-[14.5px] font-bold text-testo">
          <span>{tutti ? 'Nascondi l\'elenco' : 'Mostra l\'elenco completo'}</span>
          {tutti ? <ChevronUp size={20} aria-hidden="true" /> : <ChevronDown size={20} aria-hidden="true" />}
        </button>
        {tutti && (
          <Carta className="p-2.5">
            <ul className="flex flex-col gap-[6px]">
              {an.argomenti.map(a => <li key={a.id}><RigaArgomento a={a} onTeoria={() => apriTeoria(a.id)} /></li>)}
            </ul>
            <p className="mt-2 px-1 text-[12px] leading-[17px] text-testo-tenue">{REGOLA_IMPARATA} La percentuale compare da {MIN_RISPOSTE_ARGOMENTO} risposte.</p>
          </Carta>
        )}
      </Sezione>

      {/* 5. Fattori */}
      <Sezione id="an-fattori" titolo="Cosa pesa sulla stima">
        <Carta className="p-3.5">
          {stima ? (
            <>
              <p className="text-[13.5px] leading-[20px] text-testo">{descriviFonte(stima)}</p>
              {stima.delta !== undefined && (
                <p className="mt-1.5 text-[13.5px] leading-[20px] text-testo">
                  Rispetto alla sola stima del diagnostico è {stima.delta > 0 ? 'salita' : 'scesa'} di {Math.abs(stima.delta)} punti percentuali.
                </p>
              )}
            </>
          ) : <p className="text-[13.5px] leading-[20px] text-testo">Senza diagnostico né simulazioni non c'è una stima, quindi niente su cui pesare.</p>}
          <p className="mt-1.5 text-[13.5px] leading-[20px] text-testo-tenue">Le sessioni di ripasso non entrano nella stima: scelgono le domande più difficili e la renderebbero troppo severa.</p>

          {an.fattori.risposteTotali === 0 ? (
            <p className="mt-3 text-[13.5px] leading-[20px] text-testo-tenue">Non hai ancora risposte di allenamento: l'accuratezza per tipo di domanda e per livello compare dopo le prime.</p>
          ) : (
            <>
          <h3 className="mt-4 text-[13.5px] font-bold text-testo">Accuratezza per tipo e per livello</h3>
          <p className="text-[12px] leading-[17px] text-testo-tenue mb-2">Tutte le tue risposte date. Sotto {MIN_RISPOSTE} risposte non si mostra la percentuale.</p>
          <ul className="grid grid-cols-1 gap-[6px]">
            {[...an.fattori.categorie, ...an.fattori.livelli].map(f => (
              <li key={f.id} className="rounded-[10px] bg-superficie px-3 py-2.5">
                <span className="flex items-center justify-between text-[14px] font-semibold text-testo">
                  <span>{f.nome}</span>
                  <span className={`tabular-nums text-[13px] ${f.percento !== null ? 'font-bold' : 'text-testo-tenue font-normal'}`}>{f.percento !== null ? `${f.percento}%` : '–'}</span>
                </span>
                <span className="mt-2 block"><Barra valore={f.percento ?? 0} colore={f.percento !== null ? coloreValore(f.percento) : 'transparent'} alta={6} /></span>
                <span className="mt-1.5 block text-[11.5px] text-testo-tenue">{f.percento !== null ? `${f.risposte} risposte` : f.risposte > 0 ? `${f.risposte} ${f.risposte === 1 ? 'risposta' : 'risposte'}, ancora poche` : 'nessuna risposta'}</span>
              </li>
            ))}
          </ul>
            </>
          )}
        </Carta>
      </Sezione>

      {/* 6. Come è cambiata */}
      {an.serie.length >= 2 && (
        <Sezione id="an-serie" titolo="Come è cambiata la stima">
          <Carta className="p-3.5">
            <ol className="flex flex-col gap-1.5">
              {an.serie.map((p, i) => (
                <li key={`${p.nome}-${i}`} className="flex items-center justify-between text-[14px] text-testo">
                  <span>{p.nome}</span>
                  <span className="font-bold tabular-nums">{formatProbabilita(p.p)}</span>
                </li>
              ))}
            </ol>
            <p className="mt-2 text-[12px] leading-[17px] text-testo-tenue">Solo stime misurate dopo il diagnostico e dopo ogni simulazione. Nessuna previsione.</p>
          </Carta>
        </Sezione>
      )}

      {/* 7. Come è calcolata */}
      <Sezione id="an-come" titolo="Come è calcolata">
        <button type="button" onClick={() => setCome(v => !v)} aria-expanded={come}
          className="brand-premibile flex w-full items-center justify-between rounded-[12px] bg-superficie-2 px-3.5 py-3 text-left text-[14.5px] font-bold text-testo">
          <span>{come ? 'Nascondi la spiegazione' : 'Leggi come funziona'}</span>
          {come ? <ChevronUp size={20} aria-hidden="true" /> : <ChevronDown size={20} aria-hidden="true" />}
        </button>
        {come && (
          <Carta className="p-3.5">
            <ul className="flex list-disc flex-col gap-2 pl-5 text-[13.5px] leading-[20px] text-testo">
              <li>È la probabilità di fare almeno {REAL_TEST_PASS_MARK} risposte esatte su {REAL_TEST_QUESTIONS}, la soglia del test di recupero.</li>
              <li>Parte da ciò che non sai ancora sulla tua accuratezza e la aggiorna con ogni risposta (modello beta-binomiale con partenza neutra). Con poche risposte l'intervallo è largo: è normale, e si stringe a ogni simulazione.</li>
              <li>Entrano le risposte del diagnostico e delle ultime 3 simulazioni. Con almeno 2 simulazioni il diagnostico esce dal calcolo, perché è più vecchio e meno preciso.</li>
              <li>Le domande lasciate senza risposta in simulazione contano come errori, perché al test valgono zero. Negli argomenti non sono errori di conoscenza.</li>
              <li>«Da migliorare» significa meno dell'{SOGLIA_DA_MIGLIORARE} % di risposte esatte con almeno {MIN_RISPOSTE_ARGOMENTO} risposte: più o meno la soglia del test.</li>
              <li>Tutto è calcolato sul tuo dispositivo, solo sulle tue risposte. {ECOSYSTEM.engineName} è il nome dell'algoritmo di ripasso: qui non c'è nessun chatbot e nessun confronto con altri studenti.</li>
              <li>È una stima, non una promessa: non dice come andrà il test vero.</li>
            </ul>
          </Carta>
        )}
      </Sezione>

      <div className="mt-6 flex flex-col gap-2.5">
        <BottoneAzione onClick={() => avviaEsercizi('weakness')} icona={<IconaRadar size={20} aria-hidden="true" />}>Allenati sui punti deboli</BottoneAzione>
        <BottoneSecondario onClick={() => apriTeoria()} icona={<GraduationCap size={20} aria-hidden="true" />}>Apri la teoria</BottoneSecondario>
        <BottoneSecondario onClick={() => vai('esplora')}>Torna a Esplora</BottoneSecondario>
      </div>
    </Pagina>
  );
}
