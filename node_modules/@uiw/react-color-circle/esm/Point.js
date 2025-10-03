import _extends from "@babel/runtime/helpers/extends";
import React, { useRef, useCallback } from 'react';
import { jsx as _jsx } from "react/jsx-runtime";
export default function Point(_ref) {
  var _rectProps$style, _rectProps$style2, _rectProps$style3;
  var {
    style,
    className,
    title,
    checked,
    color,
    onClick,
    rectProps
  } = _ref;
  var btn = useRef(null);
  var handleMouseEnter = useCallback(() => {
    btn.current.style['transform'] = 'scale(1.2)';
  }, []);
  var handleMouseLeave = useCallback(() => {
    btn.current.style['transform'] = 'scale(1)';
  }, []);
  var width = (rectProps == null || (_rectProps$style = rectProps.style) == null ? void 0 : _rectProps$style.width) || '100%';
  var height = (rectProps == null || (_rectProps$style2 = rectProps.style) == null ? void 0 : _rectProps$style2.height) || '100%';
  var styleWrapper = _extends({
    '--circle-point-background-color': '#fff',
    backgroundColor: 'var(--circle-point-background-color)',
    boxSizing: 'border-box',
    transition: 'height 100ms ease 0s, width 100ms ease 0s'
  }, rectProps.style, {
    borderRadius: (rectProps == null || (_rectProps$style3 = rectProps.style) == null ? void 0 : _rectProps$style3.borderRadius) || '50%',
    height: checked ? height : 0,
    width: checked ? width : 0
  });
  return /*#__PURE__*/_jsx("div", {
    ref: btn,
    onClick: onClick,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    title: title,
    className: className,
    style: _extends({
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
    }, style, {
      boxShadow: color + " 0px 0px " + (checked ? 5 : 0) + "px"
    }),
    children: /*#__PURE__*/_jsx("div", _extends({}, rectProps, {
      style: styleWrapper
    }))
  });
}