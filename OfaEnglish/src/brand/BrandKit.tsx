// Catalogo vivo del Brand Kit: originale estratto accanto alla versione ricreata, con tipo,
// cliccabilità e animazione. Si apre con ?brand. Con ?brand=verifica mostra solo le versioni
// in codice, ognuna nel riquadro esatto del suo PNG, per il confronto automatico (strumenti/brand/verifica_codice.py).
import { ReactNode, useState } from 'react';
import { CATALOGO, Voce } from './catalogo';
import { urlPng, urlSvg, urlGlifo, urlDisegno } from './risorse';
import { Illustrazione, Logo } from './Illustrazione';
import { Pulsante, Interruttore, Casella, Radio, Avanzamento, Barra, Badge, Stato, IconaChip, Misuratore, Caricamento, NOMI_ICONE } from './componenti';
import { FONT, Kit } from './tokens';

const PASSI = ['Verifica', 'Quiz', 'Risultato', 'Piani', 'Pagamento', 'Successo'];

function StileIllustrativo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, width: 375, height: 72, padding: '0 22px', boxSizing: 'border-box', borderRadius: 12, background: '#FEF1F1', font: `500 13px/1.4 ${FONT}` }}>
      <img src={urlGlifo('kit-rosso', 'studio')} alt="" width={52} height={52} style={{ margin: '-6px' }} />
      <div>
        <div style={{ color: '#121729', fontWeight: 600, fontSize: 14 }}>Stile illustrativo ispirato a Duolingo</div>
        <div style={{ color: '#4B5563' }}>Semplice, amichevole, chiaro, coerente.</div>
      </div>
    </div>
  );
}

/** La versione ricreata di una voce: componente in codice se c'è, altrimenti l'illustrazione. */
function Ricreato({ v, interattivo = true }: { v: Voce; interattivo?: boolean }) {
  const kit: Kit = v.kit === 'kit-rosso' ? 'rosso' : 'blu';
  const [on, setOn] = useState(v.nome.includes('acceso') || v.nome.includes('spuntata') || v.nome.includes('selezionato'));
  switch (v.componente) {
    case 'Pulsante': {
      const variante = v.nome.replace('pulsante-', '') as 'primario' | 'secondario' | 'outline';
      return <Pulsante kit={kit} variante={variante} onClick={interattivo ? () => undefined : undefined}>{variante[0].toUpperCase() + variante.slice(1)}</Pulsante>;
    }
    case 'Interruttore': return <Interruttore kit={kit} acceso={on} onChange={setOn} etichetta={v.etichetta} />;
    case 'Casella': return <Casella kit={kit} spuntata={on} onChange={setOn} etichetta={v.etichetta} />;
    case 'Radio': return <Radio kit={kit} selezionato={on} onChange={() => setOn(!on)} nome={`${v.kit}-${v.nome}`} valore="1" etichetta={v.etichetta} />;
    case 'Avanzamento': return <Avanzamento kit={kit} passi={PASSI} attuale={kit === 'rosso' ? 2 : 1} larghezza={kit === 'rosso' ? 500 : 470} />;
    case 'Barra': return <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}><Barra kit="rosso" valore={0.625} segmenti={4} /><Barra kit="rosso" valore={0.66} /></div>;
    case 'Badge': return <Badge tipo={v.nome.replace('badge-', '') as 'piu-scelto' | 'massima-sicurezza' | 'consigliato'} />;
    case 'Stato': {
      const tipo = ({ 'operazione-completata': 'successo', errore: 'errore', attenzione: 'attenzione', informazione: 'info' } as const)[v.nome as 'errore'];
      const testi = { successo: ['Operazione', 'completata'], errore: ['Qualcosa', 'è andato storto'], attenzione: ['Attenzione', 'leggi bene'], info: ['Informazione', 'importante'] }[tipo];
      return <Stato tipo={tipo} titolo={testi[0]} testo={testi[1]} />;
    }
    case 'IconaChip': return <IconaChip kit={kit} nome={v.nome as typeof NOMI_ICONE[number]} lato={kit === 'rosso' ? 60 : 57} />;
    case 'Misuratore': return <Misuratore valore={82} />;
    case 'Caricamento': return <Caricamento />;
    case 'Logo': return <Logo lato={120} />;
    default:
      if (v.nome === 'stile-illustrativo') return <StileIllustrativo />;
      // disegnata a mano in SVG se c'è, altrimenti il ricalco vettoriale automatico
      return <Illustrazione kit={v.kit} gruppo={v.gruppo} nome={v.nome} formato={urlDisegno(v.kit, v.gruppo, v.nome) ? 'disegno' : 'svg'} />;
  }
}

