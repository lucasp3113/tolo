"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard")["default"];
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")["default"];
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = Point;
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _react = _interopRequireWildcard(require("react"));
var _jsxRuntime = require("react/jsx-runtime");
function Point(_ref) {
  var _rectProps$style, _rectProps$style2, _rectProps$style3;
  var style = _ref.style,
    className = _ref.className,
    title = _ref.title,
    checked = _ref.checked,
    color = _ref.color,
    onClick = _ref.onClick,
    rectProps = _ref.rectProps;
  var btn = (0, _react.useRef)(null);
  var handleMouseEnter = (0, _react.useCallback)(function () {
    btn.current.style['transform'] = 'scale(1.2)';
  }, []);
  var handleMouseLeave = (0, _react.useCallback)(function () {
    btn.current.style['transform'] = 'scale(1)';
  }, []);
  var width = (rectProps === null || rectProps === void 0 || (_rectProps$style = rectProps.style) === null || _rectProps$style === void 0 ? void 0 : _rectProps$style.width) || '100%';
  var height = (rectProps === null || rectProps === void 0 || (_rectProps$style2 = rectProps.style) === null || _rectProps$style2 === void 0 ? void 0 : _rectProps$style2.height) || '100%';
  var styleWrapper = (0, _objectSpread2["default"])((0, _objectSpread2["default"])({
    '--circle-point-background-color': '#fff',
    backgroundColor: 'var(--circle-point-background-color)',
    boxSizing: 'border-box',
    transition: 'height 100ms ease 0s, width 100ms ease 0s'
  }, rectProps.style), {}, {
    borderRadius: (rectProps === null || rectProps === void 0 || (_rectProps$style3 = rectProps.style) === null || _rectProps$style3 === void 0 ? void 0 : _rectProps$style3.borderRadius) || '50%',
    height: checked ? height : 0,
    width: checked ? width : 0
  });
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
    ref: btn,
    onClick: onClick,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    title: title,
    className: className,
    style: (0, _objectSpread2["default"])((0, _objectSpread2["default"])({
      padding: 3,
      marginRight: 12,
      marginBottom: 12,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 28,
      height: 28,
      borderRadius: '50%',
      boxSizing: 'border-box',
      transform: 'scale(1)',
      transition: 'transform 100ms ease 0s, box-shadow 100ms ease 0s'
    }, style), {}, {
      boxShadow: "".concat(color, " 0px 0px ").concat(checked ? 5 : 0, "px")
    }),
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)("div", (0, _objectSpread2["default"])((0, _objectSpread2["default"])({}, rectProps), {}, {
      style: styleWrapper
    }))
  });
}
module.exports = exports.default;