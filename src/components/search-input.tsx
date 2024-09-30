import { Feather } from "@expo/vector-icons";
import { Pressable, TextInput, TextInputProps, View } from "react-native";
import colors from "tailwindcss/colors";

type InputProps = TextInputProps & {
    actionButton: () => void;
    isFilled: boolean;
}

export function SearchInput({ actionButton, isFilled = false, ...rest }: InputProps) {
    return (
        <View className="relative py-2 px-10">
            {
                isFilled &&
                <Pressable className="z-50 absolute right-10 top-5" onPress={actionButton}>
                    <Feather name="x" size={24} color={colors.blue[950]} />
                </Pressable>
            }
            <TextInput className="-z-10 relative w-80 p-2 border-2 border-blue-900 rounded-xl text-md bg-gray-50" {...rest} />
        </View>
    )
}