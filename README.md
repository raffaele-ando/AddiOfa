# AddiOFA

App web per preparare il test d'inglese dell'OFA del Politecnico di Milano: ripasso intelligente, simulazioni nei formati dei test reali, diagnostico gratuito, Pass una tantum. Progetto studentesco indipendente, non affiliato al Politecnico di Milano.

## Per cominciare

```bash
cd app && npm ci && npm run dev      # app su http://localhost:3000
```

Dalla radice: `npm run check` (link dei documenti, tipi, build). La guida completa per chi lavora qui, con regole e mappa, è `CLAUDE.md`.

## Cartelle

| | |
|---|---|
| `app/` | L'app React (`src/`), i file pubblici e la configurazione di Vite |
| `pass/` | Il server Cloudflare per accessi, domande, pagamenti, lista d'attesa e inviti |
| `atlas/` | Account Project ID e classifica NOI (rimandati) |
| `contenuti/` | Domande, teoria e spiegazioni: la fonte da cui si genera il banco dell'app |
| `grafica/` | Logo, illustrazioni e schermate ridisegnate, con i programmi che le producono |
| `docs/` | Piano di business e conti, strategia, dati sulle graduatorie, archivio |
| `tools/` | Script del repository |

## Da togliere (decide il proprietario)

`app/firebase-applet-config.json` (residuo di AI Studio con la chiave di un altro progetto Firebase) e `app/bun.lock` (il progetto usa npm).

## Stato

Vedi `docs/business/AddiOFA_piano_definitivo.md` per decisioni, conti e roadmap, e `app/DEMO.md` per cosa è reale e cosa è dimostrativo nella versione online.
