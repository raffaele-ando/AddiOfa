"""
Layout 26 · hero della tavola "AddiOFA Social Media Identity" (518x367): titolo, sottotitolo, scritta a mano e scena
architettonica con il blocco-marchio. Elementi 26.001, 26.002, 26.003, 26.007, 26.009, 26.010, 26.011, 26.012, 26.014.

TUTTO VETTORIALE (nessuna foto): cielo a sfumatura, blocchi bianchi dell'edificio, gradinata e il blocco blu col marchio a stella
luminosa sono costruiti con piani e sfumature. Corretti: la stella del blocco (nell'originale a 5 punte storte) e' simmetrica;
"SMALL STEPS BIG OPPORTUNITIES" a mano resa con Inter inclinata (il font a mano dell'AI non e' disponibile).
"""
from lib import *

W, H = 518, 367


def scena(t):
    t.rett(0, 0, W, H, 0, fill=t.sfumatura([(0, "#FFFFFF"), (0.28, "#EAF3FE"), (0.6, "#A9CDF7"), (1, "#3470DE")], 0, 0.3, 1, 0), id="cielo")
    t.rett(0, 0, W, 190, 0, fill=t.sfumatura([(0, "#3A74E0"), (0.5, "#8DB9F3"), (1, "#FFFFFF")], 0, 0, 0, 1), opacita=0.55, id="cielo-alto")
    nuvola(t, 275, 12, 120, 0.8, id="nuvola-alto")
    # edificio: grande blocco bianco in alto a destra (due volumi)
    with t.gruppo("edificio"):
        t.path("M375 0H518V215H375z", fill=t.sfumatura(["#F2F4F8", "#DCE2EB"]), id="volume-posteriore")
        t.path("M375 0H470L518 0V70L470 40H375z", fill="#C9D1DE", opacita=0.7, id="ombra-cornicione")
        t.path("M375 88H518V220H375z", fill=t.sfumatura(["#E7ECF3", "#F7F9FC"]), id="volume-anteriore")
        t.path("M375 88H518", stroke="#FFFFFF", sw=2, id="spigolo-chiaro")
        t.path("M375 0V215", stroke="#FFFFFF", sw=1.5, opacita=0.7)
        t.rett(300, 175, 76, 90, 0, fill=t.sfumatura(["#F4F7FB", "#DDE4EE"]), id="volume-basso-sinistra")
    # gradinata
    with t.gruppo("gradinata"):
        livelli = [(262, 214, "#F4F6FA", "#BFC8D8"), (284, 188, "#F6F8FB", "#C6CEDC"), (306, 150, "#F8F9FC", "#CDD4E1"),
                   (329, 90, "#FAFBFD", "#E0E5EE"), (352, 20, "#FCFDFE", "#E4E8F0")]
        for i, (yy, x0, tr, ri) in enumerate(livelli):
            alt = 22 if i < 4 else 15
            t.rett(x0, yy, W - x0, 4, 0, fill=tr, id=f"gradino-{i+1}-pedata")
            t.rett(x0, yy + 4, W - x0, alt - 4, 0, fill=t.sfumatura([ri, tr], 0, 0, 0, 1), id=f"gradino-{i+1}-alzata")
        t.rett(0, 0, 0, 0, 0)
    # alberello dietro la gradinata
    t.ellisse(262, 258, 14, 9, fill="#6F9A58", id="verde-lontano", opacita=0.9)
    # blocco-marchio: fronte, lato, stella luminosa
    with t.gruppo("blocco-marchio"):
        t.rett(294, 100, 192, 163, 42, fill=t.sfumatura(["#1033A8", "#0A2282"]), id="blocco-lato", filtro=t.ombra(8, 22, "#06124A", 0.35))
        t.rett(288, 96, 178, 167, 40, fill=t.sfumatura([(0, "#2F63D8"), (0.5, "#1C47C0"), (1, "#0F2D96")], 0, 0, 1, 1), id="blocco-fronte")
        t.path("M308 99Q380 92 452 99", stroke="#7FA6F5", sw=1.6, opacita=0.8, id="blocco-filo-luce")
        cx, cy = 375, 202
        alone = t.radiale([(0, "#FFE7A0", 0.95), (0.45, "#FFC94F", 0.5), (1, "#FFC94F", 0)], 0.5, 0.5, 0.5)
        t.cerchio(cx, cy, 82, fill=alone, id="stella-alone")
        t.path(stella5_d(cx, cy + 2, 56, 25), fill="#0A1E6E", id="stella-cavita-bordo")
        t.path(stella5_d(cx, cy + 3, 50, 22), fill=t.sfumatura(["#FFF8DA", "#FFD770", "#FFC24A"], 0, 0, 0, 1), id="stella-luminosa")
    # ombra sul gradino sotto il blocco
    t.ellipse = None
    t.ellisse(386, 268, 110, 8, fill="#8E9BB5", opacita=0.35, id="ombra-blocco-a-terra", filtro=t.sfoca(4))
    # velo bianco a sinistra per la leggibilita' del titolo
    t.rett(0, 0, 330, H, 0, fill=t.sfumatura([(0, "#FFFFFF"), (0.6, "#FFFFFF"), (1, "#FFFFFF00")], 0, 0, 1, 0), opacita=0.92, id="velo-testo")
    t.rett(0, 250, 300, 117, 0, fill=t.sfumatura([(0, "#FFFFFF00"), (1, "#FFFFFF")], 0, 0, 0, 1), opacita=0.0)


def main():
    t = nuova(W, H, "hero-social-media-identity", "#FFFFFF")
    scena(t)
    with t.gruppo("intestazione"):
        t.testo("AddiOFA", 23, 27, 9.5, 500, NAVY, id="intestazione-marchio")
        t.testo("SOCIAL MEDIA IDENTITY", 23, 41, 8.2, 500, NAVY, spaziatura=1.2, id="intestazione-titolo")
        t.testo("v1.0", 23, 54, 8.2, 500, NAVY, id="intestazione-versione")
    with t.gruppo("titolo"):
        c = corpo_per("che ti portano", 265, 800)
        t.testo("Contenuti", 24, 117, c, 800, "#0B1230", spaziatura=-0.02 * c, id="titolo-riga-1")
        t.testo("che ti portano", 24, 150, c, 800, "#0B1230", spaziatura=-0.02 * c, id="titolo-riga-2")
        t.testo("più lontano.", 24, 192, c, 800, "#1D63F2", spaziatura=-0.02 * c, id="titolo-riga-3")
    with t.gruppo("sottotitolo"):
        cs = corpo_per("Il tuo inglese, senza ostacoli.", 175, 400)
        for i, r in enumerate(["Il tuo inglese, senza ostacoli.", "Per il Politecnico di Milano", "e oltre."]):
            t.testo(r, 24, 223 + i * 18.5, cs, 400, "#2A3447", id=f"sottotitolo-riga-{i+1}")
    corsivo(t, ["SMALL", "STEPS", "BIG", "OPPORTUNITIES"], 28, 312, 13, "#2B6BF0", rot=-14, passo=17, id="scritta-a-mano", skew=-8)
    p = salva(t, "26-social-media-identity", "01-hero-social-media-identity")
    o = ritaglio(S26, (0, 0, W, H), "01-hero-social-media-identity")
    tavola(p, o, "26-01-hero")


if __name__ == "__main__":
    main()
