"""Immagine 43 (schermate-risultato-sette): 6 schermate, misuratore con tacche.
Corpi: passi · aree · fattori + nota · fattori · avviso + istogramma · costi + pulsanti.
Riscrive i 6 SVG in brand/concept-svg/schermate/calcolo-risultato/ (percorso da ui.RADICE, non da parents[]).
Le misure di testo/arco sono lette dal ritaglio (motore.Mis) e messe in cache in misure.json."""
import pathlib, sys
AQUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(AQUI))
from motore import *            # noqa: F401,F403
from ui import RADICE          # noqa: E402

USCITA = RADICE / "brand/concept-svg/schermate/calcolo-risultato"

# colori dell'arco: stops lungo il PIENO (0 = inizio, 1 = pomello); vengono riportati su 0..v
BLU = [(0, "#2F7DF6"), (1, "#5F9CFA")]
BLU_AMBRA = [(0, "#3B82F6"), (0.09, "#5A90EC"), (0.24, "#F8B550"), (0.55, "#F9A825"), (1, "#F59E0B")]
GIALLO_ROSSO = [(0, "#FFD067"), (0.34, "#FFA24F"), (0.68, "#FF6B47"), (1, "#F5303E")]
GIALLO_ROSSO_B = [(0, "#FFC561"), (0.30, "#FF9150"), (0.60, "#FF5C4A"), (1, "#F52C3E")]
ROSSO = [(0, "#FF7A70"), (0.5, "#FF4A55"), (1, "#F5202F")]


def stops_v(stops, v):
    v = max(v, 0.02)
    return [(f * v, c) for f, c in stops] + [(1.0, stops[-1][1])]


def gauge(v, stops, W, pct_top, **k):
    return dict(v=v, stops=stops_v(stops, v), cy_r=(pct_top - 30, pct_top + 6, 4), rx_r=(round(W * 0.36), round(W * 0.45), 3),
                ry_r=(80, 128, 6), tacche="doppie", **k)


T3 = ["Consideriamo anche la difficoltà", "delle domande e il tempo", "impiegato."]


def s1():
    sp = dict(id="calcolo-0", nn=43, k=1, titolo=["Calcoliamo", "il tuo risultato"], sotto=["Stiamo analizzando le tue risposte", "per stimare il tuo livello di", "preparazione."],
              y_gauge0=262, pct_y=(415, 456), pct="0%", pct_col=NAVY, did=["Rischio di fallimento"], did_y=(462, 488), did_col="#1F3665",
              gauge=gauge(0.0, BLU, 244, 424, pr=0.42, pomello="#2F7BF5"))
    c = dict(card=(30, 538, 243, 790), cx=65.5, r=11.5, x_txt=85, y=(555, 712), stati=["fatto", "fatto", "vuoto", "vuoto"],
             testi=["Grammatica", "Comprensione", "Vocabolario", "Ragionamento"])
    return sp, lambda t, mis: corpo_passi(t, mis, sp, c)


def s2():
    sp = dict(id="elaboriamo-18", nn=43, k=2, titolo=["Elaboriamo", "i tuoi risultati"], sotto=["Stiamo confrontando le tue", "risposte con migliaia di studenti", "del Polimi."],
              y_gauge0=262, pct_y=(417, 458), pct="18%", pct_col=NAVY, did=["Rischio di fallimento"], did_y=(463, 490), did_col="#1F3665",
              gauge=gauge(0.30, BLU, 239, 424, pr=0.42, pomello="#2F7BF5", scia=True, glow=0.5))
    righe = [dict(icona="documento-lista", cy=596, nome="Grammatica", nome_y=(579, 596), by=608, frac=0.80, pct="80%"),
             dict(icona="chat", cy=656, nome="Comprensione", nome_y=(640, 658), by=670, frac=0.60, pct="60%", peso=500),
             dict(icona="testo-aa", cy=718, nome="Vocabolario", nome_y=(702, 718), by=731, frac=0.30, pct="30%", aa=True),
             dict(icona="puzzle", cy=779, nome="Ragionamento", nome_y=(763, 781), by=793, frac=0.10, pct="10%")]
    c = dict(card=(27, 527, 239, 840), titolo="Analizzando le aree...", titolo_y=(540, 559), x_tit=36, righe=righe, cx=57, lato=38, x_nome=84, x_pct=200,
             barra=(87, 193), bh=9)
    return sp, lambda t, mis: corpo_aree(t, mis, sp, c)


def _fatt(W, x_nome, cx, x_bar0, x_bar1, x_dx):
    nomi = ["Difficoltà delle domande", "Tempo impiegato", "Confronto con altri studenti"]
    righe = [
        dict(icona="barre-piene", colore="#F59E0B", cy=599, nome=nomi[0], nome_y=(579, 596), by=609.5, frac=0.80, col=("#FFB04A", "#F99A25"),
             dx=[("Alta", 603, 617, x_dx)], barra=(x_bar0, x_bar1[0])),
        dict(icona="cronometro", colore="#8B3DF5", cy=661, nome=nomi[1], nome_y=(640, 660), by=672, frac=0.60, col=("#A778FA", "#8D45F0"),
             dx=[("Più lento", 665, 678, x_dx - 18), ("della media", 681, 694, x_dx - 24)], barra=(x_bar0, x_bar1[1])),
        dict(icona="gruppo", colore="#2F6FF0", cy=733, nome=nomi[2], nome_y=(713, 730), by=745.5, frac=0.40, col=("#5B9BFB", "#2F73F2"),
             dx=[("Sotto la media", 739, 752, x_dx - 33)], barra=(x_bar0, x_bar1[2]))]
    return righe


