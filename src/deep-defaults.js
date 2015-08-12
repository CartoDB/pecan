
/**
 * Like _.defaults, but also applies to deep object structure.
 *
 * @param {Object} customs
 * @param {Object} defaults
 * @return {Object}
 */
var deepDefaults = function(customs, defaults) {
  var memo = {};

  for (var key in defaults) {
    if (defaults.hasOwnProperty(key)) {
      var defaultsItem = defaults[key];
      var customsItem;

      if (typeof customs === 'object') {
        customsItem = customs[key];
      }

      if (typeof defaultsItem === 'object' && typeof customsItem === 'object') {
        // both defaultsItem and customsItem are objecs, go down one level, set returned result as value for key
        memo[key] = deepDefaults(customsItem, defaultsItem);
      } else if (typeof defaultsItem !== 'object' && customsItem !== undefined) {
        memo[key] = customsItem;
      } else {
        memo[key] = defaultsItem;
      }
    }
  }

  return memo || {};
};

module.exports = deepDefaults;
