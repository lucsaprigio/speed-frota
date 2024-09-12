import { Alert, KeyboardAvoidingView, ScrollView, Text, View, Modal } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Header } from "../components/header";
import { Input } from "../components/input";
import { Button } from "../components/button";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import * as Device from 'expo-device';

import { useForm } from 'react-hook-form';
import { useUsersDatabase } from "../databases/users/useUsersDatabase";
import { TextMaskInput } from "../components/input-mask";
import { DeviceDatabase, useDeviceDatabase } from "../databases/devices/useDeviceDatabase";
import { api } from "../api/api";
import { Loading } from "../components/loading";
import { Feather } from "@expo/vector-icons";
import colors from "tailwindcss/colors";
import { taskFetch } from "../tasks/backgroundFetch";

export default function InitialConfig() {
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [cnpj, setCnpj] = useState('');

    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [deviceInfo, setDeviceInfo] = useState<DeviceDatabase>({} as DeviceDatabase);
    const [isActive, setIsActive] = useState(false);

    const userDatabase = useUsersDatabase();
    const deviceDatabase = useDeviceDatabase();

    const device = `${Device.osInternalBuildId.replace(/[-.,_]/g, "")}${Device.totalMemory}${Device.platformApiLevel}`;

    async function create() {
        try {
            setLoading(true);

            if(username === '') {
                Alert.alert("O nome de usuário é obrigatório!");
                setLoading(false);
                return;
            }

            if(cnpj.length < 14) {
                Alert.alert("CNPJ inválido!");
                setLoading(false);
                return;
            }

            await userDatabase.create({ username: username.toUpperCase(), cnpj, password: "123456", device });

            const response = await api.post("/api/mobile/", {
                cnpj: cnpj.replace(/[./-]/g, ""),
                md5: device
            });

            if (response.status === 200) {
                await deviceDatabase.createDevice({ id: '1', device, cnpj: cnpj.replace(/[./-]/g, "") });
            }

            Alert.alert("Cadastro realizado com sucesso!", "Suas informações foram salvas.", [
                {
                    text: "Ok",
                    onPress: () => router.push('/signin')
                }
            ]);

            setLoading(false);

        } catch (error) {
            setLoading(false);
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

            if (device.length > 0) {
                setLoading(true);
                setShowModal(true);
                setDeviceInfo(device[0]);

                const response = await api.post("/api/mobile/user", {
                    md5: device[0].device,
                    cnpj: device[0].cnpj
                });

                console.log(response.data.ativo)

                if (response.data.ativo === 'S') {
                    setIsActive(true);
                }

                setLoading(false);
            }

        } catch (error) {
            console.log(error);
            setLoading(true);
        }
    }

    useEffect(() => {
        handleGetActiveDevice();
    }, []);

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
                                {isActive && <Text className="text-green-500 text-lg font-heading">Este dispositivo está ativo ✅</Text>}
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
                            value={device}
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
                            <Button onPress={create} disabled={isActive}>
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