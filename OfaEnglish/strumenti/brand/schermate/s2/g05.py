"""Immagine 5 · funnel d'invito (13 schermate, pulsanti rossi con accenti blu). Si lancia da solo: python3 g05.py [numeri...]

Corregge rispetto all'originale: avanzamento a 3 segmenti uguali (nell'originale lunghezze e posizioni diverse, a volte un puntino
rosso storto nella 7), barra di stato normalizzata, pulsanti con altezza uguale e chevron a destra, avatar disegnati al posto
delle foto, icone a 4 voci della barra inferiore (la 'Classifica' dell'originale ha un glifo con cerchietti rossi illeggibile:
sostituito con il trofeo). Testi: tutti leggibili; ricostruiti dove segnalato nelle docstring.
"""
import sys, math
import registro  # noqa
from comuni import *
from extra import *

TITOLO = "#0B1033"
SOTTO = "#6B7690"
BLU_A = "#2D6FF2"


def testata(t, indietro_=True, attivo=None, x_av=None, y=51):
    stato_telefono(t)
    if indietro_:
        indietro(t, 20, y - 1, 15)
    if attivo is not None:
        avanzamento3(t, x_av if x_av is not None else t.W / 2, y, attivo)


def titolo(t, righe, x, y, passo, larg, peso=800, colore=TITOLO):
    c = fit(max(righe, key=len), peso, larg)
    for i, r in enumerate(righe):
        T(t, r, x, y + i * passo, c, peso, colore, id=f"titolo-{i + 1}")
    return c


def s01():
    t = nuova("05-01-intro")
    stato_telefono(t)
    T(t, "OFA Inglese", 15, 46, None, 600, "#1B2440", larg=58, id="marchio-app")
    T(t, "Politecnico di Milano", 15, 59, None, 500, "#7A86A3", larg=77, id="marchio-ateneo")
    avanzamento3(t, 177, 51, 1, w=13, gap=5.5)
    titolo(t, ["Hai già", "superato l’OFA", "di inglese?"], 15, 107, 24.5, 143, 800)
    righe_t(t, ["Questa app è pensata per chi", "deve ancora sostenerlo."], 15, 181, 11.5, 16, 400, SOTTO, larg=[165, 134], id="sottotitolo")
    illus(t, "kit-blu/illustrazioni/studio-inglese", 36, 215, 182, 320, soglia=90, per="altezza")
    pulsante_contorno(t, 14, 332, 195, 32, "Sì, ho già la certificazione", 10, freccia=True, larg=128, x_testo=29, id="pulsante-secondario")
    pulsante_rosso(t, 14, 376, 195, 34, "No, devo ancora superarlo", 10.2, freccia=True, larg=134, x_testo=29, id="pulsante-primario")
    return chiudi(t)


def s02():
    t = nuova("05-02-certificazione")
    testata(t, True, 1, 98)
    titolo(t, ["Hai già una", "certificazione?"], 16, 105, 23.5, 134, 800)
    righe_t(t, ["Perfetto! Abbiamo preparato", "una guida gratuita con tutte", "le informazioni utili."], 16, 155, 10.6, 15.4, 400, SOTTO,
            larg=[157, 146, 99], id="sottotitolo")
    guida_spunta(t, 90, 261, 1.1)
    pulsante_rosso(t, 13, 349, 170, 40, "Scarica la guida gratuita", 10.2, larg=128, id="pulsante-primario")
    return chiudi(t)


def s03():
    t = nuova("05-03-verifica-livello")
    testata(t, True, 1, 98)
    titolo(t, ["Verifichiamo", "il tuo livello"], 16, 105, 23.5, 116, 800)
    righe_t(t, ["Rispondi a 10 domande per", "stimare la tua probabilità", "di superare l’OFA."], 16, 155, 10.6, 15.4, 400, SOTTO,
            larg=[145, 134, 93], id="sottotitolo")
    illus(t, "kit-blu/illustrazioni/quiz-test", 24, 203, 172, 322, soglia=25)
    pulsante_rosso(t, 16, 352, 158, 38, "Inizia il test", 10.2, larg=62, id="pulsante-primario")
    return chiudi(t)


