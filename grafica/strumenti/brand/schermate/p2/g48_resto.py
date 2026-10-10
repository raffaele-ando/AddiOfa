"""Layout 48 · caroselli, reel, post informativo, post meme (elementi 48.003 ... 48.018)."""
from lib import *
import tiles48b as B

SD = "48-social-copertine-video"


def uno(nome, box, fn, fondo="#FFFFFF", cartella=SD, orig=S48, id_=None):
    x0, y0, x1, y1 = box
    t = nuova(x1 - x0, y1 - y0, id_ or nome, fondo)
    with Origine(t, x0, y0):
        fn(t)
    p = salva(t, cartella, nome)
    o = ritaglio(orig, box, nome)
    tavola(p, o, f"48-{nome}")
    return p


def main():
    uno("02-carosello-educativo", (19, 470, 747, 690), B.carosello_educativo, "#F7F9FF")
    uno("03-carosello-dati-statistiche", (758, 470, 1182, 702), B.carosello_dati, "#F7F9FF")
    uno("04-carosello-tips", (1196, 470, 1536, 690), B.carosello_tips, "#F7F9FF")
    for i, (fn, nm, box) in enumerate([(B.reel1, "reel-study-vlog", (13, 729, 181, 1006)), (B.reel2, "reel-testimonianza", (195, 729, 368, 1006)),
                                       (B.reel3, "reel-miti-vs-realta", (381, 729, 561, 1006)), (B.reel4, "reel-app-walkthrough", (573, 729, 755, 1006)),
                                       (B.reel5, "reel-motivazionale", (765, 729, 938, 1006))]):
        uno(f"{5+i:02d}-{nm}", box, fn, "#FFFFFF")
    uno("10-post-informativo", (954, 730, 1290, 998), B.post_informativo, "#F8FAFF")
    uno("11-post-meme-engagement", (1298, 760, 1526, 988), B.post_meme, "#FFFFFF")


if __name__ == "__main__":
    main()
