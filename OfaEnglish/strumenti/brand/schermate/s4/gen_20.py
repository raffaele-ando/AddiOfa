"""Immagine 20 (schermate-risultato-sei): sequenza «Calcoliamo… / Elaboriamo… / Stiamo analizzando… / Ultimi calcoli… / Quasi pronto… / Il tuo risultato 82 %».
Stessa sequenza delle immagini 9, 10, 29, 42, 43: uso il MOTORE PARAMETRICO di s5 (strumenti/brand/schermate/s5/motore.py: cornice, barra di stato,
intestazione 10/10 con barra piena, titolo, sottotitolo, misuratore a mezza ellisse con alone e pomello, percentuale, didascalia) e ci aggiungo i corpi
propri di questa immagine: elenco passi con icona, tre fattori con barra (+ spunte verdi), conseguenze + pulsante.
Corregge dell'originale: barra «10/10» sempre piena, pomello e arco allineati, tacche pulite, icone rifatte vere (documento, chat, elenco, puzzle,
barre, cronometro, documento verde), spunte e cerchi puliti. Testi: tutti leggibili; sottotitoli 3 righe e didascalie come nell'originale.
Misure in PIXEL del ritaglio (brand/concept/20-.../NNN-schermata.png).  python3 gen_20.py [k ...]"""
import pathlib, sys
AQUI = pathlib.Path(__file__).resolve().parent
S5 = AQUI.parent / "s5"
sys.path.insert(0, str(AQUI.parent))
sys.path.insert(0, str(S5))
from motore import *            # noqa: F401,F403  (s5)
from ui import RADICE          # noqa: E402

USCITA = RADICE / "brand/concept-svg/schermate/20-schermate-risultato-sei"
NOMI = {1: "calcoliamo-0", 2: "elaboriamo-18", 3: "stiamo-analizzando-42", 4: "ultimi-calcoli-68", 5: "quasi-pronto-80", 6: "il-tuo-risultato-82"}

BLU = [(0, "#2F7DF6"), (1, "#5F9CFA")]
BLU_AMBRA = [(0, "#3B82F6"), (0.14, "#4F8BEF"), (0.30, "#F8B550"), (0.62, "#F9A825"), (1, "#F59E0B")]
GIALLO_ROSSO = [(0, "#FFD067"), (0.34, "#FFA24F"), (0.68, "#FF6B47"), (1, "#F5303E")]
GIALLO_ROSSO_B = [(0, "#FFC561"), (0.30, "#FF9150"), (0.60, "#FF5C4A"), (1, "#F52C3E")]
ROSSO_ARCO = [(0, "#FF7A70"), (0.5, "#FF4A55"), (1, "#F5202F")]
ICONA_PASSO = "#5B6E94"


def stops_v(stops, v):
    v = max(v, 0.02)
    return [(f * v, c) for f, c in stops] + [(1.0, stops[-1][1])]


def gauge(v, stops, W, cy, **k):
    return dict(v=v, stops=stops_v(stops, v), cy_r=(cy - 20, cy + 14, 4), rx_r=(round(W * 0.36), round(W * 0.46), 3), ry_r=(85, 130, 6), tacche=None, **k)


def base(k, titolo, sotto, y_gauge0, pct, pct_y, pct_col, did, did_y, did_col, gstops, v, W, cy, **kw):
    gk = kw.pop("gk", {})
    return dict(id=f"schermata-{k:02d}-{NOMI[k]}", nn=20, k=k, titolo=titolo, sotto=sotto, y_testa=94, y_gauge0=y_gauge0, pct=pct, pct_y=pct_y,
                pct_col=pct_col, soglia_pct=kw.pop("soglia_pct", 90), did=did, did_y=did_y, did_col=did_col, did_peso=kw.pop("did_peso", 500),
                soglia_did=kw.pop("soglia_did", 175), gauge=gauge(v, gstops, W, cy, **gk), **kw)


# ---------------------------------------------------------------------------- intestazione propria (il motore s5 si aspetta «10/10» staccato dalla barra)
INTEST = {1: (29, 36, 51, 230), 2: (39, 46, 60, 238), 3: (38, 45, 59, 236), 4: (39, 46, 60, 237), 5: (37, 44, 58, 235), 6: (8, 15, 29, 210)}


