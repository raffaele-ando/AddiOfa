"""
Layout 37 · profilo Instagram (pagina web del profilo @addiofa), 1312x1199.

Rifatto in SVG: intestazione (avatar con stella a 4 punte, nome utente, pulsanti Segui/Messaggio/Aggiungi/Altro, contatori,
bio, link), 5 storie in evidenza (illustrazioni del kit + cappello vettoriale), schede POST/REEL/TAGGATI, tre post.
Foto: nei post 1 e 3 restano raster gli sfondi fotografici (studenti, edificio, scala) PULITI dalle scritte cotte dall'AI
(inpainting); testi, stella, badge, pulsanti, scheda con spunte e spillo sono vettoriali. Il post 2 (cielo + telefono) e' tutto vettoriale.
Corretto: emoji della bio sostituite con piccoli glifi vettoriali; icone dei pulsanti generiche (niente marchi di terzi);
il testo inglese del quiz nel post 2 e' rifatto (frase vera: "She goes to Milan every day").
"""
from lib import *

W, H = 1312, 1199
BORDO = (26, 668)


def icona_griglia(t, cx, cy, s, col):
    for i in range(3):
        for j in range(3):
            t.rett(cx - s / 2 + i * s / 3 + 0.8, cy - s / 2 + j * s / 3 + 0.8, s / 3 - 1.6, s / 3 - 1.6, 0.8, fill=col)
    t.rett(cx - s / 2, cy - s / 2, s, s, 1.5, fill="none", stroke=col, sw=1.6)


def icona_reel(t, cx, cy, s, col):
    t.rett(cx - s / 2, cy - s / 2, s, s, s * 0.22, fill="none", stroke=col, sw=1.8)
    t.path(f"M{n(cx - s*0.12)} {n(cy - s*0.2)}L{n(cx + s*0.22)} {n(cy)}L{n(cx - s*0.12)} {n(cy + s*0.2)}z", fill=col)
    t.linea(cx - s / 2, cy - s * 0.22, cx + s / 2, cy - s * 0.22, col, 1.6)


def icona_taggati(t, cx, cy, s, col):
    t.rett(cx - s / 2, cy - s / 2, s, s, s * 0.2, fill="none", stroke=col, sw=1.8)
    t.cerchio(cx, cy - s * 0.1, s * 0.16, fill="none", stroke=col, sw=1.7)
    t.path(f"M{n(cx - s*0.28)} {n(cy + s*0.4)}c0-{n(s*0.26)} {n(s*0.14)}-{n(s*0.36)} {n(s*0.28)}-{n(s*0.36)}s{n(s*0.28)} {n(s*0.1)} {n(s*0.28)} {n(s*0.36)}", stroke=col, sw=1.7)


def emoji_laurea(t, cx, cy, s):
    cappello_laurea(t, cx, cy - s * 0.05, s * 1.25, id="glifo-laurea")
    t.path(f"M{n(cx - s*0.42)} {n(cy + s*0.12)}v{n(s*0.2)}", stroke="#1D2A4A", sw=1)


def emoji_bersaglio(t, cx, cy, s):
    with t.gruppo("glifo-bersaglio"):
        for rr, c in [(0.5, "#E5383B"), (0.38, "#FFFFFF"), (0.26, "#E5383B"), (0.13, "#FFFFFF")]:
            t.cerchio(cx, cy, s * rr, fill=c)
        t.linea(cx, cy, cx + s * 0.55, cy - s * 0.5, "#3B82F6", 2.6, id="glifo-bersaglio-freccia")


def emoji_scintille(t, cx, cy, s):
    with t.gruppo("glifo-scintille"):
        stella4(t, cx - s * 0.05, cy + s * 0.08, s * 0.42, "#FFC83D", id="scintilla-grande")
        stella4(t, cx + s * 0.32, cy - s * 0.34, s * 0.2, "#FFC83D", id="scintilla-piccola")


def icona_link(t, cx, cy, s, col):
    with t.gruppo("glifo-link", trasforma=f"rotate(-45 {n(cx)} {n(cy)})"):
        for dx in (-0.2, 0.2):
            t.rett(cx + dx * s - s * 0.26, cy - s * 0.14, s * 0.52, s * 0.28, s * 0.14, fill="none", stroke=col, sw=2.2)
        t.linea(cx - s * 0.08, cy, cx + s * 0.08, cy, col, 2.2)


# ---------------------------------------------------------------------------------------- i tre post
def post_testata(t, w, titolo_wordmark=True):
    wordmark(t, 32, 38, 21, col="#FFFFFF", col_o="#FFFFFF", id="wordmark-post")


