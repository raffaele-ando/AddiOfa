"""Home con il rischio OFA (82 %), immagine 03-home-rischio-singola, kit blu con avviso rosso.
Originale 738x1649 px; si traccia in pixel e si converte con p()."""
import sys, pathlib
QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI))
from ui import *

ORIG = QUI.parents[2] / "brand/concept/03-home-rischio-singola/001-schermata.png"
OUT = QUI.parents[2] / "brand/concept-svg/schermate/03-home-rischio-singola/001-home-rischio.svg"

t = Tela.da_originale(738, 1649)
p = t.p

t.barra_stato()
# logo testuale AddiOfa
w1 = t.testo("Addi", p(45), p(118), p(56), 600, INK, id="logo-addi")
t.testo("Ofa", p(45) + w1, p(118), p(56), 600, BLU_FORTE, id="logo-ofa")
# campanella
t.cerchio(p(659), p(103), p(34), fill="#EDF2FB", id="campanella-fondo")
t.icona("campana", p(659) - p(14), p(103) - p(15), p(28), "#243B6B", 1.8, id="campanella")

t.testo("Il tuo rischio OFA", p(47), p(221), p(42), 700, INK, id="titolo")
t.cerchio(p(414), p(205), p(13), fill="none", stroke="#6B7280", sw=1.1)
t.testo("i", p(414), p(212), p(18), 500, "#6B7280", "middle")
t.testo("Più studi, più il rischio si abbassa.", p(47), p(258), p(26), 400, GRIGIO, id="sottotitolo")

# misuratore
t.misuratore(p(369), p(632), p(276), 0.777, spessore=p(51), colore="#F0303B", chiaro="#FF7A7A", tacche=True)
t.testo("82%", p(369), p(592), p(104), 800, "#E6121F", "middle", id="percentuale")
t.testo("Rischio di fallimento", p(369), p(641), p(29), 600, "#E6121F", "middle")
t.testo("all'OFA di inglese", p(369), p(678), p(24), 400, GRIGIO, "middle")

# avviso
t.rett(p(45), p(722), p(647), p(161), p(20), fill="#FDEFEF", id="avviso-rischio")
t.cerchio(p(102), p(783), p(33), fill="#EF4444", id="avviso-icona")
t.rett(p(98), p(767), p(8), p(23), p(4), fill="#FFFFFF"); t.cerchio(p(102), p(801), p(4.5), fill="#FFFFFF")
t.testo("Il tuo rischio è alto.", p(173), p(778), p(27), 600, INK)
t.testo("Completa le lezioni consigliate", p(173), p(817), p(25), 400, GRIGIO)
t.testo("per ridurre il rischio.", p(173), p(853), p(25), 400, GRIGIO)
t.icona("chevron-destra", p(646), p(792), p(22), "#EF4444", 2.4)

# pulsante
t.rett(p(45), p(902), p(647), p(99), p(22), fill=t.sfumatura(["#3F88F8", "#2E78F2"]), id="pulsante-studia", filtro=t.ombra(4, 10, "#2563EB", 0.22))
t.cerchio(p(110), p(952), p(33), fill="#FFFFFF")
t.icona("play", p(110) - p(12), p(952) - p(14), p(28), "#2E78F2", 1)
t.testo("Inizia a studiare", p(168), p(962), p(29), 600, "#FFFFFF")
t.icona("freccia-destra", p(622), p(934), p(36), "#FFFFFF", 1.8)

# prossimo obiettivo
t.rett(p(41), p(1037), p(653), p(161), p(20), fill="#F4F7FC", id="prossimo-obiettivo")
t.rett(p(61), p(1065), p(99), p(100), p(24), fill="#FFFFFF", filtro=t.ombra(2, 8, "#0F172A", 0.08))
t.icona("libro", p(110) - p(26), p(1115) - p(26), p(52), "#2E78F2", 1.7)
t.testo("PROSSIMO OBIETTIVO", p(187), p(1082), p(19), 500, GRIGIO, spaziatura=p(0.3))
t.testo("Grammatica: Future tenses", p(187), p(1124), p(27), 500, INK)
t.barra(p(187), p(1152), p(326), 0.2, h=p(13), kit="blu")
t.testo("0/5 lezioni", p(638), p(1166), p(22), 400, GRIGIO, "end")
t.icona("chevron-destra", p(655), p(1083), p(20), "#8A94A6", 2)

# impatto
t.testo("Il tuo impatto", p(52), p(1280), p(33), 700, INK)
t.cerchio(p(285), p(1269), p(13), fill="none", stroke="#6B7280", sw=1.1)
t.testo("i", p(285), p(1276), p(18), 500, "#6B7280", "middle")
t.rett(p(42), p(1303), p(652), p(179), p(20), fill="#F4F7FC", id="impatto")
g = t.sfumatura(["#F87171", "#3B82F6"], p(124), 0, p(609), 0, userspace=True)
t.path(f"M{n(p(124))} {n(p(1336))}L{n(p(368))} {n(p(1364))}L{n(p(609))} {n(p(1385))}", stroke=g, sw=p(3), id="linea-impatto")
for x, y, c in ((124, 1336, "#F0303B"), (368, 1364, "#6C9BF2"), (609, 1385, "#2E78F2")):
    t.cerchio(p(x), p(y), p(11), fill=c)
t.linea(p(124), p(1346), p(124), p(1396), "#F8A5A5", p(3))
for x, v, d, c in ((125, "82%", "Oggi", "#E6121F"), (368, "62%", "Dopo 5 lezioni", "#5B6C92"), (609, "28%", "Dopo 15 lezioni", "#2E78F2")):
    t.testo(v, p(x), p(1423), p(24), 600, c, "middle")
    t.testo(d, p(x), p(1455), p(21), 400, GRIGIO, "middle")

# barra di navigazione
t.nav_inferiore([("casa", "Home"), ("grafico", "Simulazioni"), ("libro", "Lezioni")], 0, "blu", y=p(1505), h=t.h - p(1505))
t.salva(OUT)
print(OUT)
