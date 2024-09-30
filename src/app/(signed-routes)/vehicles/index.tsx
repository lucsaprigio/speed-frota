import { useCallback, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFocusEffect, useRouter } from "expo-router";
import { ServiceCard } from "@/src/components/service-card";
import { useVehiclesDatabase, VehiclesDatabase } from "@/src/databases/vehicles/useVehiclesDatabase";

import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

export default function Vehicles() {
    const router = useRouter();

    const [vehicles, setVehicles] = useState<VehiclesDatabase[]>([]);

    const vehicleDatabase = useVehiclesDatabase();

    async function listVehicles() {
        try {
            const response = await vehicleDatabase.listAll();
            setVehicles(response);
        } catch (error) {
            console.log(error);
        }
    }

    function handleGoToCreateService(carId: number, plate: string, description: string) {
        return router.push({ pathname: "/(signed-routes)/new-service", params: { carId, plate, description } });
    }

    useFocusEffect(useCallback(() => {
        listVehicles();
    }, [])
    );

    return (
        <GestureHandlerRootView className="bg-gray-100">
            <SafeAreaView className="flex flex-row space-x-24 items-center mt-3 p-4 ">
                <TouchableOpacity onPress={() => { router.back() }} activeOpacity={0.7}>
                    <Feather
                        name="chevron-left"
                        size={24}
                    />
                </TouchableOpacity>
                <Text className="font-heading text-2xl border-gray-300">Veículos</Text>
            </SafeAreaView>
            <View className="flex items-center justify-center">
                <Text className="font-body mt-3">Toque para registrar uma frota</Text>
            </View>
            <ScrollView className="px-3 pb-3">
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
    )
}