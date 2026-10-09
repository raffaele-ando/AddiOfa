"""06.013 · Impostazioni (kit blu): 7 voci con icona, titolo e sottotitolo, divisori.
Corregge: tutte le icone dell'AI (storte/illeggibili: viso, sacchetto, tondo spezzato) -> icone vere (utente, cursori, campana,
scudo, collegamento, aiuto, info). Testi leggibili e tenuti. Tab-bar aggiunta."""
from componenti import *

ORIGINALE = ORIG / "06-schermate-sfide-progressi/013-schermata.png"
CARTELLA, NOME = "06-schermate-sfide-progressi", "13-impostazioni.svg"


def disegna():
    t = schermata("impostazioni", "blu", 844)
    t.barra_stato()
    titolo(t, "Impostazioni", 92, 24, 29)
    t.linea(24, 128, 366, 128, "#EEF1F6", 1, cap="butt")
    voci = [("utente-contorno", "Account", "Email, password, sicurezza"), ("sliders", "Preferenze", "Tema, lingua, notifiche"),
            ("notifica", "Notifiche", "Solo attività importanti"), ("scudo", "Privacy", "Dati e permessi"),
            ("link", "Collegamenti", "PoliNetwork, servizi esterni"), ("aiuto", "Aiuto", "FAQ e supporto"), ("info", "Informazioni", "Versione dell'app")]
    for i, (ic, a, b) in enumerate(voci):
        yc = 181 + i * 81
        with t.gruppo("impostazione-" + a.lower()):
            t.icona(ic, 30, yc - 15, 30, "#1E3A9E", 1.7)
            t.testo(a, 78, yc - 8, 16.5, 700, NAVY)
            t.testo(b, 78, yc + 17, 14.5, 400, SOTTO)
            if i < len(voci) - 1:
                freccia_dx(t, 352, yc, "#98A1B8", 15)
                t.linea(24, yc + 40, 366, yc + 40, "#EEF1F6", 1, cap="butt")
    tab_bar(t, NAV3, None)
    return t
