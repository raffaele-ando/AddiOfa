"""
Varianti BLU dei disegni del kit rosso (illustrazioni e stati), per l'app, che ha il blu come colore d'azione.

Il kit rosso è disegnato in SVG pulito (forme con id, gradienti a fermate). Qui ogni colore con tinta rossa
(rosa pallido, corallo, rosso, bordeaux) viene ruotato verso il blu del kit in OKLCH, tenendo luminosità e
saturazione, così luci, ombre e riflessi restano quelli del disegno. Giallo, verde, grigi e blu restano.
Le parti dove il rosso ha un significato (distintivo dell'errore, pallino della notifica, triangolo di attenzione)
si tengono rosse: elenco `TIENI_ROSSO` per id di elemento o di gradiente.

    python3 strumenti/brand/blu_da_rosso.py          # scrive brand/disegni/kit-blu/<gruppo>/<nome>.svg
    python3 strumenti/brand/scuro_svg.py             # poi le varianti scure (.scuro.svg)

Non tocca il kit rosso né i disegni blu già esistenti: scrive solo i nomi dell'elenco `VOCI`, che non esistono nel kit blu.
"""
from __future__ import annotations

import pathlib
import re
import sys

import numpy as np

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI))
from ricolora import esa_rgb, oklch_rgb, rgb_oklch  # noqa: E402

DISEGNI = QUI.parents[1] / "brand" / "disegni"

# nome nel kit rosso (gruppo/nome) -> (gruppo di arrivo nel kit blu, nome di arrivo, id da tenere rossi)
# Solo i disegni che non hanno già un gemello nel kit blu (stessa composizione): le «ali» dell'euro, la scheda dei progressi,
# la lista del quiz sono composizioni diverse dalle blu e restano come varianti col nome che dice cosa sono.
VOCI: dict[str, tuple[str, str, tuple[str, ...]]] = {
    # illustrazioni
    "illustrazioni/attenzione-rischio": ("illustrazioni", "attenzione-rischio", ("*",)),            # triangolo di rischio: resta rosso
    "illustrazioni/piano-superamento": ("illustrazioni", "piano-superamento", ()),
    "illustrazioni/simulazione-esame": ("illustrazioni", "simulazione-esame", ()),
    "illustrazioni/rischio-economico": ("illustrazioni", "rischio-economico-ali", ()),
    "illustrazioni/progressi-statistiche": ("illustrazioni", "progressi-statistiche-scheda", ()),
    "illustrazioni/quiz-test": ("illustrazioni", "quiz-test-lista", ()),
    # stati
    "stati/attesa": ("stati", "attesa", ()),
    "stati/celebrazione": ("stati", "celebrazione-fiocco", ()),
    "stati/completato": ("stati", "documento-completato", ()),
    "stati/errore": ("stati", "documento-errore", ("badge", "badge-ombra", "badge-luce")),
    "stati/in-corso": ("stati", "documento-in-corso", ()),
    "stati/messaggi": ("stati", "messaggi", ()),
    "stati/mondo-internazionale": ("stati", "mondo-globo", ()),
    "stati/notifica": ("stati", "notifica", ("badge", "badge-ombra", "badge-luce")),
    "stati/obiettivo": ("stati", "obiettivo", ()),
    "stati/ricerca": ("stati", "ricerca-scintille", ()),
    "stati/vuoto": ("stati", "vuoto", ()),
    "stati/caricamento": ("stati", "caricamento", ()),
}

H_ROSSO = 22.0   # tinta (OKLCH) centrale della famiglia rossa del kit
H_BLU = 258.0    # tinta del blu d'azione #3B82F6 del kit blu (si centra sul rosso #EF4444)


def e_rosso(h: float, c: float) -> bool:
    return c > 0.006 and (h <= 50 or h >= 345)


