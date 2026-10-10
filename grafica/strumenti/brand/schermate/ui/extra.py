"""
Componenti UI e token del Brand Kit (agente `ui`): pulsanti, interruttori, caselle, radio, avanzamento, barre,
badge, chip, card di stato, input, card esempio, misuratore; campioni di colore e tipografici.

Ogni componente è una funzione  f(t, x, y, ...)  che disegna in un gruppo con id parlante sulla Tela `t`
(da ui.py) con l'angolo in alto a sinistra in (x, y) e restituisce (larghezza, altezza). Così lo stesso
codice produce sia il file del componente da solo sia il foglio componenti del kit.

Le misure sono in PIXEL DELL'IMMAGINE ORIGINALE del kit (blu: 17 → 1881 px; rosso: 08 → 1536 px;
luminoso: 16 → 1881 px; moduli/tag/card: 28 → 1536 px). Sono state misurate sugli ingrandimenti e confrontate
con i token di src/brand/tokens.ts: vedi NOTE.md per le correzioni.
"""
from __future__ import annotations

import importlib.util
import math
import pathlib
import sys

QUI = pathlib.Path(__file__).resolve().parent
SCHERMATE = QUI.parent
RADICE = SCHERMATE.parents[2]

# ui.py (la cartella `ui/` e il file `ui.py` hanno lo stesso nome: si carica il file per percorso)
_spec = importlib.util.spec_from_file_location("ui_base", SCHERMATE / "ui.py")
U = importlib.util.module_from_spec(_spec)
sys.modules["ui_base"] = U
_spec.loader.exec_module(U)
Tela, n, larghezza_testo = U.Tela, U.n, U.larghezza_testo

# il Light (300) c'è nei file del font ma ui._peso lo arrotonda a 400: lo allarghiamo
U._peso = lambda p: min((300, 400, 500, 600, 700, 800, 900), key=lambda q: abs(q - p))

def _tracciato_leggero(testo, x, y, dimensione, peso=400, ancora="start", spaziatura=0.0):
    """Come ui.tracciato ma con una cifra decimale (o due per i corpi grandi): i fogli con molto testo restano sotto i 300 KB."""
    from fontTools.pens.svgPathPen import SVGPathPen
    from fontTools.pens.transformPen import TransformPen
    _, gs, cmap, upm = U._font(U._peso(peso))
    s = dimensione / upm
    tot = U.larghezza_testo(testo, dimensione, peso, spaziatura)
    cx = x - tot / 2 if ancora == "middle" else x - tot if ancora == "end" else x
    dec = 1 if dimensione < 40 else 2
    def ntos(v):
        r = f"{v:.{dec}f}".rstrip("0").rstrip(".")
        return "0" if r in ("-0", "") else r
    pen = SVGPathPen(gs, ntos=ntos)
    for c in testo:
        g = cmap.get(ord(c), cmap[ord("?")])
        gs[g].draw(TransformPen(pen, (s, 0, 0, -s, cx, y)))
        cx += gs[g].width * s + spaziatura
    return pen.getCommands()


U.tracciato = _tracciato_leggero

INK = U.INK
GRIGIO = U.GRIGIO


def fit(testo: str, larghezza: float, peso: int = 600) -> float:
    """Corpo (px) per cui il testo risulta largo `larghezza`."""
    return larghezza / larghezza_testo(testo, 1.0, peso)


def mix(a: str, b: str, k: float) -> str:
    """Colore intermedio tra a e b (k=0 -> a)."""
    pa = [int(a[i:i + 2], 16) for i in (1, 3, 5)]
    pb = [int(b[i:i + 2], 16) for i in (1, 3, 5)]
    return "#" + "".join(f"{round(x + (y - x) * k):02X}" for x, y in zip(pa, pb))


