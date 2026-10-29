import { useMemo } from 'react';
import { Icona } from '../../../brand/icone/Icona';
import { Disegno } from '../servizi/componenti';
import { playTapSound } from '../../../lib/audio';
import { nomeVisibile } from '../../../lib/profilo/dati';
import { avanzamentoGiornaliero, avanzamentoStima, giorniMancanti, normalizzaObiettivi, OBIETTIVI_INIZIALI, type ObiettiviDati } from '../../../lib/profilo/obiettivi';
import { livelloAttuale, SOGLIA_LIVELLO } from '../../../lib/profilo/livello';
import { DOMANDE_TEST, SOGLIA_TEST } from '../../../lib/profilo/numeri';
import { descriviInvio } from '../../../lib/progetto/coda';
import { leggiProgetto } from '../../../lib/progetto/profilo';
import { AVVERTENZA_INDIPENDENZA, LEGAL_TABS } from '../../../legal';
import { ICONE_LEGALI } from '../../Footer';
import { SCHERMATE } from '../registro';
import { BarraTono, Carta, GruppoRighe, IconaTono, Riga, Sezione } from '../ui';
import { useExtra, useExtraDati } from '../contesto';
import { useInvio } from '../progetto/hooks';
import { Avatar, Pagina, arteBadge, badgeInVista, useBadge, useBanco, useNumeri, useOggi, useProfilo } from './componenti';

/** Una riga della card dei progressi: nome, valore a destra, barra. */
function RigaAvanzamento({ nome, valore, quota, tono }: { nome: string; valore: string; quota: number; tono: 'alto' | 'viola' }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[15px] leading-[21px] font-semibold text-testo">{nome}</span>
        <span className="text-[14px] leading-[20px] font-semibold tabular-nums text-testo-tenue">{valore}</span>
      </div>
      <BarraTono className="mt-1.5 h-2" tono={tono} valore={quota * 100} />
    </div>
  );
}

/**
 * Profilo come cruscotto (concept 22 e 06, revisione 18/10): chi sei, la scheda Project ID, quattro numeri veri, i progressi, l'obiettivo e i badge,
 * ognuno con il titolo a sinistra e «Vedi tutti» a destra; poi Community, Aiuto e Informazioni. Con il profilo vuoto non si mostrano trattini
 * né frazioni senza nome: si dice cosa fare. I numeri vengono da lib/profilo/numeri.ts, gli stessi di Progressi, Obiettivi e NOI.
 */
