import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { FlatListComponent, KeyboardAvoidingView, ScrollView, Text, View } from "react-native";
import { FlatList, GestureHandlerRootView, TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "tailwindcss/colors";
import { formatDate } from "../../../utils/functions/dateFormatted";
import { ServiceCard } from "@/src/components/service-card";
import { useRouter } from "expo-router";
import { useVehiclesDatabase, VehiclesDatabase } from "@/src/databases/vehicles/useVehiclesDatabase";

export default function Home() {
    const router = useRouter();

    const [day, setDay] = useState(0);
    const [weekDay, setWeekday] = useState('');
    const [month, setMonth] = useState('');
    const [vehicles, setVehicles] = useState<VehiclesDatabase[]>([]);

    const vehicleDatabase = useVehiclesDatabase();

    async function handleGetDate() {
        const date = formatDate();

        setDay(date.day);
        setWeekday(date.dayOfWeek);
        setMonth(date.month);
    }

    async function listVehicles() {
        try {
            const response = await vehicleDatabase.listAll();

            setVehicles(response);
        } catch (error) {
            console.log(error);
        }
    }

    function handleGoToCreateService(carId: number, plate: string, description: string) {
        return router.push({ pathname: "/service", params: { carId, plate, description } });
    }

    useEffect(() => {
        handleGetDate();
        listVehicles();
    }, []);

    return (
        <>
            <GestureHandlerRootView>
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
                    {
                        vehicles && vehicles.map((item) => (
                            <ServiceCard
                                key={item.id}
                                description={item.model}
                                plate={item.license_plate}
                                onPress={() => handleGoToCreateService(item.id, item.license_plate, item.model)}
                            />
                        ))
                    }
                </ScrollView>
            </GestureHandlerRootView>
        </>
    )
}