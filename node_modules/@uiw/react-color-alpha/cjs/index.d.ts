import React from 'react';
import { HsvaColor } from '@uiw/color-convert';
import { type Interaction } from '@uiw/react-drag-event-interactive';
import { type PointerProps } from './Pointer';
import type * as CSS from 'csstype';
export * from './Pointer';
export interface AlphaProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
    prefixCls?: string;
    /** String, Pixel value for picker width. Default `316px` */
    width?: CSS.Properties<string | number>['width'];
    /** String, Pixel value for picker height. Default `16px` */
    height?: CSS.Properties<string | number>['height'];
    /** hsva => `{ h: 0, s: 75, v: 82, a: 1 }` */
    hsva: HsvaColor;
    /** React Component, Custom pointer component */
    pointer?: (props: PointerProps) => JSX.Element;
    /** Set rounded corners. */
    radius?: CSS.Properties<string | number>['borderRadius'];
    /** Set the background color. */
    background?: string;
    /** Set the background element props. */
    bgProps?: React.HTMLAttributes<HTMLDivElement>;
    /** Set the interactive element props. */
    innerProps?: React.HTMLAttributes<HTMLDivElement>;
    pointerProps?: PointerProps;
    /** String Enum, horizontal or vertical. Default `horizontal` */
    direction?: 'vertical' | 'horizontal';
    onChange?: (newAlpha: {
        a: number;
    }, offset: Interaction) => void;
}
export declare const BACKGROUND_IMG = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==";
declare const Alpha: React.ForwardRefExoticComponent<AlphaProps & React.RefAttributes<HTMLDivElement>>;
export default Alpha;
