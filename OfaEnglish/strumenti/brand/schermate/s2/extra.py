"""s2 · illustrazioni e glifi disegnati a mano che i kit non hanno (guida con spunta, utenti con +, regalo, pallini social...).
Tutto in px locali del ritaglio come comuni.py."""
from comuni import *
import math


def blob(t, cx, cy, rx, ry, fondo="#EEF3FD", id="alone"):
    t.ellisse(t.p(cx), t.p(cy), t.p(rx), t.p(ry), fill=t.radiale([(0, fondo, 1), (0.8, fondo, 0.9), (1, fondo, 0)], 0.5, 0.5, 0.5), id=id)


def guida_spunta(t, cx, cy, s=1.0, id="illustrazione-guida"):
    """Foglio con righe e tondo verde con spunta (guida gratuita)."""
    with t.gruppo(id):
        blob(t, cx, cy + 6 * s, 80 * s, 52 * s)
        with t.gruppo("foglio-dietro", trasforma=f"rotate(-7 {n(t.p(cx - 12 * s))} {n(t.p(cy))})"):
            R(t, cx - 52 * s, cy - 42 * s, 64 * s, 88 * s, 8 * s, "#DCE5F8", id="foglio-dietro-fondo")
        R(t, cx - 36 * s, cy - 48 * s, 76 * s, 98 * s, 8 * s, "#FFFFFF", id="foglio-davanti", filtro=ombra(t, 3 * s, 12 * s, "#3B64C8", 0.14))
        for i, (w, y) in enumerate(((42, -30), (24, -16), (42, 0), (22, 14))):
            R(t, cx - 24 * s, cy + y * s - 2.4 * s, w * s, 5 * s, 2.5 * s, "#D3DEF4", id=f"riga-{i + 1}")
        C(t, cx + 36 * s, cy + 18 * s, 19 * s, t.sfumatura(["#37CC72", "#1CA851"]), id="tondo-verde", filtro=ombra(t, 3 * s, 8 * s, "#16A34A", 0.25))
        I(t, "spunta", cx + 36 * s, cy + 18 * s, 20 * s, "#FFFFFF", 3.4)


def utenti_piu(t, cx, cy, s=1.0, id="illustrazione-utenti"):
    """Due sagome blu (amici) con tondo rosso e +."""
    with t.gruppo(id):
        blob(t, cx, cy, 70 * s, 40 * s, "#EAF1FD")
        for dx, dy, col in ((-20, 0, "#3F7FEA"), (14, -8, "#2F6FE0")):
            C(t, cx + dx * s, cy + (dy - 15) * s, 14 * s, col, id="testa")
            t.path(f"M{n(t.p(cx + (dx - 28) * s))} {n(t.p(cy + (dy + 28) * s))}C{n(t.p(cx + (dx - 28) * s))} {n(t.p(cy + (dy + 4) * s))} {n(t.p(cx + (dx + 28) * s))} {n(t.p(cy + (dy + 4) * s))} {n(t.p(cx + (dx + 28) * s))} {n(t.p(cy + (dy + 28) * s))}z", fill=col, id="busto")
        C(t, cx + 40 * s, cy + 3 * s, 15 * s, "#EE2D3A", id="tondo-piu", filtro=ombra(t, 2 * s, 6 * s, "#E11D2B", 0.28))
        R(t, cx + 40 * s - 7.5 * s, cy + 3 * s - 1.8 * s, 15 * s, 3.6 * s, 1.8 * s, "#FFFFFF")
        R(t, cx + 40 * s - 1.8 * s, cy + 3 * s - 7.5 * s, 3.6 * s, 15 * s, 1.8 * s, "#FFFFFF")


