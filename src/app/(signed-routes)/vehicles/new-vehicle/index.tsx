import { Button } from "@/src/components/button";
import { Input } from "@/src/components/input";
import { useVehiclesDatabase } from "@/src/databases/vehicles/useVehiclesDatabase";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "tailwindcss/colors";

export default function NewVehicle() {
    const router = useRouter();

    const [licensePlate, setLicensePlate] = useState("");
    const [model, setModel] = useState("");

    const vehiclesDatabase = useVehiclesDatabase();

    async function createVehicle() {
        try {
            const response = await vehiclesDatabase.createAuto({
                model: model,
                license_plate: licensePlate
            });

            Alert.alert("Veiculo cadastrado com sucesso!", `O veiculo ${response.lastInsertedRowId} foi adicionado ao dispositivo.`,
                [
                    {
                        text: "Ok",
                        onPress: () => { router.back() }
                    }
                ])
        } catch (error) {
            Alert.alert("Ocorreu um erro", `${error}`)
        }
    }

    return (
        <ScrollView>
            <KeyboardAvoidingView>

                <SafeAreaView className="flex items-center justify-center py-14 bg-gray-200">
                    <Text className="text-3xl font-heading">Novo veiculo</Text>
                </SafeAreaView>
                <View className="flex-1 items-center justify-center mt-20">
                    <Input
                        placeholder="Modelo"
                        title="Modelo"
                        value={model.toUpperCase()}
                        onChangeText={setModel}
                        autoCapitalize="words"
                        autoCorrect={false}
                    />
                    <Input
                        placeholder="Digite a placa"
                        title="Placa"
                        value={licensePlate.toUpperCase()}
                        onChangeText={setLicensePlate}
                        autoCapitalize="words"
                        autoCorrect={false}
                    />
                </View>
                <View className="flex p-6 mt-10">
                    <Button onPress={createVehicle}>
                        <Button.Text>
                            Cadastrar
                        </Button.Text>
                        <Button.Icon>
                            <MaterialIcons name="add-circle" color={colors.gray[50]} size={24} />
                        </Button.Icon>
                    </Button>
                </View>
            </KeyboardAvoidingView>
        </ScrollView>
    )
}