function Scheda({ v }: { v: Voce }) {
  const [animato, setAnimato] = useState(false);
  // gli elementi larghi (indicatore di avanzamento, banner) occupano tutta la riga, uno sopra l'altro
  const largo = v.componente === 'Avanzamento' || v.nome === 'stile-illustrativo';
  const originale = urlPng(v.kit, v.gruppo, v.nome);
  const colore = { codice: '#1D4ED8', misto: '#7C3AED', grafica: '#15803D' }[v.tipo];
  return (
    <div style={{ border: '1.5px solid #E5E7EB', borderRadius: 16, padding: 14, background: '#fff', display: 'flex', flexDirection: 'column', gap: 10,
      gridColumn: largo ? '1 / -1' : undefined, overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
        <strong style={{ font: `700 14px ${FONT}`, color: '#0F172A' }}>{v.etichetta}</strong>
        <span style={{ font: `600 11px ${FONT}`, color: '#6B7280' }}>{v.kit.replace('kit-', 'kit ')}</span>
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <span style={{ font: `700 10px ${FONT}`, textTransform: 'uppercase', letterSpacing: '.08em', color: '#fff', background: colore, padding: '3px 8px', borderRadius: 6 }}>{v.tipo}</span>
        <span style={{ font: `700 10px ${FONT}`, textTransform: 'uppercase', letterSpacing: '.08em', color: v.cliccabile ? '#B91C1C' : '#6B7280', background: v.cliccabile ? '#FEE2E2' : '#F3F4F6', padding: '3px 8px', borderRadius: 6 }}>
          {v.cliccabile ? 'cliccabile' : 'non cliccabile'}
        </span>
        {v.componente && <code style={{ font: `600 11px ui-monospace, monospace`, color: '#374151' }}>&lt;{v.componente}/&gt;</code>}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: largo ? 'repeat(auto-fit, minmax(540px, 1fr))' : '1fr 1fr', gap: 10, alignItems: 'center', overflowX: 'auto' }}>
        <figure style={{ margin: 0, textAlign: 'center' }}>
          <div style={{ minHeight: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FEFEFE', borderRadius: 10 }}>
            {originale && <img src={originale} alt="" style={{ maxWidth: '100%' }} />}
          </div>
          <figcaption style={{ font: `500 10px ${FONT}`, color: '#9CA3AF', marginTop: 4 }}>originale</figcaption>
        </figure>
        <figure style={{ margin: 0, textAlign: 'center' }}>
          <div className={animato && v.animazione ? `brand-anim-${v.animazione}` : undefined}
            style={{ minHeight: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'visible', transform: 'scale(1)' }}>
            <div style={{ maxWidth: '100%', overflow: 'hidden' }}><Ricreato v={v} /></div>
          </div>
          <figcaption style={{ font: `500 10px ${FONT}`, color: '#9CA3AF', marginTop: 4 }}>{v.tipo !== 'grafica' ? 'in codice' : urlDisegno(v.kit, v.gruppo, v.nome) ? 'disegnato in SVG' : 'ricalco SVG'}</figcaption>
        </figure>
      </div>
      {v.animazione && (
        <label style={{ font: `500 12px ${FONT}`, color: '#374151', display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" checked={animato} onChange={e => setAnimato(e.target.checked)} /> animazione «{v.animazione}»
        </label>
      )}
      {v.nota && <p style={{ margin: 0, font: `500 11px/1.4 ${FONT}`, color: '#6B7280' }}>{v.nota}</p>}
    </div>
  );
}

function Verifica() {
  // Ogni voce in codice dentro un riquadro grande quanto il suo PNG, sul fondo della tavola
  const voci = CATALOGO.filter(v => v.tipo !== 'grafica' && v.componente && v.componente !== 'Misuratore' && v.componente !== 'Logo');
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, padding: 24, background: '#FEFEFE' }}>
      {voci.map(v => (
        <div key={`${v.kit}/${v.gruppo}/${v.nome}`} data-verifica={`${v.kit}/${v.gruppo}/${v.nome}`}
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: 8, background: v.kit === 'kit-blu' ? '#FEFDFE' : '#FEFEFE' }}>
          <Ricreato v={v} interattivo={false} />
        </div>
      ))}
    </div>
  );
}

export default function BrandKit({ onEsci }: { onEsci: () => void }) {
  const modo = new URLSearchParams(window.location.search).get('brand');
  const [filtro, setFiltro] = useState<'tutti' | 'codice' | 'misto' | 'grafica'>('tutti');
  if (modo === 'verifica') return <Verifica />;
  const voci = CATALOGO.filter(v => filtro === 'tutti' || v.tipo === filtro);
  const conta = (t: string) => CATALOGO.filter(v => v.tipo === t).length;
  const Filtro = ({ id, children }: { id: typeof filtro; children: ReactNode }) => (
    <button onClick={() => setFiltro(id)} style={{ font: `600 13px ${FONT}`, padding: '8px 14px', borderRadius: 10, cursor: 'pointer',
      border: '1.5px solid #E5E7EB', background: filtro === id ? '#0F172A' : '#fff', color: filtro === id ? '#fff' : '#0F172A' }}>{children}</button>
  );
  return (
    <div style={{ height: '100%', overflowY: 'auto', background: '#F6F8FC', padding: 20, boxSizing: 'border-box', font: `500 14px ${FONT}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
        <div>
          <h1 style={{ margin: 0, font: `800 26px ${FONT}`, color: '#0F172A' }}>Brand Kit AddiOFA</h1>
          <p style={{ margin: '4px 0 0', color: '#6B7280' }}>{CATALOGO.length} elementi: originale estratto accanto alla versione ricreata.</p>
        </div>
        <button onClick={onEsci} style={{ font: `600 13px ${FONT}`, padding: '8px 14px', borderRadius: 10, border: '1.5px solid #E5E7EB', background: '#fff', cursor: 'pointer' }}>Torna all'app</button>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        <Filtro id="tutti">Tutti ({CATALOGO.length})</Filtro>
        <Filtro id="codice">Codice ({conta('codice')})</Filtro>
        <Filtro id="misto">Misti ({conta('misto')})</Filtro>
        <Filtro id="grafica">Grafica ({conta('grafica')})</Filtro>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
        {voci.map(v => <Scheda key={`${v.kit}/${v.gruppo}/${v.nome}`} v={v} />)}
      </div>
      <p style={{ color: '#9CA3AF', font: `500 12px ${FONT}`, marginTop: 20 }}>
        SVG disponibili anche per gli elementi in codice: {urlSvg('kit-blu', 'ui', 'pulsante-primario') ? 'sì' : 'no'}.
      </p>
    </div>
  );
}
