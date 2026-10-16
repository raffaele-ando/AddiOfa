import { ReactNode, useState } from 'react';
import { Icona, type NomeIcona } from '../brand/icone/Icona';
import type { LegalSection } from '../types';
import { useTheme, type ModoTema } from '../hooks/useTheme';
import { useToast } from '../components/Toast';
import { isAudioMuted, playTapSound, setAudioMuted } from '../lib/audio';
import { cn } from '../lib/utils';
import { AVVERTENZA_INDIPENDENZA } from '../legal';
import ConfirmDialog from '../components/ConfirmDialog';
import { loadState } from '../lib/storage';
import { Disegno } from './extra/servizi/componenti';
import { FoglioInfo, IconaTono, Pagina, PulsanteInfo, type Tono } from './extra/ui';

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

/** Gruppo di righe: tessera chiara con filetti, nessun titolo (ogni riga ha già la sua icona e la sua parola). */
function Gruppo({ children, etichetta }: { children: ReactNode; etichetta: string }) {
  return <section aria-label={etichetta} className="mt-[14px] rounded-[12px] bg-superficie-2 overflow-hidden divide-y divide-linea">{children}</section>;
}

/** Icona della riga: il colore dice il significato (dati = azione, cancellare = corallo); le utilità senza significato restano neutre. */
function IconaRiga({ nome, tono }: { nome: NomeIcona; tono?: Tono }) {
  return tono
    ? <IconaTono tono={tono} lato={32} className="rounded-[9px]"><Icona nome={nome} size={18} /></IconaTono>
    : <span className="w-[32px] h-[32px] rounded-[9px] bg-superficie text-testo-tenue flex items-center justify-center shrink-0" aria-hidden="true"><Icona nome={nome} size={18} /></span>;
}

/** Una riga: icona (o illustrazione del kit), UNA parola, e a destra il comando (interruttore, selettore a icone, valore o freccia). */
function Riga({ icona, illustrazione, tono, titolo, destra, onClick }: { icona?: NomeIcona; illustrazione?: string; tono?: Tono; titolo: string; destra?: ReactNode; onClick?: () => void }) {
  const corpo = (
    <>
      {illustrazione
        ? <span className="grid h-[32px] w-[32px] shrink-0 place-items-center"><Disegno nome={illustrazione} lato={36} /></span>
        : icona && <IconaRiga nome={icona} tono={tono} />}
      <span className="flex-1 min-w-0 text-[16px] leading-[22px] text-testo">{titolo}</span>
      {destra}
      {onClick && !destra && <Icona nome="avanti" size={20} className="shrink-0 -mr-1 text-testo-tenue" />}
    </>
  );
  const classe = 'w-full flex items-center gap-3 px-3.5 py-[10px] min-h-[54px] text-left';
  return onClick
    ? <button type="button" onClick={() => { playTapSound(); onClick(); }} className={cn('brand-premibile', classe)}>{corpo}</button>
    : <div className={classe}>{corpo}</div>;
}

function Interruttore({ acceso, onCambia, etichetta }: { acceso: boolean; onCambia: (v: boolean) => void; etichetta: string }) {
  return (
    <button type="button" role="switch" aria-checked={acceso} aria-label={etichetta} onClick={() => onCambia(!acceso)}
      className={cn('relative shrink-0 w-[51px] h-[31px] rounded-full', acceso ? 'bg-azione' : 'bg-tacca')}>
      <span className={cn('absolute top-[2px] w-[27px] h-[27px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.25)]', acceso ? 'left-[22px]' : 'left-[2px]')} />
    </button>
  );
}

/** Selettore a sole icone: ogni voce ha `aria-label`; la scelta è quella con lo sfondo chiaro. */
function Segmento<T extends string>({ nome, voci, valore, onScegli }: { nome: string; voci: { id: T; icona: NomeIcona; nome: string }[]; valore: T; onScegli: (v: T) => void }) {
  return (
    <div role="radiogroup" aria-label={nome} className="shrink-0 grid gap-0.5 p-0.5 rounded-[10px] bg-superficie" style={{ gridTemplateColumns: `repeat(${voci.length}, minmax(0, 1fr))` }}>
      {voci.map(v => (
        <button key={v.id} type="button" role="radio" aria-checked={valore === v.id} aria-label={v.nome} title={v.nome} onClick={() => { playTapSound(); onScegli(v.id); }}
          className={cn('grid h-9 w-11 place-items-center rounded-[8px]', valore === v.id ? 'bg-superficie-2 text-azione-scuro shadow-[0_1px_3px_rgba(15,23,42,0.1)] dark:shadow-none dark:border dark:border-tacca' : 'text-testo-tenue')}>
          <Icona nome={v.icona} size={20} />
        </button>
      ))}
    </div>
  );
}

/** Pulsante tondo con la sola icona (esporta, importa, copia, cancella). */
function IconaComando({ icona, nome, tono, onClick }: { icona: NomeIcona; nome: string; tono: 'azione' | 'basso'; onClick: () => void }) {
  return (
    <button type="button" onClick={() => { playTapSound(); onClick(); }} aria-label={nome} title={nome}
      className={cn('brand-premibile grid h-10 w-10 place-items-center rounded-full', tono === 'basso' ? 'bg-basso-tinta text-basso-numero' : 'bg-azione-tinta text-azione-scuro')}>
      <Icona nome={icona} size={20} />
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
    <Pagina titolo="Impostazioni" onBack={onBack}>
      <>
        <Gruppo etichetta="Preferenze">
          <Riga icona="tema" titolo="Tema" destra={<Segmento<ModoTema> nome="Tema" voci={TEMI} valore={modo} onScegli={setModo} />} />
          <Riga icona="suoni" titolo="Suoni" destra={<Interruttore acceso={!suoniSpenti} onCambia={cambiaSuoni} etichetta="Suoni" />} />
        </Gruppo>

        <Gruppo etichetta="Dati">
          <Riga tono="azione" icona="dati" titolo="Dati" destra={
            <div className="flex shrink-0 items-center gap-2">
              {onImport && <IconaComando icona="importa" nome="Importa progressi" tono="azione" onClick={onImport} />}
              {onExport
                ? <IconaComando icona="esporta" nome="Esporta progressi" tono="azione" onClick={onExport} />
                : <IconaComando icona="copia" nome="Copia i progressi" tono="azione" onClick={() => void copiaProgressi()} />}
              <IconaComando icona="cancella" nome="Cancella i dati di questo dispositivo" tono="basso" onClick={() => setChiediCancella(true)} />
            </div>
          } />
        </Gruppo>
        {testoCopia !== null && (
          <div className="mt-2">
            <label htmlFor="testo-progressi" className="sr-only">Testo dei progressi</label>
            <textarea id="testo-progressi" data-testo-ok readOnly value={testoCopia} rows={6} onFocus={e => e.currentTarget.select()}
              className="w-full rounded-[12px] bg-superficie-2 border border-linea p-3 text-[12px] font-mono text-testo" />
          </div>
        )}

        <Gruppo etichetta="Informazioni">
          <Riga illustrazione="sfera-addiofa" titolo="Versione" destra={
            <span className="flex shrink-0 items-center gap-1">
              <span className="text-[14px] text-testo-tenue tabular-nums">{VERSIONE_APP}</span>
              <PulsanteInfo onClick={() => setInfo(true)} etichetta="Informazioni sull'app" className="-mr-1.5" />
            </span>
          } />
        </Gruppo>
      </>
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
