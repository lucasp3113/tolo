import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";
var _excluded = ["prefixCls", "className", "hsva", "background", "bgProps", "innerProps", "pointerProps", "radius", "width", "height", "direction", "style", "onChange", "pointer"];
import React, { useCallback } from 'react';
import { hsvaToHslaString } from '@uiw/color-convert';
import Interactive from '@uiw/react-drag-event-interactive';
import { Pointer } from "./Pointer.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export * from "./Pointer.js";
export var BACKGROUND_IMG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==';
var Alpha = /*#__PURE__*/React.forwardRef((props, ref) => {
  var {
      prefixCls = 'w-color-alpha',
      className,
      hsva,
      background,
      bgProps = {},
      innerProps = {},
      pointerProps = {},
      radius = 0,
      width,
      height = 16,
      direction = 'horizontal',
      style,
      onChange,
      pointer
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded);
  var handleChange = offset => {
    onChange && onChange(_extends({}, hsva, {
      a: direction === 'horizontal' ? offset.left : offset.top
    }), offset);
  };
  var colorTo = hsvaToHslaString(Object.assign({}, hsva, {
    a: 1
  }));
  var innerBackground = "linear-gradient(to " + (direction === 'horizontal' ? 'right' : 'bottom') + ", rgba(244, 67, 54, 0) 0%, " + colorTo + " 100%)";
  var comProps = {};
  if (direction === 'horizontal') {
    comProps.left = hsva.a * 100 + "%";
  } else {
    comProps.top = hsva.a * 100 + "%";
  }
  var styleWrapper = _extends({
    '--alpha-background-color': '#fff',
    '--alpha-pointer-background-color': 'rgb(248, 248, 248)',
    '--alpha-pointer-box-shadow': 'rgb(0 0 0 / 37%) 0px 1px 4px 0px',
    borderRadius: radius,
    background: "url(" + BACKGROUND_IMG + ") left center",
    backgroundColor: 'var(--alpha-background-color)'
  }, {
    width,
    height
  }, style, {
    position: 'relative'
  });
  var handleKeyDown = useCallback(event => {
    var step = 0.01; // 1% step
    var currentAlpha = hsva.a;
    var newAlpha = currentAlpha;
    switch (event.key) {
      case 'ArrowLeft':
        if (direction === 'horizontal') {
          newAlpha = Math.max(0, currentAlpha - step);
          event.preventDefault();
        }
        break;
      case 'ArrowRight':
        if (direction === 'horizontal') {
          newAlpha = Math.min(1, currentAlpha + step);
          event.preventDefault();
        }
        break;
      case 'ArrowUp':
        if (direction === 'vertical') {
          newAlpha = Math.max(0, currentAlpha - step);
          event.preventDefault();
        }
        break;
      case 'ArrowDown':
        if (direction === 'vertical') {
          newAlpha = Math.min(1, currentAlpha + step);
          event.preventDefault();
        }
        break;
      default:
        return;
    }
    if (newAlpha !== currentAlpha) {
      var syntheticOffset = {
        left: direction === 'horizontal' ? newAlpha : hsva.a,
        top: direction === 'vertical' ? newAlpha : hsva.a,
        width: 0,
        height: 0,
        x: 0,
        y: 0
      };
      onChange && onChange(_extends({}, hsva, {
        a: newAlpha
      }), syntheticOffset);
    }
  }, [hsva, direction, onChange]);
  var handleClick = useCallback(event => {
    event.target.focus();
  }, []);
  var pointerElement = pointer && typeof pointer === 'function' ? pointer(_extends({
    prefixCls
  }, pointerProps, comProps)) : /*#__PURE__*/_jsx(Pointer, _extends({}, pointerProps, {
    prefixCls: prefixCls
  }, comProps));
  return /*#__PURE__*/_jsxs("div", _extends({}, other, {
    className: [prefixCls, prefixCls + "-" + direction, className || ''].filter(Boolean).join(' '),
    style: styleWrapper,
    ref: ref,
    children: [/*#__PURE__*/_jsx("div", _extends({}, bgProps, {
      style: _extends({
        inset: 0,
        position: 'absolute',
        background: background || innerBackground,
        borderRadius: radius
      }, bgProps.style)
    })), /*#__PURE__*/_jsx(Interactive, _extends({}, innerProps, {
      style: _extends({}, innerProps.style, {
        inset: 0,
        zIndex: 1,
        position: 'absolute',
        outline: 'none'
      }),
      onMove: handleChange,
      onDown: handleChange,
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      children: pointerElement
    }))]
  }));
});
Alpha.displayName = 'Alpha';
export default Alpha;