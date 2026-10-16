// Stato vuoto generico (concept 16/17): parametri `titolo`, `testo` (facoltativo), `azione` (id di una schermata extra, o «home»), `illustrazione`.
import { Icona } from '../../../brand/icone/Icona';
import { useExtra } from '../contesto';
import StatoPagina from './StatoPagina';

export default function StatoVuoto() {
  const { params, vai, vaiHome, indietro } = useExtra();
  const titolo = (params.titolo ?? '').slice(0, 60) || 'Niente da vedere';
  const testo = (params.testo ?? '').slice(0, 120) || undefined;
  const azione = params.azione ?? '';
  const etichetta = (params.etichetta ?? '').slice(0, 30);
  const illustrazione = ['ricerca', 'suggerimenti-consigli', 'progressi-statistiche', 'quiz-test', 'studio-inglese', 'messaggi-supporto'].includes(params.illustrazione ?? '')
    ? params.illustrazione! : 'ricerca';
  const azioni = [
    ...(azione === 'home' ? [{ testo: etichetta || 'Home', onClick: vaiHome, icona: <Icona nome="home" size={18} /> }]
      : azione ? [{ testo: etichetta || 'Apri', onClick: () => vai(azione), icona: <Icona nome="avanti" size={18} /> }] : []),
    { testo: 'Indietro', onClick: indietro, tipo: (azione ? 'secondaria' : 'primaria') as 'secondaria' | 'primaria', icona: <Icona nome="indietro" size={18} /> },
  ];
  return <StatoPagina illustrazione={illustrazione} titolo={titolo} testo={testo} azioni={azioni} />;
}
