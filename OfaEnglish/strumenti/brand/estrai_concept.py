"""
Estrazione automatica degli elementi dalle immagini di design concept (cartella design-concept/
nella radice del repository): schermate, card, icone, illustrazioni, loghi, foto, pannelli.

A differenza di estrai.py (che per i fogli del Brand Kit usava bande scritte a mano in
sorgenti.json), qui le immagini sono 52 e di tipi diversi, quindi la scomposizione è automatica:

1. Fondo: il colore più frequente nella cornice dell'immagine (bianco, azzurro chiaro, scuro…).
2. "Inchiostro": i pixel che si distinguono dal fondo di più di `SOGLIA` (dopo un'apertura che
   toglie i granelli): ombre leggere e sfumature del fondo non contano.
3. Taglio ricorsivo (XY-cut): in ogni pezzo si cercano righe o colonne senza inchiostro larghe
   almeno `gap(pezzo)` e si taglia lì, alternando orizzontale e verticale. Il vuoto minimo cresce
   con la dimensione del pezzo (un pannello grande si taglia solo su vuoti grandi), così una
   schermata intera non viene sbriciolata nelle sue sezioni. Si scende finché non ci sono più tagli.
4. Ogni foglia è un elemento: ritaglio a risoluzione originale. Se il bordo del ritaglio è del
   colore del fondo, il pezzo si stacca dal fondo (`stacca.py`, formula di Agorà) e diventa un PNG
   con trasparenza che, ricomposto sul fondo, ridà il ritaglio (si misura lo scarto); altrimenti
   (foto, pannelli scuri) resta il ritaglio rettangolare.
5. Classificazione per ogni elemento: schermata, foto, icona/logo/illustrazione, pannello, testo.
   I pezzi di solo testo (righe di parole) non si salvano: si contano.

    python3 strumenti/brand/estrai_concept.py                  # tutte le immagini
    python3 strumenti/brand/estrai_concept.py 08 24            # solo alcune (indice nel nome)

Esce in brand/concept/<NN>-<nome>/: PNG degli elementi, anteprima.png (riquadri numerati) e
elementi.json; in brand/concept/concept.json l'indice generale. Vedi sapere/08-concept.md.
"""
from __future__ import annotations

import json
import pathlib
import sys

import cv2
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as ndi

from stacca import stacca, ritaglia_stretto, verifica_ricomposizione

QUI = pathlib.Path(__file__).resolve().parent
RADICE = QUI.parents[2]
SORGENTI = RADICE / "design-concept"
USCITA = QUI.parents[1] / "brand" / "concept"

SOGLIA = 11.0        # distanza di colore dal fondo oltre cui un pixel è "inchiostro"
MIN_LATO = 18        # un elemento più piccolo di così (in un lato) è un frammento: si scarta
FRAZIONE_GAP = 0.035  # il vuoto minimo è questa frazione del lato minore del pezzo
GAP_MIN = 4
GLIFO_MAX = 28       # sotto questa misura un pezzo rado (freccia, trattino) non conta per i tagli
# Immagini senza schermate di telefono, dove una colonna alta e stretta (icona + scritta, ripetuta)
# sembrerebbe una schermata: lì la regola "schermata = elemento unico" è spenta. È un'indicazione mia.
SENZA_SCHERMATE = {44}
SCHERMATE_ATTIVE = True
GAP_MAX = 7          # nemmeno un pannello enorme richiede un vuoto più largo di così per essere diviso

