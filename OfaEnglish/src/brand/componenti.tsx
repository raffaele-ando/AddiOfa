// Componenti del Brand Kit ricreati in codice, con le misure prese dalle immagini.
// Interattivi: Pulsante, Interruttore, Casella, Radio (e IconaChip se riceve onClick).
// Solo visivi: Avanzamento, Barra, Badge, Stato, Misuratore, Caricamento.
import { CSSProperties, ReactNode, useEffect, useId, useState } from 'react';
import { KIT, Kit, FONT, STATI, BADGE } from './tokens';
import { urlGlifo } from './risorse';
import './brand.css';

function Freccia({ colore, lato = 16 }: { colore: string; lato?: number }) {
  return (
    <svg width={lato} height={lato} viewBox="0 0 16 16" aria-hidden>
      <path d="M6 3.5 10.5 8 6 12.5" fill="none" stroke={colore} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ---------------------------------------------------------------- interattivi

export function Pulsante({ variante = 'primario', kit = 'blu', children, onClick, disabled, larghezza, freccia, type = 'button' }: {
  variante?: 'primario' | 'secondario' | 'outline';
  kit?: Kit;
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  larghezza?: number | string; // di default quella misurata nel kit
  freccia?: boolean;
  type?: 'button' | 'submit';
}) {
  const t = KIT[kit].pulsante[variante];
  const conFreccia = freccia ?? t.freccia;
  const stile: CSSProperties = {
    width: larghezza ?? t.w, height: t.h, borderRadius: t.r, background: t.fondo, color: t.testo,
    boxShadow: 'ombra' in t ? t.ombra : undefined,
    border: 'bordo' in t ? `1.5px solid ${t.bordo}` : 'none',
    font: `600 ${t.corpo}px/1 ${FONT}`, letterSpacing: '-0.02em',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: conFreccia ? 14 : 0,
    paddingLeft: conFreccia ? 10 : 0,
  };
  return (
    <button type={type} className="brand-premibile" style={stile} onClick={onClick} disabled={disabled}>
      <span>{children}</span>
      {conFreccia && <Freccia colore={t.testo} />}
    </button>
  );
}

export function Interruttore({ acceso, onChange, kit = 'blu', etichetta, disabled }: {
  acceso: boolean; onChange?: (v: boolean) => void; kit?: Kit; etichetta: string; disabled?: boolean;
}) {
  const t = KIT[kit].interruttore;
  const pom = t.h - 6;
  return (
    <button
      role="switch" aria-checked={acceso} aria-label={etichetta} disabled={disabled}
      className="brand-premibile" onClick={() => onChange?.(!acceso)}
      style={{
        width: t.w, height: t.h, borderRadius: t.h / 2, position: 'relative', padding: 0,
        background: acceso ? t.acceso : t.spento,
        border: !acceso && t.spentoBordo ? `1px solid ${t.spentoBordo}` : 'none',
        boxShadow: acceso ? `0 3px 8px ${t.alone}` : 'inset 0 1px 2px rgba(15, 23, 42, 0.06)',
        transition: 'background .2s ease',
      }}
    >
      <span style={{
        position: 'absolute', top: 3, left: acceso ? t.w - pom - 3 : 3, width: pom, height: pom, borderRadius: '50%',
        background: t.pomello, boxShadow: '0 1px 3px rgba(15, 23, 42, 0.25)', transition: 'left .2s ease',
      }} />
    </button>
  );
}

export function Casella({ spuntata, onChange, kit = 'blu', etichetta, children }: {
  spuntata: boolean; onChange?: (v: boolean) => void; kit?: Kit; etichetta?: string; children?: ReactNode;
}) {
  const t = KIT[kit].casella;
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: 'pointer', font: `500 14px ${FONT}` }}>
      <input type="checkbox" checked={spuntata} onChange={e => onChange?.(e.target.checked)} aria-label={etichetta}
        style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }} />
      <span className="brand-premibile" aria-hidden style={{
        width: t.lato, height: t.lato, borderRadius: t.r, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: spuntata ? t.piena : '#FFFFFF', border: spuntata ? 'none' : `1.5px solid ${t.bordo}`,
        boxShadow: spuntata ? `0 1px 3px ${t.piena}30` : 'none', transition: 'background .15s ease',
      }}>
        {spuntata && (
          <svg width={t.lato * 0.62} height={t.lato * 0.62} viewBox="0 0 16 16">
            <path d="M3.2 8.4 6.6 11.6 12.8 4.6" fill="none" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      {children}
    </label>
  );
}

