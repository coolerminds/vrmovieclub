// deployTest.js
const express = require('express');
const app = express();
const port = 3000; // !!! WARNING YOU MUST CONFIGURE THIS CORRECTLY !!!
const host = '127.0.0.1';
let count = 0; // Visit count
let startDate = new Date(); // Server start Date time
let yourName = "Harjot Singh";
let netId = "PB3778";
let curDate = new Date();

app.use(express.static('public'));
const nunjucks = require('nunjucks');
nunjucks.configure('templates', {
    autoescape: true,
    express: app
});


let info = { host: host, port: port, name: yourName, netId: netId, startDate: startDate, curDate: curDate, count: count }

app.get('/', function(req, res) {
    info.count++;
    res.render('base.njk', info);
});

app.get('/uptime', function(req, res) {
    info.curDate = new Date();
    res.render('uptime.njk', info);
})

app.listen(port, host, function() {
    console.log(`deployTest.js app listening on IPv4: ${host}:${port}`);
});