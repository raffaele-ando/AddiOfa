"""Immagine 29 (schermate-risultato-sei-b): 6 schermate con misuratore morbido, didascalia a due righe e striscia di stato
(icona + testo breve) sotto; l'ultima ha l'avviso 'Rischio elevato' e il pulsante Continua. Telefono intero con angoli tondi.
Testi piccoli dell'avviso (29.6) ricostruiti: 'Ti consigliamo di prepararti prima di affrontare l'esame.'"""
import pathlib, sys
AQUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(AQUI))
from motore import *            # noqa: F401,F403
from ui import RADICE          # noqa: E402
from gen_43 import BLU, GIALLO_ROSSO, ROSSO, stops_v   # noqa: E402

USCITA = RADICE / "brand/concept-svg/schermate/calcolo-risultato"
NOME = "29-schermate-risultato-sei-b"
GIALLO = [(0, "#FFD36E"), (0.5, "#FBBB4E"), (1, "#F9A83A")]
GIALLO_ARANCIO = [(0, "#FFCB62"), (0.5, "#FDA550"), (1, "#FA7F3B")]
ARANCIO = [(0, "#FDB654"), (0.5, "#FC8847"), (1, "#FA6039")]
CORALLO = [(0, "#FF8A74"), (0.5, "#FF5C5A"), (1, "#F5303E")]


def gauge(v, stops, W, **k):
    return dict(v=v, stops=stops_v(stops, v), cy_r=(350, 410, 4), rx_r=(round(W * 0.34), round(W * 0.47), 3), ry_r=(70, 120, 6), **{'pr': 0.45, 'glow': 0.3, **k})


DID = ["Rischio", "di fallimento"]


def base(k, id, tit, sot, pct, v, stops, W, **kw):
    sp = dict(soglia_sotto=190, soglia_titolo=130, id=id, nn=29, k=k, titolo=tit, sotto=sot, y_gauge0=230, pct_y=(376, 412), pct=pct, pct_col=NAVY, did=DID, did_y=(416, 460), did_col="#4B5F91",
              did_peso=400, gauge=gauge(v, stops, W, **kw.pop("g", {})))
    sp.update(kw)
    return sp


def strip(sp, card, icona, cx, cy, lato, x_txt, y, testi, tile=False):
    c = dict(card=card, icona=icona, cx=cx, cy=cy, lato=lato, x_txt=x_txt, y=y, testi=testi, tile=tile)
    return lambda t, mis: corpo_striscia(t, mis, sp, c)


def s1():
    sp = base(1, "calcoliamo-0", ["Calcoliamo", "il tuo risultato"], ["Stiamo analizzando le tue", "risposte per stimare il rischio", "di fallimento all'OFA."], "0%", 0.0, BLU, 237, g=dict(pomello="#2F7BF5", glow=0.2))
    return sp, strip(sp, (28, 497, 262, 575), "trend", 59, 535, 30, 88, (520, 552), ["Analizzando le risposte..."], tile=True)


def s2():
    sp = base(2, "elaboriamo-12", ["Elaboriamo", "i tuoi risultati"], ["Stiamo valutando il livello", "di preparazione in base", "alle tue risposte."], "12%", 0.19, GIALLO, 299, g=dict(pomello="#F9B233", scia=False))
    sp["arco"] = dict(cy=375, rx=90, ry=81)
    return sp, strip(sp, (48, 497, 262, 575), "elenco", 80.5, 535.5, 30, 112, (515, 556), ["Valutando le sezioni", "del test..."])


def s3():
    sp = base(3, "analizzando-36", ["Stiamo", "analizzando..."], ["Consideriamo la difficoltà", "delle domande e il tempo", "impiegato."], "36%", 0.36, GIALLO, 212, g=dict(pomello="#F9A833"))
    return sp, strip(sp, (8, 497, 262, 575), "ingranaggio", 38, 535, 30, 68, (522, 548), ["Elaborazione in corso..."])


def s4():
    sp = base(4, "quasi-pronto-58", ["Quasi pronto..."], ["Stiamo finalizzando il risultato", "in base al modello di previsione", "dell'OFA."], "58%", 0.60, GIALLO_ARANCIO, 254, y_gauge0=215, g=dict(pomello="#FA7F3B"))
    return sp, strip(sp, (47, 497, 251, 575), "documento-lista", 79.5, 535, 30, 110, (515, 556), ["Calcolando il risultato", "finale..."])


def s5():
    sp = base(5, "ultimi-dettagli-74", ["Ultimi dettagli..."], ["Verifichiamo gli ultimi parametri", "per un risultato più accurato."], "74%", 0.74, ARANCIO, 254, y_gauge0=215, g=dict(pomello="#F5303E"))
    return sp, strip(sp, (45, 497, 262, 575), "spunta-cerchio", 78, 535, 30, 108, (522, 548), ["Quasi fatto..."])


def s6():
    sp = base(6, "risultato-82", ["Ecco il tuo risultato"], ["In base alle tue risposte, ecco", "la stima del tuo rischio", "di fallimento all'OFA di inglese."], "82%", 0.88, CORALLO, 280, y_gauge0=225,
              pct_y=(350, 396), did_y=(400, 446), pct_col="#EE1C2A", soglia_pct=110, did_col="#E6121F", g=dict(pomello="#F5202F"))
    sp["gauge"]["cy_r"] = (340, 400, 4)
    av = dict(card=(48, 473, 253, 558), cx=74, cy=501, r=11.5, x_txt=96, y_tit=(488, 508), y_sub=(512, 545), titolo="Rischio elevato",
              testi=["Ti consigliamo di prepararti", "prima di affrontare l'esame."])
    pu = dict(prim=(49, 574, 252, 618), t_prim="Continua")
    def corpo(t, mis):
        avviso_elevato(t, mis, sp, av)
        P = t.p
        x0, y0, x1, y1 = pu["prim"]
        with t.gruppo("pulsante-continua"):
            t.rett(P(x0), P(y0), P(x1 - x0), P(y1 - y0), P((y1 - y0) * 0.38), fill=t.sfumatura(["#FF4B57", "#F5303E"]), id="pulsante-primario", filtro=t.ombra(3, P(10), "#F22B36", 0.25))
            seg = [b for b in mis.righe(y0 + 8, y1 - 8, x0 + 20, x1 - 20, -205, 9) if b[3] - b[2] >= 6]
            b = seg[0]
            testo_box(t, "Continua", P(b[0]), P(b[1]), P(b[2] + 0.4), P(b[3] - 0.4), 600, "#FFFFFF", id="pulsante-testo")
    return sp, corpo


SCHERMATE = [("001", "calcoliamo-0", s1), ("002", "elaboriamo-12", s2), ("003", "analizzando-36", s3), ("004", "quasi-pronto-58", s4),
             ("005", "ultimi-dettagli-74", s5), ("006", "risultato-82", s6)]


def main(solo=None):
    USCITA.mkdir(parents=True, exist_ok=True)
    for nn, nome, f in SCHERMATE:
        if solo and nn not in solo: continue
        sp, corpo = f()
        mis = Mis(sp["nn"], sp["k"])
        t = disegna_base(sp, mis)
        corpo(t, mis)
        out = USCITA / f"{NOME}-{nn}-{nome}.svg"
        t.salva(out)
        print(out.name, len(t.svg()) // 1024, "KB", {k: v for k, v in sp["_arco"].items() if k in ("cx", "cy", "rx", "ry", "th", "score")})


if __name__ == "__main__":
    main(sys.argv[1:] or None)
