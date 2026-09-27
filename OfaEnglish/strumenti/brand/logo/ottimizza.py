"""
Rifinisce i parametri del logo confrontando in continuazione il render con la reference.

Fasi:
  1. forme: piastrella e contorno della porta adattati alle maschere misurate sulla reference
     (sovrapposizione IoU, rasterizzazione rapida in Python);
  2. luce e colori: ogni parametro viene mosso, il logo reso in Chromium e confrontato con la
     reference; si tiene il passo solo se lo scarto scende (strategia evolutiva 1+1 con passo
     adattivo per parametro). L'errore è misurato sull'immagine intera e, per non far vincere
     le zone grandi, anche per regione (muro, pavimento, porta, fondo).

Ogni fase salva `storia.json` (lo scarto passo per passo), `parametri.json` e i confronti in
`confronti/` (reference | SVG | differenza), così si vede come il logo converge.

    python3 ottimizza.py              # tutte le fasi
    python3 ottimizza.py luce 3000    # solo luce e colori, 3000 prove
"""
from __future__ import annotations

import copy
import json
import math
import pathlib
import random
import sys
import time

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as ndi

QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI.parent))
sys.path.insert(0, str(QUI))

from logo import LATO, PARAMETRI_INIZIALI, svg, carica  # noqa: E402
from render import Renderer, confronta  # noqa: E402

REFERENCE = QUI.parents[3] / "69B14B05-A388-40C2-A35E-FAA933D49A04.png"
CONFRONTI = QUI / "confronti"
RIDOTTO = 314  # lato del render durante l'ottimizzazione (1/4): veloce, abbastanza per luce e colori


def carica_reference():
    im = Image.open(REFERENCE).convert("RGB")
    a = np.asarray(im).astype(np.float64)
    R, G, B = a[..., 0], a[..., 1], a[..., 2]
    blu = (B - R) > 50
    piastrella = ndi.binary_fill_holes(ndi.binary_closing(blu, np.ones((15, 15))))
    porta = (~blu) & piastrella
    porta[866:] = False
    porta = ndi.binary_opening(porta, np.ones((5, 5)))
    lab, n = ndi.label(porta)
    porta = lab == (1 + int(np.argmax(ndi.sum(porta, lab, range(1, n + 1)))))
    return im, a, piastrella, porta


# ---------------------------------------------------------------- forme (fase 1)

def campiona_squircle(t, passi=24):
    x0, y0, x1, y1, r, k = t["x0"], t["y0"], t["x1"], t["y1"], t["raggio"], t["continuita"]
    c = r * (1 - k)

    def bez(p0, p1, p2, p3):
        return [((1 - u) ** 3 * p0[0] + 3 * (1 - u) ** 2 * u * p1[0] + 3 * (1 - u) * u * u * p2[0] + u ** 3 * p3[0],
                 (1 - u) ** 3 * p0[1] + 3 * (1 - u) ** 2 * u * p1[1] + 3 * (1 - u) * u * u * p2[1] + u ** 3 * p3[1])
                for u in np.linspace(0, 1, passi)]
    pts = []
    pts += bez((x1 - r, y0), (x1 - c, y0), (x1, y0 + c), (x1, y0 + r))
    pts += bez((x1, y1 - r), (x1, y1 - c), (x1 - c, y1), (x1 - r, y1))
    pts += bez((x0 + r, y1), (x0 + c, y1), (x0, y1 - c), (x0, y1 - r))
    pts += bez((x0, y0 + r), (x0, y0 + c), (x0 + c, y0), (x0 + r, y0))
    return pts


def campiona_porta(vertici, raggio, spigoli={4, 5}, passi=10):
    n = len(vertici)
    pts = []
    for i in range(n):
        p = vertici[i]
        if i in spigoli or raggio <= 0:
            pts.append(tuple(p)); continue
        a, b = vertici[i - 1], vertici[(i + 1) % n]
        la, lb = math.dist(p, a), math.dist(p, b)
        ra, rb = min(raggio, la / 2.2), min(raggio, lb / 2.2)
        e = (p[0] + (a[0] - p[0]) * ra / la, p[1] + (a[1] - p[1]) * ra / la)
        u = (p[0] + (b[0] - p[0]) * rb / lb, p[1] + (b[1] - p[1]) * rb / lb)
        for s in np.linspace(0, 1, passi):
            pts.append(((1 - s) ** 2 * e[0] + 2 * (1 - s) * s * p[0] + s * s * u[0],
                        (1 - s) ** 2 * e[1] + 2 * (1 - s) * s * p[1] + s * s * u[1]))
    return pts


