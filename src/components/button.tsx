import { ReactNode } from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

type ButtonProps = TouchableOpacityProps & {
    light?: boolean;
    children: ReactNode;
}

type ButtonTextProps = {
    light?: boolean;
    children: ReactNode;
}

type ButtonIconProps = {
    children: ReactNode;
}

function Button({ children, light = false, ...rest }: ButtonProps) {
    return (
        <TouchableOpacity
            className={`w-full h-12 rounded-lg items-center justify-center flex-row ${light === true ? "bg-gray-50" : "bg-blue-950"}`}
            activeOpacity={0.7}
            {...rest}
        >
            {children}
        </TouchableOpacity>
    )
}

function ButtonText({ children, light = false }: ButtonTextProps) {
    return (
        <Text className={`text-lg font-body mr-4 ${light === false ? "text-gray-50" : "text-blue-950"}`}>{children}</Text>
    )
}

function ButtonIcon({ children }: ButtonIconProps) {
    return children
}

Button.Text = ButtonText;
Button.Icon = ButtonIcon;

export { Button };