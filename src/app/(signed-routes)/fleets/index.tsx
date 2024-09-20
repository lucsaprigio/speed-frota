import { FleetDatabase, useFleetsDatabase } from "@/src/databases/fleets/useFleetsDatabase";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function Fleets() {
    const [fleets, setFleets] = useState<FleetDatabase[]>([]);

    const fleetsDatabase = useFleetsDatabase();

    async function listAll() {
        try {
            const response = await fleetsDatabase.listAllFleets();

            setFleets(response);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        listAll();
    }, [])

    return (
        <ScrollView>
            <View className="flex-1 items-center justify-center gap-3">
                {fleets && fleets.map((item) => (
                    <View 
                        className="flex items-center justify-center" 
                        key={item.id}>
                        <Text>{item.id}</Text>
                        <Text>{item.description}</Text>
                        <Text>{item.price}</Text>
                        <Text>{item.provider}</Text>
                        <Text>{item.sent}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    )
}