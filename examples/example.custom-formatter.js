const strif = require('../strif');

const formatter = strif.create({
    transformers: {
        date: s => new Date(s),
        lds: d => d.toLocaleString()
    }
});

let template = formatter
    .template('[{time}] {user} - {message}')
    .prop('user', { accessor: 'user.name' })
    .prop('time', { transformers: [`date`, `lds`] });

let result = template.compile({
    time: 11223322,
    message: 'This is a super long message ',
    user: { name: 'Bob' }
});

console.log(result);