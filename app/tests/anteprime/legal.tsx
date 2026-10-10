// Pagina di prova di Legal e Footer con un AccessContext finto (non fa parte dell'app).
import { createRoot } from 'react-dom/client';
import { useState } from 'react';
import '../../src/index.css';
import Legal from '../../src/screens/Legal';
import Footer from '../../src/screens/Footer';
import { AccessContext, type AccessValue } from '../../src/access/context';
import type { LegalSection } from '../../src/types';

const finto = {
  provider: {
    mode: 'demo',
    requestWithdrawal: async () => ({ receiptId: 'REC-DEMO-0001', at: Date.now(), stored: 'device' as const }),
  },
  entitlement: { tier: 'free', source: 'none', expiresAt: null },
  pass: false,
  simsDone: 0,
  refresh: async () => {},
  unlockDemo: async () => {},
  track: () => {},
} as unknown as AccessValue;

function Prova() {
  const q = new URLSearchParams(location.search);
  const [s, setS] = useState<LegalSection>((q.get('s') as LegalSection) || 'termini');
  return (
    <AccessContext.Provider value={finto}>
      <div className="h-full w-full bg-gray-100 dark:bg-[#0F172A] flex flex-col">
        <div className="flex-1 min-h-0">
          <Legal section={s} onSection={setS} onBack={() => {}} />
        </div>
        {q.get('footer') && <Footer onOpenLegal={setS} />}
      </div>
    </AccessContext.Provider>
  );
}

createRoot(document.getElementById('root')!).render(<Prova />);
