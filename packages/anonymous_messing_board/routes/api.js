/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

mongoose.connect(process.env.DB,{useNewUrlParser: true});
var Schema = mongoose.Schema;

var replySchema = new Schema({
  text: String,
  created_on: Date,
  delete_password: String,
  reported: Boolean
})

var Reply = mongoose.model('Reply',replySchema);

var threadSchema = new Schema({
  board: String,
  text: String,
  created_on: Date,
  bumped_on: Date,
  reported: Boolean,
  delete_password: String,
  replies: [replySchema]
})

var Thread = mongoose.model('Thread',threadSchema);

module.exports = function (app) {
  
  app.route('/api/threads/:board')
    .get(function (req,res) {
      var board = req.params.board;
      Thread.find({board: board}).sort({bumped_on: "desc"}).limit(10).select("-delete_password -reported -board -__v").exec(function (err, data){
        if (err) res.send(err);
        else if (data==false) res.send('No such board');
        else {
        data.forEach(function (x) { 
          x.replies = x.replies.sort((a,b) => a.created_on > b.created_on).slice(0,3);
          var replyArr = [];
          x.replies.forEach(function (y) {
            var obj = {
              text: y.text,
              created_on: y.created_on,
              _id: y._id
            }
            replyArr.push(obj);
          })
          x.replies = replyArr;
        })
        res.json(data);
        }
      })
  })
  
    .post(function (req,res) { 
      console.log('post',req.body.delete_password)
      var board = req.params.board;
      var date = new Date();
      var newThread = new Thread({
        board: req.body.board,
        text: req.body.text,
        created_on: date,
        bumped_on: date,
        reported: false,
        delete_password: bcrypt.hashSync(req.body.delete_password, 12),
        replies: []
      })
      
      newThread.save(function (err, data){
        if (err) return err;
        else { 
          res.redirect('/b/'+board)
        }
      })
      
  })
  
    .delete(function (req,res) {
      Thread.findById(req.body.thread_id,function (err,data){
      if (data===null) res.send('No such thread');
      else {
      if (bcrypt.compareSync(req.body.delete_password, data.delete_password)) {
        Thread.findByIdAndDelete(req.body.thread_id, function (err, data){
          if (err) return err;
          else res.send('Success');
        })
      } else {
        res.send('Incorrect password');
      }
      }
      })                         
  })
  
    .put(function (req,res) {
      Thread.findById(req.body.thread_id, function (err, data) {
        if (err) res.send('Incorrect thread id');
        else if (data.board!==req.params.board) res.send('No such board')
        else {
          data.reported = true;
          data.save(function (err, data) {
            if (err) res.send('Could not report')
            else res.send('Successfully reported');
          })
        }
      })
  })
  
  
    
  app.route('/api/replies/:board')
    .get(function (req,res) {
      var board = req.params.board;
      Thread.findById(req.query.thread_id,function (err, data) {
        if (err) res.send('No such thread');
        else if (data!=null&&req.params.board===data.board) {
          var arr = [];
          data.replies.forEach(function (e) {
            arr.push({
              _id: e._id,
              text: e.text,
              created_on: e.created_on
            })
          })
          res.json(arr)
        } else {
          res.send('No such thread');
        }
      })
  })
  
    .post(function (req,res) {
      var board = req.params.board;
      var date = new Date();
      var newReply = new Reply({
        text: req.body.text,
        created_on: date,
        delete_password: bcrypt.hashSync(req.body.delete_password, 12),
        reported: false
      });
    
      Thread.findById(req.body.thread_id,function (err,data){
        if (err) res.send('No such thread');
        else if (data!=null&&data.board===req.body.board){
          var date = new Date();
          data.bumped_on = date;
          data.replies.unshift(newReply);
          data.save(function (err, data) {
            if (err) return err;
            res.redirect('/b/'+board+'/'+req.body.thread_id)
          })
        } else {
          res.send('No such thread');
        }
      })
  })
  
    .delete(function (req,res) {
    Thread.findById(req.body.thread_id,function (err,data){
      if (err) console.log(err)
      if (data===null) res.send('No such thread');
      else if (data.board===req.params.board) {
        var index = data.replies.findIndex(x => x._id==req.body.reply_id&&bcrypt.compareSync(req.body.delete_password,x.delete_password));
        if (index === -1) res.send('Incorrect password');
        else {
        data.replies[index].text = '[deleted]';
        data.save(function (err, data){
          if (data) res.send('Success');
        })
        }
      } else if (data.board!=req.params.board){
        res.send('No such board');
      }
      })
  })
  
    .put(function (req,res) {
      var board = req.params.board;
      Thread.findById(req.body.thread_id, function (err, data) {
        if (err) res.send("No such thread");
        else if (data!=null&&data.board===req.params.board){  
          var reportedReply = data.replies.find(x => x._id = req.body.reply_id)
          reportedReply.reported = true;
          reportedReply.save(function (err, data) {
            if (err) res.send(err);
            else res.send('Successfully reported');
          })
        } else {
          res.send("No such thread");
        }
      })
  })

};
