"""
Scrive brand/concept-svg/_rapporti/ill.json e brand/concept-svg/illustrazioni/COPERTURA.md.

    python3 strumenti/brand/schermate/ill/genera_rapporto.py

Copertura di tutta la "grafica" >= 90 px (lato maggiore) delle immagini 7, 8, 15, 28, 35, 40, 50 (+ 23, 27 = copie di 50).
Le illustrazioni sono mie (stato riuso/svg); logo, testi, campioni, componenti, schermate e foto sono di altri agenti: sono
nel rapporto con `altrui: true` e stato `scartato` solo perché ogni elemento ≥ 90 px risulti trattato (se un altro agente
li ha coperti con uno SVG, vale il suo).
"""
from __future__ import annotations

import json

from comune import BRAND, CATALOGO, RADICE

D = "brand/disegni/"
B, R, T = D + "kit-blu/illustrazioni/", D + "kit-rosso/illustrazioni/", D + "kit-rosso/stati/"
N = "brand/concept-svg/illustrazioni/"
LUC_NAVY, LUC_BLU = N + "kit-blu/piano-studi-bloccato-lucchetto-navy.svg", N + "kit-blu/piano-studi-bloccato-lucchetto-blu.svg"
CAPPELLO = N + "kit-blu/cappello-laurea-orologio.svg"
EMAIL_B, EMAIL_R = N + "kit-blu/email-istituzionale-sigillo.svg", N + "kit-rosso/email-istituzionale-sigillo.svg"
COMPOS = N + "kit-blu/composizione-misuratore-globo-calendario.svg"
F = N + "kit-blu/forme/"

