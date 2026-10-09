"""Scrive brand/concept-svg/_rapporti/s3.json dagli SVG presenti (rilanciabile in qualsiasi momento: salvataggio incrementale)."""
import importlib, json, pathlib, sys
QUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(QUI))
from componenti import OUT, RADICE

DOC = {}   # nome modulo -> (ids, nota)
NOTE = {
 "s01_sfide_home": (["06.001"], "Sfide home. Avatar-foto -> cerchio neutro; frecce decorative storte intorno al trofeo -> raggi del trofeo già disegnato (riuso kit-rosso/successo-superamento); riga 3 tagliata dalla tab-bar come nell'originale. Testi leggibili. NB: 22.001 è un'altra generazione (sfida col bersaglio), non è questa."),
 "s02_tutte_le_sfide": (["06.002"], "Tutte le sfide (tab Attive/Completate/Tutte). Icona tonda in alto a destra illeggibile -> calendario. Testo ricostruito: nessuno (testi riletti da 22.001, stesse sfide)."),
 "s03_dettaglio_sfida": (["06.003"], "Dettaglio sfida: cielo, montagna e bandierina disegnati; 7 giorni con 4 spunte; Ricompensa, Consigli, pulsante. Testo ricostruito: nessuno."),
 "s04_classifica": (["06.004"], "Classifica settimanale: podio + elenco 4-10. Nomi di esempio come nell'originale; foto -> avatar neutri."),
 "s05_amici": (["06.005"], "Amici: l'originale è tagliato a destra, completato alla larghezza intera. Avatar neutri."),
 "s06_sfide_completate": (["06.006"], "Sfide completate: 5 righe a passo uguale (irregolare nell'originale). Date e punti come nell'originale."),
 "s07_calendario": (["06.007"], "Calendario settembre 2026. CORRETTO l'errore dell'AI: il 1/9/2026 è un martedì (nell'originale sta sotto «L»); streak coerente (5 giorni, oggi 12). Completato a destra."),
 "s08_profilo_panoramica": (["06.008"], "Profilo panoramica: foto -> avatar neutro; icona Project ID disegnata. Parte bassa (altri 2 obiettivi, Badge) ricostruita da 22.002 perché l'originale è tagliato: TESTO RICOSTRUITO per quella parte (nomi dei badge letti da 22.002)."),
 "s09_progressi": (["06.009"], "I miei progressi: grafico a linea 82% -> 28% (etichetta '26' illeggibile dell'originale -> 82%, punto finale al 28% coerente). Tab-bar aggiunta; testo ricostruito: nessuno."),
 "s10_obiettivi": (["06.010"], "I miei obiettivi: alone fantasma e '20%' sfocato dietro la barra rimossi. Tab-bar aggiunta."),
 "s11_badge": (["06.011"], "I miei badge: griglia 3x3 (6 sbloccati, 3 bloccati), riquadri uguali. Tab-bar aggiunta."),
 "s12_attivita": (["06.012"], "Attività: 6 voci; icone Simulazione e Sfida completata (illeggibili/storte) sostituite. Tab-bar aggiunta."),
 "s13_impostazioni": (["06.013"], "Impostazioni: tutte le icone dell'AI (storte) sostituite con icone vere; testi tenuti."),
 "s14_modifica_profilo": (["06.014"], "Modifica profilo: avatar neutro, refuso 'voita' -> 'volta', fotocamera vera, campi alla larghezza intera (originale tagliato a destra)."),
}
voci = []
for p in sorted(QUI.glob("[sq][0-9][0-9]_*.py")):
    mod = importlib.import_module(p.stem)
    f = OUT / mod.CARTELLA / mod.NOME
    if not f.exists():
        continue
    ids, nota = getattr(mod, "IDS", None) or NOTE.get(p.stem, ([], "")), None
    ids, nota = NOTE[p.stem] if p.stem in NOTE else (mod.IDS, mod.NOTA)
    voci.append({"elementi": ids, "stato": "svg", "svg": str(f.relative_to(RADICE)), "nota": nota})
# stesse schermate in altre immagini (altre generazioni): riuso dello stesso SVG
for k in range(1, 10):
    f = [v for v in voci if v["elementi"] == [f"19.{k:03d}"]]
    if f:
        voci.append({"elementi": [f"18.{k:03d}"], "stato": "riuso", "svg": f[0]["svg"],
                     "nota": f"Stessa schermata di 19.{k:03d} (altra generazione, stesso contenuto; l'originale 18 ha la tab-bar a 3 voci, qui quella a 5 di 19). Da coordinatore: se un altro agente ha 18, tenere una sola uscita."})
voci.append({"elementi": ["22.002"], "stato": "riuso", "svg": [v for v in voci if v["elementi"] == ["06.008"]][0]["svg"],
             "nota": "Stessa schermata del profilo di 06.008 (rigenerata più grande: da questa è stata letta la parte bassa, Badge). Differenze minori di testo ('I tuoi progressi' / 'Obiettivi'). 22.001 NON è 06.001: è un'altra variante (sfida con bersaglio) e non è coperta da s3."})
out = RADICE / "brand/concept-svg/_rapporti/s3.json"
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(json.dumps(voci, ensure_ascii=False, indent=1))
print(out, len(voci), "voci")
