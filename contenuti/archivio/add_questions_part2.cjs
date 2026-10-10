const fs = require('fs');
const newQuestions = [
  // Prepositions of Time (2)
  { id: "q160", prompt: "Complete: 'I have known him _____ 2010.'", options: ["since", "for", "from", "in"], correctIndex: 0, explanation: "'Since' indicates a specific starting point in the past.", category: "Grammatica", level: "B1", grammarTopic: "Prepositions of Time" },
  { id: "q161", prompt: "Translate 'Lavorano qui da molti anni.'", options: ["They have worked here for many years.", "They work here since many years.", "They have worked here since many years.", "They work here for many years."], correctIndex: 0, explanation: "'For' is used for a duration.", category: "Traduzione", level: "B1", grammarTopic: "Prepositions of Time" },

  // Present Continuous (9)
  { id: "q162", prompt: "Complete: 'They _____ tennis right now.'", options: ["are playing", "play", "playing", "is playing"], correctIndex: 0, explanation: "Actions happening now use present continuous.", category: "Grammatica", level: "A2", grammarTopic: "Present Continuous" },
  { id: "q163", prompt: "Translate 'Perché stai piangendo?'", options: ["Why are you crying?", "Why do you cry?", "Why you are crying?", "Why you cry?"], correctIndex: 0, explanation: "Question word + are + subject + verb-ing.", category: "Traduzione", level: "A2", grammarTopic: "Present Continuous" },
  { id: "q164", prompt: "Complete: 'I _____ to the doctor tomorrow afternoon.'", options: ["am going", "go", "went", "going"], correctIndex: 0, explanation: "Present continuous is used for arranged future plans.", category: "Grammatica", level: "A2", grammarTopic: "Present Continuous" },
  { id: "q165", prompt: "Translate 'Il sole sta splendendo.'", options: ["The sun is shining.", "The sun shines.", "The sun shining.", "The sun are shining."], correctIndex: 0, explanation: "Action happening now.", category: "Traduzione", level: "A2", grammarTopic: "Present Continuous" },
  { id: "q166", prompt: "Complete: 'Look! The bus _____.'", options: ["is coming", "comes", "coming", "come"], correctIndex: 0, explanation: "'Look!' indicates an action happening at the moment.", category: "Grammatica", level: "A2", grammarTopic: "Present Continuous" },
  { id: "q167", prompt: "Translate 'Non stiamo usando il computer adesso.'", options: ["We aren't using the computer right now.", "We don't use the computer right now.", "We not using the computer right now.", "We isn't using the computer right now."], correctIndex: 0, explanation: "Negative present continuous.", category: "Traduzione", level: "A2", grammarTopic: "Present Continuous" },
  { id: "q168", prompt: "Complete: '_____ he watching TV?'", options: ["Is", "Does", "Are", "Do"], correctIndex: 0, explanation: "Auxiliary 'to be' for third person singular is 'is'.", category: "Grammatica", level: "A2", grammarTopic: "Present Continuous" },
  { id: "q169", prompt: "Translate 'Sto cercando le mie chiavi.'", options: ["I am looking for my keys.", "I look for my keys.", "I am searching my keys.", "I looking for my keys."], correctIndex: 0, explanation: "'Look for' means 'cercare', present continuous for current action.", category: "Traduzione", level: "A2", grammarTopic: "Present Continuous" },
  { id: "q170", prompt: "Complete: 'The kids _____ sleeping in their room.'", options: ["are", "is", "do", "does"], correctIndex: 0, explanation: "Plural subject 'kids' takes 'are'.", category: "Grammatica", level: "A2", grammarTopic: "Present Continuous" },

  // Present Perfect (2)
  { id: "q171", prompt: "Complete: 'I have _____ finished my dinner.'", options: ["already", "yet", "ever", "since"], correctIndex: 0, explanation: "'Already' is used in affirmative sentences for completed actions.", category: "Grammatica", level: "B1", grammarTopic: "Present Perfect" },
  { id: "q172", prompt: "Translate 'È la prima volta che guido una macchina.'", options: ["It's the first time I have driven a car.", "It's the first time I drive a car.", "It's the first time I drove a car.", "It's the first time I am driving a car."], correctIndex: 0, explanation: "'First time' expressions use the present perfect.", category: "Traduzione", level: "B1", grammarTopic: "Present Perfect" },

  // Present Simple (13)
  { id: "q173", prompt: "Complete: 'She _____ coffee every morning.'", options: ["drinks", "drink", "is drinking", "drank"], correctIndex: 0, explanation: "Habits use present simple. Third person adds -s.", category: "Grammatica", level: "A1", grammarTopic: "Present Simple" },
  { id: "q174", prompt: "Translate 'Io lavoro in un ospedale.'", options: ["I work in a hospital.", "I am working in a hospital.", "I works in a hospital.", "I work to a hospital."], correctIndex: 0, explanation: "Permanent situations use present simple.", category: "Traduzione", level: "A1", grammarTopic: "Present Simple" },
  { id: "q175", prompt: "Complete: 'They _____ play tennis on Sundays.'", options: ["don't", "doesn't", "aren't", "isn't"], correctIndex: 0, explanation: "Plural negative present simple uses 'don't'.", category: "Grammatica", level: "A1", grammarTopic: "Present Simple" },
  { id: "q176", prompt: "Translate 'Lui non capisce la domanda.'", options: ["He doesn't understand the question.", "He don't understand the question.", "He isn't understand the question.", "He not understands the question."], correctIndex: 0, explanation: "Third person singular negative uses 'doesn't'.", category: "Traduzione", level: "A1", grammarTopic: "Present Simple" },
  { id: "q177", prompt: "Complete: '_____ you speak English?'", options: ["Do", "Are", "Does", "Is"], correctIndex: 0, explanation: "Question auxiliary for 'you' in present simple is 'do'.", category: "Grammatica", level: "A1", grammarTopic: "Present Simple" },
  { id: "q178", prompt: "Translate 'Cosa significa questa parola?'", options: ["What does this word mean?", "What means this word?", "What do this word mean?", "What is meaning this word?"], correctIndex: 0, explanation: "Question uses 'does' for third person singular ('this word').", category: "Traduzione", level: "A1", grammarTopic: "Present Simple" },
  { id: "q179", prompt: "Complete: 'The sun _____ in the east.'", options: ["rises", "rise", "is rising", "rose"], correctIndex: 0, explanation: "Universal facts use present simple.", category: "Grammatica", level: "A1", grammarTopic: "Present Simple" },
  { id: "q180", prompt: "Translate 'Quante volte vai in palestra?'", options: ["How often do you go to the gym?", "How often you go to the gym?", "How much time do you go to the gym?", "How many times you go to the gym?"], correctIndex: 0, explanation: "'How often' asks about frequency.", category: "Traduzione", level: "A1", grammarTopic: "Present Simple" },
  { id: "q181", prompt: "Complete: 'My brother never _____ his room.'", options: ["cleans", "clean", "is cleaning", "cleaned"], correctIndex: 0, explanation: "Adverbs of frequency are used with present simple.", category: "Grammatica", level: "A1", grammarTopic: "Present Simple" },
  { id: "q182", prompt: "Translate 'Lei ha due gatti e un cane.'", options: ["She has two cats and a dog.", "She have two cats and a dog.", "She is having two cats and a dog.", "She got two cats and a dog."], correctIndex: 0, explanation: "Third person singular of 'have' is 'has'.", category: "Traduzione", level: "A1", grammarTopic: "Present Simple" },
  { id: "q183", prompt: "Complete: 'We _____ like spicy food.'", options: ["don't", "doesn't", "not", "aren't"], correctIndex: 0, explanation: "Negative present simple for 'we'.", category: "Grammatica", level: "A1", grammarTopic: "Present Simple" },
  { id: "q184", prompt: "Translate 'Il film inizia alle 20:30.'", options: ["The movie starts at 8:30 PM.", "The movie is starting at 8:30 PM.", "The movie start at 8:30 PM.", "The movie will starting at 8:30 PM."], correctIndex: 0, explanation: "Timetables use present simple.", category: "Traduzione", level: "A1", grammarTopic: "Present Simple" },
  { id: "q185", prompt: "Complete: 'Does he _____ in London?'", options: ["live", "lives", "living", "lived"], correctIndex: 0, explanation: "After 'does', use the base form of the verb.", category: "Grammatica", level: "A1", grammarTopic: "Present Simple" },

  // Quantifiers (11)
  { id: "q186", prompt: "Complete: 'I have _____ money in my pocket.'", options: ["some", "any", "many", "few"], correctIndex: 0, explanation: "Affirmative uncountable noun uses 'some'.", category: "Grammatica", level: "A1", grammarTopic: "Quantifiers" },
  { id: "q187", prompt: "Translate 'Non ci sono mele.'", options: ["There aren't any apples.", "There aren't some apples.", "There aren't no apples.", "There are any apples."], correctIndex: 0, explanation: "Negative countable uses 'any'.", category: "Traduzione", level: "A1", grammarTopic: "Quantifiers" },
  { id: "q188", prompt: "Complete: 'Do you have _____ questions?'", options: ["any", "some", "much", "little"], correctIndex: 0, explanation: "Questions generally use 'any'.", category: "Grammatica", level: "A1", grammarTopic: "Quantifiers" },
  { id: "q189", prompt: "Translate 'Vorresti del tè?'", options: ["Would you like some tea?", "Would you like any tea?", "Do you like some tea?", "Would you like much tea?"], correctIndex: 0, explanation: "Offers use 'some', not 'any'.", category: "Traduzione", level: "A1", grammarTopic: "Quantifiers" },
  { id: "q190", prompt: "Complete: 'There are only a _____ students in the class.'", options: ["few", "little", "much", "many"], correctIndex: 0, explanation: "'Students' is countable, so 'a few'.", category: "Grammatica", level: "A1", grammarTopic: "Quantifiers" },
  { id: "q191", prompt: "Translate 'Ho pochissimo tempo.'", options: ["I have very little time.", "I have very few time.", "I have much little time.", "I have very small time."], correctIndex: 0, explanation: "'Time' is uncountable, so 'little'.", category: "Traduzione", level: "A1", grammarTopic: "Quantifiers" },
  { id: "q192", prompt: "Complete: 'She reads a _____ of books.'", options: ["lot", "many", "much", "some"], correctIndex: 0, explanation: "The phrase is 'a lot of'.", category: "Grammatica", level: "A1", grammarTopic: "Quantifiers" },
  { id: "q193", prompt: "Translate 'Abbiamo mangiato troppa pizza.'", options: ["We ate too much pizza.", "We ate too many pizza.", "We ate very much pizza.", "We ate a lot pizza."], correctIndex: 0, explanation: "'Pizza' in general is uncountable, so 'too much'.", category: "Traduzione", level: "A1", grammarTopic: "Quantifiers" },
  { id: "q194", prompt: "Complete: 'How _____ apples do you want?'", options: ["many", "much", "some", "any"], correctIndex: 0, explanation: "'Apples' is countable, so 'How many'.", category: "Grammatica", level: "A1", grammarTopic: "Quantifiers" },
  { id: "q195", prompt: "Translate 'Non abbiamo comprato niente.'", options: ["We didn't buy anything.", "We bought anything.", "We didn't buy nothing.", "We didn't buy some."], correctIndex: 0, explanation: "Negative sentence requires 'anything'.", category: "Traduzione", level: "A1", grammarTopic: "Quantifiers" },
  { id: "q196", prompt: "Complete: 'Is there _____ good on TV?'", options: ["anything", "something", "nothing", "everything"], correctIndex: 0, explanation: "Questions generally use 'anything'.", category: "Grammatica", level: "A1", grammarTopic: "Quantifiers" }
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
  console.log('Successfully added Part 2.');
}
