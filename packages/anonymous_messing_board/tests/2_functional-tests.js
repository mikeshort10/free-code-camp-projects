/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
var bcrypt = require('bcrypt');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
  var board = "ChaiTest";
  var thread_text = "This is a thread";
  var thread_password = "test";
  var reply_text = "This is a reply";
  var reply_password = "shitty_password";
  var thread_id;
  var reply_id;

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      
      test('Redirect', function (done) {
      chai.request(server)
      .post('/api/threads/:board')
      .send({
        board: board,
        text: thread_text,
        delete_password: thread_password
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        done();
      })
    });
      
    })
   
    suite('GET', function() {
      
      test('No such thread', function (done) {
        chai.request(server)
        .get('/api/threads/anoasig')
        .send({
          board: "anoasig"
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'No such board');
          done();
        })
      })
      
      test('Existing board returned', function (done) {
      chai.request(server)
      .get('/api/threads/' + board)
      .send({
        board: board
      })
      .end(function (err, res) {
        assert.equal(res.status, 200)
        assert.isArray(res.body)
        assert.property(res.body[0], '_id')
        assert.equal(res.body[0].text, thread_text);
        assert.property(res.body[0], 'created_on');
        assert.equal(res.body[0].created_on, res.body[0].bumped_on);
        assert.isArray(res.body[0].replies);
        thread_id = res.body[0]._id;
        done();
      })
      })
    });
    
    suite('DELETE', function() {
      
      test ('No id', function (done) {
        chai.request(server)
        .delete('/api/threads/:board')
        .send({
          board: board,
          delete_password: thread_password
        })
        .end(function (err, res) {
          assert.equal(res.status, 200)
          assert.equal(res.text, "No such thread");
          done();
        })
      })
      
      test ('Wrong password', function (done) {
        chai.request(server)
        .delete('/api/threads/:board')
        .send({
          board: board,
          thread_id: thread_id,
          delete_password: "wrong"
        })
        .end(function (err, res) {
          assert.equal(res.status, 200)
          assert.equal(res.text, "Incorrect password");
          done();
        })
      })
      
      test ('Correct password and id', function (done) {
      chai.request(server)
      .delete('/api/threads/:board')
      .send({
        board: board,
        thread_id: thread_id,
        delete_password: thread_password
      })
      .end(function (err, res){
        assert.equal(res.status, 200);
        assert.equal(res.text, 'Success');
        done();
      })
      })
      
    });
    
    suite('PUT', function() {
    test('Non-test: recreate thread', function (done) {
      chai.request(server)
      .post('/api/threads/' + board)
      .send({
        board: board,
        text: thread_text,
        delete_password: thread_password
      })
      .end(function (err, res) {
        chai.request(server)
      .get('/api/threads/' + board)
      .send({})
      .end(function (err,res){
        thread_id = res.body[0]._id;
        done();
      })
      })
    })
      
      test('Incorrect board', function (done) {
        chai.request(server)
        .put('/api/threads/something')
        .send({
          thread_id: thread_id
        })
        .end(function (err, res) {
          assert.equal(res.status, 200)
          assert.equal(res.text, 'No such board')
          done();
        })
      })
      
      test('Incorrect id', function (done) {
        chai.request(server)
        .put('/api/threads/' + board)
        .send({
          board: board,
          thread_id: 1
        })
        .end(function (err, res) {
          assert.equal(res.status, 200)
          assert.equal(res.text, 'Incorrect thread id')
          done();
        })
      })
      
      test('Correct board and id', function (done) {
        chai.request(server)
        .put('/api/threads/' + board)
        .send({
          board: board,
          thread_id: thread_id
        })
        .end(function (err, res) {
          assert.equal(res.status, 200)
          assert.equal(res.text, 'Successfully reported')
          done();
        })
      })
      
    });
    
   });
    
 
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      
      test('No existing board', function (done) {
        chai.request(server)
        .post('/api/replies/:board')
        .send({
          thread_id: thread_id,
          reply_text: reply_text,
          delete_password: reply_password
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'No such thread');
          done();
        })
      })
      
      test('No existing thread', function (done) {
        chai.request(server)
        .post('/api/replies/:board')
        .send({
          board: board,
          reply_text: reply_text,
          delete_password: reply_password
        })
        .end(function (err, res) {
          assert.equal(res.status,200);
          assert.equal(res.text, 'No such thread');
          done();
        })
      })
      
      test('Success', function (done) {
        chai.request(server)
        .post('/api/replies/' + board+ "?thread_id=" + thread_id)
        .send({
          board: board,
          thread_id: thread_id,
          text: reply_text,
          delete_password: reply_password
        })
        .end(function (err, res) {
          assert.equal(res.status,200);
          done();
        })
      })
      
    });
    
    suite('GET', function() {
      
      test('No such board', function (done) {
        chai.request(server)
        .get('/api/replies/someth?thread_id=' + thread_id)
        .send({
          thread_id: thread_id
        })
        .end(function (err, res){
          assert.equal(res.status,200);
          assert.equal(res.text, 'No such thread')
          done();
        })
      })
      
      test('No such thread', function (done) {
        chai.request(server)
        .get('/api/replies/' + board+ "?thread_id=1")
        .send({
          board: board,
          thread_id: thread_id
        })
        .end(function (err, res){
          assert.equal(res.status,200);
          assert.equal(res.text, 'No such thread')
          done();
        })
      })
      
      test('Success', function (done) {
        chai.request(server)
        .get('/api/replies/' + board + "?thread_id=" + thread_id)
        .send({
          board: board,
          thread_id: thread_id
        })
        .end(function (err, res){
          assert.equal(res.status,200);
          assert.isArray(res.body);
          console.log(res.body);
          assert.property(res.body[0],'_id')
          assert.property(res.body[0],'created_on');
          assert.property(res.body[0],'text');
          reply_id = res.body[0]._id
          done();
        })
      })
      
    });
    
    suite('PUT', function() {
      
      test('No such board', function (done) {
        chai.request(server)
        .put('/api/replies/_')
        .send({
          board: "_",
          thread_id: thread_id,
          reply_id: reply_id
        })
        .end(function (err,res){
          assert.equal(res.status, 200);
          done();
        })
      })
      
      test('No such thread', function (done) {
        chai.request(server)
        .put('/api/replies/' + board)
        .send({
          board: board,
          thread_id: 1,
          reply_id: reply_id
        })
        .end(function (err,res){
          assert.equal(res.status, 200);
          done();
        })
      })
      
      test('Success', function (done) {
        chai.request(server)
        .put('/api/replies/' + board)
        .send({
          board: board,
          thread_id: thread_id,
          reply_id: reply_id
        })
        .end(function (err,res){
          assert.equal(res.status, 200);
          assert.equal(res.text, "Successfully reported")
          done();
        })
      })
      
    });
    
    suite('DELETE', function() {
      
      test('No such board', function (done) {
        chai.request(server)
        .delete('/api/replies/someth')
        .send({
          board: board,
          thread_id: thread_id,
          reply_id: reply_id,
          delete_password: reply_password
        })
        .end(function (err, res) {
          assert.equal(res.status, 200)
          assert.equal(res.text, 'No such board');
          done();
        })
      })
      
      test('No such thread', function (done) {
        chai.request(server)
        .delete('/api/replies/' + board)
        .send({
          board: board,
          thread_id: reply_id,
          reply_id: reply_id,
          delete_password: reply_password
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'No such thread');
          done();
        })
      })
      
      test('Incorrect id', function (done) {
        chai.request(server)
        .delete('/api/replies/' + board)
        .send({
          board: board,
          thread_id: thread_id,
          reply_id: thread_id,
          delete_password: reply_password
        })
        .end(function (err, res) {
          assert.equal(res.status, 200)
          assert.equal(res.text, 'Incorrect password');
          done();
        })
      })
      
      test('Incorrect password', function (done) {
        chai.request(server)
        .delete('/api/replies/' + board)
        .send({
          board: board,
          thread_id: thread_id,
          reply_id: reply_id,
          delete_password: 'password'
        })
        .end(function (err, res) {
          assert.equal(res.status, 200)
          assert.equal(res.text, 'Incorrect password');
          done();
        })
      })
      
      test('Success', function (done) {
        chai.request(server)
        .delete('/api/replies/' + board)
        .send({
          board: board,
          thread_id: thread_id,
          reply_id: reply_id,
          delete_password: reply_password
        })
        .end(function (err, res) {
          assert.equal(res.status, 200)
          assert.equal(res.text, 'Success');
          done();
        })
      })
      
    });
    
  });

});
