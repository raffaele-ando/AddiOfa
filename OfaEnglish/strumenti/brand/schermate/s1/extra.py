"""
Elementi che servono solo al funnel rosso e che ui.py non ha: logotipo con sigillo segnaposto, chip d'icona piene
(tondo pastello + glifo), marchi dei metodi di pagamento, coriandoli, busta, scudo.
Tutto in pixel del ritaglio (come componenti.py).
"""
from __future__ import annotations

import math

from componenti import *  # noqa
from componenti import n, larghezza_testo


# ---------------------------------------------------------------------------- glifi pieni (griglia 24)
GLIFI = {
    # libro aperto pieno, con il dorso chiaro al centro
    "libro": ('<path d="M12 6.6C9.9 5 6.8 4.6 3.2 5.1v13.2c3.6-.5 6.7-.1 8.8 1.5 2.1-1.600 5.200-2 8.800-1.500V5.100c-3.600-.5-6.700-.1-8.800 1.500z"/>'
              '<path d="M12 7.400v11.600" stroke="#FFFFFF" stroke-width="1.300" fill="none" stroke-linecap="round"/>'),
    "barre": ('<rect x="4.500" y="13.500" width="4.200" height="6.500" rx="1.100"/><rect x="9.900" y="9.200" width="4.200" height="10.800" rx="1.100"/>'
              '<rect x="15.300" y="4" width="4.200" height="16" rx="1.100"/>'),
    "fulmine": '<path d="M13.600 2.300 5.200 13.400h5.600l-1 8.300 8.800-11.700h-5.700z"/>',
    "lista": ('<circle cx="5.600" cy="7" r="1.600"/><circle cx="5.600" cy="12" r="1.600"/><circle cx="5.600" cy="17" r="1.600"/>'
              '<rect x="9.200" y="5.600" width="10.200" height="2.800" rx="1.400"/><rect x="9.200" y="10.600" width="10.200" height="2.800" rx="1.400"/>'
              '<rect x="9.200" y="15.600" width="10.200" height="2.800" rx="1.400"/>'),
    "documento": ('<path d="M6.400 2.800h7.200l4.800 4.800v11.600a2 2 0 0 1-2 2H6.400a2 2 0 0 1-2-2V4.800a2 2 0 0 1 2-2z"/>'
                  '<path d="M8.200 12.400h7.600M8.200 16.200h7.600" stroke="#FFFFFF" stroke-width="1.700" fill="none" stroke-linecap="round"/>'),
    "euro": ('<circle cx="12" cy="12" r="9.200"/>'
             '<path d="M15.800 8.800a4.600 4.600 0 1 0 0 6.400M7.800 11h5.600M7.800 13.200h5.600" stroke="#FFFFFF" stroke-width="1.700" fill="none" stroke-linecap="round"/>'),
    "lucchetto": ('<rect x="5" y="10.500" width="14" height="10.500" rx="2.400"/>'
                  '<path d="M8.200 10.500V8a3.800 3.800 0 0 1 7.600 0v2.500" stroke="currentColor" stroke-width="2.200" fill="none" stroke-linecap="round"/>'
                  '<circle cx="12" cy="15" r="1.500" fill="#FFFFFF"/>'),
    "calendario": ('<path d="M6 4.600h12a2.200 2.200 0 0 1 2.200 2.200v11.600a2.200 2.200 0 0 1-2.200 2.200H6a2.200 2.200 0 0 1-2.200-2.200V6.800A2.200 2.200 0 0 1 6 4.600z"/>'
                   '<path d="M3.800 10h16.400" stroke="#FFFFFF" stroke-width="1.500"/>'
                   '<rect x="7.400" y="2.400" width="2.200" height="4.200" rx="1.100"/><rect x="14.400" y="2.400" width="2.200" height="4.200" rx="1.100"/>'),
}


def glifo(t, nome: str, cx: float, cy: float, lato: float, colore: str):
    """Glifo pieno centrato in (cx,cy) (px del ritaglio), alto `lato` px."""
    k = t.s(lato) / 24
    corpo = GLIFI[nome].replace("currentColor", colore)
    t.add(f'<g transform="translate({n(t.X(cx) - 12 * k)} {n(t.Y(cy) - 12 * k)}) scale({n(k)})" fill="{colore}">{corpo}</g>')


def chip_icona(t, nome: str, cx: float, cy: float, r: float, fondo: str, colore: str, id: str | None = None, lato: float | None = None):
    """Tondo pastello con glifo pieno (IconaChip del kit rosso)."""
    with t.gruppo(id or f"icona-{nome}"):
        t.cerchio(t.X(cx), t.Y(cy), t.s(r), fill=t.sfumatura([fondo, fondo]), filtro=t.ombra(t.s(0.8), t.s(3), colore, 0.10))
        glifo(t, nome, cx, cy, lato or r * 1.05, colore)


