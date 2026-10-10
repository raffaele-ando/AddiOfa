# Note agente B: funnel e schermate commerciali

## Fatto
- `screens/Landing.tsx`, `Paywall.tsx`, `Waitlist.tsx`, `Invites.tsx` (nuovi) e `components/PaymentThanks.tsx` (riscritto), con le props del brief. Tutti i numeri e le date vengono da `config/offer.ts` (prezzo con `currentPriceEur()`, data del lancio da `PASS.launchUntil`, scadenze da `OFA_DEADLINES`).
- `components/Onboarding.tsx`: tolti i passi `plans` e `goal`. Il passo `ready` è ora "Cosa ottieni gratis e cosa c'è nel Pass" con "Continua gratis" (chiude) e "Vedi il Pass". Il passo di login esiste solo se `FEATURE_FLAGS.projectId` è acceso e `VITE_MODE !== 'demo'`; la barra di avanzamento si adatta. `diag_done` parte una volta, quando si vede il risultato. Testi ripuliti (niente "ATLAS", niente promesse non verificabili; la stima cita la soglia `REAL_TEST_PASS_MARK`).
- `components/Plans.tsx` SVUOTATO con `export {};`.
- Anteprima isolata: `app/tests/anteprime/anteprima.html` + `anteprima.tsx` (AccessContext finto; parametri `s=landing|onboarding|paywall|waitlist|invites|thanks`, `tema=dark`, `mode=demo|prod`, `pass=1`, `reason=`). Il ramo `PAYMENTS_ENABLED` si vede avviando dev con `VITE_PAYMENTS_ENABLED=true VITE_STRIPE_LINK=https://buy.stripe.com/test_x`.

## Provato (Chromium, 400 px, chiaro e scuro, reduced-motion attivo)
Nessun scorrimento orizzontale, nessun errore in console (solo un 404 di risorsa nell'anteprima, estraneo). Flusso onboarding completo fino a "Vedi il Pass"; lista d'attesa (validazione, consenso, tracciamento); paywall con le due caselle (pulsante attivo solo con entrambe, apre il link con `client_reference_id`); sblocco demo che porta a "Hai già il Pass"; inviti. Non provato: il ramo con login (flag spento), Firefox/Safari, pagamento reale.

## Richieste ad altri
- Chi coordina: `git rm app/src/components/Plans.tsx` (ora è `export {};`). Poi togliere da `App.tsx` import e vista `plans`, e `onOpenPlans` in `Menu.tsx` (errori tsc attuali, tutti di A).
- A (App): `Onboarding` ha la nuova prop opzionale `onOpenPaywall()`; "Vedi il Pass" chiama prima `onFinish(result)` poi `onOpenPaywall()`. `onLogin` e `user` restano ma servono solo col flag Project ID.
- A (AccessContext): `Paywall` legge facoltativamente `userId` ed `email` dal contesto (oggi non esistono in `AccessValue`); senza `userId` usa un id anonimo in `localStorage` (`addiofa.anon-id`). Se il server deve associare il pagamento a un utente, serve concordare l'id e aggiungerlo al contesto.
- C: `Onboarding` regge sia `pickDiagnosticQuestions()` sincrona sia asincrona (`Promise.resolve`), ma assume domande di tipo `Question` con `correctIndex`; se il diagnostico passa dal server (risposta esatta non nel client) va riscritto il calcolo del punteggio.
- Chi coordina: `GuaranteeTracker.tsx` non l'ho toccato (compila già).

## Cosa non mi convince
- Landing e onboarding dicono "circa 3 minuti", ma per gli inviti conta solo un diagnostico di almeno 4 minuti (`INVITE.minDiagnosticSeconds`): incoerenza da valutare.
- Nella tabella Gratis/Pass del paywall ho messo "Spiegazioni in italiano" e "Statistiche complete" solo nel Pass, come da brief e `FEATURE_LABELS`: conferma che il nucleo gratuito non ha spiegazioni.
- "Senza account" nella Landing è vero finché il flag Project ID resta spento.
- Il testo legale dei link (Termini, Privacy, Cookie, Recesso) dipende da D; l'informativa della lista d'attesa dice solo "uso la tua email per questo avviso": va confermata con il testo di `Legal.tsx`.
