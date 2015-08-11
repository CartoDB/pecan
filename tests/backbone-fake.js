// Fake Backbone.Model, to not have to really include any real Backbone lib
module.exports = {
  Model: function(obj) {
    obj.get = function(key) {
      return this[key];
    };
    obj.set = function(key, val) {
      this[key] = val;
      return true;
    };
    return obj;
  }
};
