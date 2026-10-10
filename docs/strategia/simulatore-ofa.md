# Simulatore OFA di inglese

> Fonte: copiato da `strategia_personal_brand.md`. Da qui in poi si può riscrivere liberamente.

Il progetto vive nel repository **AddiOfa** (lì anche l'analisi delle graduatorie). Qui il riassunto per raccontarlo.


> Stato: idea e strategia in costruzione. Qui sotto c'è quello che ho capito delle tue intenzioni; va rivisto man mano.

**Cos'è.** Una web app per preparare l'OFA di inglese del Politecnico (stile Duolingo, ripasso intelligente, simulazioni d'esame con 30 domande in 15 minuti e soglia 25/30, come il test degli enti convenzionati). Nasce dall'app con cui hai superato tu l'OFA.

**Intenzioni.**
- Renderla pubblica e guadagnarci dagli studenti con OFA ENG, che per ogni tentativo pagano 27,50–29 € agli enti esterni (Language Academy, LinguaViva) e rischiano il blocco del piano di studi.
- Poi allargarla: OFA di matematica, altri atenei (PoliTo, test CISIA/TOLC da 35 € a tentativo, università con test di recupero a pagamento), corsi intensivi a pagamento prima delle sessioni.
- Obiettivo personale: arrivare a mantenerti a Milano (circa 16.000 € netti l'anno). Visione a lungo termine: startup EdTech da far crescere e poi vendere.

**Dati raccolti finora (solo aggregati, nessuna lista di persone).**
- Ammessi al Poli con OFA ENG: circa 1.400–1.600 l'anno (21–25% di chi ha il dato); punteggio d'inglese medio circa 20 contro 27 di chi non ha l'OFA.
- Corsi con più OFA ENG: Progettazione dell'Architettura (oltre 300 l'anno), Gestionale, Informatica, Meccanica; in percentuale Produzione Industriale, Elettrica, Civile, Informatica Online, Edile-Architettura.
- Sondaggio nei gruppi di Gestionale (4 scaglioni, senza doppioni): 32 su 136 con OFA (23,5%).

**Modello in valutazione.** Test diagnostico gratuito; accesso completo a 9,99–14,99 € (meno di un tentativo d'esame); inviti ad amici per sbloccarlo gratis (quanti inviti è da provare con test A/B tra corsi diversi, contando solo inviti con uso reale); commissione a chi lo fa comprare; eventuale rimborso se si studia davvero e non si passa; accesso solo con mail istituzionale verificata con codice.

**Distribuzione pensata.**
- **Profilo Instagram polimi.agora (circa 6.000 follower)** come canale per farlo conoscere.
- Sondaggi nei gruppi e contatto diretto con chi ha l'OFA; bacheche studentesche; ricerca su Google.
- Partire da Architettura e Design (più OFA, meno esposizione nei gruppi di Ingegneria), poi Ingegneria a Bovisa e Leonardo.

**Lavoro tecnico da fare prima del lancio.** Spostare dati e logica su Cloudflare (Pages, Workers, D1) tenendo solo il login Google; togliere domande e risposte dal codice che arriva al browser; eliminare il salvataggio ogni 60 secondi e il documento unico per utente (limite di 1 MB); impedire che l'utente si dia l'accesso a pagamento da solo; login a schermo intero su telefono.

**Previsioni prudenti.** Con il solo OFA d'inglese del Poli: da circa 170 € a circa 2.000 € netti l'anno (scenario più probabile 500–1.000 €). Per arrivare ai 16.000 € servono gli altri prodotti e atenei.

**Da chiarire prima di andare avanti (rischi reali).**
- **Fisco:** una vendita online continuativa richiede la Partita IVA; l'inquadramento più economico (libero professionista, senza contributi fissi) per un'app non è scontato. Serve un commercialista **prima** di incassare il primo euro.
- **Conflitto d'interessi:** sei admin di PoliNetwork e ne dirigi Design & Marketing. Promuovere un tuo prodotto a pagamento nei suoi gruppi o tramite profili non dichiarati mette a rischio il ruolo e la fiducia, che sono la base del Pilastro 3. Anche l'uso di polimi.agora va concordato con Agorà, dichiarando che è un tuo progetto.
- **Pratiche vietate:** nella chat sono emerse tattiche come notifiche di attività inventate, conti alla rovescia finti, account falsi che si «consigliano» l'app, condizioni del rimborso poco visibili. Per il Codice del Consumo sono pratiche commerciali scorrette sanzionabili dall'AGCM, e contraddicono l'immagine di rappresentante degli studenti.
- **Nome:** niente «Polimi» nel nome del prodotto, più una nota che non è un servizio ufficiale del Politecnico.
- **Numeri:** alcune stime della chat erano sbagliate (per esempio il calcolo degli inviti ignorava che nei gruppi le persone sono sempre le stesse). Contano solo i dati misurati.

## Aggiornamento 27/09/2026 (detto da te)
- Nome dell'app: **AddiOFA**.
- Login con l'account unico di Project; algoritmo e infrastruttura di ATLAS; classifica collegata a NOI. Vedi `ecosistema_project.md`.
- Sponsorizzazione: banner nel form dei messaggi del sito di Agorà e post su polimi.agora scritti con la sezione "studio" della dashboard di Agorà (da finire).
- Nota: polimi.agora è una pagina tua (Centro gestione account, 27/09/2026). Resta valido dichiarare che AddiOFA è un tuo prodotto e non un servizio del Politecnico.
