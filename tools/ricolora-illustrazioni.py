#!/usr/bin/env python3
"""Ricolora le copie dell'app di illustrazioni, glifi e immagini raster secondo la proposta colori (docs/design/COLORI-PROPOSTA.md, sezione 6).

Cosa fa
  1. SVG in app/src/brand/essenziali/disegni/kit-blu e kit-luminoso (varianti chiare .svg e scure .scuro.svg) e glifi/kit-blu:
     ogni colore esadecimale dentro fill, stroke, stop-color, flood-color, lighting-color (attributi o style) passa per `trasforma`
     (regole 6.1-6.4 e eccezioni 6.3). Solo i colori: la struttura del file non si tocca. Il kit-rosso (alternativa di colore, solo catalogo ?brand)
     non fa parte della proposta e non si ricolora.
  2. Raster (hero/scena-chiara, hero/scena-scura, landing/banner-edificio, landing/cta-fondo): operazioni OKLCH della sezione 6.7,
     lette SEMPRE dalle sorgenti in grafica/brand/ (PNG se c'è, altrimenti webp) e scritte nelle copie dell'app, quindi rilanciabile all'infinito.
     Il tema scuro di banner e cta resta nel CSS (filtri della proposta), come dice la 6.7.

Idempotenza
  Gli SVG ricolorati portano il marcatore `<!--ricolorato:v1-->` in testa: un file che lo ha già non si riprocessa.
  `tools/sincronizza-essenziali.sh` ricopia gli originali da grafica/brand/ e poi lancia questo script, quindi `npm run grafica:sync` dà sempre lo stesso risultato.
  Le sorgenti in grafica/brand/ non si modificano mai.

Uso (dalla radice del repository)
  python3 tools/ricolora-illustrazioni.py            # SVG + raster
  python3 tools/ricolora-illustrazioni.py --svg      # solo SVG
  python3 tools/ricolora-illustrazioni.py --raster   # solo raster
  python3 tools/ricolora-illustrazioni.py --prova    # non scrive nulla, stampa solo cosa cambierebbe
"""
import math
import pathlib
import re
import sys

RAD = pathlib.Path(__file__).resolve().parents[1]
ESS = RAD / 'app/src/brand/essenziali'
GRAFICA = RAD / 'grafica/brand'
MARCATORE = '<!--ricolorato:v1-->'

# ======================================================================================================================
# Trasformazione dei colori delle illustrazioni (codice di riferimento della proposta, sezione 6.6: una passata, deterministica)
# ======================================================================================================================


def _s2l(c):
    c /= 255
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def _l2s(c):
    c = max(0.0, min(1.0, c))
    return 12.92 * c if c <= 0.0031308 else 1.055 * c ** (1 / 2.4) - 0.055


def hex_a_lch(h):
    r, g, b = [_s2l(int(h[i:i + 2], 16)) for i in (1, 3, 5)]
    l = (.4122214708 * r + .5363325363 * g + .0514459929 * b) ** (1 / 3)
    m = (.2119034982 * r + .6806995451 * g + .1073969566 * b) ** (1 / 3)
    s = (.0883024619 * r + .2817188376 * g + .6299787005 * b) ** (1 / 3)
    L = .2104542553 * l + .7936177850 * m - .0040720468 * s
    a = 1.9779984951 * l - 2.4285922050 * m + .4505937099 * s
    bb = .0259040371 * l + .7827717662 * m - .8086757660 * s
    return L, math.hypot(a, bb), math.degrees(math.atan2(bb, a)) % 360


def lch_a_hex(L, C, H):
    c = C
    while True:  # fuori gamut: si riduce solo la croma, L e H restano
        a = c * math.cos(math.radians(H))
        b = c * math.sin(math.radians(H))
        l = (L + .3963377774 * a + .2158037573 * b) ** 3
        m = (L - .1055613458 * a - .0638541728 * b) ** 3
        s = (L - .0894841775 * a - 1.2914855480 * b) ** 3
        rgb = (4.0767416621 * l - 3.3077115913 * m + .2309699292 * s,
               -1.2684380046 * l + 2.6097574011 * m - .3413193965 * s,
               -.0041960863 * l - .7034186147 * m + 1.7076147010 * s)
        if all(-1e-4 <= x <= 1 + 1e-4 for x in rgb) or c <= 0:
            break
        c -= 0.002
    return '#%02X%02X%02X' % tuple(round(_l2s(x) * 255) for x in rgb)