# id -> (stato, svg, tipo-di-corrispondenza, nota)   tipo: uguale | variante | nuovo | -
IL = {
 "07.043": ("riuso", B + "studio-inglese.svg", "uguale", "libri blu e gialli con bandiera UK: stesso soggetto (proporzioni dei libri e bandiera appena diverse)"),
 "07.048": ("riuso", B + "risultato-probabilita.svg", "uguale", "misuratore 82 % con pallino: stesso soggetto"),
 "07.049": ("svg", LUC_NAVY, "nuovo", "calendario sbiadito con lucchetto BLU NOTTE (nel kit c'è solo quello con lucchetto rosso): variante sostanziale, ridisegnata"),
 "07.050": ("riuso", B + "progressi-statistiche.svg", "uguale", "quattro barre crescenti su nuvola: stesso soggetto"),
 "07.051": ("riuso", B + "mondo-internazionale.svg", "uguale", "globo con aeroplano e rotta: stesso soggetto (l'originale ha la rotta bianca sopra il globo, il kit l'orbita ellittica: variante di dettaglio)"),
 "07.052": ("riuso", B + "successo.svg", "uguale", "coppa gialla con stella: stesso soggetto"),
 "07.054": ("svg", F + "forme-onda-goccia.svg", "nuovo", "forme decorative del brand (onda + goccia piatta): non è un'illustrazione del kit, ridisegnata come forma"),
 "07.055": ("svg", F + "scintilla.svg", "nuovo", "scintilla a quattro punte del brand (simmetrica, l'originale è storta)"),
 "08.018": ("riuso", R + "piano-studi-bloccato.svg", "uguale", "calendario rosso con lucchetto: stesso soggetto"),
 "08.021": ("riuso", R + "studio-inglese.svg", "uguale", "libri rossi con bandiera UK: stesso soggetto (inquadratura più stretta)"),
 "08.024": ("riuso", R + "rischio-economico.svg", "uguale", "banconota con € e ali: stesso soggetto, girata un po' di più"),
 "08.025": ("riuso", R + "piano-superamento.svg", "uguale", "calendario con spunte: stesso soggetto (l'originale ha simboli confusi nelle caselle, il kit le spunte vere)"),
 "08.026": ("riuso", T.replace("stati/", "illustrazioni/") + "successo-superamento.svg", "uguale", "coppa gialla: stesso soggetto"),
 "08.032": ("riuso", R + "simulazione-esame.svg", "uguale", "cartellina con spunte e bandiera: stesso soggetto"),
 "08.033": ("riuso", R + "attenzione-rischio.svg", "uguale", "triangolo di attenzione con tacche: stesso soggetto"),
 "08.034": ("riuso", R + "progressi-statistiche.svg", "uguale", "barre rosse con pallino: stesso soggetto"),
 "08.036": ("svg", EMAIL_R, "nuovo", "busta lilla con sigillo (kit rosso, email istituzionale, senza aeroplanino): non esisteva SVG; SIGILLO = SEGNAPOSTO"),
 "08.038": ("riuso", R + "verifica-utente.svg", "uguale", "carta d'identità con profilo: stesso soggetto"),
 "08.039": ("riuso", R + "suggerimenti-consigli.svg", "uguale", "lampadina gialla: stesso soggetto"),
 "08.068": ("riuso", T + "vuoto.svg", "uguale", "nuvola triste: stesso soggetto"),
 "08.074": ("riuso", T + "mondo-internazionale.svg", "uguale", "globo blu scuro senza aeroplano: stesso soggetto"),
 "15.048": ("riuso", B + "studio-inglese.svg", "uguale", "libri con bandiera: stesso soggetto"),
 "15.053": ("riuso", B + "rischio-economico.svg", "uguale", "banconota con € inclinata: stesso soggetto"),
 "15.054": ("riuso", B + "piano-studi-bloccato.svg", "uguale", "calendario con lucchetto rosso: stesso soggetto"),
 "15.055": ("riuso", B + "superamento.svg", "uguale", "documento con spunta verde: stesso soggetto"),
 "15.056": ("riuso", B + "successo.svg", "uguale", "coppa: stesso soggetto"),
 "15.060": ("riuso", B + "mondo-internazionale.svg", "uguale", "globo con aeroplano: stesso soggetto"),
 "15.061": ("svg", CAPPELLO, "nuovo", "cappello di laurea con cronometro (senza studente né finestra): soggetto nuovo, diverso da accesso-bloccato"),
 "28.085": ("riuso", B + "studio-inglese.svg", "uguale", "libri con bandiera: stesso soggetto"),
 "28.087": ("riuso", B + "quiz-test.svg", "uguale", "foglio quiz A/B/C (il ritaglio include la didascalia «Quiz», che non è parte del disegno)"),
 "28.088": ("riuso", B + "risultato-probabilita.svg", "uguale", "misuratore 82 %: stesso soggetto"),
 "28.089": ("svg", LUC_BLU, "nuovo", "calendario con lucchetto BLU pieno (il buco della chiave è una freccia in su: corretto in chiave vera): variante sostanziale"),
 "28.090": ("riuso", B + "mondo-internazionale.svg", "uguale", "globo con aeroplano: stesso soggetto"),
 "28.091": ("riuso", B + "successo.svg", "uguale", "coppa: stesso soggetto"),
 "28.092": ("riuso", B + "suggerimenti-consigli.svg", "uguale", "lampadina: stesso soggetto"),
 "28.095": ("svg", F + "forme-scintilla.svg", "nuovo", "forme decorative + scintilla + bande chiare"),
 "28.097": ("svg", F + "scia-scintilla-onda.svg", "nuovo", "tratto con scintilla + onda sfumata"),
 "35.028": ("riuso", B + "risultato-probabilita.svg", "uguale", "misuratore 82 %: stesso soggetto"),
 "35.029": ("riuso", B + "rischio-economico.svg", "uguale", "banconota con €: stesso soggetto"),
 "35.057": ("riuso", B + "successo.svg", "uguale", "coppa: stesso soggetto"),
 "35.058": ("riuso", B + "superamento.svg", "uguale", "documento con spunta verde: stesso soggetto"),
 "35.059": ("riuso", B + "progressi-statistiche.svg", "uguale", "barre blu: stesso soggetto"),
 "35.060": ("riuso", B + "mondo-internazionale.svg", "uguale", "globo con aeroplano: stesso soggetto"),
 "35.092": ("svg", F + "piastra-punti.svg", "nuovo", "piastra sfumata con taglio d'angolo + griglia di punti (pattern)"),
 "40.026": ("svg", COMPOS, "variante", "composizione di tre illustrazioni del kit (misuratore, globo, calendario+lucchetto rosso) già esistenti, con due sagome pallide: composizione nuova di pezzi riusati"),
 "40.041": ("riuso", B + "quiz-test.svg", "uguale", "foglio quiz A/B/C: stesso soggetto"),
 "40.071": ("svg", F + "quadrato-stella-punti.svg", "nuovo", "quadrato arrotondato con stella a quattro punte + punti (pattern)"),
 "50.016": ("riuso", B + "studio-inglese.svg", "uguale", "libri con bandiera: stesso soggetto"),
 "50.019": ("riuso", B + "rischio-economico.svg", "uguale", "banconota con €: stesso soggetto (inquadratura leggermente diversa)"),
 "50.020": ("riuso", B + "piano-studi-bloccato.svg", "uguale", "calendario con lucchetto rosso: stesso soggetto"),
 "50.021": ("riuso", B + "superamento.svg", "uguale", "documenti con spunta verde: stesso soggetto"),
 "50.022": ("riuso", B + "successo.svg", "uguale", "coppa: stesso soggetto"),
 "50.023": ("riuso", B + "suggerimenti-consigli.svg", "uguale", "lampadina: stesso soggetto"),
 "50.028": ("svg", EMAIL_B, "nuovo", "busta con sigillo e aeroplanino rosso (kit blu, email istituzionale): non esisteva SVG; SIGILLO = SEGNAPOSTO"),
 "50.030": ("riuso", B + "mancato-superamento.svg", "uguale", "documento con X rossa: stesso soggetto"),
 "50.031": ("riuso", B + "progressi-statistiche.svg", "uguale", "barre blu: stesso soggetto"),
 "50.032": ("riuso", B + "mondo-internazionale.svg", "uguale", "globo con aeroplano: stesso soggetto"),
 "50.033": ("riuso", B + "messaggi-supporto.svg", "uguale", "due fumetti: stesso soggetto"),
 "50.035": ("riuso", B + "attesa-caricamento.svg", "uguale", "clessidra: stesso soggetto"),
 "50.036": ("riuso", B + "ricerca.svg", "uguale", "lente: stesso soggetto"),
 "50.037": ("riuso", B + "verifica-utente.svg", "uguale", "carta d'identità: stesso soggetto"),
 "50.039": ("riuso", B + "accesso-bloccato.svg", "variante", "studente col tocco e orologio: stesso soggetto, ma senza la finestra del browser (inquadratura più stretta); variante lieve non ridisegnata"),
 "50.040": ("riuso", B + "celebrazione.svg", "variante", "cono dei coriandoli: stesso soggetto, coriandoli blu/rossi/gialli diversi e cono più inclinato (variante lieve non ridisegnata)"),
}
SCARTI = {  # id -> (motivo, nota, altrui)
 "07.056": ("frammento", "tratto curvo decorativo tagliato da un pannello pattern (43x112)", False),
 "07.057": ("frammento", "tratto curvo con freccia, tagliato da un pannello pattern", False),
 "07.065": ("foto", "mockup fotografico (telefono, felpa, tote bag): non vettorializzabile", False),
 "08.017": ("frammento", "raggi tagliati (129x34), pezzo dell'illustrazione di attenzione/lampadina", False),
 "08.035": ("frammento", "raggi gialli tagliati (94x26), pezzo della lampadina", False),
 "15.003": ("foto", "foto/render con persona e stella: non vettorializzabile", False),
 "15.072": ("foto", "collage di foto", False),
 "28.125": ("icone tonde piccole (altro agente)", "tre icone in colonna", True),
 "35.027": ("frammento", "pezzo di foglio quiz tagliato (34x117)", False),
 "35.090": ("pannello/foto", "strip di quattro pannelli pattern (uno è una foto di cielo): non è un'illustrazione del kit", False),
 "40.018": ("foto", "strip di foto «elementi chiave»", False),
}
ALTRUI_PREF = {  # categorie dei non-illustrazione
 "logo": ["07.002", "07.003", "07.009", "15.001", "15.011", "15.012", "15.013", "28.003", "28.013", "28.024", "35.004", "35.005"],
 "schermata o pannello d'interfaccia": ["07.066", "07.067", "07.068", "15.002", "15.067", "15.068", "15.069", "15.070", "15.071", "28.113"],
 "componente UI": ["08.055", "08.057", "08.058", "08.062", "28.115", "28.117", "28.129", "28.145", "50.029", "50.059", "50.064", "50.067", "50.068", "50.069", "50.070",
                   "15.025", "15.026", "15.027", "15.033", "15.034", "15.046", "15.047", "15.074", "15.076", "28.136"],
 "campione di colore": ["07.027", "07.028", "07.029", "28.060", "28.062", "35.046", "35.049", "40.048", "40.051", "50.007", "50.010"],
}


