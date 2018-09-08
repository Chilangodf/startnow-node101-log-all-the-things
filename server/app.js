const express = require('express');
const fs = require('fs');
const app = express();

app.use((req, res, next) => {
    // write your logging code here
    let agent = '\n' + req.headers['user-agent'].replace(',', '') + ',';
    let time = new Date().toISOString() + ',';
    let method = req.method + ',';
    let resource = req.url + ',';
    let version = 'HTTP/' + req.httpVersion + ',';
    let status = res.statusCode + '';
    let saved = (agent + time + method + resource + version + status);

    fs.appendFile('log.csv', saved, (err) => {
        if (err) throw err;
        console.log(saved);

        next();
    });
});

app.get('/', (req, res, next) => {
    // write your code to respond "ok" here
    res.send('ok')
});



app.get('/logs', (req, res) => {
    // write your code to return a json object containing the log data here
    fs.readFile('log.csv', 'utf-8', function (err, data) {
        console.log('test', csvJSON(data))
        
        function csvJSON(csv) {
            let lines = csv.split("\n");
            //console.log('lines:::', lines.length);
            let result = [];
            let headers = lines[0].split(",");
        
            for (let i = 1; i < lines.length; i++) {
                let obj = {};
                let currentline = lines[i].split(",");
        
                for (let j = 0; j < headers.length; j++) {
                    obj[headers[j]] = currentline[j];
                }
                //console.log('obj:::', obj);
                result.push(obj);
            }
            console.log('result:::', result);
            return result;
        }
        res.json(csvJSON(data));
        res.end();
    });
});

module.exports = app;
