var getWeightFromShape = require('./get-weight-from-shape');
var deepDefaults = require('./deep-defaults');

var analyzeMethods = {
  geom: function(data) {
    var stats = data.stats;
    return data.isPointGeometryType && stats.cluster_rate * stats.density >= data.thresholds.geom.minStatsDensity;
  },

  string: function(data) {
    return data.stats.weight >= data.thresholds.string.minWeight;
  },

  number: function(data) {
    var stats = data.stats;
    var distinctPercentage = (stats.distinct / stats.count) * 100;
    var calcWeight = (stats.weight + getWeightFromShape(stats.dist_type)) / 2;
    return stats.weight >= data.thresholds.number.minWeight &&
      (
        calcWeight >= data.thresholds.number.minCalcWeight ||
        stats.weight > data.thresholds.number.minWeightIfNoOtherApplies ||
        distinctPercentage < data.thresholds.number.maxDistinctPercentage
      );
  },

  boolean: function(data) {
    return data.stats.null_ratio <= data.thresholds.boolean.maxNullRatio;
  },

  date: function(data) {
    return data.isPointGeometryType && data.stats.null_ratio <= data.thresholds.date.maxNullRatio;
  }
};

/**
 * Check wether the given stats is enough to make guesses for pecan maps.
 * @param {Object} stats Results from a describe call on a table column.
 *   A stats object that lacks any relevant statistics will most likely yield a false.
 * @return {Boolean} true if good enough
 */
module.exports = function(data) {
  var isGoodEnough = false;
  var data = data || {};

  data.thresholds = deepDefaults(data.thresholds, {
    geom: {
      minStatsDensity: 0.1
    },
    string: {
      minWeight: 0.8
    },
    number: {
      minWeight: 0.1,
      minCalcWeight: 0.5,
      maxDistinctPercentage: 25,
      minWeightIfNoOtherApplies: 0.5
    },
    boolean: {
      maxNullRatio: 0.75
    },
    date: {
      maxNullRatio: 0.75
    }
  });

  if (data && data.stats) {
    var method = analyzeMethods[data.stats.type];
    if (typeof method === 'function') {
      isGoodEnough = method.call(this, data);
    }
  }

  return isGoodEnough;
};
