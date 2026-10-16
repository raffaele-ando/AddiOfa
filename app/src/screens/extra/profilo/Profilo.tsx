import { useMemo, type ReactNode } from 'react';
import { Activity, Award, BarChart3, CalendarDays, CheckCheck, Clock, Compass, FileCheck2, Gift, KeyRound, Settings, Swords, Target, Trophy, Users } from 'lucide-react';
import { useAccess } from '../../../access/context';
import { playTapSound } from '../../../lib/audio';
import { nomeVisibile } from '../../../lib/profilo/dati';
import { formatoDurata, riassuntoStudio } from '../../../lib/profilo/giorni';
import { livelloConNucleo, SOGLIA_LIVELLO } from '../../../lib/profilo/livello';
import { countLearned } from '../../../lib/spacedRepetition';
import { Carta } from '../../../components/home/comune';
import { SCHERMATE } from '../registro';
import { BarraTono, IconaTono, type Tono } from '../ui';
import { useExtra } from '../contesto';
import { Avatar, GruppoRighe, Pagina, RigaLista, Sezione, useBadge, useBanco, useProfilo } from './componenti';

/** Tessera numerica: l'icona porta il colore del significato (giorni e tempo = ambra, imparate = verde, simulazioni = blu), il numero resta navy. */
function Tessera({ icona, tono, valore, etichetta }: { icona: ReactNode; tono: Tono; valore: string; etichetta: string }) {
  return (
    <Carta className="p-3.5 flex flex-col">
      <IconaTono tono={tono} lato={32} className="rounded-[9px] bg-superficie">{icona}</IconaTono>
      <span className="mt-2.5 text-[26px] leading-[32px] font-extrabold text-testo tabular-nums whitespace-nowrap">{valore}</span>
      <span className="text-[12.5px] leading-[17px] font-medium text-testo-tenue">{etichetta}</span>
    </Carta>
  );
}

