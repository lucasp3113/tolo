import React from 'react';
import { HsvaColor, ColorResult } from '@uiw/color-convert';
import { SwatchProps, SwatchRectRenderProps } from '@uiw/react-color-swatch';
export declare enum GithubPlacement {
    Left = "L",
    LeftTop = "LT",
    LeftBottom = "LB",
    Right = "R",
    RightTop = "RT",
    RightBottom = "RB",
    Top = "T",
    TopRight = "TR",
    TopLeft = "TL",
    Bottom = "B",
    BottomLeft = "BL",
    BottomRight = "BR"
}
export interface GithubRectRenderProps extends SwatchRectRenderProps {
    arrow?: JSX.Element;
}
export interface GithubProps extends Omit<SwatchProps, 'color' | 'onChange'> {
    placement?: GithubPlacement;
    color?: string | HsvaColor;
    showTriangle?: boolean;
    onChange?: (color: ColorResult) => void;
}
declare const Github: React.ForwardRefExoticComponent<GithubProps & React.RefAttributes<HTMLDivElement>>;
export default Github;
