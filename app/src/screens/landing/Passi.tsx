import { FORMATS, FREE_LIMITS } from '../../config/offer';
import { Evidenza, Sezione, TitoloSezione } from './comune';

const PASSI = [
  {
    titolo: 'Diagnostico gratuito',
    testo: `${FREE_LIMITS.diagnostic} domande, circa 3 minuti, senza account. Vedi la probabilità stimata di superare il test e gli argomenti da ripassare.`,
    nota: 'Gratis',
  },
  {
    titolo: 'Ripasso sugli errori',
    testo: `Le domande sbagliate tornano, con la spiegazione in italiano. Parti da un nucleo di circa ${FREE_LIMITS.coreQuestions} domande.`,
    nota: 'Nucleo gratis, tutto il banco con il Pass',
  },
  {
    titolo: 'Simulazioni',
    testo: `Provi il test per intero: ${FORMATS.ente.questions} domande in ${FORMATS.ente.minutes} minuti, nel formato del test di recupero o del TENG.`,
    nota: 'Una gratis, illimitate con il Pass',
  },
  {
    titolo: 'Il test vero',
    testo: 'Ci arrivi sapendo cosa aspettarti. Il test lo fai con il Politecnico o con l\'ente che scegli, non con noi.',
    nota: 'Si fa fuori da AddiOFA',
  },
];

// Quattro passi collegati da una linea: verticale sul telefono, orizzontale da 1024 px.
export default function Passi() {
  return (
    <Sezione id="come-funziona" titoloId="t-passi">
      <div>
        <TitoloSezione id="t-passi" occhiello="Come funziona" sotto="Dal diagnostico al test vero, un passo alla volta.">
          Come funziona in <Evidenza>4 passi</Evidenza>
        </TitoloSezione>
      </div>

      <ol className="mt-10 grid gap-6 lg:grid-cols-4 lg:gap-5">
        {PASSI.map((p, i) => (
          <li key={p.titolo}>
            <div className="relative pl-16 lg:pl-0 lg:pt-16">
              {/* linea di collegamento: sotto il cerchio sul telefono, a destra del cerchio da 1024 px */}
              {i < PASSI.length - 1 && (
                <span aria-hidden className="absolute left-[19px] top-12 -bottom-6 w-0.5 bg-azione/30 lg:left-12 lg:right-[-1.25rem] lg:top-[19px] lg:bottom-auto lg:h-0.5 lg:w-auto" />
              )}
              <span aria-hidden className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-azione text-base font-extrabold text-azione-su ring-[6px] ring-fondo">
                {i + 1}
              </span>
              <h3 className="text-lg font-bold text-testo lg:pr-4">{p.titolo}</h3>
              <p className="mt-1.5 text-sm font-medium text-testo-tenue lg:pr-4">{p.testo}</p>
              <p className="mt-3 inline-block rounded-full bg-azione-tinta px-3 py-1 text-xs font-bold text-azione-scuro">{p.nota}</p>
            </div>
          </li>
        ))}
      </ol>
    </Sezione>
  );
}
