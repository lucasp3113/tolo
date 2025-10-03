import React from 'react';
import type * as CSS from 'csstype';
export interface PointerProps extends React.HTMLAttributes<HTMLDivElement> {
    prefixCls?: string;
    top?: CSS.Properties<string | number>['top'];
    left: CSS.Properties<string | number>['left'];
    color?: string;
}
export declare const Pointer: ({ className, color, left, top, prefixCls }: PointerProps) => JSX.Element;
