import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";
var _excluded = ["prefixCls", "radius", "pointer", "className", "hue", "style", "hsva", "onChange"];
import React, { useCallback, useMemo } from 'react';
import { hsvaToHslaString } from '@uiw/color-convert';
import Interactive from '@uiw/react-drag-event-interactive';
import { Pointer } from "./Pointer.js";
import { jsx as _jsx } from "react/jsx-runtime";
var Saturation = /*#__PURE__*/React.forwardRef((props, ref) => {
  var _hsva$h;
  var {
      prefixCls = 'w-color-saturation',
      radius = 0,
      pointer,
      className,
      hue = 0,
      style,
      hsva,
      onChange
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded);
  var containerStyle = _extends({
    width: 200,
    height: 200,
    borderRadius: radius
  }, style, {
    position: 'relative'
  });
  var handleChange = (interaction, event) => {
    onChange && hsva && onChange({
      h: hsva.h,
      s: interaction.left * 100,
      v: (1 - interaction.top) * 100,
      a: hsva.a
      // source: 'hsv',
    });
  };
  var handleKeyDown = useCallback(event => {
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
  var pointerElement = useMemo(() => {
    if (!hsva) return null;
    var comProps = {
      top: 100 - hsva.v + "%",
      left: hsva.s + "%",
      color: hsvaToHslaString(hsva)
    };
    if (pointer && typeof pointer === 'function') {
      return pointer(_extends({
        prefixCls
      }, comProps));
    }
    return /*#__PURE__*/_jsx(Pointer, _extends({
      prefixCls: prefixCls
    }, comProps));
  }, [hsva, pointer, prefixCls]);
  var handleClick = useCallback(event => {
    event.target.focus();
  }, []);
  return /*#__PURE__*/_jsx(Interactive, _extends({
    className: [prefixCls, className || ''].filter(Boolean).join(' ')
  }, other, {
    style: _extends({
      position: 'absolute',
      inset: 0,
      cursor: 'crosshair',
      backgroundImage: "linear-gradient(0deg, #000, transparent), linear-gradient(90deg, #fff, hsl(" + ((_hsva$h = hsva == null ? void 0 : hsva.h) != null ? _hsva$h : hue) + ", 100%, 50%))"
    }, containerStyle, {
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
export default Saturation;