def regalo(t, cx, cy, s=1.0, id="illustrazione-regalo"):
    """Scatola regalo bianca con nastro rosso verticale e fiocco, in assonometria."""
    with t.gruppo(id):
        t.ellisse(t.p(cx), t.p(cy + 54 * s), t.p(50 * s), t.p(7 * s), fill="#F2B9BE", opacita=0.45, id="ombra-suolo")
        p = lambda x, y: f"{n(t.p(cx + x * s))} {n(t.p(cy + y * s))}"
        t.path(f"M{p(-40, -6)}L{p(0, 10)}L{p(0, 54)}L{p(-40, 38)}z", fill="#F6E9EA", id="faccia-sinistra")
        t.path(f"M{p(0, 10)}L{p(40, -6)}L{p(40, 38)}L{p(0, 54)}z", fill="#EAD3D6", id="faccia-destra")
        t.path(f"M{p(-40, -6)}L{p(0, -22)}L{p(40, -6)}L{p(0, 10)}z", fill="#FCF6F6", id="coperchio")
        t.path(f"M{p(-9, -18.4)}L{p(0, -22)}L{p(9, -18.4)}L{p(9, 6.4)}L{p(0, 10)}L{p(-9, 6.4)}z", fill="#F23A45", id="nastro-sopra")
        t.path(f"M{p(-9, 6.4)}L{p(0, 10)}L{p(0, 54)}L{p(-9, 50.4)}z", fill="#E8242F", id="nastro-fronte-sinistro")
        t.path(f"M{p(0, 10)}L{p(9, 6.4)}L{p(9, 50.4)}L{p(0, 54)}z", fill="#CF1B27", id="nastro-fronte-destro")
        t.path(f"M{p(0, -22)}C{p(-26, -52)} {p(-44, -30)} {p(-16, -22)}C{p(-8, -20)} {p(-3, -21)} {p(0, -22)}z", fill="#EE2D3A", id="fiocco-sinistro")
        t.path(f"M{p(0, -22)}C{p(26, -52)} {p(44, -30)} {p(16, -22)}C{p(8, -20)} {p(3, -21)} {p(0, -22)}z", fill="#F5535C", id="fiocco-destro")
        C(t, cx, cy - 23 * s, 5.5 * s, "#D81F2B", id="nodo")


def coriandoli(t, punti, id="coriandoli"):
    """punti: (x, y, lunghezza, angolo, colore): capsule colorate."""
    with t.gruppo(id):
        for i, (x, y, l, a, col) in enumerate(punti):
            t.add(f'<rect x="{n(t.p(x - l / 2))}" y="{n(t.p(y - l * 0.18))}" width="{n(t.p(l))}" height="{n(t.p(l * 0.36))}" rx="{n(t.p(l * 0.18))}" '
                  f'fill="{col}" transform="rotate({n(a)} {n(t.p(x))} {n(t.p(y))})" id="coriandolo-{i + 1}"/>')


def marchio_whatsapp(t, cx, cy, r):
    R(t, cx - r, cy - r, 2 * r, 2 * r, r * 0.45, t.sfumatura(["#3EDC6C", "#1FB84F"]), id="whatsapp-fondo")
    C(t, cx, cy - r * 0.04, r * 0.52, "none", stroke="#FFFFFF", sw=r * 0.17)
    t.path(f"M{n(t.p(cx - r * 0.45))} {n(t.p(cy + r * 0.62))}L{n(t.p(cx - r * 0.38))} {n(t.p(cy + r * 0.28))}L{n(t.p(cx - r * 0.12))} {n(t.p(cy + r * 0.5))}z", fill="#FFFFFF")
    t.path(f"M{n(t.p(cx - r * 0.2))} {n(t.p(cy - r * 0.2))}C{n(t.p(cx - r * 0.2))} {n(t.p(cy + r * 0.1))} {n(t.p(cx + r * 0.1))} {n(t.p(cy + r * 0.28))} {n(t.p(cx + r * 0.28))} {n(t.p(cy + r * 0.2))}", stroke="#FFFFFF", sw=r * 0.2, cap="round")


