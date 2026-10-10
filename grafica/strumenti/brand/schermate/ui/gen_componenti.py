"""
Componenti UI dei tre kit (blu piatto = immagine 17, rosso = 08, luminoso = 16; moduli/tag/card/chip = 28, 15, 35)
come SVG a sé + un foglio componenti per kit.

    python3 strumenti/brand/schermate/ui/gen_componenti.py

Uscita: brand/concept-svg/componenti/<kit>/<nome>.svg e componenti-<kit>.svg.

Cosa corregge dell'originale
- barre: nel kit rosso la barra continua aveva una toppa più scura a metà: un solo gradiente, valore vero;
- misuratore: l'arco pieno si fermava a metà (blu) e il pomello stava altrove: arco pieno fino al valore (82 %), pomello sulla punta;
- avanzamento: nel blu il passo corrente e quello fatto erano uguali e la linea 2→3 era a metà: stati veri (fatto / in corso con alone / futuro);
- badge «Errore» di 28 (scritta illeggibile) -> «Errore»; tipografia e palette: errori di scrittura dell'AI corretti in tipografia.svg;
- spaziature e larghezze dei campioni irregolari -> passo costante; testi in Inter (l'originale è un Nunito Sans).
"""
from __future__ import annotations

import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from extra import *  # noqa

USCITA = RADICE / "brand" / "concept-svg" / "componenti"
SCALA_28 = 1881 / 1536     # i moduli di 28 (1536 px) accanto a 17 (1881 px)

PALETTE_KIT = {
    "blu": [("Primario", "#0F172A"), ("Secondario", "#3B82F6"), ("Sfondo", "#F6F8FC"), ("Superfici", "#E5E7EB"),
            ("Testo secondario", "#64748B"), ("Accento/Rischio", "#EF4444"), ("Attenzione", "#F59E0B"), ("Successo", "#22C55E"),
            ("Quiz/Apprendimento", "#8B5CF6")],
    "luminoso": [("Primario", "#0F172A"), ("Secondario", "#3B82F6"), ("Sfondo", "#EDF2FF"), ("Superfici", "#F8FAFF"),
                 ("Testo secondario", "#64748B"), ("Accento/Rischio", "#FF6B6B"), ("Attenzione", "#F59E0B"), ("Successo", "#22C55E"),
                 ("Quiz/Apprendimento", "#8B5CF6")],
}
CHIP_PAROLE = [("Semplice", "verde"), ("Motivante", "verde"), ("Istituzionale", "blu"), ("Affidabile", "blu"),
               ("Orientato al risultato", "verde"), ("Moderno", "blu"), ("Student-friendly", "verde")]
CHIP_TONO = ["Chiaro", "Motivante", "Pratico", "Affidabile", "Giovanile", "Empatico", "Istituzionale", "Diretto"]
PASSI = ("Verifica", "Quiz", "Risultato", "Piani", "Pagamento", "Successo")
PASSI4 = ("Verifica", "Quiz", "Risultato", "Piani")


def salva(kit: str, nome: str, fn, **kw):
    p = USCITA / kit / f"{nome}.svg"
    componente_svg(p, fn, pad=kw.pop("pad", 18), id=nome, **kw)
    return p


def titolo(t, x, y, testo, larg_orig, id=None, peso=700):
    corpo = fit(testo, larg_orig, peso)
    t.testo(testo, x, y, corpo, peso, INK, id=id or "titolo-" + testo.lower().replace(" ", "-"))


# ------------------------------------------------------------------------------------------ componenti singoli
def componenti_kit(kit: str):
    K = KITS[kit]
    out = []
    for v in ("primario", "secondario", "outline"):
        out.append(salva(kit, f"pulsante-{v}", lambda t, x, y, v=v: pulsante(t, x, y, kit, v)))
    if kit == "blu":
        out.append(salva(kit, "pulsante-rischio", lambda t, x, y: pulsante(t, x, y, kit, "rischio")))
        out.append(salva(kit, "pulsante-primario-senza-freccia", lambda t, x, y: pulsante(t, x, y, kit, "primario", freccia_dx=False)))
    for a, nm in ((True, "acceso"), (False, "spento")):
        out.append(salva(kit, f"interruttore-{nm}", lambda t, x, y, a=a: interruttore(t, x, y, kit, a)))
    for a, nm in ((True, "spuntata"), (False, "vuota")):
        out.append(salva(kit, f"casella-{nm}", lambda t, x, y, a=a: casella(t, x, y, kit, a)))
    for a, nm in ((True, "selezionato"), (False, "vuoto")):
        out.append(salva(kit, f"radio-{nm}", lambda t, x, y, a=a: radio(t, x, y, kit, a)))
    out.append(salva(kit, "avanzamento-a-passi", lambda t, x, y: avanzamento(t, x, y, kit, PASSI, 1)))
    out.append(salva(kit, "avanzamento-a-passi-terzo", lambda t, x, y: avanzamento(t, x, y, kit, PASSI, 2)))
    if kit == "rosso":
        out.append(salva(kit, "barra-segmentata", lambda t, x, y: barra_segmentata(t, x, y)))
        out.append(salva(kit, "barra-progresso", lambda t, x, y: barra_continua(t, x, y)))
    if kit in ("blu", "luminoso"):
        for tp in STATI:
            out.append(salva(kit, f"stato-{tp}", lambda t, x, y, tp=tp: stato(t, x, y, tp, kit)))
        for b in BADGE:
            out.append(salva(kit, f"badge-{b}", lambda t, x, y, b=b: badge(t, x, y, b, kit)))
    out.append(salva(kit, "misuratore-82", lambda t, x, y: misuratore(t, x, y, kit, 0.82)))
    if kit == "blu":
        out += componenti_moduli()
    return out


