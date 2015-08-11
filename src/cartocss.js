var geoAttr = require('./cartocss/get-geo-attr');
var getDefaultCSSForGeometryType = require('./cartocss/get-default-css-for-geometry-type');
var ramps = require('./cartocss/color-ramps');

module.exports = {
  choropleth: function(quartiles, tableName, prop, geometryType, ramp) {
    var attr = geoAttr(geometryType);
    var tableID = '#' + tableName;

    var defaultCSS = getDefaultCSSForGeometryType(geometryType);
    var css = "/** choropleth visualization */\n\n" + tableID + " {\n  " + attr + ": " + ramp[0] + ";\n" + defaultCSS.join("\n") + "\n}\n";

    for (var i = quartiles.length - 1; i >= 0; --i) {
      if (quartiles[i] !== undefined && quartiles[i] != null) {
        css += "\n" + tableID + "[" + prop + " <= " + quartiles[i] + "] {\n";
        css += '  ' + attr  + ':' + ramp[i] + ";\n}"
      }
    }
    return css;
  },

  categoryMetadata: function(cats, options) {
    var metadata = [];

    var ramp = (options && options.ramp) ? options.ramp : ramps.category;
    var type = options && options.type ? options.type : 'string';

    for (var i = 0; i < cats.length; i++) {
      var cat = cats[i];
      if (i < 10 && cat !== undefined && ((type === 'string' && cat != null) || (type !== 'string'))) {
        metadata.push({
          title: cat,
          title_type: type,
          value_type: 'color',
          color: ramp[i]
        });
      }
    }

    if (cats.length > 10) {
      metadata.push({
        title: 'Others',
        value_type: 'color',
        default: true,
        color: ramp[ramp.length - 1]
      });
    }

    return metadata;
  },

  category: function(cats, tableName, prop, geometryType, options) {
    var attr = geoAttr(geometryType);
    var tableID = '#' + tableName;
    var ramp = ramps.category;
    var name, value;

    var type = options && options.type ? options.type : 'string';
    var ramp = (options && options.ramp) ? options.ramp : ramps.category;

    var defaultCSS = getDefaultCSSForGeometryType(geometryType);

    var css = "/** category visualization */\n\n" + tableID + " {\n  " + attr + ": " + ramp[0] + ";\n" + defaultCSS.join("\n") + "\n}\n";

    for (var i = 0; i < cats.length; i++) {

      var cat = cats[i];

      if (type === 'string') {
        name = cat.replace(/\n/g,'\\n').replace(/\"/g, "\\\"");
        value = "\"" + name + "\"";
      } else {
        value = cat;
      }

      if (i < 10 && cat !== undefined && ((type === 'string' && cat != null) || (type !== 'string'))) {
        css += "\n" + tableID + '[' + prop + '=' + value + "] {\n";
        css += '  ' + attr  + ':' + ramp[i] + ";\n}"
      }
    }

    if (cats.length > 10) {
      css += "\n" + tableID + "{\n";
      css += '  ' + attr  + ': ' + ramp[ramp.length - 1]+ ";\n}"
    }

    return css;
  },

  torque: function(stats, tableName, options){
    var tableID = '#' + tableName;
    var aggFunction = 'count(cartodb_id)';
    var css = [
        '/** torque visualization */',
        'Map {',
        '  -torque-time-attribute: ' + stats.column + ';',
        '  -torque-aggregation-function: "count(cartodb_id)";',
        '  -torque-frame-count: ' + stats.steps + ';',
        '  -torque-animation-duration: 10;',
        '  -torque-resolution: 2;',
        '}',
        tableID + ' {',
        '  marker-width: 3;',
        '  marker-fill-opacity: 0.8;',
        '  marker-fill: #0F3B82; ',
        '  comp-op: "lighten"; ',
        '  [frame-offset = 1] { marker-width: 10; marker-fill-opacity: 0.05;}',
        '  [frame-offset = 2] { marker-width: 15; marker-fill-opacity: 0.02;}',
        '}'
    ];
    css = css.join("\n");

    return css;

  },

  bubble: function(quartiles, tableName, prop) {
    var tableID = '#' + tableName;
    var css = "/** bubble visualization */\n\n" + tableID + " {\n";
    css += getDefaultCSSForGeometryType('point').join("\n");
    css += "\nmarker-fill: #FF5C00;";
    css += "\n}\n\n";

    var min = 10;
    var max = 30;

    var values = [];

    var NPOINS = 10;
    for(var i = 0; i < NPOINS; ++i) {
      var t = i/(NPOINS-1);
      values.push(min + t*(max - min));
    }

    // generate carto
    for(var i = NPOINS - 1; i >= 0; --i) {
      if(quartiles[i] !== undefined && quartiles[i] != null) {
        css += "\n#" + tableName + ' [ ' + prop + ' <= ' + quartiles[i] + "] {\n"
        css += '   marker-width: ' + values[i].toFixed(1) + ";\n}"
      }
    }
    return css;
  },

  heatmap: function(stats, tableName, options){
    var tableID = '#' + tableName;
    var css = [
        '/** heatmap visualization */',
        'Map {',
        '  -torque-time-attribute: "cartodb_id";',
        '  -torque-aggregation-function: "count(cartodb_id)";',
        '  -torque-frame-count: 1;',
        '  -torque-animation-duration: 10;',
        '  -torque-resolution: 2;',
        '}',
        tableID + ' {',
        '  marker-width: 10;',
        '  marker-fill-opacity: 0.4;',
        '  marker-fill: #0F3B82; ',
        '  comp-op: "lighten"; ',
        '  image-filters: colorize-alpha(blue, cyan, lightgreen, yellow , orange, red);',
        '  marker-file: url(http://s3.amazonaws.com/com.cartodb.assets.static/alphamarker.png);',
        '}'
    ];
    css = css.join("\n");
    return css;
  }
};