export function Radio({ selezionato, onChange, kit = 'blu', nome, valore, etichetta, children }: {
  selezionato: boolean; onChange?: (valore: string) => void; kit?: Kit; nome: string; valore: string; etichetta?: string; children?: ReactNode;
}) {
  const t = KIT[kit].radio;
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: 'pointer', font: `500 14px ${FONT}` }}>
      <input type="radio" name={nome} value={valore} checked={selezionato} onChange={() => onChange?.(valore)} aria-label={etichetta}
        style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }} />
      <span className="brand-premibile" aria-hidden style={{
        width: t.lato, height: t.lato, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: '#FFFFFF', border: `2px solid ${selezionato ? t.colore : t.bordo}`,
        boxShadow: selezionato ? `0 0 0 1px ${t.alone}` : 'none', boxSizing: 'border-box',
      }}>
        {selezionato && <span style={{ width: t.lato * 0.46, height: t.lato * 0.46, borderRadius: '50%', background: t.colore }} />}
      </span>
      {children}
    </label>
  );
}

// ---------------------------------------------------------------- solo visivi

export function Avanzamento({ passi, attuale, kit = 'blu', larghezza = 480 }: {
  passi: string[]; attuale: number; kit?: Kit; larghezza?: number; // `attuale` parte da 0
}) {
  const t = KIT[kit].avanzamento;
  const passo = (larghezza - t.cerchio) / Math.max(1, passi.length - 1);
  return (
    <div role="progressbar" aria-valuemin={1} aria-valuemax={passi.length} aria-valuenow={attuale + 1}
      aria-valuetext={passi[attuale]} style={{ position: 'relative', width: larghezza, height: t.cerchio + 24, margin: '0 24px', font: `400 12px ${FONT}` }}>
      <div style={{ position: 'absolute', top: t.cerchio / 2 - 1.5, left: t.cerchio / 2, right: t.cerchio / 2, height: 3, background: t.linea, borderRadius: 2 }} />
      <div style={{ position: 'absolute', top: t.cerchio / 2 - 1.5, left: t.cerchio / 2, width: passo * attuale, height: 3, background: t.lineaFatta, borderRadius: 2 }} />
      {passi.map((nome, i) => {
        const fatto = i < attuale, ora = i === attuale;
        const anello = ora && t.stileAttuale === 'anello';
        return (
          <div key={nome} style={{ position: 'absolute', left: i * passo, top: 0, width: t.cerchio, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{
              width: t.cerchio, height: t.cerchio, borderRadius: '50%', boxSizing: 'border-box',
              display: 'flex', alignItems: 'center', justifyContent: 'center', font: `700 ${Math.round(t.cerchio * 0.5)}px ${FONT}`,
              background: anello ? '#FFFFFF' : fatto || ora ? t.fatto : t.futuro,
              color: anello ? t.attuale : fatto || ora ? '#FFFFFF' : t.futuroTesto,
              border: anello ? `2px solid ${t.attuale}` : !(fatto || ora) && t.futuro === '#FFFFFF' ? `1.5px solid ${t.linea}` : 'none',
              boxShadow: ora ? `0 0 0 4px ${t.attuale}22` : 'none',
            }}>{i + 1}</span>
            <span style={{ marginTop: 7, color: t.etichetta, whiteSpace: 'nowrap' }}>{nome}</span>
          </div>
        );
      })}
    </div>
  );
}

export function Barra({ valore, segmenti, kit = 'rosso', larghezza = 168 }: {
  valore: number; segmenti?: number; kit?: Kit; larghezza?: number; // valore 0-1
}) {
  const t = KIT[kit].barra;
  const v = Math.max(0, Math.min(1, valore));
  if (segmenti) {
    const pieni = v * segmenti;
    return (
      <div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(v * 100)} style={{ display: 'flex', gap: 4, width: larghezza }}>
        {Array.from({ length: segmenti }, (_, i) => (
          <span key={i} style={{ flex: 1, height: 8, borderRadius: 4, transition: 'background .3s ease',
            background: i < Math.floor(pieni) ? t.pieno : i < pieni + 0.999 && pieni % 1 > 0 ? t.chiaro : t.vuoto }} />
        ))}
      </div>
    );
  }
  return (
    <div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(v * 100)}
      style={{ width: larghezza, height: 12, borderRadius: 6, background: t.vuoto, overflow: 'hidden' }}>
      <div style={{ width: `${v * 100}%`, height: '100%', borderRadius: 6, background: `linear-gradient(90deg, ${t.gradiente[0]}, ${t.gradiente[1]})`, transition: 'width .6s ease' }} />
    </div>
  );
}

