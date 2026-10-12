// Stato vuoto generico (concept 16/17): parametri `titolo`, `testo`, `azione` (id di una schermata extra, o «home»), `illustrazione`.
import { useExtra } from '../contesto';
import { ArrowLeft } from 'lucide-react';
import StatoPagina from './StatoPagina';

export default function StatoVuoto() {
  const { params, vai, vaiHome, indietro } = useExtra();
  const titolo = (params.titolo ?? '').slice(0, 80) || 'Qui non c\'è ancora niente';
  const testo = (params.testo ?? '').slice(0, 240) || 'Quando ci sarà qualcosa da vedere, lo troverai in questa pagina.';
  const azione = params.azione ?? '';
  const etichetta = (params.etichetta ?? '').slice(0, 40);
  const illustrazione = ['ricerca', 'suggerimenti-consigli', 'progressi-statistiche', 'quiz-test', 'studio-inglese', 'messaggi-supporto'].includes(params.illustrazione ?? '')
    ? params.illustrazione! : 'ricerca';
  const azioni = [
    ...(azione === 'home' ? [{ testo: etichetta || 'Vai alla Home', onClick: vaiHome }]
      : azione ? [{ testo: etichetta || 'Apri', onClick: () => vai(azione) }] : []),
    { testo: 'Indietro', onClick: indietro, tipo: 'secondaria' as const, icona: <ArrowLeft size={18} aria-hidden="true" /> },
  ];
  return <StatoPagina illustrazione={illustrazione} titolo={titolo} testo={testo} azioni={azioni} />;
}