def rasterizza(pts, sovra=2):
    img = Image.new("L", (LATO * sovra, LATO * sovra), 0)
    ImageDraw.Draw(img).polygon([(x * sovra, y * sovra) for x, y in pts], fill=255)
    return np.asarray(img.resize((LATO, LATO), Image.BILINEAR)) > 127


def iou(a, b):
    return (a & b).sum() / max(1, (a | b).sum())


def adatta(valori, errore, passi, iterazioni, seme=1):
    """(1+1)-ES con passo per coordinata: semplice e robusto per poche decine di numeri."""
    rng = random.Random(seme)
    x = list(valori); e = errore(x)
    passo = list(passi)
    for _ in range(iterazioni):
        i = rng.randrange(len(x))
        prova = list(x); prova[i] += rng.gauss(0, passo[i])
        ep = errore(prova)
        if ep < e:
            x, e = prova, ep; passo[i] *= 1.3
        else:
            passo[i] *= 0.93
    return x, e


def fase_forme(P, ref):
    _, _, m_piastrella, m_porta = ref
    t = P["piastrella"]
    chiavi = ["x0", "y0", "x1", "y1", "raggio", "continuita"]

    def err_t(v):
        tt = dict(zip(chiavi, v))
        return 1 - iou(rasterizza(campiona_squircle(tt)), m_piastrella)
    v, e = adatta([t[k] for k in chiavi], err_t, [2, 2, 2, 2, 8, 0.03], 500)
    P["piastrella"].update(dict(zip(chiavi, v)))
    print(f"piastrella: IoU {1 - e:.4f}", flush=True)

    porta = P["porta"]
    flat = [c for v in porta["vertici"] for c in v] + [porta["raggio"]]

    def err_p(v):
        vert = [v[i:i + 2] for i in range(0, 18, 2)]
        return 1 - iou(rasterizza(campiona_porta(vert, v[18])), m_porta)
    v, e = adatta(flat, err_p, [3] * 18 + [2], 1500)
    porta["vertici"] = [[round(v[i], 1), round(v[i + 1], 1)] for i in range(0, 18, 2)]
    porta["raggio"] = round(v[18], 1)
    print(f"porta: IoU {1 - e:.4f}", flush=True)
    return P


# ---------------------------------------------------------------- luce e colori (fase 2)

def parametri_liberi(P):
    """(percorso, passo iniziale) di ogni numero da rifinire; la geometria della porta resta ferma."""
    liberi = []

    def visita(nodo, percorso):
        if isinstance(nodo, dict):
            for k, v in nodo.items():
                if percorso == ("porta",) and k == "raggio":
                    continue
                if percorso == () and k in ("piastrella",):
                    continue
                visita(v, percorso + (k,))
        elif isinstance(nodo, list):
            if len(nodo) == 2 and isinstance(nodo[0], list) and isinstance(nodo[1], (int, float)):
                visita(nodo[0], percorso + (0,))
                liberi.append((percorso + (1,), 0.05))
            elif all(isinstance(c, (int, float)) for c in nodo):
                for i in range(len(nodo)):
                    colore = len(nodo) == 3 and percorso[-1] not in ("fuga",)
                    vertice = len(percorso) >= 2 and percorso[-2] in ("vertici", "fondo")
                    liberi.append((percorso + (i,), 10.0 if colore else 1.5 if vertice else 6.0))
            else:
                for i, c in enumerate(nodo):
                    visita(c, percorso + (i,))
        elif isinstance(nodo, (int, float)):
            nome = percorso[-1]
            if nome in ("opacita", "fine_opacita", "centro", "continuita", "ombra_sx", "ombra_dx", "schiaccia", "fine") \
                    or (len(percorso) >= 2 and percorso[-2] == "lati"):
                passo = 0.05
            elif nome == "profondita":
                passo = 0.02
            elif nome == "angolo":
                passo = 4.0
            elif nome in ("spessore", "smussatura", "morbidezza"):
                passo = 0.5
            else:
                passo = 10.0
            liberi.append((percorso, passo))
    visita(P, ())
    return liberi


