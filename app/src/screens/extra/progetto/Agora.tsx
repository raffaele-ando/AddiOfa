// «Agorà» (concept 49 schermate 13-14, 13): la pagina di Project per gli studenti del Politecnico. Dentro AddiOFA non ci sono discussioni né utenti:
// la schermata dice che cos'è e porta al profilo Instagram. Nessun numero di follower (l'app non può conoscerlo).
import { Icona } from '../../../brand/icone/Icona';
import { useExtra } from '../contesto';
import { Nota, Pagina, Sezione, Testata } from './comuni';
import { AGORA_HANDLE, AGORA_URL, ECOSYSTEM, FRASE_PROJECT } from '../../../config/ecosystem';
import { playTapSound } from '../../../lib/audio';

export default function Agora() {
  const { vai } = useExtra();
  return (
    <Pagina titolo={ECOSYSTEM.agoraName}>
      <Testata nome="messaggi-supporto" lato={140} />
      <p data-testo-ok className="mt-3 text-center text-[15px] leading-[22px] text-testo">
        Agorà è la pagina di Project per gli studenti del Politecnico di Milano: idee, domande e confronto.
      </p>

      <a href={AGORA_URL} target="_blank" rel="noopener noreferrer" onClick={() => playTapSound()}
        className="brand-premibile mt-5 flex w-full min-h-[52px] items-center justify-center gap-2 rounded-[13px] bg-azione px-4 py-3 text-[16px] font-bold text-azione-su">
        <Icona nome="presentazione" size={20} />Apri Instagram · {AGORA_HANDLE}
      </a>

      <Sezione id="agora-qui" titolo="In AddiOFA">
        <Nota tono="neutro">
          <p data-testo-ok>Qui non ci sono discussioni, commenti o utenti: Agorà vive sul suo profilo Instagram.</p>
          <p data-testo-ok className="mt-1 font-bold">Esci da AddiOFA: aprendo Instagram valgono le sue regole.</p>
        </Nota>
      </Sezione>

      <Sezione id="agora-messaggi" titolo="Messaggi">
        <button type="button" onClick={() => { playTapSound(); vai('projectid'); }}
          className="brand-premibile flex w-full items-center gap-3 rounded-[14px] bg-superficie-2 p-3.5 text-left">
          <Icona nome="email" size={22} className="shrink-0 text-medio-numero" />
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] leading-[20px] font-bold text-testo">Da Project e Agorà</span>
            <span data-testo-ok className="block text-[13px] leading-[18px] text-testo-tenue">Facoltativi: se li vuoi, li scegli in Project ID. Qui nessuna casella.</span>
          </span>
          <Icona nome="avanti" size={22} className="shrink-0 text-testo-tenue" />
        </button>
      </Sezione>

      <p data-testo-ok className="mt-6 text-center text-[12.5px] leading-[18px] text-testo-tenue">{FRASE_PROJECT}</p>
    </Pagina>
  );
}
