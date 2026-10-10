"""Rigenera tutto s4: 9 schermate dell'immagine 18, 6 dell'immagine 20, tavole e rapporto brand/concept-svg/_rapporti/s4.json.  python3 genera_tutto.py"""
import json, pathlib, subprocess, sys
QUI = pathlib.Path(__file__).resolve().parent
for f in sorted(QUI.glob("s[0-9][0-9]_*.py")):
    subprocess.run([sys.executable, str(f)], check=True, stdout=subprocess.DEVNULL, cwd=QUI)
subprocess.run([sys.executable, str(QUI / "gen_20.py")], check=True, stdout=subprocess.DEVNULL, cwd=QUI)
subprocess.run([sys.executable, str(QUI / "controlla.py")], check=True, cwd=QUI)
subprocess.run([sys.executable, str(QUI / "controlla_20.py")], check=True, cwd=QUI)
subprocess.run([sys.executable, str(QUI / "rapporto.py")], check=True, cwd=QUI)
