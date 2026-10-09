"""Banner verticali (immagine 32 di design-concept): tre pagine di landing 'Oltre l'OFA' come pannelli alti 1672 px.

Si disegna in coordinate 'vista' = pixel dell'originale x 1,5 (stessa misura delle viste usate per leggere i testi); un gruppo
trasla di dx per portare il bordo sinistro del banner a 0. Il pannello è tagliato da un rettangolo arrotondato (r 18 px originali).
Vettoriale: tutti i testi (Inter tracciati), pulsanti, wordmark, telefono, schede di vetro con icone, timeline, anello 82 %,
badge degli store, sfumature navy, bordi strappati. RASTER dichiarato (render 3D/fotografie): arco con stella e scalinata,
skyline di Milano, parete 'SAME STUDENTS HIGHER HORIZONS', studente alla scrivania con pannelli di vetro, rocce di ghiaccio,
arco con il Duomo, volto del video, arco stella notturno. I testi sovrapposti dall'AI alle foto sono tolti con inpaint e rifatti in vettoriale.
Corregge: 'Sarica su' -> 'Scarica su'; il sigillo del Politecnico è un segnaposto circolare neutro; scritta 'Probabilità' corretta
(nell'originale 'Probablità'); 'Stessi studenti. Percorsi...' coerenti con le altre slide.
Uso: python3 gen_banner.py [1|2|3]
"""
import sys
from extra import *
from gen_locandine import pulisci
import numpy as np, cv2
from PIL import Image

K = 1.5
SRC = "file_000000008f5c82109632fc8fed9b6ca6.png"
OUTD = LAYOUT / "32-banner-verticali"
BAN = {1: dict(x0=5, x1=306, cx=0, dx=7.5, nome="01-banner-hero"),
       2: dict(x0=313, x1=630, cx=308, dx=7.5, nome="02-banner-funzionalita"),
       3: dict(x0=636, x1=938, cx=634, dx=3, nome="03-banner-storie")}
NAVY_B = "#071536"
CHIARO = "#E6EBF5"
INK_B = "#0B1A4A"
BLU_T = "#3F7FF5"


def orig():
    return Image.open(ORIG / SRC).convert("RGB")


def cropv(im, vx0, vy0, vx1, vy1, cx):
    """Ritaglio dell'originale dalle coordinate vista (x vista relativa alla vista che parte da cx)."""
    return im.crop((int(round(vx0 / K + cx)), int(round(vy0 / K)), int(round(vx1 / K + cx)), int(round(vy1 / K))))


def mostra(t, im, vx0, vy0, vx1, vy1, cx, **kw):
    foto_forma(t, cropv(im, vx0, vy0, vx1, vy1, cx), vx0, vy0, vx1 - vx0, vy1 - vy0, **kw)


def pannello(b, h_orig=1672):
    W = (b["x1"] - b["x0"]) * K; H = h_orig * K
    t = TelaC(W, H, None, id=f"banner-{b['nome']}")
    cid = ui.clip_rett(t, 0, 0, W, H, 27)
    t.add(f'<g id="pannello" clip-path="url(#{cid})"><g id="contenuto" transform="translate({n(-b["dx"])} 0)">')
    return t, W, H


def chiudi(t):
    t.add("</g></g>")


def torn(punti, seme=2, amp=2.2):
    return strappo(punti, amp, 12, seme)


def testo_l(t, s, x, y, dim, peso, col, id=None, spaz=0.0, ancora="start", opacita=None):
    t.testo(s, x, y, dim, peso, col, ancora, id=id, spaziatura=spaz, opacita=opacita)


def pillola_cta(t, x, y, w, h, etichetta, id, scuro=False):
    with t.gruppo(id):
        t.rett(x, y, w, h, h / 2, fill="#FFFFFF", filtro=t.ombra(4, 14, "#000000", 0.30))
        lw = larghezza_testo(etichetta, 20, 600)
        t.testo(etichetta, x + 46, y + h / 2 + 7, 20, 600, INK_B, id=id + "-testo")
        t.icona("freccia-destra", x + w - 64, y + h / 2 - 9, 18, INK_B, 2)