export default function Profilo() {
  const { appState, vai, indietro, apriImpostazioni, apriLanding, apriLegale, avviaDiagnostico } = useExtra();
  const { profilo } = useProfilo();
  const banco = useBanco();
  const badge = useBadge();
  const oggi = useOggi();
  const n = useNumeri();
  const invio = useInvio();
  const [grezzi] = useExtraDati<ObiettiviDati>('obiettivi', OBIETTIVI_INIZIALI);
  const ob = useMemo(() => normalizzaObiettivi(grezzi), [grezzi]);

  const { profilo: iscrizione, collegamento } = leggiProgetto(appState);
  const livello = useMemo(() => livelloAttuale(appState.stats, banco), [appState.stats, banco]);
  const prossimo = livello.prossimo;
  const necessarie = prossimo ? Math.ceil(SOGLIA_LIVELLO * prossimo.totale - 1e-9) : 0;
  const av = avanzamentoStima(n.stima?.p, ob.stimaTarget);
  const giorno = useMemo(() => avanzamentoGiornaliero(appState, oggi, ob.minutiGiorno), [appState, oggi, ob.minutiGiorno]);
  const mancano = giorniMancanti(ob.dataTest, oggi);
  const ottenuti = badge.filter(b => b.sbloccato).length;
  const inVista = useMemo(() => badgeInVista(badge, 5), [badge]);
  const senzaDati = n.imparate === 0 && n.simulazioni === 0 && n.probabilita === null;
  const senzaNome = !profilo.nome;

  // Project ID: cosa c'è davvero su questo dispositivo, in una riga
  const sInvio = descriviInvio(invio, Date.now());
  const idValore = collegamento?.handle ? `@${collegamento.handle}` : iscrizione ? 'Iscrizione salvata' : 'Non ancora creato';
  const idStato = collegamento ? 'Collegato' : iscrizione ? sInvio.titolo : 'Completa l\'iscrizione';

  return (
    <Pagina titolo="Profilo" indietro={indietro} destra={
      <button type="button" onClick={() => { playTapSound(); apriImpostazioni(); }} aria-label="Impostazioni"
        className="brand-premibile grid h-11 w-11 place-items-center rounded-full border border-linea bg-superficie text-testo shadow-sm dark:shadow-none">
        <Icona nome="impostazioni" size={22} />
      </button>
    }>
      {/* identità: tutta la card apre la modifica */}
      <button type="button" onClick={() => { playTapSound(); vai('profilo-modifica'); }} aria-label="Modifica il profilo"
        className="brand-premibile mt-3 flex w-full items-center gap-4 rounded-[16px] border border-linea bg-superficie p-4 text-left shadow-sm dark:shadow-none">
        <Avatar profilo={profilo} lato={72} />
        <span className="min-w-0 flex-1">
          <span className="line-clamp-2 break-words text-[22px] leading-[27px] font-extrabold text-testo">{senzaNome ? 'Aggiungi il tuo nome' : nomeVisibile(profilo)}</span>
          <span data-testo-ok className="mt-0.5 line-clamp-2 text-[14px] leading-[20px] text-testo-tenue">
            {profilo.corso || (senzaNome ? 'e il corso, per personalizzare l\'app' : 'Aggiungi il corso di studi')}
          </span>
        </span>
        <Icona nome="avanti" size={22} className="shrink-0 text-testo-tenue" />
      </button>

      {/* scheda Project ID */}
      <Carta tono="azione" className="mt-3 p-0">
        <button type="button" onClick={() => { playTapSound(); vai('projectid'); }} aria-label="Apri Project ID"
          className="brand-premibile flex min-h-[64px] w-full items-center gap-3 rounded-[16px] px-4 py-3 text-left">
          <IconaTono tono="azione" lato={40} className="bg-superficie dark:bg-superficie-2"><Icona nome="projectid" size={22} /></IconaTono>
          <span className="min-w-0 flex-1">
            <span className="block text-[12px] leading-[16px] font-semibold text-testo-tenue">Project ID</span>
            <span className="block truncate text-[16px] leading-[22px] font-bold text-testo">{idValore}</span>
            <span className="block truncate text-[13px] leading-[18px] text-testo-tenue">{idStato}</span>
          </span>
          <Icona nome="avanti" size={20} className="shrink-0 text-testo-tenue" />
        </button>
      </Carta>

      {/* quattro numeri veri */}
      <Carta className="mt-3 px-2 py-3.5">
        <dl className="flex divide-x divide-linea" aria-label="I tuoi numeri">
          {[
            { v: n.probabilita !== null ? `${n.probabilita}%` : '–', e: 'probabilità' },
            { v: String(n.imparate), e: 'domande imparate' },
            { v: n.migliorSimulazione !== null ? `${n.migliorSimulazione}/${DOMANDE_TEST}` : '–', e: 'miglior simulazione' },
            { v: `${ottenuti}/${badge.length}`, e: 'badge' },
          ].map(x => (
            <div key={x.e} className="min-w-0 flex-1 px-1 text-center">
              <dd className="text-[22px] leading-[28px] font-extrabold tabular-nums text-testo">{x.v}</dd>
              <dt className="mt-0.5 text-[12px] leading-[16px] font-medium text-testo-tenue">{x.e}</dt>
            </div>
          ))}
        </dl>
        {senzaDati && <p data-testo-ok className="mt-3 border-t border-linea px-2 pt-3 text-center text-[13px] leading-[18px] text-testo-tenue">Rispondi a qualche domanda e qui compaiono i tuoi numeri.</p>}
      </Carta>

      <Sezione id="pr-progressi" titolo="I tuoi progressi" azione={{ testo: 'Vedi dettagli', onClick: () => vai('progressi') }}>
        <Carta className="flex flex-col gap-4">
          <RigaAvanzamento nome="Domande imparate" valore={`${n.imparate} di ${n.totaleDomande}`} quota={n.totaleDomande ? n.imparate / n.totaleDomande : 0} tono="alto" />
          {prossimo ? (
            <RigaAvanzamento nome={livello.livello ? `Livello ${livello.livello}: verso ${prossimo.livello}` : `Livello: verso ${prossimo.livello}`} valore={`${Math.min(prossimo.imparate, necessarie)} di ${necessarie}`}
              quota={necessarie ? Math.min(1, prossimo.imparate / necessarie) : 0} tono="viola" />
          ) : livello.livello ? (
            <p className="flex items-center gap-2 text-[15px] font-semibold text-testo"><Icona nome="livello" size={18} className="text-viola" />Livello {livello.livello} raggiunto</p>
          ) : null}
          <p className="flex items-center justify-between gap-3 border-t border-linea pt-3 text-[15px] leading-[21px]">
            <span className="font-semibold text-testo">Simulazioni</span>
            <span className="text-[14px] font-semibold tabular-nums text-testo-tenue">
              {n.simulazioni === 0 ? 'Nessuna ancora' : `${n.simulazioni} fatte · media ${String(n.mediaSimulazioni).replace('.', ',')}/${DOMANDE_TEST}`}
            </span>
          </p>
        </Carta>
      </Sezione>

      <Sezione id="pr-obiettivi" titolo="Obiettivi" azione={{ testo: 'Vedi tutti', onClick: () => vai('obiettivi') }}>
        <Carta tono={av.raggiunto ? 'alto' : 'neutro'}>
          <div className="flex items-center gap-3">
            <IconaTono tono="alto" lato={44}><Icona nome="obiettivi" size={24} /></IconaTono>
            <div className="min-w-0 flex-1">
              <p className="text-[16px] leading-[22px] font-bold text-testo">Superare il test</p>
              <p className="text-[13px] leading-[18px] text-testo-tenue">{SOGLIA_TEST} risposte giuste su {DOMANDE_TEST}</p>
            </div>
          </div>
          {av.corrente !== null ? (
            <>
              <p className="mt-3 text-[14px] leading-[20px] font-semibold text-testo">Probabilità ora {av.corrente}% · obiettivo {av.target}%</p>
              <BarraTono className="mt-2" tono="alto" valore={av.quota * 100} />
            </>
          ) : (
            <div className="mt-3 flex items-center justify-between gap-3">
              <p data-testo-ok className="min-w-0 flex-1 text-[14px] leading-[20px] text-testo-tenue">Non c'è ancora una stima. Si calcola dal test di livello.</p>
              <button type="button" onClick={() => { playTapSound(); avviaDiagnostico(); }}
                className="brand-premibile inline-flex min-h-[44px] shrink-0 items-center rounded-[12px] border border-tacca bg-superficie px-3.5 text-[14px] font-bold text-azione-testo">Fai il test di livello</button>
            </div>
          )}
        </Carta>
        <div className="grid grid-cols-2 gap-3">
          <Carta className="p-3.5">
            <p className="text-[12px] leading-[16px] font-medium text-testo-tenue">Studio oggi</p>
            <p className="mt-0.5 text-[17px] leading-[24px] font-extrabold tabular-nums text-testo">{Math.floor(giorno.secondi / 60)} <span className="text-[13px] font-semibold text-testo-tenue">di {ob.minutiGiorno} min</span></p>
            <BarraTono className="mt-2 h-1.5" tono="medio" valore={giorno.quota * 100} />
          </Carta>
          <Carta className="p-3.5">
            <p className="text-[12px] leading-[16px] font-medium text-testo-tenue">Data del test</p>
            <p className="mt-0.5 text-[17px] leading-[24px] font-extrabold text-testo">
              {mancano?.quando === 'futuro' ? <>{mancano.giorni} <span className="text-[13px] font-semibold text-testo-tenue">{mancano.giorni === 1 ? 'giorno' : 'giorni'}</span></>
                : mancano?.quando === 'oggi' ? 'Oggi' : mancano ? 'Passata' : <span className="text-[14px] font-semibold text-testo-tenue">Non impostata</span>}
            </p>
          </Carta>
        </div>
      </Sezione>

      <Sezione id="pr-badge" titolo="Badge" azione={{ testo: 'Vedi tutti', onClick: () => vai('badge') }}>
        <Carta>
          <p className="text-[14px] leading-[20px] font-semibold text-testo">{ottenuti} di {badge.length} ottenuti</p>
          <ul className="mt-3 flex items-start justify-between gap-1" aria-label="Badge in vista">
            {inVista.map(b => (
              <li key={b.id} className="flex w-[64px] justify-center" title={b.titolo}>
                <span className={b.sbloccato ? '' : 'opacity-45'} role="img" aria-label={`${b.titolo}: ${b.sbloccato ? 'ottenuto' : b.avanzamento}`}><Disegno nome={arteBadge(b)} lato={56} /></span>
              </li>
            ))}
          </ul>
          {ottenuti === 0 && <p data-testo-ok className="mt-3 text-[13px] leading-[18px] text-testo-tenue">Il primo arriva con la prima domanda imparata.</p>}
        </Carta>
      </Sezione>

      {SCHERMATE.esplora && (
        <Sezione id="pr-community" titolo="Community">
          <GruppoRighe etichetta="Community">
            <Riga icona="amici" titolo="Community" sottotitolo="Project ID, ATLAS, NOI, Agorà" onClick={() => vai('esplora')} />
          </GruppoRighe>
        </Sezione>
      )}

      <Sezione id="pr-aiuto" titolo="Aiuto">
        <GruppoRighe etichetta="Aiuto">
          {SCHERMATE.faq && <Riga icona="faq" titolo="Domande frequenti" onClick={() => vai('faq')} />}
          {SCHERMATE.segnala && <Riga icona="segnala" titolo="Segnala un problema o un'idea" onClick={() => vai('segnala')} />}
          <Riga icona="presentazione" titolo="Cos'è AddiOFA" onClick={apriLanding} />
        </GruppoRighe>
      </Sezione>

      <Sezione id="pr-info" titolo="Informazioni">
        <GruppoRighe etichetta="Informazioni">
          {LEGAL_TABS.map(t => <Riga key={t.id} icona={ICONE_LEGALI[t.id]} titolo={t.label} onClick={() => apriLegale(t.id)} />)}
        </GruppoRighe>
      </Sezione>
      <p data-testo-ok className="mx-auto mt-5 max-w-[52ch] text-center text-[12px] leading-[17px] text-testo-tenue">{AVVERTENZA_INDIPENDENZA}</p>
    </Pagina>
  );
}

