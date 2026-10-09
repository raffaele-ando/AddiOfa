"""Scrive brand/concept-svg/_rapporti/p1.json dai file che esistono davvero. Rilanciabile in qualsiasi momento."""
import json
from extra import RADICE, LAYOUT

V = []
def voce(elementi, stato, svg, nota):
    p = RADICE / svg
    if svg and not p.exists():
        return
    V.append({"elementi": elementi, "stato": stato, "svg": svg, "nota": nota})

NOTA_LOC = ("Locandina 1024x1536 px tutta vettoriale (wordmark del kit con marchio stella, titoli Inter tracciati, tessere con icone, telefono col quiz, "
            "QR VERO decodificabile verso linktr.ee/addiofa al posto di quello finto dell'AI, strisce staccabili, svolazzi, frecce e scritte a mano rifatte in "
            "Inter corsivo maiuscolo). RASTER dichiarato: solo la fotografia dell'edificio del Politecnico (JPEG incorporato, ritagliato con strappo vettoriale; "
            "testi/stella/telefono sovrapposti dall'AI tolti con inpaint e rifatti in vettoriale). Testo del telefono ricostruito (stesso quiz in tutte le varianti, "
            "'Choose the correct form: She ___ to Milan every day.'). Sigillo del Politecnico: non presente. ")
voce(["04.001"], "raster", "brand/concept-svg/layout/04-locandina-supera-ofa/01-locandina-a.svg",
     NOTA_LOC + "Corretto: la 'O' del wordmark dell'originale era un'icona storta (Ø), qui il marchio stella 4 punte.")
voce(["38.001"], "raster", "brand/concept-svg/layout/38-locandina-b/01-locandina-b.svg",
     NOTA_LOC + "La stella blu sull'edificio è rifatta vettoriale (era nella foto).")
voce(["46.001"], "raster", "brand/concept-svg/layout/46-locandina-c/01-locandina-c.svg",
     NOTA_LOC + "Omessa la mano grigia che regge il telefono (anatomia AI, fotografia): il telefono è libero.")

NOTA_BAN = ("Banner di 301-317 px (tela in px x1,5), tutto vettoriale tranne le foto/render 3D dichiarati RASTER (JPEG incorporati): {raster}. "
            "Testi, pulsanti, wordmark, sfumature, bordi strappati, schede, icone, anello 82 %% e badge store vettoriali; testi sovrapposti dall'AI alle foto tolti con inpaint e rifatti. {extra}")
voce(["32.001"], "raster", "brand/concept-svg/layout/32-banner-verticali/01-banner-hero.svg",
     NOTA_BAN.format(raster="arco con stella e scalinata, skyline di Milano, parete 'SAME STUDENTS HIGHER HORIZONS'", extra="Tile del marchio dal kit (marchio-tile-scuro)."))
voce(["32.001"], "raster", "brand/concept-svg/layout/32-banner-verticali/02-banner-funzionalita.svg",
     NOTA_BAN.format(raster="studente alla scrivania con pannelli di vetro (testi QUIZ/SIMULAZIONI/PROGRESSI sono nella foto), rocce di ghiaccio", extra="Telefono col risultato 82 %, timeline, quattro schede di vetro con icone (bandiera UK con diagonali sfalsate) rifatti vettoriali; anello 82 % vettoriale (nell'originale mescolato alle rocce); 'Probabilità' corretto (originale 'Probablità'); pianta e blocco bianco dietro al telefono non riprodotti."))
voce(["32.001"], "raster", "brand/concept-svg/layout/32-banner-verticali/03-banner-storie.svg",
     NOTA_BAN.format(raster="arco con il Duomo, volto del video, arco con la stella di notte", extra="'Sarica su' corretto in 'Scarica su'; sigillo del Politecnico = segnaposto circolare (id sigillo-segnaposto); badge store semplificati (simboli stilizzati)."))

NOTA_CAR = ("Slide di carosello (vista = px originali x2), testi/badge/pulsanti/stelle/wordmark vettoriali; sfondo foto/render RASTER dichiarato dove presente; "
            "scritte a mano rifatte in Inter corsivo maiuscolo. ")
import json as _j
NOMI = {1: "01-intro-tuo-inglese-senza-ostacoli", 2: "02-cose-addiofa", 3: "03-perche-e-importante", 4: "04-come-funziona", 5: "05-il-tuo-risultato",
        6: "06-stessi-studenti-percorsi-luminosi", 7: "07-tre-consigli", 8: "08-conosci-la-struttura", 9: "09-esercitati-con-simulazioni",
        10: "10-studia-in-modo-costante", 11: "11-strumenti-utili", 12: "12-pronto-alla-prova", 13: "13-dalla-paura-al-superamento",
        14: "14-prima", 15: "15-durante", 16: "16-risultato", 17: "17-consigli", 18: "18-il-tuo-turno"}
FOTO = {1, 5, 6, 7, 12, 13, 14, 15, 16, 18}
EL = lambda i: "00.001" if i <= 6 else "00.002" if i <= 12 else "00.003"
for i, nm in NOMI.items():
    voce([EL(i)], "raster" if i in FOTO else "svg", f"brand/concept-svg/layout/00-social-carosello/{nm}.svg",
         NOTA_CAR + ("Contiene foto raster di sfondo. " if i in FOTO else "Interamente vettoriale. ") + ("Contatore '4/6' corretto (originale ripeteva '3/6'). " if i == 4 else "")
         + ("Mano col telefono lasciata nella foto raster (mockup); testi dello schermo non ricostruiti. " if i in (12, 15) else "")
         + ("Telefono vettoriale con schermata ricostruita (Quiz completato 82 %); testo della frase a mano corretto ('È'). " if i == 5 else "")
         + ("Calendario con cappello disegnato in vettoriale (semplificato rispetto al render). " if i == 10 else ""))

import importlib
for m in ("rapporto_altri",):
    try: importlib.import_module(m)
    except ModuleNotFoundError: pass

out = RADICE / "brand/concept-svg/_rapporti/p1.json"
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(json.dumps(V, indent=1, ensure_ascii=False))
print(out, len(V), "voci")
