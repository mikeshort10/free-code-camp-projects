/*
*
*
*       Complete the handler logic below
*       
*       
*/

function ConvertHandler() {
  
  this.getNum = function(input) {
    let index;
    for (let i = 0; i < input.length; i++){
      if (input.charCodeAt(i)>64) {
        index = i;
        break;                          
    }
    }
    let result = index === 0 ? "1" : input.slice(0,index);
    let divide = result.indexOf("/");
    result = divide < 1 || divide === result.length - 1 ? result : Number(result.slice(0,divide)) / Number(result.slice(divide+1));
    result = isNaN(result) ? input.slice(0, index) : result;
    return isNaN(result) ? result : parseFloat(Number(result).toFixed(5));
  };
  
  this.getUnit = function(input) {
    let index;
    for (let i = 0; i < input.length; i++){
      if (input.charCodeAt(i)>64) {
        index = i;
        break;                          
    }
    }
    let result = input.slice(index,input.length)
    result = result === "L" || result === "l" ? result.toUpperCase() : result.toLowerCase();
    return result;
  };
  
  this.getReturnUnit = function(initUnit) {
    initUnit = initUnit !== "L" && initUnit !== "l" ? initUnit.toLowerCase() : initUnit.toUpperCase();
    var relatedUnits = [
      {imperial: "lbs",
       metric: "kg"
      },
      {imperial: "L",
       metric: "gal"
      },
      {imperial: "mi",
       metric: "km"
      }
    ];
    
    let convertor = relatedUnits.find(x => x.imperial === initUnit || x.metric === initUnit);
    let result = convertor === undefined ? undefined : convertor.imperial === initUnit ? convertor.metric : convertor.imperial
    return result;
  };

  this.spellOutUnit = function(unit) {
    if (unit === undefined) {
      return undefined;
    } else {
    unit  = unit !== "L" && unit !== "l" ? unit.toLowerCase() : unit.toUpperCase();
    let fullSpelling = [
      {abbr: 'gal',
       full: 'gallons'
      },
      {abbr: 'L',
       full: 'liters'
      },
      {abbr: 'lbs',
       full: 'pounds'
      },
      {abbr: 'kg',
       full: 'kilograms'
      },
      {abbr: 'mi',
       full: 'miles'
      },
      {abbr: 'km',
       full: 'kilometers'
      },
    ];
    let spelling = fullSpelling.find(x => x.abbr === unit);
    let result = spelling ? spelling.full : undefined;
    return result;
    }
  };
  
  this.convert = function(initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    var result;
    if (isNaN(initNum)) {return undefined;} else {
    switch (initUnit) {
      case "gal":
        result = initNum * galToL;
        break;
      case "L":
        result = initNum/galToL;
        break;
      case "lbs":
        result = initNum * lbsToKg;
        break;
      case "kg":
        result = initNum/lbsToKg;
        break;
      case "mi":
        result = initNum * miToKm;
        break;
      case "km":
        result = initNum/miToKm;
        break;
      default:
        result = undefined;
                    }
    return result ? parseFloat(result.toFixed(5)): result;
    }
  };
  
  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    var result;
    
    if (isNaN(initNum)&&returnUnit===undefined) {
      result = 'invalid number and unit';
    } else if (isNaN(initNum)) {
      result = 'invalid number';
    } else if (returnUnit === undefined) {
      result = 'invalid unit';
    } else {
      result = initNum + ' ' + initUnit + ' converts to ' + returnNum + ' ' + returnUnit;
    }
    
    let json = {
      initNum: initNum,
      initUnit: initUnit,
      returnNum: returnNum,
      returnUnit: returnUnit,
      string: result
    }
    
    return result;
  };
  
}

module.exports = ConvertHandler;
