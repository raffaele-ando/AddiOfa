// Al posto di BrandKit.tsx nel build demo (alias in vite.demo.config.ts): il catalogo ?brand serve a chi disegna
// la grafica, non ai visitatori della pagina online, e pesa troppo per entrarci.
export default function BrandKit({ onEsci }: { onEsci: () => void }) {
  return (
    <div style={{ padding: 24, fontFamily: "'Inter', system-ui, sans-serif", textAlign: 'center' }}>
      <p style={{ margin: '48px 0 16px', fontSize: 16 }}>Il catalogo della grafica non è incluso in questa versione.</p>
      <button type="button" onClick={onEsci} style={{ border: 'none', borderRadius: 12, padding: '12px 20px', background: '#EF4444', color: '#fff', font: '600 15px Inter, system-ui, sans-serif', cursor: 'pointer' }}>
        Torna all'app
      </button>
    </div>
  );
}
