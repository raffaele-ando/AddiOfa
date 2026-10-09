"""
Layout 26 (tavola AddiOFA Social Media Identity): profilo su telefono, copertine storie in evidenza, formati, template post/storie/reel,
caption, applicazioni, pattern, grafiche di testo, copertina social. Coordinate = pixel della sorgente 1536x1024 dentro
Origine(riquadro). Foto raster (pulite): sfondo Polimi del post 4, reel con persone/laptop, tessera 'Stessi studenti'.
Errori AI corretti: icona 'Risultati' (era un punto interrogativo, ora barre), tagline inglese 'SAME STUDENTS BRIGHTER PATHS' mantenuta
come testo vero, emoji della bio sostituite da glifi vettoriali.
"""
from lib import *
import tiles26 as T
from g37_profilo import emoji_laurea, emoji_bersaglio, emoji_scintille, icona_link

SD = "26-social-media-identity"


def metti(t, id, x, y, w, h, fn, r=8, **k):
    cid = clip_rett(t, 0, 0, w, h, r)
    with t.gruppo(id, trasforma=f"translate({x} {y})", clip=cid):
        fn(t, w, h, **k)


def etichetta(t, x, y, testo, corpo=7.6, col="#5B6577"):
    t.testo(testo, x, y, corpo, 500, col, spaziatura=corpo * 0.16, id="etichetta-sezione")


def uno(nome, box, fn, fondo="#FFFFFF", titolo=None):
    x0, y0, x1, y1 = box
    t = nuova(x1 - x0, y1 - y0, nome, fondo)
    with Origine(t, x0, y0):
        fn(t)
    p = salva(t, SD, nome)
    o = ritaglio(S26, box, nome)
    tavola(p, o, f"26-{nome}")
    return p


