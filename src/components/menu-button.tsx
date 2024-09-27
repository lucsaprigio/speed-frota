import { MaterialIcons, Feather } from "@expo/vector-icons";
import { Component, ReactNode } from "react";
import { ImageProps, Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import colors from "tailwindcss/colors";

type IconButtonProps = TouchableOpacityProps & {
    title: string;
    iconName?: React.ComponentProps<typeof MaterialIcons>['name'];
    iconFeather?: React.ComponentProps<typeof Feather>['name'];
    source: ReactNode;
}

export function IconButton({ title, iconName, iconFeather, source, ...rest }: IconButtonProps) {
    return (
        <TouchableOpacity className="flex items-center justify-center w-40 h-40 bg-blue-950 rounded-md" activeOpacity={0.7}{...rest}>
            {source}
            <Text className="text-gray-50">{title}</Text>
        </TouchableOpacity>
    )
}