# ------------------------------------------------------------------------------------------ i tre kit
# Colori campionati sulle zone pulite delle immagini 17 (blu piatto), 08 (rosso), 16 (luminoso) e verificati
# con i token (src/brand/tokens.ts). `scala` = punti per pixel dell'originale (1 = pixel dell'originale).
KITS = {
    "blu": dict(
        sorgente="17", larg_orig=1881, lum=False,
        azione="#1C6EFD", azione_chiara="#6EA0FE", bordo="#5C93FD", testo_outline="#1560F3",
        pallido="#EAF1FD", sec_fondo="#EEF2F8", sec_testo=INK,
        interruttore=dict(w=51, h=30, spento="#D6DBE4", spento_bordo="#CBD2DE"),
        casella=dict(lato=26, r=5, bordo="#D2D8E3"),
        radio=dict(lato=29, bordo="#D2D8E3"),
        pulsante=dict(primario=(145, 47, 12), secondario=(144, 47, 12), outline=(139, 47, 12)),
        avanz=dict(d=25, passo=85, spessore=3, fatto="#1C6EFD", futuro="#E5E9F2", futuro_testo="#334155",
                   linea="#E2E8F5", linea_fatta="#1C6EFD", etichetta="#5E6E8E", etichetta_corpo=12.6, attuale="anello_alone"),
    ),
    "rosso": dict(
        sorgente="08", larg_orig=1536, lum=False,
        azione="#F22B36", azione_chiara="#F87171", bordo="#FDA4AA", testo_outline="#FB1A23",
        pallido="#FEEEEE", sec_fondo="#FEEEEE", sec_testo="#FC1217",
        interruttore=dict(w=44, h=26, spento="#E4E7EE", spento_bordo="#D3D7E1"),
        casella=dict(lato=26, r=6, bordo="#D4D7E2"),
        radio=dict(lato=26, bordo="#D4D7E2"),
        pulsante=dict(primario=(179, 54, 12), secondario=(173, 54, 13), outline=(140, 56, 13)),
        avanz=dict(d=30, passo=91, spessore=3, fatto="#F0303B", futuro="#9CA3AF", futuro_testo="#FFFFFF",
                   linea="#E5E7EB", linea_fatta="#FCD6D8", etichetta="#4B5563", etichetta_corpo=13.5, attuale="anello"),
    ),
    "luminoso": dict(
        sorgente="16", larg_orig=1881, lum=True,
        azione="#1467F5", azione_chiara="#2A7DFF", bordo="#548FFD", testo_outline="#1560F3",
        pallido="#EAF1FD", sec_fondo="#EDF1FA", sec_testo=INK,
        interruttore=dict(w=51, h=30, spento="#D6DBE4", spento_bordo="#CBD2DE"),
        casella=dict(lato=26, r=5, bordo="#D2D8E3"),
        radio=dict(lato=29, bordo="#D2D8E3"),
        pulsante=dict(primario=(147, 46, 12), secondario=(147, 46, 12), outline=(139, 46, 12)),
        avanz=dict(d=26, passo=88, spessore=3, fatto="#1C6EFD", futuro="#E2E6F0", futuro_testo="#1E2B4A",
                   linea="#E2E8F5", linea_fatta="#1C6EFD", etichetta="#5E6E8E", etichetta_corpo=13, attuale="anello_alone"),
    ),
}

# stati e feedback e badge (kit blu / luminoso; nel rosso l'immagine 08 non li mostra)
STATI = {
    "successo": dict(fondo="#EDFAF1", cerchio="#22C55E", cerchio_chiaro="#4ADE80", cerchio_scuro="#16A34A", titolo="#15803D", testo="#15803D",
                     righe=("Operazione", "completata")),
    "errore": dict(fondo="#FEEFEE", cerchio="#EF4444", cerchio_chiaro="#FB7185", cerchio_scuro="#DC2626", titolo="#E0242C", testo="#E0242C",
                   righe=("Qualcosa", "è andato storto")),
    "attenzione": dict(fondo="#FEF6E8", cerchio="#F59E0B", cerchio_chiaro="#FBBF24", cerchio_scuro="#EA8A00", titolo="#B45309", testo="#B45309",
                       righe=("Attenzione", "leggi bene")),
    "info": dict(fondo="#EDF3FE", cerchio="#1C6EFD", cerchio_chiaro="#4F94FF", cerchio_scuro="#1257E6", titolo="#1E3A8A", testo="#4B5E8A",
                 righe=("Informazione", "importante")),
}
BADGE = {
    "piu-scelto": dict(fondo="#FEEEEE", colore="#F83238", testo="Più scelto"),
    "massima-sicurezza": dict(fondo="#E9F9EE", colore="#159F48", testo="Massima sicurezza"),
    "consigliato": dict(fondo="#EDF3FE", colore="#1460FD", testo="Consigliato"),
}


def _def_grad_rett(t, x, y, w, h, r, cima, fondo, id=None, stroke=None, sw=1, filtro=None):
    g = t.sfumatura([cima, fondo], 0, 0, 0, 1)
    t.rett(x, y, w, h, r, fill=g, id=id, stroke=stroke, sw=sw, filtro=filtro)


def _lucido(t, x, y, w, h, r, forza=0.38, id=None):
    """Riflesso del kit luminoso: velo bianco in alto (copre la metà superiore, sfuma verso il basso)."""
    gid = t.uid("lu")
    t.defs.append(f'<linearGradient id="{gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity="{forza}"/>'
                  f'<stop offset="0.55" stop-color="#FFFFFF" stop-opacity="0.04"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient>')
    t.rett(x + 0.5, y + 0.5, w - 1, h - 1, max(0, r - 0.5), fill=f"url(#{gid})", id=id)


# ------------------------------------------------------------------------------------------ pulsanti
def freccia(t, x, cy, colore, alt=11, sp=2.3, id=None):
    """Chevron destro con la punta a x+larg; centrato in cy. Restituisce la larghezza."""
    w = alt * 0.62
    t.path(f"M{n(x)} {n(cy - alt / 2)}L{n(x + w)} {n(cy)}L{n(x)} {n(cy + alt / 2)}", stroke=colore, sw=sp, id=id)
    return w


