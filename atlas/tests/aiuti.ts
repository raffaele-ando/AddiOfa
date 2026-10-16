// Avvia un vero Worker con `wrangler dev --local` (D1 locale in una cartella temporanea) per le prove.
// Nessun accesso a Cloudflare: tutto gira in locale con miniflare.

import { spawn, spawnSync, type ChildProcess } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const RADICE = join(dirname(fileURLToPath(import.meta.url)), '..');
const WRANGLER = join(RADICE, 'node_modules', '.bin', 'wrangler');

export interface Istanza {
  base: string;
  ferma(): Promise<void>;
  /** fetch con un IP simulato (CF-Connecting-IP), così le prove non si disturbano tra loro */
  chiama(percorso: string, opzioni?: RequestInit & { ip?: string; token?: string }): Promise<Response>;
}

let prossimaPorta = 8800 + Math.floor(Math.random() * 400);

export async function avvia(vars: Record<string, string>): Promise<Istanza> {
  const porta = prossimaPorta++;
  const dati = mkdtempSync(join(tmpdir(), 'atlas-prova-'));
  const migra = spawnSync(WRANGLER, ['d1', 'migrations', 'apply', 'atlas', '--local', '--persist-to', dati],
    { cwd: RADICE, encoding: 'utf8' });
  if (migra.status !== 0) throw new Error(`migrazioni fallite:\n${migra.stdout}\n${migra.stderr}`);

  const args = ['dev', '--local', '--port', String(porta), '--persist-to', dati, '--ip', '127.0.0.1'];
  for (const [k, v] of Object.entries(vars)) args.push('--var', `${k}:${v}`);
  const proc: ChildProcess = spawn(WRANGLER, args, { cwd: RADICE, stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, CI: '1' } });
  let log = '';
  proc.stdout?.on('data', d => { log += d; });
  proc.stderr?.on('data', d => { log += d; });

  const base = `http://127.0.0.1:${porta}`;
  const fine = Date.now() + 60_000;
  for (;;) {
    try {
      if ((await fetch(`${base}/v1/health`)).ok) break;
    } catch { /* non ancora pronto */ }
    if (Date.now() > fine || proc.exitCode !== null) {
      proc.kill();
      throw new Error(`wrangler dev non parte:\n${log}`);
    }
    await new Promise(r => setTimeout(r, 300));
  }

  return {
    base,
    async ferma() {
      if (proc.exitCode === null) {
        const finito = new Promise(r => proc.once('exit', r));
        proc.kill('SIGTERM');
        await Promise.race([finito, new Promise(r => setTimeout(r, 3000))]);
        if (proc.exitCode === null) proc.kill('SIGKILL');
      }
    },
    chiama(percorso, { ip, token, headers, ...resto } = {}) {
      const h = new Headers(headers);
      if (ip) h.set('CF-Connecting-IP', ip);
      if (token) h.set('Authorization', `Bearer ${token}`);
      return fetch(`${base}${percorso}`, { ...resto, headers: h });
    },
  };
}

export const iscrizione = (extra: Record<string, unknown> = {}) => ({
  appId: 'addiofa',
  nome: 'Mario Rossi',
  email: 'mario.rossi@mail.polimi.it',
  corso: 'Ingegneria Gestionale',
  sede: 'Leonardo',
  provenienza: 'amici',
  consensi: { noi: true, atlas: false, comunicazioni: true },
  consentVersion: 'iscrizione-2026-10-16',
  ...extra,
});

export const postJson = (corpo: unknown) => ({
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(corpo),
});