def post1(t):
    p = foto_pulita(S37, (26, 668, 446, 1183), "p37_post1",
                    rects=[(50, 685, 160, 715), (395, 680, 440, 715), (385, 722, 436, 768), (50, 725, 365, 818), (50, 818, 300, 895), (125, 905, 220, 980), (355, 1100, 440, 1170)])
    t.foto(p, 0, 0, 420, 515, id="foto-sfondo-studenti-polimi")
    wordmark(t, 32, 39, 20, col="#FFFFFF", col_o="#FFFFFF", id="wordmark-post")
    spillo(t, 389, 25, 26)
    with t.gruppo("titolo-post"):
        t.testo("Il tuo inglese,", 32, 90, 40, 800, "#FFFFFF", spaziatura=-0.8, id="titolo-riga-1")
        t.testo("senza ostacoli.", 32, 137, 40, 800, "#1B5CF0", spaziatura=-0.8, id="titolo-riga-2")
    with t.gruppo("sottotitolo-post"):
        for i, r in enumerate(["Verifica il tuo livello, preparati", "per l'OFA e sblocca il tuo", "piano di studi al Polimi."]):
            t.testo(r, 33, 173 + i * 22, 16.5, 400, "#0E2350", id=f"sottotitolo-riga-{i+1}")
    stella4(t, 146, 283, 38, "#1D5BF5", id="stella-blu", curva=0.16)
    contatore(t, 380, 76, "1/6")
    freccia_tonda(t, 378, 469, 26)


def sfondo_cielo_chiaro(t, w, h):
    t.rett(0, 0, w, h, 0, fill=t.sfumatura(["#8CC0F6", "#CFE5FC", "#EAF4FE", "#CFE3FB"]), id="cielo")
    for cx, cy, ww, o in [(70, 160, 230, 0.9), (360, 60, 200, 0.8), (40, 400, 180, 0.9), (380, 330, 200, 0.85), (230, 470, 300, 0.95)]:
        nuvola(t, cx, cy, ww, o)


def quiz_schermo(t, x, y, w, h):
    s = w / 285
    t.testo("Quiz di valutazione", x + 140 * s, y + 98 * s, 13 * s, 700, NAVY, ancora="middle", id="quiz-titolo")
    t.rett(x + 28 * s, y + 118 * s, 200 * s, 7 * s, 3.5 * s, fill="#E3EAF5", id="quiz-barra")
    t.rett(x + 28 * s, y + 118 * s, 78 * s, 7 * s, 3.5 * s, fill=BLU_T, id="quiz-barra-riempita")
    t.testo("3/10", x + 258 * s, y + 126 * s, 10 * s, 500, "#5B6577", ancora="end")
    t.testo("Choose the correct form:", x + 28 * s, y + 156 * s, 11.5 * s, 400, "#2A3447")
    t.testo("She ____ to Milan", x + 28 * s, y + 178 * s, 13.5 * s, 700, NAVY)
    t.testo("every day.", x + 28 * s, y + 196 * s, 13.5 * s, 700, NAVY)
    for i, (txt, sel) in enumerate([("goes", True), ("going", False), ("to go", False)]):
        yy = y + 210 * s + i * 33 * s
        t.rett(x + 20 * s, yy, 242 * s, 26 * s, 13 * s, fill="#FDEBEC" if sel else "#F2F5FA", stroke="#F0A0A6" if sel else "#E1E7F0", sw=1, id=f"quiz-opzione-{i+1}")
        t.cerchio(x + 38 * s, yy + 13 * s, 6.5 * s, fill="#FFFFFF" if not sel else "#E5383B", stroke="#C9D2E0" if not sel else "#E5383B", sw=1.2)
        if sel:
            t.cerchio(x + 38 * s, yy + 13 * s, 2.6 * s, fill="#FFFFFF")
        t.testo(txt, x + 54 * s, yy + 17.5 * s, 11 * s, 500, "#2A3447")


def post2(t):
    sfondo_cielo_chiaro(t, 410, 515)
    wordmark(t, 31, 38, 20, col=NAVY, col_o=BLU_T, id="wordmark-post")
    spillo(t, 379, 25, 26, col="#FFFFFF")
    t.testo("Cos'è", 31, 92, 40, 800, NAVY, spaziatura=-0.8, id="titolo-riga-1")
    wordmark(t, 31, 137, 47, col=BLU_T, col_o=BLU_T, id="titolo-addiofa")
    with t.gruppo("sottotitolo-post"):
        for i, r in enumerate(["L'app del Politecnico di Milano", "che ti aiuta a capire il tuo livello", "di inglese, ti prepara all'OFA", "e ti accompagna fino al", "superamento."]):
            t.testo(r, 32, 167 + i * 22, 16.3, 400, "#10244E", id=f"sottotitolo-riga-{i+1}")
    contatore(t, 380, 76, "1/6", id="contatore-pagine")
    with t.gruppo("scritta-corsiva", trasforma="rotate(-18 340 180)"):
        for i, r in enumerate(["SMALL", "STEPS", "BIG", "OPPORTUNITIES"]):
            t.testo(r, (300 + i * 8) if i < 3 else 262, 148 + i * 19, 14.5, 500, BLU_T, id=f"corsivo-{i+1}", spaziatura=0.3)
    telefono(t, 80, 268, 290, 420, id="telefono-quiz", rot=-6, schermo=lambda tt, a, b, c, d: quiz_schermo(tt, a, b, c, d))
    freccia_tonda(t, 372, 469, 26)