def pulsante(t, x, y, kit="blu", variante="primario", etichetta=None, id=None, freccia_dx=None, w=None, corpo=None, h=None, r=None):
    K = KITS[kit]
    bw, bh, rr = K["pulsante"]["primario" if variante in ("rischio",) else ("outline" if variante == "contorno" else variante)]
    bh = h or bh
    r = r if r is not None else (rr if not h else h * 0.28)
    w = w or bw
    etichetta = etichetta or {"primario": "Primario", "secondario": "Secondario", "outline": "Outline", "rischio": "Rischio", "contorno": "Secondario"}[variante]
    if freccia_dx is None:
        freccia_dx = not (kit == "rosso" and variante == "outline")
    corpo = corpo or (bh * 0.40 if h else bh * 0.315 if kit != "rosso" else bh * 0.30)
    i = id or f"pulsante-{variante}"
    lum = K["lum"]
    with t.gruppo(i):
        if variante in ("primario", "rischio"):
            base = "#F43A40" if variante == "rischio" else K["azione"]
            col = "#FFFFFF"
            if lum:
                cima, fondo = ("#FB5A5E", "#E5262E") if variante == "rischio" else ("#2579FF", "#0459E7")
                _def_grad_rett(t, x, y, w, bh, r, cima, fondo, id=f"{i}-fondo", filtro=t.ombra(4, 10, fondo, 0.30))
                _lucido(t, x, y, w, bh, r, 0.28, id=f"{i}-riflesso")
            else:
                t.rett(x, y, w, bh, r, fill=base if kit != "rosso" else K["azione"], id=f"{i}-fondo",
                       filtro=t.ombra(3, 8, base, 0.18))
        elif variante == "secondario":
            col = K["sec_testo"]
            if lum:
                _def_grad_rett(t, x, y, w, bh, r, "#F4F7FC", "#E6EBF4", id=f"{i}-fondo", filtro=t.ombra(2, 6, "#0F172A", 0.07))
                _lucido(t, x, y, w, bh, r, 0.55, id=f"{i}-riflesso")
            else:
                t.rett(x, y, w, bh, r, fill=K["sec_fondo"], id=f"{i}-fondo")
        elif variante == "contorno":     # «Secondario» del modulo di 28: bianco, filo azzurro, testo scuro
            col = INK
            t.rett(x + 0.75, y + 0.75, w - 1.5, bh - 1.5, r - 0.5, fill="#FFFFFF", stroke="#BFD3FB", sw=1.4, id=f"{i}-fondo",
                   filtro=t.ombra(2, 8, K["azione"], 0.10))
        else:  # outline
            col = K["testo_outline"]
            t.rett(x + 0.75, y + 0.75, w - 1.5, bh - 1.5, r - 0.5, fill="#FFFFFF", stroke=K["bordo"], sw=1.6, id=f"{i}-fondo",
                   filtro=t.ombra(2, 8, K["bordo"], 0.16) if lum else None)
        lw = larghezza_testo(etichetta, corpo, 600, -0.1)
        alt = bh * 0.24
        gap = bh * 0.34
        fw = alt * 0.62
        tot = lw + (gap + fw if freccia_dx else 0)
        sx = x + (w - tot) / 2
        t.testo(etichetta, sx, y + bh / 2 + corpo * 0.36, corpo, 600, col, id=f"{i}-testo", spaziatura=-0.1)
        if freccia_dx:
            freccia(t, sx + lw + gap, y + bh / 2, col, alt, 2.2 if bh < 50 else 2.4, id=f"{i}-freccia")
    return w, bh


# ------------------------------------------------------------------------------------------ interruttore, casella, radio
def interruttore(t, x, y, kit="blu", acceso=True, id=None, w=None, h=None):
    K = KITS[kit]
    I = K["interruttore"]
    w, h = w or I["w"], h or I["h"]
    i = id or ("interruttore-acceso" if acceso else "interruttore-spento")
    lum = K["lum"]
    with t.gruppo(i):
        if acceso:
            if lum:
                _def_grad_rett(t, x, y, w, h, h / 2, "#3B86FF", "#1060F0", id=f"{i}-traccia", filtro=t.ombra(3, 8, K["azione"], 0.28))
            else:
                t.rett(x, y, w, h, h / 2, fill=K["azione"], id=f"{i}-traccia", filtro=t.ombra(2, 6, K["azione"], 0.18))
        else:
            t.rett(x + 0.5, y + 0.5, w - 1, h - 1, (h - 1) / 2, fill=I["spento"], stroke=I["spento_bordo"], sw=1, id=f"{i}-traccia")
        m = 3 if h > 22 else 2
        d = h - 2 * m
        px = x + w - m - d / 2 if acceso else x + 3 + d / 2
        t.cerchio(px, y + h / 2, d / 2, fill="#FFFFFF", id=f"{i}-pomello", filtro=t.ombra(1.2, 4, "#0F172A", 0.28 if acceso else 0.22))
    return w, h


def casella(t, x, y, kit="blu", spuntata=True, id=None, lato=None):
    K = KITS[kit]
    C = K["casella"]
    L = lato or C["lato"]
    i = id or ("casella-spuntata" if spuntata else "casella-vuota")
    with t.gruppo(i):
        if spuntata:
            if K["lum"]:
                _def_grad_rett(t, x, y, L, L, C["r"], "#2F80FF", "#1060F0", id=f"{i}-fondo", filtro=t.ombra(2, 5, K["azione"], 0.28))
            else:
                t.rett(x, y, L, L, C["r"], fill=K["azione"], id=f"{i}-fondo", filtro=t.ombra(1.5, 4, K["azione"], 0.2))
            t.path(f"M{n(x + L * 0.25)} {n(y + L * 0.52)}L{n(x + L * 0.43)} {n(y + L * 0.70)}L{n(x + L * 0.76)} {n(y + L * 0.31)}",
                   stroke="#FFFFFF", sw=L * 0.1, id=f"{i}-spunta")
        else:
            t.rett(x + 0.9, y + 0.9, L - 1.8, L - 1.8, C["r"], fill="#FFFFFF", stroke=C["bordo"], sw=1.8, id=f"{i}-fondo")
    return L, L


