"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")["default"];
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EyeDropper = EyeDropper;
exports.getIsEyeDropperSupported = getIsEyeDropperSupported;
var _react = _interopRequireDefault(require("react"));
var _jsxRuntime = require("react/jsx-runtime");
function getIsEyeDropperSupported() {
  return 'EyeDropper' in window;
}
function EyeDropper(props) {
  var click = function click() {
    if ('EyeDropper' in window) {
      var eyeDropper = new window.EyeDropper();
      eyeDropper.open().then(function (result) {
        var _props$onPickColor;
        (_props$onPickColor = props.onPickColor) === null || _props$onPickColor === void 0 || _props$onPickColor.call(props, result.sRGBHex);
      })["catch"](function (err) {
        if (err.name === 'AbortError') {} else {}
      });
    }
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("svg", {
    viewBox: "0 0 512 512",
    height: "1em",
    width: "1em",
    onClick: click,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)("path", {
      fill: "currentColor",
      d: "M482.8 29.23c38.9 38.98 38.9 102.17 0 141.17L381.2 271.9l9.4 9.5c12.5 12.5 12.5 32.7 0 45.2s-32.7 12.5-45.2 0l-160-160c-12.5-12.5-12.5-32.7 0-45.2s32.7-12.5 45.2 0l9.5 9.4L341.6 29.23c39-38.974 102.2-38.974 141.2 0zM55.43 323.3 176.1 202.6l45.3 45.3-120.7 120.7c-3.01 3-4.7 7-4.7 11.3V416h36.1c4.3 0 8.3-1.7 11.3-4.7l120.7-120.7 45.3 45.3-120.7 120.7c-15 15-35.4 23.4-56.6 23.4H89.69l-39.94 26.6c-12.69 8.5-29.59 6.8-40.377-4-10.786-10.8-12.459-27.7-3.998-40.4L32 422.3v-42.4c0-21.2 8.43-41.6 23.43-56.6z"
    })
  });
}