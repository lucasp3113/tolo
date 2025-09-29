"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")["default"];
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard")["default"];
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));
var _react = _interopRequireWildcard(require("react"));
var _colorConvert = require("@uiw/color-convert");
var _reactDragEventInteractive = _interopRequireDefault(require("@uiw/react-drag-event-interactive"));
var _Pointer = require("./Pointer");
var _jsxRuntime = require("react/jsx-runtime");
var _excluded = ["prefixCls", "radius", "pointer", "className", "hue", "style", "hsva", "onChange"];
var Saturation = /*#__PURE__*/_react["default"].forwardRef(function (props, ref) {
  var _hsva$h;
  var _props$prefixCls = props.prefixCls,
    prefixCls = _props$prefixCls === void 0 ? 'w-color-saturation' : _props$prefixCls,
    _props$radius = props.radius,
    radius = _props$radius === void 0 ? 0 : _props$radius,
    pointer = props.pointer,
    className = props.className,
    _props$hue = props.hue,
    hue = _props$hue === void 0 ? 0 : _props$hue,
    style = props.style,
    hsva = props.hsva,
    onChange = props.onChange,
    other = (0, _objectWithoutProperties2["default"])(props, _excluded);
  var containerStyle = (0, _objectSpread2["default"])((0, _objectSpread2["default"])({
    width: 200,
    height: 200,
    borderRadius: radius
  }, style), {}, {
    position: 'relative'
  });
  var handleChange = function handleChange(interaction, event) {
    onChange && hsva && onChange({
      h: hsva.h,
      s: interaction.left * 100,
      v: (1 - interaction.top) * 100,
      a: hsva.a
      // source: 'hsv',
    });
  };
  var handleKeyDown = (0, _react.useCallback)(function (event) {
    if (!hsva || !onChange) return;
    var step = 1; // 1% step for saturation and value
    var newS = hsva.s;
    var newV = hsva.v;
    var changed = false;
    switch (event.key) {
      case 'ArrowLeft':
        newS = Math.max(0, hsva.s - step);
        changed = true;
        event.preventDefault();
        break;
      case 'ArrowRight':
        newS = Math.min(100, hsva.s + step);
        changed = true;
        event.preventDefault();
        break;
      case 'ArrowUp':
        newV = Math.min(100, hsva.v + step);
        changed = true;
        event.preventDefault();
        break;
      case 'ArrowDown':
        newV = Math.max(0, hsva.v - step);
        changed = true;
        event.preventDefault();
        break;
      default:
        return;
    }
    if (changed) {
      onChange({
        h: hsva.h,
        s: newS,
        v: newV,
        a: hsva.a
      });
    }
  }, [hsva, onChange]);
  var pointerElement = (0, _react.useMemo)(function () {
    if (!hsva) return null;
    var comProps = {
      top: "".concat(100 - hsva.v, "%"),
      left: "".concat(hsva.s, "%"),
      color: (0, _colorConvert.hsvaToHslaString)(hsva)
    };
    if (pointer && typeof pointer === 'function') {
      return pointer((0, _objectSpread2["default"])({
        prefixCls: prefixCls
      }, comProps));
    }
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Pointer.Pointer, (0, _objectSpread2["default"])({
      prefixCls: prefixCls
    }, comProps));
  }, [hsva, pointer, prefixCls]);
  var handleClick = (0, _react.useCallback)(function (event) {
    event.target.focus();
  }, []);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactDragEventInteractive["default"], (0, _objectSpread2["default"])((0, _objectSpread2["default"])({
    className: [prefixCls, className || ''].filter(Boolean).join(' ')
  }, other), {}, {
    style: (0, _objectSpread2["default"])((0, _objectSpread2["default"])({
      position: 'absolute',
      inset: 0,
      cursor: 'crosshair',
      backgroundImage: "linear-gradient(0deg, #000, transparent), linear-gradient(90deg, #fff, hsl(".concat((_hsva$h = hsva === null || hsva === void 0 ? void 0 : hsva.h) !== null && _hsva$h !== void 0 ? _hsva$h : hue, ", 100%, 50%))")
    }, containerStyle), {}, {
      outline: 'none'
    }),
    ref: ref,
    onMove: handleChange,
    onDown: handleChange,
    onKeyDown: handleKeyDown,
    onClick: handleClick,
    children: pointerElement
  }));
});
Saturation.displayName = 'Saturation';
var _default = exports["default"] = Saturation;
module.exports = exports.default;