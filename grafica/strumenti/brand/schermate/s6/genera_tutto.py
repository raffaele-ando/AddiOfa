"""Rigenera le 30 schermate (immagini 30 e 31), le tavole e il rapporto s6.
    python3 genera_tutto.py"""
import subprocess, sys, pathlib
QUI = pathlib.Path(__file__).resolve().parent
for f in ("g30.py", "g31.py"):
    subprocess.run([sys.executable, str(QUI / f)], check=True, stdout=subprocess.DEVNULL)
for i in ("30", "31"):
    subprocess.run([sys.executable, str(QUI / "controlla.py"), i], check=True)
subprocess.run([sys.executable, str(QUI / "tavola_insieme.py")], check=True)
subprocess.run([sys.executable, str(QUI / "rapporto.py")], check=True)
