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
        t.path(f"M{p(-7, -19.2)}L{p(0, -22)}L{p(7, -19.2)}L{p(7, 7.2)}L{p(0, 10)}L{p(-7, 7.2)}z", fill="#F23A45", id="nastro-sopra")
        t.path(f"M{p(-7, 7.2)}L{p(0, 10)}L{p(0, 54)}L{p(-7, 51.2)}z", fill="#E8242F", id="nastro-fronte-sinistro")
        t.path(f"M{p(0, 10)}L{p(7, 7.2)}L{p(7, 51.2)}L{p(0, 54)}z", fill="#CF1B27", id="nastro-fronte-destro")
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
