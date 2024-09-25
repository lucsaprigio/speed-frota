import { useTypeServicesDatabase } from "@/src/databases/type-service/useTypeServicesDatabase";
import { userSessionDatabase } from "@/src/databases/users/userSessionDatabase";
import { formatDate } from "@/src/utils/functions/dateFormatted";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, BackHandler, Image, Modal, Text, View } from "react-native";
import { GestureHandlerRootView, TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "tailwindcss/colors";

import Hatchback from "../../../../assets/images/hatchback.png";
import Road from "../../../../assets/images/estrada.png";
import Services from "../../../../assets/images/servico.png";
import Provider from "../../../../assets/images/servicos-profissionais.png";
import User from "../../../../assets/images/user.png";

export default function Home() {
    const router = useRouter();

    const [day, setDay] = useState(0);
    const [weekDay, setWeekday] = useState('');
    const [month, setMonth] = useState('');
    const [modalLoading, setModalLoading] = useState(false);
    const [username, setUsername] = useState('');

    const typeServiceDatabase = useTypeServicesDatabase();
    const sessionDatabase = userSessionDatabase();

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

    async function createDefaultService() {
        try {
            const serviceExists = await typeServiceDatabase.listAllTypeService();

            if (serviceExists.length === 0) {
                setModalLoading(true)
                for (let i = 0; servicesDefault.length > i; i++) {
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

    async function getUserInfo() {
        try {
            const response = await sessionDatabase.find();

            setUsername(response[0].username);
        } catch (error) {
            console.log(error);
        }
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
        getUserInfo();
        createDefaultService();

        const disableBackHandler = () => {
            return true;
        };

        BackHandler.addEventListener('hardwareBackPress', disableBackHandler);

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', disableBackHandler);
        };
    }, []);

    return (
        <>
            <Modal visible={modalLoading} animationType="fade" transparent>
                <View className="flex-1 items-center justify-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }} >
                    <ActivityIndicator color={colors.blue[700]} size={42} />
                    <Text className="text-lg font-subtitle text-white">Cadastrando Serviços...</Text>
                </View>
            </Modal>
            <GestureHandlerRootView>
                <SafeAreaView className="flex flex-row justify-between bg-blue-950 py-14 px-4">
                    <View className="flex flex-row items-center justify-center">
                        <TouchableOpacity className="flex items-center p-1 m-3 rounded-full" activeOpacity={0.5}>
                            <Image className="w-10 h-10" source={User} />
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
                <View className="flex-1 p-3 bg-gray-200">
                    <Text className="text-lg font-heading p-3">Selecione uma das opções abaixo</Text>
                    <View className="flex flex-row flex-wrap items-center justify-start gap-3 mt-8 bg-gray-200">
                        <TouchableOpacity className="flex items-center justify-center w-28 h-28 bg-blue-900 rounded-md border-[1px] border-blue-950"
                            activeOpacity={0.7}
                            onPress={() => { router.push("/vehicles") }}
                        >
                            <Image className="w-10 h-10" resizeMode="contain" source={Hatchback} />
                            <Text className="text-gray-50">Nota Frota</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex items-center justify-center w-28 h-28 bg-blue-900 rounded-md border-[1px] border-blue-950"
                            activeOpacity={0.7}
                            onPress={() => { router.push("/(signed-routes)/fleets") }}
                        >
                            <Image className="w-10 h-10" resizeMode="contain" source={Road} />
                            <Text className="text-gray-50">Frotas</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex items-center justify-center w-28 h-28 bg-blue-900 rounded-md border-[1px] border-blue-950"
                            activeOpacity={0.7}
                            onPress={() => { router.push("/vehicles") }}
                        >
                            <Image className="w-10 h-10" resizeMode="contain" source={Provider} />
                            <Text className="text-gray-50">Provedores</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex items-center justify-center w-28 h-28 bg-blue-900 rounded-md border-[1px] border-blue-950"
                            activeOpacity={0.7}
                            onPress={() => { }}
                        >
                            <Image className="w-10 h-10" resizeMode="contain" source={Services} />
                            <Text className="text-gray-50">Serviços</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </GestureHandlerRootView>
        </>

    )
}