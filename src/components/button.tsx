import { ReactNode } from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

type ButtonProps = TouchableOpacityProps & {
    children: ReactNode;
}

type ButtonTextProps = {
    children: ReactNode;
}

type ButtonIconProps = {
    children: ReactNode;
}

function Button({ children, ...rest }: ButtonProps) {
    return (
        <TouchableOpacity
            className="w-full bg-blue-950 h-12 rounded-lg items-center justify-center flex-row"
            activeOpacity={0.7}
            {...rest}
        >
            {children}
        </TouchableOpacity>
    )
}

function ButtonText({ children }: ButtonTextProps) {
    return (
        <Text className="text-lg font-body text-gray-50 mr-4">{children}</Text>
    )
}

function ButtonIcon({ children }: ButtonIconProps) {
    return children
}

Button.Text = ButtonText;
Button.Icon = ButtonIcon;

export { Button };