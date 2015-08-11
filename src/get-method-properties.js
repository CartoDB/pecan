var ramps = require('./cartocss/color-ramps.js');

// TODO: only require the necessary params
module.exports = function(stats) {
  var method;
  var ramp = ramps.blue;
  var name = 'blue';

  if (['A','U'].indexOf(stats.dist_type) != -1) { // apply divergent scheme
    method = stats.jenks;

    if (stats.min < 0 && stats.max > 0){
      ramp = ramps.divergent;
      name = 'spectrum2';
    }
  } else if (stats.dist_type === 'F') {
    method = stats.equalint;
    ramp = ramps.red;
    name = 'red';
  } else if (stats.dist_type === 'J') {
    method = stats.headtails;
    ramp = ramps.blue;
    name = 'blue';
  } else {
    method = stats.headtails;
    ramp = ramps.red;
    name = 'red';
  }

  return {
    name: name,
    ramp: ramp,
    method: method
  };
};