function IconaBadge({ tipo, colore }: { tipo: keyof typeof BADGE; colore: string }) {
  if (tipo === 'piu-scelto') return <svg width="19" height="19" viewBox="0 0 16 16"><path d="M8 13V3.5M3.8 7.6 8 3.4l4.2 4.2" fill="none" stroke={colore} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  if (tipo === 'massima-sicurezza') return <svg width="19" height="19" viewBox="0 0 16 16"><path d="M8 1.5 13.5 3.6v4c0 3.2-2.3 5.8-5.5 6.9C4.8 13.4 2.5 10.8 2.5 7.6v-4Z" fill={colore} /><path d="m5.3 8 1.9 1.9L10.8 6" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  return <svg width="19" height="19" viewBox="0 0 16 16"><path d="m8 1.6 1.95 4 4.4.64-3.18 3.1.75 4.38L8 11.65l-3.92 2.07.75-4.38-3.18-3.1 4.4-.64Z" fill={colore} strokeLinejoin="round" /></svg>;
}

export function Badge({ tipo, testo }: { tipo: keyof typeof BADGE; testo?: string }) {
  const t = BADGE[tipo];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, height: 37, padding: '0 12px', borderRadius: 10,
      background: t.fondo, color: t.colore, font: `400 14px ${FONT}`, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
      <IconaBadge tipo={tipo} colore={t.colore} />
      {testo ?? t.testo}
    </span>
  );
}

function SimboloStato({ tipo }: { tipo: keyof typeof STATI }) {
  const d = { successo: 'm8.5 14.2 3.4 3.4 7.2-7.6', errore: 'm9.5 9.5 9 9m0-9-9 9', attenzione: 'M14 8v7.2', info: 'M14 12.5V20' }[tipo];
  return (
    <svg width="33" height="33" viewBox="0 0 28 28" aria-hidden>
      <circle cx="14" cy="14" r="14" fill={STATI[tipo].cerchio} />
      <path d={d} fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      {tipo === 'attenzione' && <circle cx="14" cy="19.6" r="1.7" fill="#fff" />}
      {tipo === 'info' && <circle cx="14" cy="8.4" r="1.8" fill="#fff" />}
    </svg>
  );
}

export function Stato({ tipo, titolo, testo, onChiudi }: {
  tipo: keyof typeof STATI; titolo: string; testo?: string; onChiudi?: () => void;
}) {
  const t = STATI[tipo];
  return (
    <div role={tipo === 'errore' || tipo === 'attenzione' ? 'alert' : 'status'} style={{
      display: 'flex', alignItems: 'center', gap: 12, minWidth: 164, minHeight: 67, padding: '10px 14px', boxSizing: 'border-box',
      borderRadius: 10, background: t.fondo, font: `400 14px/1.4 ${FONT}`,
    }}>
      <SimboloStato tipo={tipo} />
      <div style={{ flex: 1 }}>
        <div style={{ color: t.titolo, fontWeight: 500 }}>{titolo}</div>
        {testo && <div style={{ color: t.testo, opacity: 0.85 }}>{testo}</div>}
      </div>
      {onChiudi && <button className="brand-premibile" aria-label="Chiudi" onClick={onChiudi}
        style={{ border: 'none', background: 'transparent', color: t.titolo, font: `600 16px ${FONT}` }}>×</button>}
    </div>
  );
}

// ---------------------------------------------------------------- misti

// Colori dei cerchi misurati sulle icone (brand/glifi.json)
const CERCHI: Record<string, string> = {
  'kit-blu/studio': '#F0F4FE', 'kit-blu/statistiche': '#FEF7EC', 'kit-blu/quiz': '#EFF3FE', 'kit-blu/contenuti': '#FEEFF0',
  'kit-blu/costo': '#FEEFEF', 'kit-blu/blocco': '#FEEEEF', 'kit-blu/successo': '#EBF9F0', 'kit-blu/email': '#FEF0F0',
  'kit-blu/profilo': '#EBF0FE', 'kit-blu/impostazioni': '#F1F3F6', 'kit-blu/aiuto': '#F1F2F6', 'kit-blu/completato': '#EBF9F0',
  'kit-blu/errore': '#FEEFEF', 'kit-blu/info': '#EBF0FE',
  'kit-rosso/studio': '#FEEBEC', 'kit-rosso/statistiche': '#FEF3E7', 'kit-rosso/quiz': '#ECEDFE', 'kit-rosso/contenuti': '#FEF0F0',
  'kit-rosso/costo': '#FEF0F1', 'kit-rosso/blocco': '#FEECED', 'kit-rosso/successo': '#E4F7EA', 'kit-rosso/email': '#FEF0F1',
  'kit-rosso/profilo': '#EBEFFE', 'kit-rosso/impostazioni': '#F1F3F7', 'kit-rosso/aiuto': '#ECEEF1', 'kit-rosso/completato': '#E4F7EC',
  'kit-rosso/errore': '#FEE7E9', 'kit-rosso/info': '#E8EDFE',
};

