"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")["default"];
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.colorKeywordsBase = exports.colorKeywords = exports.baseNamed = void 0;
exports["default"] = colorNameToHex;
var _colorsNamed = _interopRequireDefault(require("colors-named"));
var _colorsNamedHex = _interopRequireDefault(require("colors-named-hex"));
/**
 * Extended color keywords
 * https://www.w3.org/TR/css-color-3/#svg-color
 */
var colorKeywords = exports.colorKeywords = _colorsNamed["default"].reduce(function (obj, key, index) {
  obj[key] = _colorsNamedHex["default"][index];
  return obj;
}, {});
var baseNamed = exports.baseNamed = ['aqua', 'black', 'blue', 'fuchsia', 'gray', 'green', 'lime', 'maroon', 'navy', 'olive', 'purple', 'red', 'silver', 'teal', 'white', 'yellow'];
var colorKeywordsBase = exports.colorKeywordsBase = baseNamed.reduce(function (obj, key) {
  obj[key] = colorKeywords[key];
  return obj;
}, {});
function colorNameToHex(name) {
  return colorKeywords[name];
}