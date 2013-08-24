var coerce = require("./coerce"),
    util = require("util");

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
