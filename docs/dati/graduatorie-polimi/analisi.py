"""Analisi aggregata delle graduatorie Polimi (PoliNetworkOrg/rankings-data).
Uso: python3 analisi.py <cartella data/output/rankings>
Produce solo tabelle aggregate in ./tabelle (nessun dato individuale)."""
import json, glob, sys, os, csv, collections as C, statistics as S

SRC = sys.argv[1]
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "tabelle")
D = C.defaultdict(list)
for f in glob.glob(os.path.join(SRC, "*.json")):
    d = json.load(open(f))
    if d["year"] >= 2021:
        D[d["year"]].append(d)
YEARS = sorted(D)

def write(name, header, rows):
    with open(os.path.join(OUT, name), "w", newline="") as fh:
        w = csv.writer(fh); w.writerow(header); w.writerows(rows)

def mean(v): return round(S.mean(v), 1) if v else ""

def first_course(r):
    return next((c["title"] for c in r["courses"] if c.get("canEnroll")), "?")

trend, fasi, ofa_tot, ofa_cmp, sez, doppi = [], [], [], [], [], []
ofa_corso = C.defaultdict(dict)
for y in YEARS:
    ranks = sorted(D[y], key=lambda d: (d["phase"]["primary"] or 0, d["phase"]["secondary"] or 0))
    cand, first, righe = set(), {}, 0
    rk, sc, co = C.defaultdict(set), C.defaultdict(set), C.defaultdict(set)
    for d in ranks:
        for r in d["rows"]:
            cand.add(r["id"])
            if not r.get("canEnroll"): continue
            righe += 1; rk[r["id"]].add(d["id"]); sc[r["id"]].add(d["school"])
            for c in r["courses"]:
                if c.get("canEnroll"): co[r["id"]].add(c["title"])
            first.setdefault(r["id"], (d, r))
    s = C.Counter(d["school"] for d, _ in first.values())
    ex = sum(d["phase"].get("isExtraEu", False) for d, _ in first.values())
    trend.append([y, len(cand), len(first), round(100 * len(first) / len(cand), 1),
                  s["Ingegneria"], s["Architettura"], s["Design"], s["Urbanistica"], ex])
    doppi.append([y, righe, len(first), sum(len(v) > 1 for v in rk.values()),
                  sum(len(v) > 1 for v in co.values()), sum(len(v) > 1 for v in sc.values())])
    ph = C.Counter(d["phase"]["primary"] or 0 for d, _ in first.values())
    fasi.append([y] + [ph.get(i, 0) for i in range(5)])
    # sezioni test Ingegneria
    sv = C.defaultdict(list)
    for d, r in first.values():
        if d["school"] == "Ingegneria":
            for k, v in (r.get("sectionsResults") or {}).items(): sv[k].append(v)
    sez.append([y] + [mean(sv.get(k, [])) for k in ("Matematica", "Fisica", "Inglese", "Comprensione Verbale")])
    # OFA
    withd = [(d, r) for d, r in first.values() if r.get("ofa")]
    eng = sum(bool(r["ofa"].get("ENG")) for _, r in withd)
    tst = sum(bool(r["ofa"].get("TEST")) for _, r in withd)
    anyo = sum(any(r["ofa"].values()) for _, r in withd)
    ofa_tot.append([y, len(first), len(withd), anyo, round(100 * anyo / len(withd), 1) if withd else "", eng, tst])
    g = C.defaultdict(lambda: [0, 0])
    for _, r in withd:
        if "ENG" in r["ofa"]:
            c = first_course(r); g[c][0] += 1; g[c][1] += bool(r["ofa"]["ENG"])
    for c, (n, o) in g.items():
        if n >= 40: ofa_corso[c][y] = f"{round(100 * o / n, 1)} ({o}/{n})"
    for lab, fl in (("con OFA ENG", True), ("senza OFA ENG", False)):
        G = [(d, r) for d, r in withd if "ENG" in r["ofa"] and bool(r["ofa"]["ENG"]) == fl]
        if not G: continue
        sv = C.defaultdict(list)
        for d, r in G:
            if d["school"] == "Ingegneria":
                for k, v in (r.get("sectionsResults") or {}).items(): sv[k].append(v)
        age = [y - int(r["birthDate"][-4:]) for _, r in G if r.get("birthDate") and len(r["birthDate"]) == 10]
        ofa_cmp.append([y, lab, len(G), mean([r["result"] for _, r in G if r.get("result") is not None]),
                        mean([r["englishResult"] for _, r in G if r.get("englishResult") is not None]),
                        *[mean(sv.get(k, [])) for k in ("Matematica", "Fisica", "Inglese", "Comprensione Verbale")],
                        round(100 * sum(a >= 20 for a in age) / len(age), 1) if age else "",
                        round(100 * sum(d["phase"].get("isExtraEu", False) for d, _ in G) / len(G), 1),
                        round(100 * sum(bool(r["ofa"].get("TEST")) for _, r in G) / len(G), 1)])

