const fs = require('fs');
const newQuestions = [
  // Possessives (18)
  { id: "q217", prompt: "Complete: 'This is not my pen. It is _____.'", options: ["yours", "your", "you", "yours'"], correctIndex: 0, explanation: "Pronoun 'yours' replaces 'your pen'.", category: "Grammatica", level: "A1", grammarTopic: "Possessives" },
  { id: "q218", prompt: "Complete: '_____ car is parked outside.'", options: ["Her", "Hers", "She", "Hers'"], correctIndex: 0, explanation: "Adjective 'Her' describes the car.", category: "Grammatica", level: "A1", grammarTopic: "Possessives" },
  { id: "q219", prompt: "Complete: 'That house is _____.' (of us)", options: ["ours", "our", "we", "us"], correctIndex: 0, explanation: "Pronoun 'ours' replaces 'our house'.", category: "Grammatica", level: "A1", grammarTopic: "Possessives" },
  { id: "q220", prompt: "Complete: 'Is this book _____?' (of him)", options: ["his", "him", "he", "his'"], correctIndex: 0, explanation: "Pronoun 'his' indicates possession by a male.", category: "Grammatica", level: "A1", grammarTopic: "Possessives" },
  { id: "q221", prompt: "Complete: 'These are _____ shoes.'", options: ["my", "mine", "me", "I"], correctIndex: 0, explanation: "Adjective 'my' modifies shoes.", category: "Grammatica", level: "A1", grammarTopic: "Possessives" },
  { id: "q222", prompt: "Complete: 'The dog is wagging _____ tail.'", options: ["its", "it's", "it", "its'"], correctIndex: 0, explanation: "'Its' is the possessive adjective for animals/things without an apostrophe.", category: "Grammatica", level: "A1", grammarTopic: "Possessives" },
  { id: "q223", prompt: "Complete: 'Are those keys _____?' (of them)", options: ["theirs", "their", "them", "they"], correctIndex: 0, explanation: "Pronoun 'theirs' replaces 'their keys'.", category: "Grammatica", level: "A1", grammarTopic: "Possessives" },
  { id: "q224", prompt: "Complete: 'I lost _____ keys yesterday.'", options: ["my", "mine", "me", "I"], correctIndex: 0, explanation: "Possessive adjective 'my' comes before the noun.", category: "Grammatica", level: "A1", grammarTopic: "Possessives" },
  { id: "q225", prompt: "Complete: 'This laptop is _____, not yours.'", options: ["mine", "my", "me", "I"], correctIndex: 0, explanation: "Pronoun 'mine' replaces 'my laptop'.", category: "Grammatica", level: "A1", grammarTopic: "Possessives" },
  { id: "q226", prompt: "Translate 'Questo libro è mio.'", options: ["This book is mine.", "This book is my.", "This book is me.", "This book is I."], correctIndex: 0, explanation: "'Mio' at the end of the sentence is the pronoun 'mine'.", category: "Traduzione", level: "A1", grammarTopic: "Possessives" },
  { id: "q227", prompt: "Translate 'La loro casa è molto grande.'", options: ["Their house is very big.", "Theirs house is very big.", "They house is very big.", "Them house is very big."], correctIndex: 0, explanation: "'Loro' as an adjective before a noun is 'their'.", category: "Traduzione", level: "A1", grammarTopic: "Possessives" },
  { id: "q228", prompt: "Translate 'Quella è la tua giacca, non la sua (di lei).'", options: ["That is your jacket, not hers.", "That is your jacket, not her.", "That is yours jacket, not hers.", "That is your jacket, not she."], correctIndex: 0, explanation: "'La sua' without the noun is the pronoun 'hers'.", category: "Traduzione", level: "A1", grammarTopic: "Possessives" },
  { id: "q229", prompt: "Translate 'I nostri amici stanno arrivando.'", options: ["Our friends are coming.", "Ours friends are coming.", "We friends are coming.", "Us friends are coming."], correctIndex: 0, explanation: "'Nostri' before the noun is 'our'.", category: "Traduzione", level: "A1", grammarTopic: "Possessives" },
  { id: "q230", prompt: "Translate 'Questi soldi sono vostri?'", options: ["Is this money yours?", "Is this money your?", "Are these money yours?", "Is this money you?"], correctIndex: 0, explanation: "Money is uncountable singular, 'vostri' as a pronoun is 'yours'.", category: "Traduzione", level: "A1", grammarTopic: "Possessives" },
  { id: "q231", prompt: "Translate 'Il suo (di lui) telefono è nuovo.'", options: ["His phone is new.", "Him phone is new.", "He phone is new.", "His' phone is new."], correctIndex: 0, explanation: "'Suo' for a male is 'his'.", category: "Traduzione", level: "A1", grammarTopic: "Possessives" },
  { id: "q232", prompt: "Translate 'La mia macchina è rossa, la sua (di lui) è blu.'", options: ["My car is red, his is blue.", "My car is red, him is blue.", "Mine car is red, his is blue.", "My car is red, he is blue."], correctIndex: 0, explanation: "'La sua' as a pronoun for a male is 'his'.", category: "Traduzione", level: "A1", grammarTopic: "Possessives" },
  { id: "q233", prompt: "Translate 'Ho dimenticato il mio ombrello.'", options: ["I forgot my umbrella.", "I forgot mine umbrella.", "I forgot me umbrella.", "I forgot I umbrella."], correctIndex: 0, explanation: "'Il mio' before the noun is 'my'.", category: "Traduzione", level: "A1", grammarTopic: "Possessives" },
  { id: "q234", prompt: "Translate 'Quelle penne sono loro (di loro).'", options: ["Those pens are theirs.", "Those pens are their.", "Those pens are them.", "Those pens are they."], correctIndex: 0, explanation: "'Loro' as a pronoun is 'theirs'.", category: "Traduzione", level: "A1", grammarTopic: "Possessives" },

  // Object Pronouns (18)
  { id: "q235", prompt: "Complete: 'I call _____ every day.' (him/he/his/himself)", options: ["him", "he", "his", "himself"], correctIndex: 0, explanation: "'Him' is the object pronoun for a male.", category: "Grammatica", level: "A1", grammarTopic: "Object Pronouns" },
  { id: "q236", prompt: "Complete: 'She loves _____ very much.' (me/I/my/mine)", options: ["me", "I", "my", "mine"], correctIndex: 0, explanation: "'Me' is the object pronoun for first person singular.", category: "Grammatica", level: "A1", grammarTopic: "Object Pronouns" },
  { id: "q237", prompt: "Complete: 'Can you help _____ with this exercise?' (us/we/our/ours)", options: ["us", "we", "our", "ours"], correctIndex: 0, explanation: "'Us' is the object pronoun for 'we'.", category: "Grammatica", level: "A1", grammarTopic: "Object Pronouns" },
  { id: "q238", prompt: "Complete: 'I don\\'t know _____.' (them/they/their/theirs)", options: ["them", "they", "their", "theirs"], correctIndex: 0, explanation: "'Them' is the object pronoun for 'they'.", category: "Grammatica", level: "A1", grammarTopic: "Object Pronouns" },
  { id: "q239", prompt: "Complete: 'Look at _____!' (her/she/hers/herself)", options: ["her", "she", "hers", "herself"], correctIndex: 0, explanation: "'Her' is the object pronoun after the preposition 'at'.", category: "Grammatica", level: "A1", grammarTopic: "Object Pronouns" },
  { id: "q240", prompt: "Complete: 'He wants to speak to _____.' (you/your/yours/yourself)", options: ["you", "your", "yours", "yourself"], correctIndex: 0, explanation: "'You' is the object pronoun.", category: "Grammatica", level: "A1", grammarTopic: "Object Pronouns" },
  { id: "q241", prompt: "Complete: 'Give _____ to me.' (it/its/it\\'s/itself)", options: ["it", "its", "it's", "itself"], correctIndex: 0, explanation: "'It' is the object pronoun for things/animals.", category: "Grammatica", level: "A1", grammarTopic: "Object Pronouns" },
  { id: "q242", prompt: "Complete: 'My parents are visiting _____.' (me/I/my/mine)", options: ["me", "I", "my", "mine"], correctIndex: 0, explanation: "'Me' receives the action of visiting.", category: "Grammatica", level: "A1", grammarTopic: "Object Pronouns" },
  { id: "q243", prompt: "Complete: 'Are you listening to _____?' (him/he/his/himself)", options: ["him", "he", "his", "himself"], correctIndex: 0, explanation: "'Him' follows the preposition 'to'.", category: "Grammatica", level: "A1", grammarTopic: "Object Pronouns" },
  { id: "q244", prompt: "Translate 'Non lo capisco.' (di lui)", options: ["I don't understand him.", "I don't understand he.", "I don't understand his.", "I don't understand it."], correctIndex: 0, explanation: "'Lo' referring to a man translates to 'him'.", category: "Traduzione", level: "A1", grammarTopic: "Object Pronouns" },
  { id: "q245", prompt: "Translate 'Puoi vederci?'", options: ["Can you see us?", "Can you see we?", "Can you see our?", "Can you see me?"], correctIndex: 0, explanation: "'Ci' translates to the object pronoun 'us'.", category: "Traduzione", level: "A1", grammarTopic: "Object Pronouns" },
  { id: "q246", prompt: "Translate 'Le ho comprato un regalo.' (a lei)", options: ["I bought her a present.", "I bought she a present.", "I bought hers a present.", "I bought for her a present."], correctIndex: 0, explanation: "'Le' (to her) is translated with the object pronoun 'her'.", category: "Traduzione", level: "A1", grammarTopic: "Object Pronouns" },
  { id: "q247", prompt: "Translate 'Li aspetto qui.'", options: ["I wait for them here.", "I wait for they here.", "I wait them here.", "I am waiting they here."], correctIndex: 0, explanation: "'Li' (them) follows the preposition 'for' in English.", category: "Traduzione", level: "A1", grammarTopic: "Object Pronouns" },
  { id: "q248", prompt: "Translate 'Dammi quel libro.'", options: ["Give me that book.", "Give I that book.", "Give my that book.", "Give to me that book."], correctIndex: 0, explanation: "'Dammi' uses the object pronoun 'me'.", category: "Traduzione", level: "A1", grammarTopic: "Object Pronouns" },
  { id: "q249", prompt: "Translate 'Non ti credo.'", options: ["I don't believe you.", "I don't believe your.", "I don't believe to you.", "I not believe you."], correctIndex: 0, explanation: "'Ti' is the object pronoun 'you'.", category: "Traduzione", level: "A1", grammarTopic: "Object Pronouns" },
  { id: "q250", prompt: "Translate 'Lo voglio adesso.' (un oggetto)", options: ["I want it now.", "I want him now.", "I want that now.", "I want this now."], correctIndex: 0, explanation: "'Lo' for a thing is 'it'.", category: "Traduzione", level: "A1", grammarTopic: "Object Pronouns" },
  { id: "q251", prompt: "Translate 'Vieni con noi al cinema?'", options: ["Are you coming with us to the cinema?", "Are you coming with we to the cinema?", "Do you come with us to the cinema?", "Are you coming to us to the cinema?"], correctIndex: 0, explanation: "'Con noi' uses the object pronoun 'us'.", category: "Traduzione", level: "A1", grammarTopic: "Object Pronouns" },
  { id: "q252", prompt: "Translate 'Non li conosco.'", options: ["I don't know them.", "I don't know they.", "I don't know their.", "I not know them."], correctIndex: 0, explanation: "'Li' is the object pronoun 'them'.", category: "Traduzione", level: "A1", grammarTopic: "Object Pronouns" },

  // Demonstratives (9 of 18)
  { id: "q253", prompt: "Complete: '_____ is my friend, Paul.' (near)", options: ["This", "These", "Those", "That"], correctIndex: 0, explanation: "'This' is used for a singular person/thing near the speaker.", category: "Grammatica", level: "A1", grammarTopic: "Demonstratives" },
  { id: "q254", prompt: "Complete: 'Look at _____ birds in the sky.'", options: ["those", "that", "this", "these"], correctIndex: 0, explanation: "'Those' is used for plural things far from the speaker.", category: "Grammatica", level: "A1", grammarTopic: "Demonstratives" },
  { id: "q255", prompt: "Complete: 'Are _____ your shoes here?'", options: ["these", "this", "that", "those"], correctIndex: 0, explanation: "'These' is used for plural things near the speaker.", category: "Grammatica", level: "A1", grammarTopic: "Demonstratives" },
  { id: "q256", prompt: "Complete: '_____ building over there is a hospital.'", options: ["That", "This", "These", "Those"], correctIndex: 0, explanation: "'That' is used for a singular thing far away.", category: "Grammatica", level: "A1", grammarTopic: "Demonstratives" },
  { id: "q257", prompt: "Complete: '_____ days are the best of my life.'", options: ["These", "This", "That", "Those"], correctIndex: 0, explanation: "'These' refers to plural days in the current time.", category: "Grammatica", level: "A1", grammarTopic: "Demonstratives" },
  { id: "q258", prompt: "Complete: 'I don\\'t like _____ kind of music.' (near/current)", options: ["this", "these", "those", "them"], correctIndex: 0, explanation: "'This kind' is singular.", category: "Grammatica", level: "A1", grammarTopic: "Demonstratives" },
  { id: "q259", prompt: "Complete: 'Did you buy _____ apples from the market?' (far/past)", options: ["those", "that", "this", "them"], correctIndex: 0, explanation: "'Those apples' refers to plural items away or in the past.", category: "Grammatica", level: "A1", grammarTopic: "Demonstratives" },
  { id: "q260", prompt: "Complete: '_____ is a very interesting book.' (holding it)", options: ["This", "These", "Those", "Them"], correctIndex: 0, explanation: "'This' refers to a singular item being held.", category: "Grammatica", level: "A1", grammarTopic: "Demonstratives" },
  { id: "q261", prompt: "Complete: 'Can you pass me _____ pen?' (far)", options: ["that", "those", "these", "this"], correctIndex: 0, explanation: "'That' refers to a singular item out of reach.", category: "Grammatica", level: "A1", grammarTopic: "Demonstratives" }
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
  console.log('Successfully added New Part 1.');
}