def s04():
    t = nuova("05-04-domanda")
    stato_telefono(t)
    indietro(t, 19, 45, 15)
    T(t, "3/10", 98, 46, None, 500, "#6C7DA6", "middle", larg=22, id="contatore")
    R(t, 16, 68, 174, 5, 2.5, "#EAEEF5", id="avanzamento-fondo")
    R(t, 16, 68, 63, 5, 2.5, t.sfumatura(["#3F82F6", "#2A6DF0"], 0, 0, 1, 0), id="avanzamento-pieno")
    c = fit("She ____ to Milan", 800, 118)
    T(t, "She ___ to Milan", 20, 108, c, 700, "#0B1033", id="domanda-1", larg=118)
    T(t, "last year.", 20, 129, c, 700, "#0B1033", id="domanda-2", larg=64)
    for i, (tx, sel) in enumerate((("go", False), ("going", False), ("went", True), ("goes", False))):
        y = 152 + i * 42
        R(t, 16, y, 174, 37, 9, "#EAF1FD" if sel else "#F8FAFD", stroke="#CFE0FB" if sel else "#EEF1F6", sw=1, id=f"risposta-{i + 1}")
        if sel:
            C(t, 40, y + 18.5, 8.6, "#FFFFFF", stroke="#2D6FF2", sw=2, id=f"risposta-{i + 1}-radio")
            C(t, 40, y + 18.5, 4.4, "#2D6FF2")
        else:
            C(t, 40, y + 18.5, 8.6, "#FFFFFF", stroke="#C3CBDA", sw=1.3, id=f"risposta-{i + 1}-radio")
        T(t, tx, 61, y + 22.5, 10.8, 500, "#0B1033", id=f"risposta-{i + 1}-testo")
    pulsante_rosso(t, 16, 361, 174, 36, "Avanti", 10.4, id="pulsante-primario")
    return chiudi(t)


def s05():
    t = nuova("05-05-risultato")
    testata(t, True, 1, 82, y=49)
    T(t, "Il tuo risultato", 23, 93, None, 800, TITOLO, larg=130, id="titolo")
    righe_t(t, ["Ecco la tua probabilità attuale", "di superare l’OFA di inglese."], 23, 111, 9.8, 15, 400, SOTTO, larg=[147, 140], id="sottotitolo")
    t.misuratore(t.p(99.5), t.p(205), t.p(70), 0.33, spessore=t.p(13), colore="#F0303B", chiaro="#FF6B6B", tacche=False, id="misuratore-32")
    T(t, "32%", 99.5, 197, None, 800, "#E3202B", "middle", larg=60, id="percentuale")
    T(t, "Alta probabilità", 96, 218, None, 600, "#E3202B", "middle", larg=78, id="misuratore-didascalia-1")
    T(t, "di non superarlo", 96, 233.5, None, 600, "#E3202B", "middle", larg=79, id="misuratore-didascalia-2")
    R(t, 12, 250, 176, 105, 9, t.sfumatura(["#FEF2F2", "#FDEDED"]), id="scheda-conseguenze")
    for i, (ic, tx, lw) in enumerate((("euro", "~30 € di costi aggiuntivi", 98), ("lucchetto", "Piano di studi bloccato", 94),
                                      ("documento", "Nessun esame al secondo anno", 133), ("scudo", "Ritardo di almeno 1 anno", 107))):
        y = 267 + i * 23.4
        with t.gruppo(f"conseguenza-{i + 1}"):
            R(t, 26, y - 6, 12, 12, 3.2, "#F04050")
            I(t, ic, 32, y, 8.4, "#FFFFFF", 2.4)
            T(t, tx, 47.5, y + 3.2, None, 400, "#374158", larg=lw, id=f"conseguenza-{i + 1}-testo")
    pulsante_rosso(t, 16, 370, 168, 37, "Continua", 10.6, larg=45, id="pulsante-primario")
    return chiudi(t)


