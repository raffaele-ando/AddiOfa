// «Project ID» (concept 30/34/36): cos'è, cosa condivide e cosa no, e lo stato vero del collegamento.
// Nessun login finto: il pulsante o porta alle Impostazioni (dove il login esiste) o dice perché non è attivo.
import { useState, type ReactNode } from 'react';
import { Check, Lock, Radar, RefreshCw, ShieldCheck, Trophy, UserRound } from 'lucide-react';
import { useExtra } from '../contesto';
import { BottoneAzione, BottoneSecondario, Etichetta, Nota, Pagina, Sezione } from './componenti';
import { IconaTono, type Tono } from '../ui';
import { ATLAS_API_URL, ECOSYSTEM, SCOPES } from '../../../config/ecosystem';
import { FEATURE_FLAGS } from '../../../config/offer';
import { statoCollegamento, type MotivoSpento } from '../../../lib/servizi/collegamento';

// Spiegazione completa (si mostra quando si preme «Collega» a collegamento spento) e versione breve per l'avviso in alto.
const SPIEGAZIONE_SPENTO: Record<MotivoSpento, string> = {
  demo: 'In questa versione dimostrativa non c\'è nessun accesso: non viene creato nessun account e nessun dato esce dal tuo dispositivo.',
  flag: `Il collegamento al ${ECOSYSTEM.accountName} non è ancora attivo in AddiOFA. Non hai perso niente: tutto lo studio funziona senza, e i tuoi progressi restano su questo dispositivo.`,
  atlas: `Il servizio ${ECOSYSTEM.engineName}, che gestisce l'account, non è ancora raggiungibile da questa versione dell'app. Riprova quando sarà attivo: per studiare non serve.`,
};
const BREVE_SPENTO: Record<MotivoSpento, string> = {
  demo: 'Versione dimostrativa: nessun account, nessun dato esce dal dispositivo.',
  flag: 'Lo studio funziona senza e i progressi restano su questo dispositivo.',
  atlas: 'Il servizio non è raggiungibile da questa versione. Per studiare non serve.',
};

// Un colore per ogni permesso, lo stesso che ha quella cosa nel resto dell'app: profilo = azzurro dell'account, progressi = blu,
// classifica = ambra (trofeo), personalizzazione ATLAS = verde (analisi del livello).
const TONO_SCOPE: Record<string, { tono: Tono; icona: ReactNode }> = {
  profile: { tono: 'azione', icona: <UserRound size={20} /> },
  'progress.share': { tono: 'azione', icona: <RefreshCw size={20} /> },
  'noi.leaderboard': { tono: 'medio', icona: <Trophy size={20} /> },
  'atlas.personalize': { tono: 'alto', icona: <Radar size={20} /> },
};