def radio(t, x, y, kit="blu", selezionato=True, id=None, lato=None):
    K = KITS[kit]
    L = lato or K["radio"]["lato"]
    c = L / 2
    i = id or ("radio-selezionato" if selezionato else "radio-vuoto")
    with t.gruppo(i):
        if selezionato:
            if K["lum"]:
                t.cerchio(x + c, y + c, c + 1.5, fill=mix("#FFFFFF", K["azione"], 0.12), id=f"{i}-alone")
            t.cerchio(x + c, y + c, c - 1.1, fill="#FFFFFF", stroke=K["azione"], sw=2.2, id=f"{i}-anello",
                      filtro=t.ombra(2, 6, K["azione"], 0.2) if K["lum"] else None)
            t.cerchio(x + c, y + c, c * 0.40, fill=K["azione"], id=f"{i}-punto")
        else:
            t.cerchio(x + c, y + c, c - 0.9, fill="#FFFFFF", stroke=K["radio"]["bordo"], sw=1.8, id=f"{i}-anello")
    return L, L


# ------------------------------------------------------------------------------------------ avanzamento a passi
def avanzamento(t, x, y, kit="blu", passi=("Verifica", "Quiz", "Risultato", "Piani", "Pagamento", "Successo"), attuale=1, id=None,
                passo=None):
    """(x, y) = angolo in alto a sinistra del primo cerchio. Stati: i < attuale fatto, i == attuale in corso, dopo futuro."""
    K = KITS[kit]
    A = K["avanz"]
    d = A["d"]
    p = passo or A["passo"]
    i = id or "avanzamento"
    cy = y + d / 2
    corpo_num = d * 0.5
    with t.gruppo(i):
        # linee (sotto i cerchi)
        with t.gruppo(f"{i}-linee"):
            for k in range(len(passi) - 1):
                xa, xb = x + d / 2 + k * p, x + d / 2 + (k + 1) * p
                col = A["linea_fatta"] if k < attuale else A["linea"]
                t.rett(xa, cy - A["spessore"] / 2, xb - xa, A["spessore"], A["spessore"] / 2, fill=col, id=f"{i}-linea-{k + 1}")
        for k, nome in enumerate(passi):
            cx = x + d / 2 + k * p
            fatto, ora = k < attuale, k == attuale
            with t.gruppo(f"{i}-passo-{k + 1}"):
                if ora and A["attuale"] == "anello":
                    t.cerchio(cx, cy, d / 2 - 1, fill="#FFFFFF", stroke=A["fatto"], sw=2, id=f"{i}-cerchio-{k + 1}")
                    colnum = A["fatto"]
                elif fatto or ora:
                    if ora:
                        t.cerchio(cx, cy, d / 2 + 4.5, fill=mix("#FFFFFF", A["fatto"], 0.16), id=f"{i}-alone-{k + 1}")
                    t.cerchio(cx, cy, d / 2, fill=A["fatto"], id=f"{i}-cerchio-{k + 1}",
                              filtro=t.ombra(1.5, 5, A["fatto"], 0.35) if K["lum"] else None)
                    colnum = "#FFFFFF"
                else:
                    t.cerchio(cx, cy, d / 2, fill=A["futuro"], id=f"{i}-cerchio-{k + 1}",
                              filtro=t.ombra(1.5, 5, "#0F172A", 0.10) if K["lum"] else None)
                    colnum = A["futuro_testo"]
                t.testo(str(k + 1), cx, cy + corpo_num * 0.36, corpo_num, 700 if kit == "rosso" else 600, colnum, "middle", id=f"{i}-numero-{k + 1}")
                t.testo(nome, cx, y + d + A["etichetta_corpo"] * 1.55, A["etichetta_corpo"], 400, A["etichetta"], "middle", id=f"{i}-etichetta-{k + 1}")
    return d + (len(passi) - 1) * p, d + A["etichetta_corpo"] * 2.2


# ------------------------------------------------------------------------------------------ barre (kit rosso, immagine 08)
def barra_segmentata(t, x, y, kit="rosso", segmenti=4, valore=2.5, w=162, h=10, gap=5, id=None):
    """valore in segmenti: i primi floor() pieni, l'eventuale frazione = segmento «in corso» (tinta chiara), il resto vuoto."""
    pieno, chiaro, vuoto = "#EF3B45", "#FCD5D8", "#EFF0F5"
    i = id or "barra-segmentata"
    sw = (w - gap * (segmenti - 1)) / segmenti
    with t.gruppo(i):
        for k in range(segmenti):
            col = pieno if k < math.floor(valore) else (chiaro if k < valore else vuoto)
            t.rett(x + k * (sw + gap), y, sw, h, h / 2, fill=col, id=f"{i}-segmento-{k + 1}")
    return w, h


def barra_continua(t, x, y, kit="rosso", valore=0.55, w=162, h=12, id=None):
    i = id or "barra-progresso"
    g = t.sfumatura(["#F87171", "#E11D2B"], 0, 0, 1, 0)
    with t.gruppo(i):
        t.rett(x, y, w, h, h / 2, fill="#EFF0F5", id=f"{i}-fondo")
        t.rett(x, y, max(h, w * valore), h, h / 2, fill=g, id=f"{i}-valore")
    return w, h


