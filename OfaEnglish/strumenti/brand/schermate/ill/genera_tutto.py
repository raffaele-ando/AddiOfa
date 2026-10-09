"""Rilancia tutti i generatori dell'agente `ill` (SVG + tavole) e riscrive rapporto e COPERTURA.md."""
import subprocess, sys, pathlib
QUI = pathlib.Path(__file__).resolve().parent
for g in ["gen_calendario_lucchetto", "gen_cappello_orologio", "gen_email_sigillo", "gen_composizione_tre", "gen_forme", "genera_rapporto"]:
    subprocess.run([sys.executable, str(QUI / f"{g}.py")], check=True)
