const ejs = require('ejs-cli');

ejs.render({
    file: 'views/list.ejs',
    out: 'build/index.html'
});