export const NOMI_ICONE = ['studio', 'statistiche', 'quiz', 'contenuti', 'costo', 'blocco', 'successo', 'email', 'profilo', 'impostazioni', 'aiuto', 'completato', 'errore', 'info'] as const;

/** Icona: cerchio in codice (colore modificabile) + glifo vettoriale. Cliccabile solo se riceve onClick.
 * L'app usa il kit rosso (quello delle schermate); il Brand Kit mostra entrambi. */
export function IconaChip({ nome, kit = 'rosso', lato = 57, cerchio, onClick, etichetta }: {
  nome: typeof NOMI_ICONE[number]; kit?: Kit; lato?: number; cerchio?: string; onClick?: () => void; etichetta?: string;
}) {
  const chiave = `kit-${kit}/${nome}`;
  const contenuto = (
    <span style={{ display: 'inline-block', width: lato, height: lato, borderRadius: '50%', background: cerchio ?? CERCHI[chiave], position: 'relative' }}>
      <img src={urlGlifo(`kit-${kit}`, nome)} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
    </span>
  );
  if (!onClick) return <span role="img" aria-label={etichetta ?? nome}>{contenuto}</span>;
  return <button className="brand-premibile" aria-label={etichetta ?? nome} onClick={onClick} style={{ border: 'none', padding: 0, background: 'none', borderRadius: '50%' }}>{contenuto}</button>;
}

/** Misuratore (illustrazione "Risultato / Probabilità") ricreato in codice: il valore è vero e si anima. */
export function Misuratore({ valore, larghezza = 232, etichetta, animato = true }: {
  valore: number; larghezza?: number; etichetta?: string; animato?: boolean; // 0-100
}) {
  const id = useId().replace(/:/g, '');
  const [mostrato, setMostrato] = useState(animato ? 0 : valore);
  useEffect(() => {
    if (!animato) { setMostrato(valore); return; }
    let raf = 0; const inizio = performance.now();
    const passo = (ora: number) => {
      const k = Math.min(1, (ora - inizio) / 900);
      setMostrato(valore * (1 - Math.pow(1 - k, 3)));
      if (k < 1) raf = requestAnimationFrame(passo);
    };
    raf = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(raf);
  }, [valore, animato]);
  // arco di 220° che si apre in basso, come nel kit: dal basso a sinistra, sopra, al basso a destra
  const cx = 116, cy = 104, r = 90, da = 160, ampiezza = 220;
  const punto = (g: number) => [cx + r * Math.cos((g * Math.PI) / 180), cy + r * Math.sin((g * Math.PI) / 180)];
  const [x0, y0] = punto(da); const [x1, y1] = punto(da + ampiezza);
  const lung = (Math.PI * r * ampiezza) / 180;
  const frazione = Math.max(0, Math.min(1, mostrato / 100));
  const [px, py] = punto(da + ampiezza * frazione);
  return (
    <svg width={larghezza} height={larghezza * 0.62} viewBox="0 0 232 144" role="img" aria-label={etichetta ?? `${Math.round(valore)}%`}>
      <defs>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#F87171" /><stop offset="1" stopColor="#E11D2B" />
        </linearGradient>
      </defs>
      <path d={`M${x0} ${y0}A${r} ${r} 0 1 1 ${x1} ${y1}`} fill="none" stroke="#EEF0F4" strokeWidth="16" strokeLinecap="round" />
      <path d={`M${x0} ${y0}A${r} ${r} 0 1 1 ${x1} ${y1}`} fill="none" stroke={`url(#g${id})`} strokeWidth="16" strokeLinecap="round"
        strokeDasharray={`${lung * frazione} ${lung}`} />
      <circle cx={px} cy={py} r="11" fill="#EF4444" stroke="#fff" strokeWidth="4" />
      <text x={cx} y={cy + 8} textAnchor="middle" fill="#E5252F" style={{ font: `800 48px ${FONT}` }}>{Math.round(mostrato)}%</text>
    </svg>
  );
}

/** Caricamento (illustrazione di stato "Loading") ricreato in codice: gira davvero. */
export function Caricamento({ lato = 64, etichetta = 'Caricamento' }: { lato?: number; etichetta?: string }) {
  return (
    <svg width={lato} height={lato} viewBox="0 0 64 64" role="img" aria-label={etichetta} className="brand-anim-gira">
      <circle cx="32" cy="32" r="26" fill="none" stroke="#FDD9DB" strokeWidth="8" />
      <path d="M32 6a26 26 0 0 1 26 26" fill="none" stroke="#F0303B" strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}