# Descrizione di ogni immagine (indice = ordine alfabetico del nome file): serve solo a dare un
# nome leggibile alla cartella di uscita. È una descrizione mia, guardando le immagini.
NOMI = {
    0: "social-carosello", 1: "home-rischio-tre-stati", 2: "schermate-onboarding-piani", 3: "home-rischio-singola",
    4: "locandina-supera-ofa", 5: "schermate-onboarding-invito", 6: "schermate-sfide-progressi", 7: "brand-board-logo-palette",
    8: "brand-kit-illustrazioni", 9: "schermate-calcolo-risultato", 10: "schermate-risultato-dettaglio", 11: "home-rischio-tre-stati-b",
    12: "landing-mobile", 13: "mappa-schermate-atlas-noi-agora", 14: "home-rischio-alto", 15: "brand-concept-logo-stella",
    16: "brand-kit-b", 17: "brand-kit-c", 18: "schermate-profilo-statistiche", 19: "schermate-profilo-statistiche-b",
    20: "schermate-risultato-sei", 21: "home-dettaglio-rischio", 22: "schermate-sfide-profilo", 23: "brand-kit-d",
    24: "icona-app-stella", 25: "flusso-rischio", 26: "social-media-identity", 27: "brand-kit-e",
    28: "brand-identity-system", 29: "schermate-risultato-sei-b", 30: "flusso-schermate-a", 31: "flusso-schermate-b",
    32: "banner-verticali", 33: "home-rischio-b", 34: "flusso-schermate-c", 35: "brand-identity-b",
    36: "flusso-schermate-d", 37: "profilo-instagram", 38: "locandina-b", 39: "home-fattori",
    40: "art-direction", 41: "landing-desktop", 42: "schermate-risultato-animazioni", 43: "schermate-risultato-sette",
    44: "icone-sfera", 45: "landing-desktop-b", 46: "locandina-c", 47: "schermate-onboarding-c",
    48: "social-copertine-video", 49: "schermate-esplora-atlas-noi-agora", 50: "brand-kit-f", 51: "landing-desktop-c",
}


