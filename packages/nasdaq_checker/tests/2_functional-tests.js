/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

//due to limited API calls, cannot call all tests in the same minute. Must code out at least one test at a time

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    
    suite('GET /api/stock-prices => stockData object', function() {
      
      var likesAtIP;
      
      test('1 stock', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog'})
        .end(function(err, res){
          assert.equal(res.status, 200)
          assert.equal(res.body.stockData.stock, 'goog')
          assert.property(res.body.stockData, 'price');
          assert.property(res.body.stockData, 'likes');
          done();
        });
      });
      
      test('1 stock with like', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog', like: true})
        .end(function(err, res){
          assert.equal(res.status, 200)
          assert.isNotArray(res.body.stockData);
          assert.equal(res.body.stockData.stock, 'goog')
          assert.property(res.body.stockData, 'price');
          assert.isNumber(res.body.stockData.likes);
          likesAtIP = res.body.stockData.likes;
          done();
        });
      });
      
      test('1 stock with like again (ensure likes arent double counted)', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog', like: true})
        .end(function(err, res){
          assert.equal(res.status, 200)
          assert.isNotArray(res.body.stockData);
          assert.equal(res.body.stockData.stock, 'goog')
          assert.property(res.body.stockData, 'price');
          assert.equal(res.body.stockData.likes, likesAtIP);
          done();
        });
      });
      
      test('2 stocks', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: ['goog','msft'] })
        .end(function(err, res){
          assert.equal(res.status, 200)
          assert.isArray(res.body.stockData);
          assert.equal(res.body.stockData[0].stock, 'goog' || 'msft')
          assert.equal(res.body.stockData[1].stock, res.body.stockData[0] === 'goog' ? 'goog' : 'msft')
          assert.property(res.body.stockData[0], 'price');
          assert.property(res.body.stockData[1], 'price');
          assert.isNumber(res.body.stockData[0].rel_likes);
          assert.isNumber(res.body.stockData[1].rel_likes);
          done();
        });
      });
      
      test('2 stocks with like', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: ['goog','msft'], like: true})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body.stockData);
          assert.equal(res.body.stockData[0].stock, 'goog' || 'msft')
          assert.equal(res.body.stockData[1].stock, res.body.stockData[0] === 'goog' ? 'goog' : 'msft')
          assert.property(res.body.stockData[0], 'price');
          assert.property(res.body.stockData[1], 'price');
          assert.isNumber(res.body.stockData[0].rel_likes - res.body.stockData[1].rel_likes, 0);
          done();
        });
      });
      
    });

});
