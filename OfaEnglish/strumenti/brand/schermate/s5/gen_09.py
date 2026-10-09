"""Immagine 09 (schermate-calcolo-risultato): 6 schermate, misuratore senza tacche, passi con spunte sotto, costi nell'ultima.
Il ritaglio taglia l'ultima voce ("Ragionamento"): qui l'SVG è più alto di 22 px e la voce e la scheda sono complete."""
import pathlib, sys
AQUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(AQUI))
from motore import *            # noqa: F401,F403
from ui import RADICE          # noqa: E402
from gen_43 import BLU, GIALLO_ROSSO, GIALLO_ROSSO_B, ROSSO, stops_v   # noqa: E402

USCITA = RADICE / "brand/concept-svg/schermate/calcolo-risultato"
NOME = "09-schermate-calcolo-risultato"
EXT = 22
BLU_AMBRA = [(0, "#3B82F6"), (0.10, "#5A90EC"), (0.26, "#F9C060"), (0.6, "#FBC14E"), (1, "#F9B233")]
PASSI = ["Grammatica", "Comprensione", "Vocabolario", "Ragionamento"]
DID2 = ["Calcolando il rischio", "di fallimento..."]


def gauge(v, stops, W, pct_top, **k):
    return dict(v=v, stops=stops_v(stops, v), cy_r=(pct_top - 28, pct_top + 10, 4), rx_r=(round(W * 0.34), round(W * 0.47), 3), ry_r=(80, 140, 6), **k)


def spec(id, k, tit, sot, pct, did, v, stops, pct_y, did_y, stati, W, xtxt, cxi, ri, **kw):
    sp = dict(id=id, nn=9, k=k, H=None, titolo=tit, sotto=sot, y_gauge0=250, pct_y=pct_y, pct=pct, pct_col=NAVY, did=did, did_y=did_y,
              did_col="#4B5F91", did_peso=400, gauge=gauge(v, stops, W, pct_y[0] + 8, **{"pr": 0.45, "glow": 0.25, **kw.pop("g", {})}))
    sp.update(kw)
    c = dict(card=(4, did_y[1] + 40, W + 20, 760), cx=cxi, r=ri, x_txt=xtxt, y=(did_y[1] + 52, 700), stati=stati, testi=PASSI, card_fill="#F6F9FD")
    return sp, c


def passi_s(k, tit, sot, pct, did, v, stops, pct_y, did_y, stati, W, xtxt, cxi, ri, **kw):
    sp, c = spec(f"calcolo-{k}", k, tit, sot, pct, did, v, stops, pct_y, did_y, stati, W, xtxt, cxi, ri, **kw)
    return sp, lambda t, mis: corpo_passi(t, mis, sp, c)


def s1(): return passi_s(1, ["Calcoliamo", "il tuo risultato"], ["Stiamo analizzando le tue risposte", "per stimare il tuo livello di", "preparazione."], "0%",
                         ["Analizzando le risposte..."], 0.0, BLU, (362, 398), (418, 440), ["fatto", "vuoto", "vuoto", "vuoto"], 217, 60, 36, 10, g=dict(pomello="#2F7BF5", glow=0, delta=6))
def s2(): return passi_s(2, ["Elaboriamo", "i tuoi risultati"], ["Stiamo confrontando le tue", "risposte con migliaia di studenti", "del Polimi."], "18%", DID2, 0.24, BLU,
                         (370, 404), (420, 462), ["fatto", "fatto", "vuoto", "vuoto"], 245, 93, 70.5, 10, g=dict(pomello="#2F7BF5", scia=True))
def s3(): return passi_s(3, ["Stiamo analizzando..."], ["Consideriamo anche la difficoltà", "delle domande e il tempo", "impiegato."], "42%", DID2, 0.50, BLU_AMBRA,
                         (372, 408), (422, 464), ["fatto", "fatto", "fatto", "vuoto"], 250, 97, 73.5, 10, g=dict(pomello="#F9B233"))
def s4(): return passi_s(4, ["Ultimi calcoli..."], ["Stiamo finalizzando il tuo risultato", "in base al modello di previsione", "dell'OFA."], "68%", DID2, 0.74, GIALLO_ROSSO,
                         (372, 408), (422, 464), ["fatto"] * 4, 252, 96, 73, 10, g=dict(pomello="#F5303E"))
def s5(): return passi_s(5, ["Quasi pronto..."], ["Ora possiamo mostrarti la tua", "stima finale."], "80%", DID2, 0.84, GIALLO_ROSSO_B,
                         (372, 408), (422, 464), ["fatto"] * 4, 249, 95, 72, 10, g=dict(pomello="#F5202F"))


def s6():
    sp = dict(id="risultato-82", nn=9, k=6, titolo=["Il tuo risultato"], sotto=["Ecco la tua stima attuale di", "rischio di fallimento all'OFA", "di inglese."],
              y_gauge0=250, pct_y=(366, 412), pct="82%", pct_col="#EE1C2A", soglia_pct=110, did=["Rischio di fallimento"], did_y=(426, 452), did_col="#E6121F", did_peso=600,
              gauge=gauge(0.88, ROSSO, 259, 374, pomello="#F5202F", pr=0.5, glow=0.4))
    co = dict(card=(9, 488, 254, 720), cx=67, r=10, x_txt=88, y=(500, 668), icone=["monete", "documento-lista", "vietato", "power"],
              testi=["~30 € di costi aggiuntivi", "Piano di studi bloccato", "Nessun esame dal secondo anno", "Ritardo di almeno 1 anno"])
    return sp, lambda t, mis: corpo_costi(t, mis, sp, co)


SCHERMATE = [("001", "calcoliamo-0", s1), ("002", "elaboriamo-18", s2), ("003", "analizzando-42", s3), ("004", "ultimi-calcoli-68", s4),
             ("005", "quasi-pronto-80", s5), ("006", "risultato-82", s6)]


def main(solo=None):
    USCITA.mkdir(parents=True, exist_ok=True)
    for nn, nome, f in SCHERMATE:
        if solo and nn not in solo: continue
        sp, corpo = f()
        mis = Mis(sp["nn"], sp["k"])
        sp["H"] = mis.H + EXT
        t = disegna_base(sp, mis)
        corpo(t, mis)
        out = USCITA / f"{NOME}-{nn}-{nome}.svg"
        t.salva(out)
        print(out.name, len(t.svg()) // 1024, "KB", {k: v for k, v in sp["_arco"].items() if k in ("cx", "cy", "rx", "ry", "th", "score")})


if __name__ == "__main__":
    main(sys.argv[1:] or None)
