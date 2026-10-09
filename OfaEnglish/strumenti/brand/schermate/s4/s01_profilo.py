"""18.001 · «Il tuo profilo»: avatar (sagoma segnaposto, non foto), livello B2 65 %, streak 12 / classifica #4, banner CRAM Pass Pro,
menu (obiettivi, statistiche, certificazioni, impostazioni), nav con «Profilo» attivo.
Corregge: barra del livello al 58 % nell'originale con scritto 65 % -> portata al 65 %; icone del menu (pupazzetto, badge storto,
ingranaggio sfocato) sostituite da bersaglio, grafico, scudo, ingranaggio; ingranaggio in alto a destra pulito; nav pulita.
Testo ricostruito: nessuno (tutto leggibile; 'Raffaele A.' e 'Studente @ Polimi' sono nell'originale)."""
from comp_s4 import *

t = nuova(1)
X, Y, s = t.X, t.Y, t.s
stato18(t, 24)
riga(t, "Il tuo profilo", 70, 62.5, corpo_per("Il tuo profilo", 104, 800), 800, INK_R, id="titolo")
glifo_c(t, "ingranaggio", 308.5, 52, 19, "#4A5F8E", id="impostazioni-in-alto")
tondo_utente(t, 98.5, 104.5, 27.5)
riga(t, "Raffaele A.", 140, 104, corpo_per("Raffaele A.", 74, 700), 700, INK_R, id="nome")
riga(t, "Studente @ Polimi", 140, 121, corpo_per("Studente @ Polimi", 103, 400), 400, BLU_T, id="ruolo")
# livello
card_chiara(t, 66, 140, 319, 200, 9, id="card-livello")
t.rett(X(76), Y(153), s(35), s(34), s(8), fill="#FDE7E9", id="livello-icona-fondo")
glifo(t, "barre", 93.5, 170, 22, ROSSO_B2)
riga(t, "Livello attuale", 130, 158, corpo_per("Livello attuale", 59, 500), 500, "#1B2757", id="livello-etichetta")
riga(t, "B2", 130, 178, 15, 700, INK_R, id="livello-valore")
riga(t, "65%", 306, 178, corpo_per("65%", 22, 700), 700, INK_R, ancora="end", id="livello-percentuale")
barra_px(t, 130, 306, 187, 6.5, 0.65, id="livello-barra")
# streak e classifica
for nome, x0, x1, ic, val, et in (("streak", 67, 187, "fiamma", "12", "Giorni di streak"), ("classifica", 199, 319, "trofeo", "#4", "in classifica")):
    card_chiara(t, x0, 209, x1, 258, 9, fill="#FFFFFF", bordo="#ECEFF6", id=f"card-{nome}", ombra=True)
    cx = x0 + 22
    if ic == "fiamma":
        glifo_c(t, "fiamma", cx, 233, 28, "#F5A21B", id="icona-fiamma")
    else:
        glifo_c(t, "trofeo", cx + 1, 233, 27, "#F2A71B", id="icona-trofeo")
    riga(t, val, x0 + 45, 235, 17.5, 800, INK_R, id=f"{nome}-valore")
    riga(t, et, x0 + 45, 249, corpo_per(et, 65 if ic == "fiamma" else 49, 400), 400, BLU_T, id=f"{nome}-etichetta")
# banner pro
t.rett(X(66), Y(267), s(253), s(48), s(9), fill="#FDEEE2", stroke="#FBE4D3", sw=s(0.6), id="banner-pro")
icona_colore(t, "stella", 90.5, 291, 27, "#FBA62A", 1.2, id="banner-stella", pieno=True)
riga(t, "CRAM Pass Pro", 117, 289, corpo_per("CRAM Pass Pro", 89, 700), 700, INK_R, id="banner-titolo")
riga(t, "Sblocca simulazioni illimitate", 117, 302, corpo_per("Sblocca simulazioni illimitate", 141, 400), 400, "#3F4F7A", id="banner-sottotitolo")
chevron(t, 305.5, 292, 11, "#1D2A55", id="banner-chevron")
# menu
for i, (ic, et) in enumerate((("bersaglio", "I tuoi obiettivi"), ("grafico", "Statistiche"), ("scudo", "Certificazioni"), ("ingranaggio", "Impostazioni"))):
    yc = 342 + i * 33
    if i == 0:
        t.linea(X(111), Y(325), X(319), Y(325), "#EEF1F6", 1, id="menu-filetto-0", cap="butt")
    t.linea(X(111), Y(358 + i * 33 - 0), X(319), Y(358 + i * 33), "#EEF1F6", 1, id=f"menu-filetto-{i + 1}", cap="butt")
    glifo_c(t, {"grafico": "barre"}.get(ic, ic), 83, yc, 19, "#5C719E", id=f"menu-icona-{i + 1}")
    riga(t, et, 112, yc + 5, corpo_per(et, {0: 70, 1: 58, 2: 71, 3: 70}[i], 600) * 0.97, 600, "#0F1B4D", id=f"menu-voce-{i + 1}")
    chevron(t, 309, yc, 11, "#1D2A55", id=f"menu-chevron-{i + 1}")
nav(t, 466, 520, attiva=2, centri=[100, 193, 287])
chiudi18(t)
