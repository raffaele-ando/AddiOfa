# Brief comune per gli agenti: AddiOFA prodotto finito

Leggi prima, in quest'ordine: `CLAUDE.md` (regole e mappa), `docs/business/AddiOFA_piano_definitivo.md` (cosa deve essere il prodotto), `app/DEMO.md`, i file di contratto elencati sotto. Il piano di esecuzione è `/root/.claude/plans/sharded-kindling-jellyfish.md`.

## Il prodotto in breve

AddiOFA prepara al test d'inglese dell'OFA del Politecnico di Milano. Un solo prodotto: **Pass AddiOFA 14,99 € una tantum** (lancio 9,99 € fino al 31/01/2027), valido 12 mesi. Gratis: diagnostico da 10 domande con probabilità di superare il test, nucleo di circa 100 domande con ripasso intelligente, una simulazione, una scheda di teoria. A pagamento: tutte le domande, simulazioni illimitate nei due formati (`ente`: 30 domande/15 min/soglia 25/4 opzioni; `teng`: 30/15/soglia 24/5 opzioni/-0,25 per errore), spiegazioni in italiano, teoria dei 31 argomenti, ripasso sugli errori, statistiche complete. Due pubblici: chi ha l'OFA (recupero) e chi prepara il test d'ingresso (prevenzione).

I pagamenti restano **spenti** (`PAYMENTS_ENABLED` in `app/src/config/offer.ts`): il pulsante d'acquisto porta alla lista d'attesa; in demo c'è "Sblocca il Pass in prova". Niente garanzia di rimborso, niente classifica, niente login Project ID, niente ambassador nel lancio (flag in `FEATURE_FLAGS`). **Vietato** inventare: urgenza finta o timer che riparte, notifiche con attività altrui, "probabilità" senza calcolo, recensioni, percentuali di successo, "domande identiche al test", "ufficiale". Il testo deve essere onesto, in italiano chiaro, a voce di persona (non da marketing urlato).

## Vincoli tecnici dell'Artifact (la versione online)

Pagina unica; nessuna rete esterna (niente fetch, niente font da Google, Firebase non funziona), nessun `alert`/`confirm`/`prompt` (usare `components/ConfirmDialog.tsx` e messaggi nella pagina), nessun download iniziato dalla pagina (nascondere "Esporta" in demo), nessun service worker, `localStorage` sempre in `try/catch`, deve funzionare a 400 px senza scorrimento orizzontale, in tema chiaro e scuro, con `prefers-reduced-motion` rispettato. Peso totale della pagina sotto 8 MB.

## Contratti già scritti (non cambiarli senza dirlo a chi coordina)

- `app/src/config/offer.ts`: `PASS`, `currentPriceEur()`, `isLaunchPrice()`, `FORMATS`, `FREE_LIMITS`, `INVITE`, `FEATURE_FLAGS`, `PAYMENTS_ENABLED`, `STRIPE_LINK`, `OFA_*`, `DISCLAIMER`. (`Plans.tsx` usa simboli rimossi: lo toglie l'agente B.)
- `app/src/access/provider.ts`: interfaccia `DataProvider` (tutti i metodi async).
- `app/src/access/entitlement.ts`: `canUse`, `isPass`, `canStartSim`, `remainingFreeSims`, `countFreeSims`, `FREE_ENTITLEMENT`.
- `app/src/access/context.tsx`: `AccessContext`, `useAccess()` → `{ provider, entitlement, pass, simsDone, refresh, unlockDemo, track }`.
- `app/src/data/bank.ts`: `QuestionMeta`, `toMeta`, `toPublic`, `isCore`.
- `app/src/lib/exam.ts`: `poolForFormat`, `selectExamQuestions`, `prepareQuestion`, `scoreExam`.
- `app/src/types.ts`: `Question.extraOption`, `ExamHistory.format`, `LegalSection`, `PaywallReason`.
- Le schermate di studio (`ExamMode`, `LearnMode`, `PracticeMenu`, `StatsMode`, `CheatSheet`) ricevono da App una prop `onNeedPass(reason: PaywallReason): void` da chiamare quando serve il Pass.
- Schema D1 `questions` (lo scrive `pass/migrations/0001_init.sql`, lo riempie il generatore dei contenuti): `id TEXT PRIMARY KEY, prompt TEXT NOT NULL, options TEXT NOT NULL (array JSON), extra_option TEXT, correct_index INTEGER NOT NULL, explanation_it TEXT NOT NULL, theory_id TEXT, category TEXT NOT NULL, level TEXT, grammar_topic TEXT, core INTEGER NOT NULL DEFAULT 0`.
- `app/src/data/questions.ts` è GENERATO da `contenuti/` (non modificarlo a mano); esporta `questions`, `getQuestionsByCorpus` (il corpus `'initial'` = domande con `core: true`) e `INITIAL_CORPUS_COUNT`.
- `app/src/components/ConfirmDialog.tsx`.

## Contratto delle schermate (proprietario → chi le usa)

Tutte le schermate sono componenti default-export, usano `Screen`, `TopBar`, `PrimaryButton`, `SecondaryButton` di `components/ui.tsx`, i token di `src/brand/tokens.ts` e le illustrazioni di `src/brand/Illustrazione.tsx` (kit rosso, disponibili in `src/brand/essenziali/disegni/`). Stile: lo stesso dell'app esistente (rosso `#EF4444` come colore d'azione, Inter, angoli larghi, tema scuro con `dark:`).

