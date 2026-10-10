"""
Rilancia tutto il lavoro p3: foto ripulite, le tre landing (41, 45, 51), i telefoni riusabili, le tavole di confronto e il rapporto.
    python3 genera_tutto.py
"""
import json
import foto
import gen_41, gen_45, gen_51
from componenti import *  # noqa
from componenti import Pagina, TelaCompatta, USCITA, TAVOLE, RADICE, tavola, telefono, schermo_rischio, schermo_domanda, schermo_obiettivo, schermo_piano


class Libera(Pagina):
    """Pagina senza scala (componenti riusabili): coordinate = viewBox (filtri e ombre restano dimensionati sulla pagina intera)."""
    def __init__(self, id, w, h):
        TelaCompatta.__init__(self, W, H, fondo=None, id=id)
        self.vw, self.vh = w, h

    def svg(self):
        import re
        s = TelaCompatta.svg(self)
        return re.sub(r'viewBox="[^"]*" width="[^"]*" height="[^"]*"', f'viewBox="0 0 {self.vw} {self.vh}" width="{self.vw}" height="{self.vh}"', s, count=1)


def componenti():
    out = []
    for nome, fn in [("telefono-sei-a-rischio", schermo_rischio), ("telefono-domanda", schermo_domanda),
                     ("telefono-obiettivo-raggiunto", schermo_obiettivo), ("telefono-piano-di-studio", schermo_piano)]:
        t = Libera(nome, 260, 540)
        telefono(t, 10, 10, 240, 520, fn, id=nome)
        p = USCITA / "45-landing-desktop-b" / "componenti" / f"{nome}.svg"
        t.salva(p)
        out.append(p)
    return out


def rapporto(comp):
    r = lambda p: str(p.relative_to(RADICE))
    L = {41: "brand/concept-svg/layout/41-landing-desktop/01-landing.svg", 45: "brand/concept-svg/layout/45-landing-desktop-b/01-landing.svg",
         51: "brand/concept-svg/layout/51-landing-desktop-c/01-landing.svg"}
    v = [{"elementi": ["41.001"], "stato": "svg", "svg": L[41],
          "nota": "Landing A a pagina intera, tutta vettoriale (nessuna foto): scena arco-stella ridisegnata (tile blu con foro a stella luminoso, scalinata, edifici/alberi sfocati, vetri), "
                  "card dei rischi con nastro rosso, logo dal kit. Corretto: icona Home sbilenca, simboli dei punti di forza; scritte a terra inglesi mantenute (glifi Inter, testo ricostruito); "
                  "cifre 82 % e 30 € lette dall'originale, non verificate; nessun sigillo."}]
    e45 = {1: ("raster", "Hero: foto dell'arco con la stella e lo studente (raster, ripulita da titolo/menu/telefoni con inpainting) + navigazione, titolo, pulsanti, 4 telefoni, 5 bolle in vettoriale. "
                         "Menu 'Prezz' corretto in 'Prezzi'; schermate dei telefoni ridisegnate dal kit; tab ricostruite (Home/Studio/Statistiche); 12.000+ e 82 %/30 € letti dall'originale, non verificati."),
           3: ("raster", "Pannello 'Il tuo futuro': foto dell'edificio del Politecnico (raster, testo cancellato e ridisegnato vettoriale)."),
           16: ("raster", "Pannello CTA: foto del tile con stella (raster, testo/badge cancellati); titoli, testo, badge App Store e Google Play e scritta a mano rifatti in vettoriale (testo ricostruito)."),
           2: ("svg", "Colonna sinistra (card di funzione/telefono) rifatta nel gruppo perche-addiofa e hero."), }
    for i in range(1, 24):
        stato, nota = e45.get(i, ("svg", "Vettoriale nel layout: " + {4: "telefono 'Sei a rischio?' (anche come componente a parte)", 5: "bolla/icona", 6: "icona", 7: "testo di scheda",
                                                                    8: "testo di scheda", 9: "icona tonda del vantaggio", 10: "icona tonda del vantaggio", 11: "titolo scheda", 12: "testo scheda",
                                                                    13: "icona scheda", 14: "titolo scheda", 15: "testo scheda", 17: "icona", 18: "pannello", 19: "titolo", 20: "testo",
                                                                    21: "icona", 22: "testo", 23: "icona"}.get(i, "elemento")+ "; ricomposto come gruppo del layout (gruppi hero, vantaggi, perche-addiofa, dati-reali, pannello-futuro, cta-store)."))
        v.append({"elementi": [f"45.{i:03d}"], "stato": stato, "svg": L[45], "nota": nota})
    e51 = {1: ("raster", "Hero e fascia 'La realtà / Il tuo domani': tre foto raster ripulite (testi, menu, paginazione, scritte a mano cancellati; SIGILLO del pilastro rimosso e sostituito dal segnaposto 'sigillo-segnaposto'); "
                         "tutto il testo, i pulsanti, il misuratore 82 %, la paginazione (corretta da '01 02 03 04 04' a 01-04) e le scritte a mano (Inter inclinato, testo ricostruito) in vettoriale.")}
    for i in range(1, 17):
        stato, nota = e51.get(i, ("svg", "Vettoriale nel gruppo come-funziona del layout (4 passi con mini-schermate ridisegnate semplificate: domanda, piano, simulazione, documento con spunta; testi letti dall'originale) "
                                          "o nel pannello/etichette del layout."))
        v.append({"elementi": [f"51.{i:03d}"], "stato": stato, "svg": L[51], "nota": nota})
    for p in comp:
        v.append({"elementi": ["45.004"], "stato": "svg", "svg": r(p), "nota": "Componente riusabile: telefono con schermata del kit (usato anche nelle landing)."})
    d = RADICE / "brand/concept-svg/_rapporti"
    d.mkdir(exist_ok=True)
    (d / "p3.json").write_text(json.dumps(v, ensure_ascii=False, indent=1))


def main():
    foto.main()
    for g, n_ in [(gen_41, 41), (gen_45, 45), (gen_51, 51)]:
        p = g.main()
        m = tavola(p, n_, TAVOLE / f"{n_}-landing.png", 1.0)
        print(n_, m)
    rapporto(componenti())


if __name__ == "__main__":
    main()