# ------------------------------------------------------------------------------------------------ 02 profilo su telefono
def profilo_telefono(t):
    etichetta(t, 547, 30, "PROFILO INSTAGRAM")
    telefono(t, 539, 47, 265, 340, id="telefono-profilo", r=36)
    # schermo
    cid = clip_rett(t, 545, 53, 253, 314, 31)
    with t.gruppo("schermo-profilo", clip=cid):
        t.rett(545, 53, 253, 320, 0, fill="#FFFFFF", id="schermo-sfondo")
        t.testo("9:41", 575, 70, 11.5, 700, NAVY, id="ora")
        t.rett(634, 59, 75, 20, 10, fill="#05070B", id="isola-dinamica")
        for k in range(4):
            t.rett(755 + k * 4, 69 - (k + 1) * 2.2, 2.6, (k + 1) * 2.2, 0.6, fill=NAVY, id=f"segnale-{k+1}")
        t.icona("wifi", 768, 61, 12, NAVY, 2.4)
        t.rett(783, 62, 14, 7, 2.2, fill=NAVY, id="batteria")
        t.icona("chevron-sinistra", 553, 92, 15, NAVY, 2.2)
        t.testo("addiofa", 671, 105, 12.5, 700, NAVY, ancora="middle", id="nome-utente")
        for k in range(3):
            t.cerchio(762 + k * 6, 101, 1.6, fill=NAVY, id=f"icona-altro-{k+1}")
        # avatar
        t.cerchio(592, 152, 31, fill=t.sfumatura(["#0F3FB0", "#0A2A80"]), id="avatar-tondo")
        t.cerchio(592, 154, 25, fill=t.radiale([(0, "#FFE9A6", 0.9), (1, "#FFC94F", 0)], 0.5, 0.5, 0.5), id="avatar-alone")
        t.path(stella5_d(592, 155, 22, 9.5), fill=t.sfumatura(["#FFF8DA", "#FFD35E"]), id="avatar-stella")
        for cx, num, lab in [(652, "163", "post"), (711, "12,4K", "follower"), (765, "12", "seguiti")]:
            t.testo(num, cx, 148, 11.5, 700, NAVY, ancora="middle", id=f"conteggio-{lab}")
            t.testo(lab, cx, 160, 9.6, 400, "#4B5563", ancora="middle", id=f"conteggio-{lab}-etichetta")
        t.testo("AddiOFA", 562, 190, 10.8, 700, NAVY, id="bio-nome")
        t.testo("Il tuo inglese, senza ostacoli.", 562, 203, 9.4, 400, NAVY, id="bio-riga-1")
        emoji_laurea(t, 568, 217, 8)
        t.testo("Per gli studenti del Politecnico di Milano", 576, 220, 9.4, 400, NAVY, id="bio-riga-2")
        emoji_bersaglio(t, 568, 233, 5)
        t.testo("Quiz, strategie e risorse", 576, 236, 9.4, 400, NAVY, id="bio-riga-3")
        emoji_scintille(t, 568, 247, 7)
        t.testo("Supera l'OFA e sblocca il tuo percorso", 576, 250, 9.4, 400, NAVY, id="bio-riga-4")
        icona_link(t, 568, 262, 10, "#1456D8")
        t.testo("linktr.ee/addiofa", 576, 265, 9.4, 600, "#1456D8", id="bio-link")
        t.rett(562, 272, 86, 25, 6, fill="#1A63F2", id="pulsante-segui")
        t.testo("Segui", 605, 288, 10, 700, "#FFFFFF", ancora="middle")
        t.rett(655, 272, 90, 25, 6, fill="#EDEEF1", id="pulsante-messaggio")
        t.testo("Messaggio", 700, 288, 10, 700, NAVY, ancora="middle")
        t.rett(751, 272, 29, 25, 6, fill="#EDEEF1", id="pulsante-aggiungi")
        t.icona("utente", 759, 276, 12, NAVY, 2)
        cop = [("Quiz", lambda c, y: icona_documento(t, c, y)), ("Tips", None), ("Risultati", None), ("Studenti", None), ("FAQ", None)]
        for i, (lab, _) in enumerate(cop):
            cx = [576, 626, 674, 721, 768][i]
            copertina_highlight(t, cx, 328, 15.5, None, id=f"storia-{lab.lower()}", glifo=glifo_cover(lab))
            t.testo(lab, cx, 357, 7.8, 500, NAVY, ancora="middle", id=f"storia-{lab.lower()}-etichetta")


def icona_documento(t, cx, cy, s=14):
    t.rett(cx - s * 0.4, cy - s * 0.5, s * 0.8, s, s * 0.12, fill=t.sfumatura(["#3F86F8", "#1F5FE0"]), id="glifo-quiz-documento")
    for k in range(3):
        t.rett(cx - s * 0.2, cy - s * 0.25 + k * s * 0.22, s * (0.4 if k == 2 else 0.5), s * 0.08, s * 0.04, fill="#FFFFFF", opacita=0.85)


def glifo_cover(lab):
    def g(t, cx, cy, r):
        if lab == "Quiz":
            icona_documento(t, cx, cy, r * 0.9)
        elif lab == "Tips":
            t.cerchio(cx, cy - r * 0.1, r * 0.34, fill=t.sfumatura(["#FFD766", "#F5A623"]), id="glifo-lampadina")
            t.rett(cx - r * 0.16, cy + r * 0.22, r * 0.32, r * 0.2, r * 0.06, fill="#1B3C85")
            for a in (-60, -30, 0, 30, 60):
                rr = math.radians(a - 90)
                t.linea(cx + math.cos(rr) * r * 0.5, cy - r * 0.1 + math.sin(rr) * r * 0.5, cx + math.cos(rr) * r * 0.62, cy - r * 0.1 + math.sin(rr) * r * 0.62, "#F5B323", 1.1)
        elif lab == "Risultati" or lab == "OFA":
            for k, hh in enumerate([0.35, 0.6, 0.9]):
                t.rett(cx - r * 0.42 + k * r * 0.32, cy + r * 0.42 - r * hh, r * 0.22, r * hh, r * 0.05, fill=t.sfumatura(["#4F8CF7", "#1F5FE0"]), id=f"glifo-barra-{k+1}")
        elif lab == "Studenti":
            cappello_laurea(t, cx, cy, r * 1.15)
        elif lab == "FAQ":
            punto_interrogativo_tondo(t, cx, cy, r * 0.55)
        elif lab == "Trofeo":
            t.illustrazione("kit-blu/illustrazioni/successo", cx - r * 0.55, cy - r * 0.55, r * 1.1, id="glifo-trofeo")
    return g


