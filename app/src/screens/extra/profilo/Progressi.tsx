import { useState } from 'react';
import { Icona } from '../../../brand/icone/Icona';
import { playTapSound } from '../../../lib/audio';
import StatsMode from '../../../components/StatsMode';
import { useExtra } from '../contesto';
import { Disegno } from '../servizi/componenti';
import { Pagina, SelettoreIcone } from './componenti';
import ProgressiArgomenti from './ProgressiArgomenti';
import ProgressiCalendario from './ProgressiCalendario';

type Sezione = 'panoramica' | 'argomenti' | 'calendario';
const VOCI = [
  { id: 'panoramica' as const, nome: 'Panoramica', icona: <Icona nome="panoramica" size={24} /> },
  { id: 'argomenti' as const, nome: 'Argomenti', icona: <Icona nome="argomenti" size={24} /> },
  { id: 'calendario' as const, nome: 'Calendario', icona: <Icona nome="calendario" size={24} /> },
];

/** Progressi: tre sezioni scelte da un selettore a sole icone (panoramica, argomenti, calendario). Parametro `sezione` per aprirne una. */
export default function Progressi() {
  const ctx = useExtra();
  const { appState, params, indietro } = ctx;
  const iniziale = (VOCI.find(v => v.id === params.sezione)?.id ?? 'panoramica') as Sezione;
  const [sezione, setSezione] = useState<Sezione>(iniziale);
  const { avviaDiagnostico, avviaEsercizi } = ctx;
  // senza risposte, simulazioni, giorni di studio né diagnostico non c'è niente da mostrare: stato vuoto con le due strade per cominciare
  const haDati = Object.keys(appState.stats).length > 0 || appState.history.length > 0 || !!appState.onboarding?.diagnosticTotal
    || Object.keys(appState.dailyActivity ?? {}).length > 0;

  return (
    <Pagina titolo="Progressi" indietro={indietro}>
      {!haDati ? (
        <div role="status" className="mt-6 flex flex-col items-center text-center">
          <Disegno nome="ricerca-scintille" lato={120} />
          <h2 className="mt-4 text-[20px] leading-[26px] font-extrabold text-testo">Nessun dato</h2>
          <div className="mt-5 flex w-full flex-col gap-2.5">
            <button type="button" onClick={() => { playTapSound(); avviaDiagnostico(); }}
              className="brand-premibile flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[13px] bg-azione px-4 py-3 text-[16px] font-bold text-azione-su"><Icona nome="diagnostico" size={20} />Diagnostico</button>
            <button type="button" onClick={() => { playTapSound(); avviaEsercizi('smart'); }}
              className="brand-premibile flex min-h-[48px] w-full items-center justify-center gap-2 rounded-[13px] bg-superficie-2 px-4 py-3 text-[15px] font-bold text-testo"><Icona nome="studia" size={20} />Studia</button>
          </div>
        </div>
      ) : (<>
      {/* testata del kit luminoso (concept 18 e 19: le statistiche), da 160 px */}
      <div className="mt-2 flex justify-center"><Disegno nome="progressi-statistiche" kit="kit-luminoso" lato={160} /></div>
      <div className="mt-3"><SelettoreIcone<Sezione> nome="Sezione" voci={VOCI} valore={sezione} onScegli={setSezione} /></div>
      <h2 className="mt-5 mb-3 flex items-center gap-2.5 text-[15.5px] leading-[20px] font-bold text-testo">
        {sezione === 'argomenti' && <Disegno nome="progressi-statistiche" lato={48} />}
        {VOCI.find(v => v.id === sezione)!.nome}
      </h2>
      {sezione === 'panoramica' && (
        <StatsMode incorporata appState={appState} onExit={indietro} onDiagnostico={avviaDiagnostico} />
      )}
      {sezione === 'argomenti' && <ProgressiArgomenti />}
      {sezione === 'calendario' && <ProgressiCalendario />}
      </>)}
    </Pagina>
  );
}
