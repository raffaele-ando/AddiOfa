# Colore e gerarchia: profilo, home, impostazioni (agente COLORE-A, 16/10)

Prove: server demo sulla porta 5211 (fermato), Chromium 400 e 1280 px, chiaro e scuro, stato «ricco» e «vuoto». Screenshot e confronti (prima | dopo | concept) in `docs/lavoro/extra/colore/profilo/` (`confronto-<schermata>-<tema>.png`, `<schermata>-400|1280-<tema>.png`).

## Scelte di colore (valgono per tutta l'app)
- Giorni di studio = ambra; tempo di studio = ambra (sforzo); domande imparate = verde; simulazioni = blu; obiettivi e progresso verso l'obiettivo = verde; badge e livelli = viola; scadenza (data del test) = ambra; Pass/premio = ambra; sfide = corallo; inviti, amici, statistiche, profilo = blu.
- Badge per gruppo: studio (domande e argomenti imparati) verde, simulazioni blu, costanza (giorni di studio) ambra, livello viola. Sbloccato = tessera tinta nel tono del gruppo; bloccato = tessera neutra con lucchetto. Barra e contatore del gruppo nel tono. Il brief d'esempio diceva «studio = blu»: ho seguito la regola 4 (domande imparate = verde) per non avere due gruppi blu.
- Le illustrazioni dei badge sono del kit blu e non si ricolorano: il tono sta nella tessera, nella barra e nel contatore.

## Schermate
- **Profilo**: le 4 tessere «Il tuo studio» hanno icona nel proprio tono (ambra, verde, blu, ambra), numero navy. «Livello attuale» ridotta a etichetta + «9/24 verso A2» in viola, livello grande viola, barra viola, una frase («Ancora 6 domande A2 da imparare») e la nota in piccolo (la nota del nucleo gratuito è fusa in essa). Il Pass è l'unico blocco tinto (ambra) quando manca, con un solo pulsante pieno blu (tolti «Inizia» nello stato vuoto e il titolo «Il tuo Pass», che ripeteva quello della carta). Righe con icone per significato. Tolta la riga «Impostazioni» (c'è l'ingranaggio accanto al titolo) e il gruppo da un solo elemento (Esplora entra nel secondo gruppo).
- **Obiettivi**: sottotitolo nel posto giusto; tolti i titoli di sezione che ripetevano il titolo della carta; icone nei toni (data e minuti ambra, probabilità verde); barre sempre verdi, «raggiunto» con segno e testo verdi; conto alla rovescia in ambra; scelte selezionate in blu tinto con bordo (restano pieni solo i veri pulsanti).
- **Calendario**: giorni studiati in ambra (navy su ambra chiaro; in scuro testo scuro su ambra), oggi con anello blu, data del test con bandierina ambra (scadenza); legenda aggiornata.
- **Badge**: vedi sopra; sottotitolo con il conteggio in viola.
- **Attività**: grafico delle domande blu, dei minuti ambra; icone nelle tre tessere; simulazione non superata in corallo (prima ambra), superata in verde con testo verde.
- **Impostazioni**: freccia a sinistra del titolo come tutte le altre pagine (componente `Pagina` di `extra/ui`); icone per significato (profilo, dati e aiuto blu; Pass e promemoria ambra; obiettivo verde; cancella corallo); le utilità senza significato (tema, suoni, legali, versione) neutre; «Scopri il Pass» e «Sblocca il Pass in prova» non hanno più la stessa icona; «Attivo» in verde.
- **Home** (struttura intatta): tessera dell'argomento in tinta blu (lezione = studio) invece che bianca, barra delle domande imparate verde, lucchetto del Pass ambra, spazi a 24 px tra le sezioni; per l'utente nuovo il banner non ripete più l'etichetta del pulsante («Scopri da dove partire» / «Il diagnostico: 10 domande, 3 minuti, gratis»).

## Prove (numeri onesti)
- `npx tsc --noEmit` pulito; `npm test` dalla radice: 217 su 217 verdi.
- 64 caricamenti (8 viste x ricco/vuoto x 400/1280 x chiaro/scuro): nessuno scorrimento orizzontale; unici errori in console: un 404/500 su `src/screens/landing/Passi.tsx` all'apertura della landing (file di un altro agente in modifica, non mio). Non ho lanciato `build:demo` (vietato dal brief).
- Contrasto: testi colorati solo con token `*-testo`; `text-viola` e `text-medio-numero` solo per numeri grandi e icone (≥ 3:1). Non ho eseguito `tools/controlla-contrasto.py` sulle nuove combinazioni (giorni del calendario valutati a occhio).

## Non fatto / richieste
- Profilo-modifica lasciata com'era (la selezione blu è uno stato, non decorazione).
- Esplora usa il viola solo per non avere due righe blu adiacenti (significato debole): si può passare a blu riordinando.
- Per coerenza: Statistiche (area studio) dovrebbe usare gli stessi toni (giorni e tempo ambra, imparate verde, simulazioni blu); `Lezioni.tsx` ha ancora le barre blu per le domande imparate (nella home ora sono verdi).
- `ui.tsx` e `index.css` non toccati; servirebbero un tono «neutro» in `IconaTono` e un token `viola-numero`.
