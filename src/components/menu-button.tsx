import { MaterialIcons, Feather } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import colors from "tailwindcss/colors";

type IconButtonProps = TouchableOpacityProps & {
    title: string;
    iconName?: React.ComponentProps<typeof MaterialIcons>['name'];
    iconFeather?: React.ComponentProps<typeof Feather>['name'];
}

export function IconButton({ title, iconName, iconFeather, ...rest }: IconButtonProps) {
    return (
        <TouchableOpacity className="flex items-center justify-center w-28 h-28 bg-blue-950 rounded-md" activeOpacity={0.7}{...rest}>
            {
                !!iconName ? (
                    <MaterialIcons
                        name={iconName}
                        size={24}
                        color={colors.gray[50]}
                    />
                ) : (
                    <Feather
                        name={iconFeather}
                        size={24}
                        color={colors.gray[50]}
                    />
                )

            }
            <Text className="text-gray-50">{title}</Text>
        </TouchableOpacity>
    )
}