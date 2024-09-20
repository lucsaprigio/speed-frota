import { Alert, KeyboardAvoidingView, ScrollView, Text, View, Modal } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Header } from "../components/header";
import { Input } from "../components/input";
import { Button } from "../components/button";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import * as Device from 'expo-device';
import { useUsersDatabase } from "../databases/users/useUsersDatabase";
import { TextMaskInput } from "../components/input-mask";
import { DeviceDatabase, useDeviceDatabase } from "../databases/devices/useDeviceDatabase";
import { api } from "../api/api";
import { Loading } from "../components/loading";
import { Feather } from "@expo/vector-icons";
import colors from "tailwindcss/colors";
import { useVehiclesDatabase } from "../databases/vehicles/useVehiclesDatabase";

export default function InitialConfig() {
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [cnpj, setCnpj] = useState('');

    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [deviceInfo, setDeviceInfo] = useState<DeviceDatabase>({} as DeviceDatabase);
    const [isActive, setIsActive] = useState(false);
    const [buttonEnabled, setButtonEnabled] = useState(true);

    const userDatabase = useUsersDatabase();
    const deviceDatabase = useDeviceDatabase();
    const vehicleDatabase = useVehiclesDatabase();

    const deviceId = `${Device.osInternalBuildId.replace(/[-.,_]/g, "")}${Device.totalMemory}${Device.platformApiLevel}`;

    async function create() {
        try {
            setLoading(true);
            setButtonEnabled(false);

            await deviceDatabase.deleteAllDevices();

            if (username === '') {
                Alert.alert("O nome de usuário é obrigatório!");
                setLoading(false);
                return;
            }

            if (cnpj.length < 14) {
                Alert.alert("CNPJ inválido!");
                setLoading(false);
                return;
            }

            const response = await api.post("/api/mobile/", {
                cnpj: cnpj.replace(/[./-]/g, ""),
                md5: deviceId
            });

            if (response.status === 200) {
                await deviceDatabase.createDevice({ id: '1', device: deviceId, cnpj: cnpj.replace(/[./-]/g, "") });
            }

            Alert.alert("Cadastro realizado com sucesso!", "Suas informações foram enviadas! Vamos notificar assim que você estiver com acesso ao aplicativo.", [
                {
                    text: "Ok",
                }
            ]);

            setLoading(false);
            setCnpj('');
            setUsername('');

        } catch (error) {
            setLoading(false);
            setButtonEnabled(true);
            console.log(error);
            Alert.alert("Ocorreu um erro!", "Verifique as informaçções fornecidas novamente.", [
                {
                    text: "Fechar",
                }
            ]);
        }
    }

    async function handleGetActiveDevice() {
        try {
            const device = await deviceDatabase.listDevice();

            // Se dentro do banco estiver alguma informação, seta no Estado
            if (device.length > 0) {
                const [deviceResponse, fetchResponse] = await Promise.all([
                    api.post("/api/mobile/user", {
                        md5: device[0].device,
                        cnpj: device[0].cnpj
                    }),

                    api.get(`/api/mobile/fetch/${device[0].device}`)
                ]);

                setLoading(true);
                setShowModal(true);
                setButtonEnabled(false);
                setDeviceInfo(device[0]);

                if (deviceResponse.data.ativo === 'S') {
                    setIsActive(true);

                    for (let i = 0; fetchResponse.data.users.length > i; i++) {
                        let user = await userDatabase.findById(fetchResponse.data.users[i].id);

                        if (user.length > 0) {
                            await userDatabase.update({
                                id: Number(fetchResponse.data.users[i].id),
                                username: fetchResponse.data.users[i].username,
                                password: fetchResponse.data.users[i].password
                            });
                        } else {
                            await userDatabase.create({
                                id: Number(fetchResponse.data.users[i].id),
                                username: fetchResponse.data.users[i].username,
                                password: fetchResponse.data.users[i].password
                            });
                        }
                    }

                    for (let i = 0; fetchResponse.data.vehicles.length > i; i++) {
                        let vehicle = await vehicleDatabase.findById(fetchResponse.data.vehicles[i].id);

                        if (vehicle.length > 0) {
                            await vehicleDatabase.update({
                                id: Number(fetchResponse.data.vehicles[i].id),
                                model: fetchResponse.data.vehicles[i].model,
                                license_plate: fetchResponse.data.vehicles[i].license_plate
                            });
                        } else {
                            await vehicleDatabase.create({
                                id: Number(fetchResponse.data.vehicles[i].id),
                                model: fetchResponse.data.vehicles[i].model,
                                license_plate: fetchResponse.data.vehicles[i].license_plate
                            });
                        }

                    }

                }

                setLoading(false);
            }

        } catch (error) {
            if (error.response) {
                Alert.alert("Atenção!! ⚠️ ", `${error.response.data} \nRelize seu cadastro para continuar.`)
            } else {
                Alert.alert("Ocorreu um erro interno! ❌", `${error}`);
            }
            setLoading(false);
        }
    }

    useEffect(() => {
        handleGetActiveDevice();
        setTimeout(() => {
            handleGetActiveDevice();
        }, 600000);
    }, [buttonEnabled]);

    return (
        <>
            <Modal visible={showModal} animationType="fade" transparent>
                <View className="flex h-full justify-center bg-zinc-700 p-3">
                    {
                        loading ? (
                            <Loading />
                        ) : (
                            <View className="flex justify-center items-center bg-gray-50 p-8 rounded-sm space-y-4">
                                <Feather name="info" size={48} color={colors.blue[950]} />
                                <Text className="font-heading text-lg text-center">Encontramos informações cadastradas no seu dispositivo</Text>
                                <Text className="font-body">CNPJ - {deviceInfo.cnpj}</Text>
                                <Text className="font-body">Dispositivo - {deviceInfo.device}</Text>
                                {isActive ? (<Text className="text-green-500 text-lg font-heading">Este dispositivo está ativo ✅</Text>) : (<Text className="text-lg font-heading">Aguardando responsta 🕑</Text>)}
                                {
                                    isActive === true ? (
                                        <Button onPress={() => { router.push("/signin") }}>
                                            <Button.Text>
                                                Continuar
                                            </Button.Text>
                                        </Button>
                                    ) : (
                                        <Button onPress={() => setShowModal(false)}>
                                            <Button.Text>
                                                Fechar
                                            </Button.Text>
                                        </Button>
                                    )
                                }
                            </View>
                        )
                    }
                </View>
            </Modal>
            <GestureHandlerRootView>
                <KeyboardAvoidingView behavior='position' enabled >
                    <Header title="Configuração inicial" />
                    <View className="flex items-center justify-center">
                        <Text className="text-lg m-10 text-center">
                            Preencha os campos abaixo para continuar
                        </Text>
                    </View>

                    <ScrollView>
                        <Input
                            title="MD5"
                            value={deviceId}
                            keyboardType="number-pad"
                            editable
                        />
                        <Input
                            title="Nome"
                            placeholder="Digite seu nome"
                            value={username}
                            onChangeText={setUsername}
                            maxLength={40}
                            autoComplete="additional-name"
                        />
                        <TextMaskInput
                            title="CNPJ"
                            placeholder="00.000.000/0000-00"
                            maxLength={19}
                            value={cnpj}
                            onChangeText={setCnpj}
                            keyboardType="number-pad"
                            mask='99.999.999/9999-99'
                        />

                        <View className="mt-5 px-4 space-y-2">
                            <Button onPress={create} disabled={!buttonEnabled}>
                                <Button.Text>
                                    {
                                        loading === true ? (<Loading />) : (<Text>Cadastrar</Text>)
                                    }
                                </Button.Text>
                            </Button>
                        </View>
                        <View className="absolute bottom-0 px-2">
                            <Text className="text-xs text-blue-950">v.1.0.0</Text>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </GestureHandlerRootView>
        </>
    )
}