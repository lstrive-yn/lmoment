const validators = {
  isDate: function(date, errMsg) {
    if (typeof date === "undefined" || new Date(date) == "Invalid Date") {
      return errMsg;
    }
  },
  isEmptyString: function(data, errMsg) {
    if(typeof data === "undefined" || data.trim().length === 0) {
      return errMsg
    }
  },
  isArray: function(arr, errMsg) {
    if(Object.prototype.toString.call(arr) !== "[object array]") {
      return errMsg;
    }
  },
  isObject: function(obj, errMsg) {
    if(Object.prototype.toString.call(obj) !== "[object object]" || JSON.stringify(obj) !== '{}') {
      return errMsg
    }
  }
};

function Validate() {
  this.cache = [];
}

Validate.prototype.add = function(rules, value, errMsg) {
  let ary = rules.split(":");
  this.cache.push(function() {
    var strategory = ary.shift();
    ary.unshift(value);
    ary.push(errMsg);
    return validators[strategory].apply(null, ary);
  })
}

Validate.prototype.start = function() {
  const { cache } = this;
  for(var i=0, fn; fn=cache[i++]; ) {
    var errMsg = fn();
    if(errMsg) return errMsg;
  }
}

export default Validate;