# ------------------------------------------------------------------------------------------ badge / stato
def _simbolo(t, nome, cx, cy, r, colore="#FFFFFF", sp=None, id=None):
    sp = sp or r * 0.28
    with t.gruppo(id or f"simbolo-{nome}"):
        if nome == "successo":
            t.path(f"M{n(cx - r * .38)} {n(cy + r * .02)}L{n(cx - r * .08)} {n(cy + r * .32)}L{n(cx + r * .42)} {n(cy - r * .30)}", stroke=colore, sw=sp)
        elif nome == "errore":
            q = r * 0.33
            t.path(f"M{n(cx - q)} {n(cy - q)}L{n(cx + q)} {n(cy + q)}M{n(cx + q)} {n(cy - q)}L{n(cx - q)} {n(cy + q)}", stroke=colore, sw=sp)
        elif nome == "attenzione":
            t.path(f"M{n(cx)} {n(cy - r * .42)}L{n(cx)} {n(cy + r * .08)}", stroke=colore, sw=sp * 0.95)
            t.cerchio(cx, cy + r * .40, sp * 0.52, fill=colore)
        elif nome == "info":
            t.path(f"M{n(cx)} {n(cy - r * .06)}L{n(cx)} {n(cy + r * .42)}", stroke=colore, sw=sp * 0.95)
            t.cerchio(cx, cy - r * .40, sp * 0.52, fill=colore)


def stato(t, x, y, tipo="successo", kit="blu", w=162, h=67, id=None, righe=None, r=12):
    S = STATI[tipo]
    lum = KITS[kit]["lum"]
    i = id or f"stato-{tipo}"
    righe = righe or S["righe"]
    d = h * 0.57
    with t.gruppo(i):
        t.rett(x, y, w, h, r, fill=S["fondo"], id=f"{i}-fondo", filtro=t.ombra(3, 10, S["cerchio"], 0.12) if lum else None,
               stroke=mix(S["fondo"], S["cerchio"], 0.14) if lum else None, sw=1)
        cx, cy = x + 13 + d / 2, y + h / 2
        if lum:
            g = t.sfumatura([S["cerchio_chiaro"], S["cerchio_scuro"]], 0, 0, 0, 1)
            t.cerchio(cx, cy, d / 2, fill=g, id=f"{i}-cerchio", filtro=t.ombra(2.5, 6, S["cerchio_scuro"], 0.35))
            gl = t.radiale([(0, "#FFFFFF", 0.55), (1, "#FFFFFF", 0)], 0.35, 0.22, 0.55)
            t.cerchio(cx, cy, d / 2 - 0.5, fill=gl, id=f"{i}-riflesso")
        else:
            t.cerchio(cx, cy, d / 2, fill=S["cerchio"], id=f"{i}-cerchio")
        _simbolo(t, tipo, cx, cy, d / 2, id=f"{i}-simbolo")
        tx = x + 13 + d + 11
        corpo = 12.8
        t.testo(righe[0], tx, cy - corpo * 0.18, corpo, 500, S["titolo"], id=f"{i}-titolo")
        t.testo(righe[1], tx, cy + corpo * 1.1, corpo, 400, S["testo"], id=f"{i}-testo")
    return w, h


def _icona_badge(t, tipo, cx, cy, colore, s=1.0, id=None):
    with t.gruppo(id or f"badge-icona-{tipo}"):
        if tipo == "piu-scelto":
            t.path(f"M{n(cx)} {n(cy + 9 * s)}L{n(cx)} {n(cy - 8 * s)}M{n(cx - 7 * s)} {n(cy - 1.5 * s)}L{n(cx)} {n(cy - 8.5 * s)}L{n(cx + 7 * s)} {n(cy - 1.5 * s)}",
                   stroke=colore, sw=2.4 * s)
        elif tipo == "massima-sicurezza":
            k = s * 1.0
            t.path(f"M{n(cx)} {n(cy - 9 * k)}L{n(cx + 7.6 * k)} {n(cy - 6.2 * k)}V{n(cy + 0.5 * k)}C{n(cx + 7.6 * k)} {n(cy + 5.2 * k)} {n(cx + 4.4 * k)} {n(cy + 8 * k)} {n(cx)} {n(cy + 9.6 * k)}"
                   f"C{n(cx - 4.4 * k)} {n(cy + 8 * k)} {n(cx - 7.6 * k)} {n(cy + 5.2 * k)} {n(cx - 7.6 * k)} {n(cy + 0.5 * k)}V{n(cy - 6.2 * k)}z",
                   fill=colore, stroke=colore, sw=1.2 * s)
            t.path(f"M{n(cx - 3.4 * k)} {n(cy + 0.3 * k)}L{n(cx - 0.9 * k)} {n(cy + 3 * k)}L{n(cx + 3.7 * k)} {n(cy - 2.8 * k)}", stroke="#FFFFFF", sw=1.9 * s)
        else:  # stella
            R, r = 9.3 * s, 4.1 * s
            pts = []
            for kk in range(10):
                a = -math.pi / 2 + kk * math.pi / 5
                rr = R if kk % 2 == 0 else r
                pts.append((cx + rr * math.cos(a), cy + 0.5 * s + rr * math.sin(a)))
            t.path("M" + "L".join(f"{n(px)} {n(py)}" for px, py in pts) + "z", fill=colore, stroke=colore, sw=1.6 * s)


