import React from 'react';
export declare function getIsEyeDropperSupported(): boolean;
export interface EyeDropperProps {
    onPickColor?: (color: string) => void;
}
export declare function EyeDropper(props: EyeDropperProps): React.JSX.Element;
