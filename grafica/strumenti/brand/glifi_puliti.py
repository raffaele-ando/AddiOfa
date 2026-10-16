"""
Glifi del kit blu ridisegnati puliti (14 icone): forme semplici con sfumature a due fermate, nessun ricalco.
Sostituiscono quelli di `glifi.py` (vtracer), che avevano bordi tremolanti e una frangia chiara che su fondo scuro si vedeva.
Il cerchio dietro al glifo lo disegna il codice (IconaChip); il glifo sta in un viewBox 456 x 456 con il centro in (228, 228).
Niente <text>: la «?» e l'«€» sono tracciati.

    python3 strumenti/brand/glifi_puliti.py      # scrive brand/glifi/kit-blu/<nome>.svg
"""
from __future__ import annotations

import math
import pathlib

OUT = pathlib.Path(__file__).resolve().parents[2] / "brand" / "glifi" / "kit-blu"

BLU = ("#5E9BFF", "#2A6BFD")
ARANCIO = ("#FFBA3B", "#FD9A0A")
ROSSO = ("#FA5A5F", "#F02A32")
VERDE = ("#3CCB74", "#16A84C")
LILLA = ("#8FA8FE", "#5F82F8")
GRIGIO = ("#8393AC", "#5E6F8C")


def grad(i: str, c: tuple[str, str], y1=110, y2=346) -> str:
    return (f'<linearGradient id="{i}" gradientUnits="userSpaceOnUse" x1="0" y1="{y1}" x2="0" y2="{y2}">'
            f'<stop offset="0" stop-color="{c[0]}"/><stop offset="1" stop-color="{c[1]}"/></linearGradient>')


def svg(corpo: str, *gradienti: str) -> str:
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 456 456"><defs>{"".join(gradienti)}</defs>{corpo}</svg>\n')


def studio() -> str:
    # libro aperto: pagina sinistra più chiara, destra più scura, costa al centro
    s = 'stroke-linejoin="round" stroke-width="10"'
    sin = f'<path id="pagina-sinistra" d="M222 176C196 154 160 148 128 152V292C160 288 196 294 222 316Z" fill="url(#a)" stroke="url(#a)" {s}/>'
    des = f'<path id="pagina-destra" d="M234 176C260 154 296 148 328 152V292C296 288 260 294 234 316Z" fill="url(#b)" stroke="url(#b)" {s}/>'
    return svg(sin + des, grad("a", ("#7DB0FF", "#4A89FD"), 150, 316), grad("b", ("#3F7DFC", "#1363FB"), 150, 316))


def statistiche() -> str:
    barre = ''.join(f'<rect id="barra-{n}" x="{x}" y="{310 - h}" width="46" height="{h}" rx="20" fill="url(#a)"/>'
                    for n, (x, h) in enumerate([(138, 76), (205, 130), (272, 184)], 1))
    return svg(barre, grad("a", ARANCIO, 126, 310))


def quiz() -> str:
    p = "250,128 172,250 222,250 204,328 284,200 234,200"
    return svg(f'<polygon id="fulmine" points="{p}" fill="url(#a)" stroke="url(#a)" stroke-width="16" stroke-linejoin="round"/>', grad("a", ("#4F8CFF", "#1D5FFB"), 128, 328))


def contenuti() -> str:
    foglio = ('<path id="foglio" d="M182 138H250L298 186V298A20 20 0 0 1 278 318H182A20 20 0 0 1 162 298V158A20 20 0 0 1 182 138Z" fill="url(#a)"/>'
              '<path id="angolo" d="M250 138L298 186H270A20 20 0 0 1 250 166Z" fill="#FFFFFF" fill-opacity="0.38"/>'
              '<rect id="riga-1" x="190" y="226" width="80" height="16" rx="8" fill="#FFFFFF"/>'
              '<rect id="riga-2" x="190" y="262" width="80" height="16" rx="8" fill="#FFFFFF"/>')
    return svg(foglio, grad("a", ROSSO, 138, 318))


def costo() -> str:
    tr = 'fill="none" stroke="url(#a)" stroke-linecap="round" stroke-linejoin="round"'
    corpo = (f'<path id="euro-arco" d="M298 172A78 78 0 1 0 298 284" {tr} stroke-width="34"/>'
             f'<path id="euro-barre" d="M148 205H252M148 251H252" {tr} stroke-width="26"/>')
    return svg(corpo, grad("a", ROSSO, 130, 326))


def blocco() -> str:
    corpo = ('<path id="arco" d="M188 214V176A40 40 0 0 1 268 176V214" fill="none" stroke="url(#a)" stroke-width="28" stroke-linecap="round"/>'
             '<rect id="corpo" x="162" y="204" width="132" height="122" rx="26" fill="url(#a)"/>'
             '<circle id="buco" cx="228" cy="250" r="16" fill="#FFFFFF"/>'
             '<path id="buco-fessura" d="M221 256H235L238 292A10 10 0 0 1 228 300A10 10 0 0 1 218 292Z" fill="#FFFFFF"/>')
    return svg(corpo, grad("a", ROSSO, 130, 326))


