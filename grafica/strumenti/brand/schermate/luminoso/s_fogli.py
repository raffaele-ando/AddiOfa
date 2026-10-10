"""
Fogli: Quiz / Test (16.023, 17.023), Superamento (16.029, 17.027), Mancato superamento (16.034, 17.037/38).

Un foglio è un rettangolo arrotondato in un gruppo ruotato (tutto ciò che sta sul foglio ha la stessa inclinazione:
nell'originale le righe e i quadratini erano storti ognuno per conto suo), righe di testo come barre tonde, quadratini
tutti uguali con passo costante, lettere vere (Inter) e spunta/croce disegnate. Il bagliore caldo esce dai lati.
"""
from __future__ import annotations

import math
from comune import Scena, V, lineare, n, p, salva, arrotondato
from oggetti_a import barra, spunta, croce, testo, rettangolo, distintivo  # noqa: E402


def foglio(S: Scena, nome: str, c: V, w: float, h: float, gradi: float, r: float = 10, piega: float = 0, ombra: bool = True,
           toni: tuple | None = None) -> tuple[str, str]:
    """Apre il gruppo ruotato del foglio: restituisce (apertura, chiusura) da mettere attorno al contenuto in coordinate locali
    (origine al centro del foglio, x a destra, y in basso). Disegna ombra, spessore e faccia."""
    s = S.s
    x0, y0 = -w / 2, -h / 2
    if piega:
        pts = [V(x0, y0), V(x0 + w - piega, y0), V(x0 + w, y0 + piega), V(x0 + w, y0 + h), V(x0, y0 + h)]
        rr = [r, 2, r * 0.5, r, r]
        forma = arrotondato(pts, rr)
    else:
        forma = rettangolo(x0, y0, w, h, r)
    t = toni or ("#FFFFFF", s["carta"], "#E7EEFD" if S.luminoso else "#EDF2FD", s["carta_bordo"])
    S.d(lineare(f"{nome}-luce", V(0, y0), V(0, y0 + h), [(0, t[0]), (0.5, t[1]), (1, t[2])]))
    ap = f'<g id="{nome}" transform="translate({n(c.x)} {n(c.y)}) rotate({n(gradi)})">'
    ap += (f'<path id="{nome}-spessore" d="{forma}" transform="translate(1.6 2.4)" fill="{t[3]}"/>'
           f'<path id="{nome}-faccia" d="{forma}" fill="url(#{nome}-luce)" stroke="#FFFFFF" stroke-width="1.2" stroke-opacity="0.9"/>')
    return ap, "</g>"


