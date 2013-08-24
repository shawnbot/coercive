var vows = require("vows"),
    assert = require("assert"),
    util = require("util"),
    coerce = require("./coerce");

vows.describe("Coersions")
  .addBatch({

    "numeric strings": {
      topic: function() {
        var coerceNum = coerce.number();
        return [
          "1",
          "1000",
          "-200",
          "12e4",
          "4.520983250928",
          "-2598509803948.1"
        ].map(coerceNum);
      },
      "should produce numbers": function(numbers) {
        numbers.forEach(function(n) {
          assert.equal(isNaN(n), false);
        });
      }
    },

    "non-numeric strings": {
      topic: function() {
        var coerceNum = coerce.number();
        return [
          "a",
          "",
          "a4134",
          "e17",
        ].map(coerceNum);
      },
      "should produce NaN": function(numbers) {
        numbers.forEach(function(n) {
          assert.equal(isNaN(n), true);
        });
      }
    },

    "non-numeric strings (default: 0)": {
      topic: function() {
        var coerceNum = coerce.number(0);
        return [
          "a",
          "",
          "a4134",
          "e17",
        ].map(coerceNum);
      },
      "should produce 0": function(numbers) {
        numbers.forEach(function(n) {
          assert.equal(n, 0);
        });
      }
    },

    "integer coersion": {
      topic: function() {
        var coerceInt = coerce.int(0);
        return [
          "1",
          "1000",
          "-200",
          "12e4",
          "4.520983250928",
          "-2598509803948.1"
        ].map(coerceInt);
      },
      "should produce integers": function(numbers) {
        numbers.forEach(function(n) {
          assert.equal(n % 1, 0);
        });
      }
    },

  })
  .addBatch({

    "single-format date coersion": {
      topic: function() {
        var coerceDate = coerce.date("%Y-%m-%d");
        return [
          "2000-01-01",
          "3000-12-31",
        ].map(coerceDate);
      },
      "should produce dates": function(dates) {
        dates.forEach(function(d) {
          assert(d instanceof Date);
        });
      }
    },

    "multi-format date coersion": {
      topic: function() {
        var coerceDate = coerce.date([
          "%Y-%m-%d",
          "%Y-%m-%d %H:%M:%S",
        ]);
        return [
          "2000-01-01",
          "3000-12-31",
          "2000-01-01 12:13:14",
          "3000-12-31 04:19:59",
        ].map(coerceDate);
      },
      "should produce dates": function(dates) {
        dates.forEach(function(d) {
          assert(d instanceof Date);
        });
      }
    },

  })
  .addBatch({

    "object single-key coersion (as string)": {
      topic: function() {
        var coerceKey = coerce.object()
          .key("size", "number");
        return [
          {size: "12"},
          {size: "600"},
          {size: "238792"},
        ].map(coerceKey);
      },
      "should produce numbers": function(objects) {
        objects.forEach(function(d) {
          assert.equal(typeof d.size, "number");
        });
      }
    },

    "object single-key coersion (as function)": {
      topic: function() {
        var coerceKey = coerce.object()
          .key("size", coerce.number());
        return [
          {size: "12"},
          {size: "600"},
          {size: "238792"},
        ].map(coerceKey);
      },
      "should produce numbers": function(objects) {
        objects.forEach(function(d) {
          assert.equal(typeof d.size, "number");
        });
      }
    },

    "object single-key coersion (as inline function)": {
      topic: function() {
        var coerceKey = coerce.object()
          .key("size", function(str, key) {
            assert.equal(key, "size");
            return +str;
          });
        return [
          {size: "12"},
          {size: "600"},
          {size: "238792"},
        ].map(coerceKey);
      },
      "should produce numbers": function(objects) {
        objects.forEach(function(d) {
          assert.equal(typeof d.size, "number");
        });
      }
    },

  })
  .addBatch({

    "money coersion": {
      topic: function() {
        var $ = coerce.money();
        return [
          "$12",
          "$100.58",
          "$1,000,198.58",
        ].map($);
      },
      "should produce numbers": function(numbers) {
        numbers.forEach(function(n) {
          assert.equal(typeof n, "number");
        });
      }
    },

    // TODO more tests here

  })
  .run();
