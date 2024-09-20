import { useEffect, useState } from "react";
import { BackHandler, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { ServiceCard } from "@/src/components/service-card";
import { useVehiclesDatabase, VehiclesDatabase } from "@/src/databases/vehicles/useVehiclesDatabase";

import { userSessionDatabase } from "@/src/databases/users/userSessionDatabase";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

export default function Vehicles() {
    const router = useRouter();


    const [username, setUsername] = useState('');
    const [vehicles, setVehicles] = useState<VehiclesDatabase[]>([]);

    const vehicleDatabase = useVehiclesDatabase();
    const sessionDatabase = userSessionDatabase();



    async function listVehicles() {
        try {
            const response = await vehicleDatabase.listAll();
            setVehicles(response);
        } catch (error) {
            console.log(error);
        }
    }

    async function getUserInfo() {
        try {
            const response = await sessionDatabase.find();

            setUsername(response[0].username);
        } catch (error) {
            console.log(error);
        }
    }

    function handleGoToCreateService(carId: number, plate: string, description: string) {
        return router.push({ pathname: "/service", params: { carId, plate, description } });
    }

    useEffect(() => {
        listVehicles();
        getUserInfo();

        const disableBackHandler = () => {
            return true;
        };

        BackHandler.addEventListener('hardwareBackPress', disableBackHandler);

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', disableBackHandler);
        };
    }, [username]);

    return (
        <GestureHandlerRootView className="bg-gray-100">
            <SafeAreaView className="flex flex-row space-x-24 items-center mt-3 p-4 ">
                <TouchableOpacity onPress={() => { router.back() }} activeOpacity={0.7}>
                    <Feather
                        name="chevron-left"
                        size={24}
                    />
                </TouchableOpacity>
                <Text className="font-heading text-2xl border-b-[1px] border-gray-300">Veículos</Text>
            </SafeAreaView>
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
    )
}