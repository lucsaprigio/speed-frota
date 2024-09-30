import { Alert, KeyboardAvoidingView, ScrollView, Text, View, Modal, TouchableOpacity } from "react-native";
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
import { useProvidersDatabase } from "../databases/provider-db/useProvidersDatabase";

export default function InitialConfig() {
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [cnpj, setCnpj] = useState('');

    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showIpModal, setShowIpModal] = useState(false);
    const [ipApi, setIpApi] = useState("");
    const [deviceInfo, setDeviceInfo] = useState<DeviceDatabase>({} as DeviceDatabase);
    const [isActive, setIsActive] = useState(false);
    const [buttonEnabled, setButtonEnabled] = useState(true);

    const userDatabase = useUsersDatabase();
    const deviceDatabase = useDeviceDatabase();
    const vehicleDatabase = useVehiclesDatabase();
    const providerDatabase = useProvidersDatabase();

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

            const response = await api.post(`${ipApi}:8082/api/mobile/`, {
                cnpj: cnpj.replace(/[./-]/g, ""),
                md5: deviceId.substring(0, 40)
            });

            if (response.status === 200) {
                await deviceDatabase.createDevice({ id: '1', device: deviceId.substring(0, 40), cnpj: cnpj.replace(/[./-]/g, ""), ip_api: ipApi });
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
            Alert.alert("Ocorreu um erro!", `${error}`, [
                {
                    text: "Fechar",
                }
            ]);
        }
    }


    async function handleGetActiveDevice() {
        try {
            const device = await deviceDatabase.listDevice();

            if (!device[0]) {
                setShowIpModal(true);
                // Se dentro do banco estiver alguma informação, seta no Estado
            } else {
                if (device.length > 0) {
                    setDeviceInfo(device[0]);
                    setIpApi(device[0].ip_api);
                    const [deviceResponse, fetchResponse] = await Promise.all([
                        api.post(`${device[0].ip_api}:8082/api/mobile/user`, {
                            md5: device[0].device,
                            cnpj: device[0].cnpj
                        }),

                        api.get(`${device[0].ip_api}:8082/api/mobile/fetch/${device[0].device}`)
                    ]);

                    setLoading(true);
                    setShowModal(true);
                    setButtonEnabled(false);

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

                        for (let i = 0; fetchResponse.data.providers.length > i; i++) {
                            let provider = await providerDatabase.findById(fetchResponse.data.providers[i].id);
                            console.log(provider)

                            if (provider.length > 0) {
                                await providerDatabase.update({
                                    id: Number(fetchResponse.data.providers[i].id),
                                    providerName: fetchResponse.data.providers[i].providerName,
                                });
                            } else {
                                await providerDatabase.create({
                                    id: Number(fetchResponse.data.providers[i].id),
                                    providerName: fetchResponse.data.providers[i].providerName,
                                });
                            }

                        }
                    }

                    setLoading(false);
                }
            }
        } catch (error) {
            if (error.response.data === "Arquivo não encontrado.") {
                Alert.alert("Atenção!! ⚠️ ", `${error.response.data}\nTente novamente mais tarde.`)
            } else if (error.response.data === "Usuário não encontrado") {
                Alert.alert("Atenção!! ⚠️ ", `${error.response.data}\nRealize seu cadastro.`)
            } else {
                Alert.alert("Ocorreu um erro interno! ❌", `Nao foi possível se conectar ao Servidor, verifique o Provedor cadastrado. \n${error}`,
                    [
                        {
                            text: "Alterar endereço IP",
                            onPress: () => setShowIpModal(true)
                        }
                    ]);
            }
        } finally {
            setLoading(false);
        }
    }

    async function deleteDevice() {
        try {
            Alert.alert("Deseja excluir seus dados do dispositivo?", "Somente use essa opção caso não encontrarmos seu usuário, você tem certeza que quer continuar?", [
                {
                    text: "Excluir dados",
                    onPress: async () => { await deviceDatabase.deleteAllDevices(), setDeviceInfo({} as DeviceDatabase) }
                },
                {
                    text: "Não",
                }
            ])
        } catch (error) {
            Alert.alert("Ocorreu um erro !", `${error}`)
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
                <View className="flex h-full justify-center p-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
                    {
                        loading ? (
                            <Loading />
                        ) : (
                            <View className="flex justify-center items-center bg-gray-50 p-8 rounded-sm space-y-4">
                                <Feather name="info" size={48} color={colors.blue[950]} />
                                <Text className="font-heading text-lg text-center">Informações no dispositivo</Text>
                                <Text className="font-body">CNPJ - {!deviceInfo.cnpj ? "Não encontrado" : deviceInfo.cnpj}</Text>
                                <Text className="font-body">Dispositivo - {!deviceInfo.device ? "Não encontrado" : deviceInfo.device}</Text>
                                <Text className="font-body">IP Destino - {!deviceInfo.ip_api ? "Sem " : deviceInfo.ip_api}</Text>
                                {isActive ? (<Text className="text-green-500 text-lg font-heading">Este dispositivo está ativo ✅</Text>) : (<Text className="text-lg font-heading">Aguardando responsta 🕑</Text>)}
                                {
                                    isActive === true ? (
                                        <Button onPress={() => { router.push('/(auth-routes)/signin'), setShowModal(false) }}>
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
                                {
                                    !!deviceInfo.cnpj &&
                                    <TouchableOpacity className="w-full h-12 rounded-lg items-center justify-center flex-row bg-red-400" onPress={() => { deleteDevice() }}>
                                        <Text className="text-lg font-body mr-4">
                                            Excluir dados do dispositivo
                                        </Text>
                                    </TouchableOpacity>
                                }
                            </View>
                        )
                    }
                </View>
            </Modal>
            <Modal visible={showIpModal} animationType="fade" transparent>
                <View className="flex h-full justify-center p-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
                    <View className="flex justify-center items-center bg-gray-50 p-8 rounded-sm space-y-4">
                        <Text className="font-heading text-3xl text-center">⚠️</Text>
                        <Text className="font-heading text-lg text-center">Verifique o provedor de conexão</Text>
                        <Text className="font-heading text-smm text-center">Para conectar ao servidor, preencha um endereço válido.</Text>
                        <Input
                            value={ipApi}
                            onChangeText={setIpApi}
                            placeholder="Ex: http://ddns.com.br"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        <Button onPress={() => { setShowIpModal(false), setLoading(false), setButtonEnabled(true) }}>
                            <Button.Text>
                                Confirmar
                            </Button.Text>
                        </Button>
                    </View>
                </View>
            </Modal>
            <KeyboardAvoidingView behavior='position' enabled >
                <Header title="Configuração inicial" />
                <View className="flex items-center justify-center">
                    <Text className="text-lg m-10 text-center">
                        Preencha os campos abaixo para continuar
                    </Text>
                </View>

                <View>
                    <Input
                        title="MD5"
                        value={deviceId.substring(0, 40)}
                        maxLength={40}
                        keyboardType="number-pad"
                        editable={false}
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
                </View>
                <View className="flex items-center justify-center mt-14">
                    <Text className="font-body text-xs text-blue-950">© Powered by Speed Automac</Text>
                    <Text className="font-body text-xs text-blue-950">v.1.0.1</Text>
                </View>
            </KeyboardAvoidingView>
            <TouchableOpacity className="absolute w-14 h-14 bottom-2 right-2 p-4 rounded-full bg-blue-950" onPress={() => { setShowModal(true) }} activeOpacity={0.7}>
                <Feather name="info" size={24} color={colors.gray[50]} />
            </TouchableOpacity>
        </>
    )
}