# ------------------------------------------------------------------------------------------------ 03 highlight covers
def covers(t):
    t.rett(836, 22, 228, 266, 8, fill="#F6F9FE", id="pannello-sfondo")
    etichetta(t, 840, 34, "HIGHLIGHT COVERS")
    voci = [("Quiz", 871, 118, "Quiz"), ("Tips", 951, 118, "Tips"), ("Risultati", 1031, 118, "Trofeo"),
            ("Studenti", 871, 245, "Studenti"), ("FAQ", 951, 245, "FAQ"), ("OFA", 1031, 245, "OFA")]
    for lab, cx, cy, g in voci:
        copertina_highlight(t, cx, cy - 20 if False else cy - 14 if cy < 200 else cy - 14, 34, None, id=f"copertina-{lab.lower()}", glifo=glifo_cover(g))
        t.testo(lab, cx, cy + 36, 10.5, 500, "#3B4660", ancora="middle", id=f"copertina-{lab.lower()}-etichetta")


# ------------------------------------------------------------------------------------------------ 04 formati
def formati(t):
    xs = [(1101, 99), (1206, 99), (1311, 99), (1417, 99)]
    y, h = 55, 235
    metti(t, "formato-quiz-time", 1101, y, 99, h, T.f_quiz_time, 8)
    metti(t, "formato-tips-consigli", 1206, y, 99, h, T.f_tre_consigli, 8)
    metti(t, "formato-risultati-dati", 1311, y, 99, h, T.f_82, 8)
    p = foto_pulita(S26, (1417, 55, 1516, 290), "f26_community", [(1424, 62, 1500, 130)])
    cid = clip_rett(t, 1417, 55, 99, 235, 8)
    with t.gruppo("formato-community", clip=cid):
        t.foto(p, 1417, 55, 99, 235, id="foto-studente-edificio")
        t.testo("Stessi", 1427, 78, 11, 800, "#FFFFFF", id="titolo-riga-1")
        t.testo("studenti.", 1427, 91, 11, 800, "#FFFFFF", id="titolo-riga-2")
        t.testo("Percorsi", 1427, 104, 11, 800, "#FFFFFF", id="titolo-riga-3")
        t.testo("più luminosi.", 1427, 117, 11, 800, "#FFFFFF", id="titolo-riga-4")
    for cx, lab in [(1150, "Edu/Quiz"), (1255, "Tips/Consigli"), (1360, "Risultati/Dati"), (1467, "Community")]:
        t.testo(lab, cx, 307, 9.4, 400, "#3B4660", ancora="middle", id=f"etichetta-{lab}")


# ------------------------------------------------------------------------------------------------ 05 post
def post4(t, w, h):
    p = foto_pulita(S26, (443, 407, 443 + w, 407 + h), "p26_post4", [(455, 500, 575, 600)], dil=9)
    t.foto(p, 0, 0, w, h, id="foto-polimi")
    corsivo(t, ["SAME", "STUDENTS", "BRIGHTER", "PATHS"], 50, 120, 13, "#FFFFFF", rot=-12, passo=16, id="scritta-a-mano", skew=-8)


