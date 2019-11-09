const strif = require('../strif');

let data = {
    time: '10-10-2019',
    user: 'keff',
    message: 'What time is it?'
};

let template = strif.template('[{time}] {user} {message}');
template.compile(data);

// Or better
let result = strif.compile('[{time}] {user} - {message}', data);
console.log(result);