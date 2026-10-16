// Dati locali delle sfide (restano su questo dispositivo, dentro appState.extra, e entrano nell'esportazione dei progressi).
import { useCallback, useMemo } from 'react';
import { useExtraDati } from '../contesto';
import { poolMeta } from '../../../lib/spacedRepetition';
import { improntaBanco, ordinaBanco } from '../../../lib/sfide/seme';
import { aggiungiVoce, type VoceSfida } from '../../../lib/sfide/risultati';
import { nuovoIdGiocatore } from '../../../lib/sfide/seme';
import { pulisciNome } from '../../../lib/sfide/codice';

const VUOTO: VoceSfida[] = [];

/** Lo storico delle partite: lettura, aggiunta e modifica. */
export function useStorico(): { voci: VoceSfida[]; aggiungi: (v: VoceSfida) => void; modifica: (fn: (v: VoceSfida[]) => VoceSfida[]) => void } {
  const [voci, scrivi] = useExtraDati<VoceSfida[]>('sfide-storico', VUOTO);
  const aggiungi = useCallback((v: VoceSfida) => scrivi(prec => aggiungiVoce(Array.isArray(prec) ? prec : [], v)), [scrivi]);
  const modifica = useCallback((fn: (v: VoceSfida[]) => VoceSfida[]) => scrivi(prec => fn(Array.isArray(prec) ? prec : [])), [scrivi]);
  return { voci: Array.isArray(voci) ? voci : VUOTO, aggiungi, modifica };
}

export interface ProfiloSfide { id?: string; nome?: string }

/** Il nome scelto per presentarsi agli amici e un identificativo casuale (non è un account: serve solo a riconoscere
 *  lo stesso amico in duelli diversi). */
export function useProfiloSfide(): { profilo: ProfiloSfide; imposta: (nome: string) => string } {
  const [profilo, scrivi] = useExtraDati<ProfiloSfide>('sfide-profilo', {});
  const imposta = useCallback((nome: string) => {
    const pulito = pulisciNome(nome);
    const id = profilo.id ?? nuovoIdGiocatore();
    scrivi(prec => ({ ...prec, id: prec.id ?? id, nome: pulito }));
    return profilo.id ?? id;
  }, [profilo.id, scrivi]);
  return { profilo: profilo ?? {}, imposta };
}

/** Il banco delle sfide: tutte le domande, uguali per tutti (l'impronta nel link evita confronti tra versioni diverse). */
export function useBancoSfide() {
  return useMemo(() => {
    const banco = ordinaBanco(poolMeta());
    return { banco, impronta: improntaBanco(banco) };
  }, []);
}

/** Indirizzo dell'app senza query né hash: la base dei link da condividere. */
export function indirizzoApp(): string {
  try {
    return `${window.location.origin}${window.location.pathname}`;
  } catch {
    return '';
  }
}
