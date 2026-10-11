# Catalogo design allegati: immagini 00-17 di `grafica/fonti/design-concept/`

Ogni immagine è stata aperta e guardata. Il confronto con l'app è fatto leggendo `Onboarding.tsx`, `Landing.tsx`, `Menu.tsx`, `Navigazione.tsx`, `config/offer.ts` e cercando nel codice `StatsMode`, `Invites`, `ExamMode`, `PaymentThanks`, `brand/componenti.tsx`. Non ho aperto altre cartelle di grafica. Le coordinate nelle schede sono approssimative.

Legenda priorità: **alta** = migliora subito il prodotto di lancio; **media**; **bassa** = marketing o estetica; **rimandata** = Project ID, classifica NOI, ambassador, garanzia rimborso (fuori dal lancio).
"Da adattare" = contraddice le regole del prodotto (allarmismo, urgenza finta, «ufficiale», garanzia, numeri inventati, nomi tipo «CRAM Pass Pro», prezzi diversi da Pass 14,99 / lancio 9,99): la correzione proposta è nella scheda.

## Tabella riassuntiva

| NN | Tipo | Schermate / contenuto | Priorità | Schermata dell'app | Da adattare |
|---|---|---|---|---|---|
| 00 | social | 3 caroselli da 6 slide (promo, 3 consigli, storia di uno studente) | bassa | nessuna (marketing) | sì: testimonianze finte, «30 €» come paura |
| 01 | schermate app | Home con misuratore in 3 stati (82 / 46 / 18 %) | alta | Home/Menu | sì: «Rischio di fallimento», «Raffaele» |
| 02 | schermate app | Funnel rosso da 14 schermate (cert., OFA, quiz, email, rischio, risultato, piani, pagamento, successo, obiettivo) | media | Onboarding, Paywall | sì: CRAM Pass Pro, garanzia 24,99, logo Polimi, prezzi |
| 03 | schermate app | Home «Il tuo rischio OFA»: misuratore, avviso, CTA, prossimo obiettivo, «Il tuo impatto» | alta | Home/Menu | sì: proiezione 82 → 62 → 28 % inventata |
| 04 | locandina | Poster «Supera l'OFA di inglese», QR, strisce staccabili | bassa | nessuna (marketing) | sì: «Supera», «30 €», link linktr.ee |
| 05 | schermate app | Funnel rosso da 13 schermate con invito: sblocco gratis, inviti, condividi, regalo, home con anello, classifica, profilo | media (inviti) / rimandata (classifica, profilo) | Onboarding, Inviti, Home, Profilo | sì: verifica @polimi.it, «Alta probabilità di non superarlo» |
| 06 | schermate app | 14 schermate: Sfide (7) e Profilo (7): sfide, classifica, amici, calendario, progressi, obiettivi, badge, attività, impostazioni, modifica profilo | media (Progressi, Obiettivi, Calendario, Impostazioni) / rimandata (sfide, amici, classifica, Project ID) | Statistiche, Profilo/Sfide | sì: punti, livello, serie, «Project ID» |
| 07 | brand kit | Brand board blu: logo, palette, Inter, icone, illustrazioni, moodboard, applicazioni, pattern, claim | media | tutte (identità) | no |
| 08 | brand kit | Kit rosso illustrazioni: personaggi, contestuali, icone, UI, indicatore, stati | alta (già in uso) | tutte (`kit-rosso`) | no |
| 09 | schermate app | Calcolo del risultato in 6 passi (0 → 82 %) con spunte Grammatica/Comprensione/Vocabolario/Ragionamento | media | Onboarding → Risultato | sì: «Rischio di fallimento», «sulla base di migliaia di studenti» |
| 10 | schermate app | Calcolo in 6 passi, variante ricca: aree, confronto con la media, fattori, istogramma «Tu», risultato con due CTA | media | Onboarding → Risultato | sì: dati e confronto con «studenti reali» inventati |
| 11 | schermate app | Home in 3 stati, versione lunga con «Cosa influenza il tuo rischio?» per area | alta | Home/Menu, Statistiche | sì: «Rischio molto alto», «-30 €», «ridurre fino al 20 %» |
| 12 | landing | Landing mobile «Oltre l'OFA, un passo in più.» (hero, 4 vantaggi, 4 passi con telefono, 4 funzioni, dati, banner finale) | alta | Landing | sì: «12.000+ studenti», «Dati reali 82 %», «Simulazioni ufficiali», store |
| 13 | schermate app | Mappa di 15 schermate: Splash, Onboarding, Home, Lezione, Simulazione, Esplora, Profilo, Impostazioni, ATLAS (3), NOI (2), Agorà (2) | media (Lezione, Simulazione, Splash) / rimandata (ATLAS, NOI, Agorà, Project ID) | Esercizi, Simulazione, Atlas | sì: «Domanda 12/40», community |
| 14 | schermate app | Home «Rischio molto alto» con «Il tuo prossimo obiettivo» e «Come cambia il tuo rischio» | alta | Home/Menu | sì: stessa proiezione inventata di 03 |
| 15 | brand kit | Concept «Oltre l'OFA, un passo in più»: logo, palette, tipografia, parole chiave, stile UI, atmosfera | media | tutte (identità) | sì: parola «Istituzionale», «Obiettivo raggiunto!» |
| 16 | brand kit | Brand Kit blu 3D: illustrazioni, contestuali, icone, stati e feedback, UI, indicatore, etichette extra | media | tutte (`kit-blu`) | sì: «Massima sicurezza», stemma Polimi |
| 17 | brand kit | Brand Kit blu «piatto»: come 16 con palette leggermente diversa | media | tutte (`kit-blu`) | sì: come 16 |

## Osservazioni trasversali (valgono per più immagini)