| Componente | File | Props | Proprietario |
|---|---|---|---|
| Landing | `screens/Landing.tsx` | `{ onStartDiagnostic(): void; onSkip(): void; onOpenLegal(s: LegalSection): void }` | B |
| Paywall | `screens/Paywall.tsx` | `{ onBack(): void; onWaitlist(): void; onOpenLegal(s: LegalSection): void; reason?: PaywallReason }` (usa `useAccess()`) | B |
| Waitlist | `screens/Waitlist.tsx` | `{ onBack(): void; onDone(): void; onOpenLegal(s: LegalSection): void }` | B |
| Invites | `screens/Invites.tsx` | `{ onBack(): void }` | B |
| Theory | `screens/Theory.tsx` | `{ onBack(): void; onOpenPaywall(): void; initialTopicId?: string }` | H (dopo) |
| Legal | `screens/Legal.tsx` | `{ section: LegalSection; onBack(): void; onSection(s: LegalSection): void }` | D |
| Footer | `screens/Footer.tsx` | `{ onOpenLegal(s: LegalSection): void }` | D |
| ThanksStripe | `components/PaymentThanks.tsx` | `{ onContinue(): void }` | B |

Viste di `App.tsx` (proprietario A): `'landing' | 'onboarding' | 'menu' | 'practiceMenu' | 'learn' | 'exam' | 'stats' | 'cheatsheet' | 'paywall' | 'waitlist' | 'invites' | 'theory' | 'legal' | 'thanks' | 'brand'` (+ `'profile'`, `'leaderboard'` dietro `FEATURE_FLAGS`). Un utente nuovo apre `landing`; chi ha già progressi apre `menu`.

## Regole di lavoro

- Tocchi **solo** i tuoi percorsi (sotto). Se ti serve una modifica altrove, scrivila in `NOTE.md` ("Richieste ad altri") e vai avanti con un ripiego.
- Niente git (commit e push li fa chi coordina). Niente `rm` e niente cancellazione di file di altri: se un file tuo va tolto, lascialo e dillo nel NOTE.
- `npx tsc --noEmit` in `app/`: gli errori nei file degli altri agenti, mentre lavorano in parallelo, non sono tuoi. I tuoi file devono compilare.
- Scrivi `NOTE.md` nella tua cartella (o `docs/lavoro/note-<id>.md` se non ne hai una) con: cosa hai fatto, cosa non ti convince, cosa hai imparato, richieste ad altri.
- Testi in italiano. Niente emoji nell'interfaccia (usa `lucide-react`). Commenti in italiano, brevi, solo dove serve.
- Prima di dire "fatto": i tuoi file compilano, hai guardato lo schermo con Chromium se hai fatto schermate (Playwright Python con `executable_path='/opt/pw-browsers/chromium'`; vedi `/tmp/claude-0/-home-user-AddiOfa/553cbc19-7099-5f91-95ed-46eecd1a1a4a/scratchpad/shot.py` come modello: `python3 shot.py <file.html> <out.png> 400 800 light`; per le singole schermate puoi usare `npm run dev` in `app/` su una porta libera e puntare Playwright a `http://localhost:<porta>`).
- Rapporto finale breve (max 25 righe): file creati o cambiati, cosa funziona e cosa no, richieste ad altri.
