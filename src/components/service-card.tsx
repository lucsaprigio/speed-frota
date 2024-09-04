import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { TouchableOpacity, TouchableOpacityProps } from "react-native-gesture-handler";

import colors from "tailwindcss/colors";

type Props = TouchableOpacityProps & {
    description: string;
    plate: string;
}

export function ServiceCard({ description, plate, ...rest }: Props) {
    return (
        <TouchableOpacity className="flex flex-row items-center justify-between w-full px-14 py-8 bg-gray-200 rounded-md my-5" {...rest} activeOpacity={0.7}>
            <View className="flex flex-row items-center justify-center space-x-7">
                <MaterialCommunityIcons name="car" color={colors.blue[950]} size={38} />
                <View>
                    <Text className="font-bold text-blue-950 text-left">{description}</Text>
                    <Text className="font-bold text-green-800">{plate}</Text>
                </View>
            </View>
            <View>
            </View>
        </TouchableOpacity>
    )
}