export default function ProjectId() {
  const { appState, demo, vai, apriImpostazioni } = useExtra();
  const stato = statoCollegamento({ demo, flagProjectId: FEATURE_FLAGS.projectId, flagClassifica: FEATURE_FLAGS.leaderboard, atlasOnline: !!ATLAS_API_URL, permessi: appState.projectLink?.scopes });
  const [spiega, setSpiega] = useState(false);
  const link = appState.projectLink;

  const premi = () => { if (stato.attivo) apriImpostazioni(); else setSpiega(true); };
  const etichettaCollega = stato.attivo ? (link ? 'Gestisci il collegamento' : `Collega il ${ECOSYSTEM.accountName}`) : `Collega il ${ECOSYSTEM.accountName}`;

  return (
    <Pagina titolo={ECOSYSTEM.accountName} sottotitolo={`Un solo account facoltativo per le app ${ECOSYSTEM.name}. Non serve per studiare.`}>

      {/* lo stato in breve, subito: i dettagli stanno nelle sezioni sotto */}
      <Nota tono={stato.attivo ? 'riuscito' : 'attenzione'} className="mt-5">
        <p className="font-bold">{stato.attivo ? (link ? 'Collegato su questo dispositivo' : 'Il collegamento è disponibile') : 'Il collegamento non è ancora attivo'}</p>
        <p className="mt-0.5">
          {stato.attivo
            ? (link ? `Consenso dato il ${new Date(link.grantedAt).toLocaleDateString('it-IT')}: dalle Impostazioni puoi cambiarlo o revocarlo.` : 'Dalle Impostazioni accedi e scegli, uno per uno, cosa condividere.')
            : BREVE_SPENTO[stato.motivo!]}
        </p>
      </Nota>

      <Sezione id="pid-cose" titolo="Cos'è">
        <p className="text-[14.5px] leading-[22px] text-testo">
          Serve a ritrovare i tuoi progressi su più app e, se vuoi, a partecipare alla classifica {ECOSYSTEM.rankingName}. {ECOSYSTEM.engineName} è il nome dell'algoritmo e dell'infrastruttura che sta dietro.
        </p>
      </Sezione>

      <Sezione id="pid-condivide" titolo="Cosa si condivide, solo se lo scegli">
        <p className="text-[13px] leading-[19px] text-testo-tenue">Ogni permesso parte spento, tranne il profilo di base, necessario per collegarti.</p>
        <ul className="flex flex-col gap-[8px]">
          {SCOPES.map(s => {
            const concesso = link ? (s.required || link.scopes.includes(s.id)) : null;
            const t = TONO_SCOPE[s.id] ?? { tono: 'azione' as Tono, icona: <ShieldCheck size={20} /> };
            return (
              <li key={s.id} className="flex items-start gap-3 rounded-[12px] bg-superficie-2 p-3.5">
                <IconaTono tono={t.tono} lato={36}>{t.icona}</IconaTono>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-[14.5px] leading-[20px] font-bold text-testo">{s.title}</span>
                    {s.required && <Etichetta><Lock size={11} aria-hidden="true" />Necessario</Etichetta>}
                    {concesso !== null && (
                      <Etichetta tono={concesso ? 'alto' : 'neutro'}>
                        {concesso && <Check size={11} aria-hidden="true" />}{concesso ? 'Concesso' : 'Non concesso'}
                      </Etichetta>
                    )}
                  </div>
                  <p className="mt-0.5 text-[13px] leading-[19px] text-testo-tenue">{s.description}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </Sezione>

      <Sezione id="pid-non" titolo="Cosa non si condivide">
        <ul className="flex flex-col gap-2 text-[14px] leading-[21px] text-testo">
          {[
            'Matricola e codice fiscale: l\'app non li chiede.',
            'L\'email del Politecnico: il Project ID non la richiede.',
            `Le tue singole risposte e i tuoi errori: in classifica ${ECOSYSTEM.rankingName} si vedono solo il tuo @nome utente, le domande imparate e il miglior punteggio.`,
            'Niente di nascosto: puoi revocare un permesso o eliminare il tuo Project ID quando vuoi.',
          ].map(t => (
            <li key={t} className="flex gap-2.5"><ShieldCheck size={18} className="mt-[2px] shrink-0 text-alto-numero" aria-hidden="true" /><span>{t}</span></li>
          ))}
        </ul>
      </Sezione>

      <div className="mt-6 flex flex-col gap-2.5">
        {/* con il collegamento spento «Collega» non è un'azione possibile: resta secondaria, così il punto focale è l'avviso in alto */}
        {stato.attivo
          ? <BottoneAzione onClick={premi}>{etichettaCollega}</BottoneAzione>
          : <BottoneSecondario onClick={premi}>{etichettaCollega}</BottoneSecondario>}
        {spiega && !stato.attivo && (
          <Nota tono="attenzione"><span role="status">{SPIEGAZIONE_SPENTO[stato.motivo!]} Nessun accesso è stato eseguito e nessun dato è stato inviato.</span></Nota>
        )}
        <button type="button" onClick={() => vai('noi')} className="brand-premibile min-h-[44px] rounded-[10px] text-[14.5px] font-bold text-azione-scuro underline underline-offset-4">{`Cos'è la classifica ${ECOSYSTEM.rankingName}`}</button>
      </div>
      <p className="mt-4 text-[12px] leading-[17px] text-testo-tenue">
        I testi sul trattamento dei dati sono bozze, da far rivedere a un professionista prima del lancio.
      </p>
    </Pagina>
  );
}