# ---------------------------------------------------------------------------- logotipo con sigillo segnaposto
def logo_polimi(t, cx_sigillo: float, cy_sigillo: float, r: float, x_testo: float, y1: float, y2: float, corpo: float):
    """Nome «Politecnico di Milano» in tracciati + SEGNAPOSTO circolare neutro (il sigillo/stemma non si riproduce)."""
    X, Y, s = t.X, t.Y, t.s
    with t.gruppo("logo-politecnico"):
        with t.gruppo("sigillo-segnaposto"):
            t.cerchio(X(cx_sigillo), Y(cy_sigillo), s(r), fill="#FFFFFF", stroke="#8FA0B3", sw=s(1.1))
            t.cerchio(X(cx_sigillo), Y(cy_sigillo), s(r * 0.80), fill="#EEF2F6", stroke="#B4C0CE", sw=s(0.6))
            t.cerchio(X(cx_sigillo), Y(cy_sigillo), s(r * 0.34), fill="#C9D3DE")
        t.testo("POLITECNICO", X(x_testo), Y(y1), s(corpo), 800, "#1F2E4D", spaziatura=s(0.35), id="nome-politecnico")
        t.testo("DI MILANO", X(x_testo), Y(y2), s(corpo), 800, "#1F2E4D", spaziatura=s(0.35), id="nome-di-milano")


# ---------------------------------------------------------------------------- scudo con spunta (dati sicuri)
def scudo(t, cx: float, cy: float, h: float, colore: str = "#7389A8", id: str = "scudo"):
    k = t.s(h) / 24
    t.add(f'<g id="{id}" transform="translate({n(t.X(cx) - 12 * k)} {n(t.Y(cy) - 12 * k)}) scale({n(k)})">'
          f'<path d="M12 2.200 4.200 5.200v6c0 4.800 3.200 8.700 7.800 10.600 4.600-1.900 7.800-5.800 7.800-10.600v-6z" fill="{colore}"/>'
          f'<path d="M8.300 12.100 11 14.800l4.800-5" fill="none" stroke="#FFFFFF" stroke-width="2.200" stroke-linecap="round" stroke-linejoin="round"/></g>')


# ---------------------------------------------------------------------------- busta (salva i risultati)
def busta(t, x0: float, y0: float, x1: float, y1: float, id: str = "busta"):
    """Busta pastello (stile stati/notifica del kit), bbox in px del ritaglio."""
    X, Y, s = t.X, t.Y, t.s
    x, y, w, h = X(x0), Y(y0), s(x1 - x0), s(y1 - y0)
    r = s(7)
    with t.gruppo(id):
        t.rett(x, y, w, h, r, fill=t.sfumatura(["#E2E9FC", "#D3DDFB"]), filtro=t.ombra(s(1.5), s(5), "#6C7FD8", 0.18), id=f"{id}-corpo")
        # tasca (due falde laterali) e lembo
        t.path(f"M{n(x + r * .3)} {n(y + h * .28)}L{n(x + w * .5)} {n(y + h * .66)}L{n(x + w - r * .3)} {n(y + h * .28)}", stroke="#C6D3F7", sw=s(1.1), id=f"{id}-pieghe")
        t.path(f"M{n(x + r * .5)} {n(y + h - r * .4)}L{n(x + w * .38)} {n(y + h * .52)}M{n(x + w - r * .5)} {n(y + h - r * .4)}L{n(x + w * .62)} {n(y + h * .52)}", stroke="#C6D3F7", sw=s(0.9), id=f"{id}-falde")
        t.path(f"M{n(x)} {n(y + r)}Q{n(x)} {n(y)} {n(x + r)} {n(y)}H{n(x + w - r)}Q{n(x + w)} {n(y)} {n(x + w)} {n(y + r)}L{n(x + w * .5)} {n(y + h * .62)}z",
               fill=t.sfumatura(["#F2F5FF", "#E4EBFD"]), id=f"{id}-lembo")


# ---------------------------------------------------------------------------- coriandoli (accesso completato)
def capsula(t, cx: float, cy: float, lungh: float, spess: float, ang: float, colore: str, id: str | None = None):
    ident = f' id="{id}"' if id else ""
    t.add(f'<rect x="{n(t.X(cx) - t.s(lungh / 2))}" y="{n(t.Y(cy) - t.s(spess / 2))}" width="{n(t.s(lungh))}" height="{n(t.s(spess))}" '
          f'rx="{n(t.s(spess / 2))}" fill="{colore}" transform="rotate({n(ang)} {n(t.X(cx))} {n(t.Y(cy))})"{ident}/>')