def banner1():
    b = BAN[1]; im = orig(); t, W, H = pannello(b); cx = b["cx"]
    t.rett(0, 0, W + 20, H, 0, fill=NAVY_B, id="sfondo-navy")
    t.rett(0, 1560, W + 20, 2508 - 1560, 0, fill=t.sfumatura(["#E8ECF6", "#F1F3F9"], 0, 1560, 0, 2508, userspace=True), id="sfondo-chiaro")
    # --- hero: arco con la stella (raster), senza i testi sovrapposti
    h = pulisci(im, regioni_scure=[], rett=[])
    a = cv2.cvtColor(np.asarray(im), cv2.COLOR_RGB2BGR)
    m = np.zeros(a.shape[:2], np.uint8)
    for (x0, y0, x1, y1) in [(0, 0, 306, 40), (30, 80, 120, 200)]:
        sub = a[y0:y1, x0:x1]
        m[y0:y1, x0:x1] |= ((sub.min(axis=2) > 150).astype(np.uint8) * 255)
    m = cv2.dilate(m, np.ones((5, 5), np.uint8))
    hero = Image.fromarray(cv2.cvtColor(cv2.inpaint(a, m, 5, cv2.INPAINT_TELEA), cv2.COLOR_BGR2RGB))
    mostra(t, hero, 8, 0, 459, 740, cx, id="foto-arco-stella", fade=(0, 640, 0, 735, [(0, 1), (1, 0)]))
    # velo che riporta al navy dietro al titolo
    # barra alta
    with t.gruppo("barra-alta"):
        t.inserisci_svg((LOGO / "marchio-tile-scuro.svg").read_text(), 36, 14, 42, "marchio-tile")
        testo_l(t, "AddiOFA", 85, 45, 25, 700, "#FFFFFF", id="logo-testo")
        testo_l(t, "Menu", 360, 42, 14, 500, "#FFFFFF", id="menu-testo")
        for i in range(3): t.rett(413, 31 + i * 5.5, 16, 2, 1, fill="#FFFFFF", id=f"menu-riga-{i + 1}")
    with t.gruppo("elenco-verticale"):
        for i, s in enumerate(["STUDIA", "PREPARATI", "SUPERA", "SBLOCCA", "IL TUO", "PERCORSO"]):
            testo_l(t, s, 55, 149 + i * 25.4, 12.5, 400, "#FFFFFF", spaz=3.9, id=f"elenco-{i + 1}", opacita=0.88)
    # titolo
    gt = t.sfumatura(["#3F7BF2", "#6D9EFA"], 60, 0, 395, 0, userspace=True)
    for i, (s, y, lw, c) in enumerate([("Oltre", 815, 197, "#FFFFFF"), ("l’OFA,", 893, 210, "#FFFFFF"), ("un passo", 965, 332, gt), ("in più.", 1030, 223, gt)]):
        riga(t, s, 60, y, lw, 700, c, -0.02, id=f"titolo-riga-{i + 1}")
    for i, s in enumerate(["AddiOFA ti aiuta a superare l’OFA di inglese", "con un percorso personalizzato, evitando", "rischi, costi e blocchi del tuo piano di studi."]):
        riga(t, s, 57, 1107 + i * 25.5, [365, 345, 357][i], 400, "#D9E1F2", 0, id=f"paragrafo-{i + 1}")
    pillola_cta(t, 58, 1196, 233, 66, "Inizia ora", "pulsante-inizia-ora")
    # --- skyline di Milano con bordo strappato
    top = [(0, 1325), (40, 1330), (80, 1338), (130, 1358), (180, 1370), (240, 1392), (290, 1370), (330, 1350), (380, 1330), (420, 1310), (470, 1294)]
    city = im.copy()
    a2 = cv2.cvtColor(np.asarray(city), cv2.COLOR_RGB2BGR); m2 = np.zeros(a2.shape[:2], np.uint8)
    sub = a2[970:1050, 25:190]; m2[970:1050, 25:190] |= ((sub.min(axis=2) > 165).astype(np.uint8) * 255)
    m2[1050:1064, 30:52] |= 255
    m2[1070:1092, 150:170] |= 255
    m2 = cv2.dilate(m2, np.ones((5, 5), np.uint8))
    city = Image.fromarray(cv2.cvtColor(cv2.inpaint(a2, m2, 5, cv2.INPAINT_TELEA), cv2.COLOR_BGR2RGB))
    bottom = [(457 + 8, 1666), (240 + 8, 1695), (150 + 8, 1670), (8, 1638)]
    polig = [(8 + 0, 1292), (470, 1292)] + [(470, 1666), (400 + 8, 1655), (360 + 8, 1670), (300 + 8, 1685), (240 + 8, 1695), (200 + 8, 1682), (150 + 8, 1670), (100 + 8, 1655), (60 + 8, 1647), (8, 1635)]
    d = strappo(polig, 2, 12, 7)
    mostra(t, city, 8, 1292, 459, 1700, cx, clip_d=d, id="foto-skyline-milano")
    dn = strappo([(0, 1290), (470, 1290), (470, 1294)] + top[::-1][1:] + [(0, 1325)], 2.2, 12, 5)
    t.path(dn, fill=NAVY_B, id="strappo-navy-superiore")
    testo_l(t, "SCORRI", 239, 1305, 10.5, 500, "#98A7CB", spaz=2, ancora="middle", id="scorri")
    t.rett(237.5, 1325, 1.6, 24, 0.8, fill="#E5ECFA", id="scorri-linea")
    testo_l(t, "Lo stesso", 55, 1493, 27, 600, "#FFFFFF", id="slogan-1")
    testo_l(t, "obiettivo.", 55, 1524, 27, 600, "#FFFFFF", id="slogan-2")
    testo_l(t, "Un domani più aperto.", 55, 1555, 17.5, 400, "#E9EEF9", id="slogan-3")
    # --- sezione chiara
    testo_l(t, "PERCHÉ ADDIOFA", 52, 1743, 13, 500, "#56658A", spaz=1.6, id="etichetta-sezione")
    riga(t, "Il primo passo", 52, 1800, 238, 700, INK_B, -0.015, id="titolo-sezione-1")
    riga(t, "per non fermarti.", 52, 1844, 288, 700, INK_B, -0.015, id="titolo-sezione-2")
    for i, (s, lw) in enumerate([("L’OFA di inglese può bloccare il tuo", 312), ("percorso al Politecnico. AddiOFA", 288), ("ti dà gli strumenti per superarlo", 280), ("in modo semplice, efficace e su misura.", 350)]):
        riga(t, s, 52, 1885 + i * 24.5, lw, 400, "#56628A", 0, id=f"paragrafo-sezione-{i + 1}")
    # --- foto finale: parete con la scritta incisa (raster)
    top2 = [(0, 1990), (60, 1996), (120, 2012), (190, 2030), (250, 2002), (330, 2020), (400, 1998), (470, 2008)]
    d2 = strappo(top2 + [(470, 2512), (0, 2512)], 2.5, 12, 11)
    mostra(t, im, 8, 1980, 459, 2508, cx, clip_d=d2, id="foto-parete-same-students")
    chiudi(t)
    return t


