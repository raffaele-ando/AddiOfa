# Note agente D (pagine legali)

## Fatto
- `app/src/legal/`: `base.ts` (tipi `LegalDoc`, `LEGAL_SELLER` con i segnaposto, `righeVenditore()`), `termini.ts`, `privacy.ts`, `cookie.ts`, `recesso.ts`, `index.ts` (`LEGAL_DOCS`, `LEGAL_DRAFT = true`, `LEGAL_TABS`, riesporta `LEGAL_SELLER`). La struttura ha un campo in più: `modulo?: boolean` su una sezione del recesso, dove `Legal` inserisce il modulo.
- `app/src/screens/Legal.tsx`: quattro schede (tablist), indice richiudibile, avviso di bozza con data, modulo "Recedi dal contratto qui" (nome, email, riferimento facoltativo, "Conferma recesso") che chiama `useAccess().provider.requestWithdrawal` e mostra id, data e ora. Se `PAYMENTS_ENABLED` è falso lo dice, ma lascia il modulo.
- `app/src/screens/Footer.tsx`: link Termini · Privacy · Cookie · Recesso + `DISCLAIMER`.
- Anteprima: `app/tests/anteprime/legal.{html,tsx}` (AccessContext finto; query `?s=recesso&tema=dark&footer=1`). Verificato in Chromium a 400 px, chiaro e scuro: nessuno scorrimento orizzontale, modulo e ricevuta funzionanti. `tsc` pulito sui miei file.
- I prezzi nei Termini vengono da `config/offer.ts` (`PASS`), così non divergono.

## Da verificare con il consulente (non nel testo utente)
- Rimborso dopo il recesso: scritto "senza ritardo ingiustificato, con lo stesso mezzo di pagamento". Il termine di legge (14 giorni dalla comunicazione, art. 56) NON è nella ricerca: non l'ho scritto.
- Foro del consumatore: scritto senza citare l'articolo (non è nella ricerca).
- Conservazione dei dati d'ordine: scritta senza anni ("tempi degli obblighi fiscali"); il periodo va fissato.
- Cloudflare e Stripe aderiscono al Data Privacy Framework? La ricerca dice solo di preferire fornitori certificati: verificare prima di pubblicare.
- Hosting che tratta IP e dati di connessione (log): affermazione generica, da confermare con la configurazione reale.
- Fornitore delle email di servizio e di apertura: non scelto, citato senza nome nella privacy.
- Legittimo interesse (art. 6.1.f) per sicurezza e statistiche aggregate: scelta mia. Registro dei trattamenti e DPA (art. 28) sono da fare fuori dall'app.
- Clausola di sospensione dell'accesso per abuso (Termini, sez. 10): mia proposta, valutare il rischio di clausola vessatoria (art. 33).
- "Rispondiamo entro un mese" (diritti GDPR): termine ordinario dell'art. 12 GDPR, non nei documenti di ricerca.
- Chiavi `localStorage`: elencate `ofa_polimi_app_state`, `theme`, `sound_muted` (le uniche trovate nel codice oggi) più una voce generica per le chiavi di demo e lista d'attesa. Aggiornare quando A/B/C fissano i nomi.

## Richieste ad altri
- Checkout (B): "Come lo facciamo noi" nel Recesso assume due caselle non preselezionate (inizio immediato e riconoscimento della perdita del recesso) e un'email di conferma su supporto durevole. Se il checkout fa diversamente, vanno cambiati testo o checkout. Il pulsante d'ordine deve dire "ordine con obbligo di pagare".
- A/B: la funzione di recesso deve essere sempre raggiungibile (art. 54-bis, dal 19/6/2026): il footer porta alla scheda Recesso; quando i pagamenti saranno attivi conviene un link diretto anche da Paywall/ordine. Il `Footer` va montato nelle schermate (A decide dove).
- Privacy: dice che in produzione i progressi stanno anche sul server e che la cancellazione si chiede scrivendo al venditore; se arriva la cancellazione dell'account dentro l'app (Apple 5.1.1(v)), aggiornare il testo. Gli inviti non sono descritti nella privacy: se raccolgono email o codici va aggiunta una riga.
- `provider.requestWithdrawal` in prod deve mandare davvero la ricevuta via email (supporto durevole): la schermata lo promette "quando i pagamenti sono attivi".
- Prima di vendere: compilare `LEGAL_SELLER` in `legal/base.ts`, far rivedere i testi, poi `LEGAL_DRAFT = false`.