def componenti_moduli():
    """Moduli, tag, card, chip (immagini 28, 15, 35): misure in px di 28 (1536); kit blu."""
    out = []
    k = "blu"
    out.append(salva(k, "campo-testo", lambda t, x, y: campo_testo(t, x, y, 153, 28, "Placeholder")))
    out.append(salva(k, "campo-ricerca", lambda t, x, y: campo_testo(t, x, y, 153, 28, "Cerca...", ricerca=True)))
    for a, nm, et in ((True, "selezionato", "Selezionato"), (False, "non-selezionato", "Non selezionato")):
        out.append(salva(k, f"radio-etichettato-{nm}", lambda t, x, y, a=a, et=et: selezione_etichettata(t, x, y, et, "radio", a)))
        out.append(salva(k, f"casella-etichettata-{nm}", lambda t, x, y, a=a, et=et: selezione_etichettata(t, x, y, et, "casella", a)))
    for tp in TAG_STATO:
        out.append(salva(k, f"tag-{tp}", lambda t, x, y, tp=tp: tag_stato(t, x, y, tp)))
    out.append(salva(k, "card-esempio-simulazione", lambda t, x, y: card_esempio(t, x, y)))
    for testo, tono in CHIP_PAROLE:
        out.append(salva(k, "chip-" + testo.lower().replace(" ", "-"), lambda t, x, y, testo=testo, tono=tono: chip(t, x, y, testo, tono)))
    for testo in CHIP_TONO:
        out.append(salva(k, "chip-tono-" + testo.lower(), lambda t, x, y, testo=testo: chip(t, x, y, testo, "bianco", h=24, corpo=10.5, px=14, id="chip-tono-" + testo.lower())))
    for testo in ("Quiz completati", "Simulazioni", "Piano di studio"):
        out.append(salva(k, "riga-completata-" + testo.lower().replace(" ", "-"), lambda t, x, y, testo=testo: riga_completata(t, x, y, testo)))
    return out


# ------------------------------------------------------------------------------------------ fogli componenti
def palette_riga(t, x, y, voci, passo=128, w=92, h=43, corpo=12.4):
    with t.gruppo("palette-colori"):
        for i, (nome, hx) in enumerate(voci):
            campione(t, x + i * passo, y, nome, hx, w=w, h=h, corpo_nome=corpo)


