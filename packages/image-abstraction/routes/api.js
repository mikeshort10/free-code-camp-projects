'use strict'

var googleImages = require('google-images');
var mongoose = require('mongoose');

var client = new googleImages(process.env.CSEID, process.env.APIKEY);

module.exports = function (app, db) {
  
  var Schema = mongoose.Schema;
  var searchSchema = new Schema({
    term: String,
    when: Date,
    url: String
  })
  var Search = mongoose.model('Search', searchSchema);
  
  app.get('/', function(request, response) {
  response.render(process.cwd() + '/views/index.pug');
});

  app.route('/imagesearch/:keyword')
  .get(function (req, res) {
    var keyword = req.params.keyword;
    var offset = req.query.offset || 1;
    var date = new Date();
    var newSearch = new Search({
      term: keyword,
      when: date
    })
    console.log(newSearch);
    client.search(keyword,{page: offset, safe: "high"}).then(images => {
          var arr = []
          newSearch.url = images[0].url
          images.forEach(e => {
          arr.push({
          altText: e.description,
          source: e.parentPage,
          thumbnail: e.thumbnail.url,
          url: e.url
          })
        })
        newSearch.save(function (err, data) {
          if (err) res.send(err);
          else res.render(process.cwd() + '/views/images.pug', {images: arr, keyword: keyword, offset: offset});
        })
        
      });
  })
  
  app.route('/api/imagesearch/:keyword')
  .get(function (req, res) {
    var keyword = req.params.keyword;
    var offset = req.query.offset;
    var date = new Date();
    var newSearch = new Search({
      term: keyword,
      when: date
    })
    client.search(keyword,{page: offset || 1, safe: "high"}).then(images => {
          var arr = []
          newSearch.url = images[0].url 
          images.forEach(e => {
          arr.push({
          altText: e.description,
          source: e.parentPage,
          thumbnail: e.thumbnail.url,
          url: e.url
          })
        })
        newSearch.save(function (err, data) {
          if (err) res.send(err);
          else res.json(arr);
        })        
      });
  })
  
  app.route('/latest/imagesearch/')
  .get(function (req, res) {
    Search.find({}).sort({when: "desc"}).limit(10).select('-__v -_id').exec(function (err, data){
      if (err) res.send(err);
      else {
        res.render(process.cwd() + '/views/latest.pug', {search: data});
      }
    })
  })
  
  app.route('/api/latest/imagesearch/')
  .get(function (req, res) {
    Search.find({}).sort({when: "desc"}).limit(10).select('-__v -_id -url').exec(function (err, data){
      if (err) res.send(err);
      else res.json(data);
    })
  })
}