"""Scrive brand/concept-svg/_rapporti/logo.json (mappa elementi del catalogo -> SVG del logo)."""
import json, pathlib, sys
QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI))
from rif import RADICE

L = "brand/concept-svg/logo/"
ICONA = "strumenti/brand/logo/addiofa-logo.svg"
R = []


def v(el, stato, svg=None, nota=""):
    el = [i if len(i.split(".")[0]) == 2 else "0" + i for i in el]
    d = {"elementi": el, "stato": stato}
    if svg:
        d["svg"] = svg
    d["nota"] = nota
    R.append(d)


FR = "frammento: pezzo di wordmark/tagline tagliato dal ritaglio, coperto da "
v(["24.001"], "riuso", ICONA, "Stessa icona 3D gia' ricostruita (strumenti/brand/logo): confronto sul ritaglio mae 3.26, ssim 0.93 (tavola: _tavole/icona-app-stella.png). Nessuna variante nuova.")
v(["7.002", "15.001", "35.002"], "riuso", ICONA, "Icona app 3D a stella: stesso soggetto dell'immagine 24 (cambia solo il rendering AI); 15.001 e 35.002 sono pannelli che contengono anche etichette e icone secondarie (coperte dalle altre voci).")
v(["7.001"], "svg", L + "costruzione-marchio.svg", "Pannello 'Costruzione del brandmark': guide regolari (riquadro, assi, archi laterali) al posto delle linee AI doppie; tile con la stella-porta semplificata; didascalia in Inter distribuita come l'originale.")
v(["7.003", "7.009", "35.008", "35.009", "28.003", "28.004", "28.005", "28.006", "28.007", "28.017"], "svg", L + "wordmark-primario.svg",
  "Wordmark AddiOFA: Inter ExtraBold + O come disco vero con stella 4 punte simmetrica, FA crenate; misure (tracking, gap, crenatura FA, diametro O) adattate sul 28.003 (mae 17). Le lettere dell'originale sono piu' arrotondate: scelto Inter sharp come da brief. 28.004-.007/.017 e 35.008/.009 sono pezzi dello stesso wordmark (frammenti) coperti da questo file.")
v(["28.008", "28.009", "28.010", "28.011", "28.002", "35.017"], "svg", L + "wordmark-con-tagline.svg", "'Logo secondario': wordmark + tagline IL TUO INGLESE, SENZA OSTACOLI. (tagline distribuita uniformemente sulla larghezza). 28.008-.011 sono frammenti del wordmark piccolo, 28.002 e' l'etichetta 'Logo secondario' (testo coperto dal layout), 35.017 = variante monocromatica piccola (vedi wordmark-mono-nero).")
v(["28.020", "28.021", "28.022", "28.023", "35.010", "35.011", "35.012", "35.013", "35.014", "35.015", "35.006", "7.010", "7.020", "7.021", "15.008", "15.014"], "scartato", None,
  FR + "wordmark-con-tagline.svg / lockup-verticale.svg / wordmark-o-anello.svg (7.010/.020/.021, 35.006/.010-.015 e 28.020-.023 sono lettere/parole della tagline o del wordmark tagliate in pezzi; 15.008 e 15.014 sono la tagline 'Studia oggi, sblocca il tuo domani.' = testo coperto da wordmark-o-anello).")
