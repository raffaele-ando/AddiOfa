"""Rigenera tutto s2: SVG (immagini 5, 22, 25, 49), tavole di controllo, tavole d'insieme e rapporto. python3 genera_tutto.py"""
import pathlib, subprocess, sys
QUI = pathlib.Path(__file__).resolve().parent
for f in ("g05.py", "g22.py", "g25.py", "g49.py"):
    subprocess.run([sys.executable, str(QUI / f)], check=True, stdout=subprocess.DEVNULL)
subprocess.run([sys.executable, str(QUI / "controlla.py"), "05", "22", "25", "49"], check=True)
subprocess.run([sys.executable, str(QUI / "insieme.py")], check=True)
subprocess.run([sys.executable, str(QUI / "rapporto.py")], check=True)
