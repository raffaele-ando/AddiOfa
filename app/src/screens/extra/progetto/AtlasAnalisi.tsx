// «ATLAS · analisi del livello» (concept 30/34 «Risultati ATLAS», 36 radar, 21/25 «Fattori»): calcolata SUI DATI VERI dell'utente, sul suo dispositivo.
// Niente confronto con altri studenti, niente «intelligenza artificiale», nessun invio: sono conti sulle sue risposte, spiegati dietro la «i».
import { useMemo, useState } from 'react';
import { Icona } from '../../../brand/icone/Icona';
import { Illustrazione } from '../../../brand/Illustrazione';
import { useExtra } from '../contesto';
import { BottoneAzione, BottoneSecondario, Nota, Pagina, Sezione } from './comuni';
import Radar from '../servizi/Radar';
import { StimaSezione } from '../../../components/home/Stima';
import { Carta, RigaIntervallo, REGOLA_IMPARATA } from '../../../components/home/comune';
import { livelloDi, MIN_RISPOSTE } from '../../../components/home/stima';
import { BarraTono, FoglioInfo, PulsanteInfo } from '../ui';
import { SOGLIA_DA_RIPASSARE, TESTO_TONO, tonoAccuratezza } from '../servizi/tono';
import { formatIntervallo, formatProbabilita } from '../../../lib/diagnostic';
import { REAL_TEST_PASS_MARK, REAL_TEST_QUESTIONS } from '../../../config/offer';
import { ECOSYSTEM } from '../../../config/ecosystem';
import { analizzaLivello, argomentiRadar, descriviFonte, MIN_RISPOSTE_ARGOMENTO, SOGLIA_DA_MIGLIORARE, type ArgomentoAnalisi } from '../../../lib/servizi/analisi';

function RigaArgomento({ a, onTeoria }: { a: ArgomentoAnalisi; onTeoria?: () => void }) {
  const dato = a.percento !== null;
  const tono = tonoAccuratezza(a.percento);
  const corpo = (
    <>
      <span className="flex items-center justify-between gap-2">
        <span data-testo-ok className="min-w-0 text-[14px] leading-[19px] font-semibold text-testo">{a.titolo}</span>
        <span className={`shrink-0 text-[13px] tabular-nums ${dato ? 'font-bold' : ''} ${TESTO_TONO[tono ?? 'nessuno']}`}>{dato ? `${a.percento}%` : '–'}</span>
      </span>
      <span className="mt-2 block"><BarraTono valore={dato ? a.percento! : 0} tono={tono ?? 'azione'} className="h-1.5" /></span>
      <span data-testo-ok className="mt-1.5 block text-[11.5px] leading-[15px] text-testo-tenue">
        {a.livello} · {a.risposte === 0 ? 'nessuna risposta' : dato ? `${a.risposte} risposte` : `${a.risposte} ${a.risposte === 1 ? 'risposta' : 'risposte'}, ancora poche`} · {a.imparate} su {a.totaleDomande} imparate
      </span>
    </>
  );
  return onTeoria
    ? <button type="button" onClick={onTeoria} className="brand-premibile block w-full rounded-[10px] bg-superficie px-3 py-2.5 text-left" aria-label={`Apri la teoria: ${a.titolo}`}>{corpo}</button>
    : <div className="rounded-[10px] bg-superficie px-3 py-2.5">{corpo}</div>;
}

