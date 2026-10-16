# NOTE-03 (agente CONV-03)

Convertite 41 domande su 41 (q176-q265), tutte a completamento con un solo spazio `_____`. `patch-03.json` è JSON valido, con tutti gli id dell'ingresso. Posizioni della risposta giusta: 11 / 10 / 10 / 10 (0-3), mai la stessa posizione tre volte di fila.

## Domande cambiate molto
- Prompt senza apostrofi (`did not`, `will`, `do not`), perché il prompt è già tra apici singoli. Gli apostrofi restano solo nelle opzioni e nelle spiegazioni.
- q198, q202, q215: hanno una struttura diversa dalla vecchia frase. q198 ora verifica 'are' contro 'do/does/have' (le altre parole interrogative davano frasi ambigue). q202 tiene 'How' contro 'Who/What/Which'. q215 chiede 'Are there' contro 'Does/Do/Have there'.
- q204: tolti 'Which' e 'What bag' (corretti in inglese); ora 'Whose' contro 'Who/Whom/Who's'.
- q209: tolto 'is' (il parlato 'There is three chairs' è diffuso); distrattori 'have/has/do'.
- q213: aggiunto 'When I arrived yesterday' per fissare il passato.
- q228, q231, q232, q234, q244-q252: aggiunto un contesto breve (Anna, Tom, i vicini, la sorella) perché il pronome giusto sia l'unico possibile senza la frase italiana.
- q189: tolti 'any' e 'a' (accettabili nelle offerte). q195: tolto 'something' (accettabile nella frase negativa). q182: tolto 'got'.
- Dimostrativi q262-q265: la distanza non si può dedurre dalla sola frase, quindi ho messo un indizio nel contesto e tolto dalle opzioni i dimostrativi che sarebbero stati accettabili ('That' per q262/q264, 'Those' per q265). La domanda verifica soprattutto il numero (singolare/plurale) più la vicinanza.

## Dubbi residui
- q200: 'What/How is your birthday?' erano accettabili nel parlato, quindi le opzioni sono When / Where / Who / Why: distrattori molto facili.
- q209: 'do' come distrattore è debole, ma gli altri avrebbero dato una seconda risposta possibile.
- q232 e q231 verificano lo stesso possessivo 'his' (uno aggettivo, uno pronome), come nell'originale.
- q198 e q202 hanno distrattori poco «da studente italiano» perché le alternative realistiche erano accettabili.
- q213: 'wasn't' ('there wasn't nobody') è doppia negazione non standard, ma in alcuni dialetti inglesi è usata; un revisore severo potrebbe obiettare.
- q187: 'no' ('There are not no apples') è sbagliato nello standard per la doppia negazione.
