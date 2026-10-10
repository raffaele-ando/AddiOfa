"""
Rapporto dell'agente `ui`: brand/concept-svg/_rapporti/ui.json.

Gli elementi di tipo «pannello» delle immagini 07, 08, 15, 16, 17, 23, 27, 28, 35, 40, 50 sono pezzi tagliati dal
segmentatore (spesso a metà di un componente). Si assegna ogni elemento all'uscita che lo contiene guardando dove cade il
centro del suo riquadro nelle zone dell'immagine (REGIONI). Gli elementi che cadono fuori da ogni zona sono loghi, illustrazioni,
icone, foto o mockup: di altri agenti, non vanno nel rapporto.

    python3 strumenti/brand/schermate/ui/rapporto.py [--mostra-esclusi]
"""
from __future__ import annotations

import json
import pathlib
import sys

QUI = pathlib.Path(__file__).resolve().parent
RADICE = QUI.parents[3]
C = "brand/concept-svg/componenti"
T = "brand/concept-svg/token"
PAL, TIP = f"{T}/palette.svg", f"{T}/tipografia.svg"
BLU, ROS, LUM = f"{C}/blu", f"{C}/rosso", f"{C}/luminoso"

NOTA_TITOLO = "testo: titolo/etichetta di sezione; è riscritto nel foglio componenti (non è un componente a sé)"

