"""18.003 · «Frasi e vocaboli»: ricerca + filtri (Tutte / Preferite / Da ripassare / Già note) + sei frasi con traduzione, altoparlante e stella.
Corregge: stelle disegnate vere (nell'originale a 5 punte storte) e con la stessa grandezza; chip «Già note» (tagliato dal margine) rimesso
dentro; nav con «Lezioni» attiva (come l'originale). Testi leggibili: nessun testo ricostruito."""
from comp_s4 import *

t = nuova(3)
X, Y, s = t.X, t.Y, t.s
stato18(t, 25)
riga(t, "Frasi e vocaboli", 36, 61, corpo_per("Frasi e vocaboli", 134, 800), 800, INK_R, id="titolo")
with t.gruppo("ricerca"):
    t.rett(X(33), Y(74), s(217), s(30), s(10), fill="#EEF2FB", id="ricerca-campo")
    t.icona("ricerca", X(42), Y(80), s(15), "#1F2F66", 2.2, id="ricerca-icona")
    riga(t, "Cerca una frase, parola o tema...", 63, 94.5, corpo_per("Cerca una frase, parola o tema...", 144, 400), 400, "#5A6EA0", id="ricerca-segnaposto")
with t.gruppo("filtri-ricerca"):
    t.rett(X(258), Y(74), s(30), s(30), s(10), fill="#EEF2FB", id="filtri-fondo")
    for i, (yy, kx) in enumerate(((82, 6), (89, 5), (96, 7))):
        t.linea(X(266), Y(yy), X(281), Y(yy), "#1F2F66", s(1.5), id=f"filtri-linea-{i + 1}")
    for yy, kx in ((82, 276), (89, 270), (96, 278)):
        t.cerchio(X(kx), Y(yy), s(2.3), fill="#EEF2FB", stroke="#1F2F66", sw=s(1.5))
# chip
chip = [("Tutte", 33, 83, True, 47, 70), ("Preferite", 92, 151, False, 103, 140), ("Da ripassare", 159, 234, False, 170, 223), ("Già note", 242, 293, False, 251, 286)]
with t.gruppo("filtri-chip"):
    for et, a, b, on, tx0, tx1 in chip:
        if on:
            t.rett(X(a), Y(116), s(b - a), s(26), s(8), fill=t.sfumatura(["#F43540", "#EE2433"]), filtro=t.ombra(s(1), s(4), "#E11D2B", 0.25), id="chip-tutte")
        else:
            t.rett(X(a), Y(116), s(b - a), s(26), s(8), fill="#EEF2FB", id=f"chip-{et.lower().replace(' ', '-').replace('à', 'a')}")
        riga(t, et, tx0, 134.5, corpo_per(et, tx1 - tx0, 500), 500, "#FFFFFF" if on else "#2E58B8", id=f"chip-testo-{et.lower().replace(' ', '-').replace('à', 'a')}")
frasi = [("I’m looking forward to it.", "Non vedo l’ora.", 130, 76, True), ("It depends.", "Dipende.", 60, 45, False),
         ("Once in a while.", "Ogni tanto.", 84, 56, True), ("I’d rather not.", "Preferirei di no.", 75, 76, False),
         ("That makes sense.", "Ha senso.", 101, 49, False), ("Let me know.", "Fammi sapere.", 72, 74, False)]
for i, (en, it, w1, w2, fav) in enumerate(frasi):
    y0 = 156 + i * 51.8
    with t.gruppo(f"frase-{i + 1}"):
        t.rett(X(33), Y(y0), s(255), s(46), s(9), fill="#FFFFFF", stroke="#EBEFF6", sw=s(0.8), id=f"frase-{i + 1}-card",
               filtro=t.ombra(s(0.8), s(3), "#3B5BA8", 0.05))
        t.rett(X(41), Y(y0 + 10), s(26), s(26), s(7), fill="#EAF1FE", id=f"frase-{i + 1}-audio-fondo")
        glifo_c(t, "altoparlante", 54, y0 + 23, 15, "#2B6BEA", id=f"frase-{i + 1}-audio")
        riga(t, en, 83, y0 + 19, corpo_per(en, w1, 700), 700, INK_R, id=f"frase-{i + 1}-inglese")
        riga(t, it, 83, y0 + 36, corpo_per(it, w2, 400), 400, BLU_T, id=f"frase-{i + 1}-italiano")
        stella(t, 270.7, y0 + 23, 15, fav, id=f"frase-{i + 1}-preferita")
nav(t, 466, 520, attiva=1, centri=[68, 160, 252])
chiudi18(t)