def marchio_instagram(t, cx, cy, r):
    R(t, cx - r, cy - r, 2 * r, 2 * r, r * 0.45, t.sfumatura(["#F9A93B", "#E8366B", "#8B3FD1"], 0, 1, 1, 0), id="instagram-fondo")
    R(t, cx - r * 0.55, cy - r * 0.55, r * 1.1, r * 1.1, r * 0.34, "none", stroke="#FFFFFF", sw=r * 0.16)
    C(t, cx, cy, r * 0.27, "none", stroke="#FFFFFF", sw=r * 0.16)
    C(t, cx + r * 0.34, cy - r * 0.34, r * 0.07, "#FFFFFF")


def marchio_messaggi(t, cx, cy, r):
    R(t, cx - r, cy - r, 2 * r, 2 * r, r * 0.45, t.sfumatura(["#4BDD6F", "#26B84C"]), id="messaggi-fondo")
    t.ellisse(t.p(cx), t.p(cy - r * 0.05), t.p(r * 0.58), t.p(r * 0.46), fill="#FFFFFF")
    t.path(f"M{n(t.p(cx - r * 0.3))} {n(t.p(cy + r * 0.3))}L{n(t.p(cx - r * 0.5))} {n(t.p(cy + r * 0.68))}L{n(t.p(cx + r * 0.05))} {n(t.p(cy + r * 0.38))}z", fill="#FFFFFF")


# ---------------------------------------------------------------------------- scene vettoriali (al posto delle fotografie)
import random as _rnd


def _clip(t, x, y, w, h, r, r_angoli=None):
    cid = t.uid("cs")
    if r_angoli:
        tl, tr, br, bl = r_angoli
        d = (f"M{n(t.p(x + tl))} {n(t.p(y))}H{n(t.p(x + w - tr))}A{n(t.p(tr))} {n(t.p(tr))} 0 0 1 {n(t.p(x + w))} {n(t.p(y + tr))}V{n(t.p(y + h - br))}"
             f"A{n(t.p(br))} {n(t.p(br))} 0 0 1 {n(t.p(x + w - br))} {n(t.p(y + h))}H{n(t.p(x + bl))}A{n(t.p(bl))} {n(t.p(bl))} 0 0 1 {n(t.p(x))} {n(t.p(y + h - bl))}"
             f"V{n(t.p(y + tl))}A{n(t.p(tl))} {n(t.p(tl))} 0 0 1 {n(t.p(x + tl))} {n(t.p(y))}z")
        t.defs.append(f'<clipPath id="{cid}"><path d="{d}"/></clipPath>')
    else:
        t.defs.append(f'<clipPath id="{cid}"><rect x="{n(t.p(x))}" y="{n(t.p(y))}" width="{n(t.p(w))}" height="{n(t.p(h))}" rx="{n(t.p(r))}"/></clipPath>')
    return cid