# (x0, y0, x1, y1, stato, svg, nota)
REGIONI = {
    # ---------------------------------------------------------------- 50 (e 23, 27 identiche): kit blu con primario rosso, 1536 px
    "50": [
        (20,5,250,70,"scartato",None,"testo: titolo «Brand Kit» della tavola, non è un componente"),
        (15,125,250,160,"scartato",None,"testo: titolo di sezione delle illustrazioni, coperto dal layout dell'immagine (non è un componente)"),
        (590, 5, 1460, 118, "svg", PAL, "campioni di colore con nome/HEX; palette canonica del kit (Azzurro #60A5FA aggiunto da 28)"),
        (395, 170, 590, 280, "svg", f"{BLU}/misuratore-82.svg", "misuratore 82 %: arco pieno fino al valore e pomello sulla punta (nell'originale non coincidevano)"),
        (20, 600, 160, 632, "svg", f"{BLU}/componenti-blu.svg", NOTA_TITOLO),
        (725, 605, 870, 632, "svg", f"{BLU}/componenti-blu.svg", NOTA_TITOLO),
        (920, 508, 1070, 532, "svg", f"{BLU}/componenti-blu.svg", NOTA_TITOLO),
        (1180, 608, 1340, 634, "svg", f"{BLU}/componenti-blu.svg", NOTA_TITOLO),
        (930, 535, 1080, 600, "svg", f"{BLU}/stato-successo.svg", "card di stato: cerchio e simbolo veri, testo «Operazione completata»"),
        (1080, 535, 1225, 600, "svg", f"{BLU}/stato-errore.svg", "card di stato «Qualcosa è andato storto»"),
        (1225, 535, 1370, 600, "svg", f"{BLU}/stato-attenzione.svg", "card di stato «Attenzione leggi bene»"),
        (1370, 535, 1520, 600, "svg", f"{BLU}/stato-info.svg", "card di stato «Informazione importante»"),
        (150, 628, 290, 675, "svg", f"{BLU}/pulsante-secondario.svg", "pezzo del pulsante «Secondario» (il segmentatore lo aveva spezzato in quattro)"),
        (535, 628, 630, 675, "svg", f"{BLU}/casella-spuntata.svg", "pezzo della casella spuntata/vuota (casella-vuota.svg è l'altro stato)"),
    ],
    # ---------------------------------------------------------------- 17: kit blu piatto, 1881 px
    "17": [
        (20,5,300,75,"scartato",None,"testo: titolo «Brand Kit» della tavola, non è un componente"),
        (20,155,300,185,"scartato",None,"testo: titolo di sezione delle illustrazioni, coperto dal layout dell'immagine (non è un componente)"),
        (20,400,310,440,"scartato",None,"testo: titolo di sezione delle illustrazioni, coperto dal layout dell'immagine (non è un componente)"),
        (20,605,110,640,"scartato",None,"testo: titolo di sezione delle illustrazioni, coperto dal layout dell'immagine (non è un componente)"),
        (745, 5, 1881, 140, "svg", f"{BLU}/componenti-blu.svg", "campioni di colore del kit blu (nome/HEX come scritti nell'immagine: Testo secondario #64748B); palette canonica in token/palette.svg"),
        (20, 725, 700, 765, "svg", f"{BLU}/componenti-blu.svg", NOTA_TITOLO),
        (700, 725, 1450, 765, "svg", f"{BLU}/componenti-blu.svg", NOTA_TITOLO),
        (1150, 635, 1330, 725, "svg", f"{BLU}/stato-successo.svg", "card di stato «Operazione completata»"),
        (1330, 635, 1505, 725, "svg", f"{BLU}/stato-errore.svg", "card di stato «Qualcosa è andato storto»"),
        (1505, 635, 1680, 725, "svg", f"{BLU}/stato-attenzione.svg", "card di stato «Attenzione leggi bene»"),
        (1680, 635, 1860, 725, "svg", f"{BLU}/stato-info.svg", "card di stato «Informazione importante»"),
        (1440, 760, 1565, 825, "svg", f"{BLU}/badge-piu-scelto.svg", "badge «Più scelto»: freccia in su vera"),
        (1565, 760, 1730, 825, "svg", f"{BLU}/badge-massima-sicurezza.svg", "badge «Massima sicurezza»: scudo con spunta"),
        (1730, 760, 1860, 825, "svg", f"{BLU}/badge-consigliato.svg", "badge «Consigliato»: stella a cinque punte regolare"),
        (660, 770, 760, 810, "svg", f"{BLU}/casella-spuntata.svg", "casella spuntata e vuota (due file: casella-spuntata.svg, casella-vuota.svg)"),
    ],
    # ---------------------------------------------------------------- 16: kit luminoso, 1881 px
    "16": [
        (20,5,320,75,"scartato",None,"testo: titolo «Brand Kit» della tavola, non è un componente"),
        (20,70,320,110,"scartato",None,"testo: titolo di sezione delle illustrazioni, coperto dal layout dell'immagine (non è un componente)"),
        (20,400,320,440,"scartato",None,"testo: titolo di sezione delle illustrazioni, coperto dal layout dell'immagine (non è un componente)"),
        (745, 5, 1881, 140, "svg", f"{LUM}/componenti-luminoso.svg", "campioni di colore del kit luminoso (Sfondo #EDF2FF, Superfici #F8FAFF, Accento #FF6B6B come scritti); palette canonica in token/palette.svg"),
        (20, 735, 700, 770, "svg", f"{LUM}/componenti-luminoso.svg", NOTA_TITOLO),
        (1150, 640, 1325, 730, "svg", f"{LUM}/stato-successo.svg", "card di stato «Operazione completata» con cerchio lucido"),
        (1325, 640, 1505, 730, "svg", f"{LUM}/stato-errore.svg", "card di stato «Qualcosa è andato storto»"),
        (1505, 640, 1680, 730, "svg", f"{LUM}/stato-attenzione.svg", "card di stato «Attenzione leggi bene»"),
        (1680, 640, 1860, 730, "svg", f"{LUM}/stato-info.svg", "card di stato «Informazione importante»"),
        (1440, 765, 1565, 825, "svg", f"{LUM}/badge-piu-scelto.svg", "badge «Più scelto»"),
        (660, 775, 745, 815, "svg", f"{LUM}/casella-spuntata.svg", "casella spuntata e vuota (casella-spuntata.svg, casella-vuota.svg)"),
    ],
    # ---------------------------------------------------------------- 08: kit rosso, 1536 px
    "08": [
        (20,5,320,75,"scartato",None,"testo: titolo «Brand Kit» della tavola, non è un componente"),
        (20,130,400,170,"scartato",None,"testo: titolo di sezione delle illustrazioni, coperto dal layout dell'immagine (non è un componente)"),
        (20,365,300,400,"scartato",None,"testo: titolo di sezione delle illustrazioni, coperto dal layout dell'immagine (non è un componente)"),
        (20,580,120,615,"scartato",None,"testo: titolo di sezione delle illustrazioni, coperto dal layout dell'immagine (non è un componente)"),
        (440, 170, 700, 320, "svg", f"{ROS}/misuratore-82.svg", "misuratore 82 %: gradiente rosso, pomello sulla punta dell'arco pieno"),
        (20, 735, 1200, 765, "svg", f"{ROS}/componenti-rosso.svg", NOTA_TITOLO),
        (740, 765, 960, 805, "svg", f"{ROS}/barra-segmentata.svg", "barra a passi (4 segmenti: 2 pieni, 1 in corso, 1 vuoto); la barra continua sotto è barra-progresso.svg senza la toppa scura dell'originale"),
        (1120, 20, 1520, 105, "scartato", None, "frammento/callout: nota «stile ispirato a un marchio terzo» con icona di libro (icona di altri); non si riproduce il riferimento al marchio"),
    ],
    # ---------------------------------------------------------------- 15: concept «stella», 1536 px
    "15": [
        (20, 385, 770, 525, "svg", PAL, "campioni di colore con nome/HEX (ordine e passo regolarizzati)"),
        (770, 365, 1175, 530, "svg", TIP, "specimen tipografico: Inter, alfabeto (errori di scrittura corretti), scala H1/H2/Body/Caption"),
        (1180, 365, 1530, 530, "svg", f"{BLU}/componenti-blu.svg", "chip delle parole chiave (singoli: chip-*.svg)"),
        (20, 715, 840, 995, "scartato", None, "frammento: mini-schermata «Stile UI» (mockup di app, non un componente)"),
    ],
    # ---------------------------------------------------------------- 07: brand board, 1536 px
    "07": [
        (490, 300, 950, 475, "svg", PAL, "campioni di colore con nome/HEX"),
        (975, 285, 1240, 475, "svg", TIP, "specimen tipografico Inter + pesi"),
    ],
    # ---------------------------------------------------------------- 28: identity system, 1536 px
    "28": [
        (10, 245, 545, 495, "svg", PAL, "campioni di colore con nome/HEX: l'immagine più nitida (Primari, Neutri, Stato/Funzionali)"),
        (550, 245, 905, 495, "svg", TIP, "specimen tipografico Inter: alfabeto corretto (l'originale ha «LIMm»), pesi Light…Bold"),
        (10, 675, 200, 712, "svg", f"{BLU}/componenti-blu.svg", "etichetta «Button»: " + NOTA_TITOLO),
        (10, 712, 200, 750, "svg", f"{BLU}/pulsante-primario.svg", "pulsante primario (forma compatta del modulo, h 32); stesso componente del kit blu"),
        (10, 750, 200, 795, "svg", f"{BLU}/pulsante-secondario.svg", "pulsante «Secondario» con filo azzurro (variante «contorno» nel foglio)"),
        (10, 795, 200, 850, "svg", f"{BLU}/pulsante-rischio.svg", "pulsante «Rischio» rosso"),
        (193, 675, 375, 722, "svg", f"{BLU}/campo-testo.svg", "etichetta «Input / Selezione» (riscritta nel foglio componenti)"),
        (193, 722, 375, 748, "svg", f"{BLU}/campo-testo.svg", "campo di testo con placeholder"),
        (193, 748, 375, 792, "svg", f"{BLU}/radio-etichettato-selezionato.svg", "radio selezionato / non selezionato con etichetta (due file)"),
        (193, 792, 375, 850, "svg", f"{BLU}/campo-ricerca.svg", "campo di ricerca con lente e «Cerca…»"),
        (375, 675, 520, 770, "svg", f"{BLU}/interruttore-acceso.svg", "interruttore on/off"),
        (375, 770, 520, 850, "svg", f"{BLU}/casella-etichettata-selezionato.svg", "casella spuntata / vuota con etichetta"),
        (520, 675, 795, 850, "svg", f"{BLU}/avanzamento-a-passi.svg", "indicatore di avanzamento a passi (qui 4 passi; il file ha 6 passi, avanzamento() accetta qualunque numero)"),
        (795, 675, 945, 850, "svg", f"{BLU}/tag-completato.svg", "badge/tag di stato (Completato, Errore, Attenzione, Info); la scritta illeggibile di «Errore» è ricostruita"),
        (945, 675, 1240, 850, "svg", f"{BLU}/card-esempio-simulazione.svg", "card esempio «Simulazione · 10 domande • 3 minuti» con chevron"),
        (20, 250, 1340, 275, "svg", f"{BLU}/componenti-blu.svg", NOTA_TITOLO),
    ],
    # ---------------------------------------------------------------- 35: identity b, 1536 px
    "35": [
        (10, 320, 550, 480, "svg", PAL, "campioni di colore (colori principali e neutri)"),
        (10, 480, 550, 615, "svg", PAL, "campioni di colore (colori di stato)"),
        (555, 320, 985, 615, "svg", TIP, "specimen tipografico + gerarchia testi (alfabeto corretto: nell'originale le lettere sono fuse e illeggibili)"),
        (1185, 835, 1525, 870, "svg", f"{BLU}/componenti-blu.svg", "titolo «Tono di voce» dei chip (singoli: chip-tono-*.svg)"),
    ],
    # ---------------------------------------------------------------- 40: art direction, 1536 px
    "40": [
        (20, 540, 550, 725, "svg", PAL, "campioni di colore con nome/HEX (ordine di 40: 6 + 4)"),
        (555, 535, 855, 705, "svg", TIP, "specimen tipografico «Inter / AaBbCcDdEe / 0123456789» + pesi"),
    ],
}
REGIONI["23"] = REGIONI["27"] = REGIONI["50"]


