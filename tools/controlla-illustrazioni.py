#!/usr/bin/env python3
"""
Elenca le illustrazioni di `app/src/brand/catalogo.ts` (le voci `grafica`) e dice, per ognuna, se
- il file c'è davvero in `app/src/brand/essenziali/disegni/` (chiaro e `.scuro.svg`);
- il suo `nome` compare tra virgolette in qualche file di `app/src` che parla di illustrazioni (nomina `Illustrazione`, `urlDisegno`
  o un campo `illustrazione`; schermate, componenti, lib…), esclusi
  tutta la cartella `src/brand/` (catalogo, componenti, animazioni: non sono schermate).
  Per `kit-luminoso` e `kit-rosso` il file deve nominare anche il kit (stesso nome in kit diversi).

Esce con codice 1 se trova illustrazioni NON usate e NON giustificate in `NON_USATE_OK` (sotto), o file mancanti.
Va lanciato a fine lavoro da chi tocca le schermate:

    python3 tools/controlla-illustrazioni.py            # elenco e verdetto
    python3 tools/controlla-illustrazioni.py --usate    # mostra anche dove è usata ogni voce

Il piano «schermata -> illustrazione» è in `docs/design/ILLUSTRAZIONI.md`.
"""
from __future__ import annotations

import fnmatch
import json
import pathlib
import re
import subprocess
import sys

RADICE = pathlib.Path(__file__).resolve().parent.parent
APP = RADICE / "app"
SRC = APP / "src"
DISEGNI = SRC / "brand" / "essenziali" / "disegni"

# Chiave `kit/gruppo/nome` (con * ammesso) -> perché è lecito che nessuna schermata la usi.
# Ogni motivo è una scelta di prodotto o di coerenza, non una dimenticanza: se una schermata nuova può usarla, si toglie da qui.
NON_USATE_OK: dict[str, str] = {
    # kit rosso: l'app è blu (colore d'azione). Compare solo nel catalogo ?brand come alternativa di colore.
    "kit-rosso/*": "kit rosso: alternativa di colore, l'app è blu; le sue composizioni diverse esistono in blu (vedi docs/design/ILLUSTRAZIONI.md)",
    "kit-blu/stati/caricamento": "immagine ferma di un anello: lo spinner che gira è il componente Caricamento (brand/componenti.tsx); un'immagine ferma darebbe l'idea di un blocco",
    "kit-blu/illustrazioni/composizione-tre": "ha scritto nel disegno «82 %»: un numero inventato accanto al misuratore; in app il misuratore è il componente con il valore vero",
    "kit-blu/stati/notifica": "l'app non ha notifiche (nessun invio dal server): un'illustrazione di notifica promette ciò che non c'è",
    "kit-blu/sfere/*": "sfere di vetro: l'utente (17/10) non le vuole attorno alle illustrazioni; restano solo nel catalogo di sviluppo ?brand, l'app usa le illustrazioni piane",
    "kit-luminoso/illustrazioni/attesa-caricamento": "doppione luminoso di attesa-caricamento (usata): stesso mestiere, la seconda sarebbe un doppione",
    "kit-luminoso/illustrazioni/piano-studi-bloccato": "doppione luminoso di piano-studi-bloccato (usata nella landing e negli Obiettivi): stesso mestiere",
    "kit-luminoso/illustrazioni/rischio-economico": "doppione luminoso di rischio-economico (usata nella landing) e rischio-economico-ali (onboarding): stesso mestiere",
    "kit-luminoso/illustrazioni/risultato-probabilita": "ha scritto nel disegno «82 %»: un numero inventato; in app il misuratore è il componente con il valore vero",
}


