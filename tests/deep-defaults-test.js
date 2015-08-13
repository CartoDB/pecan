var test = require('tape');
var deepDefaults = require('../src/deep-defaults');

test('deepDefaults: empty results', function(t) {
  t.plan(2);

  var actual = deepDefaults(undefined, {});
  t.deepEqual(actual, {}, 'customs is not required');

  var actual = deepDefaults(undefined);
  t.deepEqual(actual, {}, 'customs is not required');
});


test('deepDefaults: custom objects', function(t) {
  t.plan(2);

  var customs = {};
  var defaults = {
    number: {
      a: 1,
      b: 2,
      c: {
        d: 3,
        e: 4
      }
    },
    string: {
      f: 5,
    }
  };
  var actual = deepDefaults(customs, defaults);
  t.deepEqual(actual, defaults, 'empty customs should yield all the defaults');

  customs = {
    number: {
      b: 200,
      c: {
        e: 400
      }
    }
  };
  var actual = deepDefaults(customs, defaults);
  var expected = {
    number: {
      a: 1,
      b: 200,
      c: {
        d: 3,
        e: 400
      }
    },
    string: {
      f: 5,
    }
  };
  t.deepEqual(actual, expected, 'customs is not required');
});
