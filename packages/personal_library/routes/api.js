/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var mongoose = require('mongoose');
const MONGODB_CONNECTION_STRING = process.env.DB;
mongoose.connect(MONGODB_CONNECTION_STRING, function(err, db) {});
const schema = mongoose.Schema;
const bookSchema = new schema({
  title: String,
  commentcount: Number,
  comments: [String]
});
const Book = mongoose.model('Book',bookSchema);

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      var json = {};
      for (let key in req.query) {
        json[key] = req.query[key]
      }
      Book.find(json,function (err, data){
        if (err) return err;
        else {
        var arr = [];
        data.map(x => arr.push({title: x.title, _id: x._id, commentcount: x.commentcount}));
        res.json(arr);
        }
      });
    })
    
    .post(function (req, res){
      var title = req.body.title;
      if (title) {
      var newBook = new Book({
        title: title,
        comments: [],
        commentcount: 0
      });
      newBook.save(function (err, data) {
        if (err) return err;
        else res.json({
          title: data.title,
          _id: data._id
        })
      })
      } else {
        res.send('no title given');
      }
    })
    
    .delete(function(req, res){
      Book.remove({},function (err, data) {
        if (err) res.send(err);
        else return "Complete delete successful";
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      Book.findById(bookid,function (err, data) {
        if (err) res.send("no book exists");
        else res.json({_id: bookid, title: data.title, comments: data.comments});
      });
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      Book.findById(bookid,function (err, data) {
        if (err) res.send("no book exists");
        else { 
          data.comments.push(comment);
          data.commentcount = data.comments.length
          data.save(function (err, data){
            if (err) return err;
            else res.json(data);
          })
        }
      });
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      Book.findByIdAndRemove(bookid, function (err, data) {
        if (err) res.send("no book exists");
        else res.send("delete successful");
      })
    });
  
};
