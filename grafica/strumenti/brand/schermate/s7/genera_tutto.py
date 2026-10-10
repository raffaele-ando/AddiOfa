"""Rigenera le schermate di 34 e 36, le tavole di controllo (originale | disegno | differenza), la tavola d'insieme e il rapporto s7.json.
    python3 genera_tutto.py"""
import json, subprocess, sys, pathlib
QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI))
for f in ("s34.py", "s36.py"):
    subprocess.run([sys.executable, str(QUI / f)], check=True, stdout=subprocess.DEVNULL)
for i in (34, 36):
    subprocess.run([sys.executable, str(QUI / "controlla.py"), str(i)], check=True)

from componenti import *
from PIL import Image
A, B = TAV / "34-insieme.png", TAV / "36-insieme.png"
a, b = Image.open(A), Image.open(B)
S = Image.new("RGB", (max(a.width, b.width), a.height + b.height + 20), (226, 232, 242)); S.paste(a, (0, 0)); S.paste(b, (0, a.height + 20))
S.save(TAV / "_tavola.png")

def rel(ch): return str(percorso_svg(ch).relative_to(RADICE))
V = []
def voce(ids, stato, ch, nota): V.append({"elementi": ids, "stato": stato, "svg": rel(ch) if ch else None, "nota": nota})
N_AV = "Avatar-foto sostituiti da avatar neutri (t.avatar_f / iniziale R). "
voce(["34.001"], "svg", (34, 1), "Splash blu: logo bianco + slogan 'Supera l'OFA di inglese. Senza blocchi.' (letti a 3x); onde chiare ridisegnate. Il ritaglio tagliava il bordo destro del telefono: ricostruito simmetrico. Scritte del foglio ('1. Splash screen', frecce) non riprodotte.")
voce(["34.002"], "svg", (34, 2), "Onboarding con logo AddiOfa, tre righe di tagline (ATLAS in blu), illustrazione dei fogli ridisegnata, 3 puntini, pulsante Inizia. Testi leggibili.")
voce(["34.003"], "svg", (34, "3a"), "Il ritaglio 34.003 contiene DUE schermate: qui 'Test iniziale (con ATLAS)' (3/20, Choose the correct form, 4 opzioni, card ATLAS). Testi leggibili; nessun testo ricostruito.")
voce(["34.003"], "svg", (34, "3b"), "Seconda schermata di 34.003: 'Il tuo livello' con radar (72/62/58/65/78 %): i raggi ora sono proporzionali ai valori (nell'originale il pentagono era quasi regolare). Testo nella card ATLAS piccolo, ricostruito dal contesto ('ATLAS ha analizzato le tue risposte e ha creato un percorso personalizzato.').")
voce(["34.004"], "svg", (34, 4), "Home con rischio 82 %: misuratore del kit (ui.misuratore) al posto dell'arco AI; card 'Prossimo passo', 'Il tuo percorso' 82/62/28 %, nav a 3 voci. " + N_AV)
voce(["34.005"], "svg", (34, 5), "Studia (Percorso/Esercizi/Simulazioni), 'Percorso personalizzato' di ATLAS, 'Continua da qui', 'Tutte le unità' con Future tenses evidenziata. Nell'originale mancava la voce 4 come numero: resa con il tondo play (unità corrente). Testo piccolo della card ATLAS ('Basato sui tuoi risultati e obiettivi.') letto a 3x.")
voce(["34.006"], "svg", (34, 6), "Lezione Future tenses 3/10: '1. Spiegazione', esempi I will go to Milan / I am going to study. La barra di avanzamento, grigia nell'originale, ha il 30 % pieno (3/10).")
voce(["34.007"], "svg", (34, 7), "Esercizio 'Completa la frase' (We ___ to Milan tomorrow) con 'will go' selezionata, feedback 'Corretto!' e Avanti. Testo del feedback leggibile.")
voce(["34.008"], "svg", (34, 8), "Simulazioni (lista): completa, per argomento, le mie simulazioni + card ATLAS. Icone: libro, ingranaggio ridisegnate. Testi leggibili.")
voce(["34.009"], "svg", (34, 9), "Risultato simulazione 72 % con anello (29/40), analisi ATLAS, aree da migliorare (65/80/45/90 %). Barra Listening 45 % rossa come nell'originale.")
voce(["34.010"], "svg", (34, 10), "Classifica NOI: podio ale.dis 1.560, giulia.p 1.240, marti.s 1.120; righe 4-7 (fede.it, raffaele.ando 820, luca.m, chiara.m); 'Sfide attive' 3/5. TESTO RICOSTRUITO: '60 %' a destra della barra (illeggibile nell'originale, coerente con 3/5). " + N_AV)
voce(["34.011"], "svg", (34, 11), "Sfida settimanale: Completa 5 lezioni, 3/5, checklist (3 fatte), Ricompensa +100 punti, Badge esclusivo. Testi della checklist e della ricompensa leggibili ma piccoli (ricontrollati a 3x). Trofeo ridisegnato.")
voce(["34.012"], "svg", (34, 12), "Discussione (Agorà) come foglio sopra la schermata oscurata: domanda 'Qual è il modo migliore per studiare i phrasal verbs?', laura.s e marco.p. Testo dei commenti leggibile; conteggi 15 e 8. " + N_AV)
voce(["34.013"], "svg", (34, 13), "Profilo: Raffaele @raffaele.ando, Project ID #4821, 12 livello / 320 pt / 7 sfide / 3 badge, elenco (progressi, Classifica NOI, sfide, Obiettivi, Attività, Project ID). Nessun elemento di nav attivo, come l'originale.")
voce(["34.014"], "svg", (34, 14), "Impostazioni: Account, Preferenze, Notifiche, Privacy, Aiuto, Informazioni con sottotitoli (letti a 3x). Icone semplificate (le originali erano illeggibili).")
voce(["36.001"], "svg", (36, 1), "Splash di 36 (bianco con logo + arco blu): diverso da 34.001 (che è blu pieno). Arco ridisegnato come forma unica morbida.")
voce(["36.002"], "svg", (36, 2), "Onboarding di 36 (tagline su 4 righe centrate): variante di 34.002, SVG separato.")
voce(["36.003"], "svg", (36, 3), "Test iniziale di 36: stessa schermata di 34 'Test iniziale' (stesso layout e testi), ridisegnata con le proporzioni di 36.")
voce(["36.004"], "svg", (36, 4), "Risultati ATLAS di 36: 'Inizia il tuo percorso' e testo 'Più studi, più il rischio si abbassa.' (diverso da 34.003). Radar con raggi proporzionali.")
voce(["36.005"], "svg", (36, 5), "Home di 36 con avatar R, nav a 5 voci (Home, Studio, Simulazioni, Classifica, Profilo), rischio 82 %, Prossima lezione Future tenses, 'Il tuo progresso'.")
voce(["36.006"], "svg", (36, 6), "'Lezione' di 36 = Future tenses + 'Completa la frase' (We ___ to Milan tomorrow, will go corretto). Margini resi simmetrici: nell'originale il contenuto toccava il bordo sinistro del ritaglio.")
voce(["36.007"], "svg", (36, 7), "Ranking NOI: podio ale.dis 1.560, marti.s 1.240, giulia.p 1.120; righe 4-7; card NOI 'Sfida gli altri, scala la classifica e sblocca badge esclusivi.' Il logo NOI (illeggibile, 'ΙΟΙ') reso come wordmark NOI. " + N_AV)
voce(["36.014"], "svg", (36, 14), "Simulazioni (lista) di 36 con nav a 5 voci (ritaglio 36.014 = voce 8 'Simulazioni' del foglio). Testi leggibili.")
voce(["36.008"], "svg", (36, 8), "Dettaglio simulazione personalizzata (ATLAS): 40 domande, 60 minuti, Livello adattivo, Focus su Grammar/Future tenses/Modal verbs; pulsante Inizia simulazione. Nav a 5 voci, Simulazioni attiva (nell'originale era evidenziata Classifica per errore).")
voce(["36.009"], "svg", (36, 9), "Risultato simulazione 72 % con anello, analisi ATLAS, aree (65/80/75/90 %): stessa schermata di 34.009 con 5 voci di nav e Listening 75 %.")
voce(["36.010"], "svg", (36, 10), "Correzione con ATLAS (Domanda 12): Risposta sbagliata, have/had, Spiegazione di ATLAS sul past perfect, Vedi altri esempi. TESTO RICOSTRUITO parzialmente: spiegazione ('Si usa il past perfect (had) per esprimere un'ipotesi non reale nel passato.') letta a 3x ma piccola.")
voce(["36.011"], "svg", (36, 11), "Discussione (Agorà) contestuale: chip 'Da una tua simulazione' + Agorà, domanda, commenti laura.s / marco.p. Corretto 'ƒ12 risposte' -> '12 risposte'. " + N_AV)
voce(["36.012"], "svg", (36, 12), "Profilo (Project ID): come 34.013 ma con le voci 'Le mie sfide (NOI)' e 'Discussioni (Agorà)'. Nav normalizzata a quella a 5 voci con Profilo attivo (nell'originale era un'altra serie ATLAS/NOI/Agorà con voci illeggibili).")
voce(["36.013"], "svg", (36, 13), "Impostazioni di 36: aggiunti freccia e titolo 'Impostazioni' (assenti nell'originale, presenti in 34.014); stesse sei voci.")
out = RADICE / "brand/concept-svg/_rapporti/s7.json"
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(json.dumps(V, indent=1, ensure_ascii=False)); print(out, len(V), "voci")
