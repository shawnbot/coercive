all: coercive.min.js

coercive.min.js: coercive.js
	uglifyjs $< > $@

test:
	node tests.js

clean:
	rm -f coercive.min.js
