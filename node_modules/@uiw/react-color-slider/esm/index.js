import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";
var _excluded = ["prefixCls", "className", "style", "onChange", "color", "customColorShades", "lightness"];
import React from 'react';
import { color as handleColor, hexToHsva, hsvaToRgbaString, validHex, hsvaToRgba, rgbaStringToHsva } from '@uiw/color-convert';
import { jsx as _jsx } from "react/jsx-runtime";
var hsvaCheck = color => {
  return typeof color === 'string' && validHex(color) ? hexToHsva(color) : color || {};
};

// Check if values are within specified units of each other
var withinRange = function withinRange(val1, val2, tolerance) {
  if (tolerance === void 0) {
    tolerance = 2;
  }
  return Math.abs(val1 - val2) <= tolerance;
};
var hsvaEqual = (c1, c2, lightnessArray) => {
  // Check for match within 2 units of all properties
  var baseMatch = withinRange(c1.h, c2.h) && withinRange(c1.s, c2.s) && withinRange(c1.a, c2.a);
  var exactMatch = baseMatch && withinRange(c1.v, c2.v);

  // If there's a match within range, return true
  if (exactMatch) return true;

  // If no exact match and a lightness array exists,
  // check if value is within range of any of the lightness array values
  if (lightnessArray) {
    return baseMatch && lightnessArray.some(lightness => withinRange(c2.v, lightness));
  }
  return false;
};
var Slider = /*#__PURE__*/React.forwardRef((props, ref) => {
  var {
      prefixCls = 'w-color-slider',
      className,
      style,
      onChange,
      color,
      customColorShades = [{
        color: '#000000',
        lightness: [50, 40, 30, 20, 10]
      }, {
        color: '#ffffff',
        lightness: [95, 90, 80, 70, 60]
      }],
      lightness = [80, 65, 50, 35, 20]
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded);
  var hsva = hsvaCheck(color);

  // Find matching custom color and its lightness array
  var matchingCustomColor = customColorShades.find(shade => {
    var customHsva = hsvaCheck(shade.color);
    var isMatch = hsvaEqual(customHsva, hsva, shade.lightness);
    return isMatch;
  });

  // Determine which lightness array to use
  var activeLightness = matchingCustomColor ? matchingCustomColor.lightness : lightness;
  var handleClick = (rgbaStr, evn) => {
    var newHsva = rgbaStringToHsva(rgbaStr);
    onChange && onChange(handleColor(newHsva), evn);
  };
  return /*#__PURE__*/_jsx("div", _extends({
    ref: ref,
    style: _extends({
      display: 'flex'
    }, style),
    className: [prefixCls, className || ''].filter(Boolean).join(' ')
  }, other, {
    children: activeLightness.map((num, idx) => {
      var newHsva = _extends({}, hsva, {
        v: num
      });
      var rgba = hsvaToRgba(newHsva);
      var rgbaStr = "rgba(" + rgba.r + ", " + rgba.g + ", " + rgba.b + ", " + rgba.a + ")";
      var checked = rgbaStr === hsvaToRgbaString(hsva);
      return /*#__PURE__*/_jsx("div", {
        style: {
          paddingLeft: 1,
          width: 100 / activeLightness.length + "%",
          boxSizing: 'border-box'
        },
        children: /*#__PURE__*/_jsx("div", {
          onClick: evn => handleClick(rgbaStr, evn),
          style: _extends({
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
export default Slider;