import { Text } from "react-native";
import { ActivityIndicator, View } from "react-native";

import colors from "tailwindcss/colors";


export function Loading() {
    return (
        <View className="flex-1 mt-32 items-center justify-center bg-gray-200">
            <ActivityIndicator color={colors.blue[700]} size={42} />
        </View>
    )
}