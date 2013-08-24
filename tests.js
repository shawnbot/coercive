var vows = require("vows"),
    assert = require("assert"),
    util = require("util"),
    coerce = require("./coerce");

vows.describe("Parsing numbers")
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
  .run();

/*
test("int(0):", coerce.int(0), [
  "1",
  "",
  null
]);

test("date(now):", coerce.date("%Y-%m-%d", new Date()), [
  "2001-09-11",
  "3000-05-12",
  null
]);

test("money:", coerce.money(), [
  "$382",
  "$15,200.00",
  null
]);

test("object {foo: int(0)}",
  coerce.object()
    .key("foo", "int", 0),
  [
    {foo: "12"},
    {foo: "100"},
    {foo: "5"},
    {foo: "6.7"},
    null
  ]);

function test(prefix, coersion, values) {
  values.forEach(function(d) {
    var copy = (typeof d === "object")
      ? util._extend({}, d)
      : d;
    console.log(prefix, JSON.stringify(d), JSON.stringify(coersion(copy)));
  });
}
*/