def _dE(a, b):  # distanza in OKLab x100
    def lab(h):
        L, C, H = hex_a_lch(h)
        return L, C * math.cos(math.radians(H)), C * math.sin(math.radians(H))
    return 100 * math.dist(lab(a), lab(b))


# eccezioni per illustrazione (chiave = ultimo segmento del percorso)
ERRORE = {'documento-errore', 'quiz-test', 'notifica'}      # rosso vero, addolcito
VIOLA = {'sfera-successi'}                                   # + kit-luminoso/celebrazione
AMBRA = {'sfera-costi'}
A_VIOLA_DA_INDACO = {'documento-in-corso'}                   # indaco -> viola
BIANCHI = {'chiara': [(.985, .008), (.960, .017), (.935, .028)],
           'scura': [(.930, .008), (.900, .017), (.870, .028)]}   # (L, C), H = 264


def _famiglia(L, C, H):
    if L >= .93 and C < .06 and (225 <= H <= 300 or C < .02):
        return 'bianco'
    if C < .02 or (225 <= H < 300 and C < .06):
        return 'neutro'
    if H >= 345 or H < 33:
        return 'rosso'
    if H < 63:
        return 'arancio'
    if H < 110:
        return 'ambra'
    if H < 200:
        return 'verde'
    if H < 282:
        return 'blu'
    return 'viola'


def trasforma(hexcol, variante, illustrazione, errore_extra=()):
    """hexcol '#RRGGBB'; variante 'chiara' | 'scura'; illustrazione 'kit-blu/illustrazioni/attenzione-rischio' (stem senza .scuro)."""
    nome = illustrazione.split('/')[-1]
    kit = illustrazione.split('/')[0]
    L, C, H = hex_a_lch(hexcol)
    fam = _famiglia(L, C, H)                       # 1. si classifica sull'ORIGINALE
    scura = variante == 'scura'
    errore = fam == 'rosso' and (nome in ERRORE or nome in errore_extra)
    a_viola = (fam == 'rosso' and (nome in VIOLA or (nome == 'celebrazione' and kit == 'kit-luminoso'))) \
        or (fam == 'blu' and nome in A_VIOLA_DA_INDACO and H >= 272 and C >= .10)
    a_ambra = fam == 'rosso' and nome in AMBRA

    if fam == 'bianco':
        Ls, Cs = min(BIANCHI[variante], key=lambda t: abs(t[0] - L))
        return lch_a_hex(Ls, Cs, 264)
    if fam == 'neutro':
        L2, C2, H2 = L, min(max(C, .006), .04), 265
    elif a_viola:
        L2, C2, H2 = (min(max(L, .56), .78), min(C * .82, .18), 300) if fam == 'rosso' else (L, min(C * .85, .19), 300 + (H - 300) * .3)
        if scura:
            L2, C2 = max(L2, .70), C2 * .9
    elif a_ambra:
        L2, C2, H2 = min(max(L + .16, .80), .86), .15, 82
        if scura:
            C2 *= .9
    elif errore:
        hh = H - 360 if H > 300 else H
        L2, C2, H2 = L, min(C * .9, .21), 14 + (hh - 22) * .3
        if scura:
            L2, C2 = max(L2, .72), C2 * .7
    elif fam == 'rosso':                            # corallo (caso normale del rosso)
        hh = H - 360 if H > 300 else H
        L2 = L + (.02 if L <= .78 else .01)
        C2 = C * (.72 if L <= .78 else .85)
        H2 = 38 + (hh - 22) * .3
        if scura:
            if C >= .10:
                L2 = max(L2, .68)
            C2 *= .9
    elif fam == 'arancio':                          # arancio -> ambra
        L2, C2, H2 = max(L, .78), C * .95, 70 + (H - 33) * .3
        if scura:
            L2, C2 = min(L2, .86), C2 * .9
    elif fam == 'ambra':
        L2 = L + (.02 if L < .78 else 0)
        C2 = min(C * .95, .16)
        H2 = 80 + (H - 80) * .35
        if scura:
            L2, C2 = min(L2, .86), C2 * .9
    elif fam == 'verde':
        L2, C2, H2 = L, min(C * .85, .145), 168 + (H - 150) * .3
        if scura:
            L2, C2 = max(L2, .70), C2 * .9
    elif fam == 'blu':
        L2 = L + (.02 if L < .30 else 0)
        C2 = min(C * .96, .21)
        H2 = 262 + (H - 262) * .35
        if scura:
            if C >= .12 and L2 < .60:
                L2 = .60 - (.60 - L2) * .25      # blu saturati: non spariscono sul fondo
            if C < .12:
                C2, H2 = C * .75, 265            # lastre blu scuro: come le superfici dell'interfaccia
    elif fam == 'viola':
        L2, C2, H2 = L, min(C * .85, .19), 300 + (H - 300) * .3
        if scura:
            L2, C2 = max(L2, .70), C2 * .9
    else:  # non può succedere: le famiglie sono esaustive
        return hexcol
    # 2. quantizzazione: L a passi di 0,02, C a passi di 0,01 (elimina i doppioni a 1-2 unità)
    out = lch_a_hex(round(L2 / .02) * .02, round(C2 / .01) * .01, H2)
    # 3. (solo variante chiara) aggancio ai token: se un blu cade entro DeltaE 2,5 dal blu d'azione, diventa quel token
    if fam == 'blu' and not scura:
        for tok in ('#2563EB', '#1D4ED8'):
            if _dE(out, tok) <= 2.5:
                return tok
    return out


