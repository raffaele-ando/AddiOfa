import { useMemo, type ReactNode } from 'react';
import { Activity, Award, BarChart3, CalendarDays, CheckCheck, Clock, Compass, FileCheck2, Gift, KeyRound, Settings, Swords, Target, Trophy, Users } from 'lucide-react';
import { useAccess } from '../../../access/context';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';
import { nomeVisibile } from '../../../lib/profilo/dati';
import { formatoDurata, riassuntoStudio } from '../../../lib/profilo/giorni';
import { livelloAttuale, SOGLIA_LIVELLO } from '../../../lib/profilo/livello';
import { Barra, Carta } from '../../../components/home/comune';
import { SCHERMATE } from '../registro';
import { useExtra } from '../contesto';
import { Avatar, GruppoRighe, Pagina, RigaLista, Sezione, useBadge, useBanco, useProfilo } from './componenti';

function Tessera({ icona, valore, etichetta }: { icona: ReactNode; valore: string; etichetta: string }) {
  return (
    <Carta className="p-3.5 flex flex-col">
      <span className="flex items-center gap-1.5 text-[12.5px] font-medium text-testo-tenue"><span className="text-azione" aria-hidden="true">{icona}</span>{etichetta}</span>
      <span className="mt-1 text-[24px] leading-[30px] font-extrabold text-testo tabular-nums">{valore}</span>
    </Carta>
  );
}