def s3():
    sp = dict(id="analizzando-42", nn=43, k=3, titolo=["Stiamo analizzando..."], sotto=T3,
              y_gauge0=250, pct_y=(415, 456), pct="42%", pct_col=NAVY, did=["Rischio di fallimento"], did_y=(463, 490), did_col="#1F3665",
              gauge=gauge(0.50, BLU_AMBRA, 239, 424, pr=0.42, pomello="#F8A82B", glow=0.4))
    c = dict(card=(26, 528, 239, 774), titolo="Fattori considerati", titolo_y=(540, 559), x_tit=36, righe=_fatt(239, 86, 56.5, 87, (199, 177, 153), 209),
             cx=56.5, lato=40, x_nome=84, x_dx=200, barra=(87, 199),
             info=dict(card=(26, 788, 239, 900), cx=52, cy=822, lato=30, x_txt=76, y=(800, 862),
                       testi=["Il modello tiene conto di", "più fattori per offrirti una", "stima accurata."]))
    return sp, lambda t, mis: corpo_fattori(t, mis, sp, c)


def s4():
    sp = dict(id="ultimi-calcoli-68", nn=43, k=4, titolo=["Ultimi calcoli..."], sotto=["Combiniamo tutti i fattori per", "ottenere una stima affidabile", "del tuo risultato."],
              y_gauge0=250, pct_y=(415, 456), pct="68%", pct_col=NAVY, did=["Rischio di fallimento"], did_y=(463, 490), did_col="#1F3665",
              gauge=gauge(0.67, GIALLO_ROSSO, 246, 424, pr=0.42, pomello="#F5303E", glow=0.4))
    c = dict(card=(28, 528, 245, 790), titolo="Fattori considerati", titolo_y=(540, 559), x_tit=38, righe=_fatt(246, 90, 58, 91, (203, 181, 157), 214),
             cx=58, lato=40, x_nome=88, x_dx=200, barra=(91, 203))
    return sp, lambda t, mis: corpo_fattori(t, mis, sp, c)


def s5():
    sp = dict(id="quasi-pronto-80", nn=43, k=5, titolo=["Quasi pronto..."], sotto=["Stiamo finalizzando la tua stima", "in base al modello di previsione", "dell'OFA."],
              y_gauge0=250, pct_y=(415, 456), pct="80%", pct_col=NAVY, did=["Rischio di fallimento"], did_y=(463, 490), did_col="#1F3665",
              gauge=gauge(0.84, GIALLO_ROSSO_B, 249, 424, pr=0.42, pomello="#F5202F", glow=0.4))
    av = dict(card=(25, 528, 237, 606), cx=52, cy=567, r=15, x_txt=79, y=(540, 600), testi=["Il tuo risultato è inferiore", "alla media degli studenti", "che superano l'OFA."])
    hi = dict(card=(26, 611, 237, 800), x0=41.7, x1=222, ybase=708.5, larg=13.7, alt=[5.8, 14.6, 25, 36.3, 47.9, 57, 54.2, 37, 22.9, 11.3], sel=6,
              tag_w=27, tag_h=21, x_leg=62,
              legenda=[("#3B82F6", 48, 734.5, 6, "Studenti che superano", 727, 742), ("#F25B65", 48, 761, 6, "Studenti che non superano", 754, 769)])
    def corpo(t, mis):
        avviso(t, mis, sp, av)
        istogramma(t, mis, sp, hi)
    return sp, corpo


def s6():
    sp = dict(id="risultato-82", nn=43, k=6, titolo=["Il tuo risultato"], sotto=["Ecco la tua stima attuale del", "rischio di fallimento all'OFA", "di inglese."],
              y_gauge0=250, pct_y=(404, 450), pct="82%", pct_col="#EE1C2A", soglia_pct=110, did=["Rischio di fallimento"], did_y=(458, 484), did_col="#E6121F",
              gauge=gauge(0.85, ROSSO, 262, 410, pr=0.42, pomello="#F5202F", glow=0.45))
    co = dict(card=(28, 509, 239, 702), cx=45.8, r=13, x_txt=78, y=(520, 690), icone=["monete", "documento-lista", "vietato", "power"],
              testi=["~30 € di costi aggiuntivi", "Piano di studi bloccato", "Nessun esame dal secondo anno", "Ritardo di almeno 1 anno"])
    pu = dict(prim=(29, 717, 240, 768), t_prim="Continua",
              sec=(29, 783, 240, 836 + 30), t_sec="Scopri come migliorare", y_sec=(802, 820), x_ts=82, libro=(55, 811, 19))
    def corpo(t, mis):
        corpo_costi(t, mis, sp, co)
        pulsanti_fine(t, mis, sp, pu)
    return sp, corpo


SCHERMATE = [("001", "calcoliamo-0", s1), ("002", "elaboriamo-18", s2), ("003", "analizzando-42", s3), ("004", "ultimi-calcoli-68", s4),
             ("005", "quasi-pronto-80", s5), ("006", "risultato-82", s6)]


def main(solo=None):
    USCITA.mkdir(parents=True, exist_ok=True)
    for nn, nome, f in SCHERMATE:
        if solo and nn not in solo: continue
        sp, corpo = f()
        mis = Mis(sp["nn"], sp["k"])
        t = disegna_base(sp, mis)
        corpo(t, mis)
        out = USCITA / f"43-schermate-risultato-sette-{nn}-{nome}.svg"
        t.salva(out)
        print(out.name, len(t.svg()) // 1024, "KB", "arco", {k: v for k, v in sp["_arco"].items() if k in ("cx", "cy", "rx", "ry", "th", "score")})


if __name__ == "__main__":
    main(sys.argv[1:] or None)