def scena(t, nome, x, y, w, h, r=12, id=None, r_angoli=None):
    """Illustrazione di sfondo per le copertine (sostituisce le fotografie dell'originale): 'pianeta', 'persone', 'agora',
    'evento', 'citta', 'orb', 'scuro'. Tutto vettoriale, ritagliato nel riquadro arrotondato."""
    rnd = _rnd.Random(sum(map(ord, nome)) + int(w))
    cid = _clip(t, x, y, w, h, r, r_angoli)
    t.add(f'<g id="{id or "scena-" + nome}" clip-path="url(#{cid})">')
    if nome == "pianeta":
        R(t, x, y, w, h, 0, t.sfumatura(["#020718", "#06173F", "#0A2C78"], 0, 0, 0.3, 1), id="cielo")
        for _ in range(int(w * h / 90)):
            C(t, x + rnd.random() * w, y + rnd.random() * h * 0.7, rnd.random() * 0.55 + 0.15, "#FFFFFF", opacita=rnd.random() * 0.7 + 0.2)
        cx, cy, rr = x + w * 0.78, y + h * 1.18, w * 0.78
        C(t, cx, cy, rr * 1.05, t.radiale([(0.9, "#3B8CFF", 0.5), (1, "#3B8CFF", 0)], 0.5, 0.5, 0.5), id="alone-pianeta")
        C(t, cx, cy, rr, t.radiale([(0, "#051A57", 1), (0.85, "#0B3A9A", 1), (1, "#3F95FF", 1)], 0.5, 0.5, 0.5), id="pianeta")
        for _ in range(int(w * h / 55)):
            a = rnd.random() * math.pi * 2
            d = rr * (0.45 + 0.5 * rnd.random())
            px, py = cx + d * math.cos(a), cy + d * math.sin(a)
            if y <= py <= y + h and x <= px <= x + w and py < cy - rr * 0.35:
                C(t, px, py, rnd.random() * 0.5 + 0.2, "#FFD27A", opacita=rnd.random() * 0.6 + 0.3)
    elif nome == "persone":
        R(t, x, y, w, h, 0, t.sfumatura(["#0C3D33", "#16624F", "#2B8068"], 0, 0, 1, 1), id="sfondo")
        for k_, (dx, sc, col) in enumerate(((0.58, 0.9, "#0A2B24"), (0.74, 1.05, "#0F3A31"), (0.9, 0.85, "#134A3E"))):
            cx = x + w * dx
            C(t, cx, y + h * 0.40, h * 0.11 * sc, col, opacita=0.8)
            t.path(f"M{n(t.p(cx - h * 0.2 * sc))} {n(t.p(y + h))}C{n(t.p(cx - h * 0.2 * sc))} {n(t.p(y + h * 0.6))} {n(t.p(cx + h * 0.2 * sc))} {n(t.p(y + h * 0.6))} {n(t.p(cx + h * 0.2 * sc))} {n(t.p(y + h))}z", fill=col, opacita=0.8)
    elif nome == "agora":
        R(t, x, y, w, h, 0, t.sfumatura(["#3A1709", "#8A3A14", "#E58A3A"], 0, 0, 1, 1), id="sfondo")
        for k_ in range(5):
            cx = x + w * (0.46 + k_ * 0.1)
            R(t, cx - h * 0.04, y + h * 0.28, h * 0.08, h * 0.72, 0, "#C86A2A", opacita=0.55)
            R(t, cx - h * 0.065, y + h * 0.24, h * 0.13, h * 0.05, 1, "#E09A55", opacita=0.6)
        R(t, x + w * 0.4, y + h * 0.2, w * 0.58, h * 0.04, 0, "#E09A55", opacita=0.5)
        C(t, x + w * 0.82, y + h * 0.78, h * 0.08, "#2A1208", opacita=0.7)
        R(t, x + w * 0.79, y + h * 0.82, w * 0.06, h * 0.2, 4, "#2A1208", opacita=0.7)
    elif nome == "evento":
        R(t, x, y, w, h, 0, t.sfumatura(["#140C14", "#3A2118", "#7A4524"], 0, 0, 0, 1), id="sfondo")
        for _ in range(7):
            C(t, x + rnd.random() * w, y + rnd.random() * h * 0.6, h * (0.08 + rnd.random() * 0.12), t.radiale([(0, "#FFB35C", 0.8), (1, "#FFB35C", 0)], 0.5, 0.5, 0.5))
        C(t, x + w * 0.5, y + h * 0.25, h * 0.2, t.radiale([(0, "#4A7DFF", 0.7), (1, "#4A7DFF", 0)], 0.5, 0.5, 0.5))
        for row in range(4):
            for i in range(14):
                px = x + (i + 0.5 * (row % 2)) * w / 13 + rnd.random() * 3
                py = y + h * (0.5 + 0.13 * row)
                col = ("#2A1812", "#1E110D", "#321F17")[(i + row) % 3]
                C(t, px, py, h * 0.045 + row * 0.5, col)
                t.path(f"M{n(t.p(px - h * 0.07))} {n(t.p(py + h * 0.2))}C{n(t.p(px - h * 0.07))} {n(t.p(py + h * 0.04))} {n(t.p(px + h * 0.07))} {n(t.p(py + h * 0.04))} {n(t.p(px + h * 0.07))} {n(t.p(py + h * 0.2))}z", fill=col)
    elif nome == "citta":
        R(t, x, y, w, h, 0, t.sfumatura(["#2B2F7A", "#8A5AA8", "#F0A06A"], 0, 0, 0, 1), id="sfondo")
        for i in range(7):
            bw = w * 0.13; bx = x + w * (0.4 + i * 0.09); bh = h * (0.25 + rnd.random() * 0.3)
            R(t, bx, y + h * 0.65 - bh, bw, bh + h, 0, "#2A2552", opacita=0.85)
        C(t, x + w * 0.3, y + h * 0.42, h * 0.1, "#18163A"); R(t, x + w * 0.16, y + h * 0.52, w * 0.28, h * 0.6, 8, "#18163A")
    elif nome == "orb":
        R(t, x, y, w, h, 0, t.radiale([(0, "#3A4DFF", 1), (0.5, "#1A24A8", 1), (1, "#070B3A", 1)], 0.5, 0.5, 0.75), id="sfondo")
        C(t, x + w / 2, y + h / 2, w * 0.3, "none", stroke="#6C8BFF", sw=0.8, opacita=0.7)
        C(t, x + w / 2, y + h / 2, w * 0.16, t.radiale([(0, "#FFFFFF", 1), (0.5, "#9DB8FF", 0.9), (1, "#4A5CFF", 0)], 0.5, 0.5, 0.5))
    else:
        R(t, x, y, w, h, 0, t.sfumatura(["#0B1B44", "#10295F"], 0, 0, 1, 1), id="sfondo")
        C(t, x + w * 0.82, y + h * 0.5, h * 0.4, "none", stroke="#2B4C8F", sw=h * 0.08, opacita=0.45)
        C(t, x + w * 0.82, y + h * 0.5, h * 0.16, "#2B4C8F", opacita=0.5)
    t.add("</g>")