def foglio_blu_lum(kit: str):
    K = KITS[kit]
    moduli = kit == "blu"
    H = 840 if moduli else 470
    t = TelaCompatta(1881, H, fondo="#FDFEFE", id=f"componenti-{kit}")
    titolo(t, 36, 36, "Palette colori", 119, id="titolo-palette")
    palette_riga(t, 36, 56, PALETTE_KIT[kit])
    # --- elementi UI
    y0 = 190
    titolo(t, 36, y0, "Elementi UI", 117, id="titolo-elementi-ui")
    yc = y0 + 22
    with t.gruppo("pulsanti"):
        x = 36
        for v in ("primario", "secondario", "outline"):
            w, h = pulsante(t, x, yc, kit, v); x += w + 16
    with t.gruppo("interruttori"):
        interruttore(t, 524, yc + 9, kit, True); interruttore(t, 593, yc + 9, kit, False)
    with t.gruppo("caselle"):
        casella(t, 672, yc + 10, kit, True); casella(t, 718, yc + 10, kit, False)
    with t.gruppo("radio"):
        radio(t, 771, yc + 9, kit, True); radio(t, 828, yc + 9, kit, False)
    titolo(t, 909, y0, "Progress indicator", 151, id="titolo-avanzamento")
    avanzamento(t, 927, yc + 6, kit, PASSI, 1)
    # --- misuratore
    # --- stati e extra
    y1 = y0 + 125
    if kit in ("blu", "luminoso"):
        titolo(t, 36, y1, "Stati e feedback", 126, id="titolo-stati")
        with t.gruppo("stati"):
            for i, tp in enumerate(STATI):
                stato(t, 36 + i * 177, y1 + 15, tp, kit)
        titolo(t, 909, y1, "Elementi extra", 112, id="titolo-extra")
        with t.gruppo("badge"):
            x = 909
            for b in BADGE:
                w, h = badge(t, x, y1 + 18, b, kit); x += w + 12
    # misuratore a destra della palette
    misuratore(t, 1560, 8, kit, 0.82)
    if moduli:
        y2 = y1 + 140
        titolo(t, 36, y2, "Moduli e selezione", 150, id="titolo-moduli")
        sc = SCALA_28
        with t.gruppo("moduli", trasforma=f"translate(36 {n(y2 + 14)}) scale({n(sc)})"):
            pulsante(t, 0, 0, "blu", "primario", w=150, h=32, id="modulo-pulsante-primario")
            pulsante(t, 0, 43, "blu", "contorno", w=150, h=32, id="modulo-pulsante-secondario")
            pulsante(t, 0, 86, "blu", "rischio", w=150, h=32, id="modulo-pulsante-rischio")
            campo_testo(t, 180, 0, 153, 28, "Placeholder", id="modulo-campo-testo")
            selezione_etichettata(t, 182, 40, "Selezionato", "radio", True, id="modulo-radio-selezionato")
            selezione_etichettata(t, 182, 66, "Non selezionato", "radio", False, id="modulo-radio-vuoto")
            campo_testo(t, 180, 98, 153, 28, "Cerca...", ricerca=True, id="modulo-campo-ricerca")
            interruttore(t, 363, 8, "blu", True, id="modulo-interruttore-acceso", w=30, h=18)
            interruttore(t, 403, 8, "blu", False, id="modulo-interruttore-spento", w=30, h=18)
            selezione_etichettata(t, 363, 52, "Selezionato", "casella", True, id="modulo-casella-spuntata", lato=17)
            selezione_etichettata(t, 363, 80, "Non selezionato", "casella", False, id="modulo-casella-vuota", lato=17)
            xx = 530
            for j, tp in enumerate(TAG_STATO):
                tag_stato(t, xx + (j % 2) * 108, 12 + (j // 2) * 36, tp, id=f"modulo-tag-{tp}")
            card_esempio(t, 730, 4, id="modulo-card-esempio")
        # parole chiave (immagine 15)
        y3 = y2 + 190
        titolo(t, 36, y3, "Parole chiave", 110, id="titolo-parole-chiave")
        with t.gruppo("chip-parole-chiave"):
            xx, yy = 36, y3 + 16
            for testo, tono in CHIP_PAROLE:
                w = larghezza_testo(testo, 15.5, 500, -0.1) + 35
                if xx + w > 800:
                    xx, yy = 36, yy + 45
                chip(t, xx, yy, testo, tono, h=35, corpo=15.5, id="chip-" + testo.lower().replace(" ", "-"))
                xx += w + 12
        titolo(t, 909, y3, "Tono di voce", 130, id="titolo-tono-di-voce")
        with t.gruppo("chip-tono-di-voce"):
            for j, testo in enumerate(CHIP_TONO):
                chip(t, 909 + (j % 4) * 120, y3 + 18 + (j // 4) * 38, testo, "bianco", h=28, corpo=12.5, w=108, id="chip-tono-" + testo.lower())
        with t.gruppo("righe-completate", trasforma=f"translate(1500 {y3 + 10}) scale(1.4)"):
            for j, testo in enumerate(("Quiz completati", "Simulazioni", "Piano di studio")):
                riga_completata(t, 0, j * 32, testo, id="riga-completata-" + testo.lower().replace(" ", "-"))
    return t


def foglio_rosso():
    kit = "rosso"
    t = TelaCompatta(1536, 330, fondo="#FEFEFE", id="componenti-rosso")
    y0 = 36
    titolo(t, 28, y0, "Elementi UI", 122, id="titolo-elementi-ui")
    yc = y0 + 22
    with t.gruppo("pulsanti"):
        pulsante(t, 28, yc, kit, "primario"); pulsante(t, 218, yc, kit, "secondario"); pulsante(t, 402, yc, kit, "outline")
    with t.gruppo("interruttori"):
        interruttore(t, 560, yc + 14, kit, True); interruttore(t, 625, yc + 14, kit, False)
    with t.gruppo("caselle"):
        casella(t, 696, yc + 14, kit, True)
    with t.gruppo("caselle-vuote"):
        casella(t, 744, yc + 14, kit, False)
    with t.gruppo("radio"):
        radio(t, 800, yc + 14, kit, True); radio(t, 852, yc + 14, kit, False)
    with t.gruppo("barre"):
        barra_segmentata(t, 920, yc + 8)
        barra_continua(t, 920, yc + 40)
    y1 = yc + 110
    titolo(t, 28, y1, "Progress indicator", 160, id="titolo-avanzamento")
    avanzamento(t, 40, y1 + 20, kit, PASSI, 2)
    misuratore(t, 1200, y1 - 20, kit, 0.82)
    return t


def main():
    tutti = []
    for kit in ("blu", "rosso", "luminoso"):
        tutti += componenti_kit(kit)
    for kit, f in (("blu", lambda: foglio_blu_lum("blu")), ("luminoso", lambda: foglio_blu_lum("luminoso")), ("rosso", foglio_rosso)):
        t = f()
        tutti.append(t.salva(USCITA / kit / f"componenti-{kit}.svg"))
    print(len(tutti), "file in", USCITA)


if __name__ == "__main__":
    main()
