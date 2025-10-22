import React from 'react';
import { type HsvaColor, type ColorResult } from '@uiw/color-convert';
import { type SwatchProps } from '@uiw/react-color-swatch';
export interface CircleProps extends Omit<SwatchProps, 'color' | 'onChange'> {
    color?: string | HsvaColor;
    onChange?: (color: ColorResult) => void;
    pointProps?: React.HTMLAttributes<HTMLDivElement>;
}
declare const Circle: React.ForwardRefExoticComponent<CircleProps & React.RefAttributes<HTMLDivElement>>;
export default Circle;