def voci_catalogo() -> list[dict]:
    """Legge catalogo.ts senza riscriverlo: lo compila con esbuild (quello di Vite) e lo esegue con node."""
    js = r"""
const { createRequire } = require('node:module');
const richiedi = createRequire(process.argv[1] + '/package.json');
const { transformSync } = richiedi('esbuild');
const fs = require('node:fs');
const codice = transformSync(fs.readFileSync(process.argv[1] + '/src/brand/catalogo.ts', 'utf8'), { loader: 'ts', format: 'cjs' }).code;
const m = { exports: {} };
new Function('module', 'exports', codice)(m, m.exports);
process.stdout.write(JSON.stringify(m.exports.CATALOGO));
"""
    r = subprocess.run(["node", "-e", js, str(APP)], capture_output=True, text=True)
    if r.returncode != 0:
        sys.exit("non riesco a leggere catalogo.ts: " + r.stderr[-400:])
    return json.loads(r.stdout)


# un file «usa illustrazioni» se nomina il componente, la funzione dei percorsi o un campo `illustrazione` (esclude parole comuni come 'vuoto')
ILLUSTRA = re.compile(r"Illustrazione|urlDisegno|Disegno|illustrazion", re.I)


def file_sorgenti() -> list[pathlib.Path]:
    esclusi = {SRC / "brand" / "catalogo.ts", SRC / "brand" / "BrandKit.tsx", SRC / "brand" / "risorse.ts", SRC / "brand" / "BrandKitStub.tsx"}
    out = []
    for p in SRC.rglob("*"):
        if p.suffix not in (".ts", ".tsx") or p in esclusi or "brand" in p.relative_to(SRC).parts:
            continue   # la cartella brand/ contiene i componenti e le librerie delle illustrazioni, non le schermate
        out.append(p)
    return out


def giustificata(chiave: str) -> str | None:
    for pat, motivo in NON_USATE_OK.items():
        if fnmatch.fnmatch(chiave, pat):
            return motivo
    return None


def main():
    mostra_dove = "--usate" in sys.argv
    voci = [v for v in voci_catalogo() if v["tipo"] == "grafica"]
    testi = {p: p.read_text(errors="ignore") for p in file_sorgenti()}
    non_giustificate, mancanti, usate, fuori = [], [], 0, 0
    righe = []
    for v in voci:
        kit, gruppo, nome = v["kit"], v["gruppo"], v["nome"]
        chiave = f"{kit}/{gruppo}/{nome}"
        if kit == "logo":
            continue
        base = DISEGNI / kit / gruppo / nome
        spedita = base.with_suffix(".svg").exists()
        scura = pathlib.Path(str(base) + ".scuro.svg").exists()
        if not spedita or not scura:
            mancanti.append(chiave + ("" if spedita else " (manca .svg)") + ("" if scura else " (manca .scuro.svg)"))
        pat = re.compile(r"""['"`]""" + re.escape(nome) + r"""['"`]""")
        dove = [str(p.relative_to(SRC)) for p, t in testi.items()
                if pat.search(t) and ILLUSTRA.search(t) and (kit == "kit-blu" or kit in t)]
        if dove:
            usate += 1
            righe.append(f"  usata    {chiave}" + (f"   <- {', '.join(dove[:3])}" + (" …" if len(dove) > 3 else "") if mostra_dove else ""))
            continue
        motivo = giustificata(chiave)
        if motivo:
            fuori += 1
            righe.append(f"  non usata (ok) {chiave}   // {motivo}")
        else:
            non_giustificate.append(chiave)
            righe.append(f"  NON USATA {chiave}")
    print("\n".join(righe))
    print(f"\n{len(voci) - 1 if any(v['kit'] == 'logo' for v in voci) else len(voci)} illustrazioni nel catalogo: {usate} usate, {fuori} non usate con motivo, {len(non_giustificate)} non usate senza motivo")
    if mancanti:
        print("\nFILE MANCANTI in essenziali/disegni:\n  " + "\n  ".join(mancanti))
    if non_giustificate:
        print("\nNon usate e non giustificate (usarle in una schermata o aggiungerle a NON_USATE_OK con il motivo):\n  " + "\n  ".join(non_giustificate))
    sys.exit(1 if (non_giustificate or mancanti) else 0)


if __name__ == "__main__":
    main()
