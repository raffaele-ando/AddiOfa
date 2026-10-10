"""Immagine 11 (home rischio, tre stati, layout B 'Cosa influenza il tuo rischio?'): UN generatore, tre SVG.

Tre pannelli da 331x1384 px (il terzo 338): rischio 82 % / 46 % / 18 %. Il titolo cambia ('Ciao, Raffaele' / 'Stai facendo
progressi!' / 'Ottimo lavoro!'), poi misuratore, avviso, elenco dei quattro fattori, card informativa, pulsante, card finale, nav.

Cosa corregge dell'originale: nel pannello 1 l'arco rosso ha una cucitura a sinistra (a ~x 40-60: il riempimento parte con uno
scalino): qui sfumatura continua dal chiaro al pieno; il titolo della card 'quanto puoi migliorare?' era in minuscolo: 'Quanto
puoi migliorare?'; i margini sinistri dei tre pannelli (23, 33, 33 px) sono unificati (30); le righe dell'elenco hanno la
stessa quota in tutti e tre; le barre del terzo pannello partono da x diverso: unificate. Il pannello 3 ha il pomello a sinistra
(18 %): lo stesso arco, riempito dal chiaro al verde solo fino al pomello.
Testi ricostruiti: nessuno (tutti leggibili ingrandendo)."""
import sys, pathlib
QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI))
from componenti import *

CART = "11-home-rischio-tre-stati-b"
SRC = CONCEPT / CART

LM = 30          # margine sinistro del testo
X_ICO = 50       # centro delle icone-tile
X_CARD = 22; W_CARD = 292
X_TXT = 93       # testo nelle card

VARIANTI = {
    "alto": dict(n=1, dim=(331, 1384), nome="001-home-rischio-alto", pos=0.837,
                 titolo=("Ciao, Raffaele", 147), sub=[("Ecco la tua situazione attuale.", 218)],
                 y_titolo=147, y_sub=[174], pct=("82%", 97, 398), etichetta=(167, 436), ofa=(113, 456),
                 av=dict(titolo="Rischio molto alto", lt=116, righe=["Con il tuo livello attuale potresti", "non superare l'OFA. Inizia a studiare", "per ridurre il rischio."],
                         lr=[175, 199, 111], y=518, passo=18.5),
                 fattori=[0.20, 0.35, 0.45, 0.50],
                 cardA=dict(ico="freccia-trend", titolo="Quanto puoi migliorare?", lt=152,
                            righe=[("Seguendo il piano di studio", None, 156), ("puoi ridurre il rischio fino al ", "20%", 190)]),
                 cta="Inizia a studiare", cta_l=117,
                 cardB=dict(ico="cappello-laurea", col_ico="#F58A2B", titolo="-30 € di costi aggiuntivi", lt=149,
                            righe=[("Supera l'OFA ed evita il pagamento,", 198), ("il blocco del piano di studi e il ritardo", 204), ("di almeno 1 anno.", 100)]),
                 vuoto="#FBE3E3", tv="#CBD5E1"),
    "medio": dict(n=2, dim=(331, 1384), nome="002-home-rischio-medio", pos=0.48,
                  titolo=("Stai facendo progressi!", 235), sub=[("Continua a studiare per ridurre", 224), ("ulteriormente il rischio.", 167)],
                  y_titolo=148, y_sub=[176, 196], pct=("46%", 95, 402), etichetta=(161, 431), ofa=(108, 453),
                  av=dict(titolo="Stai migliorando!", lt=108, righe=["Il tuo rischio si è ridotto del 36%", "rispetto alla prima valutazione.", "Continua così!"],
                          lr=[172, 166, 79], y=518, passo=18.5),
                  fattori=[0.60, 0.55, 0.65, 0.60],
                  cardA=dict(ico="bersaglio-freccia", titolo="Il tuo piano di studio", lt=136,
                             righe=[("Completa le lezioni consigliate", None, 173), ("per ridurre il rischio sotto il ", "20%", 190)]),
                  cta="Continua a studiare", cta_l=142,
                  cardB=dict(ico="calendario", titolo="Prossimo obiettivo", lt=117, chevron=True,
                             righe=[("Completa 3 lezioni di comprensione", 196), ("entro domani.", 77)]),
                  vuoto="#DDEEE0", tv="#8FCFAE"),
    "basso": dict(n=3, dim=(338, 1384), dw=9, nome="003-home-rischio-basso", pos=0.174,
                  titolo=("Ottimo lavoro!", 147), sub=[("Il tuo rischio di fallimento è ora molto", 272), ("basso. Puoi continuare a migliorare", 257), ("e ottenere più sicurezza.", 181)],
                  y_titolo=148, y_sub=[176, 199, 221], pct=("18%", 88, 402), etichetta=(166, 433), ofa=(113, 456),
                  av=dict(titolo="Rischio basso", lt=87, righe=["Con il tuo livello attuale hai ottime", "probabilità di superare l'OFA.", "Continua a mantenerti allenato."],
                          lr=[188, 168, 175], y=519, passo=18.5),
                  fattori=[0.85, 0.80, 0.78, 0.75],
                  cardA=dict(ico="documento", titolo="Simula l'esame", lt=103,
                             righe=[("Mettiti alla prova con una", None, 143), ("simulazione completa.", None, 127)]),
                  cta="Fai una simulazione", cta_l=143,
                  cardB=dict(ico="trofeo", col_ico="#F5A623", titolo="Sei quasi pronto!", lt=105,
                             righe=[("Consolida le tue conoscenze con", 186), ("altre simulazioni per arrivare all'esame", 210), ("ancora più preparato.", 135)]),
                  vuoto="#E3F0EA", tv="#9FD8BC"),
}
NOMI = [("Grammatica", "libro", 71), ("Comprensione", "cuffie", 92), ("Vocabolario", "Aa", 74), ("Ragionamento", "ingranaggio", 93)]


