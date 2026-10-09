"""19.006 · Correzioni (8/10 risposte corrette): 4 domande con numero, risposta giusta (verde), errata (rosa) con 'Risposta corretta: are playing'.
Kit rosso. Stessa schermata di 18.006. L'originale è tagliato a destra: schede alla larghezza intera.
Corregge: il numero e le schede avevano margini diversi per ogni riga; qui un solo passo."""
from componenti import *

ORIGINALE = ORIG / "19-schermate-profilo-statistiche-b/006-schermata.png"
CARTELLA, NOME = "19-schermate-profilo-statistiche-b", "06-correzioni.svg"
IDS = ["19.006"]
NOTA = "Correzioni con 4 domande (3 giuste, 1 errata). Testi letti dall'originale; stessa schermata di 18.006."


def disegna():
    t = schermata("correzioni", "rosso", 600)
    t.barra_stato()
    intestazione_indietro(t, 60)
    t.testo("Correzioni", 24, 113, 26, 800, NAVY)
    t.testo("8/10 risposte corrette", 24, 140, 17, 400, "#4A5C9A")
    dati = [("She ___ to Milan last year.", "went", True, None), ("They ___ playing football now.", "is playing", False, "are playing"),
            ("I ___ seen that movie.", "have", True, None), ("He ___ at home yesterday.", "was", True, None)]
    y = 159
    for i, (q, a, ok, giusta) in enumerate(dati):
        h = 118 if not ok else 86
        with t.gruppo(f"domanda-{i + 1}"):
            t.cerchio(38, y + 28, 17, fill="#E5EDFC")
            t.testo(str(i + 1), 38, y + 34, 15, 700, "#2F55C4", "middle")
            t.rett(64, y, 302, h, 16, fill="#FFFFFF", stroke="#F0F2F8", sw=1.2, filtro=t.ombra(1, 6, "#0F172A", 0.05))
            t.testo(q, 76, y + 24, 14.5, 400, NAVY)
            if ok:
                t.rett(72, y + 36, 286, 40, 11, fill="#E4F6EA", id="risposta-giusta")
                t.icona("spunta", 82, y + 46, 20, "#17A24F", 2.8)
                t.testo(a, 112, y + 62, 16, 600, "#17A24F")
            else:
                t.rett(72, y + 36, 286, 74, 11, fill="#FDE8EB", id="risposta-errata")
                t.icona("x", 83, y + 46, 18, "#EF1C2E", 3)
                t.testo(a, 112, y + 60, 16, 600, "#EF1C2E")
                w = t.testo("Risposta corretta: ", 82, y + 97, 14, 400, "#4A5C9A")
                t.testo(giusta, 82 + w, y + 97, 14, 700, NAVY)
        y += h + 10
    t.rett(195 - 67, 588, 134, 5, 2.5, fill="#0F172A", id="indicatore-home", opacita=0.85)
    return t
