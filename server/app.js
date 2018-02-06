const express = require('express');
const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const os = require('os');
const body = require('body-parser');
const csvjson = require('csvjson');
const app = express();

//app.use(bodyParser.json());

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.csv'), { flags: 'a' });

csv.write([['Agent', 'Time', 'Method', 'Resource', 'Version', 'Status'], []], { headers: false, delimiter: ',' }).pipe(accessLogStream);
//^^^create a csv file named 'log.csv' & assign the headers '"Agent...Status", delimiter seperates aray items by comma and enters them into their own "cell"

app.use((req, res, next) => {
    // write your logging code here

    var user = [     //get data from the headers, info gathered from Morgan GitHub Source Code
        req.get('User-Agent').replace(',', ''),     //gets AGENT
        new Date().toISOString(),                   //DATE
        req.method,                                 //METHOD
        req.url,                                    //URL
        'HTTP/' + req.httpVersionMajor + '.' + req.httpVersionMinor,    //VERSION
        res.statusCode + '\n'].join(',');           //STATUS /n = new line
    console.log(user);                            //proof of function

    fs.appendFile('server/log.csv', user, function (err) {      //appending 'user' array to headers in csv file
        if (err) throw err;
        //console.log('The "data to append" was appended to file!');
        next();
    });

});

app.get('/', (req, res) => {
    // write your code to respond "ok" here
    res.send('ok');
    //console.log('ok');
    var user = [                                    //get data from the headers, info gathered from Morgan GitHub Source Code
        req.get('User-Agent').replace(',', ' '),    //gets AGENT
        new Date().toISOString(),                   //DATE
        req.method,                                 //METHOD
        req.url,                                   //URL
        'HTTP/' + req.httpVersionMajor + '.' + req.httpVersionMinor,    //VERSION
        res.statusCode + '\n'].join(',');           //STATUS

        res.send(user)
       
});

app.get('/logs', (req, res, next) => {
    // write your code to return a json object containing the log data here
    var data = fs.readFileSync(path.join(__dirname, 'log.csv'), { encoding: 'utf8' });

    var options = {
        delimiter: ',', // optional
        quote: '"' // optional
    };

    var data2 = csvjson.toObject(data, options);
    res.json(data2);
   // console.log(data2);

    next();



});






module.exports = app;
