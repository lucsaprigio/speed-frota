import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TextInput, TextInputProps, TouchableOpacity, View } from "react-native";

type InputProps = TextInputProps & {
    title?: string;
    footerTitle?: string;
    inputPassword?: boolean;
}

export function Input({ title, inputPassword = false, footerTitle, ...rest }: InputProps) {
    const [showPassword, setShowPassword] = useState(false);

    function handleShowPassword() {
        setShowPassword(!showPassword);
    }

    return (
        !inputPassword ? (
            <View className="flex items-start justify-center py-2 px-10 gap-1">
                {title && <Text className="text-md">{title}</Text>}
                <TextInput className="w-80 p-2 border-2 border-blue-950 rounded-md text-md" {...rest} />
                {footerTitle && <Text className="text-sm text-gray-400">{footerTitle}</Text>}
            </View>
        ) : (
            <View className="flex items-start justify-center py-2 px-10">
                <TouchableOpacity className="z-10 absolute right-14" activeOpacity={0.7} onPress={handleShowPassword}>
                    <Feather name={!showPassword ? "eye" : 'eye-off'} size={24} />
                </TouchableOpacity>
                <TextInput className="relative w-80 p-2 border-2 border-blue-950 rounded-md text-md" secureTextEntry={showPassword} {...rest} />
                {footerTitle && <Text className="text-sm text-gray-400">{footerTitle}</Text>}
            </View>
        )
    )
}