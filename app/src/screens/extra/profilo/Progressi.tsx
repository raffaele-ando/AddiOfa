import { useState } from 'react';
import { Icona } from '../../../brand/icone/Icona';
import StatsMode from '../../../components/StatsMode';
import { useExtra } from '../contesto';
import { Pagina, SelettoreIcone } from './componenti';
import ProgressiArgomenti from './ProgressiArgomenti';
import ProgressiCalendario from './ProgressiCalendario';

type Sezione = 'panoramica' | 'argomenti' | 'calendario';
const VOCI = [
  { id: 'panoramica' as const, nome: 'Panoramica', icona: <Icona nome="panoramica" size={24} /> },
  { id: 'argomenti' as const, nome: 'Argomenti', icona: <Icona nome="argomenti" size={24} /> },
  { id: 'calendario' as const, nome: 'Calendario', icona: <Icona nome="calendario" size={24} /> },
];

/** Estensione di ExtraCtx che App può aggiungere: avvia il diagnostico (la vista `onboarding`). Senza, il pulsante porta alla Home. */
type ConDiagnostico = { avviaDiagnostico?: () => void };

/** Progressi: tre sezioni scelte da un selettore a sole icone (panoramica, argomenti, calendario). Parametro `sezione` per aprirne una. */
export default function Progressi() {
  const ctx = useExtra();
  const { appState, params, indietro, apriPaywall, vaiHome } = ctx;
  const iniziale = (VOCI.find(v => v.id === params.sezione)?.id ?? 'panoramica') as Sezione;
  const [sezione, setSezione] = useState<Sezione>(iniziale);
  const avviaDiagnostico = (ctx as typeof ctx & ConDiagnostico).avviaDiagnostico;

  return (
    <Pagina titolo="Progressi" indietro={indietro}>
      <div className="mt-4"><SelettoreIcone<Sezione> nome="Sezione" voci={VOCI} valore={sezione} onScegli={setSezione} /></div>
      <h2 className="mt-5 mb-3 text-[15.5px] leading-[20px] font-bold text-testo">{VOCI.find(v => v.id === sezione)!.nome}</h2>
      {sezione === 'panoramica' && (
        <StatsMode incorporata appState={appState} onExit={indietro} onNeedPass={() => apriPaywall()} onDiagnostico={avviaDiagnostico ?? vaiHome} />
      )}
      {sezione === 'argomenti' && <ProgressiArgomenti />}
      {sezione === 'calendario' && <ProgressiCalendario />}
    </Pagina>
  );
}