export default function AtlasAnalisi() {
  const { appState, avviaDiagnostico, apriTeoria, avviaEsercizi } = useExtra();
  const an = useMemo(() => analizzaLivello(appState), [appState]);
  const [tutti, setTutti] = useState(false);
  const [come, setCome] = useState(false);
  const radar = useMemo(() => argomentiRadar(an.argomenti), [an.argomenti]);
  const { stima } = an;
  const info = <PulsanteInfo onClick={() => setCome(true)} etichetta="Come è calcolata l'analisi" />;
  const fogliCome = (
    <FoglioInfo aperto={come} onChiudi={() => setCome(false)} titolo="Come è calcolata">
      <ul className="flex list-disc flex-col gap-2 pl-5 text-[13.5px] leading-[20px]">
        <li>È la probabilità di fare almeno {REAL_TEST_PASS_MARK} risposte esatte su {REAL_TEST_QUESTIONS}, la soglia del test di recupero.</li>
        <li>Parte da ciò che non sai ancora sulla tua accuratezza e la aggiorna con ogni risposta (modello beta-binomiale con partenza neutra). Con poche risposte l&apos;intervallo è largo: si stringe a ogni simulazione.</li>
        <li>Entrano le risposte del diagnostico e delle ultime 3 simulazioni. Con almeno 2 simulazioni il diagnostico esce dal calcolo.</li>
        <li>Le domande lasciate senza risposta in simulazione contano come errori, perché al test valgono zero. Negli argomenti non sono errori di conoscenza.</li>
        <li>«Da migliorare» significa meno dell&apos;{SOGLIA_DA_MIGLIORARE} % di risposte esatte con almeno {MIN_RISPOSTE_ARGOMENTO} risposte.</li>
        <li>Tutto è calcolato sul tuo dispositivo, solo sulle tue risposte. {ECOSYSTEM.engineName} è il nome dell&apos;algoritmo di ripasso: qui non c&apos;è nessun chatbot, nessun invio e nessun confronto con altri studenti.</li>
        <li>È una stima, non una promessa: non dice come andrà il test vero.</li>
      </ul>
    </FoglioInfo>
  );

  if (!an.haDati) {
    return (
      <Pagina titolo={ECOSYSTEM.engineName} destra={info}>
        <div className="mt-8 flex flex-col items-center text-center" role="status">
          <Illustrazione nome="ricerca-scintille" lato={150} />
          <h2 className="mt-4 text-[20px] leading-[26px] font-extrabold text-testo">Ancora nessuna risposta</h2>
          <div className="mt-6 flex w-full flex-col gap-2.5">
            <BottoneAzione onClick={avviaDiagnostico}>Diagnostico</BottoneAzione>
            <BottoneSecondario onClick={() => avviaEsercizi('smart')}>Allenati</BottoneSecondario>
          </div>
        </div>
        {fogliCome}
      </Pagina>
    );
  }

  return (
    <Pagina titolo={ECOSYSTEM.engineName} destra={info}>
      {stima ? (
        <section aria-labelledby="an-stima" className="mt-3">
          <h2 id="an-stima" data-testo-ok className="sr-only">Probabilità stimata di superare il test</h2>
          {/* le etichette del misuratore e la riga del punteggio sono dati della stima, gli stessi della Home */}
          <div data-testo-ok>
            <StimaSezione stima={stima} livello={an.livelloStima!} />
            <RigaIntervallo intervallo={stima.intervallo} className="mt-2" />
          </div>
          <p data-testo-ok className="mt-1 text-center text-[12.5px] leading-[18px] text-testo-tenue">
            All&apos;80 % di credibilità la probabilità sta {formatIntervallo(stima.intervallo)}. Stima su {stima.risposte} risposte.
          </p>
        </section>
      ) : (
        <Nota className="mt-5" tono="attenzione">
          <p data-testo-ok className="font-bold">La stima non c&apos;è ancora</p>
          <p data-testo-ok className="mt-0.5">La calcolano il diagnostico e le simulazioni. Le risposte di ripasso mostrano gli argomenti, non il livello.</p>
        </Nota>
      )}

      <Sezione id="an-radar" titolo="Profilo">
        {radar.length > 0 ? (
          <Carta className="p-3.5">
            <Radar assi={radar.map(a => ({ nome: a.nome, valore: a.percento ?? 0 }))}
              descrizione={`Radar dell'accuratezza su ${radar.length} argomenti: ${radar.map(a => `${a.nome} ${a.percento} per cento`).join(', ')}.`} />
            <ul className="mt-1 flex flex-wrap justify-center gap-x-3.5 gap-y-1 text-[12px] leading-[17px] text-testo-tenue" aria-label="Legenda dei colori">
              {([['alto', `Da ${SOGLIA_DA_MIGLIORARE} %`], ['medio', 'Da migliorare'], ['basso', `Sotto ${SOGLIA_DA_RIPASSARE} %`]] as const).map(([t, nome]) => (
                <li key={t} className="flex items-center gap-1.5"><span aria-hidden="true" className={`h-2.5 w-2.5 ${t === 'alto' ? 'rounded-full bg-alto-numero' : t === 'medio' ? 'rounded-[2px] bg-medio-numero' : 'rotate-45 rounded-[1px] bg-basso-numero'}`} />{nome}</li>
              ))}
            </ul>
            <p data-testo-ok className="mt-2 text-[12px] leading-[17px] text-testo-tenue">
              {radar.length < an.conDati ? `Gli ${radar.length} argomenti su cui hai risposto di più, tra i ${an.conDati} con dati sufficienti. ` : ''}
              La linea tratteggiata è l&apos;{SOGLIA_DA_MIGLIORARE} %. I valori sono scritti anche nelle liste qui sotto.
            </p>
          </Carta>
        ) : (
          <Nota><p data-testo-ok>Il radar compare con almeno 3 argomenti da {MIN_RISPOSTE_ARGOMENTO} risposte. Ora ne hai {an.conDati}.</p></Nota>
        )}
      </Sezione>

      <Sezione id="an-aree" titolo="Da migliorare">
        {an.daMigliorare.length > 0 ? (
          <>
            <ul className="flex flex-col gap-[8px]">
              {an.daMigliorare.slice(0, 6).map(a => <li key={a.id}><RigaArgomento a={a} onTeoria={() => apriTeoria(a.id)} /></li>)}
            </ul>
            {an.daMigliorare.length > 6 && <p data-testo-ok className="text-[12.5px] text-testo-tenue">Altri {an.daMigliorare.length - 6} argomenti sono nell&apos;elenco completo.</p>}
          </>
        ) : an.conDati > 0 ? (
          <Nota tono="riuscito"><p data-testo-ok>Nessun argomento con dati sufficienti è sotto l&apos;{SOGLIA_DA_MIGLIORARE} %.</p></Nota>
        ) : (
          <Nota><p data-testo-ok>Servono almeno {MIN_RISPOSTE_ARGOMENTO} risposte su un argomento per dire come va.</p></Nota>
        )}
      </Sezione>

      <Sezione id="an-tutti" titolo={`Tutti i ${an.argomenti.length} argomenti`}>
        <button type="button" onClick={() => setTutti(v => !v)} aria-expanded={tutti}
          className="brand-premibile flex w-full items-center justify-between rounded-[12px] bg-superficie-2 px-3.5 py-3 text-left text-[14.5px] font-bold text-testo">
          <span>{tutti ? 'Nascondi' : 'Mostra'}</span>
          <Icona nome="espandi" size={20} className={tutti ? 'rotate-180' : undefined} />
        </button>
        {tutti && (
          <Carta className="p-2.5">
            <ul className="flex flex-col gap-[6px]">
              {an.argomenti.map(a => <li key={a.id}><RigaArgomento a={a} onTeoria={() => apriTeoria(a.id)} /></li>)}
            </ul>
            <p data-testo-ok className="mt-2 px-1 text-[12px] leading-[17px] text-testo-tenue">{REGOLA_IMPARATA} La percentuale compare da {MIN_RISPOSTE_ARGOMENTO} risposte.</p>
          </Carta>
        )}
      </Sezione>

      <Sezione id="an-fattori" titolo="Cosa pesa">
        <Carta className="p-3.5">
          {stima ? (
            <>
              <p data-testo-ok className="text-[13.5px] leading-[20px] text-testo">{descriviFonte(stima)}</p>
              {stima.delta !== undefined && (
                <p data-testo-ok className="mt-1.5 text-[13.5px] leading-[20px] text-testo">
                  Rispetto alla sola stima del diagnostico è {stima.delta > 0 ? 'salita' : 'scesa'} di {Math.abs(stima.delta)} punti percentuali.
                </p>
              )}
            </>
          ) : <p data-testo-ok className="text-[13.5px] leading-[20px] text-testo">Senza diagnostico né simulazioni non c&apos;è una stima.</p>}
          <p data-testo-ok className="mt-1.5 text-[13.5px] leading-[20px] text-testo-tenue">Il ripasso non entra nella stima: sceglie le domande più difficili e la renderebbe troppo severa.</p>

          {an.fattori.risposteTotali === 0 ? (
            <p data-testo-ok className="mt-3 text-[13.5px] leading-[20px] text-testo-tenue">Non hai ancora risposte di allenamento.</p>
          ) : (
            <>
              <h3 className="mt-4 text-[13.5px] font-bold text-testo">Per tipo e livello</h3>
              <p data-testo-ok className="mb-2 text-[12px] leading-[17px] text-testo-tenue">Tutte le tue risposte date. Sotto {MIN_RISPOSTE} risposte non si mostra la percentuale.</p>
              <ul className="grid grid-cols-1 gap-[6px]">
                {[...an.fattori.categorie, ...an.fattori.livelli].map(f => (
                  <li key={f.id} className="rounded-[10px] bg-superficie px-3 py-2.5">
                    <span className="flex items-center justify-between text-[14px] font-semibold text-testo">
                      <span>{f.nome}</span>
                      <span className={`tabular-nums text-[13px] ${f.percento !== null ? `font-bold ${TESTO_TONO[tonoAccuratezza(f.percento) ?? 'nessuno']}` : 'text-testo-tenue font-normal'}`}>{f.percento !== null ? `${f.percento}%` : '–'}</span>
                    </span>
                    <span className="mt-2 block"><BarraTono valore={f.percento ?? 0} tono={tonoAccuratezza(f.percento) ?? 'azione'} className="h-1.5" /></span>
                    <span data-testo-ok className="mt-1.5 block text-[11.5px] text-testo-tenue">{f.percento !== null ? `${f.risposte} risposte` : f.risposte > 0 ? `${f.risposte} ${f.risposte === 1 ? 'risposta' : 'risposte'}, ancora poche` : 'nessuna risposta'}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Carta>
      </Sezione>

      {an.serie.length >= 2 && (
        <Sezione id="an-serie" titolo="Come cambia">
          <Carta className="p-3.5">
            <ol className="flex flex-col gap-1.5">
              {an.serie.map((p, i) => (
                <li key={`${p.nome}-${i}`} className="flex items-center justify-between text-[14px] text-testo">
                  <span data-testo-ok>{p.nome}</span>
                  <span className={`font-bold tabular-nums ${TESTO_TONO[livelloDi(p.p)]}`}>{formatProbabilita(p.p)}</span>
                </li>
              ))}
            </ol>
            <p data-testo-ok className="mt-2 text-[12px] leading-[17px] text-testo-tenue">Solo stime misurate dopo il diagnostico e dopo ogni simulazione.</p>
          </Carta>
        </Sezione>
      )}

      <div className="mt-6 flex flex-col gap-2.5">
        <BottoneAzione onClick={() => avviaEsercizi('weakness')} icona={<Icona nome="modo-punti-deboli" size={20} />}>Punti deboli</BottoneAzione>
        <BottoneSecondario onClick={() => apriTeoria()} icona={<Icona nome="teoria" size={20} />}>Teoria</BottoneSecondario>
      </div>
      {fogliCome}
    </Pagina>
  );
}