def leggi(P, percorso):
    for k in percorso:
        P = P[k]
    return P


def scrivi(P, percorso, valore):
    for k in percorso[:-1]:
        P = P[k]
    ultimo = percorso[-1]
    nome = next((k for k in reversed(percorso) if isinstance(k, str)), "")
    if isinstance(P[ultimo], (int, float)) or isinstance(P, list):
        if isinstance(P, list) and len(P) == 2 and ultimo == 1 and isinstance(P[0], list):
            valore = min(1.0, max(0.0, valore))
        elif nome in ("opacita", "fine_opacita", "centro", "continuita", "profondita"):
            valore = min(1.0, max(0.0, valore))
        elif isinstance(P, list) and len(P) == 3 and nome not in ("fuga",):
            valore = min(255.0, max(0.0, valore))
        elif nome in ("sfocatura", "r", "rx", "ry", "spessore", "raggio", "morbidezza"):
            valore = max(0.1, valore)
    P[ultimo] = valore


class Giudice:
    """Rende e misura. Pesa le regioni perché conti anche la porta, che è piccola ma è il logo."""

    def __init__(self, r: Renderer, ref):
        self.r = r
        im, a, m_piastrella, m_porta = ref
        self.ref_ridotta = np.asarray(im.resize((RIDOTTO, RIDOTTO), Image.LANCZOS)).astype(np.float64)
        riduci = lambda m: np.asarray(Image.fromarray(m.astype(np.uint8) * 255).resize((RIDOTTO, RIDOTTO))) > 127
        p = riduci(m_piastrella); d = riduci(ndi.binary_dilation(m_porta, iterations=12))
        oz = int(866 * RIDOTTO / LATO)
        muro = p.copy(); muro[oz:] = False; muro &= ~d
        pav = p.copy(); pav[:oz] = False
        self.regioni = {"porta": d, "muro": muro, "pavimento": pav, "fondo": ~p}
        self.pesi = {"porta": 0.4, "muro": 0.2, "pavimento": 0.3, "fondo": 0.1}
        self.prove = 0

    def rendi(self, P, lato=RIDOTTO):
        s = svg(P).replace(f'width="{LATO}" height="{LATO}"', f'width="{lato}" height="{lato}"', 1)
        return np.asarray(self.r.svg(s, lato, lato, "white").convert("RGB")).astype(np.float64)

    def errore(self, P):
        self.prove += 1
        diff = np.abs(self.rendi(P) - self.ref_ridotta).mean(axis=2)
        return sum(self.pesi[k] * diff[m].mean() for k, m in self.regioni.items())