def principale():
    cat = [e for e in CATALOGO.values() if e["img"] in (7, 8, 15, 28, 35, 40, 50) and e["tipo"] == "grafica" and max(e["w"], e["h"]) >= 90]
    voci, righe = [], {}
    altre = {}
    for e in sorted(cat, key=lambda e: e["id"]):
        i = e["id"]
        if i in IL:
            st, svg, tipo, nota = IL[i]
            v = {"elementi": [i], "stato": st, "svg": svg, "nota": nota}
            voci.append(v); righe[i] = (e, st, svg, tipo, nota)
        elif i in SCARTI:
            mot, nota, altrui = SCARTI[i]
            v = {"elementi": [i], "stato": "scartato", "nota": f"{mot}: {nota}"}
            if altrui: v["altrui"] = True
            voci.append(v); righe[i] = (e, "scartato", "", "-", f"{mot}: {nota}")
        else:
            cat_ = next((c for c, ids in ALTRUI_PREF.items() if i in ids), "testo o altro elemento non illustrativo")
            voci.append({"elementi": [i], "stato": "scartato", "altrui": True, "nota": f"non è un'illustrazione ({cat_}): di altri agenti"})
            altre.setdefault(cat_, []).append(i)
    # duplicati 23 e 27 di 50
    dup = []
    for e in sorted(cat, key=lambda e: e["id"]):
        if e["img"] != 50: continue
        s = e["id"].split(".")[1]
        for im in ("23", "27"):
            x = f"{im}.{s}"
            if x in CATALOGO:
                st = "scartato"; voci.append({"elementi": [x], "stato": st, "nota": f"duplicato di {e['id']}"}); dup.append(x)
    return voci, righe, altre, dup


