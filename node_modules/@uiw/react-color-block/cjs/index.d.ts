import React from 'react';
import { type HsvaColor, type ColorResult } from '@uiw/color-convert';
export interface BlockProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'color'> {
    prefixCls?: string;
    showTriangle?: boolean;
    color?: string | HsvaColor;
    colors?: string[];
    onChange?: (color: ColorResult) => void;
}
declare const Block: React.ForwardRefExoticComponent<BlockProps & React.RefAttributes<HTMLDivElement>>;
export default Block;
