import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, ScrollView, Text, View } from "react-native";
import { GestureHandlerRootView, TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "tailwindcss/colors";
import { formatDate } from "../../../utils/functions/dateFormatted";
import { ServiceCard } from "@/src/components/service-card";
import { useRouter } from "expo-router";

export default function Home() {
    const router = useRouter();

    const [day, setDay] = useState(0);
    const [weekDay, setWeekday] = useState('');
    const [month, setMonth] = useState('');

    async function handleGetDate() {
        const date = formatDate();

        setDay(date.day);
        setWeekday(date.dayOfWeek);
        setMonth(date.month);
    }

    function handleGoToCreateService(carId: string, plate: string, description: string) {
        return router.push({ pathname: "/service", params: { carId, plate, description } });
    }

    useEffect(() => {
        handleGetDate();
    }, []);

    return (
        <GestureHandlerRootView>
            <KeyboardAvoidingView behavior='position' enabled >
                <SafeAreaView className="flex flex-row justify-between bg-blue-950 py-6 px-4 shadow-sm">
                    <View className="flex flex-row items-center justify-center">
                        <TouchableOpacity className="flex items-center p-1 m-3 rounded-full" activeOpacity={0.5}>
                            <Feather name="user" size={38} color={colors.gray[100]} />
                        </TouchableOpacity>
                        <View>
                            <Text className="text-lg font-subtitle text-gray-100">Olá, Usuário</Text>
                            <Text className="text-sm text-gray-100">{weekDay}, {day} de {month}</Text>
                        </View>
                    </View>
                    <TouchableOpacity className="flex items-center justify-center">
                        <Feather name="log-out" size={28} color={colors.gray[100]} />
                    </TouchableOpacity>
                </SafeAreaView>
                <View className="p-4 ">
                    <Text className="font-heading text-2xl border-b-[1px] border-gray-300">Veículos</Text>
                </View>
                <ScrollView className="px-3">
                    <ServiceCard
                        description="MOBI"
                        plate="SRVS-2031"
                        onPress={() => handleGoToCreateService("1", "SRVS-2031", "MOBI")}
                    />
                    <ServiceCard
                        description="Uno"
                        plate="QOEP-2079"
                        onPress={() => handleGoToCreateService("2", "SRVS-2031", "Uno")}
                    />
                    <ServiceCard
                        description="Polo"
                        plate="SPOL-2109"
                        onPress={() => handleGoToCreateService("3", "SPOL-2109", "Polo")}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </GestureHandlerRootView>
    )
}