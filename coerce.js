(function(coerce) {

  coerce.version = "0.0.2";

  if (typeof module === "object") {
    var d3 = require("d3");
  }

  coerce.object = function() {
    var ops = [],
        coersion = function(d, i) {
          var context = this;
          ops.forEach(function(op) {
            op.call(context, d, i);
          });
          return d;
        };

    coersion.key = function(key, op) {
      op = coerce.op(op);
      ops.push(function(d, i) {
        // TODO: use properly?
        if (d.hasOwnProperty(key)) {
          d[key] = op.call(d, d[key], key, i);
        }
      });
      return coersion;
    };

    coersion.keys = function(keys) {
      for (var key in keys) {
        coersion.key(key, keys[key]);
      }
      return coersion;
    };

    coersion.map = function(d, i) {
      var copy = coersion.extend({}, d);
      coersion(copy, i);
      return copy;
    };

    return coersion;
  };

  coerce.coercer = function(parse, reject) {
    return function(def) {
      return (typeof reject === "function" && typeof def !== "undefined")
        ? function(val) {
          var parsed = parse(val);
          return reject(parsed) ? def : parsed;
        }
        : parse;
    };
  };

  coerce.op = function(op) {
    if (typeof op === "function") {
      return op;
    }
    var args = [].slice.call(arguments, 1);
    switch (typeof op) {
      case "string":
        if (!(op in this)) {
          throw "Unknown coersion: " + op;
        }
        return coerce[op].apply(null, args);
      case "object":
        return coerce.object().keys(op);
    }
    throw "Invalid coersion: " + op;
  };

  coerce.int = coerce.coercer(parseInt, isNaN);
  coerce.float = coerce.coercer(parseFloat, isNaN);
  coerce.number = coerce.coercer(function(s) {
    return s.length ? +s : NaN;
  }, isNaN);

  coerce.money = coerce.coercer(function(s) {
    return +(String(s)
      .replace(/^[^\d]+/, "")
      .replace(/,/g, ""));
  }, isNaN);

  coerce.string = function(def) {
    return String;
  };

  coerce.date = function(format, def) {
    var parse;
    if (Array.isArray(format)) {
      var formats = format.map(d3.time.format),
          len = formats.length;
      parse = function(str) {
        for (var i = 0; i < len; i++) {
          var parsed = formats[i].parse(str);
          if (parsed) return parsed;
        }
        return null;
      };
    } else {
      parse = d3.time.format(format).parse;
    }
    var reject = function(d) { return d === null; };
    return coerce.coercer(function(str) {
      return str ? parse(str) : null;
    }, reject)(def);
  };

  coerce.extend = function(obj, ext) {
    [].slice(arguments, 1).forEach(function(e) {
      if (!e) return;
      for (var key in e) {
        if (e.hasOwnProperty(key)) {
          obj[key] = e[key];
        }
      }
    });
    return obj;
  };

})(typeof module === "object" ? module.exports : this.coerce = {});