def intestazione_20(t, mis):
    P = t.p
    b0, b1, x0, x1 = INTEST[mis.k]
    with t.gruppo("intestazione"):
        t.path(f"M{n(P(b1 + 0.5))} {n(P(42))}L{n(P(b0 + 1))} {n(P(49.5))}L{n(P(b1 + 0.5))} {n(P(57))}", stroke="#101A4A", sw=P(2.1), id="indietro")
        cx = (x0 + x1) / 2 - 10
        testo_box(t, "10/10", P(cx - 15.5), P(cx + 15.5), P(37.5), P(48), 500, "#4B5F91", id="passo")
        t.rett(P(x0), P(58.2), P(x1 - x0), P(5), P(2.5), fill=t.sfumatura(["#5B9BFB", "#2F73F2"], 0, 0, 1, 0), id="barra-avanzamento", filtro=t.ombra(1, P(3), "#2F73F2", 0.22))


import motore as _motore
_motore.intestazione = intestazione_20


def cornice_20(t, sp, mis):
    """Striscia azzurra del foglio a sinistra (se c'e') + scheda bianca del telefono fino al bordo del ritaglio (il telefono e' tagliato)."""
    import numpy as np
    P = t.p
    a = np.asarray(mis.im).astype(int)
    row = a[150]
    bianco = lambda p: p[0] >= 246 and p[2] >= 250
    x = 0
    while x < mis.W // 3 and bianco(row[x]): x += 1          # margine bianco iniziale
    ini = x
    while x < mis.W // 3 and not bianco(row[x]): x += 1      # striscia azzurra
    xl = x if x > ini else 0
    strisc = "#%02X%02X%02X" % tuple(int(v) for v in a[150, min(mis.W - 1, ini + 2)]) if xl else "#EEF6FD"
    sp["card_fondo"] = "#F9FBFE"
    t.rett(0, 0, t.w, t.h, 0, fill=strisc if xl else "#F9FBFE", id="sfondo-pagina")
    x0 = P(xl) if xl else -30
    t.rett(x0, P(0), P(mis.W + 30) - x0, P(mis.H + 40), P(15), fill="#F9FBFE", id="scheda-telefono")


_motore.cornice = cornice_20


# ---------------------------------------------------------------------------- corpi
def passi(t, mis, c):
    """Elenco passi: cerchio di stato, icona, testo. c: card, cx, r, cx_ic, x_txt, ys (centri), stati."""
    P = t.p
    with t.gruppo("elenco-passi"):
        scheda(t, *c["card"], r=15, fill=CARD_AZ, id="scheda-passi")
        nomi = ["Grammatica", "Comprensione", "Vocabolario", "Ragionamento"]
        icone = ["documento-lista", "chat", "elenco", "puzzle"]
        bande = testi(t, mis, nomi, c["ys"][0] - 14, c["ys"][3] + 14, x0=c["x_txt"], peso=400, colore=ETICHETTA, soglia=185, gap=30, id="passo-testo")
        for i, (st, yc) in enumerate(zip(c["stati"], c["ys"])):
            if st == "fatto": spunta_cerchio(t, P(c["cx"]), P(yc), P(c["r"]), "blu", id=f"passo-{i + 1}-fatto")
            elif st == "corso": spinner(t, P(c["cx"]), P(yc), P(c["r"]), id=f"passo-{i + 1}-in-corso")
            else: cerchio_vuoto(t, P(c["cx"]), P(yc), P(c["r"]), id=f"passo-{i + 1}-da-fare")
            lato = 20
            t.icona(icone[i], P(c["cx_ic"] - lato / 2), P(yc - lato / 2), P(lato), ICONA_PASSO, 1.7, id=f"passo-{i + 1}-icona")