/** Hub del profilo: chi sei, a che livello sei arrivato, i numeri veri del tuo studio, il Pass e la porta verso il resto. */
export default function Profilo() {
  const { appState, pass, vai, apriImpostazioni, apriPaywall, apriInviti, avviaEsercizi } = useExtra();
  const { entitlement } = useAccess();
  const { profilo } = useProfilo();
  const { pool } = useBanco();
  const badge = useBadge();

  const studio = useMemo(() => riassuntoStudio(appState), [appState]);
  const livello = useMemo(() => livelloAttuale(appState.stats, pool), [appState.stats, pool]);
  const imparate = livello.quote.reduce((s, q) => s + q.imparate, 0);
  const sbloccati = badge.filter(b => b.sbloccato).length;
  const haStudiato = studio.giorniDiStudio > 0 || imparate > 0 || studio.simulazioni > 0;
  const prossimo = livello.prossimo;
  const necessarie = prossimo ? Math.ceil(SOGLIA_LIVELLO * prossimo.totale - 1e-9) : 0;

  const scadenza = entitlement.expiresAt
    ? `Vale fino al ${new Date(entitlement.expiresAt).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}.`
    : 'Non ha una scadenza.';

  const esiste = (id: string) => !!SCHERMATE[id];
  const studioRighe = [
    esiste('obiettivi') && <RigaLista key="o" icona={<Target size={19} />} titolo="Obiettivi" testo="Data del test, minuti al giorno, probabilità" onClick={() => vai('obiettivi')} />,
    esiste('calendario') && <RigaLista key="c" icona={<CalendarDays size={19} />} titolo="Calendario" testo="I giorni in cui hai studiato" onClick={() => vai('calendario')} />,
    esiste('badge') && <RigaLista key="b" icona={<Award size={19} />} titolo="Badge" testo={`${sbloccati} su ${badge.length} traguardi raggiunti`} onClick={() => vai('badge')} />,
    esiste('attivita') && <RigaLista key="a" icona={<Activity size={19} />} titolo="Attività" testo="Domande e minuti, giorno per giorno" onClick={() => vai('attivita')} />,
    esiste('statistiche') && <RigaLista key="s" icona={<BarChart3 size={19} />} titolo="Statistiche" testo="Argomenti, simulazioni, costanza" onClick={() => vai('statistiche')} />,
  ].filter(Boolean);
  const altriRighe = [
    esiste('sfide') && <RigaLista key="sf" icona={<Swords size={19} />} titolo="Sfide" testo="Metti alla prova un amico" onClick={() => vai('sfide')} />,
    esiste('amici') && <RigaLista key="am" icona={<Users size={19} />} titolo="Amici" testo="Chi ha accettato una tua sfida" onClick={() => vai('amici')} />,
    esiste('classifica') && <RigaLista key="cl" icona={<Trophy size={19} />} titolo="Classifica" onClick={() => vai('classifica')} />,
    <RigaLista key="in" icona={<Gift size={19} />} titolo="Inviti" testo="Invita un amico" onClick={apriInviti} />,
  ].filter(Boolean);
  const finali = [
    esiste('esplora') && <RigaLista key="es" icona={<Compass size={19} />} titolo="Esplora" testo="Strumenti e progetti collegati" onClick={() => vai('esplora')} />,
    <RigaLista key="im" icona={<Settings size={19} />} titolo="Impostazioni" testo="Tema, suoni, dati, aiuto" onClick={apriImpostazioni} />,
  ].filter(Boolean);

  return (
    <Pagina titolo="Il tuo profilo" destra={
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

      <Carta className="mt-3 p-4" >
        <p className="text-[12.5px] font-medium text-testo-tenue">Livello attuale</p>
        <div className="mt-0.5 flex items-baseline justify-between gap-3">
          <p className={cn('font-extrabold text-testo leading-tight', livello.livello ? 'text-[32px]' : 'text-[20px]')}>{livello.livello ?? 'Da definire'}</p>
          {prossimo && <p className="text-[12.5px] text-testo-tenue tabular-nums text-right">{prossimo.imparate} su {prossimo.totale} domande {prossimo.livello} imparate</p>}
        </div>
        {prossimo ? (
          <>
            <div className="mt-2.5"><Barra valore={Math.min(1, prossimo.imparate / necessarie) * 100} colore="var(--color-azione)" /></div>
            <p className="mt-2 text-[13px] leading-[18px] text-testo">
              {prossimo.imparate === 0 && !livello.livello
                ? `Per arrivare al livello ${prossimo.livello} impara ${livello.mancanti} domande ${prossimo.livello}.`
                : `Verso ${prossimo.livello}: ancora ${livello.mancanti} ${livello.mancanti === 1 ? 'domanda' : 'domande'} da imparare.`}
            </p>
          </>
        ) : (
          <p className="mt-2 text-[13px] leading-[18px] text-testo">Hai raggiunto l'ultimo livello delle domande.</p>
        )}
        <p className="mt-2 text-[12px] leading-[17px] text-testo-tenue">
          Si calcola dalle domande che hai imparato: un livello è raggiunto quando ne hai imparate il {Math.round(SOGLIA_LIVELLO * 100)} % di quel livello. Non è una certificazione.
        </p>
      </Carta>

      <Sezione titolo="Il tuo studio" id="titolo-numeri">
        <div className="grid grid-cols-2 gap-3">
          <Tessera icona={<CalendarDays size={16} />} valore={String(studio.giorniDiStudio)} etichetta={studio.giorniDiStudio === 1 ? 'Giorno di studio' : 'Giorni di studio'} />
          <Tessera icona={<CheckCheck size={16} />} valore={String(imparate)} etichetta={imparate === 1 ? 'Domanda imparata' : 'Domande imparate'} />
          <Tessera icona={<FileCheck2 size={16} />} valore={String(studio.simulazioni)} etichetta={studio.simulazioni === 1 ? 'Simulazione fatta' : 'Simulazioni fatte'} />
          <Tessera icona={<Clock size={16} />} valore={formatoDurata(studio.secondiTotali)} etichetta="Tempo di studio" />
        </div>
        {!haStudiato && (
          <div className="rounded-[12px] bg-superficie-2 p-3.5 flex items-center gap-3">
            <p className="flex-1 text-[13.5px] leading-[19px] text-testo-tenue">Qui compaiono i numeri veri del tuo studio, non appena cominci.</p>
            <button type="button" onClick={() => { playTapSound(); avviaEsercizi('smart'); }} className="brand-premibile shrink-0 h-9 px-4 rounded-full bg-azione text-azione-su text-[13.5px] font-semibold">Inizia</button>
          </div>
        )}
      </Sezione>

      <Sezione titolo="Il tuo Pass" id="titolo-pass">
        <Carta className="p-4 flex items-center gap-3">
          <span className="w-[40px] h-[40px] rounded-[10px] bg-azione-tinta text-azione flex items-center justify-center shrink-0" aria-hidden="true"><KeyRound size={22} /></span>
          <span className="flex-1 min-w-0">
            <span className="block text-[15px] leading-[20px] font-bold text-testo">{pass ? (entitlement.source === 'demo' ? 'Pass in prova attivo' : 'Pass AddiOFA attivo') : 'Parte gratuita'}</span>
            <span className="block text-[12.5px] leading-[17px] text-testo-tenue">{pass ? scadenza : 'Nucleo di domande, una simulazione e una scheda di teoria.'}</span>
          </span>
          {!pass && <button type="button" onClick={() => { playTapSound(); apriPaywall(); }} className="brand-premibile shrink-0 h-9 px-4 rounded-full bg-azione text-azione-su text-[13.5px] font-semibold">Scopri il Pass</button>}
        </Carta>
      </Sezione>

      <div className="mt-[24px] flex flex-col gap-3">
        {studioRighe.length > 0 && <GruppoRighe>{studioRighe}</GruppoRighe>}
        <GruppoRighe>{altriRighe}</GruppoRighe>
        <GruppoRighe>{finali}</GruppoRighe>
      </div>
      <p className="mt-4 px-1 text-[12px] leading-[17px] text-testo-tenue">Nome, avatar e progressi restano su questo dispositivo.</p>
    </Pagina>
  );
}
