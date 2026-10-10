"""Scrive brand/concept-svg/_rapporti/luminoso.json (lo si rilancia dopo ogni soggetto finito)."""
import json, pathlib
R = pathlib.Path(__file__).resolve().parents[4] / "brand/concept-svg"
L = "brand/concept-svg/illustrazioni-luminose/"
V = L + "vivo/"
voci = []
def add(el, st, svg=None, nota=""):
    d = {"elementi": el, "stato": st, "nota": nota}
    if svg: d["svg"] = svg
    voci.append(d)

# (nome, id luminoso, id vivo, nota)
SOGG = [
 ("studio-inglese", ["16.022"], ["17.022"], "Libri: oggetti.libro()+bandiera_uk() riusati con palette scura; bandiera posata sul piano della copertina, diagonali rosse sfalsate; alone arancione sul fianco."),
 ("quiz-test", ["16.023"], ["17.023"], "Foglio e contenuti nello stesso gruppo ruotato; tre caselle uguali a passo costante; lettere Inter, spunta disegnata. Nel 17 le risposte sono A/B/C (B rossa)."),
 ("risultato-probabilita", ["16.024"], ["17.024"], "Pallina calcolata sull'angolo reale dell'82%; nel 17 il blu pieno arriva alla pallina (l'originale aveva tre stati); testo 82% in tracciati. Testo ricostruito: nessuno, cifra vista."),
 ("rischio-economico", ["16.025"], ["17.025"], "Tre banconote con stessa inclinazione, € vero (Inter); sigillino regolare; bagliore dal bordo basso-destra."),
 ("piano-studi-bloccato", ["16.026"], ["17.026"], "Griglia 3x2 regolare, anelli uguali, arco del lucchetto a U costante, buco chiave centrato (acceso nel luminoso; lucchetto rosso nel 17). Oggetto nuovo lucchetto() in oggetti_nuovi.py."),
 ("superamento", ["16.027"], ["17.027"], "Foglio con righe a lunghezza decrescente, due fogli dietro, distintivo verde con spunta vera."),
 ("mancato-superamento", ["16.034"], ["17.037", "17.038"], "Come superamento ma con distintivo rosso e croce; 17.037/17.038 sono due ritagli della stessa illustrazione."),
 ("successo", ["16.028"], ["17.030", "17.028", "17.029"], "Coppa su asse specchiata, manici uguali, stella regolare, tre raggi uguali (17.028/029 erano frammenti dei raggi, inclusi qui). Oggetto nuovo trofeo()."),
 ("suggerimenti-consigli", ["16.029"], ["17.031"], "Bulbo = cerchio + cono tangente; filamento a due steli specchiati; cinque raggi radiali equidistanti."),
 ("email-polimi", ["16.031"], ["17.034"], "Busta con aletta raccordata e pieghe simmetriche. Sigillo del Politecnico NON riprodotto: segnaposto neutro (id sigillo-segnaposto) nel 17; nel luminoso stella accesa come nell'originale."),
 ("verifica-utente", ["16.032"], ["17.035"], "Carta d'identità: avatar costruito (testa cerchio, busto a fondo piatto), tre righe decrescenti nello stesso gruppo ruotato."),
 ("accesso-bloccato", ["16.033"], ["17.036", "17.044"], "Finestra browser con tocco da laureato simmetrico e orologio con lancette alle 12 e 4; 17.044 (orologio) incluso nella scena."),
 ("progressi-statistiche", ["16.035"], ["17.039"], "Quattro barre larghe uguali, passo costante, stessa linea di appoggio; calore arancione dal piede nel luminoso."),
]
import os
EXTRA = json.load(open(R / "_rapporti/luminoso_extra.json")) if (R / "_rapporti/luminoso_extra.json").exists() else []
for nome, a, b, nota in SOGG + [tuple(x) for x in EXTRA]:
    if (R.parent.parent / (L + nome + ".svg")).exists():
        add(a, "svg", L + nome + ".svg", nota + " Variante scura: " + nome + ".scuro.svg.")
    if (R.parent.parent / (V + nome + ".svg")).exists():
        add(b, "svg", V + nome + ".svg", nota + " (kit 'vivo', immagine 17: stessa illustrazione senza bagliore.)")
(R / "_rapporti").mkdir(exist_ok=True)
json.dump(voci, open(R / "_rapporti/luminoso.json", "w"), ensure_ascii=False, indent=1)
print(len(voci), "voci")
