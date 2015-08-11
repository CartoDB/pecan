module.exports = function(distType) {
  return {
    U: 0.9,
    A: 0.9,
    L: 0.7,
    J: 0.7,
    S: 0.5,
    F: 0.3
  }[distType];
};
