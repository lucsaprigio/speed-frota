import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, BackHandler, Modal, ScrollView, Text, View } from "react-native";
import { GestureHandlerRootView, TouchableOpacity } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { ServiceCard } from "@/src/components/service-card";
import { useVehiclesDatabase, VehiclesDatabase } from "@/src/databases/vehicles/useVehiclesDatabase";
import { formatDate } from "../../../utils/functions/dateFormatted";

import colors from "tailwindcss/colors";
import { userSessionDatabase } from "@/src/databases/users/userSessionDatabase";
import { useTypeServicesDatabase } from "@/src/databases/type-service/useTypeServicesDatabase";
import { Loading } from "@/src/components/loading";

export default function Home() {
    const router = useRouter();

    const [day, setDay] = useState(0);
    const [weekDay, setWeekday] = useState('');
    const [month, setMonth] = useState('');
    const [username, setUsername] = useState('');
    const [vehicles, setVehicles] = useState<VehiclesDatabase[]>([]);
    const [modalLoading, setModalLoading] = useState(false);

    const vehicleDatabase = useVehiclesDatabase();
    const sessionDatabase = userSessionDatabase();
    const typeServiceDatabase = useTypeServicesDatabase();

    const servicesDefault = [
        {
            description: "Abastecimento",
        },
        {
            description: "Manutenção",
        },
        {
            description: "Revisão",
        },
        {
            description: "Limpeza",
        }
    ];

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

    async function getUserInfo() {
        try {
            const response = await sessionDatabase.find();

            setUsername(response[0].username);
        } catch (error) {
            console.log(error);
        }
    }

    async function createDefaultService() {
        try {
            const serviceExists = await typeServiceDatabase.listAllTypeService();

            if (serviceExists.length === 0) {
                setModalLoading(true)
                for (let i = 0; servicesDefault.length >= i; i++) {
                    console.log(servicesDefault[i]);
                    await typeServiceDatabase.createTypeService({
                        description: servicesDefault[i].description
                    });
                }
                setModalLoading(false);
            }

        } catch (error) {
            console.log(error);
        } finally {
            setModalLoading(false);
        }
    }

    function handleGoToCreateService(carId: number, plate: string, description: string) {
        return router.push({ pathname: "/service", params: { carId, plate, description } });
    }

    async function handleLogout() {
        await sessionDatabase.deleteSession();

        Alert.alert('Logout', 'Deseja mesmo sair?', [
            {
                text: "Sair",
                onPress: () => { router.push("/signin") }
            },
            {
                text: "Cancelar",
                style: "cancel"
            }
        ]);
    }

    useEffect(() => {
        handleGetDate();
        listVehicles();
        getUserInfo();
        createDefaultService();

        const disableBackHandler = () => {
            return true;
        };

        BackHandler.addEventListener('hardwareBackPress', disableBackHandler);

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', disableBackHandler);
        };
    }, [username]);

    return (
        <>
            <Modal visible={modalLoading} animationType="fade" transparent>
                <View className="flex-1 items-center justify-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }} >
                    <ActivityIndicator color={colors.blue[700]} size={42} />
                    <Text className="text-lg font-subtitle text-white">Cadastrando Serviços...</Text>
                </View>
            </Modal>
            <GestureHandlerRootView>
                <SafeAreaView className="flex flex-row justify-between bg-blue-950 py-6 px-4 shadow-sm">
                    <View className="flex flex-row items-center justify-center">
                        <TouchableOpacity className="flex items-center p-1 m-3 rounded-full" activeOpacity={0.5}>
                            <Feather name="user" size={38} color={colors.gray[100]} />
                        </TouchableOpacity>
                        <View>
                            <Text className="text-lg font-subtitle text-gray-100">Olá, {username}</Text>
                            <Text className="text-sm text-gray-100">{weekDay}, {day} de {month}</Text>
                        </View>
                    </View>
                    <TouchableOpacity className="flex items-center justify-center" onPress={handleLogout}>
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