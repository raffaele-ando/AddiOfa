# Note DARK: tema scuro (e chiaro) uniforme su tutte le schermate

## Palette finale (`app/src/index.css`, `@theme static` + `.dark`)
| Token | Chiaro | Scuro |
|---|---|---|
| fondo / superficie / superficie-2 | #F7F9FD / #FFFFFF / #F2F5FB | #0A101F / #111A2E / #17223A |
| testo / testo-tenue | #0E1B3F / #566279 | #EAF0FC / #97A5C4 |
| linea / tacca | #E6EBF5 / #D3DAE6 | #1F2B45 / #2A3858 |
| azione / azione-scuro (testo su tinta) / azione-su | #2563EB / #1D4ED8 / #FFFFFF | #5A92FF / #7FA8FF / #0A101F |
| azione-da (inizio gradiente CTA) | #2C6BEA | #5B93FF |
| basso, medio, alto: testo | #A31217 / #A65705 / #0B7A4A | #F59A91 / #EBC272 / #7ED6A9 |
| basso, medio, alto: pieno (fondo di pulsanti e badge, testo `azione-su`) | #D12A33 / #B05A04 / #0A8350 | #F2766B / #E8B04A / #4CC38A |
| tinte | invariate | basso #26283D, medio #262C3B, alto #1B2D40, azione #16264A |
Cambiati rispetto a HOMENAV per soddisfare 4,5:1 (3:1 sul testo grande): `testo-tenue` chiaro, `azione-da` chiaro, `medio-testo` chiaro, `medio-numero` chiaro (#D4780A), `azione` scuro. Nuovi: `*-pieno`, `color-scheme: dark` su `.dark` (controlli nativi scuri).

## Regole applicate
- Pagina = `bg-superficie` (come Home e Lezioni), carta = `bg-superficie-2` con `border-linea` solo se interattiva o in lista; fondo `bg-fondo` solo per la cornice (Layout, ErrorBoundary). Impostazioni portata allo stesso schema (pagina superficie, gruppi superficie-2): era l'unica con tono diverso.
- Opzioni di risposta: superficie-2 + linea; selezionata = `azione-tinta` + `border-azione`; giusta/sbagliata = tinta semantica + bordo `/40` + icona (spunta/croce con testo per screen reader) + lettera piena. Barra di feedback di LearnMode in tinta del semantico, bordo `/30`.
- Banner e avvisi: tinta tenue del semantico, bordo `/30`, titolo nel colore `-testo`. Niente bordi `border-2/4`, niente ombre in scuro (`dark:shadow-none`).
- Dialoghi e fogli: superficie-2 + linea, sfondo `bg-black/60`. Toast superficie-2.
- Grafici Recharts (StatsMode): costanti `var(--color-*)` (griglia linea, assi testo-tenue, barre azione/alto, "da imparare" tacca, tooltip superficie con linea sottile, cursore tenue).
- `IconaChip`: cerchio pastel in chiaro, tinta del token in scuro (`CERCHIO_SCURO`). `Misuratore`/`Indicatore`: archi e numeri dai token delle fasce.
- Pulsanti pieni: `bg-azione text-azione-su`; semantici pieni `bg-X-pieno text-azione-su`. I tre pulsanti di sicurezza di LearnMode (Indovino/Incerto/Sicuro) sono ora tonali.
- Demo banner: navy in chiaro, superficie-2 in scuro.

## Mappatura (script `applica.py`, poi rilettura a mano)
`bg-white dark:bg-[#1E293B]`→`bg-superficie` · `bg-white|gray-50 dark:bg-[#0F172A]`→`bg-superficie-2` · `bg-[#F6F8FC] dark:...`→`bg-fondo` · `bg-gray-100`→superficie-2 · `bg-gray-200/300`→`bg-tacca` · `text-[#0F172A]|gray-700..900`→`text-testo` · `text-gray-300..600|[#6B7280]|[#94A3B8]`→`text-testo-tenue` · `text-[#2563EB]`→`text-azione`, `#1D4ED8`→`text-azione-scuro` · `border-gray-100..300|[#E5E7EB]|[#E2E8F0]|[#334155]`→`border-linea` · rossi/verdi/ambra letterali→`basso/alto/medio` (-testo, -tinta, /alfa) · `hover:bg-gray-50`→`hover:bg-linea` · `dark:*` della vecchia palette eliminati (li gestisce il token). Bordi colorati su tinte portati a `/30`.
Fatti a mano: gradienti (Hero, CtaFinale, Telefono, ProjectProfile), viola (Teoria, CheatSheet, Stats) → azione, medaglie, DemoBanner/Landing banner, grafici, `COLORI_STATO`.

## Verifica
- `tools/controlla-contrasto.py` (Playwright): 390x858, chiaro e scuro, percorso completo della demo (landing, diagnostico: intro, pronto, quiz, calcolo, risultato; home, foglio stima, Lezioni, Impostazioni, legale, simulazione: scelta, domanda, dialogo di conferma e di consegna, esito, correzioni; paywall, Pass sbloccato, Progressi, Teoria, scheda, Prontuario, Esercizi: domanda, risposta giusta, sbagliata). Le anteprime di `app/tests/anteprime` (landing, onboarding, paywall x3, waitlist, inviti, grazie, studio exam/learn/practice/stats/cheat, teoria, legale, home x3, impostazioni) controllate con lo stesso motore.
- Giro iniziale: 130 violazioni (chiaro) + 102 (scuro). Dopo le correzioni: 0 a 390, chiaro e scuro, console 0 errori.
- Falso positivo documentato e ora escluso dallo strumento: lo span di misura di Recharts (`#recharts_measurement_span`, fuori pagina, 1:1).
- Esclusi per scelta: controlli `disabled`, elementi con opacità < 0,5 (opzioni "spente" dopo la risposta), icone/SVG.
- `npx tsc --noEmit`, `npm test` 99/99, `npm run build:demo` passano.

## Non provato / residui
- Il contrasto di icone e bordi (3:1 non testuale) non è misurato; le linee `linea` sono volutamente sottili.
- Non guardata a occhio ogni singola schermata a 1280 px; DebugMode, ProjectProfile/Consent, Leaderboard, ErrorBoundary, PaymentThanks controllati solo nel codice (tranne PaymentThanks nelle anteprime) perché non raggiungibili in demo.
- `brand/tokens.ts` (kit dei componenti del catalogo `?brand`) ha ancora i colori letterali: non usato dall'app, solo dal catalogo.
- Landing a 1280 e le schermate in Layout desktop con cornice 800 px non rifinite.
