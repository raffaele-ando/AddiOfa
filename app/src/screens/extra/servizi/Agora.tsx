// «Agorà» (concept 13, 36 «Discussione», 49): stato onesto. Agorà è il forum degli studenti; dentro AddiOFA non ci sono discussioni
// e nessuna è inventata. La pagina dice a cosa servirà e cosa si può fare intanto nell'app.
import { MessagesSquare } from 'lucide-react';
import { useExtra } from '../contesto';
import { BottoneAzione, BottoneSecondario, Disegno, Nota, Pagina, Sezione } from './componenti';
import { ECOSYSTEM } from '../../../config/ecosystem';

const SCOPI: [string, string][] = [
  ['Domande', 'Chiedere agli altri studenti come hanno affrontato il test o un argomento.'],
  ['Idee', 'Proporre e discutere idee con altri studenti.'],
  ['Confronto', 'Leggere esperienze di chi ci è già passato, e raccontare la propria.'],
];

export default function Agora() {
  const { vai, apriInviti } = useExtra();
  return (
    <Pagina titolo="Agorà" sottotitolo="Il forum degli studenti: domande, idee, confronto."
      figura={<MessagesSquare size={44} className="mt-1 shrink-0 text-azione" aria-hidden="true" />}>

      <div className="mt-6 flex flex-col items-center text-center" role="status">
        <Disegno nome="messaggi-supporto" lato={168} />
        <h2 className="mt-4 text-[20px] leading-[26px] font-extrabold text-testo">Qui non ci sono ancora discussioni</h2>
        <p className="mt-2 text-[14.5px] leading-[21px] text-testo-tenue">
          Agorà non è ancora collegata ad AddiOFA: dentro l'app non c'è nessuna discussione, nessun commento e nessun utente da mostrarti. Quando il collegamento esisterà, lo troverai qui.
        </p>
      </div>

      <Sezione id="agora-cose" titolo="A cosa servirà, nei piani">
        <ul className="flex flex-col gap-[8px]">
          {SCOPI.map(([t, d]) => (
            <li key={t} className="rounded-[12px] bg-superficie-2 p-3.5">
              <p className="text-[14.5px] leading-[20px] font-bold text-testo">{t}</p>
              <p className="text-[13px] leading-[19px] text-testo-tenue">{d}</p>
            </li>
          ))}
        </ul>
        <p className="text-[12.5px] leading-[18px] text-testo-tenue">È lo scopo previsto, non una funzione già pronta e non una data di uscita.</p>
      </Sezione>

      <Sezione id="agora-come" titolo="Come ci arriverai">
        <Nota>
          <p>Agorà è un servizio separato dall'app. Il collegamento previsto passa dal {ECOSYSTEM.accountName}, che è facoltativo: non serve per studiare, e niente viene condiviso senza il tuo consenso. Oggi non è attivo.</p>
        </Nota>
      </Sezione>

      <Sezione id="agora-intanto" titolo="Intanto, nell'app">
        <div className="flex flex-col gap-2.5">
          <BottoneAzione onClick={() => vai('faq')}>Leggi la Guida e FAQ</BottoneAzione>
          <BottoneSecondario onClick={apriInviti}>Invita un compagno</BottoneSecondario>
          <BottoneSecondario onClick={() => vai('esplora')}>Torna a Esplora</BottoneSecondario>
        </div>
      </Sezione>
    </Pagina>
  );
}
