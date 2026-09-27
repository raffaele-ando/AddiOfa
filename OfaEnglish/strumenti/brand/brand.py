"""
Estrae e ricrea gli elementi del brand di AddiOFA dalle immagini caricate.

    python3 strumenti/brand/brand.py tutto        # estrai + misura + glifi + vettorializza + tavole + token
    python3 strumenti/brand/brand.py misura       # misure degli elementi che diventano codice
    python3 strumenti/brand/brand.py glifi        # glifi delle icone, senza il cerchio
    python3 strumenti/brand/brand.py verifica     # componenti React confrontati con i PNG
    python3 strumenti/brand/brand.py estrai       # PNG identici al pixel, palette, schermate
    python3 strumenti/brand/brand.py vettori      # SVG ricreati e misurati in Chromium
    python3 strumenti/brand/brand.py tavole       # tavole di controllo originale | SVG | differenza
    python3 strumenti/brand/brand.py token        # colori della palette in CSS e JSON
    python3 strumenti/brand/brand.py logo [N]     # logo 3D in SVG, rifinito con N prove

Tutto finisce in OfaEnglish/brand/.
"""
from __future__ import annotations

import json
import pathlib
import runpy
import sys

QUI = pathlib.Path(__file__).resolve().parent
BRAND = QUI.parents[1] / "brand"


def token():
    palette = json.loads((BRAND / "estrazione.json").read_text())["palette"]
    righe = [f"  --brand-{p['nome']}: {p['dichiarato']}; /* misurato sul campione: {p['misurato']} */" for p in palette]
    (BRAND / "tokens.css").write_text(
        "/* Palette del Brand Kit AddiOFA (kit blu). Valori dichiarati nel kit; accanto il colore\n"
        "   misurato sul campione, che ha una leggera lucentezza. Generato da strumenti/brand/brand.py */\n"
        ":root {\n" + "\n".join(righe) + "\n}\n")
    (BRAND / "tokens.json").write_text(json.dumps({p["nome"]: {"valore": p["dichiarato"], "misurato": p["misurato"]}
                                                   for p in palette}, indent=1))
    print(BRAND / "tokens.css")


def main():
    comando = sys.argv[1] if len(sys.argv) > 1 else "tutto"
    sys.path.insert(0, str(QUI))
    if comando in ("estrai", "tutto"):
        import estrai; estrai.main()
    if comando in ("misura", "tutto"):
        import misura; misura.main()
    if comando in ("glifi", "tutto"):
        import glifi; glifi.main()
    if comando in ("vettori", "tutto"):
        import vettorializza; vettorializza.main()
    if comando in ("tavole", "tutto"):
        import tavola; tavola.main()
    if comando in ("token", "tutto"):
        token()
    if comando == "verifica":
        import verifica_codice; verifica_codice.main()
    if comando == "logo":
        sys.argv = [str(QUI / "logo" / "ottimizza.py"), "luce", sys.argv[2] if len(sys.argv) > 2 else "4000"]
        runpy.run_path(str(QUI / "logo" / "ottimizza.py"), run_name="__main__")


if __name__ == "__main__":
    main()