def quiz(stile="luminoso") -> Scena:
    lum = stile == "luminoso"
    W, H = (196, 168) if lum else (176, 160)
    S = Scena("Quiz / Test", W, H, stile)
    s = S.s
    if lum:
        S.nuvola(["M6 70 C4 26 40 8 100 8 C160 8 194 24 192 78 C190 130 170 164 110 166 C50 168 8 150 6 110 Z"])
        S.alone("alone-sinistro", 14, 118, 40, 34, 0.55)
        S.alone("alone-destro", 178, 118, 36, 34, 0.5)
        S.ombra("ombra", 84, 163, 52, 3, 0.16)
        c, w, h, g = V(99.5, 88.5), 116.3, 128, 12.4
        righe = [(49, 24), (46, 23), (43, 22)]
    else:
        S.nuvola(["M4 70 C2 26 30 6 90 6 C150 6 174 22 172 78 C170 130 150 158 100 158 C46 158 6 142 4 106 Z"])
        S.ombra("ombra", 88, 157, 50, 3, 0.12)
        c, w, h, g = V(83, 84), 102, 150, 9
        righe = [(46, 22), (42, 20), (38, 20)]
        # secondo foglio dietro, a sinistra, più chiaro
        ap, ch = foglio(S, "foglio-dietro", V(50, 88), 70, 146, 5, 10)
        S.c(ap + ch)
    ap, ch = foglio(S, "foglio", c, w, h, g, 10)
    contenuto = []
    passo = 39 if lum else 40
    dx = -30 if lum else -27
    caselle = [("A", (s["blu"], "#1E4FC9")), ("✓", ("#2A64DF", "#1A47B8")), ("C", ("#8FAAEE", "#7B98E4"))] if lum else \
              [("A", ("#2F7BF6", "#1D5FDB")), ("B", ("#FF4B4B", "#E52929")), ("C", ("#9DBBF8", "#86A8F3"))]
    lato = 27 if lum else 27
    for i, (sim, (c1, c2)) in enumerate(caselle):
        cy = (i - 1) * passo
        S.d(lineare(f"casella-{i + 1}-luce", V(dx, cy - lato / 2), V(dx, cy + lato / 2), [(0, c1), (1, c2)]))
        contenuto.append(f'<g id="casella-{i + 1}"><rect x="{n(dx - lato / 2 - 1.2)}" y="{n(cy - lato / 2 - 1.2)}" width="{n(lato + 2.4)}" height="{n(lato + 2.4)}" rx="7.2" fill="#FFFFFF" opacity="0.85"/>'
                         f'<rect x="{n(dx - lato / 2)}" y="{n(cy - lato / 2)}" width="{n(lato)}" height="{n(lato)}" rx="6" fill="url(#casella-{i + 1}-luce)"/>'
                         f'<path d="M{n(dx - lato / 2 + 4)} {n(cy - lato / 2 + 1.2)} H{n(dx + lato / 2 - 4)}" stroke="#FFFFFF" stroke-opacity="0.35" stroke-width="1" stroke-linecap="round"/>')
        if sim == "✓":
            contenuto.append(f'<path d="{spunta(V(dx, cy), 8.2)}" stroke="#FFFFFF" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>')
        else:
            contenuto.append(testo(f"lettera-{sim}", sim, 700, 17, dx, cy + 6.2, "#FFFFFF"))
        contenuto.append("</g>")
        # righe di testo: una lunga e una corta, la seconda e la terza più chiare (prospettiva dell'originale)
        lung, cort = righe[i]
        op = (0.95, 0.7, 0.55)[i] if lum else (1, 1, 1)[i]
        col = s["righe"]
        x0 = dx + lato / 2 + 14
        contenuto.append(barra(f"riga-{i + 1}-lunga", V(x0, cy - 10), V(x0 + lung, cy - 10), 7, col, op))
        contenuto.append(barra(f"riga-{i + 1}-corta", V(x0 - 2, cy + 7), V(x0 - 2 + cort, cy + 7), 7, col, op))
    S.c(ap + "".join(contenuto) + ch)
    return S


def righe_foglio(nome: str, righe, col: str, spessore: float = 6.5) -> str:
    """righe = [(x0, x1, y, opacita)] in coordinate del foglio."""
    return "".join(barra(f"{nome}-riga-{i + 1}", V(x0, y), V(x1, y), spessore, col, op) for i, (x0, x1, y, op) in enumerate(righe))


