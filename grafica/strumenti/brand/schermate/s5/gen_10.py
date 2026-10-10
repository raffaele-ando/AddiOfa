"""Immagine 10 (schermate-risultato-dettaglio): 6 schermate, misuratore con alone, didascalia a due righe (Rischio di fallimento / Calcolando...).
Corpi: passi · intro + aree · curva + legenda + nota · fattori (4) · avviso + istogramma + nota · costi + pulsanti."""
import pathlib, sys
AQUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(AQUI))
from motore import *            # noqa: F401,F403
from ui import RADICE          # noqa: E402
from gen_43 import BLU, BLU_AMBRA, GIALLO_ROSSO, GIALLO_ROSSO_B, ROSSO, stops_v   # noqa: E402

USCITA = RADICE / "brand/concept-svg/schermate/calcolo-risultato"
NOME = "10-schermate-risultato-dettaglio"


def gauge(v, stops, W, pct_top, **k):
    return dict(v=v, stops=stops_v(stops, v), cy_r=(pct_top - 28, pct_top + 8, 4), rx_r=(round(W * 0.36), round(W * 0.47), 3),
                ry_r=(80, 130, 6), **k)


DID2 = ["Rischio di fallimento", "Calcolando..."]


def base(id, k, tit, sot, pct, v, stops, W, **kw):
    return dict(id=id, nn=10, k=k, titolo=tit, sotto=sot, y_gauge0=232, pct_y=(344, 382), pct=pct, pct_col=NAVY,
                did=DID2, did_y=(388, 430), did_col=NAVY, did_peso=600, did_stili=[(600, NAVY), (400, "#566A96")], gauge=gauge(v, stops, W, 351, pr=0.42, glow=0.5, **kw.pop("g", {})), **kw)


def s1():
    sp = dict(id="calcolo-0", nn=10, k=1, titolo=["Calcoliamo", "il tuo risultato"], sotto=["Stiamo analizzando le tue risposte", "per stimare il tuo livello di", "preparazione."],
              y_gauge0=232, pct_y=(344, 382), pct="0%", pct_col=NAVY, did=["Analizzando le risposte..."], did_y=(390, 412), did_col="#3C4F82", did_peso=400,
              gauge=gauge(0.0, BLU, 216, 351, pomello="#2F7BF5", pr=0.45, glow=0))
    c = dict(card=(6, 455, 211, 700), cx=37, r=11.5, x_txt=62, y=(470, 626), stati=["fatto", "fatto", "corso", "vuoto"],
             testi=["Grammatica", "Comprensione", "Vocabolario", "Ragionamento"])
    return sp, lambda t, mis: corpo_passi(t, mis, sp, c)


def s2():
    sp = base("elaboriamo-22", 2, ["Elaboriamo", "i tuoi risultati"], ["Confrontiamo le tue risposte", "con migliaia di studenti del", "Politecnico di Milano."], "22%", 0.24, BLU, 240,
              pomello="#2F7BF5", scia=True)
    ic = dict(card=(28, 457, 236, 537), cx=60, cy=496, lato=48, x_txt=95, y=(468, 526), testi=["Stiamo analizzando", "le aree in cui hai avuto", "più difficoltà..."])
    nomi = [("documento-lista", 570.5, "Grammatica", (553, 570), 582, 0.90, "90%"), ("chat", 628, "Comprensione", (612, 630), 641.5, 0.60, "60%"),
            ("testo-aa", 687, "Vocabolario", (671, 689), 700.5, 0.30, "30%"), ("puzzle", 747, "Ragionamento", (731, 749), 759.5, 0.10, "10%")]
    righe = [dict(icona=i, cy=cy, nome=nm, nome_y=ny, by=by, frac=fr, pct=pc, aa=(i == "testo-aa")) for i, cy, nm, ny, by, fr, pc in nomi]
    ar = dict(card=(27, 545, 262, 800), righe=righe, cx=53, lato=36, x_nome=78, x_pct=200, barra=(80.5, 191), bh=8)
    def corpo(t, mis):
        intro_aree(t, mis, sp, ic)
        corpo_aree(t, mis, sp, ar) if False else _aree_senza_card(t, mis, sp, ar)
    return sp, corpo