def s06():
    t = nuova("05-06-verifica-account")
    testata(t, True, 1, 98, y=48)
    T(t, "Verifica il tuo", 17, 92, None, 800, TITOLO, larg=124, id="titolo-1")
    T(t, "account Polimi", 17, 117, None, 800, TITOLO, larg=137, id="titolo-2")
    righe_t(t, ["Inserisci la tua email istituzionale", "per salvare i risultati e sbloccare", "tutti i contenuti."], 17, 141, 9.8, 15.4, 400, SOTTO,
            larg=[164, 152, 79], id="sottotitolo")
    R(t, 15, 193, 167, 38, 9, "#FFFFFF", stroke="#EEF1F6", sw=1, id="campo-email", filtro=t.ombra(t.p(1), t.p(4), "#0F172A", 0.05))
    I(t, "mail", 37, 212, 14, "#3D4B73", 2, id="campo-email-icona")
    T(t, "@polimi.it", 168, 216, None, 700, "#1B2440", "end", larg=50, id="campo-email-testo")
    with t.gruppo("nota-privacy"):
        C(t, 25, 262, 9.5, "#E6EBF4", id="scudo-fondo")
        I(t, "scudo", 25, 262, 11, "#51648F", 2.4, fill_pieno="#51648F")
        righe_t(t, ["I tuoi dati sono al sicuro", "e verranno usati solo per", "verificare che sei uno studente", "del Politecnico di Milano."], 45, 264, 9.4, 13, 400, "#6B7690", id="nota")
    pulsante_rosso(t, 15, 357, 167, 36, "Continua", 10.6, larg=45, id="pulsante-primario")
    return chiudi(t)


def s07():
    t = nuova("05-07-sblocca-accesso")
    testata(t, True, 1, 86, y=46)
    T(t, "Sblocca l’accesso", 17, 89, None, 800, TITOLO, larg=141, id="titolo-1")
    T(t, "gratis", 17, 110, None, 800, TITOLO, larg=48, id="titolo-2")
    righe_t(t, ["Invita 3 studenti del Polimi", "che hanno già superato l’OFA."], 17, 130, 9.8, 15, 400, SOTTO, larg=[129, 143], id="sottotitolo")
    utenti_piu(t, 82, 201, 0.78)
    scheda_ombra(t, 14, 231, 148, 122, 9, "#FFFFFF", "#F1F3F8", 0.05, id="scheda-passi")
    for i, (y, righe) in enumerate(((248, ["Condividi il tuo link"]), (275, ["I tuoi amici si registrano", "con la email Polimi"]),
                                    (311, ["Quando 3 amici completano", "la registrazione, sblocchi", "tutti i contenuti"]))):
        with t.gruppo(f"passo-{i + 1}"):
            C(t, 32, y, 8, t.sfumatura(["#35C970", "#1FA84F"]))
            T(t, str(i + 1), 32, y + 3, 8.6, 700, "#FFFFFF", "middle")
            for j, r_ in enumerate(righe):
                T(t, r_, 49, y + 3.5 + j * 12, 8.8, 400, "#4A5575", id=f"passo-{i + 1}-riga-{j + 1}")
    pulsante_contorno(t, 14, 358, 149, 26, "Più tardi", 9.6, larg=37, id="pulsante-secondario")
    pulsante_rosso(t, 14, 387, 149, 27, "Invita 3 amici", 9.8, larg=62, id="pulsante-primario")
    return chiudi(t)