/** Hub del profilo: chi sei, a che livello sei arrivato, i numeri veri del tuo studio, il Pass e la porta verso il resto. */
export default function Profilo() {
  const { appState, pass, vai, indietro, apriImpostazioni, apriPaywall, apriInviti } = useExtra();
  const { entitlement } = useAccess();
  const { profilo } = useProfilo();
  const { pool, nucleo } = useBanco();
  const badge = useBadge();

  const studio = useMemo(() => riassuntoStudio(appState), [appState]);
  const livello = useMemo(() => livelloConNucleo(appState.stats, pool, nucleo), [appState.stats, pool, nucleo]);
  const imparate = useMemo(() => countLearned(appState.stats, pool.map(q => q.id)), [appState.stats, pool]);
  const sbloccati = badge.filter(b => b.sbloccato).length;
  const haStudiato = studio.giorniDiStudio > 0 || imparate > 0 || studio.simulazioni > 0;
  const prossimo = livello.prossimo;
  const necessarie = prossimo ? Math.ceil(SOGLIA_LIVELLO * prossimo.totale - 1e-9) : 0;

  const scadenza = entitlement.expiresAt
    ? `Vale fino al ${new Date(entitlement.expiresAt).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}.`
    : 'Non ha una scadenza.';

  const esiste = (id: string) => !!SCHERMATE[id];
  const studioRighe = [
    esiste('obiettivi') && <RigaLista key="o" tono="alto" icona={<Target size={19} />} titolo="Obiettivi" testo="Data del test, minuti al giorno, probabilità" onClick={() => vai('obiettivi')} />,
    esiste('calendario') && <RigaLista key="c" tono="medio" icona={<CalendarDays size={19} />} titolo="Calendario" testo="I giorni in cui hai studiato" onClick={() => vai('calendario')} />,
    esiste('badge') && <RigaLista key="b" tono="viola" icona={<Award size={19} />} titolo="Badge" testo={`${sbloccati} su ${badge.length} traguardi raggiunti`} onClick={() => vai('badge')} />,
    esiste('attivita') && <RigaLista key="a" tono="medio" icona={<Activity size={19} />} titolo="Attività" testo="Domande e minuti, giorno per giorno" onClick={() => vai('attivita')} />,
    esiste('statistiche') && <RigaLista key="s" tono="azione" icona={<BarChart3 size={19} />} titolo="Statistiche" testo="Argomenti, simulazioni, costanza" onClick={() => vai('statistiche')} />,
  ].filter(Boolean);
  // Impostazioni non è una riga: è l'ingranaggio accanto al titolo (la stessa azione una volta sola)
  const altriRighe = [
    esiste('sfide') && <RigaLista key="sf" tono="basso" icona={<Swords size={19} />} titolo="Sfide" testo="Metti alla prova un amico" onClick={() => vai('sfide')} />,
    esiste('amici') && <RigaLista key="am" tono="azione" icona={<Users size={19} />} titolo="Amici" testo="Chi ha accettato una tua sfida" onClick={() => vai('amici')} />,
    esiste('classifica') && <RigaLista key="cl" tono="medio" icona={<Trophy size={19} />} titolo="Classifica" onClick={() => vai('classifica')} />,
    <RigaLista key="in" tono="azione" icona={<Gift size={19} />} titolo="Inviti" testo="Invita un amico" onClick={apriInviti} />,
    esiste('esplora') && <RigaLista key="es" tono="viola" icona={<Compass size={19} />} titolo="Esplora" testo="Strumenti e progetti collegati" onClick={() => vai('esplora')} />,
  ].filter(Boolean);

  return (
    <Pagina titolo="Il tuo profilo" indietro={indietro} destra={
      <button type="button" onClick={() => { playTapSound(); apriImpostazioni(); }} aria-label="Impostazioni"
        className="brand-premibile w-10 h-10 rounded-full bg-superficie-2 text-testo grid place-items-center">
        <Settings size={20} strokeWidth={1.8} aria-hidden="true" />
      </button>
    }>
      <Carta className="mt-4 p-4 flex items-center gap-4">
        <Avatar profilo={profilo} lato={72} />
        <div className="flex-1 min-w-0">
          <p className="text-[20px] leading-[26px] font-extrabold text-testo truncate">{nomeVisibile(profilo)}</p>
          <p className="text-[13.5px] leading-[18px] text-testo-tenue truncate">{profilo.corso || 'Corso di studi non indicato'}</p>
          <button type="button" onClick={() => { playTapSound(); vai('profilo-modifica'); }}
            className="brand-premibile mt-2 h-8 px-3.5 rounded-full bg-azione-tinta text-azione-scuro text-[13px] font-semibold">Modifica</button>
        </div>
      </Carta>

      <Carta className="mt-3 p-4">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-[12.5px] font-medium text-testo-tenue">Livello attuale</p>
          {prossimo && <p className="text-[12.5px] font-semibold text-viola-testo tabular-nums">{prossimo.imparate}/{prossimo.totale} verso {prossimo.livello}</p>}
        </div>
        <p className={livello.livello ? 'mt-0.5 font-extrabold leading-tight text-[34px] text-viola' : 'mt-0.5 font-extrabold leading-tight text-[22px] text-testo'}>{livello.livello ?? 'Da definire'}</p>
        {prossimo ? (
          <>
            <div className="mt-2.5"><BarraTono tono="viola" valore={Math.min(1, prossimo.imparate / necessarie) * 100} /></div>
            <p className="mt-2 text-[13.5px] leading-[19px] text-testo">
              {prossimo.imparate === 0 && !livello.livello
                ? `Per arrivare al livello ${prossimo.livello} impara ${livello.mancanti} domande ${prossimo.livello}.`
                : `Ancora ${livello.mancanti} ${livello.mancanti === 1 ? 'domanda' : 'domande'} ${prossimo.livello} da imparare.`}
            </p>
          </>
        ) : (
          <p className="mt-2 text-[13.5px] leading-[19px] text-testo">Hai raggiunto l'ultimo livello delle domande.</p>
        )}
        <p className="mt-1.5 text-[12px] leading-[17px] text-testo-tenue">
          Non è una certificazione: dice quante domande di ogni livello hai imparato.{livello.dalNucleo ? ' Questo livello l\'hai raggiunto sul nucleo gratuito e resta tuo.' : ''}
        </p>
      </Carta>

      <Sezione titolo="Il tuo studio" id="titolo-numeri">
        <div className="grid grid-cols-2 gap-3">
          <Tessera tono="medio" icona={<CalendarDays size={18} />} valore={String(studio.giorniDiStudio)} etichetta={studio.giorniDiStudio === 1 ? 'Giorno di studio' : 'Giorni di studio'} />
          <Tessera tono="alto" icona={<CheckCheck size={18} />} valore={String(imparate)} etichetta={imparate === 1 ? 'Domanda imparata' : 'Domande imparate'} />
          <Tessera tono="azione" icona={<FileCheck2 size={18} />} valore={String(studio.simulazioni)} etichetta={studio.simulazioni === 1 ? 'Simulazione fatta' : 'Simulazioni fatte'} />
          <Tessera tono="medio" icona={<Clock size={18} />} valore={formatoDurata(studio.secondiTotali)} etichetta="Tempo di studio" />
        </div>
        {!haStudiato && <p className="px-1 text-[13px] leading-[18px] text-testo-tenue">I numeri si riempiono appena cominci a studiare.</p>}
      </Sezione>

      <Carta className={`mt-[24px] p-4 flex items-center gap-3 ${pass ? '' : 'border border-medio/30'}`} tinta={pass ? undefined : 'bg-medio-tinta'}>
        <IconaTono tono="medio" lato={40}><KeyRound size={22} /></IconaTono>
        <span className="flex-1 min-w-0">
          <span className="block text-[15px] leading-[20px] font-bold text-testo">{pass ? (entitlement.source === 'demo' ? 'Pass in prova attivo' : 'Pass AddiOFA attivo') : 'Parte gratuita'}</span>
          <span className="block text-[12.5px] leading-[17px] text-testo-tenue">{pass ? scadenza : 'Nucleo di domande, una simulazione e una scheda di teoria.'}</span>
        </span>
        {!pass && <button type="button" onClick={() => { playTapSound(); apriPaywall(); }} className="brand-premibile shrink-0 h-9 px-4 rounded-full bg-azione text-azione-su text-[13.5px] font-semibold">Scopri il Pass</button>}
      </Carta>

      <div className="mt-[24px] flex flex-col gap-3">
        {studioRighe.length > 0 && <GruppoRighe>{studioRighe}</GruppoRighe>}
        <GruppoRighe>{altriRighe}</GruppoRighe>
      </div>
      <p className="mt-4 px-1 text-[12px] leading-[17px] text-testo-tenue">Nome, avatar e progressi restano su questo dispositivo.</p>
    </Pagina>
  );
}
