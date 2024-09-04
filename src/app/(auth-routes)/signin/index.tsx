import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LogoImg from "../../../../assets/images/logo-speed-branco.png";
import { Input } from "../../../components/input";
import { Button } from "@/src/components/button";
import { useState } from "react";
import { useRouter } from "expo-router";


export default function SignIn() {
    const router = useRouter();

    const [password, setShowPassword] = useState("");

    function handleGoHome() {
        return router.push("/home");
    }

    return (
        <View className="flex-1 bg-blue-950">
            <SafeAreaView className="flex items-center justify-center m-10" >
                <Image source={LogoImg} className="w-40 h-40" resizeMode="contain" />
                <Text className="text-3xl text-gray-50 font-heading ">Bem vindo 👋</Text>
            </SafeAreaView>
            <View className="flex items-center justify-center p-8 space-y-10">
                <Input
                    placeholder="Selecione o usuário..."
                    light
                />
                <Input
                    placeholder="Digite sua senha"
                    light
                    inputPassword
                />
                <View className="w-full">
                    <Button light onPress={handleGoHome}>
                        <Button.Text light>
                            Entrar
                        </Button.Text>
                    </Button>
                </View>
            </View>
            <View className="flex-col items-center justify-center mt-16">
                <Text className="text-gray-50 font-subtitle"> © Powered by Speed Automac</Text>
            </View>
        </View>
    );
}