def s08():
    t = nuova("05-08-inviti")
    testata(t, True, None, y=46, x_av=None)
    T(t, "I tuoi inviti", 19, 90, None, 800, TITOLO, larg=98, id="titolo")
    T(t, "2 di 3 completati", 19, 108, None, 400, SOTTO, larg=100, id="sottotitolo")
    with t.gruppo("avanzamento-inviti"):
        R(t, 50, 143, 135, 4, 2, "#EAEEF5", id="linea-fondo")
        R(t, 50, 143, 70, 4, 2, "#22B35A", id="linea-piena")
        verde_spunta(t, 37, 145, 10, id="invito-1-fatto")
        verde_spunta(t, 118, 145, 10, id="invito-2-fatto")
        C(t, 199, 145, 9.4, "#FFFFFF", stroke="#C9D0DE", sw=1.3, id="invito-3-vuoto")
    scheda_ombra(t, 15, 175, 206, 146, 10, "#FFFFFF", "#F1F3F8", 0.04, id="scheda-inviti")
    righe = (("Luca Bianchi", "Ha completato", "m2", True), ("Giulia Rossi", "Ha completato", "f2", True), ("Amico 3", "In attesa...", None, False))
    for i, (nome, st, pers, ok) in enumerate(righe):
        y = 198 + i * 48
        with t.gruppo(f"invito-{i + 1}"):
            if pers:
                persona(t, pers, 41, y, 17)
            else:
                avatar_neutro(t, 41, y, 17)
            T(t, nome, 71, y - 6, None, 600, "#1B2440", larg=len(nome) * 5.55, id=f"invito-{i + 1}-nome")
            T(t, st, 71, y + 10, None, 400, "#8E98B0", larg=(70 if ok else 47), id=f"invito-{i + 1}-stato")
            if ok:
                verde_spunta(t, 198, y, 10)
            else:
                C(t, 198, y, 9.4, "#FFFFFF", stroke="#C9D0DE", sw=1.3)
        if i < 2:
            L(t, 62, y + 24, 215, y + 24, "#F0F2F7", 1)
    pulsante_rosso(t, 15, 339, 206, 42, "Invita un amico", 11.4, larg=92, icona_sx="condividi-nodi", id="pulsante-primario")
    return chiudi(t)


def s09():
    t = nuova("05-09-condividi-link")
    testata(t, True, None, y=46)
    T(t, "Condividi il tuo link", 19, 96, None, 800, TITOLO, larg=168, id="titolo")
    righe_t(t, ["Invita studenti del Polimi", "che hanno già superato l’OFA."], 19, 121, 10.6, 17, 400, SOTTO, larg=[134, 164], id="sottotitolo")
    R(t, 19, 177, 198, 38, 9, "#F3F5F9", id="campo-link")
    T(t, "app.ofa-polimi.it/invite/RAFF...", 30, 200, None, 500, "#1B2440", larg=148, id="campo-link-testo")
    I(t, "copia", 199, 196, 15, "#1B2440", 1.8, id="campo-link-copia")
    for cx, nome, f in ((38, "Whatsapp", marchio_whatsapp), (92, "Instagram", marchio_instagram), (147, "Messaggi", marchio_messaggi)):
        with t.gruppo(f"condividi-{nome.lower()}"):
            f(t, cx, 256, 17)
            T(t, nome, cx, 292, None, 500, "#6B7690", "middle", larg=len(nome) * 4.6)
    with t.gruppo("condividi-altro"):
        R(t, 183, 239, 34, 34, 10, "#EEF1F7")
        for dx in (-7, 0, 7):
            C(t, 200 + dx, 256, 2.1, "#46557E")
        T(t, "Altro", 200, 292, None, 500, "#6B7690", "middle", larg=20)
    return chiudi(t)


def s10():
    t = nuova("05-10-accesso-sbloccato")
    testata(t, True, None, y=46)
    coriandoli(t, [(57, 88, 17, -30, "#51669A"), (94, 83, 15, 80, "#EE3340"), (130, 92, 13, 70, "#EE3340"), (165, 87, 19, -50, "#2F6FE6"),
                   (35, 111, 16, 40, "#F7B733"), (187, 113, 16, -40, "#F7B733"), (32, 158, 17, 60, "#2F6FE6"), (192, 152, 16, -50, "#2F6FE6"),
                   (54, 193, 15, -35, "#F7B733"), (175, 188, 14, 45, "#F27B2C")])
    regalo(t, 109, 158, 1.32)
    T(t, "Accesso sbloccato!", 113, 247, None, 800, TITOLO, "middle", larg=170, id="titolo")
    righe_t(t, ["Hai invitato 3 amici e ora hai", "l’accesso gratuito a tutti", "i contenuti."], 113, 274, 11, 17.5, 400, SOTTO, "middle", id="sottotitolo", larg=[165, 141, 65])
    pulsante_rosso(t, 16, 339, 195, 42, "Inizia a studiare", 11.4, larg=92, id="pulsante-primario")
    return chiudi(t)


