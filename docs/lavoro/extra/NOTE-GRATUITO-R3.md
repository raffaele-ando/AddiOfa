# NOTE-GRATUITO-R3 (schermate, legale, registro icone)

Agente R3, 16/10. Percorsi toccati: `app/src/screens/**`, `app/src/legal/**`, `app/src/brand/icone/registro/*.json`.

## Cosa è stato tolto o cambiato

**Schermate di primo livello**
- `Paywall`, `Waitlist`, `Invites`: svuotate (`export {}`), da cancellare. Non le importa più nessun file di `src/`.
- `Landing.tsx`: via banner «versione dimostrativa», prop `onOpenPass`, sezione Offerta (prezzi, «Avvisami»). Props ora: `onStartDiagnostic`, `onSkip`, `onOpenLegal`.
- `landing/Offerta.tsx`: svuotata, da cancellare. `landing/Barra.tsx`: via l'ancora «Prezzi». `landing/Faq.tsx`: voci riscritte (costo = niente, diagnostico, stima, dove restano i progressi, indipendenza); via Pass, recesso, lista d'attesa.
- `landing/dati.tsx`: via `CONFRONTO`, `Cella`, `MOTIVI_PASS`, `TabellaConfronto`, `BloccoPrezzo`. Restano `CONSEGUENZE`, `TestoOfa` (usati da Onboarding). `landing/Passi.tsx`: via le pastiglie gratis/Pass. `landing/comune.tsx`: `Fatti` mostra «Gratis» solo con la prop `gratis` (la passa solo l'Hero, non Onboarding).
- `Footer.tsx`: via recesso e `NotaRecesso`; `ICONE_LEGALI` ha tre voci; resta `InfoIndipendenza`. L'avvertenza è `DISCLAIMER` di `config/offer.ts` (ri-esportato da `legal` come `AVVERTENZA_INDIPENDENZA`).
- `Legal.tsx`: via bozza, modulo di recesso, `useAccess`; tre schede.
- `Impostazioni.tsx`: nuove props `{ onBack, onOpenLanding?, onOpenLegal, onImport?, onExport?, onOpenDebug?, onVai?, onReset? }`. Via: gruppo Account/login, riga Materiale (nucleo/tutto), tessera Pass, Recesso, PoweredByAtlas, «· demo», bozze legali. **R1 deve allineare la chiamata in App** (non passare più `utente`, `onOpenPaywall`, `onLogin`, `onLogout`, `onOpenProfile`, `corpus`, `onCambiaCorpus`).
- `Lezioni.tsx`: via props `corpus`, `onSelectCorpus`, `onOpenPaywall`, `onNeedPass`, `onOpenLeaderboard`. Restano opzionali `onOpenStats`, `onStartErrors`, `onOpenTheory`, `onOpenTheoryTopic`, `onStartFocus`, `onOpenDiagnostic` (già inutilizzate prima): R1 può smettere di passarle e poi si tolgono.
- `Theory.tsx`: via `onOpenPaywall`, `useAccess`, `FREE_LIMITS`, lucchetti; tutte le 31 schede aperte; gli argomenti non pronti non si elencano (nessun «in arrivo»). Props: `onBack`, `initialTopicId`.

**Legale (`legal/`)**: riscritti `termini`, `privacy`, `cookie` per un sito gratuito, statico, senza account e senza cookie; `LEGAL_DRAFT`, `LEGAL_SELLER`, `righeVenditore` e il campo `modulo` spariti. `recesso.ts` svuotato (da cancellare). Nessun contatto (nessun indirizzo vero): rimando a «Segnala». Nessun marcatore «bozza» in app. **I testi restano una bozza da far rivedere a un professionista** (qui lo dichiaro, in app no, come da brief). Data: 16 ottobre 2026.

**Schermate extra**
- `contesto.tsx` (`ExtraCtx`): via `pass`, `demo`, `apriPaywall`, `apriInviti`. **R1: togliere gli stessi campi da `ctxExtra` in App.**
- Registri: via `pass` (profilo) e `projectid` (servizi). Svuotati, da cancellare: `profilo/Pass.tsx`, `profilo/CorpoPass.tsx`, `servizi/ProjectId.tsx`, `sfide/AccessoSbloccato.tsx`.
- Profilo: via tessera Pass, pillola Pass, tessera Project ID; resta livello + Progressi/Obiettivi/Badge. `componenti.tsx`: `useBanco()` ora restituisce tutto il banco; il livello usa `livelloAttuale(stats, banco)`, i badge `valutaBadge({ stato, banco })` (firme già aggiornate da R1).
- Badge: filtri «Ottenuti / Da ottenere» al posto di sbloccati/bloccati, via lucchetto sull'immagine e riga «serve il Pass».
- Progressi: `StatsMode` senza `onNeedPass`. ProgressiArgomenti: via il riferimento al nome del motore Atlas.
- Sfide: `Classifica` senza riga NOI (solo classifica locale); il banco delle sfide è tutto il banco (`poolMeta()`: l'impronta nel link cambia, i vecchi link di prova non valgono più); `SfidaGioco`/`SfidaRisultato`/`SimulazioneDettaglio` usano `provider` da `../access` invece di `useAccess`.
- Studio: `Simulazioni` senza limite e senza lucchetto, usa `EXAM`; `Percorso`/`LezioneDettaglio` usano `lezioniPercorso(appState)` (senza `disponibili`/`teoriaBloccata`); `Frasi` senza filtro nucleo e senza pulsante Pass.
- Servizi: FAQ con categorie test/studio/dati/app (come `lib/servizi/faq.ts` di R1); Offline e Segnala senza riferimenti a server, inviti, lista d'attesa.

**Registro icone**: rimosse le chiavi non più usate da nessun file: `validita, prezzo, pagamento-unico, illimitato, lista-attesa, recesso` (ingresso), `inviti, compagno, email-verificata, sblocca, usa-codice, agora, materiale, materiale-nucleo, materiale-tutto, accedi, stato-prova` (profilo). Rigenerato con `node tools/genera-icone.mjs` (145 icone, nessun errore). Possibili SVG orfani in `brand/icone/svg/` per le icone tolte.
Restano per ora, perché ancora citate da componenti di R2 da cancellare: `pass`, `garanzia`, `projectid`, `classifica-noi`, `partecipanti`, `esci`, `scadenza`, `codice`. **Da togliere dopo la cancellazione di `PaymentThanks`, `GuaranteeTracker`, `ProjectConsent`, `ProjectProfile`, `Leaderboard`.** `blocco` resta per «Solo esami del 1° anno» (conseguenza dell'OFA, non un lucchetto di accesso).

## File da cancellare (non cancellati da me)
`app/src/screens/Paywall.tsx`, `Waitlist.tsx`, `Invites.tsx`, `screens/landing/Offerta.tsx`, `screens/extra/profilo/Pass.tsx`, `profilo/CorpoPass.tsx`, `screens/extra/servizi/ProjectId.tsx`, `screens/extra/sfide/AccessoSbloccato.tsx`, `app/src/legal/recesso.ts` (tutti ora `export {}`).

## Richieste agli altri
- R1: App.tsx deve smettere di importare Paywall/Waitlist/Invites e allineare le props di Impostazioni, Lezioni, Landing, Theory e `ctxExtra` (vedi sopra). `app/tests/anteprime/*.tsx` (non assegnato a nessuno) importa ancora Paywall/Waitlist/Invites, `AccessContext`, `PaywallReason`: non compila più e va riscritto o tolto.
- R2: `Onboarding` importa ancora da `landing/dati` solo `CONSEGUENZE` (ok). I componenti elencati sopra, una volta non referenziati, vanno svuotati o cancellati per far scendere a zero gli errori `tsc`.
- Fuori dai miei percorsi, da sistemare: `brand/Splash` ha lo slogan «Studia oggi, sblocca il tuo domani.»; la scena dell'Hero (`brand/hero`) contiene una carta «Piano di studi bloccato» con lucchetto (si riferisce all'OFA, ma da rivedere nel ridisegno della landing).

## Verifiche fatte (numeri veri)
- `npx tsc --noEmit` da `app/`: **0 errori nei miei percorsi** (`src/screens`, `src/legal`). Gli errori rimasti (circa 40) sono tutti in file di R2 da togliere (`DebugMode`, `GuaranteeTracker`, `Leaderboard`, `PaymentThanks`, `ProjectConsent`, `ProjectProfile`) e in `tests/anteprime`.
- `npm test` dalla radice: 209 test, 209 ok (nessuno mio da modificare).
- `node tools/genera-icone.mjs`: ok, 145 icone.
- `tools/controlla-testo.py` a 400 px su 19 viste (home, lezioni, simulazioni, profilo, progressi, obiettivi, badge, profilo-modifica, sfide, amici, classifica, frasi, percorso, faq, segnala, offline, stato-vuoto, condividi): **0 blocchi sopra 5 parole**.
- Grep `pass|paywall|demo|beta|prova|sblocca|lucchett|premium|nucleo|...` sui miei percorsi: restano solo usi leciti (riprova/riprovare, «in attesa» di un duello, `bozza` = bozza del form profilo, `sbloccato` come campo dei badge in `lib/profilo`, «gratis» nel testo di marketing della landing e nei termini).
- Chromium (server Vite su 5253, ora fermato), dev server: landing a 400 e 1280 px chiaro e scuro; profilo, badge, progressi, sfide, amici, classifica, percorso, frasi, FAQ, segnala, simulazioni a 400 e 1280 chiaro e scuro; impostazioni, termini, teoria e sfida del giorno a 400 chiaro e 1280 scuro. Screenshot letti a occhio per landing, profilo, simulazioni, sfide, classifica, badge, progressi, FAQ, percorso, impostazioni, termini, teoria. Nessun errore di console e nessuno scorrimento orizzontale nelle esecuzioni riuscite; un primo giro a 1280 chiaro ha dato `ERR_CONNECTION_REFUSED` perché il server di sviluppo si è interrotto mentre altri agenti modificavano i file, e non l'ho ripetuto per le stesse viste.

## Non provato
- `npm run build` e `build:demo` (non lanciati: App e componenti degli altri sono ancora in lavorazione). Pagina `?sfida=` (duello ricevuto) e consegna di una sfida fino al risultato: solo la schermata iniziale della sfida del giorno è stata aperta. Landing 1280 px in scuro e viste sfide/extra a 1280 chiaro non riletti a occhio. Import/export dei progressi: dipende da App (R1). Revisione legale professionale: non fatta.
