var getWeightFromShape = require('./get-weight-from-shape');

var analyzeMethods = {
  geom: function(data) {
    var stats = data.stats;
    return data.isPointGeometryType && stats.cluster_rate * stats.density >= 0.1;
  },

  string: function(data) {
    return data.stats.weight >= 0.8;
  },

  number: function(data) {
    var stats = data.stats;
    var distinctPercentage = (stats.distinct / stats.count) * 100;
    var calcWeight = (stats.weight + getWeightFromShape(stats.dist_type)) / 2;
    return stats.weight >= 0.1 && (calcWeight >= 0.5 || stats.weight > 0.5 || distinctPercentage < 25);
  },

  boolean: function(data) {
    return data.stats.null_ratio <= 0.75;
  },

  date: function(data) {
    return data.isPointGeometryType && data.stats.null_ratio <= 0.75;
  }
};

/**
 * Check wether the given stats is enough to make guesses for pecan maps.
 * @param {Object} stats Results from a describe call on a table column.
 *   A stats object that lacks any relevant statistics will most likely yield a false.
 * @param {String} isPointGeometryType Whether the geometry type of the column is a point
 * @return {Boolean} true if good enough
 */
module.exports = function(data) {
  var isGoodEnough = false;

  if (data && data.stats) {
    var method = analyzeMethods[data.stats.type];
    if (typeof method === 'function') {
      isGoodEnough = method.call(this, data);
    }
  }

  return isGoodEnough;
};
