import { useState, useRef, useEffect } from "react";
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View, StyleSheet, Alert } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { Picker } from "@react-native-picker/picker";

import { Button } from "@/src/components/button";
import { Input } from "../../../components/input";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { TextMaskInput } from "@/src/components/input-mask";


import colors from "tailwindcss/colors";
import { Modal } from "react-native";
import { Image } from "react-native";
import { FleetDatabase, useFleetsDatabase } from "@/src/databases/fleets/useFleetsDatabase";
import { TypeServiceDatabase, useTypeServicesDatabase } from "@/src/databases/type-service/useTypeServicesDatabase";


export default function Service() {
    const cameraRef = useRef(null);
    const router = useRouter();
    const { carId, plate, description } = useLocalSearchParams();

    const [price, setPrice] = useState("");
    const [obs, setObs] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [imageModal, setImageModal] = useState(false);
    const [serviceDescription, setServiceDescription] = useState('');
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
    const [typeServices, setTypeServices] = useState<TypeServiceDatabase[]>([]);

    const fleetsDatabase = useFleetsDatabase();
    const typeService = useTypeServicesDatabase();

    async function getTypeServices() {
        try {
            const response = await typeService.listAllTypeService();

            setTypeServices(response);
        } catch (error) {
            Alert.alert('Ocorreu um erro', `${error}`)
        }
    }

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    async function handleSaveService(data: Omit<FleetDatabase, "id">) {
        try {
            const response = await fleetsDatabase.createFleet({
                description: data.description,
                price: Number(data.price),
                vehicle_id: Number(carId),
                obs: obs,
                sent: data.sent
            });

            return Alert.alert('Frota registrada com sucesso', `Frota: ${response} registrada!`);
        } catch (error) {
            Alert.alert('Ocorreu um erro', `${error}`)
        }
    }

    async function takePicture() {
        if (cameraRef && cameraRef.current) {
            const data = await cameraRef.current.takePictureAsync();
            setCapturedPhoto(data.uri);
            setImageModal(true);
        }
    }

    useEffect(() => {
        getTypeServices();
    }, []);

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
                            <Modal visible={imageModal} animationType="slide" transparent>
                                <View className="flex-1 items-between justify-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}>
                                    <View className="flex  items-center justify-between m-6">
                                        <View className="flex flex-row space-x-6">
                                            <TouchableOpacity className="flex-1 items-center w-20 bg-blue-950 p-2 rounded-md" onPress={() => { setShowModal(false), setImageModal(false) }}>
                                                <FontAwesome name="save" color={colors.gray[50]} size={36} />
                                            </TouchableOpacity>
                                            <TouchableOpacity className="flex-1 items-center bg-blue-950 p-2 rounded-md" onPress={() => setImageModal(false)}>
                                                <Feather name="x-circle" color={colors.gray[50]} size={36} />
                                            </TouchableOpacity>
                                        </View>
                                        <View className="w-full m-3">
                                            <Image source={{ uri: capturedPhoto }} resizeMode="contain" style={{ width: "100%", height: 450, borderRadius: 20 }} />
                                        </View>
                                    </View>
                                </View>
                            </Modal>
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
                        </View >
                    )
                }
            </Modal >
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
                            selectedValue={serviceDescription}
                            onValueChange={(item: string) => {
                                setServiceDescription(item)
                            }}
                            placeholder="Selecione o operador"
                        >
                            {
                                typeServices && typeServices.map((service) => (
                                    <Picker.Item key={service.id} label={service.description} value={service.description} />
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
                                <View className="flex items-center justify-center space-y-3">
                                    <Image source={{ uri: capturedPhoto }} resizeMode="contain" style={{ width: "100%", height: 300, borderRadius: 20 }} />
                                    <TouchableOpacity className="flex items-center p-3 border-[1px] border-blue-950 rounded-md" onPress={() => setShowModal(true)}>
                                        <Feather name="camera" size={24} color={colors.blue[950]} />
                                        <Text>Capturar novamente</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        }
                    </View>
                </ScrollView>
                <View className="fixed bottom-0 p-6">
                    <Button onPress={() => { handleSaveService({ description: serviceDescription, price: Number(price), obs: obs, sent: 'N', vehicle_id: Number(carId) }) }}>
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