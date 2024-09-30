import { Input } from "@/src/components/input";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditFleet() {
    const { id, description, price, provider } = useLocalSearchParams();

    const [fleetDescription, setFleetDescription] = useState(description.toString());
    const [fleetPrice, setFleetPrice] = useState(price.toString());
    const [fleetProvider, setFleetProvider] = useState(provider as string);
    const router = useRouter();


    return (
        <View className="bg-gradient-to-b from-zinc-50 to-zinc-900">
            <SafeAreaView className="flex flex-row items-center justify-between px-10 py-10 shadow-lg">
                <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
                    <Feather name="chevron-left" size={28} />
                </TouchableOpacity>
                <Text className="font-heading text-3xl">Frota {id} </Text>
                <View></View>
            </SafeAreaView>
            <View className="flex items-center justify-center mt-10 space-y-10">
                <Text className="font-body text-lg mb-5">Dados da frota</Text>
                <Input
                    title="Descrição do serviço"
                    value={fleetDescription}
                    onChangeText={setFleetDescription}
                    editable={false}
                />
                <Input
                    title="Valor (R$)"
                    value={fleetPrice}
                    onChangeText={setFleetPrice}
                    editable={false}
                />
                <Input
                    title="Prestador"
                    value={provider && fleetProvider}
                    onChangeText={setFleetProvider}
                    editable={false}
                />
            </View>
        </View>
    )
} 