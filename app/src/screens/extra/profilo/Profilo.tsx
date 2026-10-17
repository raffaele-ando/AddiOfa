import { useMemo } from 'react';
import { Icona } from '../../../brand/icone/Icona';
import { calcolaStima } from '../../../components/home/stima';
import { playTapSound } from '../../../lib/audio';
import { nomeVisibile } from '../../../lib/profilo/dati';
import { giorniMancanti, normalizzaObiettivi, OBIETTIVI_INIZIALI, type ObiettiviDati } from '../../../lib/profilo/obiettivi';
import { livelloAttuale, SOGLIA_LIVELLO } from '../../../lib/profilo/livello';
import { AVVERTENZA_INDIPENDENZA, LEGAL_TABS } from '../../../legal';
import { ICONE_LEGALI } from '../../Footer';
import { SCHERMATE } from '../registro';
import { BarraTono } from '../ui';
import { useExtra, useExtraDati } from '../contesto';
import { Disegno } from '../servizi/componenti';
import { Avatar, GruppoRighe, Pagina, RigaElenco, TesseraIllustrata, useBadge, useBanco, useOggi, useProfilo } from './componenti';

/**
 * Profilo, hub a tessere: in alto chi sei (avatar, nome, livello); poi Progressi, Obiettivi, Badge e Progetto, ognuna con la sua
 * illustrazione (piano d'uso: docs/design/ILLUSTRAZIONI.md §3.4); poi Aiuto (FAQ, Segnala) e Informazioni (presentazione, legali).
 * L'ingranaggio porta alle Impostazioni.
 */
export default function Profilo() {
  const { appState, vai, indietro, apriImpostazioni, apriLanding, apriLegale } = useExtra();
  const { profilo } = useProfilo();
  const banco = useBanco();
  const badge = useBadge();
  const oggi = useOggi();
  const [grezzi] = useExtraDati<ObiettiviDati>('obiettivi', OBIETTIVI_INIZIALI);

  const livello = useMemo(() => livelloAttuale(appState.stats, banco), [appState.stats, banco]);
  const prossimo = livello.prossimo;
  const necessarie = prossimo ? Math.ceil(SOGLIA_LIVELLO * prossimo.totale - 1e-9) : 0;
  const stima = useMemo(() => calcolaStima(appState), [appState]);
  const mancano = giorniMancanti(normalizzaObiettivi(grezzi).dataTest, oggi);
  const ottenuti = badge.filter(b => b.sbloccato).length;
  // senza nome e senza avatar scelto la testata mostra la tessera d'identità del kit, non una lettera
  const anonimo = !profilo.nome && profilo.avatar === 'iniziale';

  // i dati piccoli sotto le parole sono veri e compaiono solo se esistono
  const tessere: { id: string; illustrazione: string; parola: string; dato?: string }[] = [
    { id: 'progressi', illustrazione: 'progressi-statistiche', parola: 'Progressi', dato: stima ? `${Math.round(stima.p * 100)}%` : undefined },
    { id: 'obiettivi', illustrazione: 'obiettivo', parola: 'Obiettivi', dato: mancano?.quando === 'futuro' ? `${mancano.giorni} gg` : mancano?.quando === 'oggi' ? 'Oggi' : undefined },
    { id: 'badge', illustrazione: 'celebrazione-fiocco', parola: 'Badge', dato: `${ottenuti}/${badge.length}` },
    { id: 'esplora', illustrazione: 'mondo-internazionale', parola: 'Progetto' },
  ];

  return (
    <Pagina titolo="Profilo" indietro={indietro} destra={
      <button type="button" onClick={() => { playTapSound(); apriImpostazioni(); }} aria-label="Impostazioni"
        className="brand-premibile w-10 h-10 rounded-full bg-superficie-2 text-testo grid place-items-center">
        <Icona nome="impostazioni" size={22} />
      </button>
    }>
      <section aria-label="Il tuo profilo" className="mt-4 rounded-[14px] bg-superficie-2 p-4">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => { playTapSound(); vai('profilo-modifica'); }} aria-label="Modifica il profilo" className="brand-premibile relative shrink-0 rounded-full">
            {anonimo ? <Disegno nome="verifica-utente" lato={96} /> : <Avatar profilo={profilo} lato={72} />}
            <span className="absolute -right-1 -bottom-1 grid h-7 w-7 place-items-center rounded-full border-2 border-superficie-2 bg-azione text-azione-su" aria-hidden="true"><Icona nome="modifica" size={14} /></span>
          </button>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-[22px] leading-[28px] font-extrabold text-testo">{nomeVisibile(profilo)}</h2>
            {profilo.corso && <p className="truncate text-[13.5px] leading-[18px] text-testo-tenue">{profilo.corso}</p>}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2.5">
          <div role="status" aria-label={`Livello: ${livello.livello ?? 'da definire'}`} className="flex items-center gap-2 rounded-full bg-superficie py-1 pl-2.5 pr-3.5 text-[13.5px] font-bold text-testo">
            <Icona nome="livello" size={18} className="text-viola" />
            <span className={livello.livello ? 'text-viola-testo text-[16px]' : 'text-testo-tenue'}>{livello.livello ?? '–'}</span>
            {prossimo && <span className="text-[12.5px] font-semibold tabular-nums text-testo-tenue">{prossimo.imparate}/{necessarie}</span>}
          </div>
        </div>
        {prossimo && <div className="mt-3"><BarraTono tono="viola" valore={Math.min(1, prossimo.imparate / necessarie) * 100} /></div>}
      </section>

      <nav aria-label="Aree del profilo" className="mt-4 grid grid-cols-2 gap-2.5">
        {tessere.map(t => <TesseraIllustrata key={t.id} illustrazione={t.illustrazione} parola={t.parola} dato={t.dato} onClick={() => vai(t.id)} />)}
      </nav>

      <GruppoRighe etichetta="Aiuto">
        {SCHERMATE.faq && <RigaElenco illustrazione="messaggi-supporto" parola="FAQ" onClick={() => vai('faq')} />}
        {SCHERMATE.segnala && <RigaElenco icona={<Icona nome="segnala" size={22} />} tono="basso" parola="Segnala" onClick={() => vai('segnala')} />}
      </GruppoRighe>

      <GruppoRighe etichetta="Informazioni">
        <RigaElenco illustrazione="studio-inglese" parola="Presentazione" onClick={apriLanding} />
        {LEGAL_TABS.map(t => <RigaElenco key={t.id} icona={<Icona nome={ICONE_LEGALI[t.id]} size={22} />} parola={t.label} onClick={() => apriLegale(t.id)} />)}
      </GruppoRighe>
      <p data-testo-ok className="mx-auto mt-4 max-w-[52ch] text-center text-[11px] leading-snug text-testo-tenue">{AVVERTENZA_INDIPENDENZA}</p>
    </Pagina>
  );
}