v(["28.024"], "svg", L + "wordmark-bianco-su-scuro.svg", "Wordmark bianco su scheda blu notte, O bianca con stella nel colore del fondo; angoli della scheda uguali.")
v(["28.025", "28.026"], "svg", L + "wordmark-su-chiaro.svg", "Wordmark a colori su scheda bianca con bordo; 28.025/.026 sono due pezzi tagliati della scheda.")
v(["28.027", "28.031", "35.017"], "svg", L + "wordmark-mono-nero.svg", "Versione monocromatica nera (stella come ritaglio nel colore del fondo). 28.027/.031 pezzi tagliati.")
v(["28.028", "28.029", "28.030"], "svg", L + "wordmark-mono-grigio.svg", "Versione monocromatica grigia (#9AA2B6 circa). 28.028-.030 pezzi tagliati.")
v(["28.012"], "svg", L + "marchio-tile-stella4.svg", "'Logo compatto': tile ad angoli continui sfumato blu->blu notte con stella 4 punte bianca simmetrica.")
v(["28.042"], "svg", L + "marchio-tile-stella4-piatto.svg", "Tile blu piatto con stella 4 punte ('Stile icona').")
v(["28.044"], "svg", L + "stella4-contorno.svg", "Stella 4 punte a contorno: tratto costante, giunzioni tonde (originale con spessore irregolare).")
v(["28.045", "7.055"], "svg", L + "stella4-piena.svg", "Stella 4 punte piena blu, simmetrica (nell'originale 7.055 e' piu' alta che larga e con punte disuguali).")
v(["28.013"], "svg", L + "griglia-wordmark.svg", "Griglia di costruzione del wordmark: guide tratteggiate regolari, etichette x / 2x / x.")
v(["28.014", "28.015", "28.016", "28.018", "28.019"], "svg", L + "area-rispetto-wordmark.svg", "Area di rispetto: contorno, quattro moduli 'x' agli angoli, wordmark centrato. 28.014-.016 sono strisce tagliate della cornice, 28.018/.019 pezzi del wordmark.")
v(["7.004", "35.007"], "svg", L + "lettermark-a-blu.svg", "Lettermark: A piena blu con stella 4 punte ritagliata (evenodd), raccordi veri; piedi e gambe simmetrici.")
v(["7.005", "35.016"], "svg", L + "marchio-tile-porta.svg", "Icona semplificata piatta: tile blu con stella-porta chiara, bordo scuro e pavimento. Versione leggera (la 3D pesa 470 KB), usata nei lockup.")
v(["7.007", "35.005"], "svg", L + "marchio-tile-scuro.svg", "'App icon (dark)': tile blu notte con la stella-porta bianca. Nell'originale 35.005 la sagoma e' una casetta con la base tagliata male: qui la sagoma vera del logo 3D. 35.005 e' un pannello (contiene anche A e tile blu: vedi altre voci).")
v(["35.004"], "svg", L + "stella4-in-cerchio.svg", "Pannello 'App icon (colore)' + icone semplificate: l'icona colore e' il riuso 3D; qui la stella 4 punte in cerchio; la A e' lettermark-a-blu e il tile blu con stella a 5 punte e' marchio-tile-piatto-porta.svg.")
v(["35.002"], "riuso", ICONA, "App icon colore nel pannello (vedi sopra).")
v(["35.003"], "svg", L + "lockup-orizzontale.svg", "Pannello 'Logo variations': primario = wordmark-primario, con tagline = wordmark-con-tagline, orizzontale con icona = lockup-orizzontale, monocromatica = wordmark-mono-nero, scuro = wordmark-bianco-su-scuro.")
v(["7.006", "7.008", "35.010"], "scartato", None, "frammento: pezzi di wordmark tagliati, coperti da lockup-orizzontale.svg / wordmark-primario.svg")
v(["15.004", "15.005", "15.006", "15.007", "15.010", "15.011"], "svg", L + "wordmark-o-anello.svg", "Variante del concept 15: O come anello vuoto (senza stella) e tagline diversa. 15.004-.007 sono i pezzi (Add, i, O, FA) del wordmark grande; 15.010/.011 la copia piccola nel pannello 'Wordmark'.")
v(["15.009"], "scartato", None, "testo: etichetta 'Lettermark', coperta dal layout")
v(["15.012"], "svg", L + "lettermark-a-bicolore.svg", "A a Lambda bicolore navy/blu con controforma a stella a 5 punte (maschera). Taglio tra le due tinte pulito.")
v(["15.013"], "svg", L + "lettermark-a-tile.svg", "A bianca a Lambda su tile blu con stella blu; tile reso quadrato (nell'originale 91x100).")
v(["40.001"], "svg", L + "wordmark-hero-scuro.svg", "Hero 'Art direction' (foto+layout): ridisegnata solo la parte wordmark/tagline su fondo notte (Addi bianco, O/FA blu, tagline su 2 righe). Il resto e' foto/architettura (non vettorializzabile): a chi fa le foto/layout.")
v(["40.058"], "svg", L + "stella4-in-tondo-chiaro.svg", "Icona stella 4 punte blu in tondo chiaro (iconografia).")
v(["35.004"], "svg", L + "marchio-tile-piatto-porta.svg", "Tile blu piatto con stella-porta (icona semplificata).")
v([], "scartato", None, "Immagini 17, 16, 23, 27, 50: kit di illustrazioni/icone/colori/UI senza loghi, marchi o wordmark (nessun elemento da me). 23, 27, 50 sono lo stesso file (duplicati).")
json.dump(R, open(RADICE / "brand/concept-svg/_rapporti/logo.json", "w"), ensure_ascii=False, indent=1)
print(len(R), "voci")