def post3(t):
    p = foto_pulita(S37, (872, 668, 1287, 1183), "p37_post3",
                    rects=[(895, 688, 1000, 715), (895, 722, 1180, 850), (1180, 705, 1290, 790), (1225, 668, 1282, 712),
                           (895, 1040, 1075, 1180), (1235, 1110, 1285, 1180)])
    t.foto(p, 0, 0, 415, 515, id="foto-sfondo-studente-scala")
    wordmark(t, 32, 39, 20, col="#FFFFFF", col_o="#FFFFFF", id="wordmark-post")
    spillo(t, 385, 25, 26)
    with t.gruppo("titolo-post"):
        t.testo("3", 32, 117, 76, 800, "#FFFFFF", id="titolo-numero")
        t.testo("consigli", 100, 90, 38, 800, "#B8E4FF", spaziatura=-0.5, id="titolo-consigli")
        t.testo("per superare", 100, 121, 34, 800, "#FFFFFF", spaziatura=-0.5, id="titolo-per-superare")
        t.testo("l'OFA di inglese", 32, 163, 34, 800, "#FFFFFF", spaziatura=-0.5, id="titolo-ofa-di-inglese")
    stella4(t, 345, 133, 33, "#FFFFFF", id="stella-bianca", curva=0.14)
    contatore(t, 376, 76, "1/5", id="contatore-pagine", w=44, h=36)
    # scheda con spunte (inclinata di -5 gradi, come nell'originale)
    with t.gruppo("scheda-consigli", trasforma="rotate(-6 140 275)"):
        t.rett(28, 190, 222, 172, 14, fill="#FFFFFF", id="scheda-fondo", filtro=t.ombra(8, 22, "#0A1E55", 0.35))
        for i, r in enumerate(["Studia in modo costante", "Fai quiz e simulazioni", "Allena tutte le skill"]):
            yy = 208 + i * 46
            t.rett(42, yy, 196, 34, 10, fill="#EEF3FB", id=f"scheda-riga-{i+1}")
            t.rett(48, yy + 6, 22, 22, 6, fill=BLU_T, id=f"casella-{i+1}")
            t.icona("spunta", 51, yy + 9, 16, "#FFFFFF", 3)
            t.testo(r, 80, yy + 22, 13.2, 500, "#1A2A4A", id=f"scheda-testo-{i+1}")
        # bandiera generica del Regno Unito (diagonali sfalsate)
        bandiera_uk(t, 106, 190, 38)
    with t.gruppo("scritta-corsiva", trasforma="rotate(-12 80 470)"):
        for i, r in enumerate(["STESSI", "STUDENTI.", "PERCORSI", "PIÙ LUMINOSI."]):
            t.testo(r, 36 + i * 4, 438 + i * 24, 20, 500, "#FFFFFF", id=f"corsivo-{i+1}", spaziatura=0.5)
    freccia_tonda(t, 372, 469, 26)


