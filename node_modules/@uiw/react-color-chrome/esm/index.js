import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";
var _excluded = ["prefixCls", "className", "style", "color", "showEditableInput", "showEyeDropper", "showColorPreview", "showHue", "showAlpha", "inputType", "rectProps", "onChange"];
import React, { Fragment } from 'react';
import { hsvaToRgbaString, color as handleColor, validHex, hexToHsva, hsvaToHex, hsvaToHexa } from '@uiw/color-convert';
import Github, { GithubPlacement } from '@uiw/react-color-github';
import Saturation from '@uiw/react-color-saturation';
import Hue from '@uiw/react-color-hue';
import Alpha from '@uiw/react-color-alpha';
import EditableInput from '@uiw/react-color-editable-input';
import EditableInputRGBA from '@uiw/react-color-editable-input-rgba';
import EditableInputHSLA from '@uiw/react-color-editable-input-hsla';
import { useState } from 'react';
import Arrow from "./Arrow.js";
import { EyeDropper, getIsEyeDropperSupported } from "./EyeDropper.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export var ChromeInputType = /*#__PURE__*/function (ChromeInputType) {
  ChromeInputType["HEXA"] = "hexa";
  ChromeInputType["RGBA"] = "rgba";
  ChromeInputType["HSLA"] = "hsla";
  return ChromeInputType;
}({});
var Chrome = /*#__PURE__*/React.forwardRef((props, ref) => {
  var {
      prefixCls = 'w-color-chrome',
      className,
      style,
      color,
      showEditableInput = true,
      showEyeDropper = true,
      showColorPreview = true,
      showHue = true,
      showAlpha = true,
      inputType = ChromeInputType.RGBA,
      rectProps = {},
      onChange
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded);
  var hsva = typeof color === 'string' && validHex(color) ? hexToHsva(color) : color || {
    h: 0,
    s: 0,
    l: 0,
    a: 0
  };
  var handleChange = hsv => onChange && onChange(handleColor(hsv));
  var [type, setType] = useState(inputType);
  var handleClick = () => {
    if (type === ChromeInputType.RGBA) {
      setType(ChromeInputType.HSLA);
    }
    if (type === ChromeInputType.HSLA) {
      setType(ChromeInputType.HEXA);
    }
    if (type === ChromeInputType.HEXA) {
      setType(ChromeInputType.RGBA);
    }
  };
  var labelStyle = {
    paddingTop: 6
  };
  var inputStyle = {
    textAlign: 'center',
    paddingTop: 4,
    paddingBottom: 4
  };
  var wrapperStyle = _extends({
    '--chrome-arrow-fill': '#333',
    '--chrome-arrow-background-color': '#e8e8e8',
    borderRadius: 0,
    flexDirection: 'column',
    width: 230,
    padding: 0
  }, style);
  var alphaStyle = {
    '--chrome-alpha-box-shadow': 'rgb(0 0 0 / 25%) 0px 0px 1px inset',
    borderRadius: '50%',
    background: hsvaToRgbaString(hsva),
    boxShadow: 'var(--chrome-alpha-box-shadow)'
  };
  var handleClickColor = hex => {
    var result = hexToHsva(hex);
    handleChange(_extends({}, result));
  };
  var styleSize = {
    height: 14,
    width: 14
  };
  var pointerProps = {
    style: _extends({}, styleSize),
    fillProps: {
      style: styleSize
    }
  };
  return /*#__PURE__*/_jsx(Github, _extends({
    ref: ref,
    color: hsva,
    style: wrapperStyle,
    colors: undefined,
    className: [prefixCls, className].filter(Boolean).join(' '),
    placement: GithubPlacement.TopLeft
  }, other, {
    addonAfter: /*#__PURE__*/_jsxs(Fragment, {
      children: [/*#__PURE__*/_jsx(Saturation, {
        hsva: hsva,
        style: {
          width: '100%',
          height: 130
        },
        onChange: newColor => {
          handleChange(_extends({}, hsva, newColor, {
            a: hsva.a
          }));
        }
      }), /*#__PURE__*/_jsxs("div", {
        style: {
          padding: 15,
          display: 'flex',
          alignItems: 'center',
          gap: 10
        },
        children: [getIsEyeDropperSupported() && showEyeDropper && /*#__PURE__*/_jsx(EyeDropper, {
          onPickColor: handleClickColor
        }), showColorPreview && /*#__PURE__*/_jsx(Alpha, {
          width: 28,
          height: 28,
          hsva: hsva,
          radius: 2,
          style: {
            borderRadius: '50%'
          },
          bgProps: {
            style: {
              background: 'transparent'
            }
          },
          innerProps: {
            style: alphaStyle
          },
          pointer: () => /*#__PURE__*/_jsx(Fragment, {})
        }), /*#__PURE__*/_jsxs("div", {
          style: {
            flex: 1
          },
          children: [showHue == true && /*#__PURE__*/_jsx(Hue, {
            hue: hsva.h,
            style: {
              width: '100%',
              height: 12,
              borderRadius: 2
            },
            pointerProps: pointerProps,
            bgProps: {
              style: {
                borderRadius: 2
              }
            },
            onChange: newHue => {
              handleChange(_extends({}, hsva, newHue));
            }
          }), showAlpha == true && /*#__PURE__*/_jsx(Alpha, {
            hsva: hsva,
            style: {
              marginTop: 6,
              height: 12,
              borderRadius: 2
            },
            pointerProps: pointerProps,
            bgProps: {
              style: {
                borderRadius: 2
              }
            },
            onChange: newAlpha => {
              handleChange(_extends({}, hsva, newAlpha));
            }
          })]
        })]
      }), showEditableInput && /*#__PURE__*/_jsxs("div", {
        style: {
          display: 'flex',
          alignItems: 'flex-start',
          padding: '0 15px 15px 15px',
          userSelect: 'none'
        },
        children: [/*#__PURE__*/_jsxs("div", {
          style: {
            flex: 1
          },
          children: [type == ChromeInputType.RGBA && /*#__PURE__*/_jsx(EditableInputRGBA, {
            hsva: hsva,
            rProps: {
              labelStyle,
              inputStyle
            },
            gProps: {
              labelStyle,
              inputStyle
            },
            bProps: {
              labelStyle,
              inputStyle
            },
            aProps: showAlpha == false ? false : {
              labelStyle,
              inputStyle
            },
            onChange: reColor => handleChange(reColor.hsva)
          }), type === ChromeInputType.HEXA && /*#__PURE__*/_jsx(EditableInput, {
            label: "HEX",
            labelStyle: labelStyle,
            inputStyle: inputStyle,
            value: hsva.a > 0 && hsva.a < 1 ? hsvaToHexa(hsva).toLocaleUpperCase() : hsvaToHex(hsva).toLocaleUpperCase(),
            onChange: (_, value) => {
              if (typeof value === 'string') {
                handleChange(hexToHsva(/^#/.test(value) ? value : "#" + value));
              }
            }
          }), type === ChromeInputType.HSLA && /*#__PURE__*/_jsx(EditableInputHSLA, {
            hsva: hsva,
            hProps: {
              labelStyle,
              inputStyle
            },
            sProps: {
              labelStyle,
              inputStyle
            },
            lProps: {
              labelStyle,
              inputStyle
            },
            aProps: showAlpha == false ? false : {
              labelStyle,
              inputStyle
            },
            onChange: reColor => handleChange(reColor.hsva)
          })]
        }), /*#__PURE__*/_jsx(Arrow, {
          onClick: handleClick
        })]
      })]
    }),
    rectRender: () => /*#__PURE__*/_jsx(Fragment, {})
  }));
});
Chrome.displayName = 'Chrome';
export default Chrome;