def badge(t, x, y, tipo="piu-scelto", kit="blu", h=42, id=None, corpo=None, r=10):
    B = BADGE[tipo]
    lum = KITS[kit]["lum"]
    corpo = corpo or fit("Più scelto", 55, 400)
    i = id or f"badge-{tipo}"
    lw = larghezza_testo(B["testo"], corpo, 500, -0.2)
    pad_s, ic, gap = 13, 18, 9
    w = pad_s + ic + gap + lw + 14
    with t.gruppo(i):
        t.rett(x, y, w, h, r, fill=B["fondo"], id=f"{i}-fondo", filtro=t.ombra(2, 8, B["colore"], 0.14) if lum else None,
               stroke=mix(B["fondo"], B["colore"], 0.16) if lum else None, sw=1)
        _icona_badge(t, tipo, x + pad_s + ic / 2, y + h / 2, B["colore"], 0.95, id=f"{i}-icona")
        t.testo(B["testo"], x + pad_s + ic + gap, y + h / 2 + corpo * 0.35, corpo, 500, B["colore"], id=f"{i}-testo", spaziatura=-0.2)
    return w, h


# ------------------------------------------------------------------------------------------ chip / tag (immagini 15, 35, 28)
CHIP_TONI = {
    "verde": dict(fondo="#DCF4E4", testo="#17893F"),
    "blu": dict(fondo="#E2EBFD", testo="#1B58E0"),
    "bianco": dict(fondo="#FFFFFF", testo="#27345A", bordo="#EDF1F7"),
}


def chip(t, x, y, testo, tono="verde", h=35, corpo=None, px=None, id=None, w=None, peso=500):
    c = CHIP_TONI[tono]
    corpo = corpo or h * 0.44
    px = px if px is not None else h * 0.5
    lw = larghezza_testo(testo, corpo, peso, -0.1)
    w = w or lw + 2 * px
    i = id or "chip-" + testo.lower().replace(" ", "-")
    with t.gruppo(i):
        t.rett(x, y, w, h, h / 2, fill=c["fondo"], stroke=c.get("bordo"), sw=1, id=f"{i}-fondo",
               filtro=t.ombra(1, 6, "#0F172A", 0.05) if tono == "bianco" else None)
        t.testo(testo, x + w / 2, y + h / 2 + corpo * 0.36, corpo, peso, c["testo"], "middle", id=f"{i}-testo", spaziatura=-0.1)
    return w, h


TAG_STATO = {
    "completato": dict(testo="Completato", fondo="#E3F6EA", colore="#1E9A52", cerchio="#22C55E", simbolo="successo"),
    "errore": dict(testo="Errore", fondo="#FDE8E8", colore="#E0242C", cerchio="#EF4444", simbolo="errore"),
    "attenzione": dict(testo="Attenzione", fondo="#FEF3DF", colore="#C2740A", cerchio="#F59E0B", simbolo="attenzione"),
    "info": dict(testo="Info", fondo="#E5EEFD", colore="#1D5FF5", cerchio="#1C6EFD", simbolo="info"),
}


def tag_stato(t, x, y, tipo="completato", h=24, id=None, w=None):
    T = TAG_STATO[tipo]
    corpo = h * 0.40
    d = h * 0.66
    lw = larghezza_testo(T["testo"], corpo, 500, -0.1)
    w = w or 8 + d + 6 + lw + 10
    i = id or f"tag-{tipo}"
    with t.gruppo(i):
        t.rett(x, y, w, h, h * 0.3, fill=T["fondo"], id=f"{i}-fondo")
        cx, cy = x + 8 + d / 2, y + h / 2
        t.cerchio(cx, cy, d / 2, fill=T["cerchio"], id=f"{i}-cerchio")
        _simbolo(t, T["simbolo"], cx, cy, d / 2, sp=d * 0.15, id=f"{i}-simbolo")
        t.testo(T["testo"], x + 8 + d + 6, cy + corpo * 0.36, corpo, 500, T["colore"], id=f"{i}-testo", spaziatura=-0.1)
    return w, h


def riga_completata(t, x, y, testo, w=150, h=24, id=None, colore="#22C55E", corpo=11):
    """Riga di lista con cerchio verde spuntato (mini-schermata «I tuoi progressi» dell'immagine 15)."""
    i = id or "riga-" + testo.lower().replace(" ", "-")
    with t.gruppo(i):
        t.cerchio(x + h / 2 - 2, y + h / 2, h * 0.34, fill=colore, id=f"{i}-cerchio")
        _simbolo(t, "successo", x + h / 2 - 2, y + h / 2, h * 0.34, sp=1.6, id=f"{i}-spunta")
        t.testo(testo, x + h + 4, y + h / 2 + corpo * 0.35, corpo, 500, "#1F2A44", id=f"{i}-testo")
    return w, h


# ------------------------------------------------------------------------------------------ input, ricerca, selezione (immagine 28)
def campo_testo(t, x, y, w=153, h=28, testo="Placeholder", id=None, kit="blu", ricerca=False):
    i = id or ("campo-ricerca" if ricerca else "campo-testo")
    corpo = h * 0.40
    with t.gruppo(i):
        t.rett(x + 0.5, y + 0.5, w - 1, h - 1, 7, fill="#FFFFFF", stroke="#DCE3EF", sw=1, id=f"{i}-fondo",
               filtro=t.ombra(1, 6, "#1C6EFD", 0.07))
        tx = x + 11
        if ricerca:
            cx, cy = x + 17, y + h / 2 - 0.5
            t.cerchio(cx, cy, 5.3, fill="none", stroke="#7C89A6", sw=1.6, id=f"{i}-lente")
            t.path(f"M{n(cx + 3.9)} {n(cy + 3.9)}L{n(cx + 8)} {n(cy + 8)}", stroke="#7C89A6", sw=1.7, id=f"{i}-manico")
            tx = x + 31
        t.testo(testo, tx, y + h / 2 + corpo * 0.36, corpo, 400, "#9AA5BC", id=f"{i}-testo")
    return w, h