def posts(t):
    for (x, w, fn, nome) in [(23, 130, T.f_quiz_time, "post-1-quiz-time"), (159, 130, T.f_tre_consigli, "post-2-tre-consigli"),
                             (294, 128, T.f_82, "post-3-82-percento"), (443, 144, post4, "post-4-polimi"),
                             (593, 142, T.f_errori, "post-5-errori-comuni"), (742, 144, T.f_checklist_scura, "post-6-checklist")]:
        metti(t, nome, x, 407, w, 200, fn, 6)


# ------------------------------------------------------------------------------------------------ 06 stories
def stories(t):
    for (x, w, fn, nome) in [(910, 113, T.f_nuovo_quiz, "storia-1-nuovo-quiz"), (1030, 113, T.f_lo_sapevi, "storia-2-lo-sapevi"),
                             (1151, 112, T.f_tip, "storia-3-tip-del-giorno"), (1274, 111, T.f_risultato, "storia-4-risultato-personale"),
                             (1399, 114, T.f_motivazione, "storia-5-motivazione")]:
        metti(t, nome, x, 403, w, 210, fn, 6)


# ------------------------------------------------------------------------------------------------ 07 reels
def reel_foto(nome, box, rects, titolo, extra=None):
    def fn(t, w, h):
        p = foto_pulita(S26, box, nome, rects)
        t.foto(p, 0, 0, w, h, id="foto-sfondo")
        with T.sc(t, w):
            titolo(t)
        T.reel_giu(t, w, h, extra[0])
    return fn


def reels(t):
    f1 = reel_foto("r26_1", (23, 652, 147, 870), [(28, 658, 118, 742), (26, 848, 100, 868)], lambda t: (
        t.testo("3", 10, 42, 30, 800, "#FFFFFF", id="titolo-numero"), t.testo("consigli", 10, 58, 12.5, 800, "#FFFFFF", id="titolo-consigli"),
        t.testo("per superare", 10, 72, 10.5, 700, "#FFFFFF"), t.testo("l'OFA", 10, 88, 15, 800, "#FFFFFF")), ("125K",))
    f2 = reel_foto("r26_2", (155, 652, 282, 870), [(180, 685, 272, 765), (158, 848, 230, 868)], lambda t: (
        t.testo("Quiz reale", 63, 70, 10, 800, NAVY, ancora="middle", id="titolo-riga-1"), t.testo("dell'OFA", 63, 84, 10, 800, NAVY, ancora="middle", id="titolo-riga-2")), ("98K",))

    def r3(t, w, h):
        T.cielo_tessera(t, w, h); T.volumi(t, w, h, h * 0.8)
        with T.sc(t, w):
            t.testo("Errore", 12, 48, 14, 800, NAVY, id="titolo-riga-1"); t.testo("comune", 12, 64, 14, 800, NAVY, id="titolo-riga-2")
            t.cerchio(40, 92, 11, fill="#E5383B", id="croce-sfondo")
            t.path("M34 86l12 12M46 86l-12 12", stroke="#FFFFFF", sw=3.2)
            corsivo(t, ["DON'T", "DO THIS"], 50, 124, 9.5, "#1A3A8A", rot=-10, passo=12, id="scritta-a-mano", skew=-8)
        scrim_basso(t, 0, 0, w, h, 50, "#10204A", 0.55)
        T.reel_giu(t, w, h, "210K")
    f4 = reel_foto("r26_4", (424, 652, 551, 870), [(430, 690, 545, 745), (428, 848, 500, 868)], lambda t: (
        t.testo("La mia", 65, 42, 11, 800, NAVY, ancora="middle", id="titolo-riga-1"), t.testo("esperienza", 65, 55, 11, 800, NAVY, ancora="middle"),
        t.testo("con l'OFA", 65, 68, 11, 800, NAVY, ancora="middle")), ("76K",))

    def r5(t, w, h):
        p = foto_pulita(S26, (557, 652, 684, 870), "r26_5", [(562, 800, 682, 866), (625, 676, 682, 726)], chiaro=225)
        t.foto(p, 0, 0, w, h, id="foto-sfondo")
        with T.sc(t, w):
            stella4(t, 100, 26, 11, "#27B867", id="scintilla-verde")
            t.testo("Ce l'ho", 10, 152, 14, 800, "#FFFFFF", id="titolo-riga-1"); t.testo("fatta!", 10, 168, 14, 800, "#FFFFFF", id="titolo-riga-2")
            t.cerchio(84, 162, 13, fill="#27B867", stroke="#FFFFFF", sw=2, id="spunta-tondo")
            t.icona("spunta", 76, 154, 16, "#FFFFFF", 3)
        T.reel_giu(t, w, h, "142K")
    for (x, w, fn, nome) in [(23, 124, f1, "reel-1-tre-consigli"), (155, 127, f2, "reel-2-quiz-reale"), (289, 128, r3, "reel-3-errore-comune"),
                             (424, 127, f4, "reel-4-la-mia-esperienza"), (557, 127, r5, "reel-5-ce-l-ho-fatta")]:
        metti(t, nome, x, 652, w, 218, fn, 8)