def main():
    voci, righe, altre, dup = principale()
    (BRAND / "concept-svg" / "_rapporti").mkdir(parents=True, exist_ok=True)
    (BRAND / "concept-svg" / "_rapporti" / "ill.json").write_text(json.dumps(voci, ensure_ascii=False, indent=1))
    L = ["# Copertura delle illustrazioni grandi (grafica ≥ 90 px) — immagini 7, 8, 15, 28, 35, 40, 50", "",
         "Generato da `strumenti/brand/schermate/ill/genera_rapporto.py` (agente `ill`). Le copie 23 e 27 sono lo STESSO file di 50 "
         "(md5 identico, 70 ritagli identici): `23.NNN` e `27.NNN` = «duplicato di 50.NNN».", "",
         "Legenda corrispondenza: **uguale** = stesso soggetto di un SVG esistente in `brand/disegni/**` (stato `riuso`); **variante** = stesso soggetto ma "
         "altra inquadratura/dettaglio, non ridisegnata; **nuovo** = soggetto o variante sostanziale, ridisegnato in "
         "`brand/concept-svg/illustrazioni/` (stato `svg`), con tavola in `brand/concept-svg/_tavole/illustrazioni/`.", "",
         "## Illustrazioni", "", "| id | pixel | stato | corrispondenza | SVG | nota |", "|---|---|---|---|---|---|"]
    for i, (e, st, svg, tipo, nota) in righe.items():
        L.append(f"| {i} | {e['w']}x{e['h']} | {st} | {tipo} | `{svg.replace('brand/', '', 1) if svg else '—'}` | {nota} |")
    L += ["", "## Nuovi SVG (generatori in `strumenti/brand/schermate/ill/`)", "",
          "| SVG | copre | generatore |", "|---|---|---|",
          "| `kit-blu/piano-studi-bloccato-lucchetto-navy.svg` | 7.049 | gen_calendario_lucchetto.py |",
          "| `kit-blu/piano-studi-bloccato-lucchetto-blu.svg` | 28.089 | gen_calendario_lucchetto.py |",
          "| `kit-blu/cappello-laurea-orologio.svg` | 15.061 | gen_cappello_orologio.py |",
          "| `kit-blu/email-istituzionale-sigillo.svg` | 50.028 | gen_email_sigillo.py (sigillo = segnaposto) |",
          "| `kit-rosso/email-istituzionale-sigillo.svg` | 8.036 | gen_email_sigillo.py (sigillo = segnaposto) |",
          "| `kit-blu/composizione-misuratore-globo-calendario.svg` | 40.026 | gen_composizione_tre.py (riusa 3 illustrazioni) |",
          "| `kit-blu/forme/forme-onda-goccia.svg`, `forme-scintilla.svg`, `scia-scintilla-onda.svg`, `quadrato-stella-punti.svg`, `piastra-punti.svg`, `scintilla.svg` | 7.054, 28.095, 28.097, 40.071, 35.092, 7.055 | gen_forme.py |",
          "", "## Duplicati", "", "Copie di 50: " + ", ".join(dup), "",
          "## Grafica ≥ 90 px che NON è un'illustrazione (di altri agenti, nel rapporto con `altrui: true`)", ""]
    for c, ids in altre.items():
        L.append(f"- **{c}**: " + ", ".join(ids))
    L += ["", "## Nota", "L'illustrazione `email-istituzionale` (blu e rosso) è elencata nel catalogo dell'app ma non aveva un SVG in `brand/disegni` "
          "(contiene il sigillo): le versioni con segnaposto qui sopra sono le prime disegnate."]
    (BRAND / "concept-svg" / "illustrazioni" / "COPERTURA.md").write_text("\n".join(L) + "\n")
    from collections import Counter
    print(Counter(v["stato"] for v in voci), len(voci), "voci")


if __name__ == "__main__":
    main()
