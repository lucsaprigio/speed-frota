import { Feather } from "@expo/vector-icons";
import { Pressable, Text, TextInput, TextInputProps, View } from "react-native";
import colors from "tailwindcss/colors";

type InputProps = TextInputProps & {
    title?: string;
    actionButton: () => void;
}

export function ActionInput({ actionButton, title, ...rest }: InputProps) {
    return (
        <View className="flex items-start justify-center">
            <View className="relative py-2 px-10">
                {title && <Text className="text-md">{title}</Text>}
                <Pressable className="z-50 absolute right-14 top-10" onPress={actionButton}>
                    <Feather name="search" size={24} color={colors.blue[950]} />
                </Pressable>
                <TextInput className="-z-10 relative w-80 p-2 border-2 border-blue-900 rounded-md text-md bg-gray-50" {...rest} />
            </View>
        </View>
    )
}