// «ATLAS · analisi del livello» (concept 13/30/34/36): calcolata SUI DATI VERI dell'utente, sul suo dispositivo, in tre viste a parole: Probabilità, Argomenti, Piano.
// Niente confronto con altri studenti, niente «intelligenza artificiale», nessun invio. Due basi di dati, due nomi: la STIMA nasce dal diagnostico e dalle simulazioni
// («si basa su N risposte»), gli ARGOMENTI dalle risposte di allenamento («argomenti con dati»): non si confondono più (prima «stima su 60 risposte» e «ne hai 0»).
import { useMemo, useState } from 'react';
import { Icona } from '../../../brand/icone/Icona';
import { useExtra } from '../contesto';
import { BottoneAzione, BottoneSecondario, Nota, Pagina } from './comuni';
import Radar from '../servizi/Radar';
import { StimaSezione } from '../../../components/home/Stima';
import { RigaIntervallo, REGOLA_IMPARATA, RISPOSTE_PER_STIMA_STRETTA } from '../../../components/home/comune';
import { livelloDi, MIN_RISPOSTE } from '../../../components/home/stima';
import { BarraTono, Carta, FoglioInfo, PulsanteInfo, Segmenti, Sezione } from '../ui';
import { Vuoto } from '../servizi/componenti';
import { TESTO_TONO, tonoAccuratezza } from '../servizi/tono';
import { formatProbabilita } from '../../../lib/diagnostic';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';
import { REAL_TEST_PASS_MARK, REAL_TEST_QUESTIONS } from '../../../config/offer';
import { ECOSYSTEM } from '../../../config/ecosystem';
import { analizzaLivello, argomentiRadar, descriviFonte, MIN_RISPOSTE_ARGOMENTO, SOGLIA_DA_MIGLIORARE, type ArgomentoAnalisi } from '../../../lib/servizi/analisi';

type Vista = 'probabilita' | 'argomenti' | 'piano';
/** Sotto questo numero di risposte la stima è provvisoria. */
const RISPOSTE_STIMA_SICURA = 30;

function RigaArgomento({ a, onTeoria }: { a: ArgomentoAnalisi; onTeoria: () => void }) {
  const dato = a.percento !== null;
  const tono = tonoAccuratezza(a.percento);
  return (
    <button type="button" onClick={() => { playTapSound(); onTeoria(); }} className="brand-premibile block w-full px-1 py-3 text-left" aria-label={`Apri la teoria: ${a.titolo}`}>
      <span className="flex items-baseline justify-between gap-3">
        <span data-testo-ok className="min-w-0 text-[15px] leading-[21px] font-semibold text-testo">{a.titolo}</span>
        <span className={cn('shrink-0 text-[14px] tabular-nums', dato && 'font-bold', TESTO_TONO[tono ?? 'nessuno'])}>{dato ? `${a.percento}%` : '–'}</span>
      </span>
      <span className="mt-2 block"><BarraTono valore={dato ? a.percento! : 0} tono={tono ?? 'azione'} className="h-1.5" /></span>
      <span data-testo-ok className="mt-1.5 block text-[12px] leading-[16px] text-testo-tenue">
        {a.livello} · {a.risposte === 0 ? 'nessuna risposta' : dato ? `${a.risposte} risposte` : `${a.risposte} ${a.risposte === 1 ? 'risposta' : 'risposte'}, ancora poche`} · {a.imparate} di {a.totaleDomande} imparate
      </span>
    </button>
  );
}

/** Priorità del piano: parola, forma e colore (basso/medio/alto, mai il solo colore). */
function priorita(percento: number | null): { parola: string; classe: string; icona: 'stato-attenzione' | 'trend-uguale' | 'stato-ok' } {
  if (percento === null || percento < 50) return { parola: 'Priorità alta', classe: 'bg-basso-tinta text-basso-testo dark:bg-superficie-2', icona: 'stato-attenzione' };
  if (percento < SOGLIA_DA_MIGLIORARE) return { parola: 'Priorità media', classe: 'bg-medio-tinta text-medio-testo dark:bg-superficie-2', icona: 'trend-uguale' };
  return { parola: 'Priorità bassa', classe: 'bg-alto-tinta text-alto-testo dark:bg-superficie-2', icona: 'stato-ok' };
}