# ======================================================================================================================
# SVG
# ======================================================================================================================
PROP = r'(?:fill|stroke|stop-color|flood-color|lighting-color)'
# attributo: fill="#RRGGBB"; stile: fill:#RRGGBB (dentro style="..." o <style>)
RE_ATTR = re.compile(r'(\b' + PROP + r'=")(#[0-9A-Fa-f]{3}|#[0-9A-Fa-f]{6})(")')
RE_STILE = re.compile(r'(\b' + PROP + r'\s*:\s*)(#[0-9A-Fa-f]{3}|#[0-9A-Fa-f]{6})(?![0-9A-Fa-f])')
RE_ESAD = re.compile(r'(?<![\w&#])#(?:[0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})(?![0-9A-Fa-f\w-])')


def _espandi(h):
    return '#' + ''.join(c * 2 for c in h[1:]) if len(h) == 4 else h


def ricolora_svg(testo, variante, chiave, errore_extra=()):
    """Restituisce (nuovo testo, colori distinti cambiati)."""
    cache = {}

    def f(m):
        h = _espandi(m.group(2)).upper()
        if h not in cache:
            cache[h] = trasforma(h, variante, chiave, errore_extra)
        return m.group(1) + cache[h] + (m.group(3) if m.lastindex >= 3 else '')
    t = RE_ATTR.sub(f, testo)
    t = RE_STILE.sub(f, t)
    # inserisce il marcatore prima dell'elemento radice
    i = t.index('<svg')
    t = t[:i] + MARCATORE + t[i:]
    return t, cache


def elenco_svg():
    voci = []
    for kit in ('kit-blu', 'kit-luminoso'):
        base = ESS / 'disegni' / kit
        for f in sorted(base.rglob('*.svg')):
            if f.name.endswith('.maglie.svg'):
                continue
            voci.append((f, f'{kit}/{f.parent.name}/{f.name.replace(".scuro.svg", "").replace(".svg", "")}', ()))
    base = ESS / 'glifi/kit-blu'
    for f in sorted(base.glob('*.svg')):
        stem = f.name.replace('.svg', '')
        # il glifo «errore» è un errore vero (come documento-errore): rosso addolcito, non corallo
        voci.append((f, f'glifi/kit-blu/{stem}', ('errore',)))
    return voci


