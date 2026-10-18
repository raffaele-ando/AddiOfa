# Revisione design (18/10): sintesi e decisioni

Nove designer esterni, ciechi e senza memoria del progetto, hanno guardato le schermate (rapporti A, B, C, D) e confrontato i concept con l'implementazione (G1-G5). I rapporti sono in questa cartella. Voti medi dell'implementazione: 5-7 su 10; i concept migliori 8-9 su 10. In sintesi: i concept vincono su hero, risultato, gerarchia sotto il primo schermo e profilo; l'implementazione vince su onestà dei testi, tema scuro, FAQ, domande, esito.

## Problemi trasversali (tutti i revisori)
1. **Vuoti e pulsante staccato**: nelle schermate corte il contenuto sta in alto e il pulsante in fondo, con 24-58 % di vuoto in mezzo. Serve un'impaginazione unica (testata fissa, zona flessibile, piè di pagina fisso; quattro modelli: Storia, Domanda, Lista, Modulo).
2. **Desktop**: colonna di ~390 px in una cornice di 770 px con ~190 px di vuoto per lato → colonna unica da ~480 px senza cornice finta (la Home può avere due colonne).
3. **Header della landing** trasparente: il testo passa sotto logo e menu.
4. **Numeri che si contraddicono** tra schermate (0/116 con 41 %, «Risposte 0» con «Media 24/30», ATLAS «stima su 60 risposte» e poi «ne hai 0»).
5. **Pulsanti, filtri e segmenti a sola icona** (Progressi, Badge, FAQ, Frasi, Simulazioni, esito sfida): vogliono la parola.
6. **Stati vuoto/errore/offline** senza causa né azione; tre mascotte diverse; tono triste.
7. **Risultato** (percentuale senza didascalia, «Hai margine» sotto «2 %», pallino fuori asse a 1-2 %, arco sottile, traccia scura a 1,3:1) e **esito 0/30** (doppio messaggio di fallimento, lancetta orfana).
8. **Quadrati scuri attorno alle icone** nel tema scuro (sembrano buchi); righe-icona con etichetta all'estrema destra; tre sistemi di riga.
9. **Gerarchia piatta** (titolo di sezione 15,5 px e titolo di riga 15 px quasi uguali); testi sotto 12-13 px; scala dei titoli diversa tra sezioni.
10. **Gergo** («diagnostico», ATLAS, «Prepara», «Progetto») e stessa azione con tre nomi.
11. **Barra in basso**: icona «Sfide» più scura (probabile `hover` residuo), «Home» attiva nelle sottopagine.
12. **Studio**: «Non so / Incerto / Sicuro» sembrano disabilitati e non dicono a cosa servono; simulazione: 30 pallini da 6 px.
13. **Funnel**: 24 schermate; troppe richieste (OFA, consensi, «Calcolo») fra l'ultima domanda e il risultato; certificazione e OFA, che possono esonerare, troppo tardi; «Cosa fai al Poli» occupa 5 schermate con titolo doppio.

## Decisioni del coordinatore sui consigli dei revisori
- **Sfere di vetro**: i riferimenti le premiano (44: 9/10) ma l'autore ha detto di non usarle: restano escluse, e nessun cerchio/alone/riquadro tondo attorno alle illustrazioni.
- **Contenuto dei concept da NON copiare**: numeri, utenti, testimonianze, prezzi, piani, «rischio di fallimento» in rosso, curve 82→28 %, stemma/nome del Politecnico come marchio, badge store, streak/punti, foto di volti, scritte inglesi nelle immagini, kit rosso.
- **Parole vietate nell'app** (CLAUDE.md): «Pass», «Sblocca», «Gratis/Prova» come etichette, beta/dimostrativo/esperimento/«presto»/«in arrivo». «Gratuita/gratuito» come affermazione in una frase è lecito; l'etichetta «Gratis» no.
- **Regola «≤ 5 parole in pagina»** (`tools/controlla-testo.py`): si allenta per ciò che i revisori chiedono con ragione: una riga di spiegazione sotto una fascia di stato (≤ 10 parole), una frase rassicurante nel risultato, la causa negli stati vuoti/errore. Queste righe vanno in `data-testo-ok`. Il resto resta breve. Le spiegazioni lunghe stanno dietro la «i».
- **Funnel** (decisione dell'autore, confermata): email PoliMi (nome ricavato), «come ci hai conosciuto» fra le domande, percorso di studi a cascata, certificazione, OFA, consensi; le richieste stanno SPARSE fra le domande, una per schermata o unite quando hanno senso (es. corso+anno, certificazione+OFA); nessuna richiesta fra l'ultima domanda e il risultato; ≤ 18 schermate in tutto.
- **Cifre da verificare prima di pubblicarle** («circa 30 € a tentativo», «solo esami del 1° anno», scadenze del 2° anno): vengono da `config/offer.ts`; non cambiarle senza fonte; se non verificabili, formulazione prudente.
- **Animazioni**: nessuna (CLAUDE.md); resta la comparsa scorrendo nella landing.
- **Logo**: unica stella e «O» azzurra come nel concept 07/28/15 solo se leggibile a 24 px in chiaro e scuro; è una proposta da mostrare, non da imporre.

## Verifica richiesta a ogni agente
`tsc`, `npm test`, `python3 tools/controlla-testo.py`, contrasto, schermate PNG a 400 e 1280 px in chiaro e scuro, A PAGINA INTERA (la pagina scorre dentro un contenitore: usare un viewport alto, es. 400×2600), zero errori in console, nessuno scorrimento orizzontale; confronto a occhio con le schermate dei rapporti.