def a_blu(hexa: str) -> str:
    rgb = esa_rgb(hexa)
    L, C, H = [float(v) for v in rgb_oklch(rgb)]
    if not e_rosso(H, C):
        return hexa
    dh = (H - H_ROSSO + 180) % 360 - 180
    out = oklch_rgb(np.array([L, C, (H_BLU + dh) % 360]))
    return "#%02X%02X%02X" % tuple(int(round(v)) for v in out)


def _colori(testo: str) -> str:
    return re.sub(r"#([0-9A-Fa-f]{6})\b", lambda m: a_blu("#" + m.group(1).upper()), testo)


def converti(svg: str, tieni: tuple[str, ...]) -> str:
    """Ruota i rossi in blu; `tieni` = id (di elementi, gruppi o gradienti) da lasciare com'erano; "*" = niente."""
    if "*" in tieni:
        return svg
    # i gradienti con un id da tenere restano intatti (le fermate non hanno id: il gradiente è l'unità)
    def gradiente(m):
        return m.group(0) if m.group(1) in tieni else _colori(m.group(0))
    parti = re.split(r"(<(?:linearGradient|radialGradient)\b[^>]*>.*?</(?:linearGradient|radialGradient)>)", svg, flags=re.S)
    out: list[str] = []
    for p in parti:
        if p.startswith(("<linearGradient", "<radialGradient")):
            ident = re.search(r'\bid="([^"]+)"', p).group(1)
            out.append(p if ident in tieni else _colori(p))
            continue
        # fuori dai gradienti: tag per tag, con una pila dei gruppi da tenere
        pila: list[bool] = []
        def tag(m):
            t = m.group(0)
            if t.startswith("</"):
                if pila and t.startswith("</g"):
                    pila.pop()
                return t
            ident = re.search(r'\bid="([^"]+)"', t)
            tieni_qui = (ident is not None and ident.group(1) in tieni) or any(pila)
            if t.startswith("<g") and not t.endswith("/>"):
                pila.append(ident is not None and ident.group(1) in tieni)
            return t if tieni_qui else _colori(t)
        out.append(re.sub(r"</?[a-zA-Z][^>]*>", tag, p))
    return "".join(out)


# ritocchi dopo la conversione: (cosa, con cosa). Nel «vuoto» la nuvola È il soggetto: si chiama `nuvola-triste` perché
# tools/togli-nuvole.mjs toglie ogni elemento con id «nuvola» (la nuvoletta di sfondo) e la farebbe sparire; e il suo azzurro
# è più deciso, per reggere sul fondo chiaro dell'app.
RITOCCHI: dict[str, list[tuple[str, str]]] = {
    "vuoto": [('id="nuvola"', 'id="nuvola-triste"'),
              ('stop-color="#EBF0FC"', 'stop-color="#DCE6FA"'), ('stop-color="#E0E7F8"', 'stop-color="#CBD9F4"'), ('stop-color="#D5DEF4"', 'stop-color="#BACBEE"')],
}


def main():
    from porta_in_disegni import adatta_tela
    from render import Renderer
    with Renderer() as r:
        _main(r, adatta_tela)


def _main(r, adatta_tela):
    n = 0
    for chiave, (gruppo, nome, tieni) in VOCI.items():
        src = DISEGNI / "kit-rosso" / f"{chiave}.svg"
        dest = DISEGNI / "kit-blu" / gruppo / f"{nome}.svg"
        testo = src.read_text()
        testo = re.sub(r"<title>[^<]*</title>", lambda m: m.group(0), testo)
        dest.parent.mkdir(parents=True, exist_ok=True)
        out = converti(testo, tieni)
        for a, b in RITOCCHI.get(nome, []):
            out = out.replace(a, b)
        dest.write_text(adatta_tela(r, out))   # allarga il viewBox se qualcosa esce dalla tela
        n += 1
        print("→", dest.relative_to(DISEGNI))
    print(n, "varianti blu")


if __name__ == "__main__":
    main()
