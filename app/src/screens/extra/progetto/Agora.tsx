// «Agorà» (concept 49 schermate 13-14, 13): la pagina di Project per gli studenti del Politecnico. Dentro AddiOFA non ci sono discussioni né utenti:
// la schermata dice che cos'è e porta al profilo Instagram. Nessun numero di follower (l'app non può conoscerlo).
import { Icona } from '../../../brand/icone/Icona';
import { useExtra } from '../contesto';
import { Pagina, Sezione, Testata } from './comuni';
import { GruppoRighe, Riga } from '../ui';
import { AGORA_URL, ECOSYSTEM } from '../../../config/ecosystem';
import { leggiProgetto } from '../../../lib/progetto/profilo';
import { playTapSound } from '../../../lib/audio';

export default function Agora() {
  const { appState, vai } = useExtra();
  const { profilo } = leggiProgetto(appState);
  const messaggi = profilo?.consensi.comunicazioni === true;
  return (
    <Pagina titolo={ECOSYSTEM.agoraName}>
      <Testata nome="messaggi-supporto" />
      <p data-testo-ok className="mt-3 text-center text-[15px] leading-[22px] text-testo">
        La pagina di Project per gli studenti del Politecnico.
      </p>

      <a href={AGORA_URL} target="_blank" rel="noopener noreferrer" onClick={() => playTapSound()}
        className="brand-premibile mt-5 flex w-full min-h-[52px] items-center justify-center gap-2 rounded-[14px] bg-azione px-4 py-3 text-[16px] font-bold text-azione-su">
        <Icona nome="presentazione" size={20} />Apri su Instagram
      </a>
      <p data-testo-ok className="mt-2 text-center text-[13px] leading-[18px] text-testo-tenue">Si apre Instagram, fuori da AddiOFA. Qui non ci sono commenti.</p>

      <Sezione id="agora-messaggi" titolo="Novità">
        <GruppoRighe etichetta="Novità">
          <Riga icona="email" titolo="Novità da Project e Agorà" onClick={() => vai('projectid')}
            sottotitolo={messaggi ? 'Attive: puoi ritirare il consenso nei tuoi dati.' : 'Disattivate: non hai dato il consenso.'} />
        </GruppoRighe>
      </Sezione>
    </Pagina>
  );
}
