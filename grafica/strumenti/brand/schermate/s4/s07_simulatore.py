"""18.007 · «Simulatore d'esame»: titolo + sottotitolo, illustrazione cronometro/foglio (scena disegnata: il kit ha un blocco appunti, non un cronometro) e
quattro righe (Simulazione completa 60 min, Solo Grammar, Solo Listening, Solo Reading) con «Inizia».
Il ritaglio taglia il telefono a destra: margine destro ricostruito uguale al sinistro.
Corregge: sottotitolo AI con testo storto («e témpli e tempo reale») -> «e tempi reali.» (TESTO RICOSTRUITO); icone delle righe (quadrato
rosso illeggibile, cuffie viola con omino) -> lista, documento, cuffie, libro; pulsanti tutti uguali e allineati; durate e domande dall'originale."""
from comp_s4 import *

t = nuova(7)
X, Y, s = t.X, t.Y, t.s
stato18(t, 24)
t.icona("chevron-sinistra", X(54), Y(38), s(15), "#0B132B", 2.4, id="indietro")
riga(t, "Simulatore d’esame", 59, 78, corpo_per("Simulatore d’esame", 164, 800), 800, INK_R, id="titolo")
c = corpo_per("Preparati all’OFA con simulazioni ufficiali", 202, 400)
riga(t, "Preparati all’OFA con simulazioni ufficiali", 59, 96.5, c, 400, BLU_T, id="sottotitolo-1")
riga(t, "e tempi reali.", 59, 111.5, c, 400, BLU_T, id="sottotitolo-2")
scena_cronometro(t, 115, 177)
righe_ = [("Simulazione completa", "Durata: 60 min • 3 sezioni", 107, 112, "lista", "#EE2433", "#FDECEC", "#FADADD"),
          ("Solo Grammar", "20 min • 40 domande", 73, 102, "documento", "#1F6BF0", "#EAF1FD", "#DCE8FB"),
          ("Solo Listening", "25 min • 30 domande", 72, 102, "cuffie", "#7C4DEB", "#F1ECFD", "#E6DEFB"),
          ("Solo Reading", "25 min • 30 domande", 69, 102, "libro", "#F59E0B", "#FEF1DF", "#FCE5C2")]
for i, (tit, sub, w1, w2, ic, col, f1, f2) in enumerate(righe_):
    cy = 201.7 + i * 50.5
    with t.gruppo(f"simulazione-{i + 1}"):
        t.rett(X(53), Y(cy - 17), s(35), s(34), s(9), fill=t.sfumatura([f1, f2]), id=f"simulazione-{i + 1}-tessera")
        glifo_c(t, ic, 70.5, cy, 17, col, id=f"simulazione-{i + 1}-icona")
        riga(t, tit, 100, cy - 4.7, corpo_per(tit, w1, 700), 700, INK_R, id=f"simulazione-{i + 1}-titolo")
        riga(t, sub, 100, cy + 10.5, corpo_per(sub, w2, 400), 400, BLU_T, id=f"simulazione-{i + 1}-dettagli")
        pulsante(t, 232, cy - 16.5, 291, cy + 16.5, "Inizia", corpo=12, id=f"simulazione-{i + 1}-inizia")
nav(t, 404, 462, attiva=1, centri=[83, 172, 261])
chiudi18(t)
