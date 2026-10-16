# Intuitivo: INGRESSO (landing, diagnostico, Pass, lista d'attesa, legale) (16/10)

Agente INTUITIVO-D. Porta di prova 5244. Screenshot prima/dopo in `docs/lavoro/extra/intuitivo/ingresso/` (`prima-*` e `dopo-*`, 400 e 1280 px, chiaro e scuro; il «prima» è solo chiaro e parziale).

## Cosa è cambiato (frasi -> icone/numeri)
- **Landing**: hero = titolo + una frase + riga di fatti a icone (10 domande · 3 min · gratis · senza account); i quattro vantaggi = icona + 1-2 parole; «Se non superi» = tre icone con numero (<25/30, ~30 €, 1° anno) + date; «Perché» = misuratore d'esempio + soglia 25/30 e 15 min; «Come funziona» = 4 passi icona + numeri + chip gratis/Pass; prezzi = due schede a righe icona+parola+valore (numero, spunta, lucchetto, infinito); FAQ = domande di 2-5 parole, risposte esenti; piè di pagina con i documenti a icone, avvertenza e recesso.
- **Onboarding**: ogni schermata = icona + 1-3 parole («Diagnostico», «Certificazione?», «OFA di inglese?», «Se non superi», «Calcolo», «Risultato», «Gratis o Pass»). Il risultato è misuratore + `7/10` + intervallo + soglia + titolo di fascia; le spiegazioni (cos'è la certificazione, regole OFA, significato della fascia, come si calcola) stanno dietro la «i» (`InfoFoglio`, `FoglioStima`). `CalcoloRisultato`: tre tappe icona + numero. «Pronto» = prezzo + tabella Gratis/Pass.
- **Paywall**: intestazione = icona del motivo + 2-3 parole (la riga corrispondente della tabella si evidenzia), prezzo/date in cifre (9,99 € · 14,99 € · 31/01/2027 · 12 mesi · 1×), tabella a icone, UN pulsante pieno («Avvisami»). Demo e pagamento spiegati dietro la «i».
- **Waitlist, PaymentThanks**: campo + pulsante, esito = icona (stato-ok, stato-errore, stato-prova); i messaggi del server dietro la «i». **Legal**: testi intatti (`data-testo-ok`), schede con icona. **Splash**: marchio + motto (esente).

## Funzione -> posto (tolto/unito)
- La tabella Gratis/Pass era in 3 posti con testi diversi (landing, fine onboarding, Paywall): ora una sola fonte (`landing/dati.tsx`: `CONFRONTO`, `TabellaConfronto`, `BloccoPrezzo`, `CONSEGUENZE`).
- «Se non superi» (landing e funnel) = stessi dati/icone (`CONSEGUENZE`). L'avvertenza di indipendenza sta nel piè di pagina (landing, Paywall) o dietro la «i» (`InfoIndipendenza`: intro, Pass, Waitlist). Il recesso (14 giorni) sta nel piè di pagina legale (`NotaRecesso`).
- Telefono della landing: le schede sono ora Home/Simulazioni/Lezioni (prima Home/Esercizi/Teoria/Progressi, obsolete).

## Icone (registro `ingresso.json`; le altre funzioni riusano i nomi degli altri registri)
| Funzione | Nome | Lucide |
|---|---|---|
| gratis | gratis | hand-heart |
| senza account | senza-account | user-x |
| spiegazioni in italiano | spiegazioni | message-square-text |
| costo del tentativo | costo | wallet |
| scadenze del piano | scadenze-piano | calendar-x |
| validità 12 mesi | validita | calendar-range |
| prezzo | prezzo | tag |
| pagamento unico | pagamento-unico | credit-card |
| illimitato | illimitato | infinity |
| lista d'attesa | lista-attesa | bell-ring |
| email | email | mail |
| salta | salta | skip-forward |
| menu | menu | menu |
| ricontrolla | ricontrolla | rotate-cw |
| certificazione | certificazione | file-badge |
| OFA | ofa | book-a |
| recesso | recesso | undo-2 |
| cookie | cookie | cookie |
| incluso (spunta) | stato-incluso | circle-check-big |
| Foglio stima: modello / intervallo / escluso / campione / garanzia / miglioramento | stima-modello, stima-intervallo, stima-escluso, stima-campione, stima-garanzia, stima-miglioramento | dices, move-horizontal, ban, chart-scatter, shield-alert, chart-spline |
Riusati da altri registri: diagnostico, probabilita, risposte (n. domande), tempo, soglia, livello, simulazioni, esercizi, errori, progressi, teoria, esame, pass, blocco, scadenza, documento, privacy, espandi, faq, dettaglio, stato-ok/-errore/-attenzione/-prova/-attesa, stato-risposta-sbagliata, avanti, chiudi, info.

## Cosa resta e perché
- Titolo dell'hero («Oltre l'OFA, un passo in più.»), frase («Scopri la probabilità di superare il test.»), «Il tuo futuro non si ferma a un test.», «Parti da dove sei oggi.»: marketing, `data-testo-ok` (titoli, non spiegazioni).
- Risposte FAQ, pagine legali, avvertenza, recesso, testi di consenso (casella della lista d'attesa e del Paywall): contenuto legale/FAQ, `data-testo-ok`. Domanda e opzioni del quiz: contenuto.
- Mini-schermate di «Come funziona» (visibili da 1024 px, `aria-hidden`) e telefono: illustrazioni dell'interfaccia con stringhe brevi di esempio (la prima è una domanda vera), marcate `data-testo-ok` le mini-schermate.
- Banda «Versione dimostrativa»: l'unica frase fissa (esente come da ARCHITETTURA §4).
- Pulsanti lunghi più di 4 parole: solo «Ordine con obbligo di pagare» (obbligo di legge, solo con pagamenti accesi) e «Sblocca il Pass in prova» (demo).

## Prove
- `tools/controlla-testo.py`-equivalente (stessa funzione JS, percorso a clic: landing, paywall, waitlist, legale, 11 passi dell'onboarding, grazie): **0 blocchi ≥ 6 parole** a 400 px; a soglia 4 restano solo etichette `sr-only` («Prezzo di lancio fino al…») e titoli di 4-5 parole.
- `npx tsc --noEmit`: nessun errore nei miei file (restano errori di altri agenti: StatsMode/Badge/SfidaRisultato); `npm test` 216/216; `node tools/genera-icone.mjs` ok (162 icone); nessun `lucide-react` nei miei file.
- Screenshot 400/1280, chiaro/scuro, letti a occhio (landing intera, tutti i passi del funnel, Pass, lista d'attesa, esito, legale, grazie): nessun scorrimento orizzontale. Console: un solo «404 risorsa» alla prima apertura, c'era anche prima e non ho trovato l'URL (non riproducibile). Non provati: Splash a video (modifica solo di marcatura), stato Paywall con pagamenti accesi, stato «Pass attivo» del Paywall, esito di errore della lista d'attesa, `build:demo` (vietato dal brief).

## Richieste al coordinatore
- `tools/controlla-contrasto.py` cerca bottoni per testo («Inizia il diagnostico», «Scopri come prepararti», «Vedi il tuo risultato», «Fai il diagnostico gratuito»): ora «Inizia», «Avanti», «Risultato», «Fai il diagnostico»; va aggiornato.
- `config/offer.ts` ha ancora `FREE_FEATURES`, `PASS.features`, `OFA_CONSEQUENCES` in frasi (non più usate da me; se non le usa nessuno si possono togliere). `components/ui.tsx` (Screen/TopBar/PrimaryButton/ChoiceCard) e `home/comune.tsx` (`RigaIntervallo`, frase non più usata qui) restano fuori dal mio perimetro; `ChoiceCard` non ha slot per icona.
- Non esistono file `CheatSheetStub*`: nulla da fare. Il Paywall non è raggiungibile dal funnel (`App.tsx` non passa `onOpenPaywall` a `Onboarding`): «Vedi il Pass» non compare.