1. **Due famiglie di colore.** Le immagini 02, 05, 08 usano il **rosso** come colore d'azione (bottoni, barra di avanzamento): è quello che l'app ha oggi (`#EF4444`, `kit-rosso`). Le immagini 00, 01, 03, 06, 09-14 e i kit 07, 15, 16, 17 usano il **blu** `#3B82F6` per i bottoni e il rosso/giallo/verde solo per lo stato di rischio. La scelta tra le due è una decisione di prodotto dell'utente; qui si segnala solo che l'app ha rosso come primario e che nei design più recenti (home, calcolo, landing, brand) il primario è il blu.
2. **Il motivo ricorrente «82 % rischio di fallimento».** Compare in 01, 03, 09, 10, 11, 12, 14 e in 15/16/17 come illustrazione. Per le regole del prodotto va **sempre** riformulato in positivo e prudente: «Probabilità stimata di superare il test: 18 %» (l'app oggi dice «Probabilità stimata di superare il test oggi», con la nota sul fatto che con 10 domande la stima è approssimativa). Il misuratore `Misuratore` esiste già in `brand/componenti.tsx` e va solo riusato con il valore vero.
3. **Nome della persona («Raffaele»)**: negli schermi è un esempio; in app si usa il nome solo se l'utente è collegato (`user?.displayName`), come fa già `Menu.tsx`.
4. **Navigazione.** I design hanno 3 schede (Home, Simulazioni, Lezioni), oppure 4 (Home, Lezioni, Quiz, Classifica), oppure 5 (Home, ATLAS, NOI, Studio, Profilo). L'app ha Home, Esercizi, Teoria, Progressi (+ Classifica se accesa, + Pass). La struttura dell'app va bene: non adottare quelle dei design.
5. **Moduli non nell'app né nel piano**: Agorà (forum), Sfide, Amici, Badge, Calendario sfide, Project ID, Atlas. Tutti rimandati.

---

# Schede

## 00 · `file_0000000001548246b0827f47ee43a483.png` · social carosello
- **Tipo**: social (3 caroselli da 6 slide, formato quadrato con numerazione «n/6» e freccia tonda in basso a destra).
- **Riga 1, promo**: (1/6) «Il tuo inglese, senza ostacoli.» foto del Politecnico con studenti e stella blu; (2/6) «Cos'è AddiOFA?» con 4 icone (Test iniziale, Piano di studio personalizzato, Simulazioni realistiche, Consigli mirati); (3/6) «Perché è importante?» con tre carte rosse (perdere in media 30 €, piano di studi bloccato, perdere un anno) e scritta a mano «Evita questi rischi!»; (4/6) «Come funziona?» 5 passi numerati; (5/6) «Il tuo risultato in pochi minuti.» telefono con 82 %; (6/6) «Stessi studenti. Percorsi più luminosi.» con portale a stella e bottone «Inizia ora».
- **Riga 2, 3 consigli**: «3 consigli per superare l'OFA di inglese»; 1 «Conosci la struttura del test» (Reading, Grammar, Listening, Use of English); 2 «Esercitati con simulazioni reali» (telefono con «She ___ to Milan every day»); 3 «Studia in modo costante (ma leggero)» con calendario e cappello; 5/6 «Strumenti utili dentro AddiOFA» (Quiz tematici, Spiegazioni chiare, Simulazioni complete, Statistiche dei progressi); 6/6 «Pronto a metterti alla prova?».
- **Riga 3, storia**: «Dalla paura al superamento.»; Prima «Avevo paura di non superare l'OFA.»; Durante «Ho usato AddiOFA per capire da dove partire»; Risultato «Ho superato l'OFA al primo tentativo!»; «Cosa mi ha aiutato di più?»; «Il tuo turno.».
- **Collegamento**: ogni carosello va da copertina a invito finale («Inizia ora»).
- **Manca nell'app**: niente, è marketing. L'app ha già i testi simili («Per chi è», «Come funziona»).
- **Priorità**: bassa. **Schermata app**: nessuna; serve per i social.
- **Da adattare**: le slide Prima/Durante/Risultato sono **testimonianze inventate** (recensioni finte, vietate): usare solo storie vere con consenso, oppure riscrivere come «Cosa ti aspetta» senza voce di un utente. «Perdere in media 30 €» va detto come «un tentativo del test di recupero costa circa 30 €» (`RETAKE_COST_EUR`). «Perdere un anno» e «Piano di studi bloccato»: usare la frase vera di `OFA_CONSEQUENCES` (solo esami del 1° anno nel piano finché c'è l'OFA).

## 01 · `file_0000000002488210b63d462f2349a784.png` · home rischio, tre stati
- **Tipo**: schermate app (3 schermi affiancati: alto, medio, basso).
- **Schermate**: tutte e tre «Home». Barra in alto: logo «AddiOfa» a sinistra, avatar utente a destra. Titolo «Ciao, Raffaele», sottotitolo che cambia: «Ecco la tua situazione attuale.» / «Stai facendo progressi!» / «Ottimo lavoro!».
  - Misuratore a semicerchio con puntino sul bordo e bagliore: 82 % rosso, 46 % arancio, 18 % verde. Sotto: «Rischio di fallimento all'OFA di inglese».
  - Scheda di stato colorata: rossa «Rischio molto alto» con punto esclamativo, arancione «Rischio medio» con barre, verde «Rischio basso» con spunta; ogni scheda ha un testo breve e una freccia.
  - «Cosa puoi fare ora?» e un bottone blu grande che cambia: «Inizia a studiare» / «Continua a studiare» / «Fai una simulazione».
  - Barra in basso: Home, Simulazioni, Lezioni.
- **Collegamento**: lo stato cambia con i progressi; il bottone porta a Esercizi o Simulazione.
- **Manca nell'app**: il misuratore in Home (oggi la Home ha solo una riga «Probabilità stimata di superare il test»), il tono del saluto che cambia con i progressi, la scheda di stato a 3 livelli, il bottone principale che cambia in base allo stato (oggi sempre «Continua a studiare»).
- **Priorità**: alta. **Schermata app**: Home/Menu (`Menu.tsx`).
- **Da adattare**: sostituire «Rischio di fallimento» con «Probabilità stimata di superare il test» e «Rischio molto alto» con «Parti da qui» / «Hai ancora margine» / «Sei sulla strada giusta»; la scala dei colori resta ma **ribaltata nel senso**: più probabilità = più verde. Niente rosso pieno e bagliore pulsante sul valore basso (allarmismo): usare arancio morbido. Mostrare il misuratore solo dopo il diagnostico (senza valore non c'è nulla da mostrare) e con la nota «stima approssimativa». Tono del saluto basato su dati misurati (probabilità diagnostica, accuratezza), non su soglie arbitrarie.

## 02 · `file_0000000003108210ab85412b3bdcb125.jpg` · onboarding piani (funnel 14 schermate, rosso)
- **Tipo**: schermate app, un solo flusso di 14 schermate con frecce, tema rosso (`kit-rosso`).
- **Schermate**:
  1. «Hai l'OFA di inglese?» logo Politecnico di Milano in alto, libri con bandiera, bottone «Inizia la verifica».
  2. «Hai già una certificazione di inglese riconosciuta dal Polimi?» due carte: «Sì, ho una certificazione (Cambridge, IELTS, TOEFL…)» e «No, non ho una certificazione».
  3. «Hai l'OFA di inglese assegnato?» «Puoi verificarlo sulla tua pagina di iscrizione al Polimi.» due carte.
  4. «Verifica il tuo livello di inglese. 10 domande, 3 minuti.» bottone «Inizia il quiz».
  5. «Domanda 3 di 10»: «Choose the correct form: She ___ to Milan every day.» 4 opzioni (go, goes, going, to go); «Avanti».
  6. «Salva i tuoi risultati»: campo email `nome.cognome@polimi.it`, «I tuoi dati sono sicuri e utilizzati solo per il servizio.»
  7. «Se non superi l'OFA…» 4 righe: perdere in media 30 €, piano di studi bloccato, dal secondo anno non puoi sostenere nessun esame, rischi di perdere un anno.
  8. «Quiz completato!» misuratore 82 % «Probabilità di non superare l'OFA», riquadro «Rischi di perdere circa 30 €», «Scopri come evitarlo».
  9. «È il momento di prepararti.» tre benefici (Simulazioni come l'esame, Domande sempre aggiornate, Spiegazioni dettagliate).
  10. Scelta piano: «Pass Simulatore 9,99 €» (simulazioni illimitate con timer ufficiale da 15 min); «CRAM Pass Pro 14,99 €» con etichetta «Più scelto» (simulatore + archivio 100 quesiti frequenti + Cheat Sheet); «Garanzia Promosso 24,99 €» con etichetta «Massima sicurezza» (pacchetto + rimborso totale in caso di mancato superamento).
  11. «CRAM Pass Pro» elenco di inclusi e «Procedi al pagamento».
  12. «Pagamento sicuro»: Carta di credito, PayPal, Apple Pay, Google Pay; «Completa l'acquisto».
  13. «Accesso completato!» con foglio e coriandoli, «Hai ora accesso al CRAM Pass Pro.», «Inizia a prepararti».
  14. «Il tuo obiettivo è a portata di mano» bersaglio, «Vai alla dashboard».
- **Collegamento**: barra a segmenti in alto che avanza; i passi 1-8 sono il funnel di diagnosi, 9-12 il paywall, 13-14 la chiusura.
- **Corrispondenza con l'app**: i passi 2, 3, 4, 5, 7, 8 sono già in `Onboarding.tsx` (certification, ofa, quizIntro, quiz, risk, result) con le stesse illustrazioni; 6 («save») esiste ma solo con Project ID acceso. Passi 9-12 sono il Paywall (`Paywall.tsx`); 13 è `PaymentThanks.tsx`.
- **Manca nell'app**: schermata 1 con la domanda «Hai l'OFA di inglese?» come titolo e il sottotitolo «Scopri subito se sei a rischio e come superarlo» (l'app ha «Due domande su di te, poi 10 di inglese»: va bene); schermata 9 «È il momento di prepararti» con tre icone-beneficio; schermata 14 «Il tuo obiettivo è a portata di mano» con il bersaglio come chiusura dopo l'acquisto (oggi `PaymentThanks` ha solo la celebrazione).
- **Priorità**: media (il funnel è già costruito). **Schermata app**: Onboarding, Paywall, PaymentThanks.
- **Da adattare** (diverse contraddizioni):
  - «CRAM Pass Pro», «Pass Simulatore», «Garanzia Promosso»: **un solo prodotto, Pass AddiOFA a 14,99 € (lancio 9,99 € fino al 31/1/2027)**; niente tre piani, niente garanzia (spenta fino all'estate 2027: `FEATURE_FLAGS.guarantee`), niente «Massima sicurezza».
  - «Timer ufficiale» e logo del Politecnico: non usare mai «ufficiale» né il logo/stemma del Politecnico; l'app dice «Progetto studentesco indipendente e non ufficiale» (`DISCLAIMER`). Sostituire con «timer come nel test (15 minuti)».
  - Schermata 6: richiede `@polimi.it`; nell'app è Project ID (rimandato). Se si fa, solo facoltativa («Non ora»).
  - Schermata 8: «Probabilità di non superare l'OFA 82 %» in rosso e «Rischi di perdere circa 30 €»: riformulare «Probabilità stimata di superare il test: 18 %» e «Un tentativo del test di recupero costa circa 30 €».
  - Schermata 12: i metodi di pagamento li gestisce Stripe: non disegnare una schermata nostra.

## 03 · `file_00000000078c821085a0cea182772e23.png` · home rischio singola (941×1672)
- **Tipo**: schermata app singola, ritaglio verticale.
- **Schermata Home**: logo «AddiOfa» e campanella; titolo «Il tuo rischio OFA ⓘ» con sottotitolo «Più studi, più il rischio si abbassa.»; misuratore 82 % rosso; scheda rossa «Il tuo rischio è alto. Completa le lezioni consigliate per ridurre il rischio.»; bottone blu «Inizia a studiare»; scheda «PROSSIMO OBIETTIVO: Grammatica: Future tenses» con barra e «0/5 lezioni»; «Il tuo impatto ⓘ» con curva a tre punti: 82 % Oggi, 62 % Dopo 5 lezioni, 28 % Dopo 15 lezioni; barra in basso Home, Simulazioni, Lezioni.
- **Manca nell'app**: scheda «Prossimo obiettivo» (argomento più debole con barra di avanzamento), icona «ⓘ» che spiega come è calcolata la stima, grafico dell'andamento in Home.
- **Priorità**: alta (prossimo obiettivo e ⓘ); il grafico solo se con dati veri.
- **Schermata app**: Home/Menu.
- **Da adattare**: la curva «Dopo 5 lezioni 62 %, dopo 15 lezioni 28 %» è una **promessa con numeri inventati**: l'app non può prevedere l'effetto delle lezioni. Sostituirla con «Come cambia la tua stima» che mostra solo i punti **misurati** (diagnostico, ultime simulazioni), oppure non mostrarla finché non ci sono almeno 2 misure. «Più studi, più il rischio si abbassa» → «Più ti alleni, più la stima si affina». «Rischio alto» → vedi 01. Il «prossimo obiettivo» deve venire da `weakTopics` / ripasso dilazionato, non da un elenco fisso.

## 04 · `file_000000000f0482469e5d13818e3ae27b.png` · locandina «Supera l'OFA»
- **Tipo**: locandina verticale (cartellone da bacheca con striscioline staccabili).
- **Contenuto**: logo grande «AddiOFA», sottotitolo «IL TUO INGLESE, SENZA OSTACOLI.», scritta a mano «PER STUDENTI DEL POLIMI»; titolo «Supera l'OFA di inglese e sblocca il tuo percorso.»; foto del Politecnico strappata con nastro blu; 4 benefici con icone (Testa il tuo livello in pochi minuti; Quiz e simulazioni realistiche; Ricevi un piano di studio personalizzato; Consigli pratici da altri studenti); telefono inclinato con quiz «She ___ to Milan every day», risposta «goes» errata in rosso; QR con il logo e `linktr.ee/addiofa`; scritta «SMALL STEPS BIG OPPORTUNITIES»; fascia con tre punti (Evita di bloccare il tuo piano di studi; Risparmia tempo e soldi (circa 30 €); Arriva preparato ai tuoi esami); in fondo nove strisce staccabili con logo ruotato.
- **Manca nell'app**: niente (stampa).
- **Priorità**: bassa. **Schermata app**: nessuna; serve per l'affissione.
- **Da adattare**: «Supera l'OFA» è una promessa: «Preparati all'OFA di inglese». «Risparmia tempo e soldi (circa 30 €)» → «Un tentativo del test costa circa 30 €». «Consigli pratici da altri studenti»: va bene solo se i consigli sono veri. Foto con la scritta «Politecnico di Milano»: rischio di sembrare ufficiale; usare foto senza la targa o aggiungere il disclaimer sul poster. QR e link: usare l'indirizzo vero dell'app (non `linktr.ee`). Le strisce staccabili con logo sono un dettaglio da copiare per le bacheche.

## 05 · `file_00000000106881f4928db217ddf2162e.jpg` · onboarding invito (funnel 13 schermate, rosso)
- **Tipo**: schermate app, flusso di 13 schermate.
- **Schermate**:
  1. «OFA Inglese, Politecnico di Milano»: «Hai già superato l'OFA di inglese?» «Questa app è pensata per chi deve ancora sostenerlo.»; due bottoni («Sì, ho già la certificazione», «No, devo ancora superarlo»).
  2. «Hai già una certificazione?» «Perfetto! Abbiamo preparato una guida gratuita con tutte le informazioni utili.» bottone «Scarica la guida gratuita».
  3. «Verifichiamo il tuo livello» 10 domande «per stimare la tua probabilità di superare l'OFA»; «Inizia il test».
  4. Domanda 3/10: «She ___ to Milan last year.» (go, going, went, goes) con «Avanti».
  5. «Il tuo risultato»: misuratore 32 %, «Alta probabilità di non superarlo»; 4 voci rosse (-30 € di costi aggiuntivi; Piano di studi bloccato; Nessun esame al secondo anno; Ritardo di almeno 1 anno); «Continua».
  6. «Verifica il tuo account Polimi»: campo email `@polimi.it` e nota «I tuoi dati sono al sicuro».
  7. «Sblocca l'accesso gratis»: «Invita 3 studenti del Polimi che hanno già superato l'OFA», 3 passi numerati (condividi il tuo link; i tuoi amici si registrano con la email Polimi; quando 3 amici completano la registrazione sblocchi tutti i contenuti), bottoni «Più tardi» e «Invita 3 amici».
  8. «I tuoi inviti, 2 di 3 completati»: barra a tre pallini, elenco con nome, «Ha completato» e spunta; terzo «Amico 3, In attesa…»; «Invita un amico».
  9. «Condividi il tuo link»: campo con `app.ofa-polimi.it/invite/RAFF…` e copia; icone Whatsapp, Instagram, Messaggi, Altro.
  10. «Accesso sbloccato!» regalo rosso con coriandoli, «Hai invitato 3 amici e ora hai l'accesso gratuito a tutti i contenuti.» bottone «Inizia a studiare».
  11. Home «Ciao, Raffaele 👋»: anello di progresso 62 % con «Obiettivo: Superare l'OFA», bottone rosso «Continua a studiare, Grammar – Future Tenses», barra Home, Lezioni, Quiz, Classifica.
  12. «Classifica»: tab Settimana / Mese / Sempre; elenco con medaglie (Marco R. 98 %, Giulia F. 96 %, Alessandro C. 92 %, Tu 88 % evidenziato, …).
  13. «Il tuo profilo»: Raffaele A. «Studente @ Polimi», «Posizione in classifica #4 88 %», righe «I tuoi inviti 2 di 3 completati», «Statistiche Vedi i tuoi progressi», «Impostazioni».
- **Collegamento**: la schermata 7 è il «muro» che l'invito apre al posto del pagamento; 10 chiude con lo sblocco.
- **Corrispondenza con l'app**: 1-5 già in `Onboarding.tsx`; 7-10 in `Invites.tsx` (progresso `verificati / richiesti`, regole, «Compagni verificati»); 11-13 sono Home, Classifica, Profilo (classifica e Project ID spenti).
- **Manca nell'app**: **foglio di condivisione** con scorciatoie (WhatsApp, Instagram, Messaggi, Altro) e pulsante «Copia link» (`Invites.tsx` non ha condivisione nativa né pulsanti per app; ho cercato `navigator.share` e `whatsapp` senza trovarli); schermata «Accesso sbloccato!» con regalo e coriandoli a invito completato; elenco amici con spunte e riga «In attesa…» a tre passi; «guida gratuita» per chi ha già la certificazione (nell'app `certInfo` rimanda al sito, non c'è la guida).
- **Priorità**: media per condivisione, regalo e lista inviti (sono il canale di crescita del lancio); rimandata per classifica e profilo; bassa per la guida PDF.
- **Schermata app**: Onboarding, Inviti, Home, Profilo, Classifica.
- **Da adattare**: «Invita 3 studenti **che hanno già superato l'OFA**» contraddice la regola dell'app (3 compagni verificati che finiscono il diagnostico: `INVITE`): correggere «Invita 3 compagni che devono preparare il test». Verifica `@polimi.it`: l'app usa `mail.polimi.it` (`INVITE.emailDomain`). «Alta probabilità di non superarlo»: vedi 01. Classifica con nomi e percentuali reali di altre persone: nessun nome finto, e rimandata. Link `app.ofa-polimi.it/...`: usare il dominio vero (non «ofa-polimi», sembra ufficiale).

## 06 · `file_0000000017ec81f4bab41f7a9283b467.png` · schermate sfide e progressi
- **Tipo**: schermate app, 14 schermi in due righe. Riga 1: modulo «Sfide» (7). Riga 2: modulo «Profilo» (7). Tema blu.
- **Riga 1, Sfide**:
  1. «Sfide - Home»: titolo «Sfide», «Studia, completa sfide e riduci il rischio OFA.» tab Attive / Classifica / Amici; carta «Sfida della settimana: Completa 5 lezioni» con coppa, barra 5/5, «+100 pt»; elenco «Sfide attive» (7 giorni di studio, Duello simulazione, Grammar Sprint).
  2. «Tutte le sfide»: tab Attive / Completate / Tutte; carte con icona, barra, punti (7 giorni di studio +150, Completa 5 lezioni +100, Duello simulazione +200, Grammar Sprint +80, Simulazione completa +120).
  3. «Dettaglio sfida» «7 giorni di studio»: illustrazione di montagna con bandiera, 7 pallini L M M G V S D con spunte, barra 5/7, riquadri «Ricompensa +150 punti» e «Consigli: Sessioni brevi ma costanti sono più efficaci.», bottone «Continua a studiare».
  4. «Classifica»: tab Settimanale / Mensile / Sempre; podio con 3 utenti e corona; elenco 4-10 con «raffaele.ando 820 pt» evidenziato.
  5. «Amici»: tab I tuoi amici / Richieste; elenco con punti; «Invita amici»; «Sfida un amico: confronta il tuo risultato in una simulazione.»
  6. «Sfide completate»: elenco con spunte verdi e date («Completa 5 lezioni 12 set 2026 +100 pt»).
  7. «Calendario sfide»: calendario di settembre 2026 con giorni in blu/verde, «Streak attuale 5 giorni».
- **Riga 2, Profilo**:
  1. «Profilo - Panoramica»: logo, ingranaggio, foto, nome «Raffaele» `@raffaele.ando`, «Project ID #4821» con copia; 4 numeri (12 livello, 320 pt totali, 7 giorni di studio, 3 badge); «I miei progressi» (Lezioni 24/60, Simulazioni 8, Punteggio medio 72 %); «Obiettivi attivi» (Supera l'OFA: rischio sotto il 20 %, 82 % → 28 %).
  2. «I miei progressi»: tab Panoramica / Lezioni / Simulazioni; grafico «Andamento rischio OFA» da 100 % a 28 %; riquadri Lezioni completate 24/60, Simulazioni 8, Punteggio medio 72 %, Tempo di studio 12h 30m.
  3. «I miei obiettivi»: obiettivo principale «Supera l'OFA» e secondari (30 giorni di studio 7/30, 10 simulazioni 6/10, 80 % in Grammar 65/80), pulsante +.
  4. «I miei badge»: tab Tutti / Sbloccati / Da sbloccare; griglia (7 giorni consecutivi, 10 lezioni, Prima simulazione, Accuracy > 80 %, Sfida completata, Top 10 settimanale) e bloccati con lucchetto (30 giorni consecutivi, 100 lezioni, OFA superato).
  5. «Attività»: cronologia con punti («Lezione completata Future tenses +20 pt», «Simulazione 72 % +50 pt», «Badge sbloccato»).
  6. «Impostazioni»: Account, Preferenze, Notifiche, Privacy, Collegamenti (PoliNetwork, servizi esterni), Aiuto, Informazioni.
  7. «Modifica profilo»: foto, Nome, Username, Email, Bio, «Salva».
- **Manca nell'app**: calendario di studio con i giorni fatti; schermata «Obiettivi» (principale e secondari con barre); cronologia «Attività» con le ultime sessioni; pagina Impostazioni raccolta (oggi suono, tema ecc. sono icone nell'intestazione della Home); selezione per periodo nelle statistiche; scheda di dettaglio di un'attività con una frase di consiglio.
- **Priorità**: media per Progressi (tab Panoramica/Lezioni/Simulazioni), Obiettivi, Calendario di studio, Impostazioni; **rimandata** per Sfide, Classifica, Amici, Badge, Project ID, «Modifica profilo».
- **Schermata app**: Statistiche (`StatsMode.tsx` intitolata «Progressi»), Profilo/Sfide (`ProjectProfile.tsx`, `Leaderboard.tsx`), Menu per le impostazioni.
- **Da adattare**: il metodo di studio dell'utente esclude «livelli/XP/streak» come gamification vuota: i **punti (pt)**, il **livello 12**, i **badge a soglia**, lo **streak** vanno sostituiti con misure reali (padronanza %, accuratezza, argomenti). L'app ha già la fiammella dei giorni di fila nella Home: non estenderla. «Andamento rischio OFA» → «Andamento della probabilità stimata» con solo punti misurati. «Duello simulazione» e «Sfida un amico» sono fuori lancio. «Project ID #4821» e «PoliNetwork» sono Project ID, rimandato. Foto e nomi di altri utenti nelle classifiche: da non inventare.

## 07 · `file_00000000275881f49f6618cde49d8d94.png` · brand board (logo, palette)
- **Tipo**: brand kit (tavola unica).
- **Contenuto**: BRANDMARK (icona stella luminosa in quadrato blu + «AddiOFA» + «IL TUO INGLESE, SENZA OSTACOLI»); LOGO VARIATIONS (wordmark, icona+wordmark, icona nera); COSTRUZIONE DEL BRANDMARK (griglia su fondo blu scuro); LETTERMARK («A» blu con stella); PALETTE (Primario `#0F172A`, Secondario `#3B82F6`, Sfondo `#F6F8FC`, Superfici `#E5E7EB`, Testo secondario `#6B7280`; Rischio/Errore `#EF4444`, Attenzione `#F59E0B`, Successo `#22C55E`, Quiz/Apprendimento `#8B5CF6`); TIPOGRAFIA Inter (Light, Regular, Medium, Semibold, Bold); ICONOGRAFIA (10 icone tonde: libro, grafico, cappello, lucchetto, coppa, documento, euro, email, utente, ingranaggio); ILLUSTRAZIONI (libri con bandiera, quiz, misuratore 82 %, lucchetto, grafico, mondo, coppa, lampadina); ELEMENTI GRAFICI (forma blu, stella a 4 punte, freccia curva, «SMALL STEPS BIG OPPORTUNITIES»); MOODBOARD (Politecnico, icona luminosa, studenti); APPLICAZIONI (telefono con icona, felpa, tote bag); PATTERN E BACKGROUND (3 fondi); TAGLINE E CLAIM («Il tuo inglese, senza ostacoli.», «Small steps. Big opportunities.», «Dall'OFA a tutto il resto.», «Stessi studenti. Percorsi più luminosi.»).
- **Corrispondenza con l'app**: i colori della palette sono già i token usati in `Menu.tsx` (`#0F172A`, `#6B7280`, `#F6F8FC`, `#E5E7EB`, `#EF4444`, `#F59E0B`, `#22C55E`, `#8B5CF6`); la stella è `urlIcona`.
- **Manca nell'app**: forme decorative (macchia blu, stella a 4 punte, freccia curva) come sfondo di schermate vuote; pattern di sfondo per la landing; merchandise non serve.
- **Priorità**: media (pattern e forme per landing e schermate vuote).
- **Da adattare**: «Dall'OFA a tutto il resto» va bene; nessuna promessa. Foto con la scritta «Politecnico di Milano»: usare con cautela (vedi 04). Estratti già in `grafica/brand/`.

## 08 · `file_00000000293081f4b8c01c2d26fff733.jpg` · brand kit illustrazioni (rosso)
- **Tipo**: brand kit rosso «Illustrazioni per l'app OFA Inglese – Politecnico di Milano» con nota «Stile illustrativo ispirato a Duolingo».
- **Contenuto**: Personaggi / Elementi principali (Studio/Inglese, Quiz/Test, Risultato/Probabilità 82 %, Rischio economico, Piano di studi bloccato, Piano Superamento, Successo/Superamento); Illustrazioni contestuali (Email Polimi, Verifica utente, Simulazione esame, Attenzione/Rischio, Progressi/Statistiche, Suggerimenti/Consigli); Icone (14 chip: Studio, Statistiche, Quiz, Contenuti, Costo, Blocco, Successo, Email, Profilo, Impostazioni, Aiuto, Completato, Errore, Info); Elementi UI (Primario, Secondario, Outline, interruttori, casella, radio, barra a segmenti); Progress indicator (Verifica, Quiz, Risultato, Piani, Pagamento, Successo); Illustrazioni di stato (Ricerca, Loading, Completato, Errore, Vuoto/Nessun dato, Celebrazione, Notifica, Attesa, In corso, Obiettivo, Messaggi, Mondo).
- **Corrispondenza con l'app**: è il kit già estratto e usato: `app/src/brand/` (`Illustrazione`, `IconaChip`, `Pulsante`, `Interruttore`, `Casella`, `Radio`, `Avanzamento`, `Barra`, `Badge`, `Stato`, `Misuratore`, `Caricamento`), `BrandKit.tsx`.
- **Manca nell'app**: usare ovunque le **illustrazioni di stato** (Vuoto/Nessun dato per statistiche senza risposte; Attesa per il caricamento dei contenuti; Errore per i fallimenti di rete). Oggi `Stato` esiste ma è usato solo nel kit.
- **Priorità**: alta (già in uso, completare gli stati vuoti/errore).
- **Da adattare**: «Piano Superamento» e «Rischio economico» vanno usate con didascalie prudenti.

## 09 · `file_000000002ca08246993dae6baa22ae9a.png` · calcolo del risultato (6 passi)
- **Tipo**: schermate app, una sola schermata in 6 istanti.
- **Passi**: barra in alto «10/10»; titoli che cambiano: «Calcoliamo il tuo risultato» → «Elaboriamo i tuoi risultati» → «Stiamo analizzando…» → «Ultimi calcoli…» → «Quasi pronto…» → «Il tuo risultato». Il misuratore si riempie 0 % → 18 % → 42 % → 68 % → 80 % → 82 % cambiando colore da blu ad arancio a rosso. Sotto: lista di 4 spunte che si accendono una a una (Grammatica, Comprensione, Vocabolario, Ragionamento). Testi: «Stiamo analizzando le tue risposte per stimare il tuo livello di preparazione.»; «Stiamo confrontando le tue risposte con migliaia di studenti del Polimi.»; «Consideriamo anche la difficoltà delle domande e il tempo impiegato.»; «Stiamo finalizzando il tuo risultato in base al modello di previsione dell'OFA.»; «Ora possiamo mostrarti la tua stima finale.» Nell'ultimo passo: scritta «Risultato di fallimento» in rosso e riquadro con 4 conseguenze (~30 € di costi aggiuntivi, Piano di studi bloccato, Nessun esame dal secondo anno, Ritardo di almeno 1 anno).
- **Manca nell'app**: **la schermata di calcolo**. Oggi `Onboarding.tsx` va da `quiz` a `risk` (conseguenze) a `result` senza alcuna transizione: manca l'animazione del misuratore da 0 al valore con le spunte per area.
- **Priorità**: media (migliora la percezione; breve, 2-3 secondi, saltabile).
- **Schermata app**: Onboarding → Risultato.
- **Da adattare**: la frase «migliaia di studenti del Polimi» è un **numero inventato**: non abbiamo quei dati; dire «Stiamo contando le tue risposte esatte rispetto alla soglia del test (24 su 30)». Il «modello di previsione dell'OFA» deve restare onesto: è `estimatePassProbability(correct, total)`. Le 4 aree (Grammatica, Comprensione, Vocabolario, Ragionamento) devono corrispondere agli argomenti veri dei 10 quesiti. Colori: il misuratore non deve diventare rosso di allarme mentre sale; usare blu → valore finale con il suo colore. Rispetta `prefers-reduced-motion` (l'app ha già `prefersReducedMotion()` nei coriandoli). Non ripetere le conseguenze nell'ultimo passo: sono già in `risk`.

## 10 · `file_000000002cd081f481c01751962e387f.png` · risultato dettaglio (6 passi, variante ricca)
- **Tipo**: schermate app, stessa schermata in 6 istanti con più contenuto.
- **Passi**: 0 % «Analizziamo le risposte…» con 4 spunte (la terza gira) → 22 % «Elaboriamo i tuoi risultati»: elenco **per area con barra e percentuale** (Grammatica 90 %, Comprensione 60 %, Vocabolario 30 %, Ragionamento 10 %) → 48 % «Stiamo analizzando…»: curva a campana con puntino «Il tuo punteggio» contro linea tratteggiata «Media studenti» e fascia «Intervallo tipico» + suggerimento «Il modello tiene conto della difficoltà delle domande e del tempo impiegato.» → 72 % «Quasi pronto…»: «Fattori considerati» con 4 righe (Risposte corrette 35 %, Difficoltà delle domande Alta, Tempo impiegato Più lento della media, Confronto con altri studenti Sotto la media) → 80 % «Ultimi dettagli…»: avviso «Il tuo risultato è inferiore alla media degli studenti che superano l'OFA.» + istogramma con barra «Tu» (Studenti che superano / che non superano) + nota «Questa è una stima statistica basata su dati reali degli anni precedenti.» → 82 % «Il tuo risultato» con 4 conseguenze, bottone rosso «Continua» e secondario «Scopri come migliorare».
- **Manca nell'app**: lista per area con barre dopo il diagnostico (oggi `Onboarding` mostra solo i chip «Da ripassare»); un elenco di «fattori considerati» onesti; pulsante secondario «Scopri come migliorare» che porta al ripasso.
- **Priorità**: media: area per area sì (si calcola dal diagnostico), curva e istogramma no.
- **Schermata app**: Onboarding → Risultato.
- **Da adattare**: **tutto il confronto con altri studenti è inventato** (media, intervallo tipico, istogramma «studenti che superano», «dati reali degli anni precedenti»): non abbiamo quei dati, non mostrarli. «Tempo impiegato: più lento della media» idem. Tenere solo ciò che si calcola: risposte esatte per area (diagnostico da 10 domande: 2-3 per area, quindi **mostrare «n su m», non percentuali precise come 90 %/10 %**), tempo medio per risposta se vero. «Il tuo risultato è inferiore alla media degli studenti che superano l'OFA» → «Il test reale richiede 24 risposte esatte su 30: con 10 domande la stima è prudente».

## 11 · `file_000000002dd88210a17cbb776135db2f.png` · home rischio tre stati b (1024×1536)
- **Tipo**: schermate app (3 home verticali, versione lunga).
- **Schermate**: stesse tre home di 01 (82 / 46 / 18 %) con i saluti «Ciao, Raffaele / Stai facendo progressi! / Ottimo lavoro!», scheda di stato più lunga («Rischio molto alto: Con il tuo livello attuale potresti non superare l'OFA. Inizia a studiare per ridurre il rischio.» / «Stai migliorando! Il tuo rischio si è ridotto del 36% rispetto alla prima valutazione. Continua così!» / «Rischio basso: Con il tuo livello attuale hai ottime probabilità di superare l'OFA. Continua a mantenerti allenato.»). Poi sezione **«Cosa influenza il tuo rischio?»**: 4 righe con icona, barra colorata e percentuale per area (Grammatica 20 / 60 / 85 %, Comprensione 35 / 55 / 80 %, Vocabolario 45 / 65 / 78 %, Ragionamento 50 / 60 / 75 %), ciascuna con freccia. Poi una scheda che cambia: «quanto puoi migliorare? Seguendo il piano di studio puoi ridurre il rischio fino al 20 %» / «Il tuo piano di studio: completa le lezioni consigliate…» / «Simula l'esame». Bottone «Inizia / Continua a studiare / Fai una simulazione». In fondo una scheda finale: «-30 € di costi aggiuntivi: Supera l'OFA ed evita il pagamento, il blocco del piano di studi e il ritardo di almeno 1 anno.» / «Prossimo obiettivo: Completa 3 lezioni di comprensione entro domani.» / «Sei quasi pronto! Consolida le tue conoscenze con altre simulazioni…».
- **Manca nell'app**: **profilo per area nella Home** («Cosa influenza…») con barre colorate e freccia per aprire l'argomento: nell'app esiste solo nelle Statistiche (radar), non in Home; la scheda contestuale che cambia con lo stato (simula l'esame quando si è pronti); la frase di confronto «rispetto alla prima valutazione».
- **Priorità**: alta (è proprio il profilo per argomento della skill «metodo di studio»).
- **Schermata app**: Home/Menu e Statistiche.
- **Da adattare**: «ridurre il rischio fino al 20 %» è una promessa con numero inventato: eliminare. «-30 € di costi aggiuntivi: Supera l'OFA ed evita…»: è un'urgenza/paura; spostarla in una frase neutra («Un tentativo del test di recupero costa circa 30 €») e mostrarla solo prima del Pass. «Completa 3 lezioni entro domani»: scadenza finta, vietata. «Rischio ridotto del 36 %» solo se calcolato dalle misure reali. Percentuali per area: calcolarle con `stats` dell'app (padronanza), non dalle 10 domande.

## 12 · `file_0000000036a081f49ba9a19d5b3d32af.png` · landing mobile (749×2098)
- **Tipo**: landing (pagina scorrevole, mobile).
- **Sezioni, dall'alto**:
  1. Intestazione: icona stella + «AddiOFA», bottone «Scarica l'app», menu.
  2. **Hero**: titolo «Oltre l'OFA, un passo in più.» (con «un passo in più.» in blu), testo «AddiOFA ti aiuta a superare l'OFA di inglese con un percorso personalizzato, evitando rischi, costi e blocchi del tuo piano di studi.», bottone «Inizia ora →», riga con 4 avatar «Già 12.000+ studenti si stanno preparando con AddiOFA»; sullo sfondo foto con portale a stella e studente di spalle.
  3. Fascia di 4 vantaggi con icone: «Evita il rischio di non superare l'OFA», «Non perdere i circa 30 € di tasse», «Sblocca il tuo piano di studi», «Un percorso su misura per te».
  4. «COME FUNZIONA» «Un percorso semplice e guidato.»: 4 passi (Fai il test iniziale; Segui un piano personalizzato; Allenati con simulazioni reali; Supera l'OFA: accedi al secondo anno senza blocchi) accanto a un telefono inclinato con la Home «Sei a rischio? 82 %».
  5. «Tutto ciò che ti serve per arrivare preparato.» 4 schede: Quiz interattivi; Simulazioni ufficiali (timer e formato autentico); Analisi del livello; Spiegazioni semplici; link «Scopri tutte le funzionalità».
  6. Due riquadri: «DATI REALI 82 %: Molti studenti partono a rischio. In base alle nostre analisi, l'82 % degli studenti che inizia senza preparazione adeguata non supera l'OFA al primo tentativo.» e foto con «Il tuo futuro non si ferma a un esame.»
  7. Banner finale «INIZIA OGGI: Sblocca il tuo domani.» «Un piccolo passo ora, per un grande percorso al Politecnico di Milano.» con badge App Store e Google Play e «Stessa partenza. Più possibilità.»
- **Collegamento**: un solo bottone «Inizia ora» ripetuto in alto e in basso.
- **Manca nell'app** (`Landing.tsx`): **immagine hero** (oggi solo la piccola illustrazione dei libri), **mockup del telefono** con la Home, fascia di 4 icone-vantaggio, 4 schede di funzioni con illustrazioni, banner finale con l'icona stella grande, timeline verticale con linea tra i 4 numeri (oggi lista senza linea), intestazione con bottone d'azione sempre visibile. L'app ha già: per chi è, come funziona, gratis/Pass con prezzo, cosa c'è in gioco con scadenze (meglio del design: dati veri).
- **Priorità**: alta (migliora la prima impressione, senza toccare i contenuti veri).
- **Schermata app**: Landing.
- **Da adattare**: **«Già 12.000+ studenti»** e gli avatar: numero e persone inventati, vietati (niente prova sociale finta). **«DATI REALI 82 %»**: numero inventato presentato come reale: rimuovere o sostituire con un dato verificato e citato (ad esempio la soglia 24/30 del TENG). **«Simulazioni ufficiali … formato autentico»**: «ufficiale» vietato → «Simulazioni sul formato del test (30 domande, 15 minuti)». **«ti aiuta a superare l'OFA»**, «Supera l'OFA» come passo 4: promessa → «prepararti a». **«Evita il rischio»**, «Non perdere i 30 €»: tono di paura/promessa → «Sapere a che punto sei prima di pagare un tentativo (circa 30 €)». **Badge App Store/Google Play**: l'app è una PWA, non ci sono negozi: sostituire con «Aggiungi alla schermata Home». **«Scarica l'app»** → «Apri l'app». Mockup: mostrare il misuratore con testo «Probabilità stimata di superare il test».

## 13 · `file_000000003c4081f49a2084c79e44f624.png` · mappa schermate Atlas / NOI / Agorà
- **Tipo**: schermate app, mappa di 15 schermi in blu con tre moduli separati da bande colorate.
- **Riga 1 (8 schermi)**: 1 **Splash screen** («AddiOfa» con onda blu, «Supera l'OFA di inglese. Senza blocchi.»); 2 **Onboarding** (testo «Studia in modo mirato e riduci il rischio di fallire l'OFA.», illustrazione, «Inizia», «Ho già un account»); 3 **Home (AddiOfa)** con misuratore 82 %, «Prossimo passo: Future tenses, Lezione, 10 min, -6 %», «Inizia la lezione», «Il tuo percorso» a tre punti, barra Home, ATLAS, NOI, Studio, Profilo; 4 **Lezione «Future tenses»** 3/10: «Completa la frase: We ___ to Milan tomorrow.» opzioni go / goes / will go / are going, banner verde «Corretto!», bottone «Avanti»; 5 **Simulazione**: timer 32:15, «Domanda 12/40», «By next year, I ___ in Milan for five years.», opzioni, «Segnala» e «Avanti»; 6 **Esplora (ATLAS / NOI)**: tre carte grandi ATLAS «Il tuo percorso personalizzato con l'AI», NOI «Classifiche, sfide e community», Agorà «Discussioni, eventi e confronto»; 7 **Profilo (Project ID)** con 4 numeri e voci (I miei progressi, Classifica, Le mie sfide, Obiettivi, Attività, Collegamenti, Project ID); 8 **Impostazioni** (Account, Notifiche, Aspetto, Privacy, Aiuto, Informazioni).
- **Riga 2 (7 schermi)**: **ATLAS – Algoritmo**: 9 home («Analisi del rendimento: L'AI analizza i tuoi risultati e adatta il percorso», «Vedi analisi», chip Focus attuale, «Prossime lezioni suggerite dall'algoritmo»), 10 analisi (tab Rendimento / Competenze / Consigli, radar su 5 assi Grammatica 70 %, Vocabolario 45 %, Comprensione 60 %, Produzione orale 50 %, Produzione scritta 35 %, «Insight dell'AI»), 11 piano personalizzato (5 argomenti con priorità Alta/Media/Bassa, «Genera un nuovo piano»). **NOI – Classifiche e sfide**: 12 home (tab Classifica / Sfide / Community, Settimana / Mese / Sempre), 13 sfide (7 giorni di grammatica, Sfida simulazione, Streak di studio). **Agorà – Confronto e discussioni**: 14 home (tab Tutti, OFA, Università, Carriera), 15 discussione (thread con risposte).
- **Manca nell'app**: **Splash screen** con la sola icona e il claim; pulsante «Segnala» (domanda sbagliata) nella simulazione; banner verde «Corretto!» con barra di avanzamento in sessione (l'app ha già feedback e suoni: verificare); radar con soglia in Statistiche (esiste in `StatsMode`).
- **Priorità**: media per Splash e «Segnala» (utile per la qualità delle domande), bassa per Lezione e Simulazione (già nell'app), **rimandata** per ATLAS, NOI, Agorà, Esplora, Project ID.
- **Schermata app**: Simulazione (`ExamMode.tsx`), Esercizi (`LearnMode.tsx`), Atlas.
- **Da adattare**: «Domanda 12/40»: l'app ha 30 domande (formato 30 in 15 minuti): non copiare 40. Timer «32:15»: la simulazione dura 15 minuti. «Il tuo percorso personalizzato con l'AI» e «L'AI analizza»: se non c'è, non dirlo. Agorà e community: contenuti moderati e rimandati. «Prossimo passo -6 %»: previsione inventata.

## 14 · `file_000000003fa08210bbdfa3a6380c79ab.png` · home rischio alto (941×1672)
- **Tipo**: schermata app singola (variante di 03).
- **Schermata Home**: stesso misuratore 82 % con piccolo ⓘ dentro; scheda rossa «Rischio molto alto: Completa le lezioni consigliate per ridurre il rischio.»; bottone blu «Inizia a studiare»; sezione «Il tuo prossimo obiettivo» con link «Vedi percorso →» e scheda «GRAMMATICA: Future tenses 0/5 lezioni»; sezione «Come cambia il tuo rischio ⓘ» con curva a tre punti (82 % Oggi, 62 % Dopo 5 lezioni, 28 % Dopo 15 lezioni). Barra in basso Home, Simulazioni, Lezioni.
- **Differenza da 03**: niente titolo «Il tuo rischio OFA», il misuratore sta in alto a tutta larghezza; titoli di sezione più grandi con il link «Vedi percorso».
- **Manca nell'app / Da adattare**: come 03. Da copiare: link «Vedi percorso» accanto al titolo della sezione.
- **Priorità**: alta (stessa schermata di 03: usarne una sola).
- **Schermata app**: Home/Menu.

## 15 · `file_000000004090820aa813bc9aaf3b92a5.png` · brand concept logo stella
- **Tipo**: brand kit (concept).
- **Contenuto**: icona stella luminosa + «AddiOFA» + «Studia oggi, sblocca il tuo domani.»; Concept «Oltre l'OFA, un passo in più.» con testo di presentazione; immagine di uno studente che attraversa il portale a stella con «Lo stesso obiettivo. Un domani più aperto.»; Logo (Brandmark, Wordmark, Lettermark); Palette (`#0F172A`, `#3B82F6`, `#F6F8FC`, `#E5E7EB`, `#6B7280`, `#22C55E`, `#EF4444`, `#F59E0B`); Tipografia Inter (H1 Grande, H2 Medio, Body, Caption); **Parole chiave** (Semplice, Motivante, Istituzionale, Affidabile, Orientato al risultato, Moderno, Student-friendly); Icone principali; Stile illustrativo; **Stile UI** (5 mini schermate: splash, «Sei a rischio?» 82 %, «Quiz di inglese», «I tuoi progressi» con barre, «Obiettivo raggiunto!» «Puoi iscriverti al secondo anno!»); Atmosfera visiva (foto, «Dal test a nuove opportunità», «Stessa partenza. Più possibilità.»).
- **Manca nell'app**: schermata «I tuoi progressi» con barre ascendenti e spunte (Quiz completati, Simulazioni, Piano di studio); schermata «Obiettivo raggiunto!» con coriandoli (l'app ha coriandoli a fine simulazione).
- **Priorità**: media (guida di stile).
- **Schermata app**: identità; Esito (`ExamMode`) per «Obiettivo raggiunto!».
- **Da adattare**: «**Istituzionale**» tra le parole chiave porta a sembrare ufficiali: togliere. «**Puoi iscriverti al secondo anno!**» è una promessa che dipende dal regolamento: scrivere «Hai superato la simulazione: il test vero lo fai con il Politecnico o con l'ente». «Sei a rischio?» titolo allarmistico → «A che punto sei?». Il claim «Studia oggi, sblocca il tuo domani» è accettabile.

## 16 · `file_0000000047c08210949d5a3b00c5dcda.png` · brand kit b (blu, 1881×836)
- **Tipo**: brand kit blu con illustrazioni tridimensionali con aloni dorati.
- **Contenuto**: Palette (Primario `#0F172A`, Secondario `#3B82F6`, Sfondo `#EDF2FF`, Superfici `#F8FAFF`, Testo secondario `#64748B`, Accento/Rischio `#FF6B6B`, Attenzione `#F59E0B`, Successo `#22C55E`, Quiz/Apprendimento `#8B5CF6`); Illustrazioni principali (Studio/Inglese, Quiz/Test, Risultato/Probabilità, Rischio economico, Piano di studi bloccato, Superamento, Successo, Suggerimenti/Consigli); contestuali (Email Polimi con stella, Verifica utente, Accesso bloccato dal secondo anno, Mancato superamento, Progressi/Statistiche, Mondo/Internazionale, Messaggi/Supporto, Celebrazione, Attesa/Caricamento, Ricerca); Icone (14); **Stati e feedback** (4 riquadri: Operazione completata verde, «Qualcosa è andato storto» rosso, «Attenzione, leggi bene» arancio, «Informazione importante» blu); Elementi UI (Primario blu, Secondario, Outline, interruttori, casella, radio); Progress indicator (Verifica, Quiz, Risultato, Piani, Pagamento, Successo); **Elementi extra** (etichette «Più scelto», «Massima sicurezza», «Consigliato»).
- **Corrispondenza con l'app**: stessa struttura del kit blu già in `brand/` (`kit-blu`).
- **Manca nell'app**: i **riquadri di stato/feedback** a 4 toni come componente standard (`Toast.tsx` esiste, `Stato` è nel kit ma non ovunque); l'illustrazione «Accesso bloccato dal secondo anno» (`piano di studi bloccato` esiste).
- **Priorità**: media.
- **Da adattare**: etichetta «**Massima sicurezza**» va con la garanzia: non usarla. «Più scelto» con un solo prodotto non ha senso (nessun confronto): non usarla. «Consigliato» solo se c'è un criterio vero. «Mancato superamento» come illustrazione di un errore: non mostrarla all'utente per un risultato basso. L'icona «Email Polimi» ha lo stemma/stella: non usare lo stemma del Politecnico.

## 17 · `file_0000000049188210ae7849f930a090c8.png` · brand kit c (blu piatto, 1881×836)
- **Tipo**: brand kit blu, variante piatta (senza aloni): stessa struttura di 16.
- **Differenze da 16**: palette con Sfondo `#F6F8FC`, Superfici `#E5E7EB`, Testo secondario `#64748B`, Accento/Rischio `#EF4444` (più vicino all'app e a 07); illustrazioni più semplici; email Polimi con **stemma** del Politecnico e freccia rossa; «Piano di studi bloccato» con lucchetto rosso; ampolla di sabbia rossa per «Attesa».
- **Corrispondenza con l'app**: è la variante che ha generato `kit-blu` in `app/src/brand/`.
- **Manca nell'app**: come 16: riquadri «Stati e feedback» a 4 toni come componente standard e uso diffuso delle illustrazioni di stato (Vuoto, Attesa, Errore); il kit blu non è ancora il tema di nessuna schermata (l'app usa `kit-rosso`).
- **Priorità**: media. **Schermata app**: identità.
- **Da adattare**: come 16 (etichette extra; stemma Polimi). La palette di 17 coincide con i token dell'app: preferirla a 16.

---

# Dettagli da copiare (per chi implementa)

## Componenti nuovi o da completare
- **Misuratore in Home** (01, 03, 11, 14): semicerchio con 10-12 tacche, puntino con bagliore sul bordo, valore grande al centro e due righe sotto («Probabilità stimata di superare il test» / «all'OFA di inglese»); il componente `Misuratore` c'è già, serve in Home con il valore da `appState.onboarding.passProbability`.
- **Scheda di stato a tre toni** (01, 11): riquadro arrotondato con icona tonda (esclamativo / barre / spunta), titolo in grassetto, due righe di testo e freccia a destra; colore di fondo morbido (rosso 8 %, arancio 8 %, verde 8 %).
- **Prossimo obiettivo** (03, 14): scheda con icona libro in un quadrato bianco, etichetta maiuscola piccola («GRAMMATICA»), titolo («Future tenses»), barra di avanzamento e «0/5» a destra; titolo di sezione con link «Vedi percorso →».
- **Cosa influenza la tua stima** (11): righe con icona in quadratino, nome area, barra colorata (rosso → arancio → verde per soglia), percentuale e freccia; toccando si apre l'argomento.
- **ⓘ accanto ai titoli** (03, 14, 01): apre un foglio breve che spiega come è calcolata la stima e il suo limite.
- **Schermata di calcolo** (09, 10): barra «10/10» piena, titolo che cambia ogni 0,8 s («Calcoliamo…» → «Stiamo analizzando…» → «Quasi pronto…» → «Il tuo risultato»), misuratore che sale, lista di spunte per area; durata totale 3 s, saltabile, ferma con riduzione del movimento.
- **Foglio di condivisione** (05): campo link con icona di copia, 4 scorciatoie tonde (WhatsApp, Instagram, Messaggi, Altro) e `navigator.share` dove c'è.
- **Elenco inviti** (05): foto tonda, nome, «Ha completato» con spunta verde, «In attesa…» con cerchio vuoto; sopra barra a tre cerchi collegati da una linea.
- **Regalo «Accesso sbloccato!»** (05): illustrazione del regalo con coriandoli, titolo e un solo bottone («Inizia a studiare»).
- **Calendario di studio** (06): mese con i giorni di studio cerchiati in blu/verde e riga «Giorni di fila».
- **Obiettivi** (06): obiettivo principale con barra e due numeri; obiettivi secondari con icona e «n/m».
- **Riquadri Stati e feedback** (16, 17): 4 toni, icona tonda a sinistra, titolo e riga di testo.
- **Splash** (13): icona stella centrata, «AddiOfa», «Supera l'OFA… Senza blocchi.» → adattare in «Studia oggi, sblocca il tuo domani.»
- **Segnala** (13): bottone secondario a sinistra di «Avanti» in simulazione e in sessione, per segnalare una domanda dubbia.
- **Landing** (12): intestazione con bottone «Apri l'app» sempre visibile; fascia di 4 vantaggi con icone tonde; mockup telefono inclinato su fondo blu; timeline verticale con linea tra i cerchi numerati; banner finale scuro con icona stella e pulsante.

## Micro-interazioni
- Bottone principale con freccia a destra e cerchio bianco con triangolo a sinistra (01, 03, 11).
- Misuratore che si riempie con colore che passa da blu ad arancio (09): meglio mantenere un solo colore fino al valore finale.
- Tre cerchi collegati che si riempiono con spunta verde al completamento di un invito (05).
- Banner verde «Corretto!» sotto le risposte con «Avanti» (13); opzione scelta in rosso chiaro con X rossa (04, 02) o blu pieno (13).
- Coriandoli e scintille sull'illustrazione di successo (02, 05, 13, 15) con `prefers-reduced-motion`.
- Barra di avanzamento a segmenti in alto con freccia indietro (02, 05, 09).
- Tab a pillola in alto (Attive / Completate / Tutte, Settimana / Mese / Sempre, Panoramica / Lezioni / Simulazioni) (06).
- Lucchetto grigio sulle schede bloccate (06 badge «Da sbloccare»): coerente con quello già in `Navigazione`.
- Strisce staccabili in fondo ai poster (04): ripetere il logo in verticale.

## Copy riutilizzabile (già in linea con le regole)
- «Il tuo inglese, senza ostacoli.» · «Oltre l'OFA, un passo in più.» · «Studia oggi, sblocca il tuo domani.» · «Stessa partenza. Più possibilità.» · «Small steps. Big opportunities.»
- «Un percorso semplice e guidato.» · «Dal test iniziale alla preparazione, tutto in un'unica app.»
- «Tutto ciò che ti serve per arrivare preparato.» · «Quiz interattivi», «Spiegazioni semplici», «Analisi del livello» (con «Simulazioni sul formato del test»).
- «Più ti alleni, più la stima si affina.» (al posto di «Più studi, più il rischio si abbassa»).
- «Stai migliorando. Continua così!» (solo con dati reali).
- «Sessioni brevi ma costanti sono più efficaci.» (consiglio dal dettaglio sfida, 06).
- «Il tuo turno.» · «Pronto a metterti alla prova?»

## Da non copiare (riassunto)
- «CRAM Pass Pro», «Pass Simulatore», «Garanzia Promosso», «Massima sicurezza», «Più scelto», prezzi 9,99 / 14,99 / 24,99 con quei nomi.
- «12.000+ studenti», «DATI REALI 82 %», «migliaia di studenti del Polimi», media e istogramma degli studenti, «ridurre il rischio fino al 20 %», curve 82 → 62 → 28 %.
- Testimonianze («Ho superato l'OFA al primo tentativo!»), avatar e nomi in classifica.
- «Simulazioni ufficiali», «timer ufficiale», logo/stemma del Politecnico, targa «Politecnico di Milano» senza disclaimer, parola «Istituzionale».
- «Rischio di fallimento», «Rischio molto alto», «Sei a rischio?», «Probabilità di non superare», «entro domani».
- Punti, livello, serie come gamification (contro il metodo di studio); Project ID, classifica, ambassador, Agorà, ATLAS con «AI» (rimandati).
- Badge App Store / Google Play (l'app è una PWA).