def selezione_etichettata(t, x, y, testo, tipo="radio", attivo=True, kit="blu", lato=None, id=None, corpo=None):
    """Radio o casella con etichetta ("Selezionato" / "Non selezionato"), come nell'immagine 28."""
    lato = lato or 19
    corpo = corpo or lato * 0.62
    i = id or f"{tipo}-{'selezionato' if attivo else 'non-selezionato'}"
    with t.gruppo(i):
        if tipo == "radio":
            radio(t, x, y, kit, attivo, id=f"{i}-controllo", lato=lato)
        else:
            casella(t, x, y, kit, attivo, id=f"{i}-controllo", lato=lato)
        t.testo(testo, x + lato + 9, y + lato / 2 + corpo * 0.35, corpo, 400, "#5B6785", id=f"{i}-testo")
    return lato + 9 + larghezza_testo(testo, corpo, 400), lato


def card_esempio(t, x, y, w=258, h=73, titolo="Simulazione", sotto="10 domande • 3 minuti", id=None, kit="blu"):
    i = id or "card-esempio"
    with t.gruppo(i):
        t.rett(x + 0.5, y + 0.5, w - 1, h - 1, 14, fill="#FFFFFF", stroke="#E6EBF5", sw=1, id=f"{i}-fondo",
               filtro=t.ombra(2, 10, "#1C6EFD", 0.08))
        s = h * 0.55
        ix, iy = x + 14, y + (h - s) / 2
        t.rett(ix, iy, s, s, 11, fill="#E8F0FE", id=f"{i}-icona-fondo")
        # tre barre crescenti (statistiche)
        bw, base = s * 0.15, iy + s * 0.76
        for k, hh in enumerate((0.20, 0.34, 0.50)):
            t.rett(ix + s * 0.26 + k * s * 0.22, base - s * hh, bw, s * hh, bw / 2, fill="#1C6EFD", id=f"{i}-icona-barra-{k + 1}")
        tx = ix + s + 13
        t.testo(titolo, tx, y + h / 2 - 3, 14.5, 700, INK, id=f"{i}-titolo")
        t.testo(sotto, tx, y + h / 2 + 15, 12.2, 400, "#5B6785", id=f"{i}-sottotitolo")
        cx = x + w - 22
        t.path(f"M{n(cx - 3.4)} {n(y + h / 2 - 7)}L{n(cx + 3.4)} {n(y + h / 2)}L{n(cx - 3.4)} {n(y + h / 2 + 7)}", stroke="#27345A", sw=2, id=f"{i}-chevron")
    return w, h


# ------------------------------------------------------------------------------------------ misuratore 82 %
GAUGE = {
    "blu": dict(da=164, amp=212, R=92, sp=26, grad=("#4B8EFF", "#1F6BFD"), vuoto="#E8EDF6", pomello="#F59E0B", pomello_chiaro="#FBBF24", testo=INK, alone=False),
    "rosso": dict(da=164, amp=212, R=92, sp=24, grad=("#F87171", "#E11D2B"), vuoto="#EEF0F4", pomello="#E5252F", pomello_chiaro="#F0545B", testo="#E5252F", alone=False),
    "luminoso": dict(da=164, amp=212, R=92, sp=26, grad=("#5B9BFF", "#1F63F5"), vuoto="#E6ECF8", pomello="#F97316", pomello_chiaro="#FDBA3B", testo=INK, alone=True),
}


def misuratore(t, x, y, kit="blu", valore=0.82, id=None, etichetta=None):
    """Arco di 212° aperto in basso, pieno fino al valore vero con il pomello sull'estremità del pieno
    (nell'immagine 17 l'arco pieno si fermava a metà e il pomello stava altrove: corretto)."""
    G = GAUGE[kit]
    R, sp = G["R"], G["sp"]
    W, H = 2 * R + sp + 12, R + R * abs(math.sin(math.radians(G["da"] - 180))) + sp + 12
    cx, cy = x + W / 2, y + R + sp / 2 + 6
    i = id or "misuratore"

    def pt(g):
        return cx + R * math.cos(math.radians(g)), cy + R * math.sin(math.radians(g))

    def arco(v0, v1):
        a0, a1 = G["da"] + G["amp"] * v0, G["da"] + G["amp"] * v1
        (x0, y0), (x1, y1) = pt(a0), pt(a1)
        grande = 1 if (a1 - a0) > 180 else 0
        return f"M{n(x0)} {n(y0)}A{R} {R} 0 {grande} 1 {n(x1)} {n(y1)}"

    with t.gruppo(i):
        if G["alone"]:
            bg = t.radiale([(0, "#DDE8FD", 0.9), (1, "#EEF3FE", 0)], 0.5, 0.5, 0.5)
            t.ellisse(cx, cy - 4, R * 1.28, R * 1.12, fill=bg, id=f"{i}-lucentezza")
        t.path(arco(0, 1), stroke=G["vuoto"], sw=sp, id=f"{i}-fondo")
        g = t.sfumatura(list(G["grad"]), cx - R, 0, cx + R, 0, userspace=True)
        t.path(arco(0, valore), stroke=g, sw=sp, id=f"{i}-valore")
        px, py = pt(G["da"] + G["amp"] * valore)
        if G["alone"]:
            ra = t.radiale([(0, "#FFB547", 0.55), (1, "#FFB547", 0)], 0.5, 0.5, 0.5)
            t.cerchio(px, py, sp * 1.7, fill=ra, id=f"{i}-bagliore")
        t.cerchio(px, py, sp * 0.62, fill="#FFFFFF", id=f"{i}-pomello-anello", filtro=t.ombra(1.5, 5, G["pomello"], 0.35))
        gp = t.sfumatura([G["pomello_chiaro"], G["pomello"]], 0, 0, 0, 1)
        t.cerchio(px, py, sp * 0.45, fill=gp, id=f"{i}-pomello")
        txt = f"{round(valore * 100)}%"
        corpo = fit("82%", 82, 800)
        t.testo(txt, cx, cy + corpo * 0.34, corpo, 800, G["testo"], "middle", id=f"{i}-valore-testo")
    return W, H


