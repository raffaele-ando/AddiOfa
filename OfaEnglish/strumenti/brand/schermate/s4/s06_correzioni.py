"""18.006 · «Correzioni»: 8/10 risposte corrette, quattro domande con la risposta data (verde = giusta, rosso = sbagliata + risposta corretta).
Il ritaglio originale taglia il telefono a destra: la scheda e' ricostruita simmetrica (margine destro = sinistro).
Corregge: spunte e croce disegnate vere (nell'originale la X e' un pennello storto), margini uniformi, riquadri verdi tutti uguali;
nav con «Lezioni» attiva (nell'originale nessuna). Le frasi e le risposte sono quelle dell'originale (testo leggibile);
la frase 2 e' «They ___ playing football now.» con risposta data «is playing» e corretta «are playing» (come nell'immagine)."""
from comp_s4 import *

t = nuova(6)
X, Y, s = t.X, t.Y, t.s
stato18(t, 24)
t.icona("chevron-sinistra", X(26), Y(38), s(15), "#0B132B", 2.4, id="indietro")
riga(t, "Correzioni", 39, 78, corpo_per("Correzioni", 88, 800), 800, INK_R, id="titolo")
riga(t, "8/10 risposte corrette", 39, 96.5, corpo_per("8/10 risposte corrette", 127, 400), 400, BLU_T, id="sottotitolo")
voci = [(1, 109, 168, "She ___ to Milan last year.", 135, True, "went", 134, 162),
        (2, 174, 256, "They ___ playing football now.", 155, False, "is playing", 199, 249),
        (3, 263, 323, "I ___ seen that movie.", 115, True, "have", 289, 317),
        (4, 332, 393, "He ___ at home yesterday.", 140, True, "was", 358, 386)]
for num, y0, y1, frase, w, ok, risp, b0, b1 in voci:
    with t.gruppo(f"correzione-{num}"):
        cy = y0 + 14 if num > 0 else 0
        cyn = {1: 122.7, 2: 187.7, 3: 276.7, 4: 345.7}[num]
        t.cerchio(X(36), Y(cyn), s(11), fill="#DFE8FB", id=f"correzione-{num}-numero-fondo")
        riga(t, str(num), 36, cyn + 4, 11.5, 700, "#2B5FD9", ancora="middle", id=f"correzione-{num}-numero")
        t.rett(X(55), Y(y0), s(221), s(y1 - y0), s(9), fill="#FFFFFF", stroke="#ECEFF6", sw=s(0.8), id=f"correzione-{num}-card",
               filtro=t.ombra(s(0.8), s(3), "#3B5BA8", 0.05))
        riga(t, frase, 63, y0 + 16, corpo_per(frase, w, 500), 500, "#1C2760", id=f"correzione-{num}-frase")
        t.rett(X(62), Y(b0), s(206), s(b1 - b0), s(8), fill="#E3F6E4" if ok else "#FDE4E6", id=f"correzione-{num}-risposta-fondo")
        yc = b0 + 14
        if ok:
            t.icona("spunta", X(78) - s(7), Y(yc) - s(7), s(14), "#1FAE4E", 3.0, id=f"correzione-{num}-spunta")
            riga(t, risp, 95, yc + 4.5, 12, 600, "#1F9D45", id=f"correzione-{num}-risposta")
        else:
            t.icona("x", X(76) - s(6.5), Y(yc) - s(6.5), s(13), "#EE2433", 3.4, id=f"correzione-{num}-croce")
            riga(t, risp, 95, yc + 4.5, 12, 600, "#EE2433", id=f"correzione-{num}-risposta")
            w1 = riga(t, "Risposta corretta: ", 64, 240.5, corpo_per("Risposta corretta:", 88, 400), 400, BLU_T, id="correzione-2-corretta-etichetta")
            riga(t, "are playing", 157, 240.5, corpo_per("are playing", 55, 800), 800, INK_R, id="correzione-2-corretta-valore")
nav(t, 404, 462, attiva=1, centri=[58, 151, 244])
chiudi18(t)
