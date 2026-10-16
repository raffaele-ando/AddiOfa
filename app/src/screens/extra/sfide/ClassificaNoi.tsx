// Il punto di innesto della classifica NOI (le persone di tutta la community, non solo i tuoi rivali).
// Per ora non c'è collegamento: il componente mostra lo stato «non collegato» con l'illustrazione degli stati (il globo senza aeroplano:
// nessun collegamento) e niente numeri. L'agente del progetto (ATLAS) sostituisce questo file mantenendo le props.
//
// Props: `attivo` = il collegamento a ATLAS è attivo per questo utente (Project ID registrato e Worker raggiungibile).
//   - attivo = false (oggi, sempre): stato «non collegato»; chi non è collegato vede solo la classifica locale, qui sopra.
//   - attivo = true: questa versione non ha niente da mostrare e non disegna niente (non si inventano dati); la versione vera mostra la classifica NOI.
// La schermata Classifica passa sempre `attivo={false}` finché non esiste una fonte per saperlo.
import { Illustrazione } from '../../../brand/Illustrazione';
import { Carta } from './comuni';

export default function ClassificaNoi({ attivo }: { attivo: boolean }) {
  if (attivo) return null;
  return (
    <section aria-labelledby="titolo-noi" className="mt-6 flex flex-col gap-2.5">
      <h2 id="titolo-noi" className="text-[15.5px] leading-[20px] font-bold text-testo">Classifica NOI</h2>
      <Carta className="flex items-center gap-4">
        <Illustrazione nome="mondo-globo" lato={72} />
        <div role="status" className="min-w-0 flex-1">
          <p className="text-[16px] leading-[22px] font-extrabold text-testo">Non collegato</p>
          <p className="mt-0.5 text-[13.5px] leading-[19px] text-testo-tenue">Vedi solo la classifica locale.</p>
        </div>
      </Carta>
    </section>
  );
}

export { ClassificaNoi };
