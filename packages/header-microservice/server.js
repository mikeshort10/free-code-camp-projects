// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var http = require('http');
var req = require('request');

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
const options = {
  hostname: "www.glitch.com",
  port: 80,
  method: 'GET',
  headers:{
  'User-Agent': 'request'
}
};


// your first API endpoint... 
app.get("/api/whoami", function (req,res) {
  res.json({
    ipaddress: req.headers['x-forwarded-for'],
    language: req.headers['accept-language'],
    software: req.headers['user-agent']
  })
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
