#!/usr/bin/env python3
"""Applica le patch di conversione (patch-NN.json + correzioni dei revisori) a contenuti/domande e contenuti/spiegazioni.
Uso: python3 contenuti/conversione/applica.py [--scrivi]   (senza --scrivi: solo controlli e riepilogo)"""
import json, glob, sys, re, pathlib
R = pathlib.Path(__file__).resolve().parents[2]
C = R / 'contenuti'
patch = {}
for f in sorted(glob.glob(str(C / 'conversione/patch-*.json'))):
    patch.update(json.load(open(f)))
corr = 0
for f in sorted(glob.glob(str(C / 'conversione/revisione-*.json'))) + sorted(glob.glob(str(C / 'conversione/verifica-*.json'))):
    for k, v in json.load(open(f)).items():
        if v.get('esito') == 'problema' and v.get('correzione'):
            patch[k] = {**patch[k], **v['correzione']}; corr += 1
# controllo incrociato con le risposte dei revisori (alla cieca)
dis = []
sost = set(json.load(open(C / 'conversione/cieca-sostituite.json'))) if (C / 'conversione/cieca-sostituite.json').exists() else set()
for f in sorted(glob.glob(str(C / 'conversione/risposte-*.json'))):
    for k, v in json.load(open(f)).items():
        if k in sost and 'sostituite' not in f: continue  # risposta alla cieca data alla versione precedente
        p = patch[k]
        if v['accettabili'] != [p['correctIndex']] or v.get('scelta') != p['correctIndex']:
            dis.append((k, v['accettabili'], v.get('scelta'), p['correctIndex'], v.get('nota', '')[:100]))
print('patch', len(patch), 'correzioni dei revisori applicate', corr, 'disaccordi alla cieca', len(dis))
for d in dis: print('  ', d)
# controlli di forma
bad = []
for k, p in patch.items():
    if len(p['options']) != 4 or len({o.lower() for o in p['options']}) != 4 or '_____' not in p['prompt'] or not 0 <= p['correctIndex'] <= 3 or not p['explanation'].strip() or re.search(r'(?i)traduzion|translat', p['explanation'] + p['prompt']):
        bad.append(k)
print('anomalie di forma', bad)
if '--scrivi' not in sys.argv: sys.exit(0)
# domande
for f in sorted(glob.glob(str(C / 'domande/q*.json'))):
    d = json.load(open(f)); mod = False
    for q in d:
        q.pop('extraOption', None)
        if q['id'] in patch:
            p = patch[q['id']]
            q.update(prompt=p['prompt'], options=p['options'], correctIndex=p['correctIndex'], explanation=p['explanation'], category='Grammatica', stato='riscritta')
        mod = True
    json.dump(d, open(f, 'w'), ensure_ascii=False, indent=2); open(f, 'a').write('\n')
# spiegazioni: ogni id compare una sola volta, nel file in cui c'era già
visti = set()
for f in sorted(glob.glob(str(C / 'spiegazioni/*.json'))):
    d = json.load(open(f)); mod = False
    for k in list(d):
        kk = 'q' + str(int(k[1:]))
        if kk in patch: d[k] = patch[kk]['explanation']; visti.add(kk); mod = True
    if mod: json.dump(d, open(f, 'w'), ensure_ascii=False, indent=2); open(f, 'a').write('\n')
print('spiegazioni aggiornate nei file:', len(visti), '; le altre restano nel campo explanation delle domande')