# ------------------------------------------------------------------------------------------------ 08 caption / tono di voce
def caption(t):
    etichetta(t, 975, 648, "ESEMPI DI CAPTION")
    t.rett(975, 665, 205, 190, 10, fill="#FFFFFF", id="scheda-caption", filtro=t.ombra(1, 8, "#4C7CE0", 0.12))
    logo_mini(t, 983, 674, 16)
    t.testo("addiofa", 1006, 686, 9.6, 700, NAVY, id="caption-nome")
    for k in range(3):
        t.cerchio(1160 + k * 5, 682, 1.3, fill=NAVY)
    for i, r in enumerate(["3 consigli pratici per migliorare il tuo inglese", "e superare l'OFA."]):
        t.testo(r, 985, 717 + i * 12, 7.8, 400, "#2A3447", id=f"caption-riga-{i+1}")
    bandiera_uk(t, 1105, 729, 11)
    for i, r in enumerate(["Fai quiz regolarmente", "Guarda contenuti in inglese", "Simula il test con tempo limite"]):
        t.rett(985, 748 + i * 14, 8, 9, 2, fill=BLU_T, id=f"punto-{i+1}")
        t.testo(str(i + 1), 989, 755.5 + i * 14, 6, 700, "#FFFFFF", ancora="middle")
        t.testo(r, 998, 755.5 + i * 14, 7.8, 400, "#2A3447", id=f"elenco-{i+1}")
    t.testo("Small steps, big opportunities.", 985, 806, 7.8, 400, "#2A3447", id="caption-chiusura")
    t.testo("♥", 1117, 806, 7.8, 400, BLU_T)
    for i, r in enumerate(["#AddiOFA #Polimi #OFAInglese #StudentiPolimi", "#StudyTips #Quiz #PolitecnicoDiMilano"]):
        t.testo(r, 985, 828 + i * 11, 6.9, 400, "#4B5563", id=f"hashtag-riga-{i+1}")
    # tono di voce
    etichetta(t, 718, 648, "TONO DI VOCE")
    for lab, x, y, w in [("Chiaro", 713, 668, 82), ("Motivante", 800, 668, 82), ("Pratico", 887, 668, 78), ("Amichevole", 713, 701, 82),
                         ("Istituzionale", 800, 701, 82), ("Autentico", 887, 701, 78)]:
        t.rett(x, y, w, 20, 10, fill="#F7FAFF", stroke="#D5E0F2", sw=1, id=f"chip-{lab.lower()}")
        t.testo(lab, x + w / 2, y + 13.5, 7.8, 500, "#2A3447", ancora="middle")


# ------------------------------------------------------------------------------------------------ 09 applicazioni
def app_marchio(t, cx, cy, l):
    tile_marchio(t, cx - l / 2, cy - l / 2, l, id="icona-app")


