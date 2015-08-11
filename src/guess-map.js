var ramps = require('./cartocss/color-ramps');
var getWeightFromShape = require('./get-weight-from-shape');
var getMethodProperties = require('./get-method-properties');
var CSS = require('./cartocss');

/**
 * Get metadata to render a CartoDB map (visualization) from a set of given table and column data, see params.
 *
 * @param {Object} opts hash with following keys:
 *   - tableName: {String}
 *   - column: {Object} hash with following keys:
 *     - stats: {Object} stats as given from a describe call on a SQL API.
 *     - geometryType: {String} e.g. 'points', 'polygon' or similar.
 *     - bbox: {Array[Array]} e.g. [[0.0, 0.1], [1.0, 1.1]]
 *   - dependencies: {Object} hash with following keys:
 *     - underscore: {Object} only used for some column types though, e.g. number, string
 * @return {Object}
 */
module.exports = function(opts) {
  var _ = opts.dependencies.underscore;
  var tableName = opts.tableName;

  var column = opts.column;
  var geometryType = column.geometryType;
  var stats = column.stats;
  var columnName = stats.column;

  var visualizationType = 'choropleth';
  var css = null;
  var type = stats.type;
  var metadata = [];
  var distinctPercentage = (stats.distinct / stats.count) * 100;

  if (type === 'number') {
    var calc_weight = (stats.weight + getWeightFromShape(stats.dist_type)) / 2;

    if (calc_weight >= 0.5) {
      var visFunction = CSS.choropleth;
      var properties = getMethodProperties(stats);

      if (stats.count < 200 && geometryType === 'point'){
        visualizationType = 'bubble';
        visFunction = CSS.bubble;
      }

      css = visFunction(properties.method, tableName, columnName, geometryType, properties.ramp);

    } else if (stats.weight > 0.5 || distinctPercentage < 25) {
      if (distinctPercentage < 1) {
        visualizationType = 'category';

        var cats = stats.cat_hist;
        cats = _.sortBy(cats, function(cat) { return cat[1]; }).reverse().slice(0, ramps.category.length);
        cats = _.sortBy(cats, function(cat) { return cat[0]; });
        cats = cats.map(function(r) { return r[0]; });

        css = CSS.category(cats, tableName, columnName, geometryType, { type: type });
        metadata = CSS.categoryMetadata(cats, { type: type });

      } else if (distinctPercentage >=1) {

        var visFunction = CSS.choropleth;

        if (geometryType === 'point'){
          visualizationType = 'bubble';
          visFunction = CSS.bubble;
        }

        var properties = getMethodProperties(stats);
        css = visFunction(properties.method, tableName, columnName, geometryType, properties.ramp);
      }
    }

  } else if (type === 'string') {
    visualizationType = 'category';

    var cats = stats.hist;
    cats = _.sortBy(cats, function(cat) { return cat[1]; }).reverse().slice(0, ramps.category.length);
    cats = _.sortBy(cats, function(cat) { return cat[0]; });
    cats = cats.map(function(r) { return r[0]; });

    css = CSS.category(cats, tableName, columnName, geometryType);
    metadata = CSS.categoryMetadata(cats);

  } else if (type === 'date') {
    visualizationType = 'torque';
    css = CSS.torque(stats, tableName);

  } else if (type === 'boolean') {
    visualizationType = 'category';
    var ramp = ramps.bool;
    var cats = ['true', 'false', null];
    var options = { type: type, ramp: ramp };
    css = CSS.category(cats, tableName, columnName, geometryType, options);
    metadata = CSS.categoryMetadata(cats, options);

  } else if (stats.type === 'geom') {
    visualizationType = 'heatmap';
    css = CSS.heatmap(stats, tableName, options);
  }

  var properties = {
    geometryType: geometryType,
    column: columnName,
    bbox: column.bbox,
    type: type,
    visualizationType: visualizationType
  };

  if (css) {
    properties.css = css;
  } else {
    properties.css = null;
    properties.weight = -100;
  }

  if (stats) {
    properties.stats = stats;
  }

  if (metadata) {
    properties.metadata = metadata;
  }

  return properties;
};
