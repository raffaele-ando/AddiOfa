# Catalogo dei design allegati: blocco NN 36-51 e immagini alla radice di `grafica/fonti/`

Redatto guardando ogni immagine con Read e confrontandola con `app/src/screens/*.tsx`, `app/src/components/*.tsx`, `app/src/config/offer.ts` e `app/src/brand/`. Le percentuali e i testi riportati sono quelli visibili nei design, non verità del prodotto.

Priorità: **alta** = migliora subito il prodotto di lancio; **media** = utile dopo il lancio o con adattamento; **bassa/rimandata** = fuori dal lancio (Project ID, classifica, ambassador, garanzia, ecosistema ATLAS/NOI/Agorà, social).

Regole di prodotto usate per giudicare ("da adattare"): un solo prodotto Pass AddiOFA 14,99 € (lancio 9,99 € fino al 31/01/2027); nessuna garanzia di rimborso; nessuna classifica/Project ID nel lancio; mai "ufficiale", mai numeri inventati (12.000+ studenti, 82% "degli studenti parte a rischio", confronto con "migliaia di studenti del Polimi"), mai urgenza finta, niente "rischio di fallimento" allarmista (l'app mostra "probabilità stimata di superare il test"); mai nomi "CRAM Pass Pro", "Pass Simulatore", "Garanzia Promosso"; nessun sigillo del Politecnico in pubblico.

## Tabella riassuntiva

| NN | File | Tipo | Schermate / contenuto | Priorità | Schermata dell'app |
|---|---|---|---|---|---|
| 36 | `file_000000009df8...png` | schermate app (14, blu, ecosistema ATLAS/NOI/Agorà) | splash, onboarding, test adattivo, radar risultati, home con misuratore rischio, lezione, classifica, simulazioni (3), correzione, discussione, profilo Project ID, impostazioni | media (solo simulazioni, correzione, impostazioni, radar); il resto rimandata | Simulazione, Esito, Statistiche, Menu; Atlas/Profilo/Classifica fuori lancio |
| 37 | `file_000000009e5c...png` | social (profilo Instagram) | profilo, 5 highlight, 3 post del carosello | bassa/rimandata | nessuna (marketing) |
| 38 | `file_000000009fa4...png` | locandina | "Supera l'OFA di inglese e sblocca il tuo piano di studi" con foto Polimi, telefono, QR | bassa/rimandata (da adattare) | nessuna (marketing) |
| 39 | `file_00000000a5c4...png` | schermata app (home "rischio" con fattori) | home con misuratore 82%, obiettivo 20%, prossima lezione, streak, progressi | media (da adattare) | Home/Menu |
| 40 | `file_00000000bdec...png` | brand kit (art direction v1.0) | visione creativa, palette, tipografia, iconografia, foto, motion, pattern | media (riferimento, nulla da portare a codice subito) | Landing (immagini), brand |
| 41 | `file_00000000c23c...png` | landing desktop | hero chiaro con scala e stella, 5 voci di menu, 4 benefit, "Cos'è l'OFA" con 4 carte del rischio | alta per struttura, da adattare nei testi | Landing |
| 42 | `file_00000000c554...png` | schermate app (6 + 6 dettagli animazione) | calcolo del risultato animato, blu, ambra, rosso, 10/10 | alta (da adattare) | Onboarding: passo risultato |
| 43 | `file_00000000ddec...png` | schermate app (6) | calcolo del risultato con fattori, curva, costi, "Continua" / "Scopri come migliorare" | alta (da adattare) | Onboarding: rischio/risultato |
| 44 | `file_00000000e2cc...png` | icone | 14 icone a sfera: AddiOFA, Studio, Quiz, Risultati, Tips, Consigli, App, Polimi, OFA, Costi, Successi, FAQ, Opportunità, Community | media | Menu, Landing, social, FAQ |
| 45 | `file_00000000e554...png` | landing desktop | hero "Oltre l'OFA, un passo in più", 4 telefoni, 4 benefit, "Più di un semplice quiz", dato 82%, due riquadri foto con store | alta per struttura, da adattare (contiene numeri inventati) | Landing |
| 46 | `file_00000000e634...png` | locandina | "Supera l'OFA di inglese. Senza stress." con strappi staccabili e QR | bassa/rimandata | nessuna (marketing) |
| 47 | `file_00000000ecd4...jpg` | schermate app (14, rosso) | funnel a 14 schermate fino al pagamento (CRAM Pass Pro) | alta nelle prime 8, da adattare le 9-14 | Landing, Onboarding, Risultato, Paywall |
| 48 | `file_00000000ef14...png` | social (copertine video, caroselli, reel, post) | 18 pezzi: 7 storie, 3 caroselli, 5 reel, 2 post | bassa/rimandata | nessuna (marketing) |
| 49 | `file_00000000fac0...png` | schermate app (14, blu, esplora) | splash, onboarding, home, lezioni, esercizio, simulazioni, profilo, Esplora, ATLAS (2), NOI (2), Agorà (2) | media (elenco lezioni, esercizio, Profilo/impostazioni); ecosistema rimandata | Menu, Teoria, Simulazione; Atlas fuori lancio |
| 50 | `file_00000000fb5c...jpg` | brand kit (blu, "kit f") | palette, 8 illustrazioni principali, 10 contestuali, 14 icone, stati, UI, progress | media (già nel kit estratto) | tutta l'app (brand) |
| 51 | `file_00000000fe44...png` | landing desktop | hero scuro cinematografico, fascia "La realtà / Il tuo domani", "Un percorso su misura, in 4 passi" | alta per struttura, da adattare | Landing |
| R1 | `home-escluso.png` | schermata app (home rossa) | "Bentornato, Raffaele", Continua a studiare, progressi 62%, obiettivo, 3 strumenti, tab bar a 3 voci | media (esclusa dall'estrazione; l'app ha già una home più ricca) | Home/Menu |
| R2 | `kit-blu.png` | brand kit | come NN 50, versione 1881×836 | media | brand |
| R3 | `kit-rosso.png` | brand kit | personaggi, contestuali, icone, UI, stati: il kit in uso nell'app | alta (è il kit già adottato) | tutta l'app |
| R4 | `logo-riferimento.png` | icona | logo 3D: quadrato blu arrotondato con stella luminosa che apre una porta di luce | alta (già estratto) | icona app, Landing |
| R5 | `schermate-funnel-14.png` | schermate app (14, rosso) | stesso funnel di NN 47, più nitido | alta nelle prime 8, da adattare le 9-14 | Landing, Onboarding, Paywall |
| R6 | `schermate-funnel-6.png` | schermate app (6, rosso) | funnel corto: Sei pronto, Risultato, Come vuoi prepararti, CRAM Pass Pro, Pagamento, Tutto pronto | media (da adattare) | Onboarding, Paywall |
| R7 | `schermate-inviti-13.png` | schermate app (13, rosso) | funnel con inviti: 3 amici per sbloccare, classifica, profilo | media per inviti (già in `Invites.tsx`); classifica rimandata | Invites, Onboarding, Classifica |

## Cosa nel design manca nell'app (riepilogo)

Schermate o parti che il design mostra e l'app non ha ancora, in ordine di utilità per il lancio:

1. **Landing desktop a due colonne** (41, 45, 51): la landing attuale è una colonna di testo per il telefono (`Landing.tsx`, contenitore `max-w-3xl` in `Layout.tsx`). Mancano: barra di navigazione con link (Come funziona, Perché, Il percorso, FAQ), hero a tutta larghezza con grande illustrazione, riga di 4 benefit con icona, sezione "Cos'è l'OFA" con carte a catena, sezione "Un percorso in 4 passi" con mini-schermate, riquadro finale con call to action, sezione FAQ.
2. **Sequenza di calcolo del risultato** (42, 43): oggi dopo la domanda 10 si passa dalla schermata "Se non superi l'OFA..." al risultato, con il misuratore che sale in 0,9 s. Il design ha 5 passi di attesa con colore che scalda, chip delle aree, checklist e poi il risultato.
3. **Radar del risultato del diagnostico e "Aree da migliorare" con barre** (36 schermate 4 e 10): StatsMode ha già un radar per argomento, ma il diagnostico mostra solo il misuratore e l'elenco "Da ripassare".
4. **Correzione con confronto "La tua risposta / Risposta corretta / Spiegazione"** (36 schermata 11): in `ExamMode` l'esito mostra le sbagliate in rosso; il confronto a due caselle affiancate non c'è.
5. **Dettaglio simulazione prima di iniziare** (36 schermata 9) e **elenco "Le mie simulazioni"** (36 e 49): oggi c'è `PracticeMenu` e la scelta del formato, senza storico delle simulazioni come lista.
6. **Home con "prossima lezione consigliata"** e stima di riduzione (39): oggi la home ha solo "Continua a studiare" e progressi.
7. **Elenco lezioni numerate con spunta e stato** (49 schermata 4): `Theory.tsx` ha schede per argomento; non c'è una lista a 8 passi con avanzamento.
8. **Schermata Impostazioni** (36 schermata 14): oggi gli interruttori (suoni, tema) stanno nell'intestazione del Menu; manca una pagina Impostazioni con Account, Preferenze, Notifiche, Privacy, Aiuto, Informazioni.
9. **FAQ** (icona FAQ in 44, "Guida e FAQ" in 49): nell'app non c'è una schermata FAQ.
10. **Condivisione risultato / link con WhatsApp, Instagram, Messaggi** (R7): `Invites.tsx` ha il link, da verificare se c'è la riga di app con le icone.
11. Fuori lancio ma presenti nei design: classifica con podio, Project ID, ATLAS, NOI, Agorà, discussioni, badge, sfide, obiettivi, garanzia Promosso, ambassador.

---

## Schede

### NN 36: `file_000000009df882108810bb77083462e9.png` (flusso schermate d, 1536×1024)

Tipo: schermate app, 14 schermate in due righe, tema blu con ecosistema Project (ATLAS, NOI, Agorà). Le schermate sono collegate da frecce con il passaggio dall'home alle simulazioni.

Schermate:

1. **Splash**: sfondo bianco, grande onda blu in basso a sinistra, logotipo "AddiOfa" in nero e blu, sottotitolo "Supera l'OFA di inglese. Senza blocchi."
2. **Onboarding**: logo, "Studia in modo mirato con un percorso personalizzato grazie all'intelligenza di ATLAS", illustrazione fogli azzurri, tre punti di paginazione, pulsante blu "Inizia".
3. **Test iniziale (con ATLAS)**: barra di avanzamento 3/20, "Choose the correct form: If I ___ more time, I would travel.", quattro opzioni (have, had selezionata, will have, would have), riquadro ATLAS "adatta le domande al tuo livello in tempo reale". Test adattivo: non presente nell'app (il diagnostico ha 10 domande fisse).
4. **Risultati (ATLAS)**: "Il tuo livello", radar a 5 assi (Grammar 72%, Writing 62%, Vocabulary 58%, Reading 78%, Listening 65%), riquadro "ATLAS ha creato un percorso personalizzato per te. Più studi, più il rischio si abbassa", pulsante "Inizia il tuo percorso". Gli assi Writing/Reading/Listening non esistono nel banco (le categorie reali sono Grammatica e Traduzione).
5. **Home**: logo e avatar R, misuratore ad arco "82% Rischio di fallimento all'OFA di inglese", carta "Prossima lezione: Future tenses, 10 min, -6% rischio", pulsante "Inizia la lezione", mini-grafico "Il tuo progresso 82% Oggi, 62% Dopo 5 lezioni, 28% Dopo 15 lezioni", tab bar a 5 voci (Home, Studio, Simulazioni, Classifica, Profilo).
6. **Lezione**: barra 3/10, "Future tenses", "Completa la frase: We ___ to Milan tomorrow.", quattro opzioni (go, goes, will go selezionata, are going), banner verde "Corretto!" con spunta, pulsante "Avanti".
7. **Ranking (NOI)**: "Classifica", tab Settimanale/Mensile/Sempre, podio con tre avatar e punti, elenco 4-7, riga evidenziata "raffaele.ando 820 pt", riquadro NOI verde "Sfida gli altri, scala la classifica e sblocca badge esclusivi".
8. **Simulazioni**: elenco di 3 carte con icona (Simulazione completa 40 domande 60 min; Simulazione per argomento "Scegli l'argomento"; Le mie simulazioni "2 completate"), riquadro ATLAS "Le simulazioni si adattano a te".
9. **Dettaglio simulazione (ATLAS)**: "Simulazione personalizzata", righe 40 domande, 60 minuti, livello adattivo, focus su (Grammar, Future tenses, Modal verbs), pulsante "Inizia simulazione".
10. **Risultati simulazione**: anello 72% "Risultato simulazione 29/40 risposte corrette", riquadro ATLAS, "Aree da migliorare" con 4 barre colorate (Grammar 65% rosso, Vocabulary 80%, Listening 75%, Reading 90%), pulsante "Vedi analisi completa".
11. **Correzione con ATLAS**: "Domanda 12", etichetta rossa "Risposta sbagliata", frase, due caselle affiancate (La tua risposta: have in rosso; Risposta corretta: had in verde), carta "Spiegazione di ATLAS: Si usa il past perfect (had) per esprimere un'ipotesi non reale nel passato" (nota: la frase mostrata è un periodo ipotetico, il past perfect non c'entra; errore di contenuto del design), pulsante "Vedi altri esempi".
12. **Discussione (Agorà, contestuale)**: "Discussione", "Da una tua simulazione", domanda "Qual è il modo migliore per studiare i phrasal verbs?", commenti con avatar, "Più rilevanti / Più recenti", campo "Scrivi una risposta...".
13. **Profilo (Project ID)**: avatar R, "@raffaele.ando", carta "Project ID #4821", statistiche (12 livello, 320 pt, 7 sfide, 3 badge), voci (I miei progressi, Classifica NOI, Le mie sfide NOI, Discussioni Agorà, Obiettivi, Attività).
14. **Impostazioni**: elenco con icona e sottotitolo: Account (Email, password, sicurezza), Preferenze (Tema, lingua), Notifiche (Solo attività importanti), Privacy (Dati e permessi), Aiuto (FAQ e supporto), Informazioni (Versione dell'app).

Cosa c'è nel design e manca nell'app: il radar sul risultato del diagnostico (3-4); la riga "Aree da migliorare" con barre colorate (10); il confronto affiancato "La tua risposta / Risposta corretta" (11); la pagina Impostazioni (14); la lista "Le mie simulazioni" con dettaglio prima dell'inizio (8-9). Test adattivo e "livello adattivo": non fanno parte del lancio.

Corrispondenza: Simulazione (8, 9), Esito (10, 11), Statistiche (4), Menu (14); resto Atlas/Classifica/Profilo.
Priorità: media per 8-11 e 14; bassa/rimandata per 3 (adattivo ATLAS), 7, 12, 13.

Da adattare: "82% Rischio di fallimento" e "-6% rischio" per lezione (numeri senza modello, linguaggio allarmista); mini-grafico 82% → 62% → 28% (promessa di risultato inventata); "ATLAS" come marchio dell'intelligenza (nel lancio non c'è); "29/40" e "60 minuti" (i formati veri sono 30 domande in 15 minuti, soglia 25/24). Correzione: usare "Probabilità stimata di superare il test", sostituire le simulazioni da 40/60 con i due formati (`ente` e `teng`) e togliere il grafico di proiezione.

---

### NN 37: `file_000000009e5c81f4b0baad22bd7f8b7a.png` (profilo instagram, 1312×1199)

Tipo: social. Una sola schermata: pagina Instagram "addiofa".
Contenuto: avatar con stella blu a quattro punte su fondo crema; pulsanti Segui, Messaggio; "163 post, 12,4 mila follower, 12 seguiti"; biografia ("Il tuo inglese, senza ostacoli. L'app del Politecnico di Milano per superare l'OFA di inglese. Quiz, strategie e risorse... Small steps, big opportunities.") con link linktr.ee/addiofa; 5 highlight tondi (Studio, Quiz, Consigli, Risultati, Polimi) con le icone a sfera di NN 44; tre post: "Il tuo inglese, senza ostacoli." (1/6), "Cos'è AddiOFA?" (1/6) con telefono e quiz, "3 consigli per superare l'OFA di inglese" (1/5) con checklist.
Manca nell'app: niente (marketing). Corrispondenza: nessuna schermata; gli highlight riusano le icone.
Priorità: bassa/rimandata.
Da adattare: "12,4 mila follower, 163 post" sono numeri finti (mockup, non da pubblicare); "L'app del Politecnico di Milano" suggerisce un'app ufficiale, contraddice il disclaimer "Progetto studentesco indipendente e non ufficiale": scrivere "L'app per prepararti all'OFA di inglese del Polimi". Edificio con scritta "Politecnico di Milano" nelle foto: usare illustrazioni, non il marchio.

---

### NN 38: `file_000000009fa48210af14ab230db94824.png` (locandina b, 1024×1536)

Tipo: locandina verticale.
Contenuto: logo AddiOFA con stella nella O, "Il tuo inglese, senza ostacoli."; titolo "Supera l'OFA di inglese e sblocca il tuo piano di studi." (le ultime tre righe in blu, sottolineato a pennarello); nota a mano "Per studenti del Polimi"; quattro righe con icona (Testa il tuo livello in pochi minuti; Quiz e simulazioni realistiche; Ricevi un piano di studio personalizzato; Consigli pratici e risorse utili); QR "Scansiona e prova ora!" con linktr.ee/addiofa; telefono con quiz ("She ___ to Milan every day.", opzione "goes" in rosso) sopra la facciata del Politecnico; fascia in basso con tre punti (lucchetto "Evita di bloccare il tuo piano di studi", orologio "Risparmia tempo e soldi (circa 30€)", barre "Arriva preparato ai tuoi esami").
Manca nell'app: niente (stampa/promozione). Corrispondenza: nessuna; la scena del telefono è un mockup del quiz di valutazione.
Priorità: bassa/rimandata.
Da adattare: "Ricevi un piano di studio personalizzato" (l'app non ha un piano a tappe: ha ripasso intelligente); "Risparmia soldi (circa 30€)" va bene solo se spiegato come costo di un tentativo di recupero presso gli enti (`RETAKE_COST_EUR`); la facciata con la scritta "Politecnico di Milano" evoca affiliazione; nel quiz mostrato l'opzione "goes" è rossa ma è la risposta giusta per "She ___ to Milan every day" (errore del design da non copiare).

---

### NN 39: `file_00000000a5c482109d3b50ccba1d198e.png` (home fattori, 941×1672)

Tipo: schermata app singola, home "rischio" con fattori (blu e rosso).
Schermata, dall'alto in basso: barra di stato, logo AddiOfa e campanella; carta "Il tuo rischio OFA" con info, chip verde "-28% rispetto alla prima stima"; grande misuratore ad arco con pallino rosso "82% Rischio di fallimento all'OFA di inglese"; banner rosa con punto esclamativo "Rischio molto alto. Con il tuo livello attuale potresti non superare l'OFA. Inizia a studiare per ridurre il rischio."; pulsante blu "Inizia a studiare"; "Fattori che influenzano il tuo rischio" con 4 tessere con barra (Grammatica 20%, Comprensione 35%, Vocabolario 45%, Ragionamento 50%); carta verde "Il tuo obiettivo: riduci il rischio sotto il 20% per essere sicuro di superare l'OFA" con anello 20%; carta "Prossima lezione consigliata: Future tenses: will, going to, present continuous, -6% rischio stimato" con pulsante "Inizia la lezione, 10 min"; due carte "Streak di studio 3 giorni" (puntini spuntati) e "I tuoi progressi 12 lezioni" (mini grafico a barre); citazione "Ogni lezione ti avvicina a un rischio più basso e a un anno universitario senza blocchi."; tab bar Home, Simulazioni, Lezioni.
Manca nell'app: la carta grande con il misuratore in home (l'app lo mostra solo come riga "Probabilità stimata" in `Menu.tsx` e nel risultato); le tessere per area con barra; la carta "Prossima lezione consigliata" con durata; la striscia di 6 puntini per la costanza (c'è solo la fiamma con il numero).
Corrispondenza: Home/Menu.
Priorità: media (da adattare).
Da adattare: tutto ciò che è "rischio di fallimento" in rosso con testo "Rischio molto alto" (allarmista); "-28% rispetto alla prima stima" e "-6% rischio stimato" (numeri senza calcolo); "Comprensione, Ragionamento" (aree che il banco non ha). Correzione: usare "Probabilità stimata di superare il test: X%" ricalcolata dai dati veri (diagnostico + simulazioni); tessere per le categorie reali (Grammatica, Traduzione) o per argomento di grammatica; il pulsante "Prossima lezione" può puntare alla scheda di teoria dell'argomento più debole (`weakTopics`) con durata reale; l'obiettivo "sotto il 20%" va sostituito con "soglia 24/30" o "25/30". La striscia dei giorni è copiabile (è onesta: giorni reali).

---

### NN 40: `file_00000000bdec81f4a150d09e9b243045.png` (art direction, 1536×1024)

Tipo: brand kit / tavola di direzione artistica ("ART DIRECTION v1.0"). Una sola tavola con 12 riquadri.
Riquadri: copertina scura con logo e "Il tuo inglese, senza ostacoli." con studente che sale una scalinata verso una porta a forma di stella luminosa ("Politecnico di Milano 2026", "Small steps big opportunities"); Visione creativa "Trasformare un ostacolo in un'opportunità"; Brand mood (4 foto con parole Curiosità, Progresso, Sicurezza, Libertà; "Dalle difficoltà alle opportunità"; telefono con icona; "Stessi studenti. Percorsi più luminosi."); Direzione visiva (Minimal, Moderna, Luminosa, Istituzionale ma friendly, Focalizzata sullo studente, Positiva e motivante); Elementi chiave (La stella come guida, Percorso e crescita, Luce e orizzonte, Studenti reali e contesto Polimi); Palette (#0F172A primario, #3B82F6 secondario, #60A5FA azzurro, #F6F8FC sfondo, #E5E7EB superfici, #6B7280 testo secondario; rischio #EF4444, attenzione #F59E0B, successo #22C55E, quiz/apprendimento #8B5CF6); Tipografia Inter (Light/Regular/Medium/Semibold/Bold); Iconografia (6 icone a sfera); Stile illustrazioni (quiz, misuratore 82%, globo, calendario con lucchetto); Stile fotografico (5 foto); 3D e render; Motion direction (transizioni fluide, percorsi in movimento, micro-interazioni, atmosfere ariose); Pattern e background.
Manca nell'app: nulla da codice; la palette e Inter coincidono con `app/src/brand/tokens.ts` (kit rosso: #EF4444 come azione). Il design usa il blu come primario, l'app il rosso: le due varianti sono kit-blu e kit-rosso e l'app ha adottato il rosso. Il copione "stella come porta di luce" è già nel logo (`logo-riferimento.png`).
Corrispondenza: Landing (immagini e tono), brand.
Priorità: media (riferimento).
Da adattare: foto reali con scritta "Politecnico di Milano" (nessuna autorizzazione al marchio); "Istituzionale" come direzione visiva può dare l'impressione di ufficialità; il frame "Politecnico di Milano 2026" nella copertina va tolto.

---

### NN 41: `file_00000000c23c82108838e288ab528e67.png` (landing desktop, 1536×1024)

Tipo: landing desktop, chiara e luminosa, due sezioni visibili.
Elenco, dall'alto:
1. **Barra**: logo AddiOFA a sinistra; pillola centrale con voci Home (attiva), Come funziona, Perché è importante, Il percorso, FAQ; pulsante blu "Scarica l'app" con freccia a destra.
2. **Hero**: etichetta "POLITECNICO DI MILANO"; titolo "L'inglese a Polimi senza sorprese." (ultima riga blu); sottotitolo "Verifica il tuo livello, scopri se sei a rischio e preparati per superare l'OFA di inglese."; due pulsanti "Inizia la verifica" (pieno, blu) e "Scopri di più" (contorno); riga di 4 benefit con icona (Quiz realistici: come l'esame; Piano su misura: per il tuo livello; Evita blocchi: al piano di studi; Creato per gli studenti del Polimi); indicatore "Scroll per scoprire". A destra, scena 3D: porta blu con stella luminosa in cima a una scalinata, intorno carte di vetro fluttuanti ("Probabilità di non superare l'OFA 82%", quiz con bandiera britannica, "Piano di studi bloccato" con lucchetto), scritte a mano "Same students, brighter paths" e "Small steps, big opportunities".
3. **Sezione 01 "Cos'è l'OFA di inglese?"**: titolo a due righe (seconda blu), testo "Una verifica obbligatoria per gli studenti del Politecnico di Milano. Se non la superi, rischi di perdere circa 30€, avere il piano di studi bloccato e non poter sostenere alcuni esami dal secondo anno."; pulsante "Scopri tutti i rischi". A destra, 5 carte di vetro in sequenza con freccia rossa: Non superi l'OFA (X), Perdi in media 30€ (portafoglio), Piano di studi bloccato (lucchetto), Dal secondo anno non puoi sostenere alcuni esami (tocco di laurea), poi carta blu "Con AddiOFA ti prepari ed eviti tutto questo" con grafico a barre e pulsante tondo.
Colori: sfondo bianco-azzurro, titoli #0F172A, blu #2563EB, rosso solo per le carte del rischio.
Come si collega: i pulsanti "Inizia la verifica" portano al diagnostico; "Scarica l'app" all'app.
Manca nell'app: layout a due colonne in desktop (l'app limita tutto a `max-w-3xl`); barra di navigazione con ancore (Come funziona, Perché è importante, Il percorso, FAQ); riga di 4 benefit con icona subito sotto l'hero; catena grafica delle conseguenze (oggi sono 2 voci con spunta in `Landing.tsx`, sezione "Cosa c'è in gioco"); sezione FAQ; illustrazione grande al posto dell'icona a 190 px.
Corrispondenza: Landing.
Priorità: alta per la struttura (barra con ancore, 4 benefit, catena delle conseguenze in carte, hero a due colonne), da adattare nei testi.
Da adattare: "Probabilità di non superare l'OFA 82%" (numero inventato e allarmista): mostrare la carta con un valore d'esempio dichiarato tale ("esempio") o con "Probabilità stimata di superare il test" e una percentuale neutra; "Perdi in media 30€": va scritto "circa 30 € a tentativo di test di recupero presso gli enti convenzionati" (`OFA_CONSEQUENCES`), non "in media"; "Scarica l'app": l'app è una PWA, usare "Apri l'app" o "Installa"; "Dal secondo anno non puoi sostenere alcuni esami": la formulazione vera è "finché l'OFA non è tolto, nel piano degli studi puoi inserire solo esami del 1° anno" con scadenze di fine agosto/settembre (le date di `OFA_DEADLINES` sono già nella landing: tenerle); "creato per gli studenti del Polimi" va bene, ma senza "Piano su misura" se il piano non c'è (usare "Ripasso su misura dai tuoi errori"); "Evita blocchi" non è una promessa che si può fare: "Evita di arrivarci impreparato".

---

### NN 42: `file_00000000c554821090390fe115876103.png` (schermate risultato animazioni, 1629×965)

Tipo: schermate app, riga superiore con 6 schermate e riga inferiore con 6 dettagli ingranditi dell'animazione (la pallina sull'arco).
Schermate (tutte con barra 10/10 e freccia indietro):
1. "Calcoliamo il tuo risultato": sottotitolo "Analizziamo le tue risposte per stimare la probabilità di superare l'OFA di inglese"; arco vuoto con pallina blu in basso; riquadro "Analizzando le risposte..." con 4 voci spuntate (Grammatica, Comprensione, Vocabolario, Ragionamento, l'ultima non spuntata).
2. "Elaboriamo i tuoi risultati": arco con coda gialla, "8% Probabilità di non superarlo"; lista con spunte e l'ultima in caricamento ("Ragionamento in corso...").
3. "Stiamo analizzando...": arco arancione, "28%", chip fluttuanti (Grammatica, Vocabolario, Comprensione, Ragionamento).
4. "Ultimi calcoli...": arco arancione-rosso, "56%", icone che orbitano (documento, puzzle) e puntini.
5. "Quasi pronto...": arco rosso, "76%", icone (cerchio, orologio), scie.
6. "Ecco il tuo risultato": esplosione di frammenti rossi, "82% Probabilità di non superarlo" in rosso.
Riga inferiore: ingrandimento della pallina che passa da blu a giallo, arancione, rosso con scie, fino a un'esplosione di raggi rossi.
Colori: sequenza blu, giallo, arancione, rosso, con aloni e coriandoli.
Manca nell'app: tutta la sequenza di attesa. `Onboarding.tsx` mostra subito il risultato; `Misuratore` conta da 0 a valore in 900 ms ma non ha fasi, chip, scie ed esplosione.
Corrispondenza: Onboarding/diagnostico, passo "result" (tra "risk" e "result").
Priorità: alta (migliora la sensazione di valore del diagnostico) ma con adattamento.
Da adattare: il testo "Stiamo confrontando le tue risposte con migliaia di studenti del Polimi" (43) e "Stiamo pesando la difficoltà delle diverse sezioni" falsi: non c'è alcun confronto con altri studenti né un modello a sezioni. Correzione: una sequenza breve (2-3 secondi) con frasi vere: "Contiamo le risposte esatte", "Le confrontiamo con la soglia del test (24 su 30)", "Stimiamo la probabilità"; chip delle aree solo con le categorie reali; la pallina e il conteggio possono restare (cresce verso il valore reale, non oltre). Colore: non passare per forza al rosso; il colore deve seguire il valore (rosso solo se la probabilità è bassa) e il numero mostrato deve essere "probabilità di superare" e non "di non superare". Saltabile con un tocco; con `prefers-reduced-motion` mostrare subito il risultato. Niente esplosione di frammenti rossi in caso di probabilità bassa (suona come punizione).

---

### NN 43: `file_00000000ddec81f4947d440d4b314c7d.png` (schermate risultato sette, 1536×1024)

Tipo: schermate app, 6 schermate, versione a "Rischio di fallimento" con pannelli informativi.
Schermate (barra 10/10):
1. "Calcoliamo il tuo risultato": arco vuoto con pallina blu, "0% Rischio di fallimento", lista Grammatica e Comprensione spuntate, Vocabolario e Ragionamento in attesa.
2. "Elaboriamo i tuoi risultati": arco blu al 18%, "Analizzando le aree..." con 4 righe con icona e barra (Grammatica 80%, Comprensione 60%, Vocabolario 30%, Ragionamento 10%).
3. "Stiamo analizzando...": arco giallo al 42%, "Fattori considerati": Difficoltà delle domande (Alta), Tempo impiegato (Più lento della media), Confronto con altri studenti (Sotto la media), nota "Il modello tiene conto di più fattori per offrirti una stima accurata."
4. "Ultimi calcoli...": arco arancione 68%, stessi fattori.
5. "Quasi pronto...": arco rosso 80%; banner rosso "Il tuo risultato è inferiore alla media degli studenti che superano l'OFA"; curva a campana con barra "Tu" e legenda (Studenti che superano, Studenti che non superano).
6. "Il tuo risultato": arco rosso 82% "Rischio di fallimento"; elenco costi (~30 € di costi aggiuntivi, Piano di studi bloccato, Nessun esame dal secondo anno, Ritardo di almeno 1 anno); pulsante rosso "Continua"; pulsante di contorno "Scopri come migliorare".
Manca nell'app: lista aree con barre in tempo reale durante il calcolo; elenco dei costi dentro la schermata risultato (nell'app sta in una schermata prima, "risk"); doppio pulsante Continua / Scopri come migliorare con il risultato.
Corrispondenza: Onboarding/diagnostico, passi "risk" e "result".
Priorità: alta (da adattare).
Da adattare, qui il rischio è alto: (a) "Confronto con altri studenti: sotto la media", "Tempo impiegato: più lento della media" e la curva a campana con "Tu" sono dati che l'app non ha (numeri inventati); (b) "Il tuo risultato è inferiore alla media degli studenti che superano l'OFA" è pressione su un numero finto; (c) "Rischio di fallimento" e l'ordine "costi, blocco, ritardo di 1 anno" subito sul risultato sono allarmisti, e "Ritardo di almeno 1 anno" non è verificabile; (d) arco in rosso fisso. Correzione: mostrare solo i fattori veri (risposte esatte su 10, soglia 24/30, argomenti da ripassare) e la nota di prudenza già presente ("stima prudente e approssimativa"); tenere la lista dei costi nella schermata "Se non superi l'OFA..." con le tre voci vere (circa 30 € a tentativo, solo esami del 1° anno, scadenze 2° anno); i due pulsanti diventano "Continua" e "Cosa ripassare" (porta alle aree deboli). Le barre per area durante il calcolo sono copiabili solo con aree vere.

---

### NN 44: `file_00000000e2cc8243a6d5ee9ce3a792ba.png` (icone sfera, 2172×724)

Tipo: icone, set di 14 sfere di vetro con etichetta (due righe da 7).
Riga 1: AddiOFA (stella blu a 4 punte), Studio (libri con bandiera britannica), Quiz (foglio A/B/C), Risultati (grafico a barre con freccia), Tips (tocco di laurea), Consigli (lampadina gialla), App (telefono con stella). Riga 2: Polimi (edificio con colonne), OFA (lucchetto con scintille rosse), Costi (moneta con €), Successi (bersaglio con freccia), FAQ (due fumetti), Opportunità (globo con aereo), Community (tre figure).
Manca nell'app: sono le "highlight" per social e per un'eventuale sezione FAQ/Menu; in `catalogo.ts` ci sono già i disegni equivalenti del kit; le sfere con alone non sono estratte come set.
Corrispondenza: Menu (Strumenti), Landing (benefit), social.
Priorità: media (riuso per le icone dei 4 benefit della nuova landing e per le voci FAQ/Consigli).
Da adattare: "Polimi" con edificio: l'icona suggerisce affiliazione; usarla con prudenza o sostituirla. "Community" e "Tips" non esistono nel prodotto di lancio.

---

### NN 45: `file_00000000e55481f4afd0f6b1727320de.png` (landing desktop b, 1536×1024)

Tipo: landing desktop, tema chiaro, tre fasce visibili.
Elenco:
1. **Barra**: logo con icona della stella 3D a sinistra; voci Home (sottolineata), Funzionalità, Come funziona, Prezzi, FAQ; pulsante "Scarica l'app".
2. **Hero** (sfondo: arco blu con stella luminosa e studente che entra): etichetta "PER GLI STUDENTI DEL POLITECNICO DI MILANO"; titolo "Oltre l'OFA, un passo in più." (seconda riga blu); testo "AddiOFA ti aiuta a superare l'OFA di inglese con un percorso personalizzato, evitando rischi, costi e blocchi del tuo piano di studi."; pulsanti "Inizia ora" e "Scopri come funziona"; riga con 4 avatar "Già 12.000+ studenti si stanno preparando con AddiOFA". A destra, quattro telefoni affiancati in prospettiva (home "Sei a rischio?" con 82%, quiz "Domanda 3 di 10" con goes in rosso, "Obiettivo raggiunto! Puoi iscriverti al secondo anno! Vai alla dashboard") con pillole fluttuanti (Quiz interattivi, Simulazioni realistiche, Piano di studio, Analisi del livello, Statistiche).
3. **Striscia 4 benefit** su vetro: Evita il rischio di non superare l'OFA; Non perdere i circa 30€ di tasse aggiuntive; Sblocca il tuo piano di studi; Un percorso su misura per il tuo livello.
4. **Sezione "Perché AddiOFA": "Più di un semplice quiz."** sottotitolo "Un sistema completo per farti arrivare preparato."; 4 carte con icona colorata (Test iniziale; Percorso personalizzato; Simulazioni realistiche "Prove complete come l'esame ufficiale"; Spiegazioni chiare "Teoria, esempi e consigli pratici"); riquadro "DATI REALI: Molti studenti partono a rischio. In base alle nostre analisi, l'82% degli studenti che inizia senza preparazione adeguata non supera l'OFA al primo tentativo." con anello 82%.
5. **Due riquadri foto a destra**: scuro "Il tuo futuro non si ferma a un esame" con facciata storica e testo su secondo anno ed esami; blu "Inizia oggi. Sblocca il tuo domani." con pulsanti App Store e Google Play e nota "Stessa partenza. Più possibilità."
Manca nell'app: come in NN 41, più: telefoni affiancati che mostrano l'app vera (si possono ottenere con gli screenshot di Chromium), carte "Perché AddiOFA" con 4 punti di forza, sezione "Prezzi" (la landing mostra "Gratis" e "Pass" in due caselle, ma non una sezione ancorata), pulsanti store (inutili: PWA).
Corrispondenza: Landing.
Priorità: alta per struttura (4 carte "Perché AddiOFA", telefoni con screenshot reali, sezione Prezzi), da adattare.
Da adattare: "Già 12.000+ studenti" e gli avatar (numero e recensioni finti, vietati); "DATI REALI... l'82%" (dato inventato presentato come reale: va tolto); "Prove complete come l'esame ufficiale" ("ufficiale": scrivere "nel formato del test, 30 domande in 15 minuti"); "Percorso personalizzato" (ripasso sugli errori, non piano); "Scarica su App Store / Google Play" (non esistono); "Il tuo futuro non si ferma a un esame" con la facciata dell'edificio storico (suggerisce affiliazione); "Obiettivo raggiunto! Puoi iscriverti al secondo anno!" (promessa di esito). "Prezzi" in barra: va bene se mostra 14,99 € / 9,99 € di lancio con data vera.

---

### NN 46: `file_00000000e63481f4b3860897e3f3c721.png` (locandina c, 1024×1536)

Tipo: locandina verticale su carta stropicciata, con strappi staccabili in fondo.
Contenuto: logo e slogan; titolo "Supera l'OFA di inglese. Senza stress." ("Senza stress." in blu); nota "Per studenti del Polimi"; scritta a mano "Small steps big opportunities"; le stesse 4 righe di NN 38 (Testa il tuo livello..., Quiz e simulazioni realistiche, Ricevi un piano di studio personalizzato, Consigli pratici e risorse utili); mano in bianco e nero con telefono che mostra il quiz; edificio Politecnico ritagliato; QR con linktr.ee/addiofa e "Provala ora!"; "Evita di bloccare il tuo piano di studi!"; fila di 9 strappi staccabili con logo verticale e stella.
Manca nell'app: niente (stampa). Un QR verso la landing reale servirà; l'indirizzo linktr.ee è un segnaposto.
Corrispondenza: nessuna.
Priorità: bassa/rimandata. Se si stampa, è la più concreta delle tre locandine (ha gli strappi).
Da adattare: "Senza stress" è un'affermazione morbida ma va bene; stesse note di 38 su "piano personalizzato" e sulla facciata del Politecnico; il QR è finto (non scansionabile): rigenerarlo con l'indirizzo vero.

---

### NN 47: `file_00000000ecd481f49653cd56523b5e7c.jpg` (schermate onboarding c, 1536×683)

Tipo: schermate app, funnel a 14 schermate in tema rosso (stesso di R5 `schermate-funnel-14.png`, a risoluzione più bassa; la lettura che segue vale per entrambi).
Schermate:
1. **Hai l'OFA di inglese?** (logo del Politecnico in alto): "Scopri subito se sei a rischio e come superarlo"; libri rossi con bandiera; pulsante "Inizia la verifica". Barra assente.
2. **Hai già una certificazione di inglese riconosciuta dal Polimi?**: due carte "Sì, ho una certificazione (Cambridge, IELTS, TOEFL...)" e "No, non ho una certificazione" (selezionata, rosa).
3. **Hai l'OFA di inglese assegnato?** "Puoi verificarlo sulla tua pagina di iscrizione al Polimi": due carte Sì/No.
4. **Verifica il tuo livello di inglese**: "10 domande, 3 minuti. Il risultato è immediato." con illustrazione del quiz e pulsante "Inizia il quiz".
5. **Domanda 3 di 10**: "Choose the correct form: She ___ to Milan every day." con 4 opzioni, "goes" selezionata, "Avanti".
6. **Salva i tuoi risultati**: busta con sigillo, "Inserisci la tua email istituzionale @polimi.it per salvare i risultati e ricevere il piano personalizzato", campo nome.cognome@polimi.it, "Continua", nota "I tuoi dati sono sicuri e utilizzati solo per il servizio."
7. **Se non superi l'OFA...**: elenco di 4 voci con icona (Rischi di perdere in media 30€ per i servizi aggiuntivi; Il piano di studi viene bloccato; Dal secondo anno non puoi sostenere nessun esame; Rischi di perdere un anno), "Continua il quiz".
8. **Quiz completato!**: "Ecco la tua previsione per l'OFA di inglese", misuratore 82% "Probabilità di non superare l'OFA", carta "Rischi di perdere circa 30€" con info, "Scopri come evitarlo".
9. **È il momento di prepararti.**: "Scegli il piano più adatto a te", 3 punti (Simulazioni come l'esame, Domande sempre aggiornate, Spiegazioni dettagliate).
10. **Scelta del piano**: tre carte: "Pass Simulatore 9,99 €", "CRAM Pass Pro 14,99 € (Più scelto)", "Garanzia Promosso 24,99 € (Massima sicurezza: rimborso totale in caso di mancato superamento)".
11. **CRAM Pass Pro**: "Il piano completo per superare l'OFA di inglese": Simulazioni illimitate con timer ufficiale, Archivio 100 quesiti frequenti, Cheat Sheet riassuntiva; "Procedi al pagamento".
12. **Pagamento sicuro**: Carta di credito, PayPal, Apple Pay, Google Pay; "Completa l'acquisto"; "Pagamento sicuro e protetto".
13. **Accesso completato!**: foglio con spunta verde, coriandoli, "Hai ora accesso al CRAM Pass Pro", "Inizia a prepararti".
14. **Il tuo obiettivo è a portata di mano.**: bersaglio con freccia, "Supera l'OFA, sblocca il tuo piano di studi e inizia il tuo percorso al Polimi senza stop.", "Vai alla dashboard".
Colori: rosso #EF4444 per azioni, barra a segmenti rossi che avanza, sfondo bianco, carte rosate per la selezione.
Come si collega: lineare 1 → 14; la barra di avanzamento cresce.
Manca nell'app (di quello che serve): niente di grosso. Le schermate 1-8 sono già in `Onboarding.tsx` (intro, certificazione, OFA, quizIntro, quiz, save, risk, result), in modo molto fedele. L'app ha in più "Non lo so ancora" e "certInfo". Mancano: la schermata "Accesso completato" con coriandoli dopo il Pass (esiste `PaymentThanks.tsx`, da confrontare), la schermata finale "obiettivo" (14), la scelta del metodo di pagamento (12, gestita da Stripe, non serve).
Corrispondenza: Landing (1), Onboarding/diagnostico (2-8), Risultato (8), Paywall (9-11), Pagamento (12, esterno), Esito acquisto (13-14).
Priorità: alta per 1-8 (già fatte, da mantenere allineate); 9-14 da adattare.
Da adattare, qui c'è la parte più delicata: (a) "CRAM Pass Pro", "Pass Simulatore", "Garanzia Promosso": un solo prodotto, "Pass AddiOFA" 14,99 € (lancio 9,99 €); tre carte con prezzi 9,99/14,99/24,99 sono tre prodotti, e il 24,99 con rimborso è la garanzia (fuori dal lancio, `FEATURE_FLAGS.guarantee` falso); (b) "Archivio 100 quesiti frequenti + Cheat Sheet": il Pass dà tutte le domande, 31 schede di teoria, due formati di simulazione (l'app ha già il Prontuario gratuito); (c) "timer ufficiale", "ufficiale": non usare; (d) "Salva i tuoi risultati con email @polimi.it" è la verifica del Project ID: l'app lo tiene spento (`SHOW_LOGIN`); (e) "Rischi di perdere in media 30€", "Rischi di perdere un anno", "Dal secondo anno non puoi sostenere nessun esame" sono più forti del vero (vedi `OFA_CONSEQUENCES`); (f) 82% "non superare" in rosso; (g) "Domande sempre aggiornate" non è dimostrabile. Correzione: una sola carta "Pass AddiOFA" con prezzo 9,99 € barrato 14,99 €, "fino al 31 gennaio 2027" (data vera), elenco `PASS.features`, nessun metodo di pagamento in app finché `PAYMENTS_ENABLED` è falso (lista d'attesa).

---

### NN 48: `file_00000000ef148210badb0fcc37386407.png` (social copertine video, 1536×1024)

Tipo: social, 18 pezzi in 5 file.
Riga 1, 7 storie verticali: "L'OFA di inglese può bloccarti tutto il piano di studi" (foto studente, contatori like); "Scopri se sei a rischio in 3 minuti" con telefono; "82% degli studenti rischia di non superare l'OFA. Tu da che parte sei?" con pulsanti "Ci provo ora" / "Ci penso dopo"; "Stessi studenti. Percorsi più luminosi."; "3 consigli per l'OFA di inglese" con checklist; "Small steps, big opportunities"; "Errori comuni all'OFA di inglese" (Tempi verbali, Preposizioni, Reading, Listening); "Quiz completato! 82%" con telefono.
Riga 2: caroselli "Come funziona l'OFA di inglese al Polimi?" (4 passi: È un test obbligatorio; Verifica il tuo livello; Preparati in modo mirato; Supera l'OFA e sblocca il tuo futuro), "5 motivi per non rimandare l'OFA di inglese" (Rischi di perdere 30€; Blocca il piano di studi; Non puoi sostenere alcuni esami; Ti aggiunge stress inutile; È più facile di quanto pensi con il giusto metodo), "Tip del giorno: Reading" (Leggi prima la domanda...).
Riga 3: reel "Study vlog", "Testimonianza" ("Pensavo fosse impossibile. Con AddiOFA l'ho superato al primo tentativo."), "Miti vs realtà", "App walkthrough", "Motivazionale"; post "Cosa succede se non superi l'OFA?" e meme "Tu nello speaking test" con un cane con cuffie.
Manca nell'app: niente (marketing). Utili come idee di contenuto: "Errori comuni" e "Tip del giorno" si possono ricavare dal Prontuario (24 regole e trappole) già nell'app.
Corrispondenza: nessuna; collegata a CheatSheet (idea).
Priorità: bassa/rimandata.
Da adattare: la testimonianza ("L'ho superato al primo tentativo") è una recensione finta (vietata); "82% degli studenti rischia" e "È più facile di quanto pensi" sono inventati o promesse; "Tu nello speaking test": il test non ha speaking; contatori di like e visualizzazioni finti; "L'OFA di inglese può bloccarti tutto il piano" esagera ("puoi inserire solo esami del 1° anno").

---

### NN 49: `file_00000000fac08210954140c04c3f104a.png` (schermate esplora atlas noi agora, 1536×1024)

Tipo: schermate app, 14 schermate, tema blu, ecosistema "Esplora". Prima riga: app principale, seconda riga: hub con tre sezioni.
Schermate:
1. **Splash**: tutto blu con "AddiOfa" bianco, "Supera l'OFA di inglese. Senza blocchi."
2. **Onboarding**: "Valuta il tuo livello, studia in modo mirato e riduci il rischio di fallimento.", "Inizia".
3. **Home**: logo, misuratore 82%, carta "Prossimo passo: Future tenses, 10 min, -6%", "Inizia la lezione", grafico "Il tuo percorso" (82% Oggi, 62% Dopo 5 lezioni, 28% Dopo 15 lezioni), tab bar Home, Studia, Esplora, Profilo.
4. **Lezioni (lista)**: 8 voci numerate (Present simple e Present continuous spuntati, Past simple, Future tenses selezionata, Modal verbs, Conditionals, Relative clauses, Phrasal verbs).
5. **Lezione (esercizio)**: barra 3/10, "Completa la frase: We ___ to Milan tomorrow.", opzioni, will go selezionata, banner "Corretto!", "Avanti".
6. **Simulazioni**: 3 carte (completa 40 domande 60 min; per argomento; le mie simulazioni).
7. **Profilo**: avatar R, "raffaele@polimi.it", voci (I tuoi progressi, Notifiche con interruttore blu acceso, Guida e FAQ, Impostazioni, Esci).
8. **Esplora (hub dei progetti)**: "Un ecosistema per il tuo percorso universitario e oltre", tre banner: ATLAS "Scopri e approfondisci" (terra dallo spazio), NOI "Connettiti e partecipa" (persone), Agorà "Confrontati e discuti" (architettura classica).
9. **ATLAS (home)**: tab Tutti, Scienza, Tecnologia, Carriera; banner "Capire il mondo per orientare il futuro"; "In evidenza" con 2 articoli.
10. **ATLAS (articolo)**: "L'intelligenza artificiale sta cambiando l'università", 8 min di lettura.
11. **NOI (home)**: banner "Una community di studenti, per studenti", "Prossimi eventi" (Aperitivo PoliNetwork, Study group, bottone Partecipo).
12. **NOI (evento)**: "Aperitivo PoliNetwork", data, luogo, partecipanti, "Partecipo".
13. **Agorà (home)**: tab Tutti, Università, Attualità; "Discussioni popolari".
14. **Agorà (discussione)**: "È giusto che l'università blocchi gli esami per l'OFA?", commenti.
Manca nell'app: lista lezioni numerata con spunte (4); Profilo con interruttore notifiche e uscita (7).
Corrispondenza: Menu/Teoria (3-4), Simulazione (5-6), Profilo (7), Atlas fuori lancio (8-14).
Priorità: media per 4, 5, 7; bassa/rimandata per 8-14 (Project ID, ecosistema, community, discussioni).
Da adattare: "82% Rischio" e "-6% dopo 15 lezioni" come in NN 36; "40 domande 60 min" da sostituire con i formati veri; "PoliNetwork" è un nome reale di un'associazione: evitare eventi finti con nomi reali (urgenza e notifiche inventate); l'articolo ATLAS su "l'IA sta cambiando l'università" è contenuto inventato.

---

### NN 50: `file_00000000fb5c8210a8fa4205cc4769a9.jpg` (brand kit f, 1536×683)

Tipo: brand kit (variante blu), "Brand Kit: Illustrazioni per l'app OFA Inglese, Politecnico di Milano".
Contenuto: palette di 9 colori con codici (#0F172A, #3B82F6, #F6F8FC, #E5E7EB, #6B7280, #EF4444, #F59E0B, #22C55E, #8B5CF6); 8 illustrazioni principali (Studio/Inglese, Quiz/Test, Risultato/Probabilità 82%, Rischio economico, Piano di studi bloccato, Superamento, Successo con coppa, Suggerimenti/Consigli); 10 contestuali (Email Polimi, Verifica utente, Accesso bloccato dal secondo anno, Mancato superamento, Progressi/Statistiche, Mondo/Internazionale, Messaggi/Supporto, Celebrazione, Attesa/Caricamento, Ricerca); 14 icone tonde (Studio, Statistiche, Quiz, Contenuti, Costo, Blocco, Successo, Email, Profilo, Impostazioni, Aiuto, Completato, Errore, Info); 4 stati e feedback (Operazione completata, Qualcosa è andato storto, Attenzione leggi bene, Informazione importante); UI (pulsanti Primario rosso, Secondario, Outline; interruttori, casella, radio); indicatore di avanzamento a 6 passi (Verifica, Quiz, Risultato, Piani, Pagamento, Successo); elementi extra (Più scelto, Massima sicurezza, Consigliato).
Manca nell'app: è la fonte già estratta (`app/src/brand/essenziali/disegni/kit-blu`, `Pulsante`, `Interruttore`, `Casella`, `Radio`, `Avanzamento`, `Badge`, `Stato` in `brand/componenti.tsx`). Le quattro "Stato" (messaggi di stato con icona) esistono come `Stato`.
Corrispondenza: tutta l'app (brand).
Priorità: media (già adottato; il kit blu serve se si passa al blu).
Da adattare: "Massima sicurezza" e "Più scelto" (badge per tre piani, di cui la garanzia) non servono con un solo prodotto: usare solo "Consigliato" se serve; "Accesso bloccato dal secondo anno" e "Mancato superamento" sono illustrazioni forti: da usare con misura e mai nel risultato; il sigillo del Politecnico sulla busta (Email Polimi) è un marchio (vedi `NOTA_SIGILLO` in `catalogo.ts`).

---

### NN 51: `file_00000000fe4482108b4c6e950fe1b4ca.png` (landing desktop c, 1536×1024)

Tipo: landing desktop, tema scuro cinematografico, tre fasce.
Elenco:
1. **Hero scuro** (altezza piena, sfondo notte blu): barra con logo con icona 3D, voci Home (sottolineata), Come funziona, Funzionalità, Storie, Prezzi, FAQ, pulsante bianco "Scarica l'app" e selettore lingua IT. Titolo grande "Oltre l'OFA, un passo in più." (seconda riga blu); testo "AddiOFA ti aiuta a superare l'OFA di inglese con un percorso personalizzato, evitando rischi, costi e blocchi del tuo piano di studi."; pulsante bianco "Inizia ora" e pulsante tondo con play "Scopri il video"; riga con 4 avatar "Già 12.000+ studenti si stanno preparando con AddiOFA"; elenco verticale "Studia, Prepara, Supera, Sblocca il tuo percorso"; "Un futuro più aperto"; indicatore di scorrimento "SCROLL"; paginazione 01-05. Scena: portale in cemento con scritta "Politecnico di Milano" e stella luminosa, studente di spalle che cammina verso la luce, fogli che volano, Duomo di Milano sullo sfondo, "Stessa partenza. Più possibilità.", "Same students, higher horizons".
2. **Fascia narrativa "prima e dopo"**: a sinistra uno studente stanco con laptop e libri e note a mano (Rischio di perdere 30€; Piano di studi bloccato; Niente esami dal secondo anno; Stress e incertezza); al centro "LA REALTÀ: 82% degli studenti che inizia senza preparazione adeguata non supera l'OFA al primo tentativo", pulsante "Scopri i dati", bottone tondo con freccia in basso; a destra "IL TUO DOMANI: Stesso punto di partenza. Più strade davanti a te." con studente sereno con cuffie davanti allo skyline.
3. **"Come funziona": "Un percorso su misura, in 4 passi."** "Dall'analisi iniziale al superamento, tutto in un'unica esperienza.", pulsante "Scopri come funziona"; quattro colonne numerate con mini-schermata: 01 Test iniziale ("Scopri il tuo livello e la probabilità di superare l'OFA"), 02 Piano personalizzato (interruttori: Lezioni su misura, Quiz mirati, Simulazioni ufficiali), 03 Allenati (finestra "Simulazione ufficiale 15 min, Inizia simulazione", "Prove reali con timer e correzioni dettagliate"), 04 Supera l'OFA (foglio con spunta verde: "Accedi al secondo anno senza blocchi").
Manca nell'app: come NN 41/45, più: struttura narrativa "prima e dopo" (il problema, poi la strada), sezione "Come funziona in 4 passi" con mini-schermate (l'app ne ha 3 testuali), fascia scura/chiara alternata. Il tema scuro dell'app c'è già (`dark:`) e si può dare una hero scura solo alla landing.
Corrispondenza: Landing.
Priorità: alta per la struttura "problema → strada → 4 passi"; il tono cinematografico è facoltativo.
Da adattare: "Già 12.000+ studenti" e avatar (finti); "82% ... non supera al primo tentativo" (inventato); "Simulazioni ufficiali", "Simulazione ufficiale", "Prove reali" (non sono ufficiali né reali: "Simulazioni nel formato del test"); "Piano personalizzato" con interruttori (non c'è); "Superare l'OFA... senza blocchi" è promessa di esito; "Scopri il video" (non c'è video); il portale con "Politecnico di Milano" e il Duomo: affiliazione e immagine non nostra; "Storie" in barra (non ci sono storie vere: non inventarle); "Scarica l'app" (PWA). Lo studente stanco con le note a mano "Stress e incertezza" è una leva emotiva forte: usarla con misura, senza "rischio".

---

### R1: `grafica/fonti/home-escluso.png` (941×1672)

Tipo: schermata app singola, home rossa, "esclusa dall'estrazione su richiesta".
Schermata: barra di stato; titolo "OFA Inglese, Politecnico di Milano" con avatar; "Bentornato, Raffaele" con "Continua il tuo percorso per superare l'OFA di inglese." e illustrazione libri con bandiera; pulsante rosso grande "Continua a studiare, Grammar - Future Tenses" con play bianco; carta "I tuoi progressi 62%" con barra rossa e "Obiettivo: Superare l'OFA" con bersaglio; "Strumenti" con link "Vedi tutti" e tre tessere (Lezioni "Spiegazioni chiare", Quiz "Metti alla prova le tue conoscenze", Simulazioni "Come l'esame reale"); tab bar Home, Progressi, Lezioni.
Manca nell'app: l'app ha già un'home più ricca (`Menu.tsx`: saluto, "Continua a studiare", progressi con due colonne, strumenti in elenco); non c'è il link "Vedi tutti" né la riga "OFA Inglese / Politecnico di Milano" con avatar come titolo (c'è con il logo).
Corrispondenza: Home/Menu.
Priorità: media (poco da aggiungere).
Da adattare: "Come l'esame reale" (non si può garantire: "nel formato del test"); "62%" è un valore d'esempio (nell'app è la padronanza reale).

---

### R2: `grafica/fonti/kit-blu.png` (1881×836) e R3: `grafica/fonti/kit-rosso.png` (1536×1024)

Tipo: brand kit. Sono la versione blu e rossa dello stesso kit.
R2 (blu): identico a NN 50 a risoluzione più alta (palette, 8 illustrazioni principali, 10 contestuali, 14 icone, stati e feedback, UI, progress indicator, elementi extra). Pulsante primario rosso accanto a elementi blu: è la versione ibrida.
R3 (rosso, "Stile illustrativo ispirato a Duolingo: semplice, amichevole, chiaro, coerente"): personaggi/elementi principali (Studio/Inglese, Quiz/Test, Risultato/Probabilità 82%, Rischio economico con banconota alata, Piano di studi bloccato, Piano di superamento con calendario, Successo/Superamento con coppa); 6 contestuali (Email Polimi, Verifica utente, Simulazione esame, Attenzione/Rischio, Progressi/Statistiche, Suggerimenti/Consigli); 14 icone; elementi UI (primario rosso, secondario rosato, outline, interruttori, casella, radio, barre di avanzamento a segmenti); progress indicator a 6 tappe in rosso (Verifica, Quiz, Risultato, Piani, Pagamento, Successo); illustrazioni di stato (Ricerca, Loading, Completato, Errore, Vuoto/Nessun dato, Celebrazione, Notifica, Attesa, In corso, Obiettivo, Messaggi, Mondo).
Manca nell'app: nulla di importante (il kit rosso è quello in uso: `Illustrazione kit="kit-rosso"`, `IconaChip`, `Barra`, `Avanzamento`, `Badge`, `Stato`, `Caricamento`). Eventuali stati vuoti "Vuoto / Nessun dato" (nuvola triste), "Notifica" e "In corso" potrebbero servire per le schermate Statistiche vuote: da verificare se esistono nel catalogo (`CATALOGO`).
Corrispondenza: tutta l'app.
Priorità: alta (R3, già adottato); media (R2).
Da adattare: "ispirato a Duolingo" è un riferimento interno, non da citare in pubblico; busta con sigillo del Politecnico (Email Polimi); "Rischio economico" con banconota alata è una leva emotiva forte, già usata in `risk`.

---

### R4: `grafica/fonti/logo-riferimento.png` (1254×1254)

Tipo: icona app. Quadrato con angoli molto arrotondati in blu cobalto, con una stella a cinque punte ritagliata come porta da cui esce una luce calda dorata che si allarga sul pavimento in basso; ombra morbida e alone azzurro.
È il riferimento per `strumenti/brand/logo/` (già ricostruito in SVG con parametri). Nella locandina e nei kit la stella è semplificata a quattro punte (stella "scintilla", NN 24/37/44), nella pagina è invece a cinque punte con luce: due forme diverse di stella, da tenere distinte.
Manca nell'app: niente (è già `urlIcona` e la PWA ha `icon-192/512`).
Corrispondenza: icona app, Landing, splash.
Priorità: alta (già fatto).
Da adattare: nulla. Nota: il logo usa il blu, l'azione dell'app è rossa: il rosso/blu è un accordo già scelto (kit rosso con logo blu).

---

### R5: `grafica/fonti/schermate-funnel-14.png` (1881×836)

Tipo: schermate app, funnel a 14 schermate rosso. Identico per contenuto a NN 47 (stessa sequenza 1-14, testi e prezzi 9,99 / 14,99 / 24,99, "CRAM Pass Pro", "Garanzia Promosso"), a risoluzione più alta; lì c'è la scheda completa. Dettagli leggibili in più: nella 5 la barra ha 2 segmenti pieni su 5; nella 6 il campo email e il testo "I tuoi dati sono sicuri e utilizzati solo per il servizio"; nella 11 le icone tonde (libro rosso, elenco giallo, foglio viola); nella 12 il pulsante "Completa l'acquisto" con lucchetto.
Elenco delle schermate: le stesse 14 di NN 47 (1 Hai l'OFA di inglese?, 2 certificazione, 3 OFA assegnato, 4 Verifica il tuo livello, 5 Domanda 3 di 10, 6 Salva i tuoi risultati, 7 Se non superi l'OFA..., 8 Quiz completato 82%, 9 È il momento di prepararti, 10 scelta del piano, 11 CRAM Pass Pro, 12 Pagamento sicuro, 13 Accesso completato, 14 Il tuo obiettivo è a portata di mano).
Manca nell'app: come NN 47 (le schermate 1-8 sono già in `Onboarding.tsx`; mancano la schermata finale "obiettivo" e una celebrazione dopo il Pass; il pagamento è esterno).
Corrispondenza: Landing (1), Onboarding/diagnostico (2-8), Risultato (8), Paywall (9-11), pagamento esterno (12), esito acquisto (13-14).
Priorità: alta per 1-8 (già fatte), da adattare 9-14.
Da adattare: come NN 47 (un solo Pass AddiOFA 14,99 / 9,99 € di lancio, niente garanzia, niente "CRAM Pass Pro", niente email @polimi.it obbligatoria, "probabilità di superare" al posto di "di non superare").

---

### R6: `grafica/fonti/schermate-funnel-6.png` (2000×667)

Tipo: schermate app, funnel corto a 6 schermate rosso.
Schermate:
1. **Sei pronto per l'esame?** "Scopri la tua probabilità di superarlo." pulsante "Calcola la tua previsione" (in fondo).
2. **Risultato**: "Ecco la tua previsione per l'esame", misuratore 82% "Probabilità di fallire l'esame", carta "Rischi di perdere 30€" con banconota, pulsante "Non voglio rischiare".
3. **Come vuoi prepararti?** tre carte: Pass Simulatore 9,99 €, CRAM Pass Pro 14,99 € (Più scelto), Garanzia Promosso 24,99 € (Massima sicurezza).
4. **CRAM Pass Pro**: tre punti (Tutto il simulatore degli esami, Archivio 100 quesiti frequenti, Cheat Sheet riassuntiva), "Procedi al pagamento", "14,99 € · Accesso immediato".
5. **Pagamento sicuro**: quattro metodi, "Completa l'acquisto".
6. **Tutto pronto!** coppa, "Hai ora accesso al CRAM Pass Pro", "Inizia subito".
Barra di avanzamento a segmenti rossi che cresce.
Manca nell'app: niente di nuovo rispetto a NN 47. Utile come versione più veloce: solo 2 schermate prima del quiz (nessuna domanda su certificazione e OFA).
Corrispondenza: Onboarding (intro), Risultato, Paywall.
Priorità: media (da adattare).
Da adattare: "Probabilità di fallire l'esame" (allarmista), "Non voglio rischiare" come testo del pulsante (vergogna indotta: usare "Vedi cosa ripassare"), carte dei tre piani e "Garanzia", "CRAM Pass Pro", 82% e "30€" come in NN 47.

---

### R7: `grafica/fonti/schermate-inviti-13.png` (1630×965)

Tipo: schermate app, 13 schermate rosso, funnel con inviti e classifica.
Schermate:
1. **Hai già superato l'OFA di inglese?** "Questa app è pensata per chi deve ancora sostenerlo." Due pulsanti "Sì, ho già la certificazione" e "No, devo ancora superarlo".
2. **Hai già una certificazione?** "Perfetto! Abbiamo preparato una guida gratuita con tutte le informazioni utili." pulsante "Scarica la guida gratuita".
3. **Verifichiamo il tuo livello**: "Rispondi a 10 domande per stimare la tua probabilità di superare l'OFA.", "Inizia il test".
4. **Domanda 3/10**: "She ___ to Milan last year." opzioni go, going, went (selezionata), goes; "Avanti".
5. **Il tuo risultato**: misuratore 32% "Alta probabilità di non superarlo", 4 punti rosa (~30 € di costi aggiuntivi, Piano di studi bloccato, Nessun esame al secondo anno, Ritardo di almeno 1 anno), "Continua".
6. **Verifica il tuo account Polimi**: campo @polimi.it, nota sui dati, "Continua".
7. **Sblocca l'accesso gratis**: "Invita 3 studenti del Polimi che hanno già superato l'OFA." con 3 passi (Condividi il tuo link; I tuoi amici si registrano con la email Polimi; Quando 3 amici completano la registrazione, sblocchi tutti i contenuti), "Più tardi", "Invita 3 amici".
8. **I tuoi inviti**: "2 di 3 completati", barra a 3 tappe, elenco con Luca Bianchi e Giulia Rossi spuntati, "Amico 3 in attesa...", "Invita un amico".
9. **Condividi il tuo link**: campo "app.ofa-polimi.it/invite/RAFF..." con copia; icone WhatsApp, Instagram, Messaggi, Altro.
10. **Accesso sbloccato!** regalo con coriandoli, "Hai invitato 3 amici e ora hai l'accesso gratuito a tutti i contenuti", "Inizia a studiare".
11. **Home**: "Ciao, Raffaele", anello 62% con "Obiettivo: Superare l'OFA", "Continua a studiare, Grammar - Future Tenses"; tab bar Home, Lezioni, Quiz, Classifica.
12. **Classifica**: "Settimana/Mese/Sempre", elenco con corona (Marco R. 98%, Giulia F. 96%, Alessandro C. 92%, Tu 88%, Sara M. 86%, Davide L. 84%).
13. **Il tuo profilo**: "Raffaele A., Studente @ Polimi", "#4 Posizione in classifica 88%", voci I tuoi inviti (2 di 3 completati), Statistiche, Impostazioni.
Manca nell'app: l'app ha già `Invites.tsx` ("Invita 3 compagni, il Pass è gratis", "Compagni verificati", "Le regole"). Del design restano: la schermata di celebrazione "Accesso sbloccato" con regalo (10), la riga di app per condividere con icone (9), la barra a 3 tappe con avatar (8), la domanda iniziale "Hai già superato l'OFA?" con guida gratuita per chi ha una certificazione (1-2: l'app ha `certInfo`, ma non una "guida gratuita").
Corrispondenza: Invites (7-10), Onboarding (1-5), Classifica/Profilo (11-13, fuori lancio).
Priorità: media per 7-10 (gli inviti sono nel lancio; `INVITE` è già in `offer.ts`); bassa/rimandata per 12-13 (classifica, `FEATURE_FLAGS.leaderboard` falso).
Da adattare: (a) "Invita 3 studenti del Polimi che hanno già superato l'OFA": l'app invita compagni che finiscono il diagnostico (`INVITE.minDiagnosticSeconds`, dominio `mail.polimi.it`) e il Pass è gratis; verificare il testo e non scrivere "che hanno già superato"; (b) "Verifica il tuo account Polimi": è il Project ID spento, in lancio la verifica si fa per l'invitato con l'email; (c) "Alta probabilità di non superarlo, 32%" è un modo confuso: 32% è la probabilità di superare, ma il testo dice il contrario; (d) "Ritardo di almeno 1 anno" non verificabile; (e) la classifica con nomi di persone e percentuali ("Marco R. 98%") è inventata: fuori lancio; (f) "Luca Bianchi, Giulia Rossi" sono nomi finti: nell'app lo stato vero degli invitati, senza nomi; (g) "app.ofa-polimi.it": un dominio con "polimi" non va usato.

---

## Dettagli da copiare

Micro-interazioni
- Misuratore che sale con la pallina e le scie: l'arco cambia colore con il valore (blu, giallo, arancione, rosso). In app solo conteggio di 900 ms: aggiungere fasi di 600-800 ms ciascuna, saltabili, nulla con `prefers-reduced-motion` (42).
- Chip delle categorie reali (Grammatica, Traduzione, o gli argomenti di grammatica) che entrano in volo intorno all'arco durante il calcolo (42, 43).
- Lista di controllo con spunte che si accendono una a una ("Contiamo le risposte esatte", "Le confrontiamo con la soglia", "Stimiamo la probabilità"), con la voce attiva che gira (42, 43; `Caricamento` esiste già).
- Banner "Corretto!" verde con spunta e pulsante "Avanti" che compare dopo la risposta; in rosso "Risposta sbagliata" con le due caselle "La tua risposta / Risposta corretta" affiancate e carta "Spiegazione" sotto (36, 49).
- Anello di avanzamento con percentuale al centro (R7 home, 62%) e barra a segmenti rossi che cresce con i passi del funnel (47, R5, R6).
- Striscia di 6 puntini spuntati per i giorni di fila (39): è onesta se sono giorni reali.
- Regalo con coriandoli a "Accesso sbloccato" (R7) e foglio con spunta e coriandoli a "Accesso completato" (47); coerente con `triggerConfetti` già presente in `LearnMode`.
- Pillola di navigazione sospesa al centro in alto nella landing desktop, con voce attiva sottolineata (41, 45, 51); scroll con indicatore "Scroll per scoprire".
- Carte di vetro fluttuanti che mostrano l'interfaccia reale (41, 45): ottenibili con screenshot di Chromium dell'app.
- Catena di carte con freccia rossa che termina nella carta blu "Con AddiOFA ti prepari" (41): una sequenza visiva delle conseguenze in 4 passi invece dell'elenco.
- Interruttore Notifiche nel profilo (49): solo se ci saranno notifiche vere (oggi no).

Componenti
- Barra di navigazione desktop con ancore (Come funziona, Perché è importante, Il percorso, Prezzi, FAQ) e pulsante "Inizia ora" (41, 45, 51).
- Riga di 4 benefit con icona (41, 45): proposta onesta: "Quiz nel formato del test", "Ripasso dai tuoi errori", "Spiegazioni in italiano", "Pensato per gli studenti del Polimi".
- Carte "Perché AddiOFA" a 4 punti con icona colorata (45): Test iniziale, Ripasso mirato, Simulazioni nel formato del test, Spiegazioni chiare.
- Sezione "Come funziona in 4 passi" con mini-schermata per ognuno (51): Test iniziale, Ripasso sui tuoi errori, Simulazioni, Test vero. Le schermate sono quelle vere.
- Radar a 4-5 assi nel risultato del diagnostico e "Aree da migliorare" con barre colorate per area (36): `recharts` è già nel progetto (`StatsMode`).
- Carta "Prossima lezione consigliata" con durata e pulsante pieno (39, 49): collegare all'argomento più debole.
- Lista lezioni numerate con spunta, in corso e bloccata (49, schermata 4): per le 31 schede di teoria con il lucchetto del Pass.
- Carta "Il tuo obiettivo" con anello e testo (39): obiettivo vero, "soglia 24 su 30 / 25 su 30".
- Dettaglio simulazione prima di iniziare (36, 9): numero di domande, minuti, formato, soglia.
- Tab bar a 3-4 voci con icona piena sulla scheda attiva (R1, 36): già presente come `Navigazione`.
- Schermata Impostazioni con righe icona + titolo + sottotitolo (36, 14): Tema, Suoni, Notifiche (se ci sono), Privacy, Aiuto e FAQ, Informazioni.
- Stati vuoti con illustrazione (R3: Vuoto/Nessun dato, Errore, Completato).
- Banner di stato a 4 colori (50): `Stato` esiste già.
- Riga "Condividi" con WhatsApp, Instagram, Messaggi, Altro e campo con copia (R7, 9): per `Invites.tsx`, con Web Share API se disponibile.

Copy (testi onesti, adattati da quelli dei design)
- Hero: "L'inglese a Polimi, senza sorprese." (41) oppure "Oltre l'OFA, un passo in più." (45, 51); sottotitolo: "Scopri a che punto sei in 3 minuti e preparati con ripasso e simulazioni nel formato del test."
- "Un percorso su misura, in 4 passi." (51) e "Più di un semplice quiz." (45): riutilizzabili come titoli di sezione.
- "Hai l'OFA di inglese?" (47): già nella landing.
- "Ecco la tua previsione per l'OFA di inglese" (47) con "Probabilità stimata di superare il test" al posto di "di non superare".
- "Scopri come migliorare" (43) come secondo pulsante dopo il risultato, al posto di "Scopri come evitarlo".
- "Tutto pronto!" / "Accesso completato!" (47, R6) dopo il Pass.
- "Più studi, più il rischio si abbassa" (36) diventa "Più ripassi, più la stima sale": solo se vero, con la stima ricalcolata.
- "Stessa partenza. Più possibilità." e "Stessi studenti. Percorsi più luminosi." (45, 51, 48): slogan senza promesse, adatti a un bordo o a un riquadro.
- "Small steps, big opportunities" (37, 40, 41): scritta a mano ricorrente del brand.
- Nota di prudenza accanto alla stima: già presente in `Onboarding` ("stima prudente e approssimativa"), da mantenere anche nella nuova sequenza.

Da non copiare (riepilogo)
- 12.000+ studenti, 82% di studenti a rischio, "Dati reali", confronto con "migliaia di studenti del Polimi", classifiche e nomi finti, testimonianze.
- "CRAM Pass Pro", "Pass Simulatore", "Garanzia Promosso" (24,99 €), "Massima sicurezza", "Più scelto" in tre piani.
- "Rischio di fallimento", "Rischio molto alto", "Probabilità di fallire l'esame", pulsanti che fanno vergognare ("Non voglio rischiare"), arco sempre rosso, esplosione rossa.
- "Ufficiale", "timer ufficiale", "simulazioni ufficiali", "Scarica su App Store / Google Play", sigillo e scritta del Politecnico, domini con "polimi".
- Proiezioni "82% → 62% → 28% dopo 15 lezioni" e "-6% di rischio per lezione".
