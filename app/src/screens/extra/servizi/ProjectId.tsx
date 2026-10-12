// «Project ID» (concept 30/34/36): cos'è, cosa condivide e cosa no, e lo stato vero del collegamento.
// Nessun login finto: il pulsante o porta alle Impostazioni (dove il login esiste) o dice perché non è attivo.
import { useState } from 'react';
import { Check, Fingerprint, Lock, ShieldCheck } from 'lucide-react';
import { useExtra } from '../contesto';
import { BottoneAzione, BottoneSecondario, Nota, Pagina, Sezione } from './componenti';
import { ATLAS_API_URL, ECOSYSTEM, SCOPES } from '../../../config/ecosystem';
import { FEATURE_FLAGS } from '../../../config/offer';
import { statoCollegamento, type MotivoSpento } from '../../../lib/servizi/collegamento';
import { cn } from '../../../lib/utils';

const SPIEGAZIONE_SPENTO: Record<MotivoSpento, string> = {
  demo: 'In questa versione dimostrativa non c\'è nessun accesso: non viene creato nessun account e nessun dato esce dal tuo dispositivo.',
  flag: `Il collegamento al ${ECOSYSTEM.accountName} non è ancora attivo in AddiOFA. Non hai perso niente: tutto lo studio funziona senza, e i tuoi progressi restano su questo dispositivo.`,
  atlas: `Il servizio ${ECOSYSTEM.engineName}, che gestisce l'account, non è ancora raggiungibile da questa versione dell'app. Riprova quando sarà attivo: per studiare non serve.`,
};

export default function ProjectId() {
  const { appState, demo, vai, apriImpostazioni } = useExtra();
  const stato = statoCollegamento({ demo, flagProjectId: FEATURE_FLAGS.projectId, flagClassifica: FEATURE_FLAGS.leaderboard, atlasOnline: !!ATLAS_API_URL, permessi: appState.projectLink?.scopes });
  const [spiega, setSpiega] = useState(false);
  const link = appState.projectLink;

  const premi = () => { if (stato.attivo) apriImpostazioni(); else setSpiega(true); };

  return (
    <Pagina titolo={ECOSYSTEM.accountName} sottotitolo={`Un solo account facoltativo per le app ${ECOSYSTEM.name}. Non serve per studiare.`}
      figura={<Fingerprint size={44} className="mt-1 shrink-0 text-azione" aria-hidden="true" />}>

      <Nota tono={stato.attivo ? 'azione' : 'attenzione'} className="mt-5">
        <p className="font-bold">{stato.attivo ? (link ? 'Collegato su questo dispositivo' : 'Il collegamento è disponibile') : 'Il collegamento non è ancora attivo'}</p>
        <p className="mt-0.5">
          {stato.attivo
            ? (link ? `Hai dato il consenso il ${new Date(link.grantedAt).toLocaleDateString('it-IT')}. Dalle Impostazioni puoi cambiarlo o revocarlo.` : 'Dalle Impostazioni puoi accedere e scegliere, uno per uno, cosa condividere.')
            : SPIEGAZIONE_SPENTO[stato.motivo!]}
        </p>
      </Nota>

      <Sezione id="pid-cose" titolo="Cos'è">
        <p className="text-[14.5px] leading-[22px] text-testo">
          Il {ECOSYSTEM.accountName} è un account unico per le app della famiglia {ECOSYSTEM.name}. Serve a due cose: ritrovare i tuoi progressi su più app e partecipare, se vuoi, alla classifica {ECOSYSTEM.rankingName}. {ECOSYSTEM.engineName} è il nome dell'algoritmo e dell'infrastruttura che sta dietro.
        </p>
        <p className="text-[14.5px] leading-[22px] text-testo">
          È facoltativo: AddiOFA funziona per intero senza account, e senza account i tuoi progressi restano su questo dispositivo.
        </p>
      </Sezione>

      <Sezione id="pid-condivide" titolo="Cosa si condivide, solo se lo scegli">
        <ul className="flex flex-col gap-[8px]">
          {SCOPES.map(s => {
            const concesso = link ? (s.required || link.scopes.includes(s.id)) : null;
            return (
              <li key={s.id} className="rounded-[12px] bg-superficie-2 p-3.5">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="text-[14.5px] leading-[20px] font-bold text-testo">{s.title}</span>
                  <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-[2px] text-[11.5px] leading-[16px] font-bold', s.required ? 'bg-superficie text-testo-tenue' : 'bg-azione-tinta text-azione-scuro')}>
                    {s.required && <Lock size={11} aria-hidden="true" />}{s.required ? 'Necessario se ti colleghi' : 'Facoltativo, parte spento'}
                  </span>
                  {concesso !== null && (
                    <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-[2px] text-[11.5px] leading-[16px] font-bold', concesso ? 'bg-alto-tinta text-alto-testo' : 'bg-superficie text-testo-tenue')}>
                      {concesso && <Check size={11} aria-hidden="true" />}{concesso ? 'Concesso' : 'Non concesso'}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[13px] leading-[19px] text-testo-tenue">{s.description}</p>
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
            'Niente di nascosto: ogni permesso facoltativo parte spento, e puoi revocarlo o eliminare il tuo Project ID quando vuoi.',
          ].map(t => (
            <li key={t} className="flex gap-2.5"><ShieldCheck size={18} className="mt-[2px] shrink-0 text-azione" aria-hidden="true" /><span>{t}</span></li>
          ))}
        </ul>
      </Sezione>

      <div className="mt-6 flex flex-col gap-2.5">
        <BottoneAzione onClick={premi} icona={<Fingerprint size={20} aria-hidden="true" />}>
          {stato.attivo ? (link ? 'Gestisci il collegamento' : `Collega il ${ECOSYSTEM.accountName}`) : `Collega il ${ECOSYSTEM.accountName}`}
        </BottoneAzione>
        {spiega && !stato.attivo && (
          <Nota tono="attenzione"><span role="status">{SPIEGAZIONE_SPENTO[stato.motivo!]} Nessun accesso è stato eseguito e nessun dato è stato inviato.</span></Nota>
        )}
        <BottoneSecondario onClick={() => vai('noi')}>{`Cos'è la classifica ${ECOSYSTEM.rankingName}`}</BottoneSecondario>
      </div>
      <p className="mt-4 text-[12px] leading-[17px] text-testo-tenue">
        I testi sul trattamento dei dati sono bozze, da far rivedere a un professionista prima del lancio.
      </p>
    </Pagina>
  );
}
