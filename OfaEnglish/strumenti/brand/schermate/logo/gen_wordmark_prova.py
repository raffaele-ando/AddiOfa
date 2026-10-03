import sys, pathlib, subprocess
QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI))
import marchio as M
from marchio import *
SC="/tmp/claude-0/-home-user-AddiOfa/553cbc19-7099-5f91-95ed-46eecd1a1a4a/scratchpad"
S = 90.7
for peso, rot in ((800,0),(700,0.03),(600,0.05),(500,0.07),(500,0.09)):
    t = Tela(365, 77, fondo="#FFFFFF", id="wordmark-prova")
    wordmark(t, 0, 68.5, S, peso=peso, rot=rot)
    t.salva(f"{SC}/wm_{peso}_{int(rot*100)}.svg")