def fattori(t, mis, c):
    """Tre fattori con barra. c: card, cx, lato, x_nome, nome_y[3], by[3], barra_x1, spunte(bool), cx_sp"""
    P = t.p
    nomi = ["Difficoltà delle domande", "Tempo impiegato", "Modello di previsione"]
    spec = [("barre-piene", "#F59E0B", ("#FFB04A", "#F99A25")), ("cronometro", "#8B3DF5", ("#A778FA", "#8D45F0")), ("documento-lista", "#12A663", ("#2CC585", "#10A864"))]
    with t.gruppo("fattori"):
        scheda(t, *c["card"], r=15, fill=CARD_AZ, id="scheda-fattori")
        for i, (ic, col, grad) in enumerate(spec):
            with t.gruppo(f"fattore-{i + 1}"):
                tessera_icona(t, ic, P(c["cx"]), P(c["by"][i] - 9), P(c["lato"]), col, 1.9)
                testi(t, mis, [nomi[i]], *c["nome_y"][i], x0=c["x_nome"], x1=c.get("x_nome1"), peso=400, colore=ETICHETTA, soglia=185, id="nome")
                xs, xf, xt = barra_misura(mis, c["by"][i], c["x_nome"] - 3)
                x1 = c["barra_x1"] if c.get("barra_x1") else xt
                fr = (xf - xs) / max(1, (x1 - xs))
                barra_px(t, c["x_nome"], x1, c["by"][i], c.get("bh", 8), min(1, fr), grad, "#E7ECF6", id="barra")
                if c.get("spunte"):
                    cy = c["by"][i] - 9
                    t.cerchio(P(c["cx_sp"]), P(cy), P(7.2), fill=t.sfumatura(["#3CCB7A", "#12A663"]), id="spunta-fondo")
                    t.icona("spunta", P(c["cx_sp"]) - P(3.9), P(cy) - P(3.9), P(7.8), "#FFFFFF", 3.2, id="spunta")


def costi(t, mis, c):
    P = t.p
    with t.gruppo("conseguenze"):
        scheda(t, *c["card"], r=15, fill=CARD_ROSA, id="scheda-conseguenze")
        testi_ = ["~30 € di costi aggiuntivi", "Piano di studi bloccato", "Nessun esame dal secondo anno", "Ritardo di almeno 1 anno"]
        bande = testi(t, mis, testi_, c["card"][1] + 10, c["card"][3] - 5, x0=c["x_txt"], peso=400, colore="#2B3C6E", soglia=185, gap=30, id="conseguenza-testo")
        for i, ic in enumerate(["monete", "documento-lista", "vietato", "power"]):
            tondo_rosso(t, ic, P(c["cx"]), P(c["ys"][i]), P(c["r"]), id=f"conseguenza-{i + 1}-icona")
    x0, y0, x1, y1 = c["btn"]
    with t.gruppo("pulsante-continua"):
        t.rett(P(x0), P(y0), P(x1 - x0), P(y1 - y0), P(14), fill=t.sfumatura(["#FF3B49", "#F2202F"]), id="pulsante-primario", filtro=t.ombra(3, P(10), "#F22B36", 0.25))
        tx0, tx1, ty0, ty1 = c["box_txt"]
        testo_box(t, "Continua", P(tx0), P(tx1), P(ty0), P(ty1), 600, "#FFFFFF", id="pulsante-testo")
        fx, fy, fw = c["freccia"]
        t.icona("freccia-destra", P(fx - fw / 2), P(fy - fw / 2), P(fw), "#FFFFFF", 2.0, id="pulsante-freccia")


# ---------------------------------------------------------------------------- le sei schermate
def s1():
    sp = base(1, ["Calcoliamo", "il tuo risultato"], ["Stiamo analizzando le tue risposte", "per stimare il tuo livello di", "preparazione."], 232, "0%", (350, 400), NAVY,
              ["Analizzando le risposte..."], (410, 436), "#3C4F82", BLU, 0.0, 234, 380, gk=dict(pomello="#2F7BF5", pr=0.45, glow=0.3), did_peso=400)
    sp["arco"] = dict(cx=131, cy=372, rx=92, ry=97, th=26)
    c = dict(card=(25, 488, 244, 690), cx=51.5, r=10.3, cx_ic=87.5, x_txt=108, ys=[517, 555, 593, 632], stati=["fatto", "corso", "vuoto", "vuoto"])
    return sp, lambda t, mis: passi(t, mis, c)


def s2():
    sp = base(2, ["Elaboriamo", "i tuoi risultati"], ["Stiamo confrontando le tue", "risposte con migliaia di studenti", "del Polimi."], 230, "18%", (356, 396), NAVY,
              ["Rischio di fallimento", "Calcolando..."], (402, 450), "#3C4F82", BLU, 0.18, 243, 380, gk=dict(pomello="#2F7BF5", scia=True, glow=0.5))
    sp["arco"] = dict(cx=139, cy=372, rx=93, ry=97, th=27)
    c = dict(card=(35, 488, 253, 690), cx=62, r=10.3, cx_ic=98.5, x_txt=119, ys=[517, 555, 592, 632], stati=["fatto", "fatto", "corso", "vuoto"])
    return sp, lambda t, mis: passi(t, mis, c)


