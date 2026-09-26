const fs = require('fs');
const newQuestions = [
  // Future: going to (18)
  { id: "q307", prompt: "Complete: 'I _____ to visit my grandparents this weekend.'", options: ["am going", "go", "going", "will going"], correctIndex: 0, explanation: "We use 'am going to' for planned future intentions.", category: "Grammatica", level: "A2", grammarTopic: "Future: going to" },
  { id: "q308", prompt: "Complete: 'Look at those dark clouds. It _____ rain.'", options: ["is going to", "will", "going to", "rains"], correctIndex: 0, explanation: "'Going to' is used when there is present evidence for a future event.", category: "Grammatica", level: "A2", grammarTopic: "Future: going to" },
  { id: "q309", prompt: "Complete: 'What _____ you going to do tonight?'", options: ["are", "do", "is", "will"], correctIndex: 0, explanation: "Question form requires the verb 'to be' (are) before the subject.", category: "Grammatica", level: "A2", grammarTopic: "Future: going to" },
  { id: "q310", prompt: "Complete: 'She _____ not going to buy a new car.'", options: ["is", "does", "has", "will"], correctIndex: 0, explanation: "Negative form uses 'to be' + not + going to.", category: "Grammatica", level: "A2", grammarTopic: "Future: going to" },
  { id: "q311", prompt: "Complete: 'We are going to _____ a movie after dinner.'", options: ["watch", "watching", "watched", "watches"], correctIndex: 0, explanation: "'Going to' is followed by the base form of the verb.", category: "Grammatica", level: "A2", grammarTopic: "Future: going to" },
  { id: "q312", prompt: "Complete: '_____ he going to invite her to the party?'", options: ["Is", "Does", "Will", "Has"], correctIndex: 0, explanation: "Question form for third person singular uses 'Is'.", category: "Grammatica", level: "A2", grammarTopic: "Future: going to" },
  { id: "q313", prompt: "Complete: 'They _____ going to start a new business next year.'", options: ["are", "will", "do", "have"], correctIndex: 0, explanation: "Plural subject takes 'are'.", category: "Grammatica", level: "A2", grammarTopic: "Future: going to" },
  { id: "q314", prompt: "Complete: 'I\\'m going to _____ English in London.'", options: ["study", "studying", "studied", "studies"], correctIndex: 0, explanation: "Base verb 'study' after 'going to'.", category: "Grammatica", level: "A2", grammarTopic: "Future: going to" },
  { id: "q315", prompt: "Complete: 'My parents are _____ to travel to Spain.'", options: ["going", "go", "will", "goes"], correctIndex: 0, explanation: "Part of the structure 'are going to'.", category: "Grammatica", level: "A2", grammarTopic: "Future: going to" },
  { id: "q316", prompt: "Translate 'Cosa hai intenzione di fare?'", options: ["What are you going to do?", "What will you do?", "What do you do?", "What you are going to do?"], correctIndex: 0, explanation: "'Have intention to' is translated with 'going to'.", category: "Traduzione", level: "A2", grammarTopic: "Future: going to" },
  { id: "q317", prompt: "Translate 'Non ho intenzione di aspettare tutto il giorno.'", options: ["I am not going to wait all day.", "I don't go to wait all day.", "I won't to wait all day.", "I am not going to waiting all day."], correctIndex: 0, explanation: "Negative 'going to'.", category: "Traduzione", level: "A2", grammarTopic: "Future: going to" },
  { id: "q318", prompt: "Translate 'Lui studierà medicina all\\'università.' (intenzione)", options: ["He is going to study medicine at university.", "He will study medicine at university.", "He is studying medicine at university.", "He studies medicine at university."], correctIndex: 0, explanation: "Intentions use 'going to'.", category: "Traduzione", level: "A2", grammarTopic: "Future: going to" },
  { id: "q319", prompt: "Translate 'Stiamo per comprare una nuova casa.' (abbiamo deciso)", options: ["We are going to buy a new house.", "We will buy a new house.", "We are buying a new house.", "We buy a new house."], correctIndex: 0, explanation: "Decisions already made use 'going to'.", category: "Traduzione", level: "A2", grammarTopic: "Future: going to" },
  { id: "q320", prompt: "Translate 'Pioverà a breve.' (guardando il cielo scuro)", options: ["It is going to rain soon.", "It will rain soon.", "It is raining soon.", "It rains soon."], correctIndex: 0, explanation: "Prediction based on evidence uses 'going to'.", category: "Traduzione", level: "A2", grammarTopic: "Future: going to" },
  { id: "q321", prompt: "Translate 'Non parteciperanno all\\'incontro.' (intenzione)", options: ["They aren't going to attend the meeting.", "They won't attend the meeting.", "They don't attend the meeting.", "They aren't attending the meeting."], correctIndex: 0, explanation: "Negative intention.", category: "Traduzione", level: "A2", grammarTopic: "Future: going to" },
  { id: "q322", prompt: "Translate 'Cosa mangerai a cena?' (che programmi hai)", options: ["What are you going to eat for dinner?", "What will you eat for dinner?", "What do you eat for dinner?", "What you going to eat for dinner?"], correctIndex: 0, explanation: "Asking about plans.", category: "Traduzione", level: "A2", grammarTopic: "Future: going to" },
  { id: "q323", prompt: "Translate 'Venderà la sua macchina?' (ha intenzione di)", options: ["Is she going to sell her car?", "Will she sell her car?", "Does she sell her car?", "Is she sell her car?"], correctIndex: 0, explanation: "Question about intention.", category: "Traduzione", level: "A2", grammarTopic: "Future: going to" },
  { id: "q324", prompt: "Translate 'Sono certo che cadrà!' (sta correndo sul ghiaccio)", options: ["I'm sure he is going to fall!", "I'm sure he will fall!", "I'm sure he falls!", "I'm sure he falling!"], correctIndex: 0, explanation: "Prediction with evidence.", category: "Traduzione", level: "A2", grammarTopic: "Future: going to" },

  // Past Continuous (18)
  { id: "q325", prompt: "Complete: 'I _____ TV when the phone rang.'", options: ["was watching", "watched", "am watching", "were watching"], correctIndex: 0, explanation: "Past continuous for a long action interrupted by a short one.", category: "Grammatica", level: "A2", grammarTopic: "Past Continuous" },
  { id: "q326", prompt: "Complete: 'While she was reading, her brother _____ video games.'", options: ["was playing", "played", "playing", "is playing"], correctIndex: 0, explanation: "Two long actions happening at the same time in the past.", category: "Grammatica", level: "A2", grammarTopic: "Past Continuous" },
  { id: "q327", prompt: "Complete: 'What _____ you doing at 8 PM yesterday?'", options: ["were", "was", "are", "did"], correctIndex: 0, explanation: "'You' takes the auxiliary 'were' in the past continuous.", category: "Grammatica", level: "A2", grammarTopic: "Past Continuous" },
  { id: "q328", prompt: "Complete: 'They were walking in the park when it started to _____.'", options: ["rain", "raining", "rained", "rains"], correctIndex: 0, explanation: "'Started' is followed by the infinitive 'to rain' or gerund 'raining', but here 'to' is provided, so 'rain'.", category: "Grammatica", level: "A2", grammarTopic: "Past Continuous" },
  { id: "q329", prompt: "Complete: 'He _____ (not) listening to the teacher.'", options: ["wasn't", "weren't", "didn't", "isn't"], correctIndex: 0, explanation: "'He' takes 'wasn't' in negative past continuous.", category: "Grammatica", level: "A2", grammarTopic: "Past Continuous" },
  { id: "q330", prompt: "Complete: 'While I _____ home, I saw a car accident.'", options: ["was driving", "drove", "am driving", "was drive"], correctIndex: 0, explanation: "Continuous action in the past ('while' often signals continuous).", category: "Grammatica", level: "A2", grammarTopic: "Past Continuous" },
  { id: "q331", prompt: "Complete: 'We were having dinner when the lights _____ out.'", options: ["went", "were going", "go", "gone"], correctIndex: 0, explanation: "The interrupting action is in the past simple ('went').", category: "Grammatica", level: "A2", grammarTopic: "Past Continuous" },
  { id: "q332", prompt: "Complete: '_____ it raining when you left?'", options: ["Was", "Were", "Did", "Is"], correctIndex: 0, explanation: "'It' takes 'was'.", category: "Grammatica", level: "A2", grammarTopic: "Past Continuous" },
  { id: "q333", prompt: "Complete: 'I broke my leg while I _____ football.'", options: ["was playing", "played", "am playing", "play"], correctIndex: 0, explanation: "Long background action in past continuous.", category: "Grammatica", level: "A2", grammarTopic: "Past Continuous" },
  { id: "q334", prompt: "Translate 'Cosa stavi facendo quando ti ho chiamato?'", options: ["What were you doing when I called you?", "What did you do when I called you?", "What was you doing when I called you?", "What are you doing when I called you?"], correctIndex: 0, explanation: "Question in past continuous, interrupting action in past simple.", category: "Traduzione", level: "A2", grammarTopic: "Past Continuous" },
  { id: "q335", prompt: "Translate 'Stavo dormendo quando l\\'allarme ha suonato.'", options: ["I was sleeping when the alarm rang.", "I slept when the alarm was ringing.", "I was sleeping when the alarm was ringing.", "I slept when the alarm rang."], correctIndex: 0, explanation: "Background action (sleeping), interruption (rang).", category: "Traduzione", level: "A2", grammarTopic: "Past Continuous" },
  { id: "q336", prompt: "Translate 'Mentre camminavamo, abbiamo trovato dei soldi.'", options: ["While we were walking, we found some money.", "While we walked, we were finding some money.", "When we were walking, we were finding some money.", "While we walking, we found some money."], correctIndex: 0, explanation: "'While' + past continuous, then past simple.", category: "Traduzione", level: "A2", grammarTopic: "Past Continuous" },
  { id: "q337", prompt: "Translate 'Lei non stava guardando la TV, stava leggendo.'", options: ["She wasn't watching TV, she was reading.", "She didn't watch TV, she was reading.", "She wasn't watching TV, she read.", "She wasn't watch TV, she was reading."], correctIndex: 0, explanation: "Both actions are past continuous.", category: "Traduzione", level: "A2", grammarTopic: "Past Continuous" },
  { id: "q338", prompt: "Translate 'Mentre cucinavo, lui ascoltava la musica.'", options: ["While I was cooking, he was listening to music.", "While I cooked, he listened to music.", "While I was cooking, he listened to music.", "While I cooked, he was listening to music."], correctIndex: 0, explanation: "Two simultaneous long actions usually take past continuous.", category: "Traduzione", level: "A2", grammarTopic: "Past Continuous" },
  { id: "q339", prompt: "Translate 'Pioveva forte ieri mattina?'", options: ["Was it raining hard yesterday morning?", "Did it rain hard yesterday morning?", "Were it raining hard yesterday morning?", "Is it raining hard yesterday morning?"], correctIndex: 0, explanation: "Asking about a progressive state at a specific time in the past.", category: "Traduzione", level: "A2", grammarTopic: "Past Continuous" },
  { id: "q340", prompt: "Translate 'Non stavamo andando troppo veloci.'", options: ["We weren't going too fast.", "We didn't go too fast.", "We wasn't going too fast.", "We aren't going too fast."], correctIndex: 0, explanation: "Negative past continuous with 'were'.", category: "Traduzione", level: "A2", grammarTopic: "Past Continuous" },
  { id: "q341", prompt: "Translate 'Cosa pensavi in quel momento?'", options: ["What were you thinking at that moment?", "What did you think at that moment?", "What was you thinking at that moment?", "What are you thinking at that moment?"], correctIndex: 0, explanation: "Asking about ongoing thoughts at a past moment.", category: "Traduzione", level: "A2", grammarTopic: "Past Continuous" },
  { id: "q342", prompt: "Translate 'Loro ridevano quando sono entrato.'", options: ["They were laughing when I entered.", "They laughed when I was entering.", "They were laughing when I was entering.", "They laughed when I entered."], correctIndex: 0, explanation: "Background action (laughing), short interruption (entered).", category: "Traduzione", level: "A2", grammarTopic: "Past Continuous" }
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
  console.log('Successfully added New Part 3.');
}
