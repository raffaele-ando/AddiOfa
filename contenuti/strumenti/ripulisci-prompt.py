#!/usr/bin/env python3
"""Ripulisce i testi delle domande: resta solo la frase con lo spazio `_____` (via «Complete the sentence:», «Complete:», apici esterni, suggerimenti tra parentesi).
Le poche frasi che avevano un suggerimento necessario (possessivi, vicino/lontano) portano il contesto dentro la frase.
Uso: python3 contenuti/strumenti/ripulisci-prompt.py   (idempotente)"""
import json, glob, re, pathlib
RAD = pathlib.Path(__file__).resolve().parents[2]
RISCRITTE = {
 'q100': "This car belongs to my friend. It is my _____ car.",
 'q102': "The toys belong to my dogs. Those are my _____ toys.",
 'q104': "The house belongs to my parents. We went to my _____ house yesterday.",
 'q148': "The jacket belongs to Tom. That is _____ jacket.",
 'q150': "The band wrote the song. I love _____ new song.",
 'q152': "The desk belongs to the boss. This is _____ desk.",
 'q154': "The baker has a shop. I went to the _____.",
 'q156': "Paul has a house. We are meeting at _____.",
 'q158': "The room is for teachers. The _____ room is down the hall.",
 'q219': "That house belongs to us. It is _____.",
 'q220': "Does this book belong to him? Yes, it is _____.",
 'q223': "Do those keys belong to them? Yes, they are _____.",
 'q253': "Look at the man next to me: _____ is my friend, Paul.",
 'q260': "I am holding it in my hands: _____ is a very interesting book.",
 'q261': "Can you pass me _____ pen over there?",
}
def pulisci(p: str) -> str:
    p = re.sub(r"\s*\([^()]*\)\s*$", "", p)                      # suggerimento finale tra parentesi
    m = re.match(r"^(?:Complete the sentence|Complete|Choose the correct question)\s*:\s*'(.*)'\s*$", p, re.S)
    if m: p = m.group(1)
    return p.strip()
mod = 0
for f in sorted(glob.glob(str(RAD / 'contenuti/domande/q*.json'))):
    d = json.load(open(f)); cambiato = False
    for q in d:
        nuovo = RISCRITTE.get(q['id']) or pulisci(q['prompt'])
        if nuovo != q['prompt']: q['prompt'] = nuovo; cambiato = True; mod += 1
    if cambiato:
        json.dump(d, open(f, 'w'), ensure_ascii=False, indent=2); open(f, 'a').write('\n')
print('prompt cambiati:', mod)