def s3():
    sp = base(3, ["Stiamo analizzando..."], ["Consideriamo anche la difficoltà", "delle domande e il tempo", "impiegato."], 202, "42%", (358, 398), NAVY,
              ["Rischio di fallimento", "Calcolando..."], (402, 450), "#3C4F82", BLU_AMBRA, 0.42, 241, 380, gk=dict(pomello="#F8A82B", glow=0.4))
    sp["arco"] = dict(cx=139, cy=372, rx=94, ry=99, th=27)
    c = dict(card=(34, 488, 251, 690), cx=61, r=10.3, cx_ic=97.5, x_txt=118, ys=[518, 555, 593, 632], stati=["fatto", "fatto", "fatto", "corso"])
    return sp, lambda t, mis: passi(t, mis, c)


def _f(k, W):
    return dict(card=(35, 488, W + 10, 690), cx=63.5 if k == 4 else 60.5, lato=37, x_nome=93 if k == 4 else 88, nome_y=[(498, 516), (553, 570), (611, 628)],
                by=[527, 582, 642], spunte=(k == 5), cx_sp=227.5)


def s4():
    sp = base(4, ["Ultimi calcoli..."], ["Ora combiniamo tutti i fattori", "per ottenere una stima accurata", "del tuo risultato."], 196, "68%", (358, 398), NAVY,
              ["Rischio di fallimento", "Calcolando..."], (402, 450), "#3C4F82", GIALLO_ROSSO, 0.68, 242, 380, gk=dict(pomello="#F5303E", glow=0.4))
    sp["arco"] = dict(cx=140, cy=372, rx=93, ry=96, th=27)
    c = _f(4, 242)
    return sp, lambda t, mis: fattori(t, mis, c)


def s5():
    sp = base(5, ["Quasi pronto..."], ["Stiamo finalizzando la tua stima", "in base al modello di previsione", "dell'OFA."], 196, "80%", (358, 398), NAVY,
              ["Rischio di fallimento", "Calcolando..."], (402, 450), "#3C4F82", GIALLO_ROSSO_B, 0.80, 271, 380, gk=dict(pomello="#F5202F", glow=0.4))
    sp["arco"] = dict(cx=138, cy=372, rx=93, ry=96, th=25)
    c = _f(5, 271)
    c["barra_x1"] = 211
    c["x_nome1"] = 214
    return sp, lambda t, mis: fattori(t, mis, c)


def s6():
    sp = base(6, ["Il tuo risultato"], ["Ecco la tua stima attuale del", "rischio di fallimento all'OFA", "di inglese."], 198, "82%", (336, 398), "#EE1C2A",
              ["Rischio di fallimento"], (400, 424), "#E6121F", ROSSO_ARCO, 0.82, 237, 376, gk=dict(pomello="#F5202F", glow=0.45), did_peso=600, soglia_did=190, soglia_pct=108)
    sp["arco"] = dict(cx=110, cy=372, rx=91, ry=108, th=27)
    c = dict(card=(3, 447, 216, 607), cx=31.5, r=10.6, x_txt=61, ys=[473, 510, 546, 583], btn=(2, 623, 215, 672), box_txt=(63, 127, 631, 646), freccia=(146, 640, 14))
    return sp, lambda t, mis: costi(t, mis, c)


SCHERMATE = {1: s1, 2: s2, 3: s3, 4: s4, 5: s5, 6: s6}


def main(solo=None):
    USCITA.mkdir(parents=True, exist_ok=True)
    for k, f in SCHERMATE.items():
        if solo and k not in solo: continue
        sp, corpo = f()
        mis = Mis(sp["nn"], sp["k"])
        t = disegna_base(sp, mis)
        corpo(t, mis)
        out = USCITA / f"{k:02d}-{NOMI[k]}.svg"
        t.salva(out)
        a = sp["_arco"]
        print(out.name, len(t.svg()) // 1024, "KB", "arco", {q: a[q] for q in ("cx", "cy", "rx", "ry", "th", "score") if q in a})


if __name__ == "__main__":
    main([int(a) for a in sys.argv[1:]] or None)