# ------------------------------------------------------------------------------------------ campioni di colore
def campione(t, x, y, nome, esadecimale, w=92, h=43, r=9, corpo_nome=12.4, id=None, bordo=None, altezza_etichette=40, peso_nome=400,
             colore_nome="#5E6E8E"):
    """Rettangolo arrotondato con nome e HEX sotto. Il colore è quello scritto nell'immagine (non quello, falsato dal jpeg, dei pixel)."""
    i = id or "campione-" + nome.lower().replace("/", "-").replace(" ", "-")
    chiaro = sum(int(esadecimale[k:k + 2], 16) for k in (1, 3, 5)) > 690
    with t.gruppo(i):
        t.rett(x, y, w, h, r, fill=esadecimale, id=f"{i}-colore", stroke=bordo or ("#E3E8F2" if chiaro else None), sw=1,
               filtro=t.ombra(2, 7, esadecimale, 0.16) if not chiaro else None)
        t.testo(nome, x, y + h + corpo_nome * 1.55, corpo_nome, peso_nome, colore_nome, id=f"{i}-nome")
        t.testo(esadecimale, x, y + h + corpo_nome * 1.55 + corpo_nome * 1.45, corpo_nome, 400, colore_nome, id=f"{i}-esadecimale")
    return w, h + altezza_etichette


# ------------------------------------------------------------------------------------------ salvataggio componenti singoli
def componente_svg(percorso, fn, pad=14, minimo=(0, 0), fondo=None, id="componente"):
    """Disegna `fn(t, pad, pad)` su una Tela trasparente grande quanto serve e salva. fn restituisce (w, h)."""
    prova = Tela(1200, 800, fondo=None, id=id)
    w, h = fn(prova, pad, pad)
    W, H = max(w, minimo[0]) + 2 * pad, max(h, minimo[1]) + 2 * pad
    t = Tela(W, H, fondo=fondo, id="componente-" + id)
    fn(t, pad, pad)
    return t.salva(percorso)


# ------------------------------------------------------------------------------------------ tela con glifi condivisi
class TelaCompatta(Tela):
    """Come Tela, ma ogni lettera (per peso) è definita una volta sola in <defs> e riusata con <use>: i fogli con
    centinaia di parole stanno sotto i 300 KB. Niente <text>: i glifi restano tracciati di Inter."""

    def __init__(self, *a, **k):
        super().__init__(*a, **k)
        self._glifi: dict = {}

    def _glifo(self, peso: int, carattere: str):
        from fontTools.pens.svgPathPen import SVGPathPen
        from fontTools.pens.transformPen import TransformPen
        pw = U._peso(peso)
        _, gs, cmap, upm = U._font(pw)
        g = cmap.get(ord(carattere), cmap[ord("?")])
        chiave = (pw, g)
        if chiave not in self._glifi:
            pen = SVGPathPen(gs, ntos=lambda v: str(int(round(v))))
            gs[g].draw(TransformPen(pen, (1, 0, 0, -1, 0, 0)))
            d = pen.getCommands()
            gid = f"{self.id}-gl{pw}-{g}"
            self._glifi[chiave] = (gid if d else None, gs[g].width)
            if d:
                self.defs.append(f'<path id="{gid}" d="{d}"/>')
        return self._glifi[chiave], upm

    def testo(self, testo, x, y, dimensione, peso=400, colore=INK, ancora="start", id=None, spaziatura=0.0, opacita=None):
        tot = larghezza_testo(testo, dimensione, peso, spaziatura)
        cx = x - tot / 2 if ancora == "middle" else x - tot if ancora == "end" else x
        usi = []
        for c in testo:
            (gid, adv), upm = self._glifo(peso, c)
            s = dimensione / upm
            if gid:
                usi.append(f'<use href="#{gid}" transform="translate({n(cx)} {n(y)}) scale({s:.5f})"/>')
            cx += adv * s + spaziatura
        a = f' id="{id}"' if id else ""
        a += f' opacity="{n(opacita)}"' if opacita is not None else ""
        self.add(f'<g fill="{colore}"{a}>{"".join(usi)}</g>')
        return tot
