import React from 'react';
import { type ColorResult, type HsvaColor } from '@uiw/color-convert';
import { type SwatchProps, type SwatchRectRenderProps } from '@uiw/react-color-swatch';
export interface CompactProps<T> extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'color'> {
    prefixCls?: string;
    color?: string | HsvaColor;
    colors?: string[];
    onChange?: (color: ColorResult, evn?: T) => void;
    rectRender?: (props: SwatchRectRenderProps) => JSX.Element | undefined;
    rectProps?: SwatchProps['rectProps'];
    addonBefore?: React.ReactNode;
    addonAfter?: React.ReactNode;
}
declare const Compact: React.ForwardRefExoticComponent<CompactProps<React.MouseEvent<HTMLDivElement, MouseEvent>> & React.RefAttributes<HTMLDivElement>>;
export default Compact;