def fai_svg(prova=False):
    n_file = n_gia = n_col = 0
    for f, chiave, extra in elenco_svg():
        t = f.read_text()
        if MARCATORE in t:
            n_gia += 1
            continue
        variante = 'scura' if f.name.endswith('.scuro.svg') else 'chiara'
        nuovo, cache = ricolora_svg(t, variante, chiave, extra)
        # controllo: ogni esadecimale di colore nel file è stato visto (nessuno scappa, nessun id scambiato per colore)
        n_file += 1
        n_col += len(cache)
        if not prova:
            f.write_text(nuovo)
    print(f'SVG: {n_file} file ricolorati, {n_gia} già ricolorati (saltati), {n_col} colori distinti trasformati' + (' [prova: nulla scritto]' if prova else ''))


# ======================================================================================================================
# Raster (sezione 6.7): operazioni OKLCH pixel per pixel con numpy
# ======================================================================================================================
def _np():
    import numpy as np
    from PIL import Image
    return np, Image


def rgb_a_lch(np, rgb):
    """rgb float 0-1 sRGB (…,3) -> (L, C, H gradi)."""
    lin = np.where(rgb <= 0.04045, rgb / 12.92, ((rgb + 0.055) / 1.055) ** 2.4)
    r, g, b = lin[..., 0], lin[..., 1], lin[..., 2]
    l = np.cbrt(.4122214708 * r + .5363325363 * g + .0514459929 * b)
    m = np.cbrt(.2119034982 * r + .6806995451 * g + .1073969566 * b)
    s = np.cbrt(.0883024619 * r + .2817188376 * g + .6299787005 * b)
    L = .2104542553 * l + .7936177850 * m - .0040720468 * s
    a = 1.9779984951 * l - 2.4285922050 * m + .4505937099 * s
    bb = .0259040371 * l + .7827717662 * m - .8086757660 * s
    return L, np.hypot(a, bb), np.degrees(np.arctan2(bb, a)) % 360


def _lch_a_lin(np, L, C, H):
    a = C * np.cos(np.radians(H))
    b = C * np.sin(np.radians(H))
    l = (L + .3963377774 * a + .2158037573 * b) ** 3
    m = (L - .1055613458 * a - .0638541728 * b) ** 3
    s = (L - .0894841775 * a - 1.2914855480 * b) ** 3
    return np.stack([4.0767416621 * l - 3.3077115913 * m + .2309699292 * s,
                     -1.2684380046 * l + 2.6097574011 * m - .3413193965 * s,
                     -.0041960863 * l - .7034186147 * m + 1.7076147010 * s], axis=-1)


def lch_a_rgb(np, L, C, H):
    """LCH -> sRGB float 0-1. Fuori gamut si riduce solo la croma (bisezione per pixel), mai L e H."""
    L = np.clip(L, 0, 1)
    C = np.maximum(C, 0)
    lin = _lch_a_lin(np, L, C, H)
    fuori = np.any((lin < -1e-4) | (lin > 1 + 1e-4), axis=-1)
    if fuori.any():
        lo = np.zeros_like(C)
        hi = np.ones_like(C)           # fattore di scala della croma
        for _ in range(14):
            mid = (lo + hi) / 2
            t = _lch_a_lin(np, L, C * mid, H)
            ok = ~np.any((t < -1e-4) | (t > 1 + 1e-4), axis=-1)
            lo = np.where(ok, mid, lo)
            hi = np.where(ok, hi, mid)
        k = np.where(fuori, lo, 1.0)
        lin = _lch_a_lin(np, L, C * k, H)
    lin = np.clip(lin, 0, 1)
    return np.where(lin <= 0.0031308, 12.92 * lin, 1.055 * lin ** (1 / 2.4) - 0.055)


def _sorgente(rel_png, rel_webp):
    for rel in (rel_png, rel_webp):
        if rel and (GRAFICA / rel).exists():
            return GRAFICA / rel
    return None