def documento_badge(stile: str, titolo: str, esito: str) -> Scena:
    """Foglio con righe di testo, uno o due fogli dietro e il distintivo tondo (✓ verde o ✕ rosso) in basso a destra."""
    lum = stile == "luminoso"
    ok = esito == "ok"
    s_ = None
    if ok:
        W, H = (206, 178) if lum else (204, 160)
    else:
        W, H = (160, 132) if lum else (150, 130)
    S = Scena(titolo, W, H, stile)
    s = S.s
    verde = ("#86E8A8", "#1FB866", "#087A48") if lum else ("#46E08A", "#22C55E", "#17A34A")
    rosso = ("#FF9A5A", "#EF3B2D", "#CC1F28") if lum else ("#FF7068", "#F5403B", "#E02B2B")
    righe_c = s["righe"]
    if ok and lum:
        S.nuvola(["M8 100 C4 40 50 8 110 8 C170 8 202 36 200 96 C198 150 160 172 100 172 C40 172 10 150 8 100 Z"])
        S.alone("alone-sinistro", 28, 76, 50, 46, 0.7, "#FFC98A", "#FFAE5A")
        S.alone("alone-basso", 130, 168, 60, 14, 0.8)
        S.ombra("ombra", 100, 171, 62, 3, 0.16)
        # foglio dietro a destra (più scuro), foglio dietro a sinistra inclinato, foglio davanti
        ap, ch = foglio(S, "foglio-destra", V(158, 80), 46, 112, 4, 9, toni=("#9DB6F4", "#86A3EE", "#7C9AEA", "#6F8EE3")); S.c(ap + righe_foglio("fd", [(-12, 8, -24, 0.9), (-12, 8, -6, 0.9)], "#5B7EDD", 5) + ch)
        ap, ch = foglio(S, "foglio-sinistra", V(47, 112), 66, 100, -22, 10, toni=("#EDF2FD", "#DCE6FB", "#C9D8F8", "#B8CBF4"))
        S.c(ap + righe_foglio("fs", [(-20, 14, -30, 0.9), (-20, 16, -14, 0.9), (-20, 10, 2, 0.9), (-20, 6, 18, 0.9)], "#8CA8EC", 6) + ch)
        c, w, h, g = V(105, 99), 90, 140, -2
        fo = [(-29, 31, -41, 0.95), (-29, 32, -24, 0.95), (-29, 32, -7, 0.95), (-29, 8, 10, 0.95), (-29, 9, 27, 0.95), (-29, -1, 44, 0.95)]
        bad = (156, 121, 30)
        S.alone("alone-front", 100, 160, 56, 18, 0.7)
    elif ok:
        S.nuvola(["M8 90 C4 36 40 10 104 8 C160 6 200 30 198 90 C196 140 160 156 100 156 C40 156 10 140 8 90 Z"])
        S.ombra("ombra", 100, 156, 56, 3, 0.1)
        ap, ch = foglio(S, "foglio-sinistra", V(44, 96), 62, 104, -20, 9, toni=("#D8E4FC", "#C6D8FB", "#B7CCF8", "#B0C6F6"))
        S.c(ap + righe_foglio("fs", [(-18, 12, -26, 0.9), (-18, 14, -11, 0.9), (-18, 8, 4, 0.9), (-18, 4, 19, 0.9)], "#7FA2F0", 6) + ch)
        c, w, h, g = V(124, 82), 96, 140, -2.5
        fo = [(-26, 30, -42, 1), (-26, 30, -25, 1), (-26, 14, -8, 1), (-26, 4, 9, 0.9), (-26, 6, 25, 0.9), (-26, -5, 41, 0.9)]
        bad = (150, 114, 31)
    elif lum:
        S.nuvola(["M6 70 C4 26 36 6 82 6 C128 6 156 24 156 70 C156 112 130 128 80 128 C30 128 8 112 6 70 Z"])
        S.alone("alone-alto", 100, 24, 40, 28, 0.9, "#FFD9A0", "#FFC27A")
        S.alone("alone-sinistro", 20, 112, 30, 24, 0.55)
        S.ombra("ombra", 70, 128, 50, 3, 0.14)
        ap, ch = foglio(S, "foglio-destra", V(114, 54), 34, 64, 5, 8, toni=("#FFEFD8", "#FFE2C0", "#FFD6A8", "#F6C795")); S.c(ap + ch)
        c, w, h, g = V(63, 68), 72, 100, 10
        fo = [(-20, 18, -27, 1), (-22, 18, -9, 1), (-24, 12, 9, 1), (-24, 2, 27, 1)]
        bad = (115, 91, 29)
    else:
        S.nuvola(["M6 66 C4 24 34 6 78 6 C122 6 146 24 146 66 C146 108 124 124 76 124 C28 124 8 108 6 66 Z"])
        S.ombra("ombra", 70, 125, 46, 3, 0.1)
        ap, ch = foglio(S, "foglio-destra", V(110, 56), 34, 70, 4, 8, toni=("#F4F7FF", "#E6EDFD", "#DCE6FB", "#D3DFFA")); S.c(ap + ch)
        c, w, h, g = V(66, 66), 74, 100, 4
        fo = [(-22, 20, -28, 1), (-24, 20, -10, 1), (-24, 12, 8, 1), (-24, 0, 26, 1)]
        bad = (100, 90, 29)
    ap, ch = foglio(S, "foglio", c, w, h, g, 9)
    cont = righe_foglio("testo", fo, righe_c if not lum else "#B3C6F6", 6.5)
    if ok:
        cont += barra("riga-alta", V(c.x * 0 + 14, -55), V(36, -55), 4, righe_c, 0.9) if False else ""
    S.c(ap + cont + ch)
    bx, by, br = bad
    d, cc = distintivo("distintivo", V(bx, by), br, verde if ok else rosso, "spunta" if ok else "croce", bordo=2.4, spessore_segno=br * 0.26)
    S.d(d); S.c(cc)
    if lum:
        S.alone("alone-distintivo", bx - 8, by + 24, 36, 14, 0.6, "#FFB347", "#FF9A2E")
    return S


def superamento(stile="luminoso") -> Scena:
    return documento_badge(stile, "Superamento", "ok")


def mancato(stile="luminoso") -> Scena:
    return documento_badge(stile, "Mancato superamento", "no")


if __name__ == "__main__":
    for st in ("luminoso", "vivo"):
        print(salva("quiz-test", quiz(st)))
        print(salva("superamento", superamento(st)))
        print(salva("mancato-superamento", mancato(st)))
