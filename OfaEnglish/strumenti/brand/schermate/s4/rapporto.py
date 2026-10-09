"""Scrive brand/concept-svg/_rapporti/s4.json (tutti gli id delle immagini 18 e 20)."""
import json, pathlib
RAD = pathlib.Path(__file__).resolve().parents[4]
n18 = {1: "01-profilo", 2: "02-statistiche", 3: "03-frasi-e-vocaboli", 4: "04-quiz-domanda", 5: "05-quiz-completato", 6: "06-correzioni",
       7: "07-simulatore-esame", 8: "08-simulazione-domanda", 9: "09-simulazione-completata"}
note18 = {
 1: "Barra del livello portata al 65% (l'originale la disegnava al 58%); icone del menu (pupazzetto, badge storto) = bersaglio, grafico, scudo, ingranaggio; avatar = sagoma segnaposto (non foto). Testi leggibili, nessun testo ricostruito.",
 2: "Barre delle abilita' lunghe quanto la percentuale scritta (l'originale no); grafico a 18 barre uguali e allineate; icone delle abilita' rifatte; nav con Profilo attivo (originale: nessuna). Nessun testo ricostruito.",
 3: "Stelle vere (a 5 punte regolari), chip Gia' note rimesso dentro il margine, sei frasi come nell'originale. Nessun testo ricostruito.",
 4: "Quiz 3/10: avanzamento a 10 segmenti con 3 pieni (l'originale 8 segmenti, 2 pieni); nav con Lezioni attiva. Testi dall'originale.",
 5: "Quiz completato 80%: illustrazione kit-rosso/stati/completato (riuso) + coriandoli disegnati; misuratore ellittico con pomello sull'arco. Testi leggibili.",
 6: "Correzioni: ritaglio tagliato a destra, scheda ricostruita simmetrica; spunte e X vere; frasi e risposte dell'originale. Nessun testo ricostruito.",
 7: "Simulatore d'esame: sottotitolo AI storto ('e temmpli e tempo reale') ricostruito come 'e tempi reali.' (TESTO RICOSTRUITO); scena cronometro+foglio disegnata (il kit ha solo il blocco appunti); icone delle righe rifatte; ritaglio tagliato a destra, margine ricostruito.",
 8: "Simulazione 12/40: avanzamento 10 segmenti con 3 pieni (originale 9 disuguali); timer e scudo Grammar ridisegnati; segnalibro vero. Testi leggibili.",
 9: "Simulazione completata 76%: coppa = riuso kit-rosso/illustrazioni/successo-superamento + coriandoli disegnati; 30 + 10 = 40 domande coerente con la schermata 8. Testi leggibili.",
}
v = []
for i in range(1, 10):
    st = "riuso" if i in (5, 9) else "svg"
    v.append({"elementi": [f"18.{i:03d}"], "stato": st, "svg": f"brand/concept-svg/schermate/18-schermate-profilo-statistiche/{n18[i]}.svg", "nota": note18[i]})
n20 = {1: "01-calcoliamo-0", 2: "02-elaboriamo-18", 3: "03-stiamo-analizzando-42", 4: "04-ultimi-calcoli-68", 5: "05-quasi-pronto-80", 6: "06-il-tuo-risultato-82"}
note20 = {
 1: "Calcoliamo 0%: motore parametrico di s5 (strumenti/brand/schermate/s5/motore.py) + corpo proprio (elenco passi con icone). Intestazione 10/10 con barra piena, pomello sull'arco, nessuna tacca (non ci sono nell'originale). Ritaglio tagliato a destra come l'originale. Testi leggibili.",
 2: "Elaboriamo 18%: stesso motore s5; passi Grammatica/Comprensione fatti, Vocabolario in corso. Testi leggibili.",
 3: "Stiamo analizzando 42%: stesso motore; arco blu->ambra; tre passi fatti, Ragionamento in corso. Testi leggibili.",
 4: "Ultimi calcoli 68%: stesso motore; tre fattori (Difficolta' delle domande, Tempo impiegato, Modello di previsione) con barre, icone rifatte (barre, cronometro, documento). Testi leggibili.",
 5: "Quasi pronto 80%: come la 4 + spunte verdi di completamento; testi leggibili.",
 6: "Il tuo risultato 82%: motore s5 + conseguenze (~30 euro di costi, piano bloccato, nessun esame dal secondo anno, ritardo di 1 anno; nessuna cifra inventata, sono nell'originale) + Continua; ritaglio tagliato in basso come l'originale.",
}
for i in range(1, 7):
    v.append({"elementi": [f"20.{i:03d}"], "stato": "svg", "svg": f"brand/concept-svg/schermate/20-schermate-risultato-sei/{n20[i]}.svg", "nota": note20[i]})
out = RAD / "brand/concept-svg/_rapporti/s4.json"
out.write_text(json.dumps(v, indent=1, ensure_ascii=False)); print(out)
