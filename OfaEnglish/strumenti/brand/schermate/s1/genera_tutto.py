"""Rigenera le 14 schermate del funnel rosso, le tavole di controllo e il rapporto s1.json.
    python3 genera_tutto.py
"""
import json, pathlib, subprocess, sys
QUI = pathlib.Path(__file__).resolve().parent
for f in sorted(QUI.glob("s[0-9][0-9]_*.py")):
    subprocess.run([sys.executable, str(f)], check=True, stdout=subprocess.DEVNULL)
subprocess.run([sys.executable, str(QUI / "controlla.py")], check=True)

from componenti import NOMI, RADICE
note = {
 1: "Sigillo del Politecnico non riprodotto: segnaposto circolare `sigillo-segnaposto` + nome come testo. Libri con bandiera = riuso kit-rosso/illustrazioni/studio-inglese (bandiera con diagonali sfalsate corrette). Testi leggibili.",
 2: "Avanzamento a 5 segmenti uguali sull'asse della freccia. Testi leggibili (l'app dice 'dal tuo ateneo', l'immagine 'dal Polimi': tenuto l'immagine). Manca 'Avanti' come nell'originale.",
 3: "'l'OFA' in rosso. Tondo vuoto con spunta chiara pulito. Nell'originale non c'è 'Non lo so ancora' (presente nell'app): non aggiunto.",
 4: "Riuso kit-rosso/illustrazioni/quiz-test (nell'originale c'è un tondo con bandiera UK in più, assente nel disegno del kit). Testi leggibili.",
 5: "Barra di avanzamento rimessa sull'asse della freccia (nell'originale era sopra). Frase d'esempio e opzioni leggibili e identiche all'app.",
 6: "Sigillo sul timbro non riprodotto: disco neutro `sigillo-segnaposto`. Busta ridisegnata (stile stati/notifica). Tutti i testi letti a 3x: nessun testo ricostruito.",
 7: "Riuso rischio-economico + lucchetto disegnato; le 4 icone delle righe (illeggibili nell'originale) sostituite con euro, lucchetto, foglio, calendario. Testi leggibili.",
 8: "Misuratore = riuso kit-rosso/illustrazioni/risultato-probabilita (82%). Scheda con soldi alati = rischio-economico ridotto. Barra: 4 segmenti su 5.",
 9: "Chip d'icona tondi con glifi pieni (libro, barre, fulmine). Nessun pulsante, come l'originale.",
 10: "Prezzi leggibili e uguali a src/config/offer.ts (9,99 / 14,99 / 24,99 €). Terza scheda completata (nell'originale era tagliata dal ritaglio). Testo 'Massima sicurezza' e descrizioni leggibili.",
 11: "Testi leggibili; icone libro/lista/documento ridisegnate. Nessun prezzo nell'originale.",
 12: "Marchi PayPal/Apple/Google ridisegnati in forma semplice (non loghi ufficiali). Avanzamento 5/5 (nell'originale 3 segmenti e poi nulla).",
 13: "Riuso kit-rosso/stati/completato + coriandoli disegnati (capsule/croci pulite al posto degli 'ossi' storti). Testi leggibili.",
 14: "Riuso kit-rosso/stati/obiettivo. Testi leggibili.",
}
voci = []
for i in range(1, 15):
    svg = f"brand/concept-svg/schermate/funnel-rosso/{i:02d}-{NOMI[i]}.svg"
    voci.append({"elementi": [f"02.{i:03d}"], "stato": "riuso" if i in (4, 8, 13, 14) else "svg", "svg": svg, "nota": note[i]})
    voci.append({"elementi": [f"47.{i:03d}"], "stato": "scartato", "svg": svg,
                 "nota": f"duplicato di 02.{i:03d}: le immagini 02 e 47 sono lo STESSO file (stesso MD5, i 14 ritagli sono identici pixel per pixel); coperto dallo stesso SVG."})
out = RADICE / "brand/concept-svg/_rapporti/s1.json"
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(json.dumps(voci, indent=1, ensure_ascii=False))
print(out)
