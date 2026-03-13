const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('SELF ASSSESMENT QUETIONAIRE (4).pdf');

pdf(dataBuffer).then(function (data) {
    console.log(data.text);
});
