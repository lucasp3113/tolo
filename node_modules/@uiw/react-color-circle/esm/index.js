import _objectDestructuringEmpty from "@babel/runtime/helpers/objectDestructuringEmpty";
import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";
var _excluded = ["prefixCls", "className", "color", "colors", "rectProps", "pointProps", "style", "onChange"];
import React from 'react';
import { validHex, hsvaToHex, hexToHsva, color as handleColor } from '@uiw/color-convert';
import Swatch from '@uiw/react-color-swatch';
import Point from "./Point.js";
import { jsx as _jsx } from "react/jsx-runtime";
var Circle = /*#__PURE__*/React.forwardRef((props, ref) => {
  var _pointProps$style, _pointProps$style2, _pointProps$style3, _pointProps$style4, _pointProps$style5;
  var {
      prefixCls = 'w-color-circle',
      className,
      color,
      colors = [],
      rectProps = {},
      pointProps = {},
      style = {},
      onChange: _onChange
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded);
  var hsva = typeof color === 'string' && validHex(color) ? hexToHsva(color) : color || {};
  var hex = color ? hsvaToHex(hsva) : '';
  var cls = [prefixCls, className].filter(Boolean).join(' ');
  var clsPoint = [prefixCls + "-point", pointProps == null ? void 0 : pointProps.className].filter(Boolean).join(' ');
  pointProps.style = pointProps.style || {};
  pointProps.style.borderRadius = ((_pointProps$style = pointProps.style) == null ? void 0 : _pointProps$style.borderRadius) || '50%';
  pointProps.style.width = ((_pointProps$style2 = pointProps.style) == null ? void 0 : _pointProps$style2.width) || 26;
  pointProps.style.height = ((_pointProps$style3 = pointProps.style) == null ? void 0 : _pointProps$style3.height) || 26;
  pointProps.style.marginRight = ((_pointProps$style4 = pointProps.style) == null ? void 0 : _pointProps$style4.marginRight) || 0;
  pointProps.style.marginBottom = ((_pointProps$style5 = pointProps.style) == null ? void 0 : _pointProps$style5.marginBottom) || 0;
  style.gap = style.gap || 10;
  return /*#__PURE__*/_jsx(Swatch, _extends({
    ref: ref,
    colors: colors,
    color: hex,
    style: style
  }, other, {
    className: cls,
    rectRender: _ref => {
      var props = _extends({}, (_objectDestructuringEmpty(_ref), _ref));
      return /*#__PURE__*/_jsx(Point, _extends({}, props, pointProps, {
        style: _extends({}, props.style, pointProps.style),
        className: clsPoint,
        rectProps: rectProps
      }));
    },
    onChange: hsvColor => {
      _onChange && _onChange(handleColor(hsvColor));
    }
  }));
});
Circle.displayName = 'Circle';
export default Circle;