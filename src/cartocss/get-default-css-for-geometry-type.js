module.exports = function(geometryType) {
  if (geometryType === 'polygon') {
    return [
      'polygon-opacity: 0.7;',
      'line-color: #FFF;',
      'line-width: 0.5;',
      'line-opacity: 1;'
    ];
  } else if (geometryType === 'line') {
    return [
      'line-width: 2;',
      'line-opacity: 0.7;'
    ];
  } else {
    return [
      'marker-fill-opacity: 0.9;',
      'marker-line-color: #FFF;',
      'marker-line-width: 1;',
      'marker-line-opacity: 1;',
      'marker-placement: point;',
      'marker-type: ellipse;',
      'marker-width: 10;',
      'marker-allow-overlap: true;'
    ];
  }
};
