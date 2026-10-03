"""Tavole di controllo: per ogni SVG del logo, originale (ritaglio più grande dell'elemento) | disegno | differenza."""
import pathlib, subprocess, sys, tempfile
QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI))
from rif import ritaglia, RADICE

USCITA = RADICE / "brand/concept-svg/logo"
TAVOLE = USCITA / "_tavole"


def controlla(nome: str, idx: int, box, k: float = 3.0):
    """box = (x0, y0, x1, y1) nell'immagine intera idx: lo stesso riquadro del viewBox dello SVG."""
    rif = pathlib.Path(tempfile.gettempdir()) / f"rif-logo-{nome}.png"
    ritaglia(idx, box, rif)
    TAVOLE.mkdir(parents=True, exist_ok=True)
    out = TAVOLE / f"{nome}.png"
    r = subprocess.run([sys.executable, str(QUI.parent / "controlla_schermata.py"), str(USCITA / f"{nome}.svg"), str(rif), str(out), "--k", str(k)],
                       capture_output=True, text=True)
    print(r.stdout.strip() or r.stderr.strip()[-300:])
    return out
