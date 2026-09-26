const fs = require('fs');
const newQuestions = [
  // Comparatives and Superlatives (8)
  { id: "q117", prompt: "Translate 'Questo è il libro più lungo che abbia mai letto.'", options: ["This is the longest book I have ever read.", "This is the most long book I have ever read.", "This is the longer book I have ever read.", "This is longest book I have ever read."], correctIndex: 0, explanation: "Superlative of short adjectives takes -est.", category: "Traduzione", level: "A2", grammarTopic: "Comparatives and Superlatives" },
  { id: "q118", prompt: "Complete: 'My car is _____ than yours.'", options: ["faster", "more fast", "fastest", "the fastest"], correctIndex: 0, explanation: "Comparative of fast is faster.", category: "Grammatica", level: "A2", grammarTopic: "Comparatives and Superlatives" },
  { id: "q119", prompt: "Translate 'Oggi è molto più caldo di ieri.'", options: ["Today is much hotter than yesterday.", "Today is much more hot than yesterday.", "Today is very hotter than yesterday.", "Today is hotter that yesterday."], correctIndex: 0, explanation: "'much' emphasizes the comparative 'hotter'.", category: "Traduzione", level: "A2", grammarTopic: "Comparatives and Superlatives" },
  { id: "q120", prompt: "Complete: 'She is the _____ student in the class.'", options: ["best", "better", "most good", "goodest"], correctIndex: 0, explanation: "Irregular superlative of good is best.", category: "Grammatica", level: "A2", grammarTopic: "Comparatives and Superlatives" },
  { id: "q121", prompt: "Translate 'Sua sorella è meno socievole di lui.'", options: ["His sister is less outgoing than him.", "His sister is least outgoing than him.", "His sister is not outgoing than him.", "His sister is minor outgoing than him."], correctIndex: 0, explanation: "Less + adjective + than is used for inferior comparatives.", category: "Traduzione", level: "A2", grammarTopic: "Comparatives and Superlatives" },
  { id: "q122", prompt: "Complete: 'This exercise is _____ difficult than the previous one.'", options: ["more", "much", "most", "very"], correctIndex: 0, explanation: "Long adjectives use 'more' for comparative.", category: "Grammatica", level: "A2", grammarTopic: "Comparatives and Superlatives" },
  { id: "q123", prompt: "Translate 'Questo è il posto meno costoso in città.'", options: ["This is the least expensive place in town.", "This is the less expensive place in town.", "This is the not expensive place in town.", "This is the most cheap place in town."], correctIndex: 0, explanation: "Superlative of inferiority is 'the least'.", category: "Traduzione", level: "A2", grammarTopic: "Comparatives and Superlatives" },
  { id: "q124", prompt: "Complete: 'He is _____ taller than his brother.'", options: ["slightly", "a little of", "few", "small"], correctIndex: 0, explanation: "You can modify comparatives with words like slightly, much, a lot.", category: "Grammatica", level: "A2", grammarTopic: "Comparatives and Superlatives" },

  // First Conditional (11)
  { id: "q125", prompt: "Complete: 'If I have time, I _____ you.'", options: ["will help", "help", "would help", "helped"], correctIndex: 0, explanation: "First conditional: if + present, will + base verb.", category: "Grammatica", level: "B1", grammarTopic: "First Conditional" },
  { id: "q126", prompt: "Translate 'Se lei studierà, passerà il test.'", options: ["If she studies, she will pass the test.", "If she will study, she will pass the test.", "If she study, she will pass the test.", "If she studied, she will pass the test."], correctIndex: 0, explanation: "Present simple in the if clause, will in the main clause.", category: "Traduzione", level: "B1", grammarTopic: "First Conditional" },
  { id: "q127", prompt: "Complete: 'We won\\'t go to the park if it _____.'", options: ["rains", "will rain", "rain", "raining"], correctIndex: 0, explanation: "If clause uses present simple.", category: "Grammatica", level: "B1", grammarTopic: "First Conditional" },
  { id: "q128", prompt: "Translate 'Cosa dirai se lui ti chiamerà?'", options: ["What will you say if he calls you?", "What do you say if he will call you?", "What will you say if he will call you?", "What would you say if he calls you?"], correctIndex: 0, explanation: "Question form: Wh- word + will + subject + verb + if + present simple.", category: "Traduzione", level: "B1", grammarTopic: "First Conditional" },
  { id: "q129", prompt: "Complete: 'If they don\\'t hurry, they _____ the bus.'", options: ["will miss", "miss", "would miss", "missed"], correctIndex: 0, explanation: "Main clause uses will.", category: "Grammatica", level: "B1", grammarTopic: "First Conditional" },
  { id: "q130", prompt: "Translate 'Se non mi aiuti, non finirò il progetto.'", options: ["If you don't help me, I won't finish the project.", "If you won't help me, I don't finish the project.", "If you not help me, I won't finish the project.", "If you didn't help me, I won't finish the project."], correctIndex: 0, explanation: "Negative present simple in if clause, won't in main clause.", category: "Traduzione", level: "B1", grammarTopic: "First Conditional" },
  { id: "q131", prompt: "Complete: 'If she _____ the job, she will move to London.'", options: ["gets", "get", "will get", "got"], correctIndex: 0, explanation: "Third person singular needs 's' in present simple.", category: "Grammatica", level: "B1", grammarTopic: "First Conditional" },
  { id: "q132", prompt: "Translate 'Gli parlerò se lo vedo.'", options: ["I will talk to him if I see him.", "I talk to him if I will see him.", "I will talk to him if I will see him.", "I would talk to him if I see him."], correctIndex: 0, explanation: "Will in main clause, present in if clause.", category: "Traduzione", level: "B1", grammarTopic: "First Conditional" },
  { id: "q133", prompt: "Complete: 'Unless you _____, you won\\'t succeed.'", options: ["try", "will try", "don't try", "tried"], correctIndex: 0, explanation: "Unless means 'if not', so it's followed by an affirmative verb.", category: "Grammatica", level: "B1", grammarTopic: "First Conditional" },
  { id: "q134", prompt: "Translate 'A meno che non piova, andremo a fare una passeggiata.'", options: ["Unless it rains, we will go for a walk.", "Unless it doesn't rain, we will go for a walk.", "If it unless rains, we will go for a walk.", "Unless it will rain, we will go for a walk."], correctIndex: 0, explanation: "Unless is followed by affirmative present simple.", category: "Traduzione", level: "B1", grammarTopic: "First Conditional" },
  { id: "q135", prompt: "Complete: 'I will buy that car if it _____ too expensive.'", options: ["isn't", "won't be", "doesn't be", "aren't"], correctIndex: 0, explanation: "Verb 'to be' in present simple negative for third person singular.", category: "Grammatica", level: "B1", grammarTopic: "First Conditional" },

  // General (12)
  { id: "q136", prompt: "Complete: 'I usually go to bed _____ 11 PM.'", options: ["at", "in", "on", "by"], correctIndex: 0, explanation: "Use 'at' for specific times.", category: "Grammatica", level: "A1", grammarTopic: "General" },
  { id: "q137", prompt: "Translate 'Non mi piace il caffè.'", options: ["I don't like coffee.", "I'm not like coffee.", "I doesn't like coffee.", "I not like coffee."], correctIndex: 0, explanation: "Present simple negative for I/you/we/they uses 'don't'.", category: "Traduzione", level: "A1", grammarTopic: "General" },
  { id: "q138", prompt: "Complete: 'They _____ to Paris next weekend.'", options: ["are going", "go", "went", "have gone"], correctIndex: 0, explanation: "Present continuous can be used for arranged future plans.", category: "Grammatica", level: "A2", grammarTopic: "General" },
  { id: "q139", prompt: "Translate 'Posso aiutarti?'", options: ["Can I help you?", "Do I can help you?", "Am I help you?", "May I helping you?"], correctIndex: 0, explanation: "Modal verbs like 'can' don't use 'do' in questions.", category: "Traduzione", level: "A1", grammarTopic: "General" },
  { id: "q140", prompt: "Complete: 'She is interested _____ learning Spanish.'", options: ["in", "on", "at", "about"], correctIndex: 0, explanation: "The adjective 'interested' is followed by the preposition 'in'.", category: "Grammatica", level: "B1", grammarTopic: "General" },
  { id: "q141", prompt: "Translate 'Dobbiamo andare ora.'", options: ["We must go now.", "We have go now.", "We are must go now.", "We need going now."], correctIndex: 0, explanation: "'Must' is followed by the base form of the verb.", category: "Traduzione", level: "A2", grammarTopic: "General" },
  { id: "q142", prompt: "Complete: 'I look forward _____ from you soon.'", options: ["to hearing", "to hear", "hearing", "hear"], correctIndex: 0, explanation: "'Look forward to' is followed by the -ing form (gerund).", category: "Grammatica", level: "B1", grammarTopic: "General" },
  { id: "q143", prompt: "Translate 'Ero molto stanco ieri sera.'", options: ["I was very tired last night.", "I am very tired last night.", "I had very tired last night.", "I were very tired last night."], correctIndex: 0, explanation: "Past simple of 'to be' for 'I' is 'was'.", category: "Traduzione", level: "A1", grammarTopic: "General" },
  { id: "q144", prompt: "Complete: 'This is the book _____ I borrowed from the library.'", options: ["which", "who", "where", "what"], correctIndex: 0, explanation: "Relative pronoun 'which' or 'that' is used for things.", category: "Grammatica", level: "B1", grammarTopic: "General" },
  { id: "q145", prompt: "Translate 'Lei sa nuotare molto bene.'", options: ["She can swim very well.", "She can swims very well.", "She knows swim very well.", "She knows to swim very well."], correctIndex: 0, explanation: "Ability is expressed with 'can' + base verb.", category: "Traduzione", level: "A1", grammarTopic: "General" },
  { id: "q146", prompt: "Complete: 'You _____ smoke in the hospital.'", options: ["mustn't", "don't have to", "needn't", "aren't"], correctIndex: 0, explanation: "'Mustn't' expresses prohibition.", category: "Grammatica", level: "A2", grammarTopic: "General" },
  { id: "q147", prompt: "Translate 'Non ho abbastanza soldi.'", options: ["I don't have enough money.", "I have not enough money.", "I don't have money enough.", "I haven't enough money."], correctIndex: 0, explanation: "Present simple negative uses 'don't have', 'enough' comes before nouns.", category: "Traduzione", level: "A2", grammarTopic: "General" },

  // Possessive S (12)
  { id: "q148", prompt: "Complete: 'That is _____ jacket.' (The jacket belongs to Tom)", options: ["Tom's", "Toms'", "Tom", "Toms"], correctIndex: 0, explanation: "Add 's to singular names.", category: "Grammatica", level: "A1", grammarTopic: "Possessive S" },
  { id: "q149", prompt: "Translate 'La casa dei miei nonni è grande.'", options: ["My grandparents' house is big.", "My grandparent's house is big.", "The house of my grandparents is big.", "My grandparents house is big."], correctIndex: 0, explanation: "Plural nouns ending in -s just take an apostrophe.", category: "Traduzione", level: "A1", grammarTopic: "Possessive S" },
  { id: "q150", prompt: "Complete: 'I love _____ new song.' (The song of the band)", options: ["the band's", "the bands'", "the band", "the bands"], correctIndex: 0, explanation: "Singular noun 'band' takes 's.", category: "Grammatica", level: "A1", grammarTopic: "Possessive S" },
  { id: "q151", prompt: "Translate 'I giocattoli dei bambini sono sparsi ovunque.'", options: ["The children's toys are everywhere.", "The childrens' toys are everywhere.", "The children toys are everywhere.", "The toys of children are everywhere."], correctIndex: 0, explanation: "Irregular plurals not ending in -s take 's.", category: "Traduzione", level: "A1", grammarTopic: "Possessive S" },
  { id: "q152", prompt: "Complete: 'This is _____ desk.' (The desk belongs to the boss)", options: ["the boss's", "the boss'", "the boss", "the bosses"], correctIndex: 0, explanation: "Singular nouns ending in -s usually take 's.", category: "Grammatica", level: "A1", grammarTopic: "Possessive S" },
  { id: "q153", prompt: "Translate 'La macchina di James è blu.'", options: ["James's car is blue.", "James car is blue.", "The car of James is blue.", "Jame's car is blue."], correctIndex: 0, explanation: "Names ending in -s can take 's or just an apostrophe. 'James's' is common.", category: "Traduzione", level: "A1", grammarTopic: "Possessive S" },
  { id: "q154", prompt: "Complete: 'I went to the _____.' (The shop of the baker)", options: ["baker's", "bakers'", "baker", "bakers"], correctIndex: 0, explanation: "Possessive form is often used alone for shops/businesses.", category: "Grammatica", level: "A1", grammarTopic: "Possessive S" },
  { id: "q155", prompt: "Translate 'È il compleanno di mia madre.'", options: ["It's my mother's birthday.", "It's the birthday of my mother.", "It's my mothers birthday.", "It's my mother birthday."], correctIndex: 0, explanation: "Possessive 's for people.", category: "Traduzione", level: "A1", grammarTopic: "Possessive S" },
  { id: "q156", prompt: "Complete: 'We are meeting at _____.' (The house of Paul)", options: ["Paul's", "Pauls'", "Paul", "Pauls"], correctIndex: 0, explanation: "Possessive form is often used alone for people's houses.", category: "Grammatica", level: "A1", grammarTopic: "Possessive S" },
  { id: "q157", prompt: "Translate 'Le scarpe da donna sono al secondo piano.'", options: ["Women's shoes are on the second floor.", "Womens' shoes are on the second floor.", "Woman's shoes are on the second floor.", "Women shoes are on the second floor."], correctIndex: 0, explanation: "Irregular plural 'women' takes 's.", category: "Traduzione", level: "A1", grammarTopic: "Possessive S" },
  { id: "q158", prompt: "Complete: 'The _____ room is down the hall.' (The room for teachers)", options: ["teachers'", "teacher's", "teachers", "teacher"], correctIndex: 0, explanation: "Plural 'teachers' takes an apostrophe after the s.", category: "Grammatica", level: "A1", grammarTopic: "Possessive S" },
  { id: "q159", prompt: "Translate 'Hai visto le chiavi di Anna?'", options: ["Have you seen Anna's keys?", "Have you seen the keys of Anna?", "Have you seen Annas keys?", "Have you seen Anna keys?"], correctIndex: 0, explanation: "Singular name takes 's.", category: "Traduzione", level: "A1", grammarTopic: "Possessive S" }
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
  console.log('Successfully added Part 1.');
}
