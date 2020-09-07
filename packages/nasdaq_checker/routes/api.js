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
var mongoose = require('mongoose');
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest

const CONNECTION_STRING = process.env.DB;

mongoose.connect(CONNECTION_STRING,{ useNewUrlParser: true } );

var Schema = mongoose.Schema;
var stockData = new Schema({
  stock: String,
  price: String,
  likes: Number,
  likeIPs: [String]
});

var Stock = mongoose.model('Stock',stockData);

module.exports = function (app) {
  
  app.route('/api/stock-prices')
    .get(function (req, res){
      let stock = req.query.stock;
      if (Array.isArray(stock)) {
        var stock1 = stock[0];
        var stock2 = stock[1];
      } else {
        var stock1 = stock;
      }
      var stockData = {stockData: []}
      let like = req.query.like;
      let isLiked = like ? 1 : 0
      let ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
      let arr = like ? [ip] : []
      function getStockData (stk, callback) {
        console.log(stk);
        if (stk) {
        var request = new XMLHttpRequest();
        request.open("GET","https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + stk + "&apikey=" + process.env.ALPHAVANTAGE_API_KEY,true);
        console.log("https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + stk + "&apikey=" + process.env.ALPHAVANTAGE_API_KEY)
      request.send();
      request.onload=function(){
        let json = JSON.parse(request.responseText);
        console.log(json);
        let price = Number(json["Global Quote"]["05. price"]).toFixed(2).toString();
        Stock.findOne({stock: stk}, function (err, data) {
          if (err) console.log(err);
          if (data===null) {
            let newStock = new Stock({
              stock: stk,
              likeIPs: arr,
              likes: isLiked
            })
            newStock.save(function (err, data) {
              if (err) return err;
              else {
                let desiredInfo = Object.assign({stock: newStock.stock, likes: newStock.likes, price: price}, {});
                !stock2 ? stockData.stockData = desiredInfo : stockData.stockData.push(desiredInfo);
              }
              callback();
            })
            } else {
              if (!data.likeIPs.includes(ip)) data.likes += isLiked;
              if (arr[0]) data.likeIPs.push(arr[0]);
              data.save(function (err,data) {
                if (err) return err;
                else {
                  let desiredInfo = Object.assign({stock: data.stock, likes: data.likes, price: price}, {});
                  !stock2 ? stockData.stockData = desiredInfo : stockData.stockData.push(desiredInfo);
                }
                callback();
              })
            }
        })
      }
        } else {
          callback();
        }
      }
    
    function relLikes () {
     if (stock2) {
       let likes1 = stockData.stockData[0].likes + 0;
       let likes2 = stockData.stockData[1].likes + 0;
       let rellikes1 = likes1 - likes2;
       let rellikes2 = likes2 - likes1;
       delete stockData.stockData[0].likes;
       delete stockData.stockData[1].likes;
       stockData.stockData[0].rel_likes = rellikes1;
       stockData.stockData[1].rel_likes = rellikes2;
     }
      res.json(stockData);
    }
    getStockData(stock1, () => getStockData(stock2, relLikes));
  })
    
};