# dettaglio ultimo anno
Y = YEARS[-1]; first = {}
for d in D[Y]:
    for r in d["rows"]:
        if r.get("canEnroll"): first.setdefault(r["id"], (d, r))
crs, loc, age = C.Counter(), C.Counter(), C.Counter()
for d, r in first.values():
    c = next((c for c in r["courses"] if c.get("canEnroll")), None)
    if c: crs[c["title"]] += 1; loc[c.get("location")] += 1
    b = r.get("birthDate")
    if b and len(b) == 10: age[Y - int(b[-4:])] += 1
soglie = C.defaultdict(list)
for d in D[Y]:
    if d["phase"].get("isExtraEu"): continue
    for r in d["rows"]:
        for c in r["courses"]:
            if c.get("canEnroll") and r.get("result") is not None: soglie[(d["school"], c["title"])].append(r["result"])

write("01_trend_ammessi.csv", ["anno", "candidati_unici", "ammessi_unici", "perc_ammessi", "ingegneria", "architettura", "design", "urbanistica", "extra_ue"], trend)
write("02_doppioni.csv", ["anno", "righe_ammessi", "ammessi_unici", "in_piu_graduatorie", "in_piu_corsi", "in_piu_scuole"], doppi)
write("03_fase_prima_ammissione.csv", ["anno", "fase_non_indicata", "fase1", "fase2", "fase3", "fase4"], fasi)
write("04_sezioni_test_ingegneria.csv", ["anno", "matematica", "fisica", "inglese", "comprensione_verbale"], sez)
write("05_ofa_totale.csv", ["anno", "ammessi", "con_dato_ofa", "con_almeno_un_ofa", "perc_ofa", "ofa_eng", "ofa_test"], ofa_tot)
write("06_ofa_eng_confronto.csv", ["anno", "gruppo", "n", "punteggio_totale", "english_result", "matematica_ing", "fisica_ing", "inglese_ing", "compr_verbale_ing", "perc_20anni_o_piu", "perc_extra_ue", "perc_anche_ofa_test"], ofa_cmp)
write("07_ofa_eng_per_corso.csv", ["corso"] + YEARS, [[c] + [ofa_corso[c].get(y, "") for y in YEARS] for c in sorted(ofa_corso)])
write(f"08_corsi_{Y}.csv", ["corso", "ammessi"], crs.most_common())
write(f"09_sedi_{Y}.csv", ["sede", "ammessi"], loc.most_common())
write(f"10_eta_{Y}.csv", ["eta", "ammessi"], sorted(age.items()))
write(f"11_soglie_{Y}.csv", ["scuola", "corso", "punteggio_minimo_ammesso", "ammessi"],
      sorted([[s, c, round(min(v), 1), len(v)] for (s, c), v in soglie.items()], key=lambda x: -x[2]))
print("ok", OUT)
