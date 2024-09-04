import { Feather } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import colors from "tailwindcss/colors";


export default function Service() {
    const router = useRouter();
    const { carId, plate, description } = useLocalSearchParams();
    console.log(carId, plate, description)

    function handleSaveService() {
        return console.log(carId, plate, description);
    }

    return (
        <GestureHandlerRootView>
            <SafeAreaView className="flex flex-row justify-between bg-blue-950 py-14 px-4 shadow-sm">
                <TouchableOpacity className="flex items-center justify-center" onPress={() => router.back()}>
                    <Feather name="arrow-left" size={28} color={colors.gray[100]} />
                </TouchableOpacity>
                <View className="flex flex-row items-center justify-center">
                    <Text className="font-heading text-gray-50 text-2xl">{description}</Text>
                </View>
                <View></View>
            </SafeAreaView>
        </GestureHandlerRootView>
    )
}