# Coercive
Coercive is a JavaScript toolkit for writing type coercions: functions that parse
strings into other formats with configurable defaults if the string can't be
parsed. Object coercion functions can be used to clean up data (from CSV, or
other string-based formats) by coercing strings into numbers, dates, and more.

![travis-ci](https://api.travis-ci.org/shawnbot/coercive.png)

## Examples
Coercive provides functions for coercing both individual values and keys of
objects. Here are some examples:

```js
// coerce a number or return zero if the result is NaN
var numOrZero = coerce.number(0);
numOrZero("42")   // 42
numOrZero("asdf") // 0

var intOrNull = coerce.int(null);
intOrNull("42")   // 42
intOrNull("asdf") // null

// coerce the "size" key of an object to a float (in place)
var sizeToFloat = coerce.object()
  .key("size", "float");
sizeToFloat({size: "46.5"});  // {"size": 46.5}

// coerce a date string into a Date object:
var parseDate = coerce.date("%Y-%m-%d");
parseDate("2001-10-31") // <Date>
parseDate("asdf")       // null

// you can also create multi-format date coercions, e.g. if your
// data contains messy data in multiple formats
var parseDate = coerce.date([
  "%Y-%m-%d",
  "%d/%m/%Y"
]);
parseDate("2001-10-31") // <Date>
parseDate("13/10/2001") // <Date>

// object coercions have a .map() method, too, just in case
// you don't want to modify the objects in place
var a = {size: "1.4"},
    b = {size: "2.6"};
[a, b].map(sizeToFloat.map);
// produces an array of new objects with coerced keys:
// [{"size": 1.4}, {"size": 2.6}]

// and you can coerce multiple keys like this:
var prepData = coerce.object()
  .keys({
    height: "number",
    weight: "int",
    birthday: coerce.date("%Y-%m-%d")
  });
prepData({
  height: "6.5",
  weight: "250",
  birthday: "1945-12-15"
});
// produces:
// {"height": 6.5, "weight": 250, "birthday": <Date>}
// or, just apply your coersions to a list of data objects,
// e.g. loaded from a CSV file:
d3.csv("path/to/data.csv", function(error, data) {
  data.forEach(prepData);
  // your data should have numbers and Date objects in it now
});
```

## Usage (Node.js)
To use coercive in Node.js:

```sh
$ npm install coercive
```

then, in your script:

```js
var coerce = require("coercive");
```

## Usage (browser)
To use coercive in your browser, just include the script:

```html
<script src="path/to/coercive.js"></script>
```

Note that `coerce.date()` requires [d3](http://d3js.org), so you'll need that, too.
