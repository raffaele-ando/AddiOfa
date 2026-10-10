// Anteprima isolata delle schermate del funnel, con un AccessContext finto. Solo per lavorare in locale.
// Uso: http://localhost:<porta>/tests/anteprime/anteprima.html?s=landing|onboarding|paywall|waitlist|invites|thanks
//   &tema=dark  &mode=demo|prod  &pass=1  &reason=teng  &parte=ready (passo dell'onboarding da cui partire non è supportato: si naviga)
import { StrictMode, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../../src/index.css';
import { Layout } from '../../src/components/Layout';
import { AccessContext, type AccessValue } from '../../src/access/context';
import type { DataProvider, Entitlement } from '../../src/access/provider';
import type { AppState, PaywallReason } from '../../src/types';
import Landing from '../../src/screens/Landing';
import Paywall from '../../src/screens/Paywall';
import Waitlist from '../../src/screens/Waitlist';
import Invites from '../../src/screens/Invites';
import Onboarding from '../../src/components/Onboarding';
import PaymentThanks from '../../src/components/PaymentThanks';

const q = new URLSearchParams(location.search);
if (q.get('tema') === 'dark') document.documentElement.classList.add('dark');
const mode = (q.get('mode') ?? 'demo') as 'demo' | 'prod';
const conPass = q.get('pass') === '1';

const NUOVO: Entitlement = { tier: 'free', source: 'none', expiresAt: null };
const CON_PASS: Entitlement = { tier: 'pass', source: 'demo', expiresAt: Date.now() + 365 * 864e5 };

const provider: DataProvider = {
  mode,
  getEntitlement: async () => NUOVO,
  getQuestions: async () => [],
  grade: async () => ({ correct: true, correctIndex: 0, explanation: '' }),
  startExam: async () => { throw new Error('no'); },
  submitExam: async () => { throw new Error('no'); },
  joinWaitlist: async () => ({ ok: true, stored: 'device', message: mode === 'demo' ? 'Salvata solo su questo dispositivo: in questa versione dimostrativa non parte nessuna email.' : 'Ti scriveremo una sola volta, quando i pagamenti aprono.' }),
  createInvite: async () => ({ code: 'OFA-7K2Q' }),
  redeemInvite: async c => c.trim().toUpperCase() === 'OFA-7K2Q' ? { ok: false, message: 'Questo è il tuo codice: non puoi usarlo su te stesso.' } : { ok: true, message: 'Codice accettato: hai il 20 % di sconto.' },
  inviteProgress: async () => ({ code: 'OFA-7K2Q', verified: 1, required: 3 }),
  requestWithdrawal: async () => ({ receiptId: 'x', at: Date.now(), stored: 'device' }),
  track: e => console.log('track', JSON.stringify(e)),
};

const STATO = { stats: {}, history: [], streak: 0 } as unknown as AppState;

function App() {
  const [ent, setEnt] = useState<Entitlement>(conPass ? CON_PASS : NUOVO);
  const [log, setLog] = useState('');
  const access = useMemo<AccessValue>(() => ({
    provider, entitlement: ent, pass: ent.tier === 'pass', simsDone: 0,
    refresh: async () => {},
    unlockDemo: async () => setEnt(CON_PASS),
    track: e => console.log('track', JSON.stringify(e)),
  }), [ent]);
  const nota = (s: string) => () => { setLog(s); console.log('azione', s); };
  const legal = (s: string) => { setLog(`legal:${s}`); };
  const s = q.get('s') ?? 'landing';
  let corpo;
  if (s === 'landing') corpo = <Landing onStartDiagnostic={nota('diag')} onSkip={nota('skip')} onOpenLegal={legal} />;
  else if (s === 'onboarding') corpo = <Onboarding appState={STATO} user={null} onLogin={async () => {}} onUpdateAppState={() => {}} onFinish={r => setLog('finish ' + JSON.stringify(r))} onOpenPaywall={nota('paywall')} />;
  else if (s === 'paywall') corpo = <Paywall reason={(q.get('reason') ?? 'generico') as PaywallReason} onBack={nota('back')} onWaitlist={nota('waitlist')} onOpenLegal={legal} />;
  else if (s === 'waitlist') corpo = <Waitlist onBack={nota('back')} onDone={nota('done')} onOpenLegal={legal} />;
  else if (s === 'invites') corpo = <Invites onBack={nota('back')} />;
  else corpo = <PaymentThanks onContinue={nota('continua')} />;
  return (
    <AccessContext.Provider value={access}>
      <Layout>{corpo}</Layout>
      <output id="log" className="sr-only">{log}</output>
    </AccessContext.Provider>
  );
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
