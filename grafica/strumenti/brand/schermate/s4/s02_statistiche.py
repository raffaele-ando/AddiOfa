"""18.002 · «Le tue statistiche»: filtro «Ultimi 30 giorni», tre tessere (24 quiz, 4h 20m, 82 %), grafico a barre «Andamento risultati»,
«Per abilità» con quattro barre. Corregge: percentuali coerenti con le barre (nell'originale 88 % ha la barra all'85 %, 76 % al 69 %, ecc.:
qui la lunghezza e' la percentuale scritta); icone delle abilita' (pallini illeggibili) sostituite da documento, Aa, cuffie, libro;
barre del grafico ridisegnate uguali e allineate (nell'originale altezze/opacita' a caso, una barra azzurra isolata); voce «Profilo» attiva
nella nav (l'originale non ne aveva). Testo ricostruito: nessuno."""
from comp_s4 import *

t = nuova(2)
X, Y, s = t.X, t.Y, t.s
stato18(t, 25)
riga(t, "Le tue statistiche", 46, 65, corpo_per("Le tue statistiche", 150, 800), 800, INK_R, id="titolo")
t.rett(X(207), Y(68), s(87), s(20), s(10), fill="#F1F4FA", id="filtro-periodo")
riga(t, "Ultimi 30 giorni", 213, 81, corpo_per("Ultimi 30 giorni", 64, 500), 500, "#1B2757", id="filtro-periodo-testo")
t.icona("chevron-giu", X(282), Y(75), s(7), "#1B2757", 2.6, id="filtro-periodo-freccia")
tessere = [(43, 118, "#FEF3F4", "#FCEAEC", "24", "Quiz svolti", "barre", ROSSO_B2, 72, 88, 59, 101),
           (128, 210, "#F2F6FD", "#E8EFFA", "4h 20m", "Tempo di studio", "orologio", "#1F6BF0", 144, 193, 137, 201),
           (221, 295, "#F0F9F4", "#E6F4EC", "82%", "Media risultati", "bersaglio", "#1FA855", 244, 272, 230, 285)]
for i, (a, b, f1, f2, val, et, ic, col, vx0, vx1, ex0, ex1) in enumerate(tessere):
    cx = (a + b) / 2
    t.rett(X(a), Y(99), s(b - a), s(80), s(10), fill=t.sfumatura([f1, f2]), id=f"tessera-{i + 1}")
    if ic == "orologio":
        t.cerchio(X(cx), Y(122), s(10), fill=col, id="tessera-2-icona")
        t.path(f"M{n(X(cx))} {n(Y(116))}V{n(Y(122))}L{n(X(cx + 3.5))} {n(Y(124.5))}", stroke="#FFFFFF", sw=s(1.9), id="tessera-2-lancette")
    else:
        glifo_c(t, ic, cx, 122, 24 if ic == "barre" else 22, col, id=f"tessera-{i + 1}-icona")
    riga(t, val, cx, 153, corpo_per(val, vx1 - vx0, 800), 800, INK_R, ancora="middle", id=f"tessera-{i + 1}-valore")
    riga(t, et, cx, 170, corpo_per(et, ex1 - ex0, 400), 400, BLU_T, ancora="middle", id=f"tessera-{i + 1}-etichetta")
# grafico
t.rett(X(43), Y(191), s(251), s(121), s(11), fill="#FFFFFF", stroke="#EDF0F6", sw=s(0.8), id="card-andamento", filtro=t.ombra(s(0.8), s(3), "#3B5BA8", 0.05))
riga(t, "Andamento risultati", 56, 217, corpo_per("Andamento risultati", 114, 700), 700, INK_R, id="andamento-titolo")
riga(t, "82%", 280, 217, corpo_per("82%", 27, 800), 800, INK_R, ancora="end", id="andamento-percentuale")
t.linea(X(46), Y(231), X(282), Y(231), "#EEF1F6", 1, cap="butt", id="andamento-filetto")
tops = [797, 833, 833, 780, 811, 831, 775, 810, 808, 762, 724, 802, 773, 742, 790, 802, 769, 737]
liv = [0, 1, 1, 2, 1, 1, 2, 0, 2, 3, 3, 0, 3, 3, 2, 0, 3, 3]
cols = {0: "#F9CDD1", 1: "#F8B5BB", 2: "#F57F89", 3: "#EF2A3A"}
with t.gruppo("grafico-barre"):
    for i, (tp, lv) in enumerate(zip(tops, liv)):
        x = 60.5 + i * 13.15
        h = 295 - tp / 3
        t.rett(X(x - 4.2), Y(295 - h), s(8.4), s(h), s(4.2), fill=("#E3EAF8" if i == 0 else cols[lv]), id=f"barra-{i + 1}")
# per abilita'
riga(t, "Per abilità", 46, 339, corpo_per("Per abilità", 54, 700), 700, INK_R, id="abilita-titolo")
riga(t, "Vedi dettagli", 211, 339, corpo_per("Vedi dettagli", 64, 500), 500, "#2E6CF0", id="abilita-dettagli")
chevron(t, 284, 334, 8, "#2E6CF0", id="abilita-dettagli-freccia", sp=2.6)
voci = [("Grammar", 0.88, "documento", "#F2313F"), ("Vocabulary", 0.76, "Aa", "#F2313F"), ("Listening", 0.84, "cuffie", "#F5743F"), ("Reading", 0.90, "libro", "#F5A623")]
for i, (et, v, ic, col) in enumerate(voci):
    yc = 361 + i * 27
    t.rett(X(46), Y(yc - 8), s(16), s(16), s(4), fill=col, id=f"abilita-{i + 1}-tessera")
    if ic == "Aa":
        t.testo("Aa", X(54), Y(yc) + s(3.3), s(8.6), 800, "#FFFFFF", "middle")
    else:
        glifo_c(t, ic, 54, yc, 10.5, "#FFFFFF", id=f"abilita-{i + 1}-icona")
    riga(t, et, 71, yc + 5, corpo_per(et, {0: 43, 1: 56, 2: 46, 3: 42}[i], 600), 600, INK_R, id=f"abilita-{i + 1}-nome")
    barra_px(t, 137, 249, yc, 9, v, id=f"abilita-{i + 1}-barra")
    riga(t, f"{round(v * 100)}%", 286, yc + 5, corpo_per("88%", 22, 700), 700, INK_R, ancora="end", id=f"abilita-{i + 1}-percentuale")
nav(t, 466, 520, attiva=2, centri=[76, 167, 257])
chiudi18(t)
