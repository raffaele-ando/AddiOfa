// Cloudflare Pages Functions: l'API di ATLAS (atlas/src) risponde sullo stesso indirizzo del sito, sotto /v1/*.
// Così sito e server sono un solo progetto Pages: niente secondo Worker, niente CORS tra domini, niente indirizzo da copiare.
// Il database D1 e le variabili sono dichiarati in wrangler.jsonc alla radice; il segreto ADMIN_TOKEN si imposta nel pannello di Cloudflare.
import atlas, { type Env } from '../../atlas/src/index';

export const onRequest = (ctx: { request: Request; env: Env }): Promise<Response> => atlas.fetch(ctx.request, ctx.env);
