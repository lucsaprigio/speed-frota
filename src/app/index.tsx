import { KeyboardAvoidingView, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Header } from "../components/header";
import { Input } from "../components/input";
import { Button } from "../components/button";
import { TextMaskInput } from "../components/input-mask";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import * as Device from 'expo-device';

export default function InitialConfig() {
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    const md5 = `${Device.osInternalBuildId.replace(/[-.,_]/g, "")}${Device.totalMemory}${Device.platformApiLevel}`;


    function handleRegister() {
        return router.push('/signin');
    }


    return (
        <GestureHandlerRootView>
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
                        value={md5}
                        keyboardType="number-pad"
                        editable
                    />
                    <Input
                        title="Nome"
                        placeholder="Digite seu nome"
                        maxLength={40}
                        value={username}
                        onChangeText={setUsername}
                        autoComplete="additional-name"
                    />
                    <Input
                        title="E-mail"
                        placeholder="email@email.com"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoComplete="email"
                        autoCapitalize="none"
                    />

                    <View className="mt-5 px-4 space-y-2">
                        <Button onPress={handleRegister}>
                            <Button.Text>
                                Cadastrar
                            </Button.Text>
                        </Button>
                    </View>
                    <View className="absolute bottom-0 px-2">
                        <Text className="text-xs text-blue-950">v.1.0.0</Text>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </GestureHandlerRootView>
    )
}