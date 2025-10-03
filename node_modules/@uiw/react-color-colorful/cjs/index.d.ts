import React from 'react';
import { type HsvaColor, type ColorResult } from '@uiw/color-convert';
export interface ColorfulProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'color'> {
    prefixCls?: string;
    onChange?: (color: ColorResult) => void;
    color?: string | HsvaColor;
    disableAlpha?: boolean;
}
declare const Colorful: React.ForwardRefExoticComponent<ColorfulProps & React.RefAttributes<HTMLDivElement>>;
export default Colorful;