def vetro(t, x, y, w, h, rot, id):
    """Scheda di vetro (bianco traslucido con bordo chiaro e ombra lilla), ruotata attorno al suo centro."""
    cx, cy = x + w / 2, y + h / 2
    t.add(f'<g id="{id}" transform="rotate({n(rot)} {n(cx)} {n(cy)})">')
    t.rett(x, y, w, h, 34, fill="#FFFFFF", opacita=0.62, filtro=t.ombra(8, 26, "#5B6FB8", 0.22), id=id + "-vetro")
    t.rett(x + 1, y + 1, w - 2, h - 2, 33, fill="none", stroke="#FFFFFF", sw=2, opacita=0.9)
    t.rett(x + 6, y + 4, w - 12, h * 0.45, 30, fill=t.sfumatura([(0, "#FFFFFF"), (1, "#FFFFFF")], 0, 0, 0, 1), opacita=0.18)
    return cx, cy


def fine_gruppo(t):
    t.add("</g>")


def bandiera_uk(t, x, y, w, id="bandiera-uk"):
    """Bandiera del Regno Unito 2:1 (diagonali rosse sfalsate), angoli arrotondati."""
    h = w / 2
    cid = t.uid("cb"); t.defs.append(f'<clipPath id="{cid}"><rect x="0" y="0" width="60" height="30" rx="3"/></clipPath>')
    k = w / 60
    t.add(f'<g id="{id}" clip-path="url(#{cid})" transform="translate({n(x)} {n(y)}) scale({n(k)})"><rect width="60" height="30" fill="#25449C"/>'
          '<path d="M0 0 60 30M60 0 0 30" stroke="#FFFFFF" stroke-width="6"/>'
          '<path d="M0 0 30 15M60 30 30 15" stroke="#D3243B" stroke-width="2"/>'
          '<path d="M60 0 30 15M0 30 30 15" stroke="#D3243B" stroke-width="2" transform="translate(0 0)"/>'
          '<path d="M30 0V30M0 15H60" stroke="#FFFFFF" stroke-width="10"/><path d="M30 0V30M0 15H60" stroke="#D3243B" stroke-width="6"/></g>')


