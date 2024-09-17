import { useState, useRef } from "react";
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CameraView, CameraType, useCameraPermissions, Camera } from "expo-camera";
import { Picker } from "@react-native-picker/picker";

import { Button } from "@/src/components/button";
import { Input } from "../../../components/input";
import { Feather } from "@expo/vector-icons";
import { TextMaskInput } from "@/src/components/input-mask";


import colors from "tailwindcss/colors";
import { Modal } from "react-native";
import { Image } from "react-native";


export default function Service() {
    const cameraRef = useRef(null);
    const router = useRouter();
    const { carId, plate, description } = useLocalSearchParams();

    const [price, setPrice] = useState("");
    const [obs, setObs] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [serviceId, setServiceId] = useState('');
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

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

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    function handleSaveService() {
        return console.log(carId, plate, description, price, obs, serviceId)
    }

    async function takePicture() {
        if (cameraRef && cameraRef.current) {
            const data = await cameraRef.current.takePictureAsync({ base64: true });
            console.log(data);
            setCapturedPhoto(data.uri);
            setShowModal(false);
        }
    }

    return (
        <>
            <Modal visible={showModal} animationType="fade" transparent>
                {
                    permission && !permission.granted ? (
                        <View className="flex-1 justify-center px-5">
                            <Text>Precisamos da sua permissão para utilizar a câmera.</Text>
                            <Button onPress={requestPermission}>
                                <Button.Text>
                                    Permitir uso da câmera
                                </Button.Text>
                                <Button.Icon>
                                    <Feather name="check" size={20} />
                                </Button.Icon>
                            </Button>
                        </View>
                    ) : (
                        <View className="flex-1 bg-blue-950">
                            <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
                                <View className="flex flex-row items-center justify-between p-3">
                                    <TouchableOpacity onPress={toggleCameraFacing} activeOpacity={0.7}>
                                        <Feather name="refresh-ccw" size={38} color={colors.gray[50]} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setShowModal(false)} activeOpacity={0.7}>
                                        <Feather name="x-circle" size={38} color={colors.gray[50]} />
                                    </TouchableOpacity>
                                </View>
                            </CameraView>
                            <TouchableOpacity className="flex items-center justify-center rounded-full p-2 m-3" onPress={takePicture}>
                                <Feather name="camera" color={colors.gray[50]} size={40} />
                            </TouchableOpacity>
                        </View>
                    )
                }
            </Modal>
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
                <ScrollView>
                    <View className="p-10">
                        <Text className="">Preencha os campos abaixo para registrar</Text>
                    </View>
                    <View className="border-[1px] border-blue-950 rounded-md px-1 mx-7" >
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

                        {
                            !capturedPhoto ? (
                                <TouchableOpacity className="flex items-center m-3" onPress={() => setShowModal(true)} activeOpacity={0.7}>
                                    <View className="flex items-center justify-center border-[2px] border-blue-950 rounded-md p-3">
                                        <Feather name="camera" size={24} color={colors.blue[950]} />
                                        <Text className="font-body">Enviar comprovante</Text>
                                    </View>
                                </TouchableOpacity>
                            ) : (
                                <View className="flex items-center justify-center">
                                    <Image source={{ uri: capturedPhoto }} resizeMode="contain" style={{ width: "100%", height: 300, borderRadius: 20 }} />
                                </View>
                            )
                        }
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
        </>
    )
}

const styles = StyleSheet.create({
    camera: {
        flex: 1,
        position: "relative"
    }
})