// Stato vuoto / non trovato generico: parametri `titolo`, `testo` (la causa, una riga), `azione` (id di una schermata extra, o «home»), `etichetta` (il verbo del pulsante), `illustrazione`.
// Senza parametri è «Questa pagina non esiste»: causa e pulsante sempre scritti. Illustrazioni ammesse: la lente (non trovato), il globo, il foglio con la croce; mai una faccia triste.
import { Icona } from '../../../brand/icone/Icona';
import { useExtra } from '../contesto';
import StatoPagina from './StatoPagina';

const AMMESSE = ['ricerca', 'ricerca-scintille', 'mondo-globo', 'documento-errore', 'messaggi-supporto'];

export default function StatoVuoto() {
  const { params, vai, vaiHome, indietro } = useExtra();
  const titolo = (params.titolo ?? '').slice(0, 60) || 'Questa pagina non esiste';
  const testo = (params.testo ?? '').slice(0, 120) || (params.titolo ? undefined : 'Il link potrebbe essere vecchio.');
  const azione = params.azione ?? '';
  const etichetta = (params.etichetta ?? '').slice(0, 30);
  // «vuoto» (la vecchia nuvola triste) non si usa più: chi lo chiede ottiene la lente
  const illustrazione = AMMESSE.includes(params.illustrazione ?? '') ? params.illustrazione! : 'ricerca';
  const azioni = [
    ...(azione === 'home' ? [{ testo: etichetta || 'Vai alla Home', onClick: vaiHome, icona: <Icona nome="home" size={18} /> }]
      : azione ? [{ testo: etichetta || 'Apri', onClick: () => vai(azione), icona: <Icona nome="avanti" size={18} /> }] : []),
    { testo: 'Torna indietro', onClick: indietro, tipo: (azione ? 'secondaria' : 'primaria') as 'secondaria' | 'primaria', icona: <Icona nome="indietro" size={18} /> },
  ];
  return <StatoPagina illustrazione={illustrazione} titolo={titolo} testo={testo} azioni={azioni} figuraLato={104} />;
}