def banner2():
    b = BAN[2]; im = orig(); t, W, H = pannello(b); cx = b["cx"]
    # sfondo: navy in alto, piano bianco inclinato, poi chiaro
    t.rett(0, 0, W + 20, 1000, 0, fill=t.sfumatura(["#0A1B47", "#0D2358", "#14316F"], 0, 0, 0, 1, userspace=False), id="sfondo-navy")
    t.rett(0, 760, W + 20, H - 760, 0, fill=t.sfumatura([(0, "#DCE3F2"), (0.25, "#EDF0F8"), (1, "#F4F6FB")], 0, 760, 0, 1700, userspace=True), id="sfondo-chiaro")
    t.path("M0 490 L470 735 L470 1010 L0 1010 Z", fill=t.sfumatura([(0, "#C9D5EE"), (0.5, "#E6ECF7"), (1, "#EEF1F9")], 0, 490, 0, 1000, userspace=True), id="piano-bianco-inclinato")
    t.path("M0 490 L470 735 L470 760 L0 520 Z", fill="#FFFFFF", opacita=0.55, id="piano-bianco-luce")
    t.path("M0 0H470V1000H0Z", fill=t.sfumatura([(0, "#0A1B47", 1), (1, "#0A1B47", 0)], 0, 0, 0, 1) if False else "none")
    testo_l(t, "COME FUNZIONA", 47, 45, 13, 500, "#7F9BD6", spaz=1.8, id="etichetta-1")
    testo_l(t, "\\ 01", 420, 94, 13, 400, "#9FB0D6", id="indice-01")
    riga(t, "Un percorso", 47, 105, 225, 600, "#FFFFFF", -0.015, id="titolo-1-riga-1")
    riga(t, "che si adatta a te.", 47, 150, 315, 600, "#FFFFFF", -0.015, id="titolo-1-riga-2")
    riga(t, "Dall’analisi iniziale al superamento,", 47, 192, 310, 400, "#D3DBEE", 0, id="sottotitolo-1-riga-1")
    riga(t, "tutto in un’unica esperienza.", 47, 216, 255, 400, "#D3DBEE", 0, id="sottotitolo-1-riga-2")
    # telefono
    with t.gruppo("telefono-risultato", trasforma="rotate(2 183 535)"):
        t.rett(40, 290, 285, 520, 40, fill="#000", opacita=0.35, filtro=t.sfoca(14), id="telefono-ombra")
        t.rett(46, 268, 272, 530, 40, fill=t.sfumatura(["#8E98B5", "#2A3558", "#6F7B9E"], 0, 0, 1, 1), id="telefono-telaio")
        t.rett(51, 273, 262, 520, 36, fill="#141C38")
        t.rett(57, 279, 250, 508, 31, fill="#F7F8FC", id="telefono-schermo")
        t.rett(150, 284, 64, 18, 9, fill="#141C38", id="telefono-notch")
        t.inserisci_svg((LOGO / "marchio-tile-scuro.svg").read_text(), 128, 321, 26, "marchio-tile-telefono")
        riga(t, "AddiOFA", 157, 340, 54, 700, "#0B1A4A", 0, id="telefono-logo")
        riga(t, "Sei a rischio?", 118, 392, 107, 700, "#0B1A4A", 0, id="telefono-titolo")
        t.misuratore(182, 510, 70, 0.82, spessore=17, colore="#EF4444", chiaro="#FF8A8A", vuoto="#F3DADA", tacche=False, id="telefono-misuratore")
        riga(t, "82%", 182, 508, 74, 800, "#E5322D", 0, ancora="middle", id="telefono-percentuale")
        t.testo("Probabilità di", 182, 531, 12, 600, "#0B1A4A", "middle")
        t.testo("non superare l’OFA", 182, 548, 12, 600, "#E5322D", "middle")
        t.rett(70, 565, 224, 66, 14, fill="#FDECEC", id="telefono-card-rischio")
        t.icona("documento", 82, 582, 30, "#E5322D", 1.8)
        t.testo("Rischi di perdere", 192, 590, 11.5, 400, "#0B1A4A", "middle")
        t.testo("circa 30€", 192, 612, 15, 600, "#E5322D", "middle")
        t.rett(70, 650, 224, 46, 14, fill="#EF4444", id="telefono-pulsante", filtro=t.ombra(3, 8, "#EF4444", 0.3))
        t.testo("Inizia a studiare", 160, 678, 13, 600, "#FFFFFF", "middle"); t.icona("freccia-destra", 220, 666, 14, "#FFFFFF", 2)
        for i, (ic, et, c) in enumerate([("casa", "Adesso", AZZ2), ("scudo", "Studio", "#8A94A6"), ("grafico", "Statistiche", "#8A94A6")]):
            xx = 105 + i * 78
            t.icona(ic, xx - 8, 724, 16, c, 1.8); t.testo(et, xx, 758, 9.5, 500, c, "middle")
    # timeline
    with t.gruppo("timeline"):
        t.rett(336, 332, 1.6, 296, 0.8, fill=t.sfumatura(["#4F7BE0", "#2C4684"], 0, 0, 0, 1), id="timeline-linea")
        for i, (cy, num, l1, l2, l3, act) in enumerate([(308, "01", "Test iniziale", None, None, True), (402, "02", "Piano", "personalizzato", None, False),
                                                       (523, "03", "Simulazioni", "reali", None, False), (640, "04", "Supera l’OFA", None, None, False)]):
            if act:
                t.cerchio(337, cy, 26, fill="#3B7BFF", opacita=0.28)
            t.cerchio(337, cy, 17 if not act else 19, fill="#12275F" if not act else "#2B62E6", stroke="#4F78D8" if not act else "#7FA8FF", sw=1.6, id=f"timeline-passo-{i + 1}")
            t.testo(num, 337, cy + 4.5, 12, 500, "#FFFFFF" if act else "#B8C4E4", "middle")
            if act:
                t.testo("01", 368, 306, 12, 600, "#5E94FF"); t.testo(l1, 368, 330, 14.5, 700, "#FFFFFF")
            else:
                t.testo(num, 368, cy - 4 if l2 else cy - 4, 12, 500, "#C9D3EC")
                t.testo(l1, 368, cy + (22 if l2 else 22), 14.5, 400 if num != "04" else 400, "#FFFFFF")
                if l2: t.testo(l2, 368, cy + 40, 14.5, 400, "#FFFFFF")
    # sezione funzionalità
    testo_l(t, "FUNZIONALITÀ", 47, 878, 13, 500, "#566695", spaz=1.8, id="etichetta-2")
    testo_l(t, "\\ 02", 420, 882, 13, 400, "#6F7D9F", id="indice-02")
    for i, (s_, y, lw) in enumerate([("Tutto quello", 930, 205), ("che ti serve,", 978, 213), ("in un’unica app.", 1022, 283)]):
        riga(t, s_, 47, y, lw, 700, INK_B, -0.015, id=f"titolo-2-riga-{i + 1}")
    # schede di vetro
    cards = [(22, 1054, 226, 228, -7, "Quiz interattivi", ["Domande come", "nell’esame reale."], "uk"),
             (268, 1052, 198, 226, 4, "Simulazioni ufficiali", ["Timer e formato", "autentico."], "cap"),
             (72, 1286, 200, 196, -7, "Analisi del livello", ["Statistiche chiare", "e dettagliate."], "grafico"),
             (286, 1270, 180, 196, 4, "Spiegazioni semplici", ["Teoria, esempi", "e consigli pratici."], "lampadina")]
    for i, (x, y, w, h, rot, tit, sub, ic) in enumerate(cards):
        cx_, cy_ = vetro(t, x, y, w, h, rot, f"scheda-{i + 1}")
        t.cerchio(cx_, y + 46, 34, fill={"uk": "#DCE8FD", "cap": "#E6EEFD", "grafico": "#D6F2E0", "lampadina": "#FCEBC8"}[ic])
        if ic == "uk":
            t.rett(cx_ - 20, y + 20, 32, 40, 3, fill="#FFFFFF", id="scheda-1-foglio"); bandiera_uk(t, cx_ - 17, y + 24, 26)
            bandiera_uk(t, cx_ - 17, y + 41, 26, id="bandiera-uk-2")
        elif ic == "cap":
            t.icona("cappello-pieno", cx_ - 28, y + 22, 52, "#2F63D8"); t.cerchio(cx_ + 22, y + 52, 12, fill="#FFFFFF", stroke="#EF6A3A", sw=3); t.linea(cx_ + 22, y + 52, cx_ + 22, y + 46, "#EF6A3A", 2); t.linea(cx_ + 22, y + 52, cx_ + 27, y + 54, "#EF6A3A", 2)
        elif ic == "grafico":
            for j, hh in enumerate((16, 28, 40)): t.rett(cx_ - 20 + j * 15, y + 66 - hh, 10, hh, 3, fill="#3CC272")
        else:
            t.icona("lampadina", cx_ - 20, y + 26, 40, "#F7B01B", 1.8, fill_pieno="#FBC53C")
        riga(t, tit, cx_, y + 100, min(w - 40, larghezza_testo(tit, 16, 700) * 0.96), 700, INK_B, 0, ancora="middle", id=f"scheda-{i + 1}-titolo")
        for j, ss in enumerate(sub):
            t.testo(ss, cx_, y + 124 + j * 18, 13.5, 400, "#6F7C9B", "middle", id=f"scheda-{i + 1}-testo-{j + 1}")
        fine_gruppo(t)
    t.rett(0, 1800, W + 20, H - 1800, 0, fill=t.sfumatura(["#DEE4F2", "#EEF1F8"], 0, 1800, 0, 2508, userspace=True), id="sfondo-dati")
    # studente alla scrivania con pannelli di vetro (raster)
    mostra(t, im, 8, 1485, 459, 1862, cx, clip_d=strappo([(0, 1485), (480, 1485), (480, 1850), (470, 1848), (400, 1842), (340, 1830), (280, 1823), (220, 1818), (160, 1807), (110, 1792), (80, 1778), (50, 1768), (0, 1790)], 2.5, 12, 8),
           fade=(0, 1485, 0, 1545, [(0, 0), (1, 1)]), id="foto-studente-scrivania")
    # sezione dati
    # sezione dati reali
    testo_l(t, "DATI REALI", 47, 1873, 13, 500, "#566695", spaz=1.8, id="etichetta-3")
    testo_l(t, "\\ 03", 420, 1890, 13, 400, "#6F7D9F", id="indice-03")
    riga(t, "Molti studenti", 47, 1930, 233, 700, INK_B, -0.015, id="titolo-3-riga-1")
    riga(t, "partono a rischio.", 47, 1971, 277, 700, INK_B, -0.015, id="titolo-3-riga-2")
    for i, (s_, lw) in enumerate([("In base alle nostre analisi, l’82% degli studenti", 383), ("che inizia senza preparazione adeguata", 335), ("non supera l’OFA al primo tentativo.", 308)]):
        riga(t, s_, 47, 2010 + i * 25, lw, 400, "#55617F", 0, id=f"paragrafo-3-{i + 1}")
    # rocce di ghiaccio (raster, con l'anello dell'AI tolto) + anello 82 % vettoriale
    a = cv2.cvtColor(np.asarray(im), cv2.COLOR_RGB2BGR)
    x0, x1, y0, y1 = 313, 630, 1170, 1585 - 25
    sub = a[y0:y1, x0:x1]; hsv = cv2.cvtColor(sub, cv2.COLOR_BGR2HSV)
    blu = ((hsv[..., 0] > 100) & (hsv[..., 0] < 130) & (hsv[..., 1] > 70)).astype(np.uint8) * 255
    blu = cv2.dilate(blu, np.ones((9, 9), np.uint8))
    sub2 = cv2.inpaint(sub, blu, 8, cv2.INPAINT_TELEA)
    a[y0:y1, x0:x1] = sub2
    ghiaccio = Image.fromarray(cv2.cvtColor(a, cv2.COLOR_BGR2RGB))
    mostra(t, ghiaccio, 8, 2170, 459, 2360, cx, fade=(0, 2170, 0, 2360, [(0, 0), (0.18, 1), (0.88, 1), (1, 0)]), id="foto-rocce-ghiaccio")
    cx_r, cy_r, R = 244, 2203, 118
    t.cerchio(cx_r, cy_r, R + 24, fill="#E8EDFA", opacita=0.9, id="anello-guscio")
    t.cerchio(cx_r, cy_r, R - 22, fill=t.radiale([(0, "#9DB8F6", 0.55), (1, "#6F95EE", 0.75)], 0.5, 0.4, 0.6), id="anello-vetro-interno")
    t.path(f"M{n(cx_r)} {n(cy_r - R)}A{R} {R} 0 1 1 {n(cx_r - R * math.sin(math.radians(2)))} {n(cy_r - R * math.cos(math.radians(2)))}", stroke="#E2E8FA", sw=44, id="anello-fondo")
    th = math.radians(360 * 0.82)
    ex, ey = cx_r + R * math.sin(th), cy_r - R * math.cos(th)
    t.path(f"M{n(cx_r)} {n(cy_r - R)}A{R} {R} 0 1 1 {n(ex)} {n(ey)}", stroke=t.sfumatura(["#2B60F0", "#4C86FA", "#2B60F0"], 0, 0, 1, 1), sw=44, id="anello-valore")
    riga(t, "82%", cx_r, 2225, 118, 700, "#FFFFFF", 0, ancora="middle", id="anello-percentuale")
    # statistiche
    for i, (xc, ic, a1, a2_, big) in enumerate([(115, None, "di tasse aggiuntive", "in media", "~30€"), (245, "scudo", "Piano di studi", "bloccato", None), (390, "orologio", "Rischi di dover", "ripetere un anno", None)]):
        if big: riga(t, big, xc, 2412, 56, 700, INK_B, 0, ancora="middle", id="stat-1-valore")
        else: t.icona(ic, xc - 11, 2388, 22, INK_B, 1.8, id=f"stat-{i + 1}-icona")
        t.testo(a1, xc, 2440, 13.5, 400, INK_B, "middle", id=f"stat-{i + 1}-riga-1"); t.testo(a2_, xc, 2459, 13.5, 400, INK_B, "middle", id=f"stat-{i + 1}-riga-2")
    for xd in (175, 318): t.linea(xd, 2385, xd, 2455, "#B6BFD4", 1.2)
    chiudi(t)
    return t


