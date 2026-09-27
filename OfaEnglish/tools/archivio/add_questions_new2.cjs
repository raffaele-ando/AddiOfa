const fs = require('fs');
const newQuestions = [
  // Demonstratives Translation (9)
  { id: "q262", prompt: "Translate 'Questo è il mio gatto.'", options: ["This is my cat.", "That is my cat.", "These is my cat.", "Those is my cat."], correctIndex: 0, explanation: "'Questo' is 'This'.", category: "Traduzione", level: "A1", grammarTopic: "Demonstratives" },
  { id: "q263", prompt: "Translate 'Quelli sono i miei libri.'", options: ["Those are my books.", "That are my books.", "These are my books.", "This are my books."], correctIndex: 0, explanation: "'Quelli' (far plural) is 'Those'.", category: "Traduzione", level: "A1", grammarTopic: "Demonstratives" },
  { id: "q264", prompt: "Translate 'Questa pizza è buonissima.'", options: ["This pizza is very good.", "That pizza is very good.", "These pizza is very good.", "It pizza is very good."], correctIndex: 0, explanation: "'Questa' is 'This'.", category: "Traduzione", level: "A1", grammarTopic: "Demonstratives" },
  { id: "q265", prompt: "Translate 'Queste ragazze sono italiane.'", options: ["These girls are Italian.", "This girls are Italian.", "Those girls are Italian.", "That girls are Italian."], correctIndex: 0, explanation: "'Queste' (near plural) is 'These'.", category: "Traduzione", level: "A1", grammarTopic: "Demonstratives" },
  { id: "q266", prompt: "Translate 'Quell\\'uomo è mio padre.'", options: ["That man is my father.", "This man is my father.", "Those man is my father.", "The man is my father."], correctIndex: 0, explanation: "'Quell'' (far singular) is 'That'.", category: "Traduzione", level: "A1", grammarTopic: "Demonstratives" },
  { id: "q267", prompt: "Translate 'Cosa sono quelle cose?'", options: ["What are those things?", "What are these things?", "What is that things?", "What are that things?"], correctIndex: 0, explanation: "'Quelle' (far plural) is 'those'.", category: "Traduzione", level: "A1", grammarTopic: "Demonstratives" },
  { id: "q268", prompt: "Translate 'Preferisco questo vestito.'", options: ["I prefer this dress.", "I prefer that dress.", "I prefer these dress.", "I prefer those dress."], correctIndex: 0, explanation: "'Questo' is 'this'.", category: "Traduzione", level: "A1", grammarTopic: "Demonstratives" },
  { id: "q269", prompt: "Translate 'Conosci quelle persone?'", options: ["Do you know those people?", "Do you know these people?", "Do you know that people?", "Do you know this people?"], correctIndex: 0, explanation: "'Quelle' (far plural) is 'those'.", category: "Traduzione", level: "A1", grammarTopic: "Demonstratives" },
  { id: "q270", prompt: "Translate 'Questi sono i miei appunti.'", options: ["These are my notes.", "This are my notes.", "Those are my notes.", "That are my notes."], correctIndex: 0, explanation: "'Questi' (near plural) is 'These'.", category: "Traduzione", level: "A1", grammarTopic: "Demonstratives" },

  // Prepositions of Place (18)
  { id: "q271", prompt: "Complete: 'The cat is hiding _____ the bed.'", options: ["under", "in", "on", "at"], correctIndex: 0, explanation: "'Under' means below or beneath.", category: "Grammatica", level: "A1", grammarTopic: "Prepositions of Place" },
  { id: "q272", prompt: "Complete: 'She is waiting _____ the bus stop.'", options: ["at", "in", "on", "under"], correctIndex: 0, explanation: "Use 'at' for a specific point or location.", category: "Grammatica", level: "A1", grammarTopic: "Prepositions of Place" },
  { id: "q273", prompt: "Complete: 'The picture is hanging _____ the wall.'", options: ["on", "in", "at", "under"], correctIndex: 0, explanation: "Use 'on' for surfaces.", category: "Grammatica", level: "A1", grammarTopic: "Prepositions of Place" },
  { id: "q274", prompt: "Complete: 'He lives _____ London.'", options: ["in", "at", "on", "by"], correctIndex: 0, explanation: "Use 'in' for cities, countries, and enclosed spaces.", category: "Grammatica", level: "A1", grammarTopic: "Prepositions of Place" },
  { id: "q275", prompt: "Complete: 'The car is parked _____ the house.'", options: ["behind", "under", "in", "on"], correctIndex: 0, explanation: "'Behind' means at the back of.", category: "Grammatica", level: "A1", grammarTopic: "Prepositions of Place" },
  { id: "q276", prompt: "Complete: 'She sat _____ her two best friends.'", options: ["between", "next to", "under", "in"], correctIndex: 0, explanation: "'Between' is used for a position separating two things or people.", category: "Grammatica", level: "A1", grammarTopic: "Prepositions of Place" },
  { id: "q277", prompt: "Complete: 'The bank is _____ the post office.'", options: ["next to", "in", "on", "at"], correctIndex: 0, explanation: "'Next to' means beside.", category: "Grammatica", level: "A1", grammarTopic: "Prepositions of Place" },
  { id: "q278", prompt: "Complete: 'There is a bridge _____ the river.'", options: ["over", "under", "in", "at"], correctIndex: 0, explanation: "'Over' means extending directly upwards from or across.", category: "Grammatica", level: "A1", grammarTopic: "Prepositions of Place" },
  { id: "q279", prompt: "Complete: 'I left my keys _____ the table.'", options: ["on", "in", "at", "between"], correctIndex: 0, explanation: "'On' is used for surfaces.", category: "Grammatica", level: "A1", grammarTopic: "Prepositions of Place" },
  { id: "q280", prompt: "Translate 'Il cane è sotto il tavolo.'", options: ["The dog is under the table.", "The dog is on the table.", "The dog is at the table.", "The dog is in the table."], correctIndex: 0, explanation: "'Sotto' translates to 'under'.", category: "Traduzione", level: "A1", grammarTopic: "Prepositions of Place" },
  { id: "q281", prompt: "Translate 'Sono al cinema.'", options: ["I am at the cinema.", "I am in the cinema.", "I am on the cinema.", "I am to the cinema."], correctIndex: 0, explanation: "'At' is used for specific places like the cinema.", category: "Traduzione", level: "A1", grammarTopic: "Prepositions of Place" },
  { id: "q282", prompt: "Translate 'C\\'è un ragno sul soffitto.'", options: ["There is a spider on the ceiling.", "There is a spider at the ceiling.", "There is a spider in the ceiling.", "There is a spider under the ceiling."], correctIndex: 0, explanation: "'Sul' for a surface like a ceiling is 'on'.", category: "Traduzione", level: "A1", grammarTopic: "Prepositions of Place" },
  { id: "q283", prompt: "Translate 'L\\'ufficio è vicino alla banca.'", options: ["The office is next to the bank.", "The office is in the bank.", "The office is between the bank.", "The office is at the bank."], correctIndex: 0, explanation: "'Vicino a' is 'next to' or 'near'.", category: "Traduzione", level: "A1", grammarTopic: "Prepositions of Place" },
  { id: "q284", prompt: "Translate 'Il bambino è tra i suoi genitori.'", options: ["The child is between his parents.", "The child is among his parents.", "The child is next to his parents.", "The child is in his parents."], correctIndex: 0, explanation: "'Tra' due persone è 'between'.", category: "Traduzione", level: "A1", grammarTopic: "Prepositions of Place" },
  { id: "q285", prompt: "Translate 'Nasconditi dietro la porta.'", options: ["Hide behind the door.", "Hide under the door.", "Hide next to the door.", "Hide in the door."], correctIndex: 0, explanation: "'Dietro' is 'behind'.", category: "Traduzione", level: "A1", grammarTopic: "Prepositions of Place" },
  { id: "q286", prompt: "Translate 'Metti i vestiti nell\\'armadio.'", options: ["Put the clothes in the wardrobe.", "Put the clothes on the wardrobe.", "Put the clothes at the wardrobe.", "Put the clothes into the wardrobe."], correctIndex: 0, explanation: "'Nel' meaning inside an enclosed space is 'in'.", category: "Traduzione", level: "A1", grammarTopic: "Prepositions of Place" },
  { id: "q287", prompt: "Translate 'Ho incontrato Marco alla stazione.'", options: ["I met Marco at the station.", "I met Marco in the station.", "I met Marco on the station.", "I met Marco to the station."], correctIndex: 0, explanation: "'Alla' for a specific point is 'at'.", category: "Traduzione", level: "A1", grammarTopic: "Prepositions of Place" },
  { id: "q288", prompt: "Translate 'C\\'è un giardino dietro la casa.'", options: ["There is a garden behind the house.", "There is a garden under the house.", "There is a garden in the house.", "There is a garden next to the house."], correctIndex: 0, explanation: "'Dietro' is 'behind'.", category: "Traduzione", level: "A1", grammarTopic: "Prepositions of Place" },

  // Imperative (18)
  { id: "q289", prompt: "Complete: '_____ to me carefully.'", options: ["Listen", "Listening", "Listens", "To listen"], correctIndex: 0, explanation: "Imperative uses the base form of the verb.", category: "Grammatica", level: "A1", grammarTopic: "Imperative" },
  { id: "q290", prompt: "Complete: '_____ open the window. It\\'s cold.'", options: ["Don't", "Not", "No", "Doesn't"], correctIndex: 0, explanation: "Negative imperative uses 'Don't'.", category: "Grammatica", level: "A1", grammarTopic: "Imperative" },
  { id: "q291", prompt: "Complete: '_____ your vegetables!'", options: ["Eat", "Eating", "Eats", "To eat"], correctIndex: 0, explanation: "Use base verb for direct commands.", category: "Grammatica", level: "A1", grammarTopic: "Imperative" },
  { id: "q292", prompt: "Complete: '_____ be late for the meeting.'", options: ["Don't", "Not", "Doesn't", "No"], correctIndex: 0, explanation: "Negative commands always start with 'Don't'.", category: "Grammatica", level: "A1", grammarTopic: "Imperative" },
  { id: "q293", prompt: "Complete: '_____ quiet, please.'", options: ["Be", "Are", "Is", "Am"], correctIndex: 0, explanation: "Base form of 'to be' is used for commands.", category: "Grammatica", level: "A1", grammarTopic: "Imperative" },
  { id: "q294", prompt: "Complete: '_____ touch that plate, it\\'s hot.'", options: ["Don't", "No", "Not", "Doesn't"], correctIndex: 0, explanation: "Negative command.", category: "Grammatica", level: "A1", grammarTopic: "Imperative" },
  { id: "q295", prompt: "Complete: '_____ your homework before dinner.'", options: ["Do", "Does", "Doing", "Did"], correctIndex: 0, explanation: "Base verb 'Do'.", category: "Grammatica", level: "A1", grammarTopic: "Imperative" },
  { id: "q296", prompt: "Complete: '_____ me the salt, please.'", options: ["Pass", "Passing", "Passes", "To pass"], correctIndex: 0, explanation: "Base verb 'Pass'.", category: "Grammatica", level: "A1", grammarTopic: "Imperative" },
  { id: "q297", prompt: "Complete: '_____ worry about it.'", options: ["Don't", "Not", "No", "Doesn't"], correctIndex: 0, explanation: "Negative command.", category: "Grammatica", level: "A1", grammarTopic: "Imperative" },
  { id: "q298", prompt: "Translate 'Non toccare il mio telefono.'", options: ["Don't touch my phone.", "Not touch my phone.", "No touch my phone.", "Doesn't touch my phone."], correctIndex: 0, explanation: "Negative imperative is formed with 'Don't'.", category: "Traduzione", level: "A1", grammarTopic: "Imperative" },
  { id: "q299", prompt: "Translate 'Fai attenzione!'", options: ["Pay attention!", "Do attention!", "Make attention!", "Attention you!"], correctIndex: 0, explanation: "'Fare attenzione' is 'pay attention'.", category: "Traduzione", level: "A1", grammarTopic: "Imperative" },
  { id: "q300", prompt: "Translate 'Ascoltami quando parlo.'", options: ["Listen to me when I speak.", "Listen me when I speak.", "Hear me when I speak.", "Hear to me when I speak."], correctIndex: 0, explanation: "'Ascoltare' requires 'to' before the object in English.", category: "Traduzione", level: "A1", grammarTopic: "Imperative" },
  { id: "q301", prompt: "Translate 'Non dimenticare le chiavi.'", options: ["Don't forget your keys.", "Not forget your keys.", "No forget your keys.", "Don't missing your keys."], correctIndex: 0, explanation: "Negative command with 'Don't'.", category: "Traduzione", level: "A1", grammarTopic: "Imperative" },
  { id: "q302", prompt: "Translate 'Chiudi la porta, per favore.'", options: ["Close the door, please.", "Closing the door, please.", "To close the door, please.", "You close the door, please."], correctIndex: 0, explanation: "Base verb for command.", category: "Traduzione", level: "A1", grammarTopic: "Imperative" },
  { id: "q303", prompt: "Translate 'Non parlare durante l\\'esame.'", options: ["Don't speak during the exam.", "Not speak during the exam.", "Doesn't speak during the exam.", "Don't speaking during the exam."], correctIndex: 0, explanation: "Negative command.", category: "Traduzione", level: "A1", grammarTopic: "Imperative" },
  { id: "q304", prompt: "Translate 'Aspetta qui un momento.'", options: ["Wait here a moment.", "Waiting here a moment.", "Wait here a time.", "Stay here a moment."], correctIndex: 0, explanation: "Base verb 'Wait'.", category: "Traduzione", level: "A1", grammarTopic: "Imperative" },
  { id: "q305", prompt: "Translate 'Scrivete i vostri nomi sul foglio.'", options: ["Write your names on the paper.", "Writing your names on the paper.", "You write your names on the paper.", "To write your names on the paper."], correctIndex: 0, explanation: "Imperative is the same for singular and plural 'you'.", category: "Traduzione", level: "A1", grammarTopic: "Imperative" },
  { id: "q306", prompt: "Translate 'Non fumare in questa stanza.'", options: ["Don't smoke in this room.", "No smoking in this room.", "Not smoke in this room.", "Doesn't smoke in this room."], correctIndex: 0, explanation: "'Don't smoke' is the imperative. ('No smoking' is a sign/rule but the direct translation uses 'Don't').", category: "Traduzione", level: "A1", grammarTopic: "Imperative" }
];

const content = fs.readFileSync('src/data/questions.ts', 'utf-8');
const lastBracketIndex = content.lastIndexOf('];');

if (lastBracketIndex !== -1) {
  let newContent = content.substring(0, lastBracketIndex);
  if (!newContent.trim().endsWith(',')) newContent += ',\n';
  
  newQuestions.forEach((q, index) => {
    newContent += `  {
    id: "${q.id}",
    prompt: "${q.prompt.replace(/"/g, '\\"')}",
    options: [
      "${q.options[0].replace(/"/g, '\\"')}",
      "${q.options[1].replace(/"/g, '\\"')}",
      "${q.options[2].replace(/"/g, '\\"')}",
      "${q.options[3].replace(/"/g, '\\"')}"
    ],
    correctIndex: ${q.correctIndex},
    explanation: "${q.explanation.replace(/"/g, '\\"')}",
    category: "${q.category}",
    level: "${q.level}",
    grammarTopic: "${q.grammarTopic}"
  }`;
    if (index < newQuestions.length - 1) newContent += ',\n';
    else newContent += '\n';
  });
  
  newContent += '];\n';
  fs.writeFileSync('src/data/questions.ts', newContent);
  console.log('Successfully added New Part 2.');
}
