import _objectDestructuringEmpty from "@babel/runtime/helpers/objectDestructuringEmpty";
import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";
var _excluded = ["prefixCls", "placement", "className", "style", "color", "colors", "showTriangle", "rectProps", "onChange", "rectRender"];
import React, { Fragment } from 'react';
import { color as handleColor, validHex, hexToHsva, hsvaToHex } from '@uiw/color-convert';
import Swatch from '@uiw/react-color-swatch';
import Point from "./Point.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
var CORLER_HEX = ['#B80000', '#DB3E00', '#FCCB00', '#008B02', '#006B76', '#1273DE', '#004DCF', '#5300EB', '#EB9694', '#FAD0C3', '#FEF3BD', '#C1E1C5', '#BEDADC', '#C4DEF6', '#BED3F3', '#D4C4FB'];
export var GithubPlacement = /*#__PURE__*/function (GithubPlacement) {
  GithubPlacement["Left"] = "L";
  GithubPlacement["LeftTop"] = "LT";
  GithubPlacement["LeftBottom"] = "LB";
  GithubPlacement["Right"] = "R";
  GithubPlacement["RightTop"] = "RT";
  GithubPlacement["RightBottom"] = "RB";
  GithubPlacement["Top"] = "T";
  GithubPlacement["TopRight"] = "TR";
  GithubPlacement["TopLeft"] = "TL";
  GithubPlacement["Bottom"] = "B";
  GithubPlacement["BottomLeft"] = "BL";
  GithubPlacement["BottomRight"] = "BR";
  return GithubPlacement;
}({});
var Github = /*#__PURE__*/React.forwardRef((props, ref) => {
  var {
      prefixCls = 'w-color-github',
      placement = GithubPlacement.TopRight,
      className,
      style,
      color,
      colors = CORLER_HEX,
      showTriangle = true,
      rectProps = {},
      onChange,
      rectRender
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded);
  var hsva = typeof color === 'string' && validHex(color) ? hexToHsva(color) : color;
  var hex = color ? hsvaToHex(hsva) : '';
  var handleChange = hsv => onChange && onChange(handleColor(hsv));
  var styleWrapper = _extends({
    '--github-border': '1px solid rgba(0, 0, 0, 0.2)',
    '--github-background-color': '#fff',
    '--github-box-shadow': 'rgb(0 0 0 / 15%) 0px 3px 12px',
    '--github-arrow-border-color': 'rgba(0, 0, 0, 0.15)',
    width: 200,
    borderRadius: 4,
    background: 'var(--github-background-color)',
    boxShadow: 'var(--github-box-shadow)',
    border: 'var(--github-border)',
    position: 'relative',
    padding: 5
  }, style);
  var rStyle = {
    borderStyle: 'solid',
    position: 'absolute'
  };
  var arrBrStyl = _extends({}, rStyle);
  var arrStyl = _extends({}, rStyle);
  if (/^T/.test(placement)) {
    arrBrStyl.borderWidth = '0 8px 8px';
    arrBrStyl.borderColor = 'transparent transparent var(--github-arrow-border-color)';
    arrStyl.borderWidth = '0 7px 7px';
    arrStyl.borderColor = 'transparent transparent var(--github-background-color)';
  }
  if (placement === GithubPlacement.TopRight) {
    arrBrStyl.top = -8;
    arrStyl.top = -7;
  }
  if (placement === GithubPlacement.Top) {
    arrBrStyl.top = -8;
    arrStyl.top = -7;
  }
  if (placement === GithubPlacement.TopLeft) {
    arrBrStyl.top = -8;
    arrStyl.top = -7;
  }
  if (/^B/.test(placement)) {
    arrBrStyl.borderWidth = '8px 8px 0';
    arrBrStyl.borderColor = 'var(--github-arrow-border-color) transparent transparent';
    arrStyl.borderWidth = '7px 7px 0';
    arrStyl.borderColor = 'var(--github-background-color) transparent transparent';
    if (placement === GithubPlacement.BottomRight) {
      arrBrStyl.top = '100%';
      arrStyl.top = '100%';
    }
    if (placement === GithubPlacement.Bottom) {
      arrBrStyl.top = '100%';
      arrStyl.top = '100%';
    }
    if (placement === GithubPlacement.BottomLeft) {
      arrBrStyl.top = '100%';
      arrStyl.top = '100%';
    }
  }
  if (/^(B|T)/.test(placement)) {
    if (placement === GithubPlacement.Top || placement === GithubPlacement.Bottom) {
      arrBrStyl.left = '50%';
      arrBrStyl.marginLeft = -8;
      arrStyl.left = '50%';
      arrStyl.marginLeft = -7;
    }
    if (placement === GithubPlacement.TopRight || placement === GithubPlacement.BottomRight) {
      arrBrStyl.right = 10;
      arrStyl.right = 11;
    }
    if (placement === GithubPlacement.TopLeft || placement === GithubPlacement.BottomLeft) {
      arrBrStyl.left = 7;
      arrStyl.left = 8;
    }
  }
  if (/^L/.test(placement)) {
    arrBrStyl.borderWidth = '8px 8px 8px 0';
    arrBrStyl.borderColor = 'transparent var(--github-arrow-border-color) transparent transparent';
    arrStyl.borderWidth = '7px 7px 7px 0';
    arrStyl.borderColor = 'transparent var(--github-background-color) transparent transparent';
    arrBrStyl.left = -8;
    arrStyl.left = -7;
  }
  if (/^R/.test(placement)) {
    arrBrStyl.borderWidth = '8px 0 8px 8px';
    arrBrStyl.borderColor = 'transparent transparent transparent var(--github-arrow-border-color)';
    arrStyl.borderWidth = '7px 0 7px 7px';
    arrStyl.borderColor = 'transparent transparent transparent var(--github-background-color)';
    arrBrStyl.right = -8;
    arrStyl.right = -7;
  }
  if (/^(L|R)/.test(placement)) {
    if (placement === GithubPlacement.RightTop || placement === GithubPlacement.LeftTop) {
      arrBrStyl.top = 5;
      arrStyl.top = 6;
    }
    if (placement === GithubPlacement.Left || placement === GithubPlacement.Right) {
      arrBrStyl.top = '50%';
      arrStyl.top = '50%';
      arrBrStyl.marginTop = -8;
      arrStyl.marginTop = -7;
    }
    if (placement === GithubPlacement.LeftBottom || placement === GithubPlacement.RightBottom) {
      arrBrStyl.top = '100%';
      arrStyl.top = '100%';
      arrBrStyl.marginTop = -21;
      arrStyl.marginTop = -20;
    }
  }
  var render = _ref => {
    var props = _extends({}, (_objectDestructuringEmpty(_ref), _ref));
    var handle = rectRender && rectRender(_extends({}, props));
    if (handle) return handle;
    return /*#__PURE__*/_jsx(Point, _extends({}, props, {
      rectProps: rectProps
    }));
  };
  return /*#__PURE__*/_jsx(Swatch, _extends({
    ref: ref,
    className: [prefixCls, className].filter(Boolean).join(' '),
    colors: colors,
    color: hex,
    rectRender: render
  }, other, {
    onChange: handleChange,
    style: styleWrapper,
    rectProps: {
      style: {
        marginRight: 0,
        marginBottom: 0,
        borderRadius: 0,
        height: 25,
        width: 25
      }
    },
    addonBefore: /*#__PURE__*/_jsx(Fragment, {
      children: showTriangle && /*#__PURE__*/_jsxs(Fragment, {
        children: [/*#__PURE__*/_jsx("div", {
          style: arrBrStyl
        }), /*#__PURE__*/_jsx("div", {
          style: arrStyl
        })]
      })
    })
  }));
});
Github.displayName = 'Github';
export default Github;