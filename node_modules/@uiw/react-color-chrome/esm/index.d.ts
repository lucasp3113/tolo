import React from 'react';
import { type GithubProps } from '@uiw/react-color-github';
export declare enum ChromeInputType {
    HEXA = "hexa",
    RGBA = "rgba",
    HSLA = "hsla"
}
export interface ChromeProps extends Omit<GithubProps, 'colors'> {
    inputType?: ChromeInputType;
    showEditableInput?: boolean;
    showEyeDropper?: boolean;
    showColorPreview?: boolean;
    showHue?: boolean;
    showAlpha?: boolean;
}
declare const Chrome: React.ForwardRefExoticComponent<ChromeProps & React.RefAttributes<HTMLDivElement>>;
export default Chrome;