def _aree_senza_card(t, mis, sp, c):
    P = t.p
    with t.gruppo("aree-analizzate"):
        for i, r in enumerate(c["righe"]):
            with t.gruppo(f"area-{i + 1}"):
                tessera_icona(t, r["icona"], P(c["cx"]), P(r["cy"]), P(c["lato"]), "#2F6FF0", 1.9, aa=r.get("aa", False))
                y0, y1 = r["nome_y"]
                testi(t, mis, [r["nome"]], y0, y1, x0=c["x_nome"], x1=c["x_pct"] - 4, peso=400, colore=ETICHETTA, soglia=125, id="nome")
                barra_px(t, c["barra"][0], c["barra"][1], r["by"], c.get("bh", 8), r["frac"], ("#6AA4FB", "#2F6FF0"), "#E4ECF8", id="barra")
                testi(t, mis, [r["pct"]], r["by"] - 8, r["by"] + 12, x0=c["x_pct"], peso=600, colore=BLU_TXT, soglia=140, id="percentuale-area")


def s3():
    sp = base("analizzando-48", 3, ["Stiamo analizzando..."], ["Consideriamo anche la difficoltà", "delle domande e il tempo", "impiegato."], "48%", 0.50, BLU_AMBRA, 242,
              pomello="#F8A82B", glow=0.55)
    sp["arco"] = dict(rx=94.5, cx=137.5)
    cu = dict(card=(28, 450, 236, 624), x0=28, x1=221, ybase=530.5, picco=137, h=54, sigma=26, px=77, h_utente=22, s_utente=12, x_txt=52, y=(550, 612),
              testi=["Confrontiamo il tuo risultato", "con la media degli studenti", "del Polimi."])
    le = dict(card=(28, 628, 236, 718), x_txt=78, y=(636, 710), x_seg=(52, 70), testi=["Il tuo punteggio", "Media studenti", "Intervallo tipico"])
    inf = dict(card=(28, 730, 236, 830), cx=57, cy=762, lato=30, x_txt=76, y=(740, 800),
               testi=["Il modello tiene conto della", "difficoltà delle domande", "e del tempo impiegato."])
    def corpo(t, mis):
        curva_confronto(t, mis, sp, cu)
        legenda_curva(t, mis, sp, le)
        with t.gruppo("nota-modello"):
            scheda(t, *inf["card"], r=15, fill=CARD_AZ, id="nota-scheda")
            lampadina(t, t.p(52), t.p(762), t.p(24))
            testi(t, mis, inf["testi"], *inf["y"], x0=inf["x_txt"], peso=400, colore=ETICHETTA, soglia=150, id="nota-testo")
    return sp, corpo


def s4():
    sp = base("quasi-pronto-72", 4, ["Quasi pronto..."], ["Stiamo finalizzando la tua stima", "in base al modello di previsione", "dell'OFA."], "72%", 0.68, GIALLO_ROSSO, 238,
              pomello="#F5303E")
    righe = [dict(icona="check", colore="#12B26B", cy=522.5, nome="Risposte corrette", nome_y=(505, 518), by=532, frac=0.35, col=("#3BD08F", "#12B26B"),
                  dx=[("35%", 526, 540, 205)], barra=(90, 193)),
             dict(icona="barre-piene", colore="#F59E0B", cy=595, nome="Difficoltà delle domande", nome_y=(574, 589), by=603.5, frac=0.80, col=("#FFB04A", "#F99A25"),
                  dx=[("Alta", 597, 611, 210)], barra=(90, 193)),
             dict(icona="cronometro", colore="#8B3DF5", cy=667, nome="Tempo impiegato", nome_y=(645, 662), by=670.5, frac=0.55, col=("#A778FA", "#8D45F0"),
                  dx=[("Più lento", 664, 677, 190), ("della media", 679, 692, 178)], barra=(90, 168)),
             dict(icona="gruppo", colore="#2F6FF0", cy=743.5, nome="Confronto con altri studenti", nome_y=(722, 737), by=755, frac=0.40, col=("#5B9BFB", "#2F73F2"),
                  dx=[("Sotto la media", 750, 763, 163)], barra=(90, 156))]
    c = dict(card=(28, 450, 237, 790), titolo="Fattori considerati", titolo_y=(464, 484), x_tit=40, righe=righe, cx=57, lato=42, x_nome=88, barra=(90, 193), bh=8)
    return sp, lambda t, mis: fattori_generici(t, mis, sp, c)


