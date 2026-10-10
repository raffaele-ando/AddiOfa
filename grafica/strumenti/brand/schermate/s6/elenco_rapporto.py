N30 = {1: ("splash", "Splash blu con logo AddiOfa e slogan 'Supera l'OFA di inglese. Senza blocchi.'; onde decorative ridisegnate pulite. Testi leggibili."),
 2: ("onboarding-1", "Benvenuto: logo, 'Studia in modo mirato con l'intelligenza di ATLAS', illustrazione documento+grafico+fogli ridisegnata (originale sfocata e asimmetrica). Testi leggibili."),
 3: ("onboarding-2", "Cinque benefici (ATLAS, lezioni ed esercizi, simulazioni, sfide con NOI, confronto su Agorà): icone rifatte pulite al posto dei glifi AI storti. Testi leggibili a 2,6x."),
 4: ("test-iniziale", "Domanda 'If I ___ more time, I would travel' con 4 scelte radio ('had' selezionata, corretta); manca il pulsante come nell'originale."),
 5: ("risultati-test", "Radar a pentagono costruito esatto sui 5 valori delle etichette (72/58/65/78/62): nell'originale il poligono non li rispettava. Card ATLAS con marchio ridisegnato."),
 6: ("home", "Home con arco del rischio 82% (stessi toni di 03); il pulsante dell'originale non aveva etichetta: aggiunto 'Inizia la lezione' (testo ricostruito da 31.006). Avatar generico (niente foto). Meta della card 'Lezione - 10 min - -6% rischio' ricostruita (garbata nell'originale)."),
 7: ("studia", "Studia (panoramica): tab, card percorso ATLAS, 'Continua da qui', unità. Righe 1-2 completate per coerenza con 31.011. Testo piccolo 'Basato sui tuoi risultati e obiettivi' e 'Lezione - 10 min / -6% rischio' ricostruiti."),
 8: ("lezione", "Lezione Future tenses con spiegazione e due esempi; barra di avanzamento riempita 3/10 (vuota nell'originale)."),
 9: ("esercizio", "Completa la frase 'We ___ to Milan tomorrow.' (will go) con box Corretto!; frase di conferma letta 'Will go e la forma corretta'."),
 10: ("simulazioni", "Elenco simulazioni + card ATLAS; chevron su tutte le voci (come 31.010). Icone ridisegnate."),
 11: ("risultato-simulazione", "Anello 72% (29/40), analisi ATLAS, barre 'Aree da migliorare' con soglie di colore coerenti (65/80/45/90). Tab-bar con Studia attiva (nell'originale era Sfide)."),
 12: ("sfide", "Sfide: scheda della settimana (+100 pt), tre sfide attive. Sottotitolo '5/7 giorni consecutivi' ricostruito (illeggibile nell'originale); icone rifatte."),
 13: ("sfida-dettaglio", "Dettaglio '7 giorni di studio' 5/7, giorni L-D con spunte, ricompensa +150 punti. Emblema coppa/scudo/nuvola ridisegnato."),
 14: ("classifica", "Classifica settimanale: podio ale.dis / giulia.p / marti.s con punti letti (1.240, 1.560, 1.120), righe 4-7 e card posizione #5 820 pt. Avatar: busti generici (foto non riprodotte). Separatore migliaia uniformato all'italiano."),
 15: ("profilo", "Profilo Project ID: Raffaele @raffaele.ando, #4821, statistiche 12/320/7/3 e 7 voci di menu."),
 16: ("impostazioni", "Impostazioni (6 voci con sottotitoli). Nell'originale la schermata e' tagliata dal bordo del foglio e i sottotitoli sono troncati: ricostruita schermata intera, sottotitoli completati. Senza tab-bar come l'originale."),
}
for k, (nome, nota) in N30.items():
    add(f"30.{k:03d}", C30, k, nome, nota)
add("31.001", C31, 1, "splash", "Splash blu con logo e slogan (senza onde, come nell'originale).")
add("31.002", C31, 2, "onboarding", "Benvenuto 'Valuta il tuo livello, studia in modo mirato e riduci il rischio di fallire l'OFA' con documento inclinato ridisegnato simmetrico.")
add("31.003", C31, 3, "verifica-ofa", "'Hai gia' l'attestato OFA di inglese?' con due scelte (Si', l'ho gia' superato / No, devo ancora sostenerlo). Testi leggibili.")
add("31.004", C31, 4, "email-polimi", "'Inserisci la tua email @polimi.it': progresso 1/5, campo email, Continua, nota dati al sicuro. Testi leggibili.")
add("31.005", C31, 5, "quiz-valutazione", "Quiz 3/20 'Scegli la frase corretta', She ___ to Milan every week, goes selezionata.")
add(["31.006"], C31, 7, "lezione", "Il ritaglio 31.006 contiene DUE schermate sovrapposte (Lezione e Lezioni lista): qui la Lezione 'Future tenses'. Barra di avanzamento vuota come nell'originale.")
add(["31.006"], C31, 11, "lezioni-lista", "Seconda schermata del ritaglio 31.006: lista Lezioni (Present simple... Conditionals), 1-2 completate, 4 corrente.")
add(["31.007"], C31, 9, "fine-lezione", "Il ritaglio 31.007 contiene Fine lezione e Il tuo percorso: 'Lezione completata!' 82% -> 76%.")
add(["31.007"], C31, 13, "il-tuo-percorso", "Seconda schermata del ritaglio 31.007: Il tuo percorso (82/62/28 %) con tre voci; grafico ridisegnato.")
add(["31.008"], C31, 10, "simulazioni", "Il ritaglio 31.008 contiene Simulazioni e Profilo: Simulazioni con tre voci.")
add(["31.008"], C31, 14, "profilo", "Seconda schermata del ritaglio 31.008: Profilo (Raffaele, raffaele@polimi.it, progressi, notifiche attive, FAQ, Esci).")
add(["31.009", "31.011", "31.012"], C31, 6, "home", "I ritagli 31.009 (arco 82%), 31.011 (card Prossimo passo) e 31.012 (Il tuo percorso) sono parti della Home 31.006-schermata: coperti dall'unica Home completa. Meta della card letta a 1,9x; disegnata con scala uniforme (la Home dell'originale ha un grande vuoto sotto).")
add(["31.010"], C31, 8, "esercizi", "Il ritaglio 31.010 contiene Esercizi e Dettaglio lezione: qui 'Completa la frase' con Corretto! (il box verde dell'originale era sovrapposto al pulsante: corretto).")
add(["31.010"], C31, 12, "dettaglio-lezione", "Seconda schermata del ritaglio 31.010: dettaglio lezione con Spiegazione / Esempi / Esercizi / Quiz finale; icone ridisegnate.")