def fondo_immagine(rgb: np.ndarray) -> np.ndarray:
    """Colore più frequente nella cornice di 6 px (quantizzato a 4 bit, poi mediana del gruppo)."""
    c = np.concatenate([rgb[:6].reshape(-1, 3), rgb[-6:].reshape(-1, 3), rgb[:, :6].reshape(-1, 3), rgb[:, -6:].reshape(-1, 3)])
    q = (c // 16).astype(int)
    chiavi = q[:, 0] * 256 + q[:, 1] * 16 + q[:, 2]
    piu = np.bincount(chiavi).argmax()
    return np.median(c[chiavi == piu], axis=0)


def maschera_inchiostro(rgb: np.ndarray, fondo: np.ndarray) -> np.ndarray:
    d = np.linalg.norm(rgb - fondo, axis=2) > SOGLIA
    return ndi.binary_opening(d, np.ones((2, 2)))


def scala_maschere(rgb: np.ndarray, fondo: np.ndarray) -> tuple[np.ndarray, list]:
    d = np.linalg.norm(rgb - fondo, axis=2)
    def pulita(m):
        return ndi.binary_opening(m, np.ones((2, 2)))
    base = pulita(d > SOGLIA)
    scala = [senza_glifi(base)]
    for t in (SOGLIA - 3, SOGLIA + 3, SOGLIA + 6):
        scala.append(senza_glifi(pulita(d > t)))
    # solo le zone piene: toglie testo, linee e frecce di collegamento, lascia schede e schermate
    for t in (SOGLIA, SOGLIA + 3):
        scala.append(ndi.binary_opening(d > t, np.ones((9, 9))))
    return base, scala


def senza_glifi(mask: np.ndarray) -> np.ndarray:
    """La maschera per cercare i tagli: tolti i piccoli pezzi radi (frecce, trattini, virgole) che
    nei flussi collegano una schermata all'altra e impedirebbero di separarle."""
    lab, n = ndi.label(ndi.binary_dilation(mask, np.ones((3, 3))))
    if n == 0:
        return mask
    oggetti = ndi.find_objects(lab)
    riempimento = ndi.sum(mask, lab, range(1, n + 1))
    out = mask.copy()
    for k, sl in enumerate(oggetti, start=1):
        h, w = sl[0].stop - sl[0].start, sl[1].stop - sl[1].start
        if max(w, h) <= GLIFO_MAX and riempimento[k - 1] / (w * h) < 0.6:
            out[sl][lab[sl] == k] = False
    return out


def vuoti(proiezione: np.ndarray, gap: int) -> list[tuple[int, int]]:
    """Intervalli [a, b) interni senza inchiostro lunghi almeno `gap` (non ai bordi)."""
    pieno = proiezione > 0
    out, i, n = [], 0, len(pieno)
    while i < n:
        if not pieno[i]:
            j = i
            while j < n and not pieno[j]:
                j += 1
            if i > 0 and j < n and j - i >= gap:
                out.append((i, j))
            i = j
        else:
            i += 1
    return out


def stringi(mask: np.ndarray, x0: int, y0: int) -> tuple[int, int, int, int] | None:
    ys, xs = np.nonzero(mask)
    if len(xs) == 0:
        return None
    return x0 + xs.min(), y0 + ys.min(), x0 + xs.max() + 1, y0 + ys.max() + 1


def e_schermata(w: int, h: int, largo: bool = False) -> bool:
    """Telefono in piedi. Con `largo` si accettano anche proporzioni più strette (0,25–0,4): possono
    essere uno schermo stretto oppure due schermate una sopra l'altra (vedi `taglia`)."""
    return (0.25 if largo else 0.4) < w / h < 0.8 and h >= 240 and w >= 130


def pezzi_del_taglio(base, x0, y0, x1, y1, asse, v):
    """Riquadri (stretti sull'inchiostro fine) che nascono tagliando a metà dei vuoti `v`."""
    lun = (x1 - x0) if asse == 0 else (y1 - y0)
    tagli = [0] + [(a + b) // 2 for a, b in v] + [lun]
    out = []
    for k in range(len(tagli) - 1):
        a, b = tagli[k], tagli[k + 1]
        if b - a <= 0:
            continue
        sb = (x0 + a, y0, x0 + b, y1) if asse == 0 else (x0, y0 + a, x1, y0 + b)
        st = stringi(base[sb[1]:sb[3], sb[0]:sb[2]], sb[0], sb[1])
        if st:
            out.append((sb, st))
    return out


def taglia(base: np.ndarray, maschere: list, box, foglie, albero):
    """XY-cut ricorsivo. box = (x0, y0, x1, y1) in coordinate immagine.

    `base` è la maschera fine (serve per i riquadri). `maschere` è una scala di maschere con cui
    cercare i vuoti, dalla più fine alla più grossolana: si usa la prima che permette un taglio.
    Le più grossolane (soglia più alta, oppure solo le zone piene) ignorano ombre, sfumature del
    fondo e linee sottili che collegano una schermata all'altra. I pezzi si ritagliano a metà del
    vuoto (non sul bordo del contenuto), poi si stringono sull'inchiostro fine."""
    x0, y0, x1, y1 = box
    stretto = stringi(base[y0:y1, x0:x1], x0, y0)
    if stretto is None:
        return
    x0, y0, x1, y1 = stretto
    w, h = x1 - x0, y1 - y0
    gap = min(GAP_MAX, max(GAP_MIN, int(FRAZIONE_GAP * min(w, h))))
    nodo = {"box": [int(x0), int(y0), int(x1), int(y1)], "figli": []}
    albero.append(nodo)
    # una schermata di telefono non si sbriciola nelle sue sezioni: è un elemento
    schermata = SCHERMATE_ATTIVE and e_schermata(w, h, largo=True)
    if schermata and w / h < 0.4:
        # proporzione ambigua: due schermate impilate o uno schermo stretto? Se un taglio orizzontale
        # le divide in pezzi dalla proporzione di telefono, sono impilate
        for m in maschere:
            v = vuoti(m[y0:y1, x0:x1].sum(axis=1), gap)
            if v:
                pezzi = pezzi_del_taglio(base, x0, y0, x1, y1, 1, v)
                if len(pezzi) >= 2 and all(e_schermata(st[2] - st[0], st[3] - st[1]) for _, st in pezzi):
                    schermata = False
                    break
    if min(w, h) < MIN_LATO * 2 or schermata:
        foglie.append((x0, y0, x1, y1)); nodo["foglia"] = True
        return
    # tutte le coppie (maschera, direzione) che permettono un taglio
    tutti = []
    for livello, m in enumerate(maschere):
        sub = m[y0:y1, x0:x1]
        for asse in (0, 1):
            v = vuoti(sub.sum(axis=asse), gap)       # asse 0 -> per colonna (taglio verticale)
            if v:
                tutti.append((livello, asse, v))
    scelta = None
    if tutti:
        # se un taglio separa almeno due schermate di telefono si sceglie quello (a parità, la
        # maschera più fine e il vuoto più largo): tre schermate identiche hanno vuoti orizzontali
        # larghi uguali in tutte, che non vanno scelti; e la barra di navigazione in fondo non va staccata
        def punteggio(c):
            pezzi = pezzi_del_taglio(base, x0, y0, x1, y1, c[1], c[2])
            return sum(e_schermata(st[2] - st[0], st[3] - st[1], largo=True) for _, st in pezzi)
        con = [c for c in tutti if punteggio(c) >= 2]
        if con:
            scelta = min(con, key=lambda c: (c[0], -max(b - a for a, b in c[2])))
        else:
            primo = min(c[0] for c in tutti)
            scelta = max((c for c in tutti if c[0] == primo), key=lambda c: max(b - a for a, b in c[2]))
        nodo["maschera"] = scelta[0]
        scelta = (0, scelta[1], scelta[2])
    if scelta is None:
        foglie.append((x0, y0, x1, y1)); nodo["foglia"] = True
        return
    _, asse, v = scelta
    # una serie di pezzi grandi e della stessa misura (schermate, card, pannelli ripetuti) sono
    # elementi: non si scende dentro di loro
    pezzi = [st for _, st in pezzi_del_taglio(base, x0, y0, x1, y1, asse, v)]
    if len(pezzi) >= 3:
        ws = [st[2] - st[0] for st in pezzi]; hs = [st[3] - st[1] for st in pezzi]
        simili = (max(hs) - min(hs) <= 0.1 * max(hs) and max(ws) - min(ws) <= 0.2 * max(ws)) if asse == 0 else \
                 (max(ws) - min(ws) <= 0.1 * max(ws) and max(hs) - min(hs) <= 0.2 * max(hs))
        grandi = min(hs) >= 200 and min(ws) >= 100
        if simili and grandi and SCHERMATE_ATTIVE:
            for st in pezzi:
                foglie.append(st)
                nodo["figli"].append({"box": [int(c) for c in st], "figli": [], "foglia": True, "serie": True})
            return
    lun = w if asse == 0 else h
    tagli = [0] + [(a + b) // 2 for a, b in v] + [lun]
    for k in range(len(tagli) - 1):
        a, b = tagli[k], tagli[k + 1]
        if b - a <= 0:
            continue
        sottobox = (x0 + a, y0, x0 + b, y1) if asse == 0 else (x0, y0 + a, x1, y0 + b)
        taglia(base, maschere, sottobox, foglie, nodo["figli"])


MODELLO = cv2.imread(str(QUI / "modelli" / "9-41.png"), cv2.IMREAD_GRAYSCALE)


def trova_orari(grigio: np.ndarray, soglia: float = 0.72) -> list[tuple[int, int, float, float]]:
    """Dove sta la scritta «9:41» della barra di stato dei mockup (x, y, scala, punteggio).
    Ogni schermata di telefono ne ha una: contarle e vedere come sono disposte dice quante
    schermate ci sono e in che righe, anche quando si toccano e non c'è un vuoto da cui tagliare."""
    migliori = []
    for sc in np.geomspace(0.18, 1.4, 34):
        t = cv2.resize(MODELLO, None, fx=sc, fy=sc, interpolation=cv2.INTER_AREA)
        if t.shape[0] < 8 or t.shape[0] > grigio.shape[0] // 3 or t.shape[1] > grigio.shape[1] // 3:
            continue
        r = cv2.matchTemplate(grigio, t, cv2.TM_CCOEFF_NORMED)
        ys, xs = np.nonzero(r >= soglia)
        for y, x in zip(ys, xs):
            migliori.append((int(x), int(y), float(sc), float(r[y, x])))
    migliori.sort(key=lambda m: -m[3])
    scelti = []
    for m in migliori:     # soppressione dei non massimi
        if all(abs(m[0] - o[0]) > 14 * min(m[2], o[2]) + 6 or abs(m[1] - o[1]) > 8 for o in scelti):
            scelti.append(m)
    if len(scelti) < 2:
        return scelti
    # tiene la scala dominante
    scale = np.array([m[2] for m in scelti]); punteggi = np.array([m[3] for m in scelti])
    best = max(scale, key=lambda sc: punteggi[np.abs(scale / sc - 1) < 0.12].sum())
    return [m for m in scelti if abs(m[2] / best - 1) < 0.12]


def celle_schermate(base: np.ndarray, orari) -> list[tuple[int, int, int, int]]:
    """Una cella per schermata, dalle posizioni degli orari: righe = gruppi di orari alla stessa
    altezza; fra due schermate vicine si taglia dove c'è meno inchiostro."""
    H, W = base.shape
    orari = sorted(orari, key=lambda m: (m[1], m[0]))
    sc = float(np.median([m[2] for m in orari]))
    righe, corrente = [], [orari[0]]
    for m in orari[1:]:
        if abs(m[1] - corrente[0][1]) > 30 * sc:
            righe.append(corrente); corrente = [m]
        else:
            corrente.append(m)
    righe.append(corrente)
    celle = []
    for ri, riga in enumerate(righe):
        riga = sorted(riga, key=lambda m: m[0])
        y_orario = int(np.median([m[1] for m in riga]))
        # confini orizzontali: dall'alto = poco sopra l'orario, al basso = vuoto fra questa riga e la prossima
        y0 = max(0, y_orario - int(40 * sc))
        if ri + 1 < len(righe):
            y_next = int(np.median([m[1] for m in righe[ri + 1]]))
            zona = base[y_orario + int((y_next - y_orario) * 0.45): y_next - int(14 * sc)]
            prof = zona.sum(axis=1).astype(float)
            y1 = y_orario + int((y_next - y_orario) * 0.45) + (int(np.argmin(np.convolve(prof, np.ones(5) / 5, "same"))) if len(prof) else 0)
        else:
            y1 = H
        xs = [m[0] for m in riga]
        larg = float(np.median(np.diff(xs))) if len(xs) > 1 else float(W - xs[0])
        bordi = [max(0, int(xs[0] - 0.22 * larg))]
        for a, b in zip(xs[:-1], xs[1:]):
            zona = base[y0:y1, a + int(0.3 * larg): b]
            prof = np.convolve(zona.sum(axis=0).astype(float), np.ones(5) / 5, "same")
            bordi.append(a + int(0.3 * larg) + int(np.argmin(prof)))
        bordi.append(min(W, int(xs[-1] + 0.9 * larg)))
        for a, b in zip(bordi[:-1], bordi[1:]):
            st = stringi(base[y0:y1, a:b], a, y0)
            if st:
                celle.append(st)
    return celle


def classifica(rgb: np.ndarray, fondo: np.ndarray, box, con_orario: bool = False) -> tuple[str, dict]:
    x0, y0, x1, y1 = box
    p = rgb[y0:y1, x0:x1]
    h, w = p.shape[:2]
    q = (p // 24).astype(int)
    colori = len(np.unique(q[..., 0] * 100 + q[..., 1] * 10 + q[..., 2]))
    cornice = np.concatenate([p[:2].reshape(-1, 3), p[-2:].reshape(-1, 3), p[:, :2].reshape(-1, 3), p[:, -2:].reshape(-1, 3)])
    bordo_fondo = float(np.mean(np.linalg.norm(cornice - fondo, axis=1) <= 6))
    bordo_std = float(cornice.std(axis=0).max())
    k = max(3, min(8, min(w, h) // 8))
    angoli = np.concatenate([p[:k, :k].reshape(-1, 3), p[:k, -k:].reshape(-1, 3), p[-k:, :k].reshape(-1, 3), p[-k:, -k:].reshape(-1, 3)])
    angoli_fondo = float(np.mean(np.linalg.norm(angoli - fondo, axis=1) <= SOGLIA))
    ink = p[np.linalg.norm(p - fondo, axis=2) > SOGLIA]
    cromia = float((ink.max(axis=1) - ink.min(axis=1)).mean()) if len(ink) else 0.0   # 0 = grigio puro
    # testo: pochi colori e inchiostro neutro (nero/grigio), pezzo non troppo grande; oppure frammento minuscolo
    if (colori <= 12 and cromia < 28 and min(w, h) < 90 and w / max(h, 1) > 1.1) or (colori <= 14 and h < 26 and w < 60):
        tipo = "testo"
    elif con_orario and e_schermata(w, h, largo=True):
        tipo = "schermata"        # una schermata di telefono ha la barra di stato con «9:41»
    elif colori > 140 and w >= 90 and h >= 90 and angoli_fondo < 0.5 and bordo_std > 10:
        tipo = "foto"
    elif angoli_fondo >= 0.75 and max(w, h) < 700:
        tipo = "grafica"
    else:
        tipo = "pannello"
    return tipo, {"colori": colori, "bordo_fondo": round(bordo_fondo, 3), "angoli_fondo": round(angoli_fondo, 3)}


def estrai_immagine(i: int, file: pathlib.Path) -> dict:
    global SCHERMATE_ATTIVE
    SCHERMATE_ATTIVE = i not in SENZA_SCHERMATE
    nome = f"{i:02d}-{NOMI.get(i, 'immagine')}"
    cartella = USCITA / nome
    for vecchio in cartella.glob("*.png"):
        vecchio.unlink()
    cartella.mkdir(parents=True, exist_ok=True)
    im = Image.open(file).convert("RGB")
    rgb = np.asarray(im).astype(np.float64)
    fondo = fondo_immagine(rgb)
    mask, scala = scala_maschere(rgb, fondo)
    W, H = im.size
    foglie, albero = [], []
    grigio = np.asarray(im.convert("L"))
    orari = trova_orari(grigio)
    modalita = "xy"
    if len(orari) >= 3:
        # schermate di telefono: una cella per orario "9:41"; il resto dell'immagine si taglia come sempre
        celle = celle_schermate(mask, orari)
        resto = mask.copy(); resto_scala = [m.copy() for m in scala]
        for c in celle:
            resto[c[1]:c[3], c[0]:c[2]] = False
            for m in resto_scala:
                m[c[1]:c[3], c[0]:c[2]] = False
        foglie.extend(celle)
        albero.append({"box": [0, 0, W, H], "schermate_da_orari": len(orari), "figli": [{"box": list(map(int, c)), "foglia": True, "figli": []} for c in celle]})
        if resto.any():
            altre = []
            taglia(resto, resto_scala, (0, 0, W, H), altre, albero)
            # i residui sottili lungo i bordi delle schermate (frecce, ombre, margini) non sono elementi
            for b in altre:
                larg, alt = b[2] - b[0], b[3] - b[1]
                dentro = max((max(0, min(b[2], c[2]) - max(b[0], c[0])) * max(0, min(b[3], c[3]) - max(b[1], c[1]))) for c in celle) / max(1, larg * alt)
                if min(larg, alt) >= 48 and dentro < 0.2:
                    foglie.append(b)
        modalita = "orari"
    else:
        taglia(mask, scala, (0, 0, W, H), foglie, albero)
    foglie = [b for b in foglie if min(b[2] - b[0], b[3] - b[1]) >= MIN_LATO]
    foglie.sort(key=lambda b: (round(b[1] / 40), b[0]))
    elementi, conta = [], {}
    prev = im.copy(); d = ImageDraw.Draw(prev)
    colori_tipo = {"schermata": (0, 140, 255), "foto": (255, 140, 0), "grafica": (0, 170, 80), "pannello": (160, 0, 200), "testo": (150, 150, 150)}
    scarto_max = 0.0
    for box in foglie:
        con_orario = any(box[0] <= m[0] <= box[2] and box[1] <= m[1] <= box[3] for m in orari)
        tipo, info = classifica(rgb, fondo, box, con_orario)
        conta[tipo] = conta.get(tipo, 0) + 1
        d.rectangle(box, outline=colori_tipo[tipo], width=2)
        if tipo == "testo":
            continue
        n = len(elementi) + 1
        ritaglio = im.crop(box)
        file_out = f"{n:03d}-{tipo}.png"
        trasparente = False
        scarto = 0.0
        if tipo == "grafica":
            rgba, _ = stacca(ritaglio, fondo=fondo)
            ver = verifica_ricomposizione(ritaglio, rgba, fondo)
            scarto = ver["mae_255"]
            if scarto <= 1.0:
                rgba.save(cartella / file_out, optimize=True); trasparente = True
        if not trasparente:
            ritaglio.save(cartella / file_out, optimize=True)
        scarto_max = max(scarto_max, scarto)
        d.text((box[0] + 3, box[1] + 3), str(n), fill=(255, 0, 0))
        elementi.append({"n": n, "file": file_out, "tipo": tipo, "riquadro": list(map(int, box)), "dimensioni": [box[2] - box[0], box[3] - box[1]],
                         "trasparente": trasparente, "ricomposizione_mae_255": round(scarto, 3), **info})
    prev.save(cartella / "anteprima.png", optimize=True)
    rec = {"indice": i, "cartella": nome, "sorgente": file.name, "dimensioni": [W, H], "fondo": "#%02X%02X%02X" % tuple(int(v) for v in fondo),
           "modalita": modalita, "elementi": len(elementi), "per_tipo": conta, "scarto_ricomposizione_max_255": round(scarto_max, 3)}
    (cartella / "elementi.json").write_text(json.dumps({**rec, "lista": elementi, "albero": albero}, indent=1, default=int))
    return rec


def main():
    file = sorted(SORGENTI.glob("*"))
    file = [f for f in file if f.suffix.lower() in (".png", ".jpg", ".jpeg")]
    scelti = {int(a) for a in sys.argv[1:]} if sys.argv[1:] else None
    USCITA.mkdir(parents=True, exist_ok=True)
    indice_f = USCITA / "concept.json"
    indice = {r["indice"]: r for r in json.loads(indice_f.read_text())} if indice_f.exists() else {}
    for i, f in enumerate(file):
        if scelti is not None and i not in scelti:
            continue
        r = estrai_immagine(i, f)
        indice[i] = r
        print(f"{r['cartella']:46} {r['elementi']:4d} elementi  {r['per_tipo']}  scarto {r['scarto_ricomposizione_max_255']}", flush=True)
    indice_f.write_text(json.dumps([indice[k] for k in sorted(indice)], indent=1))


if __name__ == "__main__":
    main()