def applicazioni(t):
    etichetta(t, 1198, 654, "APPLICAZIONI")
    # TikTok
    t.rett(1198, 664, 85, 163, 10, fill="#0A0A0A", id="tiktok-sfondo", stroke="#2A2A2A", sw=1)
    t.path("M1244 677v12a4 4 0 1 1-4-4", stroke="#FFFFFF", sw=1.6, id="tiktok-nota-generica")
    t.path("M1244 677c0 3 2 5 5 5", stroke="#FFFFFF", sw=1.6)
    app_marchio(t, 1240, 724, 33)
    t.testo("AddiOFA", 1240, 761, 7.8, 600, "#FFFFFF", ancora="middle", id="tiktok-nome")
    t.rett(1220, 775, 41, 14, 4, fill="#F0283C", id="tiktok-pulsante-segui")
    t.testo("Segui", 1240.5, 785, 5.4, 700, "#FFFFFF", ancora="middle")
    # YouTube
    t.rett(1283, 666, 113, 78, 6, fill="#FFFFFF", id="youtube-testata")
    t.rett(1283, 666, 113, 60, 0, fill=t.sfumatura(["#050B20", "#10265E"]), id="youtube-copertina")
    t.rett(1283, 726, 113, 18, 0, fill="#FFFFFF")
    t.circle = None
    t.cerchio(1340, 726, 20, fill="#FFFFFF", id="youtube-avatar-anello")
    app_marchio(t, 1340, 726, 26)
    t.testo("AddiOFA", 1340, 757, 8.4, 700, NAVY, ancora="middle", id="youtube-nome")
    t.testo("Il tuo inglese, senza ostacoli.", 1340, 766, 4.8, 400, "#6B7280", ancora="middle")
    t.rett(1318, 782, 62, 18, 9, fill="#0A0A0A", id="youtube-pulsante")
    t.testo("Iscriviti", 1349, 794, 6.6, 600, "#FFFFFF", ancora="middle")
    # LinkedIn
    t.rett(1396, 666, 115, 83, 6, fill=t.sfumatura(["#9CC8F8", "#E4F0FD"]), id="linkedin-copertina")
    nuvola(t, 1450, 690, 70, 0.9)
    t.cerchio(1453, 735, 18, fill="#FFFFFF", id="linkedin-avatar-anello")
    app_marchio(t, 1453, 735, 26)
    t.testo("AddiOFA", 1453, 770, 8.4, 700, NAVY, ancora="middle", id="linkedin-nome")
    t.testo("Studenti Polimi - Preparazione OFA di inglese", 1453, 779, 4.6, 400, "#6B7280", ancora="middle")
    t.rett(1416, 797, 81, 21, 10, fill="#1A63F2", id="linkedin-pulsante-segui")
    t.testo("Segui", 1456, 810.5, 7.6, 600, "#FFFFFF", ancora="middle")
    for cx, lab in [(1240, "TikTok"), (1340, "YouTube"), (1453, "LinkedIn")]:
        t.testo(lab, cx, 843, 8.4, 400, "#4B5563", ancora="middle", id=f"etichetta-{lab.lower()}")


