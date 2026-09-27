const fs = require('fs');
const newQuestions = [
  // Modals of Obligation and Advice (18)
  { id: "q343", prompt: "Complete: 'You look tired. You _____ go to bed early.'", options: ["should", "have to", "mustn't", "don't have to"], correctIndex: 0, explanation: "'Should' is used for advice.", category: "Grammatica", level: "A2", grammarTopic: "Modals of Obligation and Advice" },
  { id: "q344", prompt: "Complete: 'In many countries, you _____ wear a seatbelt when driving.'", options: ["have to", "should", "don't have to", "mustn't"], correctIndex: 0, explanation: "'Have to' is used for a strong obligation or law.", category: "Grammatica", level: "A2", grammarTopic: "Modals of Obligation and Advice" },
  { id: "q345", prompt: "Complete: 'Tomorrow is Sunday, so I _____ wake up early.'", options: ["don't have to", "mustn't", "shouldn't", "haven't to"], correctIndex: 0, explanation: "'Don't have to' means it's not necessary (lack of obligation).", category: "Grammatica", level: "A2", grammarTopic: "Modals of Obligation and Advice" },
  { id: "q346", prompt: "Complete: 'You _____ use your phone during the exam! It\\'s forbidden.'", options: ["mustn't", "don't have to", "shouldn't", "haven't to"], correctIndex: 0, explanation: "'Mustn't' means it is strictly prohibited.", category: "Grammatica", level: "A2", grammarTopic: "Modals of Obligation and Advice" },
  { id: "q347", prompt: "Complete: '_____ I wear a suit to the interview?'", options: ["Should", "Must", "Have to", "Do I must"], correctIndex: 0, explanation: "'Should' is common to ask for an opinion or advice.", category: "Grammatica", level: "A2", grammarTopic: "Modals of Obligation and Advice" },
  { id: "q348", prompt: "Complete: 'We have plenty of time. We _____ hurry.'", options: ["don't have to", "mustn't", "shouldn't", "don't must"], correctIndex: 0, explanation: "No obligation to hurry.", category: "Grammatica", level: "A2", grammarTopic: "Modals of Obligation and Advice" },
  { id: "q349", prompt: "Complete: 'You _____ smoke in the hospital.'", options: ["mustn't", "don't have to", "shouldn't", "haven't to"], correctIndex: 0, explanation: "Prohibition.", category: "Grammatica", level: "A2", grammarTopic: "Modals of Obligation and Advice" },
  { id: "q350", prompt: "Complete: 'He _____ wear glasses to read because his eyesight is bad.'", options: ["has to", "should", "musts", "have to"], correctIndex: 0, explanation: "External obligation, third person singular 'has to'.", category: "Grammatica", level: "A2", grammarTopic: "Modals of Obligation and Advice" },
  { id: "q351", prompt: "Complete: 'Do I _____ pay for this ticket now?'", options: ["have to", "must", "should", "had to"], correctIndex: 0, explanation: "Question form for obligation is 'Do/Does ... have to'.", category: "Grammatica", level: "A2", grammarTopic: "Modals of Obligation and Advice" },
  { id: "q352", prompt: "Translate 'Dovresti mangiare più verdure.'", options: ["You should eat more vegetables.", "You must eat more vegetables.", "You have to eat more vegetables.", "You shouldn't eat more vegetables."], correctIndex: 0, explanation: "Advice.", category: "Traduzione", level: "A2", grammarTopic: "Modals of Obligation and Advice" },
  { id: "q353", prompt: "Translate 'Non devi per forza venire se sei stanco.'", options: ["You don't have to come if you're tired.", "You mustn't come if you're tired.", "You shouldn't come if you're tired.", "You haven't to come if you're tired."], correctIndex: 0, explanation: "Lack of obligation.", category: "Traduzione", level: "A2", grammarTopic: "Modals of Obligation and Advice" },
  { id: "q354", prompt: "Translate 'Non devi assolutamente toccare quel filo!'", options: ["You mustn't touch that wire!", "You don't have to touch that wire!", "You shouldn't touch that wire!", "You haven't to touch that wire!"], correctIndex: 0, explanation: "Strong prohibition.", category: "Traduzione", level: "A2", grammarTopic: "Modals of Obligation and Advice" },
  { id: "q355", prompt: "Translate 'Lui deve lavorare fino a tardi oggi.' (obbligo esterno)", options: ["He has to work late today.", "He should work late today.", "He have to work late today.", "He musts work late today."], correctIndex: 0, explanation: "External obligation with 'has to'.", category: "Traduzione", level: "A2", grammarTopic: "Modals of Obligation and Advice" },
  { id: "q356", prompt: "Translate 'Non dovresti bere così tanto caffè.'", options: ["You shouldn't drink so much coffee.", "You mustn't drink so much coffee.", "You don't have to drink so much coffee.", "You haven't to drink so much coffee."], correctIndex: 0, explanation: "Negative advice.", category: "Traduzione", level: "A2", grammarTopic: "Modals of Obligation and Advice" },
  { id: "q357", prompt: "Translate 'Devo togliermi le scarpe?'", options: ["Do I have to take off my shoes?", "Must I to take off my shoes?", "Should I take off my shoes?", "Have I to take off my shoes?"], correctIndex: 0, explanation: "Question about rules/obligation uses 'Do I have to'.", category: "Traduzione", level: "A2", grammarTopic: "Modals of Obligation and Advice" },
  { id: "q358", prompt: "Translate 'Non hai bisogno di pagare, è gratis.'", options: ["You don't have to pay, it's free.", "You mustn't pay, it's free.", "You shouldn't pay, it's free.", "You haven't to pay, it's free."], correctIndex: 0, explanation: "Lack of obligation.", category: "Traduzione", level: "A2", grammarTopic: "Modals of Obligation and Advice" },
  { id: "q359", prompt: "Translate 'Cosa dovrei fare?'", options: ["What should I do?", "What must I do?", "What have I to do?", "What do I do?"], correctIndex: 0, explanation: "Asking for advice.", category: "Traduzione", level: "A2", grammarTopic: "Modals of Obligation and Advice" },
  { id: "q360", prompt: "Translate 'Non devi dire niente a nessuno, è un segreto!'", options: ["You mustn't tell anyone, it's a secret!", "You don't have to tell anyone, it's a secret!", "You shouldn't tell anyone, it's a secret!", "You haven't to tell anyone, it's a secret!"], correctIndex: 0, explanation: "Prohibition.", category: "Traduzione", level: "A2", grammarTopic: "Modals of Obligation and Advice" },

  // Adverbs of Manner (18)
  { id: "q361", prompt: "Complete: 'She speaks English very _____.' (good/well)", options: ["well", "good", "goodly", "welling"], correctIndex: 0, explanation: "'Well' is the adverb form of 'good'.", category: "Grammatica", level: "A2", grammarTopic: "Adverbs of Manner" },
  { id: "q362", prompt: "Complete: 'He drives very _____. It\\'s dangerous!'", options: ["fast", "fastly", "quick", "speedy"], correctIndex: 0, explanation: "'Fast' is both an adjective and an adverb.", category: "Grammatica", level: "A2", grammarTopic: "Adverbs of Manner" },
  { id: "q363", prompt: "Complete: 'Please do your work _____. Take your time.'", options: ["carefully", "careful", "careless", "carelessly"], correctIndex: 0, explanation: "'Carefully' describes how to do the work.", category: "Grammatica", level: "A2", grammarTopic: "Adverbs of Manner" },
  { id: "q364", prompt: "Complete: 'They won the game _____. They were much better.'", options: ["easily", "easy", "easier", "easying"], correctIndex: 0, explanation: "'Easily' is the adverb form of 'easy' (y changes to i + ly).", category: "Grammatica", level: "A2", grammarTopic: "Adverbs of Manner" },
  { id: "q365", prompt: "Complete: 'The old man walked _____ down the street.'", options: ["slowly", "slow", "slower", "slowingly"], correctIndex: 0, explanation: "'Slowly' describes the verb 'walked'.", category: "Grammatica", level: "A2", grammarTopic: "Adverbs of Manner" },
  { id: "q366", prompt: "Complete: 'She looked at him _____ when he broke the glass.'", options: ["angrily", "angry", "angrier", "angrying"], correctIndex: 0, explanation: "Adverb formed from 'angry'.", category: "Grammatica", level: "A2", grammarTopic: "Adverbs of Manner" },
  { id: "q367", prompt: "Complete: 'He worked _____ to pass the exam.'", options: ["hard", "hardly", "harder", "hards"], correctIndex: 0, explanation: "'Hard' is an irregular adverb meaning with effort. ('Hardly' means almost not).", category: "Grammatica", level: "A2", grammarTopic: "Adverbs of Manner" },
  { id: "q368", prompt: "Complete: 'The children were playing _____ in the garden.'", options: ["happily", "happy", "happier", "happiness"], correctIndex: 0, explanation: "Adverb of 'happy'.", category: "Grammatica", level: "A2", grammarTopic: "Adverbs of Manner" },
  { id: "q369", prompt: "Complete: 'I can run very _____.'", options: ["fast", "fastly", "quick", "faster"], correctIndex: 0, explanation: "'Fast' is an irregular adverb.", category: "Grammatica", level: "A2", grammarTopic: "Adverbs of Manner" },
  { id: "q370", prompt: "Translate 'Ha risposto alla domanda velocemente.'", options: ["He answered the question quickly.", "He answered the question quick.", "He answered the question fastly.", "He answered the question quicker."], correctIndex: 0, explanation: "'Velocemente' is 'quickly'.", category: "Traduzione", level: "A2", grammarTopic: "Adverbs of Manner" },
  { id: "q371", prompt: "Translate 'Canta davvero bene.'", options: ["She sings really well.", "She sings really good.", "She sings really goodly.", "She sings really nice."], correctIndex: 0, explanation: "'Bene' is the adverb 'well'.", category: "Traduzione", level: "A2", grammarTopic: "Adverbs of Manner" },
  { id: "q372", prompt: "Translate 'Hanno lavorato duramente tutto il giorno.'", options: ["They worked hard all day.", "They worked hardly all day.", "They worked difficultly all day.", "They worked heavy all day."], correctIndex: 0, explanation: "'Duramente' (con fatica) is 'hard'.", category: "Traduzione", level: "A2", grammarTopic: "Adverbs of Manner" },
  { id: "q373", prompt: "Translate 'Per favore, parla lentamente.'", options: ["Please, speak slowly.", "Please, speak slow.", "Please, speak slower.", "Please, speak slowingly."], correctIndex: 0, explanation: "'Lentamente' is 'slowly'.", category: "Traduzione", level: "A2", grammarTopic: "Adverbs of Manner" },
  { id: "q374", prompt: "Translate 'Ha chiuso la porta silenziosamente.'", options: ["He closed the door quietly.", "He closed the door quiet.", "He closed the door quietlyly.", "He closed the door silent."], correctIndex: 0, explanation: "'Silenziosamente' is 'quietly'.", category: "Traduzione", level: "A2", grammarTopic: "Adverbs of Manner" },
  { id: "q375", prompt: "Translate 'Hanno risolto il problema facilmente.'", options: ["They solved the problem easily.", "They solved the problem easy.", "They solved the problem with easy.", "They solved the problem easier."], correctIndex: 0, explanation: "'Facilmente' is 'easily'.", category: "Traduzione", level: "A2", grammarTopic: "Adverbs of Manner" },
  { id: "q376", prompt: "Translate 'Guida sempre con molta attenzione (attentamente).'", options: ["He always drives carefully.", "He always drives careful.", "He always drives care.", "He always drives with careful."], correctIndex: 0, explanation: "'Attentamente' is 'carefully'.", category: "Traduzione", level: "A2", grammarTopic: "Adverbs of Manner" },
  { id: "q377", prompt: "Translate 'L\\'insegnante ha spiegato la regola chiaramente.'", options: ["The teacher explained the rule clearly.", "The teacher explained the rule clear.", "The teacher explained the rule cleary.", "The teacher explained the rule clearing."], correctIndex: 0, explanation: "'Chiaramente' is 'clearly'.", category: "Traduzione", level: "A2", grammarTopic: "Adverbs of Manner" },
  { id: "q378", prompt: "Translate 'Ho capito perfettamente.'", options: ["I understood perfectly.", "I understood perfect.", "I understood perfection.", "I understood perfectlyly."], correctIndex: 0, explanation: "'Perfettamente' is 'perfectly'.", category: "Traduzione", level: "A2", grammarTopic: "Adverbs of Manner" }
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
  console.log('Successfully added New Part 4.');
}
