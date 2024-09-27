import { Feather } from "@expo/vector-icons";
import { ReactNode } from "react";
import { Text, View } from "react-native";

type CardProps = {
    id: number | string;
    description: string;
    type?: string;
    children: ReactNode;
}

export function CardList({ id, description, type, children }: CardProps) {
    return (
        <View className="flex flex-row items-center justify-start p-4 border-b-[1px] border-gray-400 space-y-3 border-md">
            <View className="p-3">
                {children}
            </View>
            <View className="flex justify-center items-start">
                {
                    type && <Text className="font-heading text-left text-md">{type}</Text>
                }
                <Text className="font-body text-left text-md"> {id} - {description}</Text>
            </View>
        </View>
    )
}