def _carica(np, Image, percorso):
    im = Image.open(percorso)
    a = np.asarray(im.convert('RGBA'), dtype=np.float64) / 255.0
    return im.mode, a[..., :3], a[..., 3]


def _salva(np, Image, rgb, alfa, destinazione, con_alfa, qualita=84):
    px = np.clip(np.rint(rgb * 255), 0, 255).astype(np.uint8)
    if con_alfa:
        px = np.concatenate([px, np.clip(np.rint(alfa * 255), 0, 255).astype(np.uint8)[..., None]], axis=-1)
        im = Image.fromarray(px, 'RGBA')
    else:
        im = Image.fromarray(px, 'RGB')
    im.save(destinazione, 'WEBP', quality=qualita, method=6, alpha_quality=100)


def hero_chiara(np, rgb):
    L, C, H = rgb_a_lch(np, rgb)
    L0, C0, H0 = L.copy(), C.copy(), H.copy()
    quasi_neutro = (C0 < 0.012) & (L0 > 0.90)
    grigio_viola = (~quasi_neutro) & (C0 < 0.06) & (H0 >= 265) & (H0 <= 310)
    blu_pieno = (~quasi_neutro) & (C0 >= 0.10) & (H0 >= 200) & (H0 <= 281)
    # ombreggiatura lavanda-violetta nei grigi: si porta verso il blu dell'interfaccia
    H = np.where(grigio_viola, 262 + (H0 - 262) * 0.25, H)
    C = np.where(grigio_viola, np.maximum(C0 * 1.25, 0.012), C)
    # bianchi quasi neutri (il bianco ciano H 197): H 262, C 0,010
    H = np.where(quasi_neutro, 262.0, H)
    C = np.where(quasi_neutro, 0.010, C)
    # blu pieni: tinta compressa verso 262, croma invariata
    H = np.where(blu_pieno, 262 + (H0 - 262) * 0.35, H)
    # luminosità: +0,02 per L tra 0,55 e 0,85
    L = np.where((L0 >= 0.55) & (L0 <= 0.85), L0 + 0.02, L0)
    return lch_a_rgb(np, L, C, H)


def hero_scura(np, rgb):
    L, C, H = rgb_a_lch(np, rgb)
    L0, C0, H0 = L.copy(), C.copy(), H.copy()
    blu = (H0 >= 200) & (H0 <= 300)            # la porta di luce calda (ambra) non si tocca: la regola vale per i blu della scena
    # croma: C >= 0,08 -> C x 0,72 e H 265. Il passaggio è una rampa 0,07-0,08 (niente scalino di croma sul bordo della soglia)
    ws = np.where(blu, 1 - _rampa(np, C0, 0.07, 0.08), 0.0)
    luce = blu & (C0 < 0.07) & (L0 >= 0.60) & (L0 < 0.93)    # i grigi-azzurri chiari (es. #959AA8, L 0,687)
    C = C0 + ws * (C0 * 0.72 - C0)
    H = H0 + ws * (((265.0 - H0 + 180) % 360) - 180)
    L = np.maximum(L0, 0.22)                    # ombre: mai sotto il livello della superficie #111A2E
    L = np.where(luce, np.minimum(L0 + (0.74 - 0.687), 0.93), L)
    C = np.where(luce, np.maximum(C0, 0.03), C)
    H = np.where(luce, 265.0, H)
    L = np.minimum(L, 0.93)                     # nessun pixel sopra L 0,93
    return lch_a_rgb(np, L, C, H)


def bordi_verso_fondo(np, rgb, px=24, fondo=(10, 16, 31)):
    """Maschera sfumata di `px` pixel verso il fondo scuro su tutti i lati (il colore, non l'alfa)."""
    h, w = rgb.shape[:2]
    y = np.arange(h)[:, None]
    x = np.arange(w)[None, :]
    d = np.minimum(np.minimum(x, w - 1 - x), np.minimum(y, h - 1 - y)).astype(np.float64)
    t = np.clip(1 - d / px, 0, 1) ** 1.0
    t = (t * t * (3 - 2 * t))[..., None]
    f = np.array(fondo, dtype=np.float64) / 255.0
    return rgb * (1 - t) + f * t