# ------------------------------------------------------------------------------------------------ 10 pattern
def pattern(t):
    # 1 stella pallida
    t.rett(23, 913, 94, 90, 6, fill=t.sfumatura(["#F0F6FE", "#E3EDFC"]), id="pattern-stella-sfondo")
    t.path(stella5_d(72, 960, 34, 22), fill=t.sfumatura(["#F8FBFF", "#D3E2F9"]), id="pattern-stella-morbida", filtro=t.sfoca(0.8))
    t.path(f"M{n(45)} 955Q72 930 100 955", stroke="#FFFFFF", sw=3, opacita=0.7, id="pattern-stella-luce")
    # 2 blu notte con arco e scintilla
    cid = clip_rett(t, 122, 912, 110, 92, 6)
    with t.gruppo("pattern-notte-arco", clip=cid):
        t.rett(122, 912, 110, 92, 0, fill=t.sfumatura(["#0C2A86", "#1E4FC0", "#3C79E0"], 0, 0, 1, 1), id="pattern-notte-sfondo")
        t.path("M122 1000Q170 925 232 925", stroke="#FFFFFF", sw=0.9, opacita=0.8, id="pattern-notte-linea")
        stella4(t, 196, 934, 6, "#FFFFFF", id="pattern-notte-scintilla")
    # 3 nuvole
    cid = clip_rett(t, 232, 913, 109, 91, 6)
    with t.gruppo("pattern-nuvole", clip=cid):
        t.rett(232, 913, 109, 91, 0, fill=t.sfumatura(["#2E71DE", "#8EBBF3", "#D8EAFD"]), id="pattern-nuvole-sfondo")
        for cx, cy, w in [(262, 975, 80), (318, 950, 70), (290, 995, 90), (330, 990, 60)]:
            nuvola(t, cx, cy, w, 0.95)
    # 4 edificio bianco (volumi)
    cid = clip_rett(t, 341, 913, 100, 91, 6)
    with t.gruppo("pattern-edificio", clip=cid):
        t.rett(341, 913, 100, 91, 0, fill=t.sfumatura(["#BFD8F7", "#EAF3FE"]), id="pattern-edificio-cielo")
        t.path("M341 945L400 930L441 940V1004H341z", fill=t.sfumatura(["#F3F5F9", "#CBD3E0"]), id="pattern-edificio-fronte")
        t.path("M400 930L441 940V1004H405z", fill="#B9C3D4", opacita=0.7, id="pattern-edificio-lato")
        t.path("M341 945L400 930", stroke="#FFFFFF", sw=1.5)
    # 5 fascia punti, 6 punti
    t.rett(445, 914, 20, 88, 4, fill="#F1F6FE", id="pattern-fascia-sfondo")
    for j in range(8):
        t.cerchio(455, 922 + j * 10.5, 1.1, fill="#9CB8EA", id=f"pattern-fascia-punto-{j+1}")
    t.rett(465, 913, 59, 89, 4, fill="#F4F8FF", id="pattern-punti-sfondo")
    for i in range(6):
        for j in range(9):
            t.cerchio(473 + i * 9.6, 922 + j * 9.6, 1.1, fill="#A7C0EE")
    # 7 linee ad arco
    t.rett(528, 913, 84, 91, 6, fill=t.sfumatura(["#F3F8FF", "#E4EEFC"]), id="pattern-archi-sfondo")
    for k, rr in enumerate([60, 74, 88]):
        t.path(f"M528 {n(1003 - rr * 0.1)}A{rr} {rr} 0 0 1 {n(528 + rr * 0.95)} 913", stroke="#B6CDF3", sw=0.9, id=f"pattern-arco-{k+1}")


# ------------------------------------------------------------------------------------------------ 11 grafiche testo
def grafiche(t):
    etichetta(t, 634, 903, "GRAFICHE TESTO")
    t.testo("Il tuo inglese,", 636, 955, 8.8, 800, NAVY, id="testo-1-riga-1"); t.testo("senza ostacoli.", 636, 966, 8.8, 800, NAVY, id="testo-1-riga-2")
    corsivo(t, ["SMALL", "STEPS", "BIG", "OPPORTUNITIES"], 716, 944, 10, BLU_T, rot=-12, passo=13, id="testo-2-a-mano", skew=-8)
    t.testo("Dal Polimi", 797, 956, 9.2, 800, NAVY, id="testo-3-riga-1"); t.testo("al tuo futuro.", 797, 968, 9.2, 800, NAVY, id="testo-3-riga-2")
    t.testo("Quiz.", 868, 951, 9.2, 800, NAVY); t.testo("Strategie.", 868, 962, 9.2, 800, BLU_T); t.testo("Risultati.", 868, 973, 9.2, 800, NAVY)


