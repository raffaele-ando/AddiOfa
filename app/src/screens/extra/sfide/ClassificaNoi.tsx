// Il punto di innesto della classifica NOI (le persone di tutta la community, non solo i tuoi rivali).
// Per ora non c'è collegamento: il componente dice, in UNA riga di lista, che la classifica NOI non è attiva e che qui si vede solo quella con gli amici;
// niente numeri, niente seconda scheda vuota. L'agente del progetto (ATLAS) può sostituire questo file mantenendo le props.
//
// Props: `attivo` = il collegamento a ATLAS è attivo per questo utente (Project ID registrato e Worker raggiungibile).
//   - attivo = false (oggi, sempre): la riga «non attiva»;
//   - attivo = true: questa versione non ha niente da mostrare e non disegna niente (non si inventano dati); la versione vera mostra la classifica NOI.
import { GruppoRighe, Riga, Sezione } from '../ui';

export default function ClassificaNoi({ attivo }: { attivo: boolean }) {
  if (attivo) return null;
  return (
    <Sezione id="titolo-noi" titolo="Classifica NOI">
      <GruppoRighe etichetta="Classifica NOI">
        <Riga icona="classifica-noi" titolo="Non attiva su questo sito" sottotitolo="Vedi solo la classifica con i tuoi amici." />
      </GruppoRighe>
    </Sezione>
  );
}

export { ClassificaNoi };
