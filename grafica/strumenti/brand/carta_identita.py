#!/usr/bin/env python3
"""Ridisegna la tessera «verifica-utente» del kit luminoso (chiara e scura): tutto dentro la carta.
Foto circolare a sinistra con testa e busto tagliati dal cerchio, tre righe di testo con margini uguali, bordo sottile, riflesso e ombra morbida.
Niente <text>. Uso: python3 grafica/strumenti/brand/carta_identita.py  (scrive in grafica/brand/disegni e in app/src/brand/essenziali/disegni)"""
import pathlib
RAD = pathlib.Path(__file__).resolve().parents[3]

# viewBox 176 x 112 (margine per l'ombra); carta 20..156 x 16..92, angoli 12, leggermente inclinata
def svg(scuro: bool) -> str:
    if scuro:
        c = dict(c1='#2A3E6E', c2='#1B2B52', bordo='#4B65A3', riflesso='#8FA8E0', ro=.28, foto='#12203F', testa1='#7FA8FF', testa2='#4E86F5', busto1='#4E86F5', busto2='#2C63D8', riga='#5877B8', ombra='#000000', oa='.35')
    else:
        c = dict(c1='#F6F9FF', c2='#DCE7FD', bordo='#BFD0F7', riflesso='#FFFFFF', ro=.9, foto='#FFFFFF', testa1='#7AA8FF', testa2='#3F7FF7', busto1='#3B7BFB', busto2='#1A5FF2', riga='#B3C7F8', ombra='#1D4ED8', oa='.16')
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="176" height="112" viewBox="0 0 176 112"><defs>
<linearGradient id="carta-luce" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{c['c1']}"/><stop offset="1" stop-color="{c['c2']}"/></linearGradient>
<linearGradient id="testa-luce" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{c['testa1']}"/><stop offset="1" stop-color="{c['testa2']}"/></linearGradient>
<linearGradient id="busto-luce" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{c['busto1']}"/><stop offset="1" stop-color="{c['busto2']}"/></linearGradient>
<clipPath id="foto-taglio"><circle cx="54" cy="54" r="25"/></clipPath>
<filter id="sfuma-ombra" x="-20%" y="-20%" width="140%" height="160%"><feGaussianBlur stdDeviation="3"/></filter>
</defs>
<g id="tessera" transform="rotate(-2 88 56)">
<rect id="tessera-ombra" x="22" y="24" width="136" height="76" rx="12" fill="{c['ombra']}" opacity="{c['oa']}" filter="url(#sfuma-ombra)"/>
<rect id="tessera-carta" x="20" y="16" width="136" height="76" rx="12" fill="url(#carta-luce)" stroke="{c['bordo']}" stroke-width="1"/>
<path id="tessera-riflesso" d="M30 19.5H146" stroke="{c['riflesso']}" stroke-opacity="{c['ro']}" stroke-width="1.6" stroke-linecap="round"/>
<circle id="foto" cx="54" cy="54" r="25" fill="{c['foto']}"/>
<g id="profilo" clip-path="url(#foto-taglio)">
<circle id="testa" cx="54" cy="46" r="9.5" fill="url(#testa-luce)"/>
<path id="busto" d="M34 82c0-13 9-21 20-21s20 8 20 21Z" fill="url(#busto-luce)"/>
</g>
<rect id="riga-1" x="92" y="36" width="52" height="8" rx="4" fill="{c['riga']}"/>
<rect id="riga-2" x="92" y="52" width="40" height="8" rx="4" fill="{c['riga']}"/>
<rect id="riga-3" x="92" y="68" width="46" height="8" rx="4" fill="{c['riga']}"/>
</g></svg>
'''

for base in (RAD / 'grafica/brand/disegni/kit-luminoso/illustrazioni', RAD / 'app/src/brand/essenziali/disegni/kit-luminoso/illustrazioni'):
    base.mkdir(parents=True, exist_ok=True)
    (base / 'verifica-utente.svg').write_text(svg(False))
    (base / 'verifica-utente.scuro.svg').write_text(svg(True))
print('ok')
