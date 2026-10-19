import { useState } from 'react';
import type { NomeIcona } from '../brand/icone/Icona';
import type { LegalSection } from '../types';
import { useTheme, type ModoTema } from '../hooks/useTheme';
import { useToast } from '../components/Toast';
import { isAudioMuted, playTapSound, setAudioMuted } from '../lib/audio';
import { cn } from '../lib/utils';
import { AVVERTENZA_INDIPENDENZA } from '../legal';
import ConfirmDialog from '../components/ConfirmDialog';
import { loadState } from '../lib/storage';
import { Carta, FoglioInfo, GruppoRighe, Pagina, PulsanteInfo, Riga, Segmenti, Sezione } from './extra/ui';

// Stessa versione di package.json (l'app non legge il file a runtime)
const VERSIONE_APP = '1.0.0';

interface Props {
  onBack: () => void;
  /** Non più usati: presentazione, legali, FAQ e Segnala stanno nel Profilo. Restano nel tipo perché App li passa ancora. */
  onOpenLanding?: () => void;
  onOpenLegal?: (s: LegalSection) => void;
  /** Assente = la riga non si vede. */
  onImport?: () => void;
  /** Assente = al posto del file si copia il testo dei progressi. */
  onExport?: () => void;
  
  /** Non più usato (vedi sopra). */
  onVai?: (id: string, params?: Record<string, string>) => void;
  /** Cancella i dati locali. Assente = si cancellano le chiavi dei progressi e si ricarica la pagina. */
  onReset?: () => void;
}

// Chiavi del localStorage che contengono i dati dell'utente (progressi con profilo, obiettivi e badge dentro `extra`; ultimo diagnostico).
const CHIAVI_DATI = ['ofa_polimi_app_state', 'addiofa_diagnostico_ultimo'];

function Interruttore({ acceso, onCambia, etichetta }: { acceso: boolean; onCambia: (v: boolean) => void; etichetta: string }) {
  return (
    <button type="button" role="switch" aria-checked={acceso} aria-label={etichetta} onClick={() => onCambia(!acceso)}
      className={cn('relative shrink-0 w-[51px] h-[31px] rounded-full', acceso ? 'bg-azione' : 'bg-tacca ring-2 ring-inset ring-bordo-campo')}>
      <span className={cn('absolute top-[2px] w-[27px] h-[27px] rounded-full bg-superficie dark:bg-testo shadow-[0_1px_3px_rgba(0,0,0,0.25)]', acceso ? 'left-[22px]' : 'left-[2px]')} />
    </button>
  );
}

const TEMI: { id: ModoTema; nome: string; icona: NomeIcona }[] = [
  { id: 'sistema', nome: 'Sistema', icona: 'tema-sistema' },
  { id: 'chiaro', nome: 'Chiaro', icona: 'tema-chiaro' },
  { id: 'scuro', nome: 'Scuro', icona: 'tema-scuro' },
];

export default function Impostazioni({ onBack, onImport, onExport, onReset }: Props) {
  const { modo, setModo } = useTheme();
  const toast = useToast();
  const [suoniSpenti, setSuoniSpenti] = useState(isAudioMuted());
  const [chiediCancella, setChiediCancella] = useState(false);
  const [testoCopia, setTestoCopia] = useState<string | null>(null);
  const [info, setInfo] = useState(false);

  const cambiaSuoni = (acceso: boolean) => {
    setSuoniSpenti(!acceso);
    setAudioMuted(!acceso);
    if (acceso) playTapSound();
  };

  // Dove scaricare un file non si può: si copia il testo dei progressi, con il testo selezionabile se gli appunti non rispondono.
  const copiaProgressi = async () => {
    const testo = JSON.stringify(loadState(), null, 2);
    try {
      await navigator.clipboard.writeText(testo);
      toast('Progressi copiati.', 'ok');
    } catch {
      setTestoCopia(testo);
      toast('Appunti non disponibili: copia il testo qui sotto.', 'info');
    }
  };
  const cancellaDati = () => {
    setChiediCancella(false);
    if (onReset) { onReset(); return; }
    try { for (const k of CHIAVI_DATI) localStorage.removeItem(k); } catch { /* memoria non disponibile: niente da cancellare */ }
    window.location.reload();
  };

  return (
    <Pagina velata titolo="Impostazioni" onBack={onBack}>
      <Sezione id="imp-preferenze" titolo="Preferenze">
        <Carta as="section" className="flex flex-col gap-3">
          <h3 className="text-[15px] leading-[21px] font-semibold text-testo">Tema</h3>
          <Segmenti<ModoTema> nome="Tema" voci={TEMI} valore={modo} onScegli={setModo} />
        </Carta>
        <GruppoRighe etichetta="Suoni">
          <Riga icona="suoni" titolo="Suoni" destra={<Interruttore acceso={!suoniSpenti} onCambia={cambiaSuoni} etichetta="Suoni" />} />
        </GruppoRighe>
      </Sezione>

      <Sezione id="imp-dati" titolo="Dati">
        <GruppoRighe etichetta="Dati">
          {onImport && <Riga icona="importa" titolo="Importa i progressi" sottotitolo="Da un file salvato" onClick={onImport} />}
          {onExport
            ? <Riga icona="esporta" titolo="Esporta i progressi" sottotitolo="Salva una copia" onClick={onExport} />
            : <Riga icona="copia" titolo="Copia i progressi" sottotitolo="Per tenerne una copia" onClick={() => void copiaProgressi()} />}
          <Riga icona="cancella" tono="basso" titolo="Cancella i dati di questo dispositivo" sottotitolo="Progressi, profilo, obiettivi, badge" onClick={() => setChiediCancella(true)} />
        </GruppoRighe>
        {testoCopia !== null && (
          <div>
            <label htmlFor="testo-progressi" className="sr-only">Testo dei progressi</label>
            <textarea id="testo-progressi" data-testo-ok readOnly value={testoCopia} rows={6} onFocus={e => e.currentTarget.select()}
              className="w-full rounded-[12px] border border-bordo-campo bg-superficie p-3 text-[12px] font-mono text-testo" />
          </div>
        )}
      </Sezione>

      <Sezione id="imp-info" titolo="Informazioni">
        <GruppoRighe etichetta="Informazioni">
          <Riga icona="app" titolo="Versione" destra={
            <span className="flex shrink-0 items-center gap-1">
              <span className="text-[14px] text-testo-tenue tabular-nums">{VERSIONE_APP}</span>
              <PulsanteInfo onClick={() => setInfo(true)} etichetta="Informazioni sull'app" className="-mr-2" />
            </span>
          } />
        </GruppoRighe>
      </Sezione>
      <FoglioInfo aperto={info} onChiudi={() => setInfo(false)} titolo="Informazioni">
        <p>{AVVERTENZA_INDIPENDENZA}</p>
        <p className="mt-2">Progressi, profilo e obiettivi restano su questo dispositivo: esportali per tenerne una copia o spostarli.</p>
      </FoglioInfo>
      <ConfirmDialog open={chiediCancella} danger title="Cancellare i dati?"
        message="Vengono cancellati progressi, simulazioni, profilo, obiettivi e badge salvati qui. Non si può tornare indietro: se vuoi una copia, esportali prima."
        confirmLabel="Cancella" onConfirm={cancellaDati} onCancel={() => setChiediCancella(false)} />
    </Pagina>
  );
}
