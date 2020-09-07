/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var mongoose = require('mongoose')

const CONNECTION_STRING = process.env.DB; 
mongoose.connect(CONNECTION_STRING,{ useNewUrlParser: true });
var Schema = mongoose.Schema
var issue = new Schema({
        project: String,
        issue_title: String,
        issue_text: String,
        created_by: String,
        assigned_to: String || "",
        status_text: String || "",
        created_on: Date,
        updated_on: Date,
        open: Boolean
})
var newIssue = mongoose.model('newIssue', issue);

module.exports = function (app) {

  app.route('/api/issues/:project')
    .get(function (req, res){
      var project = req.params.project;
      var json = {project: project}
      for (var key in req.query) {
        json[key] = req.query[key]
      }
      newIssue.find(json, function (err,data){
        res.json(data);
      });
      
    })
    
    .post(function (req, res){
      if (req.body.issue_title || req.body.issue_text || req.body.created_by) {
      var project = req.params.project;
      let date = new Date();
      let json = {
        project: project,
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to || "",
        status_text: req.body.status_text || "",
        created_on: date,
        updated_on: date,
        open: true
      };
    
    var iss = new newIssue(json)
    var saved = iss.save(function (err, data) {
        if (err) console.log(err)
         res.json(data);
      });
      } else {
        res.send('Missing required fields');
      }
    })
    
    .put(function (req, res){
      if (!req.body.issue_title&&
          !req.body.issue_text&&
          !req.body.created_by&&
          !req.body.assigned_to&&
          !req.body.status_text&&
          !req.body.open
         ) {
      res.send("no updated field sent");
      } else {
      var project = req.params.project;
      let date = new Date();
      newIssue.findById(req.body._id,function(err,data) {
        if (err) res.send("could not update " + req.body._id);
        else {
        data.issue_title = req.body.issue_title || data.issue_title;
        data.issue_text =req.body.issue_text || data.issue_text;
        data.created_by = req.body.created_by || data.created_by;
        data.assigned_to = req.body.assigned_to || data.assigned_to;
        data.status_text = req.body.status_text || data.status_text;
        data.updated_on = date;
        data.open = (req.body.open !== undefined) ? false : data.open;
        data.save(function (err, data) {
          if (err) return err;
          res.send("successfully updated");
        });
        }
      })
      }
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      newIssue.findByIdAndRemove(req.body._id, function (err,data) {
        if (req.body._id) {
        if (err) res.send("could not delete " + req.body._id)
        else res.send("deleted " + req.body._id)
        } else {
          res.send("_id error")
        }
      })
    });
    
};