def pulisci_chiaro(im, cx, rects_vista, delta=28, dil=5, k_med=17):
    """Toglie scritte chiare sottili sovrapposte a una foto (maschera = pixel molto più chiari del loro intorno) e ricostruisce con inpaint."""
    a = cv2.cvtColor(np.asarray(im), cv2.COLOR_RGB2BGR)
    g = cv2.cvtColor(a, cv2.COLOR_BGR2GRAY)
    med = cv2.medianBlur(g, k_med)
    m = np.zeros(g.shape, np.uint8)
    for (vx0, vy0, vx1, vy1) in rects_vista:
        x0, y0, x1, y1 = int(vx0 / K + cx), int(vy0 / K), int(vx1 / K + cx), int(vy1 / K)
        m[y0:y1, x0:x1] = ((g[y0:y1, x0:x1].astype(int) - med[y0:y1, x0:x1].astype(int)) > delta).astype(np.uint8) * 255
    m = cv2.dilate(m, np.ones((dil, dil), np.uint8))
    return Image.fromarray(cv2.cvtColor(cv2.inpaint(a, m, 5, cv2.INPAINT_TELEA), cv2.COLOR_BGR2RGB))


def banner3():
    b = BAN[3]; im = orig(); t, W, H = pannello(b); cx = b["cx"]
    t.rett(0, 0, W + 20, H, 0, fill=NAVY_B, id="sfondo-navy")
    t.rett(0, 880, W + 20, 640, 0, fill=t.sfumatura([(0, "#E4E9F4"), (0.55, "#E9EDF6"), (1, NAVY_B)], 0, 880, 0, 1520, userspace=True), id="sfondo-sezione-storie")
    t.rett(0, 1520, W + 20, H - 1520, 0, fill=t.sfumatura(["#0A1B4A", "#050C26"], 0, 1520, 0, 2508, userspace=True), id="sfondo-sezione-finale")
    # arco con il Duomo (raster, scritte tolte)
    arco = pulisci_chiaro(im, cx, [(10, 20, 450, 215), (30, 285, 230, 620), (270, 335, 455, 460)], delta=24)
    top = [(0, 902), (80, 893), (150, 906), (230, 926), (300, 939), (360, 919), (420, 891), (470, 880)]
    mostra(t, arco, 8, 0, 459, 945, cx, clip_d=strappo([(0, 0), (470, 0)] + top[::-1], 2.4, 12, 3), id="foto-arco-duomo")
    testo_l(t, "UN FUTURO PIÙ APERTO", 42, 44, 13, 500, "#C7D0E6", spaz=1.8, id="etichetta-4")
    testo_l(t, "\\ 04", 395, 44, 13, 400, "#C7D0E6", id="indice-04")
    for i, (s_, y, lw) in enumerate([("Supera un ostacolo", 104, 313), ("oggi, per tutto ciò", 148, 295), ("che verrà dopo.", 192, 258)]):
        riga(t, s_, 42, y, lw, 600, "#FFFFFF", -0.01, id=f"titolo-1-riga-{i + 1}")
    t.rett(46.2, 298, 1.6, 314, 0.8, fill="#FFFFFF", opacita=0.85, id="elenco-linea")
    t.rett(46.2, 298, 1.6, 56, 0.8, fill="#6FA0FF", id="elenco-linea-attiva")
    for i, (a1, a2_) in enumerate([("Accesso al", "secondo anno"), ("Libertà di scegliere", "il tuo percorso"), ("Più opportunità", "internazionali."), ("Un Politecnico", "senza ostacoli.")]):
        y = 325 + i * 85.7
        t.cerchio(47, y, 5.4, fill="#FFFFFF", id=f"elenco-punto-{i + 1}")
        t.testo(a1, 72, y + 6, 15, 400, "#FFFFFF", id=f"elenco-{i + 1}-riga-1"); t.testo(a2_, 72, y + 28, 15, 400, "#FFFFFF", id=f"elenco-{i + 1}-riga-2")
    for i, (s_, x, y, lw) in enumerate([("Stessa", 283, 365, 70), ("partenza.", 288, 408, 98), ("Più possibilità.", 290, 448, 150)]):
        corsivo(t, s_, x, y, corsivo_per(s_, lw, 400), 400, "#FFFFFF", rot=8, id=f"nota-script-{i + 1}")
    testo_l(t, "STORIE REALI", 42, 967, 13, 500, "#566695", spaz=1.8, id="etichetta-5")
    testo_l(t, "\\ 05", 410, 970, 13, 400, "#6F7D9F", id="indice-05")
    riga(t, "Stessi studenti,", 42, 1013, 228, 700, INK_B, -0.015, id="titolo-2-riga-1")
    riga(t, "storie diverse.", 42, 1058, 213, 700, INK_B, -0.015, id="titolo-2-riga-2")
    riga(t, "AddiOFA è già al fianco di migliaia di studenti", 42, 1096, 370, 400, "#55617F", 0, id="paragrafo-2-riga-1")
    riga(t, "del Politecnico di Milano.", 42, 1119, 204, 400, "#55617F", 0, id="paragrafo-2-riga-2")
    # carosello di testimonianze
    t.rett(-20, 1160, 52, 262, 24, fill="#FFFFFF", opacita=0.55, id="scheda-precedente")
    t.rett(434, 1160, 60, 262, 24, fill="#FFFFFF", opacita=0.55, id="scheda-successiva")
    with t.gruppo("scheda-testimonianza"):
        t.rett(42, 1152, 385, 273, 28, fill="#FFFFFF", id="scheda-fondo", filtro=t.ombra(4, 18, "#0B1A4A", 0.25))
        a = cv2.cvtColor(np.asarray(im), cv2.COLOR_RGB2BGR); mm = np.zeros(a.shape[:2], np.uint8)
        cv2.circle(mm, (int(138 / K + cx), int(1288 / K)), 22, 255, -1)
        volto = Image.fromarray(cv2.cvtColor(cv2.inpaint(a, mm, 5, cv2.INPAINT_TELEA), cv2.COLOR_BGR2RGB))
        cid = ui.clip_rett(t, 44, 1154, 188, 269, 24)
        mostra(t, volto, 44, 1154, 232, 1423, cx, clip_d=f"M68 1154H208A24 24 0 0 1 232 1178V1399A24 24 0 0 1 208 1423H68A24 24 0 0 1 44 1399V1178A24 24 0 0 1 68 1154z", id="foto-volto-studente")
        t.cerchio(138, 1288, 27, fill="#FFFFFF", id="play-fondo", filtro=t.ombra(2, 8, "#000000", 0.3))
        t.path("M131 1275 150 1288 131 1301z", fill=INK_B, id="play-triangolo")
        for i, (s_, w_) in enumerate([("“Pensavo fosse", 120), ("impossibile, invece", 150), ("con AddiOFA l’ho", 130), ("superato al primo", 130), ("tentativo.”", 82)]):
            riga(t, s_, 260, 1206 + i * 24, w_, 400, "#2A3550", 0, id=f"citazione-{i + 1}")
        t.testo("Luca, Ingegneria", 260, 1343, 13, 400, "#55617F", id="autore-1"); t.testo("Politecnico di Milano", 260, 1366, 13, 400, "#55617F", id="autore-2")
    for i, x in enumerate((193, 214, 233, 251, 268)):
        t.cerchio(x, 1458, 4.2 if i else 5.6, fill="#FFFFFF" if i == 0 else "#9AA7C8", opacita=1 if i == 0 else 0.6, id=f"puntino-{i + 1}")
    testo_l(t, "INIZIA ORA", 42, 1535, 13, 500, "#B9C4E0", spaz=1.8, id="etichetta-6")
    testo_l(t, "\\ 06", 405, 1538, 13, 400, "#B9C4E0", id="indice-06")
    riga(t, "Sblocca il tuo domani.", 42, 1590, 368, 700, "#FFFFFF", -0.015, id="titolo-3")
    riga(t, "Un piccolo passo ora, per un grande percorso", 42, 1630, 376, 400, "#CBD5EC", 0, id="sottotitolo-3-riga-1")
    riga(t, "al Politecnico di Milano.", 42, 1654, 196, 400, "#CBD5EC", 0, id="sottotitolo-3-riga-2")
    notte = pulisci_chiaro(im, cx, [], 99)
    mostra(t, notte, 8, 1660, 459, 2125, cx, fade=(0, 1660, 0, 2125, [(0, 0), (0.18, 1), (0.8, 1), (1, 0)]), id="foto-arco-stella-notte")
    pillola_cta(t, 78, 2132, 305, 68, "Inizia ora", "pulsante-inizia-ora-finale")
    testo_l(t, "Disponibile su", 230, 2244, 14, 400, "#D7DEEE", ancora="middle", id="disponibile-su")
    for i, (x0, piccolo, grande) in enumerate([(72, "Scarica su", "App Store"), (241, "Disponibile su", "Google Play")]):
        with t.gruppo(f"badge-{'app-store' if i == 0 else 'google-play'}"):
            t.rett(x0, 2263, 150 if i == 0 else 151, 54, 12, fill="#000000", stroke="#5B6275", sw=1.2)
            if i == 0:
                t.path("M100 2296.500c-3.500 3-6 1-8.500-.5-3-1.500-3-6-.8-9.500 2-3 5-3.500 7-2.500 2 .8 3 1 4.500.2 2.200-1 4.800-.5 6.300 1.500-3 2-3.500 6.500-.5 9-1 2.500-2.500 4.500-4 3.300zM99.800 2282c-.2-2.500 1.500-4.800 4-5.500.2 2.800-1.800 5.200-4 5.500z", fill="#FFFFFF", id="icona-mela")
            else:
                t.path("M262 2276 281 2290 262 2304z", fill="#38C172"); t.path("M262 2276 275 2283 267 2290z", fill="#4A90F5"); t.path("M262 2304 275 2297 267 2290z", fill="#F2434C"); t.path("M275 2283 283 2290 275 2297 267 2290z", fill="#FBC52D")
            tx = x0 + (46 if i == 0 else 48)
            t.testo(piccolo, tx, 2283, 9.5, 400, "#FFFFFF"); t.testo(grande, tx, 2305, 19, 600, "#FFFFFF")
    t.linea(40, 2362, 255, 2362, "#FFFFFF", 1, opacita=0.18)
    t.inserisci_svg((LOGO / "marchio-tile-scuro.svg").read_text(), 38, 2385, 34, "marchio-tile")
    testo_l(t, "AddiOFA", 80, 2410, 22, 700, "#FFFFFF", id="logo-testo")
    t.cerchio(309, 2400, 23, fill="none", stroke="#C9D2E8", sw=2.2, id="sigillo-segnaposto")
    t.cerchio(309, 2400, 18, fill="none", stroke="#C9D2E8", sw=1, opacita=0.6)
    testo_l(t, "POLITECNICO", 338, 2397, 11, 700, "#FFFFFF", spaz=0.4, id="ateneo-1"); testo_l(t, "DI MILANO", 338, 2411, 11, 700, "#FFFFFF", spaz=0.4, id="ateneo-2")
    for x, s_ in ((38, "Funzionalità"), (148, "Prezzi"), (222, "FAQ")):
        testo_l(t, s_, x, 2455, 12.5, 400, "#9FB0D6", id=f"link-{s_.lower()}")
    chiudi(t)
    return t


GEN = {1: banner1, 2: banner2, 3: banner3}

if __name__ == "__main__":
    for num in [int(a) for a in sys.argv[1:]] or [1]:
        t = GEN[num](); b = BAN[num]
        out = OUTD / (b["nome"] + ".svg"); t.salva(out)
        mae = tavola(out, SRC, (b["x0"], 0, b["x1"], 1672), f"banner-{num}")
        print(out, out.stat().st_size // 1024, "KB", "scarto", round(mae, 2))
