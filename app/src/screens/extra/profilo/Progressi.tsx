import { useState } from 'react';
import { Icona } from '../../../brand/icone/Icona';
import { useExtra } from '../contesto';
import { BottoneAzione, BottoneSecondario, Vuoto } from '../servizi/componenti';
import { Segmenti } from '../ui';
import { Pagina } from './componenti';
import PanoramicaProgressi from './PanoramicaProgressi';
import ProgressiArgomenti from './ProgressiArgomenti';
import ProgressiCalendario from './ProgressiCalendario';

type Sezione = 'panoramica' | 'argomenti' | 'calendario';
const VOCI: { id: Sezione; nome: string }[] = [
  { id: 'panoramica', nome: 'Panoramica' },
  { id: 'argomenti', nome: 'Argomenti' },
  { id: 'calendario', nome: 'Calendario' },
];

/** Progressi: tre viste scelte da un controllo a parole (Panoramica, Argomenti, Calendario). Parametro `sezione` per aprirne una. Senza dati, uno stato vuoto con la causa e le due strade per cominciare. */
export default function Progressi() {
  const ctx = useExtra();
  const { appState, params, indietro, avviaDiagnostico, avviaEsercizi } = ctx;
  const iniziale = (VOCI.find(v => v.id === params.sezione)?.id ?? 'panoramica') as Sezione;
  const [sezione, setSezione] = useState<Sezione>(iniziale);
  // senza risposte, simulazioni, giorni di studio né diagnostico non c'è niente da mostrare
  const haDati = Object.keys(appState.stats).length > 0 || appState.history.length > 0 || !!appState.onboarding?.diagnosticTotal
    || Object.keys(appState.dailyActivity ?? {}).length > 0;

  return (
    <Pagina titolo="Progressi" indietro={indietro}>
      {!haDati ? (
        <Vuoto className="mt-6" illustrazione="progressi-statistiche" titolo="Ancora nessun progresso"
          causa="Compaiono dopo le prime risposte o il test di livello."
          azioni={<>
            <BottoneAzione icona={<Icona nome="diagnostico" size={20} />} onClick={avviaDiagnostico}>Fai il test di livello</BottoneAzione>
            <BottoneSecondario icona={<Icona nome="studia" size={20} />} onClick={() => avviaEsercizi('smart')}>Inizia a studiare</BottoneSecondario>
          </>} />
      ) : (<>
        <Segmenti<Sezione> className="mt-3" nome="Vista" voci={VOCI} valore={sezione} onScegli={setSezione} />
        {sezione === 'panoramica' && <PanoramicaProgressi onArgomenti={() => setSezione('argomenti')} />}
        {sezione === 'argomenti' && <ProgressiArgomenti />}
        {sezione === 'calendario' && <ProgressiCalendario />}
        {sezione === 'panoramica' && (
          <div className="mt-4">
            <BottoneSecondario icona={<Icona nome="diagnostico" size={20} />} onClick={avviaDiagnostico}>Rifai il test di livello</BottoneSecondario>
          </div>
        )}
      </>)}
    </Pagina>
  );
}
