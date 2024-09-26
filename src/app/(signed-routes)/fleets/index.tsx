import { FleetDatabase, useFleetsDatabase } from "@/src/databases/fleets/useFleetsDatabase";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Fleets() {
    const router = useRouter();

    const [fleets, setFleets] = useState<FleetDatabase[]>([]);

    const fleetsDatabase = useFleetsDatabase();

    async function listAll() {
        try {
            const response = await fleetsDatabase.listAllFleets();

            setFleets(response);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        listAll();
    }, []);

    return (
        <>
            <SafeAreaView className="flex flex-row items-center justify-between bg-gray-200 py-12 px-6">
                <TouchableOpacity onPress={() => { router.back() }} activeOpacity={0.7}>
                    <Feather name="arrow-left" size={34} />
                </TouchableOpacity>
                <Text className="font-heading text-center text-3xl">Frotas registradas</Text>
            </SafeAreaView>
            <ScrollView>
                <View className="flex space-y-3 mt-6 p-3">
                    {fleets && fleets.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            className="flex flex-row w-full items-center justify-between space-y-2 p-3 border-[1px] rounded-md bg-blue-800"
                            // onPress={() => router.push({ pathname: "/(signed-routes)/fleets/edit-fleet", params: { id: item.id, description: item.description, provider: item.provider, price: item.price.toFixed(2) } })}
                            activeOpacity={0.7}
                        >
                            <View>
                                <Text className="text-gray-50 font-heading text-lg">Código: {item.id}</Text>
                                <Text className="text-gray-50 font-heading ">Serviço: {item.description}</Text>
                                <Text className="text-gray-50 font-heading">R$ {item.price.toFixed(2)}</Text>
                                <Text className="text-gray-50 font-heading">Prestador: {item.provider}</Text>
                                <Text className="text-gray-50 font-heading">Enviado: {item.sent}</Text>
                            </View>
                            <View className="flex items-center bg-blue-950 p-7 rounded-md">
                                <Text className="text-gray-50 font-heading">{item.model}</Text>
                                <Text className="text-gray-50 font-heading">{item.license_plate}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </>
    )
}