def s5():
    sp = base("ultimi-dettagli-80", 5, ["Ultimi dettagli..."], ["Stiamo considerando tutti i", "fattori per offrirti una stima", "accurata."], "80%", 0.83, GIALLO_ROSSO_B, 255, pomello="#F5202F")
    av = dict(card=(37, 452, 249, 530), cx=65, cy=488.5, r=15, x_txt=95, y=(460, 520), testi=["Il tuo risultato è inferiore", "alla media degli studenti", "che superano l'OFA."])
    hi = dict(card=(37, 536, 249, 707), x0=48, x1=240.5, ybase=640.5, larg=13.6, alt=[5.3, 14.7, 25.8, 38.9, 52.1, 62.6, 60, 39.5, 24.7, 12.6], sel=6,
              tag_w=29, tag_h=23, x_leg=65,
              legenda=[("#3B82F6", 52.5, 665.5, 5.5, "Studenti che superano", 658, 672), ("#F25B65", 52.5, 690.5, 5.5, "Studenti che non superano", 683, 697)])
    inf = dict(card=(37, 725, 249, 800), cx=61, cy=750, lato=36, x_txt=86, y=(732, 790), testi=["Questa è una stima statistica", "basata su dati reali degli", "anni precedenti."])
    def corpo(t, mis):
        avviso(t, mis, sp, av)
        istogramma(t, mis, sp, hi)
        info_scudo(t, mis, sp, inf)
    return sp, corpo


def s6():
    sp = dict(id="risultato-82", nn=10, k=6, titolo=["Il tuo risultato"], sotto=["Ecco la tua stima attuale del", "rischio di fallimento all'OFA", "di inglese."],
              y_gauge0=232, pct_y=(334, 380), pct="82%", pct_col="#EE1C2A", soglia_pct=110, did=["Rischio di fallimento"], did_y=(388, 412), did_col="#E6121F", did_peso=600,
              gauge=gauge(0.85, ROSSO, 254, 345, pomello="#F5202F", pr=0.42, glow=0.5))
    co = dict(card=(26, 449, 239, 658), cx=54.5, r=12, x_txt=82, y=(470, 640), icone=["monete", "documento-lista", "vietato", "power"],
              testi=["~30 € di costi aggiuntivi", "Piano di studi bloccato", "Nessun esame dal secondo anno", "Ritardo di almeno 1 anno"])
    pu = dict(prim=(32, 672, 239, 717), t_prim="Continua", sec=(32, 733, 239, 790), t_sec="Scopri come migliorare", y_sec=(748, 766), x_ts=88, libro=(64, 756, 17))
    def corpo(t, mis):
        corpo_costi(t, mis, sp, co)
        pulsanti_fine(t, mis, sp, pu)
    return sp, corpo


SCHERMATE = [("001", "calcoliamo-0", s1), ("002", "elaboriamo-22", s2), ("003", "analizzando-48", s3), ("004", "quasi-pronto-72", s4),
             ("005", "ultimi-dettagli-80", s5), ("006", "risultato-82", s6)]


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