def successo() -> str:
    tr = 'fill="none" stroke="url(#a)" stroke-linecap="round" stroke-linejoin="round"'
    corpo = (f'<path id="manico-sinistro" d="M178 164C128 158 128 230 182 232" {tr} stroke-width="20"/>'
             f'<path id="manico-destro" d="M278 164C328 158 328 230 274 232" {tr} stroke-width="20"/>'
             '<path id="coppa" d="M170 136H286V196A58 58 0 0 1 170 196Z" fill="url(#a)" stroke="url(#a)" stroke-width="10" stroke-linejoin="round"/>'
             '<rect id="stelo" x="214" y="244" width="28" height="42" fill="url(#a)"/>'
             '<rect id="base" x="176" y="282" width="104" height="28" rx="12" fill="url(#a)"/>')
    return svg(corpo, grad("a", VERDE, 130, 312))


def email() -> str:
    corpo = ('<rect id="busta" x="140" y="158" width="176" height="140" rx="26" fill="url(#a)"/>'
             '<path id="lembo" d="M158 186L228 244L298 186" fill="none" stroke="#FFFFFF" stroke-opacity="0.55" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>')
    return svg(corpo, grad("a", ("#FB6D70", "#F0343A"), 158, 298))


def profilo() -> str:
    corpo = ('<circle id="testa" cx="228" cy="182" r="42" fill="url(#a)"/>'
             '<path id="busto" d="M146 306V300C146 266 182 246 228 246C274 246 310 266 310 300V306A12 12 0 0 1 298 318H158A12 12 0 0 1 146 306Z" fill="url(#a)"/>')
    return svg(corpo, grad("a", LILLA, 140, 318))


def impostazioni() -> str:
    cx = cy = 228
    n, r_in, r_out, r_foro = 8, 70, 98, 28
    denti = ''.join(f'<rect x="{cx - 20}" y="{cy - r_out}" width="40" height="{r_out - r_in + 14}" rx="8" fill="url(#a)" transform="rotate({k * 360 / n} {cx} {cy})"/>' for k in range(n))
    corpo = (f'<g id="denti">{denti}</g>'
             f'<path id="ruota" fill-rule="evenodd" fill="url(#a)" d="M{cx - r_in - 6} {cy}a{r_in + 6} {r_in + 6} 0 1 0 {2 * (r_in + 6)} 0a{r_in + 6} {r_in + 6} 0 1 0 -{2 * (r_in + 6)} 0Z'
             f'M{cx - r_foro} {cy}a{r_foro} {r_foro} 0 1 1 {2 * r_foro} 0a{r_foro} {r_foro} 0 1 1 -{2 * r_foro} 0Z"/>')
    return svg(corpo, grad("a", GRIGIO, 130, 326))


def aiuto() -> str:
    corpo = ('<path id="gancio" d="M176 186A52 52 0 1 1 256 232C236 246 228 254 228 276" fill="none" stroke="url(#a)" stroke-width="32" stroke-linecap="round" stroke-linejoin="round"/>'
             '<circle id="punto" cx="228" cy="320" r="20" fill="url(#a)"/>')
    return svg(corpo, grad("a", GRIGIO, 120, 340))


def completato() -> str:
    return svg('<path id="spunta" d="M152 236L208 292L306 168" fill="none" stroke="url(#a)" stroke-width="44" stroke-linecap="round" stroke-linejoin="round"/>', grad("a", VERDE, 160, 300))


def errore() -> str:
    return svg('<path id="croce" d="M166 166L290 290M290 166L166 290" fill="none" stroke="url(#a)" stroke-width="42" stroke-linecap="round"/>', grad("a", ROSSO, 160, 296))


def info() -> str:
    corpo = ('<circle id="disco" cx="228" cy="228" r="104" fill="url(#a)"/>'
             '<circle id="punto" cx="228" cy="180" r="15" fill="#FFFFFF"/>'
             '<rect id="asta" x="212" y="208" width="32" height="88" rx="15" fill="#FFFFFF"/>')
    return svg(corpo, grad("a", ("#5B93FF", "#2467FA"), 124, 332))


GLIFI = dict(studio=studio, statistiche=statistiche, quiz=quiz, contenuti=contenuti, costo=costo, blocco=blocco, successo=successo,
             email=email, profilo=profilo, impostazioni=impostazioni, aiuto=aiuto, completato=completato, errore=errore, info=info)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for nome, f in GLIFI.items():
        (OUT / f"{nome}.svg").write_text(f())
    print(len(GLIFI), "glifi scritti in", OUT)


if __name__ == "__main__":
    main()
