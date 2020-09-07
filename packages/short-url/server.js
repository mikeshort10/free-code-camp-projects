'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var dns = require('dns');

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);


mongoose.connect(process.env.MONGO,{ useMongoClient : true });

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use(bodyParser.urlencoded({extended: false}))

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
  //onsole.log();
});

const Schema = mongoose.Schema;

const linksSchema = new Schema({
    original_url : String,
    short_url : Number
})

const Links = mongoose.model('Links',linksSchema);
  
// your first API endpoint... 
app.post("/api/shorturl/new",function (req, res) {
   var regex = /^https?:\/\/www\..*\.com/gi
   var rep = /https?:/i
   var url = req.body.url;
  
  if (regex.test(req.body.url)){
    var url = url.replace(regex)
    dns.lookup(url,function(err,address){
  
  //Links.find({}).remove().exec();
  Links.findOne({original_url : req.body.url},function(err,data){
    if (!data){
      console.log(data)
      Links.count({},function(err,data){
      var neu = {original_url : req.body.url, short_url : data}
      Links.create(neu);
      res.json(neu)
      }).exec()
    } else {
      res.json({original_url: data.original_url,short_url : data.short_url})
    }
  })
      })
    } else {
      res.json({"error":"invalid URL"})
    }
});


app.get('/api/shorturl/:shorturl([0-9]+)',function(req,res){
   Links.findOne({short_url : req.params.shorturl},function(err,data){
     if (err) return res.json(err)
     if (data) res.redirect(data.original_url);
     if (!data) res.json({"error":"invalid URL"})
   })
})


app.listen(port, function () {
  console.log('Node.js listening ...');
});