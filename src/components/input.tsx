import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TextInput, TextInputProps, TouchableOpacity, View } from "react-native";
import colors from "tailwindcss/colors";

type InputProps = TextInputProps & {
    title?: string;
    light?: boolean;
    footerTitle?: string;
    inputPassword?: boolean;
    textEditabled?: boolean;
}

export function Input({ title, inputPassword = false, footerTitle, light = false, textEditabled = true, ...rest }: InputProps) {
    const [showPassword, setShowPassword] = useState(false);

    function handleShowPassword() {
        setShowPassword(!showPassword);
    }

    return (
        light === false ? (
            !inputPassword ? (
                <View className="flex items-start justify-center py-2 px-10 gap-1">
                    {title && <Text className="text-md">{title}</Text>}
                    <TextInput className={`w-80 p-2 border-2 border-blue-950 rounded-md text-md ${textEditabled === false && "opacity-75"}`} placeholderTextColor={colors.gray[400]} {...rest} />
                    {footerTitle && <Text className="text-sm text-gray-400">{footerTitle}</Text>}
                </View>
            ) : (
                <View className="flex items-start justify-center py-2 px-10">
                    <TouchableOpacity className="z-10 absolute right-14" activeOpacity={0.7} onPress={handleShowPassword}>
                        <Feather name={!showPassword ? "eye" : 'eye-off'} size={24} />
                    </TouchableOpacity>
                    <TextInput className="relative w-80 p-2 border-2 border-blue-950 text-blue-950 rounded-md text-md" secureTextEntry={showPassword} {...rest} />
                    {footerTitle && <Text className="text-sm text-gray-400">{footerTitle}</Text>}
                </View>
            )) : (
            !inputPassword ? (
                <View className="flex items-start justify-center py-2 px-10 gap-1">
                    {title && <Text className="text-md">{title}</Text>}
                    <TextInput className="w-80 p-2 border-2 border-blue-900 rounded-md text-md bg-gray-50" {...rest} />
                    {footerTitle && <Text className="text-sm text-blue-950">{footerTitle}</Text>}
                </View>
            ) : (
                <View className="flex items-start justify-center py-2 px-10">
                    <TouchableOpacity className="z-10 absolute right-14 bottom-5" activeOpacity={0.7} onPress={handleShowPassword}>
                        <Feather name={!showPassword ? "eye" : 'eye-off'} size={24} />
                    </TouchableOpacity>
                    <TextInput className="relative w-80 p-2 border-2 border-blue-900 bg-gray-50 rounded-md text-md" secureTextEntry={showPassword} {...rest} />
                    {footerTitle && <Text className="text-sm text-blue-950">{footerTitle}</Text>}
                </View>
            )
        )
    )
}