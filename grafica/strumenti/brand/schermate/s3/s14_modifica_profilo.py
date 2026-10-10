"""06.014 · Modifica profilo (kit blu): freccia indietro + titolo, 'Salva', avatar con pulsante fotocamera, campi Nome, Username,
Email (disattivata, grigia), Bio. Corregge: foto -> avatar neutro; refuso 'voita' -> 'volta' nella bio; icona fotocamera vera;
l'originale è tagliato a destra (campi alla larghezza intera). Testo ricostruito: nessuno (campi di esempio dell'originale)."""
from componenti import *

ORIGINALE = ORIG / "06-schermate-sfide-progressi/014-schermata.png"
CARTELLA, NOME = "06-schermate-sfide-progressi", "14-modifica-profilo.svg"


def campo(t, y_label, etichetta, testo, disattivo=False, h=50, righe=None):
    col_e = "#AEB6C8" if disattivo else "#2A3564"
    t.testo(etichetta, 24, y_label, 13.5, 500, col_e)
    t.rett(24, y_label + 8, 342, h, 14, fill="#FBFCFE", stroke="#E4E9F3", sw=1.3, id="campo-" + etichetta.lower())
    if righe:
        for i, r in enumerate(righe):
            t.testo(r, 40, y_label + 36 + i * 22, 15, 400, "#4A5578")
    else:
        t.testo(testo, 40, y_label + 39, 15.5, 400, "#B3BACB" if disattivo else "#4A5578")


def disegna():
    t = schermata("modifica-profilo", "blu", 870)
    t.barra_stato()
    t.icona("chevron-sinistra", 24, 80, 22, NAVY, 2.4, id="indietro")
    t.testo("Modifica profilo", 52, 98, 18.5, 800, NAVY, id="titolo")
    t.testo("Salva", 366, 98, 16, 600, AZZ, "end", id="salva")
    avatar(t, 195, 207, 62, 0, id="avatar-profilo")
    t.cerchio(237, 252, 19, fill="#FFFFFF", filtro=t.ombra(2, 6, "#0F172A", 0.18), id="fotocamera-fondo")
    t.icona("fotocamera", 226, 241, 22, AZZ, 1.8, id="fotocamera")
    campo(t, 350, "Nome", "Raffaele")
    campo(t, 446, "Username", "raffaele.ando")
    campo(t, 542, "Email", "raffaele@polimi.it", disattivo=True)
    campo(t, 638, "Bio", None, h=128, righe=["Studente del Politecnico di Milano.", "Cerco di superare l'OFA di inglese", "un giorno alla volta."])
    t.path("M348 752l-8 8M354 758l-8 8", stroke="#BAC2D4", sw=1.4, id="maniglia")
    t.rett(195 - 67, 858, 134, 5, 2.5, fill="#0F172A", id="indicatore-home", opacita=0.85)
    return t
