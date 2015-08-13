var test = require('tape');
var Pecan = require('../src/pecan');
var _ = require('underscore');

// just a semantic alias, makes the tests easier to read
var override = _.extend;
var assert = function(t, obj) {
  t.equal(Pecan.hasEnoughToGuess(obj.testData), obj.expectedResult, obj.desc);
};

test('hasEnoughToGuess: insufficient data', function(t) {
  t.plan(4);

  assert(t, {
    desc: 'an argument is required',
    testData: undefined,
    expectedResult: false
  });
  assert(t, {
    desc: 'stats should contain some data points',
    testData: { stats: {} },
    expectedResult: false
  });
  assert(t, {
    desc: 'invalid type',
    testData: { type: 'invalid', stats: {} },
    expectedResult: false
  });
  assert(t, {
    desc: 'valid type but missing stats',
    testData: { type: 'geom', stats: {} },
    expectedResult: false
  });
});

test('hasEnoughToGuess: valid geom stats', function(t) {
  t.plan(5);

  var defaultData = {
    isPointGeometryType: true,
    stats: {
      type: 'geom',
      cluster_rate: 1.0,
      density: 1
    },
  };

  assert(t, {
    desc: 'enough data to guess',
    testData: defaultData,
    expectedResult: true
  });
  assert(t, {
    desc: 'a high enough threshold for min stats density should return different result',
    testData: override(defaultData, {thresholds: { geom: { minStatsDensity: 9000 } }}),
    expectedResult: false
  });
  assert(t, {
    desc: 'should be a point geometry type',
    testData: override(defaultData, {isPointGeometryType: false}),
    expectedResult: false
  });
  assert(t, {
    desc: 'cluster_rate should be above threshold',
    testData: override(defaultData.stats, {cluster_rate: 0.0001, density: 1}),
    expectedResult: false
  });
  assert(t, {
    desc: 'density should be above threshold',
    testData: override(defaultData.stats, {cluster_rate: 1, density: 0.0001}),
    expectedResult: false
  });
});

test('hasEnoughToGuess: valid string stats', function(t) {
  t.plan(2);

  var defaultData = {
    stats: {
      type: 'string',
      weight: 1
    },
  };

  assert(t, {
    desc: 'enough data to guess',
    testData: defaultData,
    expectedResult: true
  });
  assert(t, {
    desc: 'should have a significant weight',
    testData: override(defaultData.stats, {weight: 0}),
    expectedResult: false
  });
});

test('hasEnoughToGuess: valid number data', function(t) {
  t.plan(2);

  var defaultData = {
    stats: {
      type: 'number',
      weight: 1,
      dist_type: 'j',
      distinct: 1,
      count: 10
    },
  };

  assert(t, {
    desc: 'enough data to guess',
    testData: defaultData,
    expectedResult: true
  });
  assert(t, {
    desc: 'should have a significant weight',
    testData: override(defaultData.stats, {weight: 0}),
    expectedResult: false
  });
  // TODO test remaining cases
});

test('hasEnoughToGuess: valid boolean', function(t) {
  t.plan(2);

  var defaultData = {
    stats: {
      type: 'boolean',
      null_ratio: 0.5
    },
  };

  assert(t, {
    desc: 'enough data to guess',
    testData: defaultData,
    expectedResult: true
  });
  assert(t, {
    desc: 'null ratio should be below threshold',
    testData: override(defaultData.stats, {null_ratio: 0.9}),
    expectedResult: false
  });
});

test('hasEnoughToGuess: valid date', function(t) {
  t.plan(3);

  var defaultData = {
    isPointGeometryType: true,
    stats: {
      type: 'date',
      null_ratio: 0.5
    },
  };

  assert(t, {
    desc: 'enough data to guess',
    testData: defaultData,
    expectedResult: true
  });
  assert(t, {
    desc: 'geometry type should be a point',
    testData: override(defaultData, {isPointGeometryType: false}),
    expectedResult: false
  });
  assert(t, {
    desc: 'null ratio should be below threshold',
    testData: override(defaultData.stats, {null_ratio: 0.9}),
    expectedResult: false
  });
});
