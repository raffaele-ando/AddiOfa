// Prontuario: le regole chiave e le trappole tipiche ricavate dal banco di domande (REPORT.md §4.1).
// Il testo usa *asterischi* per il corsivo, reso dal componente CheatSheet.

export interface CheatSheetRule {
  topic: string;
  rule: string;
  trap?: string;
}

export const cheatSheet: CheatSheetRule[] = [
  {"topic": "Present Perfect / Past Simple", "rule": "Esperienza senza data → *Have you ever been…?*; data o momento concluso (*in 2009, yesterday, last week*) → Past Simple", "trap": "*I have been to Africa in 2009*"},
  {"topic": "for / since", "rule": "*for* + durata (*for ten years*), *since* + punto d'inizio (*since 2015*), sempre con il Present Perfect", "trap": "*I live here since ten years*"},
  {"topic": "Past Simple", "rule": "Dopo *did/didn't* va la forma base", "trap": "*Did you met…?*"},
  {"topic": "Present Simple", "rule": "3ª persona singolare con **-s**; negativa e domanda con *does* + forma base", "trap": "*She don't like* / *Does he works*"},
  {"topic": "Present Continuous", "rule": "Azione in corso adesso; mai con verbi di stato (*think* come opinione, *know*, *like*)", "trap": "*I am knowing*"},
  {"topic": "There is / are", "rule": "*Is there a…?* (singolare), *Are there any…?* (plurale)", "trap": "*There is people*"},
  {"topic": "Quantifiers", "rule": "*much* con i non numerabili, *many* con i numerabili; *some* nelle affermative e nelle offerte, *any* nelle negative e nelle domande", "trap": "*many informations*"},
  {"topic": "Comparativi", "rule": "*-er than* per gli aggettivi corti, *more … than* per quelli lunghi; irregolari *good/better/best*, *bad/worse/worst*", "trap": "*more easy*, *baddest*"},
  {"topic": "Avverbi", "rule": "*well* (non *goodly*), *fast* e *hard* invariati (*hardly* significa \"a malapena\")", "trap": "*He drives fastly*"},
  {"topic": "Modali", "rule": "*must/have to* + forma base, niente *to* dopo i modali, *mustn't* = divieto, *don't have to* = non serve", "trap": "*You must to go*"},
  {"topic": "Deduzione", "rule": "*must be* = sono sicuro che sì, *can't be* = sono sicuro che no, *might be* = forse", "trap": "*It mustn't be him*"},
  {"topic": "Going to", "rule": "Intenzione o previsione basata su un'evidenza (*Look out! He's going to fall*)"},
  {"topic": "First Conditional", "rule": "*If* + present, *will* + verbo", "trap": "*If it will rain*"},
  {"topic": "Second Conditional", "rule": "*If* + past, *would* + verbo; *If I were you*", "trap": "*If I would have*"},
  {"topic": "Third Conditional", "rule": "*If* + had + participio, *would have* + participio", "trap": "*If I would have known*"},
  {"topic": "Passive", "rule": "*be* + participio passato (*was built*)", "trap": "*was build*"},
  {"topic": "Reported speech", "rule": "Nei test fai il *backshift* (*is → was*, *will → would*); *say* (senza \"me\"), *tell someone*", "trap": "*He said me*"},
  {"topic": "Past Perfect", "rule": "L'azione più vecchia di due azioni passate: *had* + participio"},
  {"topic": "Used to", "rule": "*used to* = abitudine passata; *didn't use to*; *be/get used to + -ing* = essere abituato", "trap": "*didn't used to*"},
  {"topic": "Gerundio / infinito", "rule": "*enjoy, avoid, finish, mind, can't stand* + **-ing**; *want, decide, hope, plan* + **to**; *stop/remember/try* cambiano significato", "trap": "*I enjoy to swim*"},
  {"topic": "Relative clauses", "rule": "*who* per le persone, *which* per le cose, *that* per entrambe; *where* per i luoghi; nelle frasi tra virgole niente *that*", "trap": "*the book who*"},
  {"topic": "Question tags", "rule": "Frase positiva → tag negativo e viceversa, stesso ausiliare (*I'm right, aren't I?*)", "trap": "*She didn't go, didn't she?*"},
  {"topic": "Possessivi", "rule": "*my/your/his/her* + nome, *mine/yours/hers* da soli; *'s* per le persone (*Mr Smith's wife*)", "trap": "*the wife of Mr Smith*, *your's*"},
  {"topic": "Preposizioni", "rule": "*at* + ora, *on* + giorno, *in* + mese/anno; *in/on/at* per i luoghi; *between* (due) e *among* (più di due)", "trap": "*on 2009*"},
];
