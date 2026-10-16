// Pagina di prova di Legal e Footer (non fa parte dell'app).
import { createRoot } from 'react-dom/client';
import { useState } from 'react';
import '../../src/index.css';
import Legal from '../../src/screens/Legal';
import Footer from '../../src/screens/Footer';
import type { LegalSection } from '../../src/types';

function Prova() {
  const q = new URLSearchParams(location.search);
  const [s, setS] = useState<LegalSection>((q.get('s') as LegalSection) || 'termini');
  return (
    <div className="h-full w-full bg-gray-100 dark:bg-[#0F172A] flex flex-col">
      <div className="flex-1 min-h-0">
        <Legal section={s} onSection={setS} onBack={() => {}} />
      </div>
      {q.get('footer') && <Footer onOpenLegal={setS} />}
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<Prova />);
