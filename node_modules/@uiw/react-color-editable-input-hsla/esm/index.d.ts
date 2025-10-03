import React from 'react';
import { type EditableInputRGBAProps } from '@uiw/react-color-editable-input-rgba';
export interface EditableInputHSLAProps extends Omit<EditableInputRGBAProps, 'rProps' | 'gProps' | 'bProps'> {
    hProps?: EditableInputRGBAProps['gProps'];
    sProps?: EditableInputRGBAProps['gProps'];
    lProps?: EditableInputRGBAProps['gProps'];
    aProps?: false | EditableInputRGBAProps['aProps'];
}
declare const EditableInputHSLA: React.ForwardRefExoticComponent<EditableInputHSLAProps & React.RefAttributes<HTMLDivElement>>;
export default EditableInputHSLA;