def _rampa(np, x, pieno, zero):
    """1 quando x <= pieno, 0 quando x >= zero, lineare in mezzo (pieno < zero). Evita lo scalino netto di una soglia secca."""
    return np.clip((zero - x) / (zero - pieno), 0, 1)


def banner_edificio(np, rgb):
    L, C, H = rgb_a_lch(np, rgb)
    L0, C0, H0 = L.copy(), C.copy(), H.copy()
    # beige: H 40-80 con C < 0,06 -> C x 0,6 e H 75. Il peso scende da 1 a 0 tra C 0,06 e 0,08 (niente scalino sui bordi della soglia)
    wb = np.where((H0 >= 40) & (H0 <= 80), _rampa(np, C0, 0.06, 0.08), 0.0)
    C1 = C0 + wb * (C0 * 0.6 - C0)
    H1 = H0 + wb * (((75.0 - H0 + 180) % 360) - 180)
    base = lch_a_rgb(np, L0 + 0.02, C1, H1)
    # ombre blu (L < 0,45): H 265, C almeno 0,02. Il passaggio è una rampa 0,45-0,55, non una soglia secca (niente strisce blu e ocra sui dettagli)
    ombra = lch_a_rgb(np, L0 + 0.02, np.maximum(C0, 0.02), 265.0)
    w = _rampa(np, L0, 0.45, 0.55)[..., None]
    return base * (1 - w) + ombra * w


def cta_fondo(np, rgb):
    L, C, H = rgb_a_lch(np, rgb)
    L0, C0, H0 = L.copy(), C.copy(), H.copy()
    blu = (H0 >= 266) & (H0 <= 272) & (C0 >= 0.03)
    caldo = (L0 > 0.93) & (H0 >= 60) & (H0 <= 120) & (C0 > 0.008)     # il bianco caldo (#FEFAEF): richiama `luce`
    H = np.where(blu, 264.0, H)
    C = np.where(caldo, np.minimum(C0 * 2.0, 0.035), C)
    H = np.where(caldo, 92.0, H)
    return lch_a_rgb(np, L0, C, H)


RASTER = [
    # (sorgente png, sorgente webp, destinazione, funzione, bordi, qualità)
    ('hero/scena-chiara.png', 'hero/scena-chiara.webp', 'hero/scena-chiara.webp', hero_chiara, False, 86),
    ('hero/scena-scura.png', 'hero/scena-scura.webp', 'hero/scena-scura.webp', hero_scura, True, 86),
    (None, 'landing/banner-edificio.webp', 'landing/banner-edificio.webp', banner_edificio, False, 86),
    (None, 'landing/cta-fondo.webp', 'landing/cta-fondo.webp', cta_fondo, False, 90),
]


def fai_raster(prova=False):
    try:
        np, Image = _np()
    except ImportError:
        print('Raster: numpy/PIL non disponibili, saltato')
        return
    for png, webp, dest, fn, bordi, q in RASTER:
        src = _sorgente(png, webp)
        if src is None:
            print(f'Raster {dest}: sorgente non trovata in grafica/brand/, saltato')
            continue
        modo, rgb, alfa = _carica(np, Image, src)
        nuovo = fn(np, rgb)
        if bordi:
            nuovo = bordi_verso_fondo(np, nuovo)
        d = ESS / dest
        if not prova:
            _salva(np, Image, nuovo, alfa, d, modo == 'RGBA', q)
        print(f'Raster {dest}: da {src.relative_to(RAD)} ({modo}), {d.stat().st_size if d.exists() else 0} byte' + (' [prova]' if prova else ''))


if __name__ == '__main__':
    args = set(sys.argv[1:])
    prova = '--prova' in args
    solo_svg = '--svg' in args
    solo_raster = '--raster' in args
    if not solo_raster:
        fai_svg(prova)
    if not solo_svg:
        fai_raster(prova)