def main():
    t = nuova(W, H, "profilo-instagram-addiofa", "#FFFFFF")
    # intestazione
    with t.gruppo("avatar"):
        t.cerchio(245, 171, 118, fill=t.radiale([(0, "#FFFFFF", 1), (0.75, "#FBF9F5", 1), (1, "#F5F1EA", 1)], 0.5, 0.5, 0.5), stroke="#ECE6DD", sw=1.5, id="avatar-tondo")
        stella4(t, 245, 171, 74, "#0C5CF5", id="avatar-stella", curva=0.13)
    with t.gruppo("riga-nome-e-pulsanti"):
        t.testo("addiofa", 460, 62, 29, 500, "#0A0F1E", id="nome-utente", spaziatura=-0.3)
        t.rett(597, 27, 126, 50, 11, fill="#0E64F8", id="pulsante-segui")
        t.testo("Segui", 660, 59, 17.5, 600, "#FFFFFF", ancora="middle", id="pulsante-segui-testo")
        t.rett(737, 27, 158, 50, 11, fill="#EEEEF0", id="pulsante-messaggio")
        t.testo("Messaggio", 816, 59, 17.5, 600, "#0A0F1E", ancora="middle", id="pulsante-messaggio-testo")
        t.rett(910, 27, 50, 50, 11, fill="#EEEEF0", id="pulsante-aggiungi-persona")
        t.icona("utente", 928, 41, 22, "#0A0F1E", 1.8, id="icona-persona")
        t.linea(923, 47, 931, 47, "#0A0F1E", 0) if False else None
        t.path("M920 52h8M924 48v8", stroke="#0A0F1E", sw=1.8, id="icona-piu")
        for k in range(3):
            t.cerchio(991 + k * 14.5, 52, 3.2, fill="#0A0F1E", id=f"icona-altro-{k+1}")
    with t.gruppo("contatori"):
        x = 464
        for num, lab in [("163", "post"), ("12,4 mila", "follower"), ("12", "seguiti")]:
            wn = t.testo(num, x, 136, 22.5, 700, "#0A0F1E")
            wl = t.testo(lab, x + wn + 7, 136, 22.5, 400, "#4B5563")
            x += {"163": 154, "12,4 mila": 240}.get(num, 0)
    with t.gruppo("biografia"):
        t.testo("AddiOFA", 464, 192, 21, 700, "#0A1230", id="bio-nome")
        t.testo("Il tuo inglese, senza ostacoli.", 464, 222, 20, 400, "#0A1230", id="bio-riga-1")
        emoji_laurea(t, 477, 245, 18)
        t.testo("L'app del Politecnico di Milano per superare l'OFA di inglese.", 500, 251, 20, 400, "#0A1230", id="bio-riga-2")
        emoji_bersaglio(t, 476, 274, 11)
        t.testo("Quiz, strategie e risorse per prepararti al meglio.", 500, 280, 20, 400, "#0A1230", id="bio-riga-3")
        emoji_scintille(t, 477, 301, 14)
        t.testo("Small steps, big opportunities.", 500, 309, 20, 400, "#0A1230", id="bio-riga-4")
        icona_link(t, 477, 335, 22, "#1456D8")
        t.testo("linktr.ee/addiofa", 500, 341, 20, 600, "#1456D8", id="bio-link")
    # storie in evidenza
    with t.gruppo("storie-in-evidenza"):
        voci = [(162, "Studio", "kit-blu/illustrazioni/studio-inglese", 1.2), (374, "Quiz", "kit-blu/illustrazioni/quiz-test", 1.1),
                (584, "Consigli", "kit-blu/illustrazioni/suggerimenti-consigli", 1.0), (795, "Risultati", "kit-blu/illustrazioni/progressi-statistiche", 1.0),
                (1008, "Polimi", None, 1)]
        for cx, lab, ill, sc in voci:
            cg = (lambda tt, a, b, c: cappello_laurea(tt, a, b + 2, c * 1.6)) if ill is None else None
            copertina_highlight(t, cx, 455, 72, ill, id=f"storia-{lab.lower()}", glifo=cg, scala_ill=sc)
            t.testo(lab, cx, 557, 20.5, 600, "#0A1230", ancora="middle", id=f"storia-{lab.lower()}-etichetta")
    # schede
    t.linea(26, 602, 1287, 602, "#E4E6EA", 1.5, id="filetto")
    t.linea(402, 601, 486, 601, "#2A2F3A", 2.5, cap="butt", id="scheda-attiva-sottolineatura")
    with t.gruppo("schede-post-reels-taggati"):
        icona_griglia(t, 411, 637, 18, "#0A0F1E")
        t.testo("POST", 435, 645, 18.5, 600, "#0A0F1E", spaziatura=1.6, id="scheda-post")
        icona_reel(t, 609, 637, 19, "#6B7280")
        t.testo("REELS", 633, 645, 18.5, 600, "#6B7280", spaziatura=1.6, id="scheda-reels")
        icona_taggati(t, 796, 637, 19, "#6B7280")
        t.testo("TAGGATI", 820, 645, 18.5, 600, "#6B7280", spaziatura=1.6, id="scheda-taggati")
    # post
    for (x, w, f, nome) in [(26, 420, post1, "post-1-il-tuo-inglese"), (455, 410, post2, "post-2-cose-addiofa"), (872, 415, post3, "post-3-tre-consigli")]:
        cid = clip_rett(t, 0, 0, w, 515, 12)
        with t.gruppo(nome, trasforma=f"translate({x} 668)", clip=cid):
            f(t)
    p = salva(t, "37-profilo-instagram", "01-profilo-instagram-addiofa")
    o = ritaglio(S37, (0, 0, W, H), "37")
    tavola(p, o, "37-01-profilo-instagram")


if __name__ == "__main__":
    main()
