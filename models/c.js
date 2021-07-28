const levenshtein = require('fast-levenshtein');

let distance = levenshtein.get('back', 'book');

console.log(distance)