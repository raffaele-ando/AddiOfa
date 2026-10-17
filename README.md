# AddiOFA

Sito web gratuito per preparare il test d'inglese dell'OFA del Politecnico di Milano: tutte le domande, le 31 schede di teoria, simulazioni illimitate (30 domande, 15 minuti, soglia 25/30), ripasso intelligente degli errori, statistiche, frasi e prontuario. Nessun account e nessun server: tutto sta nel browser e i progressi nel dispositivo (con esporta/importa). Progetto studentesco indipendente, non affiliato al Politecnico di Milano.

## Per cominciare

```bash
cd app && npm ci && npm run dev      # sito su http://localhost:3000
```

Dalla radice: `npm run check` (link dei documenti, tipi, prove, build). Per pubblicare il sito: `app/DEPLOY.md`. La guida completa per chi lavora qui, con regole e mappa, è `CLAUDE.md`.

## Cartelle

| | |
|---|---|
| `app/` | Il sito (React, `src/`), i file pubblici e la configurazione di Vite |
| `contenuti/` | Domande, teoria e spiegazioni: la fonte da cui si genera il banco dell'app |
| `grafica/` | Logo, illustrazioni e schermate ridisegnate, con i programmi che le producono |
| `docs/` | Note di lavoro, design, dati sulle graduatorie, storico del vecchio piano di business, archivio |
| `tools/` | Script del repository |
| `atlas/` | Worker Cloudflare + D1 di ATLAS: iscrizioni con email PoliMi, Project ID, classifica NOI (da pubblicare con `atlas/DEPLOY.md`). Il vecchio Worker a pagamento è in `docs/archivio/pass-worker/` |

## Da togliere (decide il proprietario)

`app/firebase-applet-config.json`, `app/firebase-blueprint.json`, `app/firestore.rules` (residui di AI Studio: l'app non usa più Firebase) e `app/bun.lock` (il progetto usa npm). Le dipendenze `firebase`, `canvas-confetti`, `@types/canvas-confetti`, `motion` non sono più importate: si tolgono con `npm uninstall`.
