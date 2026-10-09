"""19.007 · Simulatore d'esame: titolo, sottotitolo, illustrazione (cronometro rosso su fogli e nuvola, disegnata), 4 simulazioni con 'Inizia'.
Kit rosso. Stessa schermata di 18.007. Corregge: refuso dell'AI 'e témpli e tempo reale' -> «e tempi reali.» (TESTO RICOSTRUITO);
pulsanti 'Inizia' non più tagliati dal bordo; icone dei 4 riquadri pulite."""
from componenti import *

ORIGINALE = ORIG / "19-schermate-profilo-statistiche-b/007-schermata.png"
CARTELLA, NOME = "19-schermate-profilo-statistiche-b", "07-simulatore.svg"
IDS = ["19.007"]
NOTA = "Simulatore d'esame. Sottotitolo ricostruito (refuso AI); illustrazione cronometro disegnata; stessa schermata di 18.007. Descrizioni durata/domande lette dall'originale."


def disegna():
    t = schermata("simulatore", "rosso", 590)
    t.barra_stato()
    intestazione_indietro(t, 60)
    t.testo("Simulatore d'esame", 24, 107, 26, 800, NAVY)
    t.testo("Preparati all'OFA con simulazioni ufficiali", 24, 134, 15.5, 400, "#4A5C9A")
    t.testo("e tempi reali.", 24, 155, 15.5, 400, "#4A5C9A")
    with t.gruppo("illustrazione-simulatore"):
        t.add('<g id="nuvola" fill="#E6EEFC"><ellipse cx="190" cy="225" rx="82" ry="22"/><ellipse cx="172" cy="206" rx="34" ry="24"/><ellipse cx="320" cy="214" rx="26" ry="28"/><ellipse cx="300" cy="232" rx="50" ry="14"/></g>')
        t.add('<g id="fogli" transform="rotate(-14 200 215)"><rect x="165" y="195" width="76" height="52" rx="7" fill="#F4F7FE" stroke="#DCE5FA" stroke-width="1.2"/>'
              '<rect x="177" y="208" width="42" height="5" rx="2.5" fill="#B8C9F3"/><rect x="177" y="220" width="30" height="5" rx="2.5" fill="#B8C9F3"/></g>')
        cronometro(t, 297, 197, 42)
    dati = [("cronometro", "#FDE8EA", ROS, "Simulazione completa", "Durata: 60 min • 3 sezioni"), ("documento-pieno", "#E8F0FD", "#1D6BF2", "Solo Grammar", "20 min • 40 domande"),
            ("cuffie", "#EEE9FD", "#7C3AED", "Solo Listening", "25 min • 30 domande"), ("documento-pieno", "#FFF1DD", "#F59E0B", "Solo Reading", "25 min • 30 domande")]
    for i, (ic, fondo, col, a, b) in enumerate(dati):
        yc = 280 + i * 71
        with t.gruppo("simulazione-" + a.lower().replace(" ", "-")):
            t.rett(24, yc - 24, 49, 49, 14, fill=fondo)
            t.icona(ic, 24 + 12, yc - 13, 26, col, 1.9 if ic != "documento-pieno" else 1)
            t.testo(a, 88, yc - 4, 15.5, 800, NAVY)
            t.testo(b, 88, yc + 17, 13.5, 400, "#4A5C9A")
            t.rett(286, yc - 23, 80, 46, 12, fill=t.sfumatura(["#F93C4C", "#F0222F"]), id="inizia-fondo")
            t.testo("Inizia", 326, yc + 5.5, 15, 600, "#FFFFFF", "middle")
    t.rett(195 - 67, 578, 134, 5, 2.5, fill="#0F172A", id="indicatore-home", opacita=0.85)
    return t