def s11():
    t = nuova("05-11-home")
    stato_telefono(t, 18, 216)
    T(t, "OFA Inglese", 19, 46, None, 600, "#1B2440", larg=58, id="marchio-app")
    T(t, "Politecnico di Milano", 19, 60, None, 500, "#7A86A3", larg=82, id="marchio-ateneo")
    C(t, 204, 48, 14, "#EDF1F8", id="profilo-fondo")
    I(t, "utente-contorno", 204, 48, 15, "#51648F", 2, id="profilo")
    T(t, "Ciao, Raffaele", 15, 115, None, 800, TITOLO, larg=128, id="saluto")
    mano_saluto(t, 168, 107, 0.95)
    T(t, "Continua la tua preparazione.", 15, 136, None, 400, SOTTO, larg=164, id="sottotitolo")
    R(t, 15, 155, 204, 125, 11, "#F4F7FC", id="scheda-progresso")
    T(t, "Il tuo progresso", 26, 174, None, 600, "#2A3350", larg=72, id="progresso-titolo")
    with t.gruppo("anello-progresso"):
        C(t, 66, 231, 38, "none", stroke="#E3EBF9", sw=9, id="anello-fondo")
        a1 = -math.pi / 2 + 2 * math.pi * 0.62
        t.path(f"M{n(t.p(66))} {n(t.p(193))}A{n(t.p(38))} {n(t.p(38))} 0 1 1 {n(t.p(66 + 38 * math.cos(a1)))} {n(t.p(231 + 38 * math.sin(a1)))}", stroke="#3B82F6", sw=t.p(9), id="anello-valore")
    T(t, "62%", 66, 240, None, 800, TITOLO, "middle", larg=41, id="anello-percentuale")
    with t.gruppo("obiettivo"):
        C(t, 127, 222, 7, "none", stroke="#3B82F6", sw=1.4, id="obiettivo-icona")
        C(t, 127, 222, 2.4, "#3B82F6")
        T(t, "Obiettivo", 142, 226, None, 600, "#1F2A44", larg=40)
        T(t, "Superare l’OFA", 142, 239, None, 400, "#7A86A3", larg=61)
    pulsante_rosso(t, 15, 296, 204, 50, "", 10, id="pulsante-primario", larg=1)
    C(t, 42, 321, 17, "#FFFFFF", id="pulsante-primario-pallino")
    I(t, "play", 43.5, 321, 17, "#EE2433", 1, id="pulsante-primario-play")
    T(t, "Continua a studiare", 72, 318, None, 600, "#FFFFFF", larg=109, id="pulsante-primario-titolo")
    T(t, "Grammar – Future Tenses", 72, 332, None, 400, "#FFFFFF", larg=110, id="pulsante-primario-sottotitolo", opacita=0.92)
    nav4(t, 0, 360, t.H - 360)
    return chiudi(t)


def riga_classifica(t, y, pos, nome, pct, pers, evid=False):
    with t.gruppo(f"classifica-{pos}"):
        if evid:
            R(t, 6, y - 17, 214, 34, 9, "#E4EDFB", id=f"classifica-{pos}-evidenza")
        if pos <= 3:
            corona(t, 23, y, 17, ("#F4B72C", "#B8C3D6", "#E98A3A")[pos - 1], pos, id=f"classifica-{pos}-corona")
        else:
            T(t, str(pos), 23, y + 4, 11, 600, "#1B2440", "middle", id=f"classifica-{pos}-posizione")
        persona(t, pers, 58, y, 11.2)
        T(t, nome, 80, y + 4, None, 500 if not evid else 600, "#2B3550" if not evid else "#2D6FF2", larg=len(nome) * 4.6, id=f"classifica-{pos}-nome")
        T(t, pct, 210, y + 4, None, 600, "#1B2440" if not evid else "#2D6FF2", "end", larg=21, id=f"classifica-{pos}-percentuale")


