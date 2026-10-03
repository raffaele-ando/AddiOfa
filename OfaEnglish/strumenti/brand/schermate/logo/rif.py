"""Piccoli attrezzi per leggere gli elementi originali del catalogo (id come '28.003') e campionarne i colori."""
import json, pathlib
import numpy as np
from PIL import Image

RADICE = pathlib.Path(__file__).resolve().parents[4]          # OfaEnglish/
_CAT = {i["id"]: i for i in json.load(open(RADICE / "brand/concept/catalogo.json"))}


def percorso(id_: str) -> pathlib.Path:
    return RADICE / _CAT[id_]["path"]


def carica(id_: str, fondo=(255, 255, 255)) -> np.ndarray:
    """RGB int (alto, largo, 3) dell'elemento composto su fondo bianco."""
    im = Image.open(percorso(id_)).convert("RGBA")
    bg = Image.new("RGBA", im.size, fondo + (255,)); bg.alpha_composite(im)
    return np.asarray(bg.convert("RGB")).astype(int)


def hexs(c) -> str:
    return "#%02X%02X%02X" % tuple(int(round(v)) for v in c)


def campiona(id_: str, fy: float, fx: float, r: int = 2) -> str:
    a = carica(id_); h, w = a.shape[:2]; y, x = int(h * fy), int(w * fx)
    return hexs(np.median(a[max(0, y - r):y + r + 1, max(0, x - r):x + r + 1].reshape(-1, 3), 0))


# ---------------------------------------------------------------- immagini intere di design-concept
_RAD_REPO = RADICE.parent


def sorgente(idx: int) -> np.ndarray:
    """RGB int dell'immagine intera idx (come in design-concept/)."""
    import glob
    d = glob.glob(str(RADICE / f"brand/concept/{idx:02d}-*/elementi.json"))[0]
    nome = json.load(open(d))["sorgente"]
    im = Image.open(_RAD_REPO / "design-concept" / nome).convert("RGB")
    return np.asarray(im).astype(int)


def ritaglia(idx: int, box, uscita) -> pathlib.Path:
    """Salva il ritaglio box=(x0,y0,x1,y1) dell'immagine intera; serve da riferimento per le tavole di controllo."""
    a = sorgente(idx)
    x0, y0, x1, y1 = [int(round(v)) for v in box]
    p = pathlib.Path(uscita); p.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(a[y0:y1, x0:x1].astype(np.uint8)).save(p)
    return p


def inchiostro(idx: int, box, pred):
    """Riquadro (x0,y0,x1,y1) dei pixel che soddisfano pred(r,g,b arrays) dentro box dell'immagine intera."""
    a = sorgente(idx); x0, y0, x1, y1 = [int(v) for v in box]
    sub = a[y0:y1, x0:x1]
    m = pred(sub[..., 0], sub[..., 1], sub[..., 2])
    ys, xs = np.where(m)
    if len(xs) == 0:
        return None
    return (x0 + xs.min(), y0 + ys.min(), x0 + xs.max() + 1, y0 + ys.max() + 1)


NAVY_P = lambda r, g, b: (r < 70) & (g < 80) & (b < 125)
BLU_P = lambda r, g, b: (b > 180) & (r < 110) & (g < 170)
BIANCO_P = lambda r, g, b: (r > 215) & (g > 215) & (b > 215)
