"""Rifà tutti gli SVG di s3 (immagini 06 e 19), poi `python3 controlla.py` per le tavole."""
import importlib, sys, pathlib
QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI))
from componenti import salva

MODULI = sys.argv[1:] or sorted(p.stem for p in QUI.glob("s[0-9][0-9]_*.py")) + sorted(p.stem for p in QUI.glob("q[0-9][0-9]_*.py"))
for m in MODULI:
    mod = importlib.import_module(m)
    t = mod.disegna()
    salva(t, mod.CARTELLA, mod.NOME)