def avatar_riga(t, cx, cy, r, nomi, passo=None):
    """File di piccoli avatar sovrapposti (partecipanti)."""
    passo = passo or r * 1.3
    for i, nm in enumerate(nomi):
        persona(t, nm, cx + i * passo, cy, r, bordo="#FFFFFF", id=f"partecipante-{i + 1}")


ui.ICONE.update({
    "esplora": [("c", (12, 12, 8.5)), ("p", "M15.600 8.400 13.400 13.400 8.400 15.600 10.600 10.600z")],
    "orologio-s": [("c", (12, 12, 8.5)), ("p", "M12 7.500v4.800l3 1.800")],
    "pin": [("p", "M12 21s6.500-5.800 6.500-11A6.500 6.500 0 0 0 5.500 10C5.500 15.200 12 21 12 21z"), ("c", (12, 10, 2.300))],
    "segnalibro-s": [("p", "M7.500 4h9a1 1 0 0 1 1 1v15l-5.500-3.700L6.500 20V5a1 1 0 0 1 1-1z")],
    "libretto": [("p", "M4 5.500h6a2 2 0 0 1 2 2V19a2 2 0 0 0-2-2H4zM20 5.500h-6a2 2 0 0 0-2 2V19a2 2 0 0 1 2-2h6z")],
    "esci": [("p", "M10 4H6.500A1.500 1.500 0 0 0 5 5.500v13A1.500 1.500 0 0 0 6.500 20H10M14 8l4 4-4 4M18 12H9.500")],
    "aiuto": [("c", (12, 12, 8.500)), ("p", "M9.700 9.800a2.400 2.400 0 1 1 3.400 2.200c-.7.400-1.100.9-1.100 1.700M12 16.600v.1")],
    "commenti": [("p", "M5 5h14a1.500 1.500 0 0 1 1.500 1.500v8A1.500 1.500 0 0 1 19 16h-7l-4.500 3.500V16H5a1.500 1.500 0 0 1-1.500-1.500v-8A1.500 1.500 0 0 1 5 5z")],
    "condividi-freccia": [("p", "M14 5l6 5-6 5V12c-5 0-8 1.500-10 5 .6-5.500 4-9 10-9.300z")],
})
