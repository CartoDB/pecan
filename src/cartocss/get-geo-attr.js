module.exports = function(geometryType) {
  return {
    "line": 'line-color',
    'polygon': "polygon-fill",
    'point': "marker-fill"
  }[geometryType];
};
