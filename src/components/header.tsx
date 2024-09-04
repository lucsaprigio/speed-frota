import { View, Text, Image } from "react-native";
import LogoImg from "../../assets/images/logo-speed-branco.png";

type HeaderProps = {
    title: string;
}

export function Header({ title }: HeaderProps) {
    return (
        <View className="flex items-center justify-center h-48 bg-blue-950">
            <Image source={LogoImg} className="w-32 h-32" resizeMode="contain"/>
            <Text className="text-center font-bold text-gray-50 text-2xl">{title}</Text>
        </View>
    )
}