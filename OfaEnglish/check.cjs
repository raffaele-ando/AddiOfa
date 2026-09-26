const fs = require('fs');
const content = fs.readFileSync('src/data/questions.ts', 'utf8').toLowerCase();
const lines = [
  "is she going", // for is she going/gone/go with friends
  "came to the party", 
  "much modern", // for New York is more much modern
  "away since", // Tom is away he's been away since Monday
  "bus leaves in 2 minutes",
  "ever been to Brasil"
];
for (let l of lines) {
  console.log(l, ": ", content.includes(l.toLowerCase()));
}
