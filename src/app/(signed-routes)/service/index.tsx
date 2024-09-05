import { Button } from "@/src/components/button";
import { Input } from "../../../components/input";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView, TextInput } from "react-native-gesture-handler";
import { Picker } from "@react-native-picker/picker";

import colors from "tailwindcss/colors";
import { TextMaskInput } from "@/src/components/input-mask";
import { useState } from "react";


export default function Service() {
    const router = useRouter();
    const { carId, plate, description } = useLocalSearchParams();

    const [price, setPrice] = useState("");
    const [obs, setObs] = useState("");
    const [serviceId, setServiceId] = useState('');

    const services = [
        {
            id: "1",
            name: "Abastecimento",
        },
        {
            id: "2",
            name: "Manutenção",
        }
    ]

    function handleSaveService() {
        return console.log(carId, plate, description, price, obs, serviceId)
    }

    return (
        <GestureHandlerRootView>
            <SafeAreaView className="flex flex-row justify-between bg-blue-950 py-14 px-4 shadow-sm">
                <TouchableOpacity className="flex items-center justify-center" onPress={() => router.back()}>
                    <Feather name="arrow-left" size={28} color={colors.gray[100]} />
                </TouchableOpacity>
                <View className="flex flex-row items-center justify-center">
                    <Text className="font-heading text-gray-50 text-2xl">Registrar frota</Text>
                </View>
                <View></View>
            </SafeAreaView>
            <ScrollView className="px-3">
                <View className="p-10">
                    <Text className="">Preencha os campos abaixo para registrar</Text>
                </View>
                <View className="border-[1px] border-blue-950 rounded-md" >
                    <Picker
                        mode="dialog"
                        selectedValue={serviceId}
                        onValueChange={(item: string) => {
                            setServiceId(item)
                        }}
                        placeholder="Selecione o operador"
                    >
                        {
                            services.map((user) => (
                                <Picker.Item key={user?.id} label={user.name} value={user.id} />
                            ))
                        }
                    </Picker>
                </View>
                <View className="mt-6">

                    <Input
                        title="Veículo - Placa"
                        placeholder="Escolha o serviço"
                        value={`${description.toString()} - ${plate}`}
                        editable={false}
                    />

                    <Input
                        title="Observação"
                        placeholder="Obs."
                        value={obs}
                        onChangeText={setObs}
                    />

                    <TextMaskInput
                        title="Valor R$"
                        placeholder="R$ 0,00"
                        type="currency"
                        keyboardType="number-pad"
                        value={price}
                        onChangeText={(text, rawText) => {
                            setPrice(rawText);
                        }}
                        options={{
                            prefix: 'R$',
                            decimalSeparator: '.',
                            groupSeparator: ',',
                            precision: 2
                        }}
                    />
                </View>

            </ScrollView>
            <View className="fixed bottom-0 p-6">
                <Button onPress={handleSaveService}>
                    <Button.Text>
                        Registrar
                    </Button.Text>
                </Button>
            </View>
        </GestureHandlerRootView>
    )
}