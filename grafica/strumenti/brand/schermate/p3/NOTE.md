# p3 · landing desktop (immagini 41, 45, 51)

`python3 genera_tutto.py` rifà foto ripulite, 3 SVG a pagina intera (viewBox 1440x960, sezioni come gruppi con id), 4 telefoni riusabili
(layout/45-…/componenti/), tavole (brand/concept-svg/_tavole/p3/, `*-landing.png` = originale|disegno|differenza, `*-solo.png`) e il rapporto.
Scarti: 41 mae 21 / ssim 0,74; 45 mae 18 / 0,73; 51 mae 15 / 0,80 (alti perché foto e scene 3D non sono ricalcate: giudicare dalle tavole).

Cosa ho imparato
- Una landing AI a pagina intera si fa in PIXEL ORIGINALI (1536x1024) dentro un `<g transform=scale(.9375)>`: le misure lette sugli zoom si scrivono così come sono (`componenti.Pagina`).
- Le foto vanno ripulite con inpainting (cv2) prima di incorporarle: maschere = riquadri + soglia colore (testo bianco su scuro, scuro su chiaro); sfumare il bordo della zona
  riempita con una maschera sfocata; le zone grandi (telefoni) si riempiono a 1/4 di risoluzione e si sfocano. Il sigillo nella foto si cancella allo stesso modo (cerchio) e si mette il segnaposto.
- Dissolvenza foto/fondo vettoriale: `maschera_dissolvenza` + `con_maschera` (SVG mask con gradiente): evita bordi netti dove la foto finisce.
- Mai applicare `skewX` senza traslare prima nel punto di rotazione: sposta tutto di y*tan(angolo). `a_mano()` usa translate-rotate-skew.
- `ui.icona(..., fill_pieno="none")` mette anche stroke none: per icone solo contorno disegnare a mano o usare icone di tipo "p".
- TelaCompatta (ui/extra.py) tiene una pagina con molto testo sotto i 200 KB (foto escluse).
- La 3D dell'hero 41 (tile con foro a stella, scalinata) è una resa semplificata: il foro-porta e le scale sono la parte meno convincente.