def s12():
    t = nuova("05-12-classifica")
    stato_telefono(t, 18, 211)
    indietro(t, 20, 46, 15)
    avanzamento3(t, 107, 47, 1, n_seg=2, w=16, gap=5, colore="#5B7AB8")
    T(t, "Classifica", 17.5, 89, None, 800, TITOLO, larg=84, id="titolo")
    R(t, 16, 101, 194, 22, 8, "#F0F4FB", id="schede-fondo")
    R(t, 16, 101, 66, 22, 8, "#DCE8FB", id="scheda-attiva")
    T(t, "Settimana", 49, 115, None, 600, "#1D4FC4", "middle", larg=41, id="scheda-settimana")
    T(t, "Mese", 121, 116, None, 500, "#8E98B0", "middle", larg=20, id="scheda-mese")
    T(t, "Sempre", 183, 116, None, 500, "#8E98B0", "middle", larg=28, id="scheda-sempre")
    for i, (nome, pct, pers) in enumerate((("Marco R.", "98%", "m1"), ("Giulia F.", "96%", "f1"), ("Alessandro C.", "92%", "m3"),
                                           ("Tu", "88%", "f2"), ("Sara M.", "86%", "f3"), ("Davide L.", "84%", "m4"))):
        riga_classifica(t, 146 + i * 33.3, i + 1, nome, pct, pers, evid=(nome == "Tu"))
    nav4(t, 3, 360, t.H - 360)
    return chiudi(t)


def s13():
    t = nuova("05-13-profilo")
    stato_telefono(t, 18, 208)
    indietro(t, 20, 46, 15)
    T(t, "Il tuo profilo", 17.5, 88, None, 800, TITOLO, larg=102, id="titolo")
    avatar_neutro(t, 43, 128, 27, id="avatar-profilo")
    T(t, "Raffaele A.", 80, 124, None, 600, "#1B2440", larg=64, id="nome")
    T(t, "Studente @ Polimi", 80, 141, None, 400, "#7A86A3", larg=88, id="ruolo")
    R(t, 16, 167, 196, 56, 11, "#F3F6FC", id="scheda-posizione")
    T(t, "#4", 43, 203, None, 800, TITOLO, "middle", larg=22, id="posizione")
    T(t, "Posizione in classifica", 78, 186, None, 400, "#6B7690", larg=90)
    T(t, "88%", 78, 208, None, 700, "#1FA64B", larg=23, id="posizione-percentuale")
    I(t, "chevron-destra", 205, 195, 10, "#2A3350", 2.2)
    for i, (ic, tit, sub, wt, ws, y0) in enumerate((("gruppo", "I tuoi inviti", "2 di 3 completati", 52, 73, 232), ("barre-crescenti", "Statistiche", "Vedi i tuoi progressi", 50, 88, 277),
                                                    ("impostazioni", "Impostazioni", None, 61, 0, 322))):
        h_ = 43 if i < 2 else 38
        scheda_ombra(t, 16, y0, 196, h_, 10, "#FFFFFF", "#F1F3F8", 0.03, id=f"voce-{i + 1}")
        I(t, ic, 31, y0 + 21, 15, "#51648F", 1.9, id=f"voce-{i + 1}-icona", fill_pieno="#51648F" if ic == "barre-crescenti" else None)
        if sub:
            T(t, tit, 79, y0 + 21, None, 600, "#1B2440", larg=wt)
            T(t, sub, 79, y0 + 36, None, 400, "#7A86A3", larg=ws)
        else:
            T(t, tit, 79, y0 + 24, None, 600, "#1B2440", larg=wt)
        I(t, "chevron-destra", 205, y0 + 21, 10, "#2A3350", 2.2)
    nav4(t, 3, 360, t.H - 360)
    return chiudi(t)


def main(sel):
    for nome, f in globals().items():
        if len(nome) == 3 and nome.startswith("s") and nome[1:3].isdigit() and callable(f) and (not sel or nome[1:3] in sel):
            f()


if __name__ == "__main__":
    main(sys.argv[1:])
