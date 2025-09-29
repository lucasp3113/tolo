import React from 'react';
import type * as CSS from 'csstype';
export interface EditableInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    prefixCls?: string;
    value?: string | number;
    label?: React.ReactNode;
    labelStyle?: CSS.Properties<string | number>;
    placement?: 'top' | 'left' | 'bottom' | 'right';
    inputStyle?: CSS.Properties<string | number>;
    onChange?: (evn: React.ChangeEvent<HTMLInputElement>, value: string | number) => void;
    renderInput?: (props: React.InputHTMLAttributes<HTMLInputElement>, ref: React.Ref<HTMLInputElement>) => React.ReactNode;
}
declare const EditableInput: React.ForwardRefExoticComponent<EditableInputProps & React.RefAttributes<HTMLInputElement>>;
export default EditableInput;
