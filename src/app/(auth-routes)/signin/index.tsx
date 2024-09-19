import { Alert, BackHandler, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LogoImg from "../../../../assets/images/logo-speed-branco.png";
import { Input } from "../../../components/input";
import { Button } from "@/src/components/button";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useUsersDatabase, UserDatabase } from "@/src/databases/users/useUsersDatabase";
import { Picker } from "@react-native-picker/picker";
import { userSessionDatabase } from "@/src/databases/users/userSessionDatabase";
import * as Device from 'expo-device';

export default function SignIn() {
    const router = useRouter();

    const [password, setPassword] = useState("");
    const [userId, setUserId] = useState("");
    const [users, setUsers] = useState<UserDatabase[]>([]);

    const userDatabase = useUsersDatabase();
    const sessionDatabase = userSessionDatabase();

    const deviceId = `${Device.osInternalBuildId.replace(/[-.,_]/g, "")}${Device.totalMemory}${Device.platformApiLevel}`;

    async function handleSignIn(id?: string) {
        try {
            const response = await userDatabase.findById(id.toString());
            console.log(response[0].username);
            await sessionDatabase.deleteSession();

            await sessionDatabase.create({
                id: 1,
                device: deviceId,
                sessionEnd: '09-19-2024',
                user_id: id,
                username: response[0].username
            });

            if (password === '') {
                Alert.alert("Favor digite sua senha.");
                return
            }

            if (response[0].password === password) {
                return router.push("/home");
            } else {
                Alert.alert("Senha incorreta.");
                console.log(password)
            }

        } catch (error) {
            console.log(error);
            Alert.alert('Ocorreu um erro!');
        }
    }

    async function listUsers() {
        try {
            const response = await userDatabase.listAll();

            setUsers(response);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        listUsers();

        const disableBackHandler = () => {
            return true;
        };

        BackHandler.addEventListener('hardwareBackPress', disableBackHandler);

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', disableBackHandler);
        };
    }, [userId]);

    return (
        <View className="flex-1 bg-blue-950">
            <SafeAreaView className="flex items-center justify-center m-10" >
                <Image source={LogoImg} className="w-40 h-40" resizeMode="contain" />
                <Text className="text-3xl text-gray-50 font-heading ">Bem vindo 👋</Text>
            </SafeAreaView>
            <View className="flex items-center justify-center p-8 space-y-10">
                <View className="w-full bg-gray-50 border-[1px] border-blue-950 rounded-md" >
                    <Picker
                        mode="dialog"
                        selectedValue={userId}
                        onValueChange={(itemIndex: string) => {
                            setUserId(itemIndex);
                        }}
                        placeholder="Selecione o operador"
                    >
                        {
                            users.map((user) => (
                                <Picker.Item key={user?.id.toString()} label={user.username.toString()} value={user.id} />
                            ))
                        }
                    </Picker>
                </View>
                <Input
                    placeholder="Digite sua senha"
                    light
                    inputPassword
                    onChangeText={setPassword}
                    value={password}
                    keyboardType="number-pad"
                />
                <View className="w-full">
                    <Button light onPress={() => handleSignIn(userId)}>
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