def salva_confronto(r: Renderer, P, nome):
    CONFRONTI.mkdir(exist_ok=True)
    ref = Image.open(REFERENCE).convert("RGB")
    im = r.svg(svg(P), LATO, LATO, "white").convert("RGB")
    a, b = np.asarray(ref).astype(np.float64), np.asarray(im).astype(np.float64)
    diff = np.clip(np.abs(a - b).mean(axis=2) * 3, 0, 255).astype(np.uint8)
    tavola = Image.new("RGB", (LATO * 3, LATO), "white")
    tavola.paste(ref, (0, 0)); tavola.paste(im, (LATO, 0)); tavola.paste(Image.fromarray(diff).convert("RGB"), (LATO * 2, 0))
    tavola.resize((LATO * 3 // 3, LATO // 3)).save(CONFRONTI / f"{nome}.png")
    return confronta(a, b)


def misura_facce(P, ref):
    """Colori di partenza di ogni parete: mediana della reference vicino al fondo e vicino al muro."""
    from logo import NOMI_FACCE, verso_fuga
    a = ref[1]
    porta = P["porta"]
    E = [tuple(v) for v in porta["vertici"]]
    I = [verso_fuga(p, porta["fuga"], porta["profondita"], porta.get("spostamento", [0, 0])) for p in E]
    for i, nome in enumerate(NOMI_FACCE):
        j = (i + 1) % len(E)
        def campiona(t):
            pts = []
            for u in np.linspace(0.25, 0.75, 9):
                pe = (E[i][0] + (E[j][0] - E[i][0]) * u, E[i][1] + (E[j][1] - E[i][1]) * u)
                pi = (I[i][0] + (I[j][0] - I[i][0]) * u, I[i][1] + (I[j][1] - I[i][1]) * u)
                x, y = pi[0] + (pe[0] - pi[0]) * t, pi[1] + (pe[1] - pi[1]) * t
                pts.append(a[int(round(y)), int(round(x))])
            return [round(float(c), 1) for c in np.median(np.array(pts), axis=0)]
        porta["facce"][nome] = [campiona(0.15), campiona(0.85)]
    return P


def fase_luce(P, r: Renderer, ref, iterazioni, storia):
    g = Giudice(r, ref)
    liberi = parametri_liberi(P)
    passi = {p: s for p, s in liberi}
    e = g.errore(P)
    rng = random.Random(7)
    inizio = time.time()
    for it in range(iterazioni):
        percorso = rng.choice(liberi)[0]
        prova = copy.deepcopy(P)
        vecchio = leggi(prova, percorso)
        scrivi(prova, percorso, vecchio + rng.gauss(0, passi[percorso]))
        ep = g.errore(prova)
        if ep < e:
            P, e = prova, ep
            passi[percorso] *= 1.4
        else:
            passi[percorso] = max(passi[percorso] * 0.9, 1e-3)
        if it % 100 == 0:
            storia.append({"fase": "luce", "prova": it, "errore_pesato": round(e, 3)})
            print(f"  prova {it:5d}  errore pesato {e:6.2f}/255  ({time.time() - inizio:.0f}s)", flush=True)
        if it % 1000 == 999:
            (QUI / "parametri.json").write_text(json.dumps(P, indent=1))
            m = salva_confronto(r, P, f"luce-{it + 1:05d}")
            storia.append({"fase": "luce", "prova": it + 1, "intero": m})
            (QUI / "storia.json").write_text(json.dumps(storia, indent=1))
    return P


def arrotonda_numeri(P):
    if isinstance(P, dict):
        return {k: arrotonda_numeri(v) for k, v in P.items()}
    if isinstance(P, list):
        return [arrotonda_numeri(v) for v in P]
    if isinstance(P, float):
        return round(P, 3)
    return P


def main():
    fasi = sys.argv[1:2] or ["tutto"]
    iterazioni = int(sys.argv[2]) if len(sys.argv) > 2 else 4000
    ref = carica_reference()
    P = carica()
    storia = json.loads((QUI / "storia.json").read_text()) if (QUI / "storia.json").exists() else []
    with Renderer() as r:
        if not storia:
            storia.append({"fase": "inizio", "intero": salva_confronto(r, P, "00-inizio")})
        if fasi[0] in ("tutto", "forme"):
            P = fase_forme(P, ref)
            storia.append({"fase": "forme", "intero": salva_confronto(r, P, "01-forme")})
        if fasi[0] in ("tutto", "luce"):
            if fasi[0] == "tutto" or "--misura" in sys.argv:
                P = misura_facce(P, ref)
            P = fase_luce(P, r, ref, iterazioni, storia)
        P = arrotonda_numeri(P)
        (QUI / "parametri.json").write_text(json.dumps(P, indent=1))
        finale = salva_confronto(r, P, "finale")
        storia.append({"fase": "finale", "intero": finale})
        (QUI / "storia.json").write_text(json.dumps(storia, indent=1))
        (QUI / "addiofa-logo.svg").write_text(svg(P))
        (QUI / "addiofa-logo-trasparente.svg").write_text(svg(P, sfondo=False))
        print("finale:", finale)


if __name__ == "__main__":
    main()