def croce(t, cx: float, cy: float, lato: float, spess: float, ang: float, colore: str, id: str | None = None):
    with t.gruppo(id or "croce", trasforma=f"rotate({n(ang)} {n(t.X(cx))} {n(t.Y(cy))})"):
        t.rett(t.X(cx) - t.s(lato / 2), t.Y(cy) - t.s(spess / 2), t.s(lato), t.s(spess), t.s(spess / 2.4), fill=colore)
        t.rett(t.X(cx) - t.s(spess / 2), t.Y(cy) - t.s(lato / 2), t.s(spess), t.s(lato), t.s(spess / 2.4), fill=colore)


# ---------------------------------------------------------------------------- marchi dei metodi di pagamento (semplificati)
def marchio_carta(t, cx: float, cy: float, w: float = 15):
    h = w * 0.68
    with t.gruppo("marchio-carta"):
        t.rett(t.X(cx - w / 2), t.Y(cy - h / 2), t.s(w), t.s(h), t.s(1.8), fill=t.sfumatura(["#FF5A3C", "#F0262E"]))
        t.rett(t.X(cx - w / 2), t.Y(cy - h / 2 + h * 0.2), t.s(w), t.s(h * 0.2), 0, fill="#FFFFFF", opacita=0.55)
        t.rett(t.X(cx - w / 2 + w * 0.12), t.Y(cy + h * 0.14), t.s(w * 0.3), t.s(h * 0.14), t.s(0.6), fill="#FFFFFF", opacita=0.85)


def marchio_paypal(t, cx: float, cy: float, h: float = 15):
    """Due «P» sovrapposte, azzurro e blu (semplificato)."""
    k = t.s(h) / 24
    t.add(f'<g id="marchio-paypal" transform="translate({n(t.X(cx) - 12 * k)} {n(t.Y(cy) - 12 * k)}) scale({n(k)})">'
          f'<path d="M8.600 3h6.100c3.200 0 5 1.900 4.400 4.800-.6 3.400-3 5-6 5h-2.200l-.8 4.700H6.900z" fill="#0A3FA8"/>'
          f'<path d="M5.700 7.200h6c3 0 4.800 1.700 4.200 4.600-.6 3.200-2.900 4.800-5.800 4.800H8.300l-.8 5H3.700z" fill="#2D8FE8" opacity=".95"/></g>')


def marchio_apple(t, cx: float, cy: float, h: float = 15):
    k = t.s(h) / 24
    t.add(f'<g id="marchio-apple" transform="translate({n(t.X(cx) - 12 * k)} {n(t.Y(cy) - 12 * k)}) scale({n(k)})" fill="#0B0B0F">'
          f'<path d="M16.600 12.700c0-2.400 2-3.500 2.100-3.600-1.200-1.700-3-1.900-3.600-2-1.500-.2-3 .9-3.800.9-.8 0-2-.9-3.300-.9-1.700 0-3.300 1-4.200 2.500-1.800 3.100-.5 7.800 1.300 10.300.9 1.200 1.900 2.600 3.200 2.600 1.300-.1 1.800-.8 3.300-.8s2 .8 3.300.8c1.400 0 2.300-1.300 3.100-2.500 1-1.400 1.400-2.800 1.400-2.900-.1 0-2.800-1.100-2.800-4.400z"/>'
          f'<path d="M14.200 5.300c.7-.9 1.200-2.100 1.100-3.300-1 0-2.300.7-3 1.600-.7.8-1.200 2-1.100 3.200 1.200.1 2.300-.6 3-1.500z"/></g>')


def marchio_google(t, cx: float, cy: float, h: float = 15):
    """«G» a quattro colori costruita con archi."""
    k = t.s(h) / 24
    def arco(a0, a1, col):
        r = 8.2
        x0, y0 = 12 + r * math.cos(math.radians(a0)), 12 + r * math.sin(math.radians(a0))
        x1, y1 = 12 + r * math.cos(math.radians(a1)), 12 + r * math.sin(math.radians(a1))
        return f'<path d="M{n(x0)} {n(y0)}A{r} {r} 0 0 1 {n(x1)} {n(y1)}" fill="none" stroke="{col}" stroke-width="3.800"/>'
    t.add(f'<g id="marchio-google" transform="translate({n(t.X(cx) - 12 * k)} {n(t.Y(cy) - 12 * k)}) scale({n(k)})">'
          + arco(220, 315, "#EA4335") + arco(130, 220, "#FBBC05") + arco(45, 130, "#34A853") + arco(0, 45, "#4285F4")
          + '<path d="M12.200 12h8.200" stroke="#4285F4" stroke-width="3.800" fill="none"/></g>')
