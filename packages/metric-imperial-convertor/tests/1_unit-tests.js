/*
*
*
*       FILL IN EACH UNIT TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]----
*       (if additional are added, keep them at the very end!)
*/

var chai = require('chai');
var assert = chai.assert;
var ConvertHandler = require('../controllers/convertHandler.js');

var convertHandler = new ConvertHandler();

suite('Unit Tests', function(){
  
  suite('Function convertHandler.getNum(input)', function() {
    
    test('Whole number input', function(done) {
      var input = '32L';
      assert.equal(convertHandler.getNum(input),32);
      done();
    });
    
    test('Decimal Input', function(done) {
      var input = "7.5L";
      assert.equal(convertHandler.getNum(input),7.5);
      done();
    });
    
    test('Fractional Input', function(done) {
      var input = "2/4L";
      assert.equal(convertHandler.getNum(input),.5);
      done();
    });
    
    test('Fractional Input w/ Decimal', function(done) {
      var input = "3.5/7";
      assert.equal(convertHandler.getNum(input),.5);
      done();
    });
    
    test('Invalid Input (double fraction)', function(done) {
      assert.isNaN(convertHandler.getNum("3/5/7"), "NaN is NaN");
      done();
    });
    
    test('No Numerical Input', function(done) {
      assert.equal(convertHandler.getNum("kg"),1);
      done();
    }); 
    
  });
  
  suite('Function convertHandler.getUnit(input)', function() {
    
    test('For Each Valid Unit Inputs', function(done) {
      var input = ['gal','L','mi','km','lbs','kg','GAL','l','MI','KM','LBS','KG'];
      input.forEach(function(ele) {
        let index = input.indexOf(ele)%6;   assert.equal(convertHandler.getUnit(ele),input[index]);
      });
      done();
    });
    
    test('Unknown Unit Input', function(done) {
      var input = "3vy"
      assert.equal(convertHandler.getUnit(input),"vy");
      done();
    });  
    
  });
  
  suite('Function convertHandler.getReturnUnit(initUnit)', function() {
    
    test('For Each Valid Unit Inputs', function(done) {
      var input = ['gal','L','mi','km','lbs','kg'];
      var expect = ['L','gal','km','mi','kg','lbs'];
      input.forEach(function(ele, i) {
        assert.equal(convertHandler.getReturnUnit(ele), expect[i]);
      });
      done();
    });
    
  });  
  
  suite('Function convertHandler.spellOutUnit(unit)', function() {
    
    test('For Each Valid Unit Inputs', function(done) {
      var input = ['gal','L','km','mi','kg','lbs'];
      var expect = ['gallons','liters','kilometers','miles','kilograms','pounds'];
      input.forEach(function(ele,i) {
        assert.equal(convertHandler.spellOutUnit(ele), expect[i]);
      });
      done();
    });
    
  });
  
  suite('Function convertHandler.convert(num, unit)', function() {
    
    test('Gal to L', function(done) {
      var input = [5, 'gal'];
      var expected = 18.9271;
      assert.approximately(convertHandler.convert(input[0],input[1]),expected,0.1); //0.1 tolerance
      done();
    });
    
    test('L to Gal', function(done) {
      var input = [18.9271, 'L'];
      var expected = 5;
      assert.approximately(convertHandler.convert(input[0],input[1]),expected,0.1);
      done();                  
    });
    
    test('Mi to Km', function(done) {
      var input = [3.1, 'mi'];
      var expected = 5;
      assert.approximately(convertHandler.convert(input[0],input[1]),expected,0.1);
      done();  
    });
    
    test('Km to Mi', function(done) {
      var input = [5, 'km'];
      var expected = 3.1;
      assert.approximately(convertHandler.convert(input[0],input[1]),expected,0.1);
      done();  
    });
    
    test('Lbs to Kg', function(done) {
      var input = [4, 'lbs'];
      var expected = 1.81437;
      assert.approximately(convertHandler.convert(input[0],input[1]),expected,0.1);
      done();  
    });
    
    test('Kg to Lbs', function(done) {
      var input = [1.81437, 'kg'];
      var expected = 4;
      assert.approximately(convertHandler.convert(input[0],input[1]),expected,0.1);
      done(); 
    });
    
  });

});