export default function AtlasAnalisi() {
  const { appState, avviaDiagnostico, apriTeoria, avviaEsercizi } = useExtra();
  const an = useMemo(() => analizzaLivello(appState), [appState]);
  const [vista, setVista] = useState<Vista>('probabilita');
  const [tutti, setTutti] = useState(false);
  const [come, setCome] = useState(false);
  const radar = useMemo(() => argomentiRadar(an.argomenti), [an.argomenti]);
  const { stima } = an;
  const info = <PulsanteInfo onClick={() => setCome(true)} etichetta="Come è calcolata l'analisi" />;
  const fogliCome = (
    <FoglioInfo aperto={come} onChiudi={() => setCome(false)} titolo="Come è calcolata">
      <ul className="flex list-disc flex-col gap-2 pl-5 text-[14px] leading-[21px]">
        <li>È la probabilità di fare almeno {REAL_TEST_PASS_MARK} risposte esatte su {REAL_TEST_QUESTIONS}, la soglia del test di recupero.</li>
        <li>Parte da ciò che non sai ancora sulla tua accuratezza e la aggiorna con ogni risposta. Con poche risposte la stima è larga: si stringe a ogni simulazione.</li>
        <li>Entrano le risposte del diagnostico e delle ultime 3 simulazioni. Con almeno 2 simulazioni il diagnostico esce dal calcolo.</li>
        <li>Le domande lasciate senza risposta in simulazione contano come errori, perché al test valgono zero. Negli argomenti non sono errori di conoscenza.</li>
        <li>«Da migliorare» significa meno dell&apos;{SOGLIA_DA_MIGLIORARE}% di risposte esatte, con almeno {MIN_RISPOSTE_ARGOMENTO} risposte.</li>
        <li>Tutto è calcolato sul tuo dispositivo, solo sulle tue risposte. {ECOSYSTEM.engineName} è il nome dell&apos;algoritmo di ripasso: qui non c&apos;è nessun chatbot, nessun invio e nessun confronto con altri studenti.</li>
        <li>È una stima, non una promessa: non dice come andrà il test vero.</li>
      </ul>
    </FoglioInfo>
  );

  if (!an.haDati) {
    return (
      <Pagina titolo={ECOSYSTEM.engineName} destra={info}>
        <Vuoto className="mt-6" illustrazione="progressi-statistiche" titolo="Ancora nessuna risposta" causa="L'analisi parte dal diagnostico o dai primi esercizi."
          azioni={<>
            <BottoneAzione icona={<Icona nome="diagnostico" size={20} />} onClick={avviaDiagnostico}>Fai il diagnostico</BottoneAzione>
            <BottoneSecondario icona={<Icona nome="studia" size={20} />} onClick={() => avviaEsercizi('smart')}>Allenati</BottoneSecondario>
          </>} />
        {fogliCome}
      </Pagina>
    );
  }

  const intervallo = stima ? `tra ${Math.round(stima.intervallo.probabilita.min * 100)}% e ${Math.round(stima.intervallo.probabilita.max * 100)}%` : '';
  const dettaglio = stima && stima.risposte < RISPOSTE_PER_STIMA_STRETTA ? 'Stima poco precisa' : 'Stima abbastanza precisa';
  const deboli = an.argomenti.filter(a => a.stato !== 'nessun-dato').sort((a, b) => (a.percento ?? 101) - (b.percento ?? 101) || b.risposte - a.risposte).slice(0, 5);

  return (
    <Pagina titolo={ECOSYSTEM.engineName} destra={info}>
      <Segmenti<Vista> className="mt-3" nome="Vista" valore={vista} onScegli={setVista}
        voci={[{ id: 'probabilita', nome: 'Probabilità' }, { id: 'argomenti', nome: 'Argomenti' }, { id: 'piano', nome: 'Piano' }]} />

      {vista === 'probabilita' && (
        <>
          {stima ? (
            <Carta as="section" className="mt-4">
              {stima.risposte < RISPOSTE_STIMA_SICURA && (
                <p className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-superficie-2 px-2.5 py-[3px] text-[12px] leading-[16px] font-semibold text-testo-tenue"><Icona nome="stato-attenzione" size={13} />Stima provvisoria</p>
              )}
              <div data-testo-ok>
                <StimaSezione stima={stima} livello={an.livelloStima ?? livelloDi(stima.p)} />
                <RigaIntervallo intervallo={stima.intervallo} className="mt-2" />
              </div>
              <p data-testo-ok className="mt-2 text-center text-[13px] leading-[18px] text-testo-tenue">{dettaglio}: si basa su {stima.risposte} risposte.</p>
              <details className="group mt-2 text-center">
                <summary className="inline-flex min-h-[44px] cursor-pointer list-none items-center gap-1 text-[14px] font-bold text-azione-testo [&::-webkit-details-marker]:hidden">Dettagli<Icona nome="espandi" size={16} className="group-open:rotate-180" /></summary>
                <p data-testo-ok className="text-[13px] leading-[19px] text-testo-tenue">Intervallo di affidabilità (80%): {intervallo}.</p>
              </details>
            </Carta>
          ) : (
            <Vuoto className="mt-4" illustrazione="progressi-statistiche" titolo="La stima non c'è ancora" causa="La calcolano il diagnostico e le simulazioni."
              azioni={<BottoneAzione icona={<Icona nome="diagnostico" size={20} />} onClick={avviaDiagnostico}>Fai il diagnostico</BottoneAzione>} />
          )}

          <Sezione id="an-fattori" titolo="Come calcoliamo la stima">
            <Carta>
              <ul className="flex list-disc flex-col gap-1.5 pl-5 text-[14px] leading-[20px] text-testo marker:text-testo-tenue">
                <li data-testo-ok>{stima ? descriviFonte(stima) : 'Senza diagnostico né simulazioni non c\'è una stima.'}</li>
                <li data-testo-ok>Più rispondi, più la stima si stringe.</li>
                <li data-testo-ok>Il ripasso non entra: sceglie le domande più difficili.</li>
              </ul>
              {stima?.delta !== undefined && (
                <p data-testo-ok className="mt-2 text-[14px] leading-[20px] text-testo">Rispetto al solo diagnostico è {stima.delta > 0 ? 'salita' : 'scesa'} di {Math.abs(stima.delta)} punti percentuali.</p>
              )}
            </Carta>
          </Sezione>

          {an.serie.length >= 2 && (
            <Sezione id="an-serie" titolo="Come cambia">
              <Carta>
                <ol className="flex flex-col gap-1.5">
                  {an.serie.map((p, i) => (
                    <li key={`${p.nome}-${i}`} className="flex items-center justify-between text-[15px] text-testo">
                      <span data-testo-ok>{p.nome}</span>
                      <span className={cn('font-bold tabular-nums', TESTO_TONO[livelloDi(p.p)])}>{formatProbabilita(p.p).replace(' %', '%')}</span>
                    </li>
                  ))}
                </ol>
                <p data-testo-ok className="mt-2 text-[13px] leading-[18px] text-testo-tenue">Solo stime misurate, mai previsioni.</p>
              </Carta>
            </Sezione>
          )}
        </>
      )}

      {vista === 'argomenti' && (
        <>
          <Sezione id="an-radar" titolo="Profilo per argomento" className="mt-4">
            {radar.length > 0 ? (
              <Carta>
                <Radar assi={radar.map(a => ({ nome: a.nome, valore: a.percento ?? 0 }))}
                  descrizione={`Radar dell'accuratezza su ${radar.length} argomenti: ${radar.map(a => `${a.nome} ${a.percento} per cento`).join(', ')}.`} />
                <ul className="mt-1 flex flex-wrap justify-center gap-x-3.5 gap-y-1 text-[12px] leading-[17px] text-testo-tenue" aria-label="Legenda dei colori">
                  {([['alto', `Da ${SOGLIA_DA_MIGLIORARE}%`], ['medio', 'Da migliorare'], ['basso', 'Da ripassare']] as const).map(([t, nome]) => (
                    <li key={t} className="flex items-center gap-1.5"><span aria-hidden="true" className={`h-2.5 w-2.5 ${t === 'alto' ? 'rounded-full bg-alto-numero' : t === 'medio' ? 'rounded-[2px] bg-medio-numero' : 'rotate-45 rounded-[1px] bg-basso-numero'}`} />{nome}</li>
                  ))}
                </ul>
                <p data-testo-ok className="mt-2 text-[12px] leading-[17px] text-testo-tenue">La linea tratteggiata è l&apos;{SOGLIA_DA_MIGLIORARE}%.</p>
              </Carta>
            ) : (
              <Nota><p data-testo-ok>Compare con almeno 3 risposte in 3 argomenti. Ora: {an.conDati} {an.conDati === 1 ? 'argomento' : 'argomenti'}.</p></Nota>
            )}
          </Sezione>

          <Sezione id="an-aree" titolo="Da migliorare">
            {an.daMigliorare.length > 0 ? (
              <Carta className="px-3 py-1">
                <ul className="flex flex-col divide-y divide-linea">
                  {an.daMigliorare.slice(0, 6).map(a => <li key={a.id}><RigaArgomento a={a} onTeoria={() => apriTeoria(a.id)} /></li>)}
                </ul>
              </Carta>
            ) : an.conDati > 0 ? (
              <Nota tono="riuscito"><p data-testo-ok>Nessun argomento con dati sufficienti è sotto l&apos;{SOGLIA_DA_MIGLIORARE}%.</p></Nota>
            ) : (
              <Nota><p data-testo-ok>Servono almeno {MIN_RISPOSTE_ARGOMENTO} risposte su un argomento. Ora: nessuno.</p></Nota>
            )}
          </Sezione>

          <Sezione id="an-tutti" titolo={`Tutti i ${an.argomenti.length} argomenti`}>
            <button type="button" onClick={() => { playTapSound(); setTutti(v => !v); }} aria-expanded={tutti}
              className="brand-premibile flex min-h-[52px] w-full items-center justify-between rounded-[14px] border border-linea bg-superficie px-4 text-left text-[15px] font-bold text-testo shadow-sm dark:shadow-none">
              <span>{tutti ? 'Nascondi l\'elenco' : 'Mostra l\'elenco'}</span>
              <Icona nome="espandi" size={20} className={tutti ? 'rotate-180' : undefined} />
            </button>
            {tutti && (
              <Carta className="px-3 py-1">
                <ul className="flex flex-col divide-y divide-linea">
                  {an.argomenti.map(a => <li key={a.id}><RigaArgomento a={a} onTeoria={() => apriTeoria(a.id)} /></li>)}
                </ul>
                <p data-testo-ok className="px-1 pb-2 pt-1 text-[12px] leading-[17px] text-testo-tenue">{REGOLA_IMPARATA} La percentuale compare da {MIN_RISPOSTE_ARGOMENTO} risposte.</p>
              </Carta>
            )}
          </Sezione>

          {an.fattori.risposteTotali > 0 && (
            <Sezione id="an-tipo" titolo="Per tipo e livello">
              <Carta>
                <ul className="flex flex-col gap-3">
                  {[...an.fattori.categorie, ...an.fattori.livelli].map(f => (
                    <li key={f.id}>
                      <span className="flex items-baseline justify-between text-[15px] font-semibold text-testo">
                        <span>{f.nome}</span>
                        <span className={cn('text-[14px] tabular-nums', f.percento !== null ? `font-bold ${TESTO_TONO[tonoAccuratezza(f.percento) ?? 'nessuno']}` : 'font-normal text-testo-tenue')}>{f.percento !== null ? `${f.percento}%` : '–'}</span>
                      </span>
                      <span className="mt-1.5 block"><BarraTono valore={f.percento ?? 0} tono={tonoAccuratezza(f.percento) ?? 'azione'} className="h-1.5" /></span>
                      <span data-testo-ok className="mt-1 block text-[12px] text-testo-tenue">{f.percento !== null ? `${f.risposte} risposte` : f.risposte > 0 ? `${f.risposte} ${f.risposte === 1 ? 'risposta' : 'risposte'}, ancora poche` : 'nessuna risposta'}</span>
                    </li>
                  ))}
                </ul>
                <p data-testo-ok className="mt-3 text-[12px] leading-[17px] text-testo-tenue">Sotto {MIN_RISPOSTE} risposte non si mostra la percentuale.</p>
              </Carta>
            </Sezione>
          )}
        </>
      )}

      {vista === 'piano' && (
        <>
          {deboli.length > 0 ? (
            <>
              <Carta tono="azione" className="mt-4">
                <p data-testo-ok className="text-[15px] leading-[21px] font-semibold text-testo">Il punto più debole è {deboli[0].nome}.</p>
              </Carta>
              <Sezione id="an-piano" titolo="Da ripassare, in ordine">
                <ol className="flex flex-col gap-2.5">
                  {deboli.map((a, i) => {
                    const p = priorita(a.percento);
                    return (
                      <li key={a.id}>
                        <button type="button" onClick={() => { playTapSound(); apriTeoria(a.id); }} aria-label={`${i + 1}. ${a.titolo}: ${p.parola}. Apri la teoria`}
                          className="brand-premibile flex min-h-[64px] w-full items-center gap-3 rounded-[16px] border border-linea bg-superficie p-3 text-left shadow-sm dark:shadow-none">
                          <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-superficie-2 text-[16px] font-extrabold tabular-nums text-testo">{i + 1}</span>
                          <span className="min-w-0 flex-1">
                            <span data-testo-ok className="block text-[15px] leading-[21px] font-semibold text-testo">{a.titolo}</span>
                            <span className={cn('mt-1 inline-flex items-center gap-1 rounded-full px-2.5 py-[2px] text-[12px] leading-[16px] font-semibold', p.classe)}><Icona nome={p.icona} size={13} />{p.parola}</span>
                          </span>
                          <Icona nome="avanti" size={20} className="shrink-0 text-testo-tenue" />
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </Sezione>
            </>
          ) : (
            <Vuoto className="mt-4" illustrazione="obiettivo" titolo="Il piano non c'è ancora" causa="Compare dopo le prime risposte su un argomento." />
          )}
          <div className="mt-6 flex flex-col gap-2.5">
            <BottoneAzione onClick={() => avviaEsercizi('weakness')} icona={<Icona nome="modo-punti-deboli" size={20} />}>Allenati sui punti deboli</BottoneAzione>
            <BottoneSecondario onClick={() => apriTeoria()} icona={<Icona nome="teoria" size={20} />}>Apri la teoria</BottoneSecondario>
          </div>
        </>
      )}
      {fogliCome}
    </Pagina>
  );
}
