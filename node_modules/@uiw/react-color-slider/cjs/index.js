"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")["default"];
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));
var _react = _interopRequireDefault(require("react"));
var _colorConvert = require("@uiw/color-convert");
var _jsxRuntime = require("react/jsx-runtime");
var _excluded = ["prefixCls", "className", "style", "onChange", "color", "customColorShades", "lightness"];
var hsvaCheck = function hsvaCheck(color) {
  return typeof color === 'string' && (0, _colorConvert.validHex)(color) ? (0, _colorConvert.hexToHsva)(color) : color || {};
};

// Check if values are within specified units of each other
var withinRange = function withinRange(val1, val2) {
  var tolerance = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2;
  return Math.abs(val1 - val2) <= tolerance;
};
var hsvaEqual = function hsvaEqual(c1, c2, lightnessArray) {
  // Check for match within 2 units of all properties
  var baseMatch = withinRange(c1.h, c2.h) && withinRange(c1.s, c2.s) && withinRange(c1.a, c2.a);
  var exactMatch = baseMatch && withinRange(c1.v, c2.v);

  // If there's a match within range, return true
  if (exactMatch) return true;

  // If no exact match and a lightness array exists,
  // check if value is within range of any of the lightness array values
  if (lightnessArray) {
    return baseMatch && lightnessArray.some(function (lightness) {
      return withinRange(c2.v, lightness);
    });
  }
  return false;
};
var Slider = /*#__PURE__*/_react["default"].forwardRef(function (props, ref) {
  var _props$prefixCls = props.prefixCls,
    prefixCls = _props$prefixCls === void 0 ? 'w-color-slider' : _props$prefixCls,
    className = props.className,
    style = props.style,
    onChange = props.onChange,
    color = props.color,
    _props$customColorSha = props.customColorShades,
    customColorShades = _props$customColorSha === void 0 ? [{
      color: '#000000',
      lightness: [50, 40, 30, 20, 10]
    }, {
      color: '#ffffff',
      lightness: [95, 90, 80, 70, 60]
    }] : _props$customColorSha,
    _props$lightness = props.lightness,
    lightness = _props$lightness === void 0 ? [80, 65, 50, 35, 20] : _props$lightness,
    other = (0, _objectWithoutProperties2["default"])(props, _excluded);
  var hsva = hsvaCheck(color);

  // Find matching custom color and its lightness array
  var matchingCustomColor = customColorShades.find(function (shade) {
    var customHsva = hsvaCheck(shade.color);
    var isMatch = hsvaEqual(customHsva, hsva, shade.lightness);
    return isMatch;
  });

  // Determine which lightness array to use
  var activeLightness = matchingCustomColor ? matchingCustomColor.lightness : lightness;
  var handleClick = function handleClick(rgbaStr, evn) {
    var newHsva = (0, _colorConvert.rgbaStringToHsva)(rgbaStr);
    onChange && onChange((0, _colorConvert.color)(newHsva), evn);
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", (0, _objectSpread2["default"])((0, _objectSpread2["default"])({
    ref: ref,
    style: (0, _objectSpread2["default"])({
      display: 'flex'
    }, style),
    className: [prefixCls, className || ''].filter(Boolean).join(' ')
  }, other), {}, {
    children: activeLightness.map(function (num, idx) {
      var newHsva = (0, _objectSpread2["default"])((0, _objectSpread2["default"])({}, hsva), {}, {
        v: num
      });
      var rgba = (0, _colorConvert.hsvaToRgba)(newHsva);
      var rgbaStr = "rgba(".concat(rgba.r, ", ").concat(rgba.g, ", ").concat(rgba.b, ", ").concat(rgba.a, ")");
      var checked = rgbaStr === (0, _colorConvert.hsvaToRgbaString)(hsva);
      return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        style: {
          paddingLeft: 1,
          width: "".concat(100 / activeLightness.length, "%"),
          boxSizing: 'border-box'
        },
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
          onClick: function onClick(evn) {
            return handleClick(rgbaStr, evn);
          },
          style: (0, _objectSpread2["default"])({
            backgroundColor: rgbaStr,
            height: 12,
            cursor: 'pointer'
          }, checked ? {
            borderRadius: 2,
            transform: 'scale(1, 1.5)'
          } : {})
        })
      }, idx);
    })
  }));
});
Slider.displayName = 'Slider';
var _default = exports["default"] = Slider;
module.exports = exports.default;