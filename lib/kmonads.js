(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["module"], factory);
  } else if (typeof exports !== "undefined") {
    factory(module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod);
    global.kmonads = mod.exports;
  }
})(this, function (module) {
  "use strict";

  /**
   * Convert
   *
   * @param      {Any}  x       anything
   * @return     {Array}  a tuple
   */
  var unit = function unit(x) {
    return [x, [], []];
  };

  module.exports = {
    unit: unit
  };
});