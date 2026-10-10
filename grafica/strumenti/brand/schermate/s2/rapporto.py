"""Scrive brand/concept-svg/_rapporti/s2.json (si può rilanciare: legge solo le voci già pronte, SVG esistenti)."""
import json
import registro  # noqa
from comuni import RAPPORTO, RADICE, percorso_svg, SCHERMATE

def svg(ch):
    return str(percorso_svg(ch).relative_to(RADICE))

V = []
def v(elementi, ch, stato, nota):
    if ch is None or percorso_svg(ch).exists():
        V.append({"elementi": elementi, "stato": stato, **({"svg": svg(ch)} if ch else {}), "nota": nota})

N5 = {
 1: "Libri con bandiera = riuso kit-blu/illustrazioni/studio-inglese (bandiera con diagonali sfalsate corrette). Avanzamento a 3 segmenti uguali. Pulsanti con chevron a destra e testo a sinistra come nell'originale.",
 2: "Guida con spunta verde ridisegnata (foglio dietro + foglio davanti + tondo spunta), non presente nei kit. Testi leggibili.",
 3: "Riuso kit-blu/illustrazioni/quiz-test. Testi leggibili.",
 4: "Barra di avanzamento 3/10 e quattro risposte radio; 'went' selezionata in blu (kit blu dentro un funnel a pulsanti rossi, come l'originale).",
 5: "Misuratore = t.misuratore del kit al 32 % (l'originale ha il pomello come pallina piatta). Le 4 icone delle conseguenze (illeggibili nell'originale) sostituite con euro, lucchetto, documento, scudo: testo ricostruito solo come icone, le scritte sono quelle dell'originale.",
 6: "Sigillo/stemma non presente nella schermata. Scudo di 'dati al sicuro' ridisegnato. Testi leggibili.",
 7: "Illustrazione utenti con '+' ridisegnata. L'avanzamento nell'originale aveva un puntino rosso storto: corretto a 3 segmenti uguali.",
 8: "Avatar disegnati al posto delle foto (e nomi coerenti: 'Luca' ha un avatar maschile, nell'originale la foto era di una donna). Stepper verde 2 su 3.",
 9: "Marchi WhatsApp/Instagram/Messaggi semplificati (non loghi ufficiali). Icona copia disegnata.",
 10: "Regalo con fiocco ridisegnato (assonometria pulita, nastro unico continuo) e coriandoli puliti.",
 11: "Home 'Ciao, Raffaele' (la schermata e' tagliata in due pannelli 05.011/05.012 nel catalogo: ricomposta intera). Mano che saluta disegnata (emoji non ridisegnabile come glifo). Barra a 4 voci con icone chiare.",
 12: "Classifica: avatar disegnati, corone 1-2-3 ridisegnate, riga 'Tu' evidenziata. Voce 'Classifica' attiva con il trofeo (il glifo originale era illeggibile).",
 13: "Profilo con avatar neutro; icone delle voci sostituite (gruppo, barre, ingranaggio). Nav con trofeo attivo (glifo originale illeggibile).",
}
for i in range(1, 11):
    v([f"05.{i:03d}"], f"05-{i:02d}-" + [k for k in SCHERMATE if k.startswith(f"05-{i:02d}")][0][6:], "riuso" if i in (1, 3) else "svg", N5[i])
v(["05.011"], "05-11-home", "svg", N5[11])
v(["05.012"], "05-12-classifica", "svg", "Il pannello 05.012 contiene la parte destra della home (05.011) e la classifica: la classifica e' l'SVG 12; la home e' coperta anche da 05.011. " + N5[12])
v(["05.013"], "05-13-profilo", "svg", N5[13])
v(["22.001"], "22-01-sfide", "svg", "Schermata Sfide: sfida della settimana, tre sfide attive, podio settimanale. Avatar disegnati (foto nell'originale). Icone sfide ridisegnate. Nome del terzo del podio letto come 'marti.s'.")
v(["22.002"], "22-02-profilo", "svg", "Profilo: Project ID, statistiche, progressi, obiettivi, badge. L'originale ha 'Punteggio medio' con '+12%' doppio e storto: corretto. Avatar disegnato al posto della foto. Nota: s3 copre 22.002 per riuso di 06.008 (stessa schermata, versione più piccola); questo SVG è la versione disegnata dalla 22 a piena risoluzione, con la parte bassa (Badge) letta qui.")
import importlib, pathlib
for extra in ("rapporto_25", "rapporto_49"):
    try:
        importlib.import_module(extra).aggiungi(v)
    except ModuleNotFoundError:
        pass
RAPPORTO.parent.mkdir(parents=True, exist_ok=True)
RAPPORTO.write_text(json.dumps(V, indent=1, ensure_ascii=False))
print(RAPPORTO, len(V))