# ------------------------------------------------------------------------------------------------ 12 copertina
def copertina(t):
    x0, y0, w, h = 939, 909, 578, 94
    cid = clip_rett(t, x0, y0, w, h, 6)
    with t.gruppo("copertina-clip", clip=cid):
        t.rett(x0, y0, w, h, 0, fill="#FFFFFF", id="fondo")
        # scena a destra: cielo + volumi + blocco-marchio
        t.rett(1100, y0, 417, h, 0, fill=t.sfumatura(["#FFFFFF", "#CFE4FC", "#7FB1F0"], 0, 0, 1, 0), id="cielo")
        t.path("M1240 909L1517 909L1517 1003L1240 1003z", fill="none")
        t.path("M1300 960L1517 940V1003H1300z", fill=t.sfumatura(["#F3F5F9", "#C9D1DE"]), id="gradinata")
        t.path("M1420 909H1517V960H1420z", fill=t.sfumatura(["#EEF1F6", "#D4DBE7"]), id="volume-alto")
        t.path("M1330 984H1517M1360 972H1517M1395 962H1517", stroke="#FFFFFF", sw=1.2, opacita=0.8, id="linee-gradini")
        t.rett(1280, 920, 55, 60, 14, fill=t.sfumatura(["#1D49C2", "#0E2C94"]), id="blocco-marchio", filtro=t.ombra(2, 6, "#06124A", 0.35))
        t.cerchio(1307, 950, 24, fill=t.radiale([(0, "#FFE9A6", 0.9), (1, "#FFC94F", 0)], 0.5, 0.5, 0.5), id="stella-alone")
        t.path(stella5_d(1307, 951, 17, 7.5), fill=t.sfumatura(["#FFF8DA", "#FFD35E"]), id="stella-luminosa")
        t.rett(1100, y0, 150, h, 0, fill=t.sfumatura([(0, "#FFFFFF"), (1, "#FFFFFF00")], 0, 0, 1, 0), id="velo")
        corsivo(t, ["SAME", "STUDENTS", "BRIGHTER", "PATHS"], 1430, 934, 9.5, "#FFFFFF", rot=-12, passo=12.5, id="scritta-a-mano", skew=-8)
    wordmark(t, 963, 965, 38, col=NAVY, col_o=BLU_T, id="wordmark-copertina")
    t.testo("IL TUO INGLESE, SENZA OSTACOLI.", 965, 985, 7.2, 500, NAVY, spaziatura=1.4, id="tagline")


def main():
    uno("02-profilo-instagram-telefono", (537, 22, 805, 367), profilo_telefono, "#F8FAFE")
    uno("03-highlight-covers", (836, 22, 1064, 288), covers, "#F6F9FE")
    uno("04-formati-di-contenuto", (1099, 55, 1517, 312), formati, "#FFFFFF")
    uno("05-template-post-instagram", (23, 404, 891, 612), posts, "#FFFFFF")
    uno("06-template-stories", (909, 397, 1523, 618), stories, "#FFFFFF")
    uno("07-template-reels-tiktok", (23, 648, 687, 875), reels, "#FFFFFF")
    uno("08-esempi-di-caption-e-tono-di-voce", (708, 638, 1190, 850), caption, "#FFFFFF")
    uno("09-applicazioni", (1190, 648, 1523, 852), applicazioni, "#FFFFFF")
    uno("10-pattern-e-background", (23, 909, 612, 1004), pattern, "#FFFFFF")
    uno("11-grafiche-testo", (628, 900, 920, 996), grafiche, "#FFFFFF")
    uno("12-copertina-social", (939, 909, 1517, 1003), copertina, "#FFFFFF")


if __name__ == "__main__":
    main()