def principale():
    cat = json.load(open(RADICE / "brand/concept/catalogo.json"))
    out, esclusi = [], []
    for img, regioni in REGIONI.items():
        import glob
        d = json.load(open(glob.glob(str(RADICE / f"brand/concept/{img}-*/elementi.json"))[0]))
        dup = img in ("23", "27")
        for e in d["lista"]:
            if e["tipo"] != "pannello":
                continue
            x0, y0, x1, y1 = e["riquadro"]
            cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
            idx = f"{img}.{e['n']:03d}"
            trovato = None
            for (a, b, c, dd, stato, svg, nota) in regioni:
                if a <= cx <= c and b <= cy <= dd:
                    trovato = (stato, svg, nota)
                    break
            if not trovato:
                esclusi.append((idx, e["riquadro"]))
                continue
            stato, svg, nota = trovato
            if dup:
                out.append({"elementi": [idx], "stato": "scartato", "nota": f"duplicato di 50.{e['n']:03d} (immagine identica a 50, scarto 0)"})
            else:
                v = {"elementi": [idx], "stato": stato, "nota": nota}
                if svg:
                    v["svg"] = svg
                out.append(v)
    # raggruppa le voci con lo stesso (stato, svg, nota)
    gruppi: dict = {}
    for v in out:
        k = (v["stato"], v.get("svg"), v["nota"])
        gruppi.setdefault(k, []).extend(v["elementi"])
    voci = []
    for (stato, svg, nota), els in gruppi.items():
        v = {"elementi": sorted(els), "stato": stato}
        if svg:
            v["svg"] = svg
        v["nota"] = nota
        voci.append(v)
    return voci, esclusi


def main():
    voci, esclusi = principale()
    dest = RADICE / "brand/concept-svg/_rapporti/ui.json"
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(json.dumps(voci, ensure_ascii=False, indent=1))
    n_el = sum(len(v["elementi"]) for v in voci)
    print(len(voci), "voci,", n_el, "elementi;", len(esclusi), "fuori zona (di altri agenti)")
    if "--mostra-esclusi" in sys.argv:
        for e in esclusi:
            print(e)


if __name__ == "__main__":
    main()