def card_info(t, y, h, spec, evid_col="#2E78F2", fondo="#EEF3FC", col_ico=None, bordo=False, dw=0):
    with t.gruppo("card-" + spec["ico"]):
        R(t, X_CARD, y, W_CARD + dw, h, 18, fondo, filtro=None if fondo != "#FFFFFF" else ombra(t, 2, 10, "#2563EB", 0.06))
        cy = y + h * (0.43 if h < 100 else 0.30)
        tile_icona(t, spec["ico"], X_ICO - 23 + 4, cy - 23, 46, colore=col_ico or "#2E78F2", sw=2.2)
        T(t, spec["titolo"], X_TXT, y + h * 0.22 + 5, larg=spec["lt"], peso=700 if h > 100 else 600)


def schermata(stato: str, v: dict):
    s = STATI[stato]
    W, H = v["dim"]
    dw = v.get("dw", 0)
    t = nuova(W, H, id=f"home-rischio-b-{stato}")
    barra_stato(t, 26, 309 + dw, 28, corpo=13.5)
    logo(t, LM, 89, larg=97)
    campanella(t, 289 + dw, 80, 22)
    tit, lt = v["titolo"]
    T(t, tit, LM, v["y_titolo"], larg=lt, peso=700, id="titolo")
    for i, (r_, lw) in enumerate(v["sub"]):
        T(t, r_, LM, v["y_sub"][i], larg=lw, peso=400, colore="#66708F", id=f"sottotitolo-{i + 1}")
    misuratore_rischio(t, 168 + dw / 2, 394, 129, v["pos"], 32, s["colore"], s["chiaro"], vuoto=v["vuoto"], alone=s["alone"], tacca_vuota=v["tv"], estremi=False)
    pct, wp, yp = v["pct"]
    cxp = 168 + dw / 2
    T(t, pct, cxp, yp, larg=wp, peso=800, colore=s["num"], ancora="middle", id="percentuale")
    T(t, "Rischio di fallimento", cxp, v["etichetta"][1], larg=v["etichetta"][0], peso=600, colore=s["etichetta"], ancora="middle")
    T(t, "all'OFA di inglese", cxp, v["ofa"][1], larg=v["ofa"][0], peso=400, colore="#66708F", ancora="middle")
    # avviso
    a = v["av"]
    avviso(t, X_CARD, 486, W_CARD + dw, 114, stato, a["titolo"], a["righe"], 17, 14, 89, a["y"], a["passo"], r=15, r_icona=18, x_icona=50,
           larg_righe=a["lr"], larg_titolo=a["lt"], col_riga="#66708F", col_titolo="#9B1218" if stato == "alto" else INK)
    # fattori
    T(t, "Cosa influenza il tuo rischio?", LM, 648, larg=217, peso=700, id="titolo-fattori")
    with t.gruppo("lista-fattori"):
        R(t, X_CARD, 664, W_CARD + dw, 287, 18, "#FFFFFF", filtro=ombra(t, 2, 12, "#2563EB", 0.05))
        for i, ((nome, ic, lw), val) in enumerate(zip(NOMI, v["fattori"])):
            yc = 699.5 + i * 71.5
            c, ch = colore_fattore(val)
            with t.gruppo(f"fattore-{nome.lower()}"):
                icona_fattore(t, ic, X_ICO + 1, yc, 47)
                T(t, nome, 89, yc - 3.5, larg=lw, peso=400, colore="#1F2937")
                barra_fattore(t, 89, yc + 6.5, 146 + dw, val, 11, c, ch)
                T(t, f"{round(val * 100)}%", 275 + dw, yc + 14.5, larg=26, peso=500, colore="#4B5A7A", ancora="end")
                I(t, "chevron-destra", 295 + dw, yc + 1, 22, "#7A869C", 2)
            if i < 3:
                L(t, 60, yc + 36, 300 + dw, yc + 36, "#EEF1F6", 1)
    # card A
    cA = v["cardA"]
    yA, hA = 974, 95
    card_info(t, yA, hA, cA, fondo="#EEF3FC", dw=dw)
    for i, (r_, evid, lw) in enumerate(cA["righe"]):
        yy = yA + 54 + i * 19
        if evid:
            tot = lw
            corpo = fit(r_ + evid, 400, tot)
            w1 = T(t, r_, X_TXT, yy, corpo, 400, "#66708F")
            T(t, evid, X_TXT + w1, yy, corpo * 1.02, 700, "#1D6BF2")
        else:
            T(t, r_, X_TXT, yy, larg=lw, peso=400, colore="#66708F")
    I(t, "chevron-destra", 295 + dw, yA + 47, 22, "#7A869C", 2)
    # pulsante
    pulsante_azione(t, X_CARD, 1087, W_CARD + dw, 60, v["cta"], 16, r=15, x_testo=90, peso=500)
    # card B
    cB = v["cardB"]
    yB, hB = 1175, 113
    card_info(t, yB, hB, cB, fondo="#FFFFFF", col_ico=cB.get("col_ico"), dw=dw)
    for i, (r_, lw) in enumerate(cB["righe"]):
        T(t, r_, X_TXT, yB + 53 + i * 19 - (0 if len(cB["righe"]) == 3 else 6), larg=lw, peso=400, colore="#66708F")
    if cB.get("chevron"):
        I(t, "chevron-destra", 295 + dw, yB + 33, 22, "#7A869C", 2)
    nav_home3(t, 0, 1298, 86, corpo=12.5, ico=30, indicatore=False, x1=W, y_ico=29, y_lab=59)
    return t


if __name__ == "__main__":
    for stato, v in VARIANTI.items():
        t = schermata(stato, v)
        svg = salva(t, CART, v["nome"] + ".svg")
        if vuole_tavola():
            controlla(svg, SRC / f"00{v['n']}-pannello.png", f"11-{stato}", 1.5)
