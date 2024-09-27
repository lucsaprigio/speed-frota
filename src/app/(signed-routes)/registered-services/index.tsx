import { CardList } from "@/src/components/card-list";
import { SearchInput } from "@/src/components/search-input";
import { ProviderDatabase, useProvidersDatabase } from "@/src/databases/provider-db/useProvidersDatabase";
import { TypeServiceDatabase, useTypeServicesDatabase } from "@/src/databases/type-service/useTypeServicesDatabase";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisteredServices() {
    const router = useRouter();

    const [providers, setProviders] = useState<TypeServiceDatabase[]>([]);
    const [search, setSearch] = useState('');

    const servicesDatabase = useTypeServicesDatabase();

    const filteredServices = search.length > 0
        ? providers.filter(service => service.description.toLocaleUpperCase().includes(search.toLocaleUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")))
        : [];

    async function handleListServices() {
        try {
            const response = await servicesDatabase.listAllTypeService();

            const servicesUpperCase = response.map(service => ({
                ...service,
                providerName: service.description.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")
            }))

            setProviders(servicesUpperCase);

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        handleListServices();
    }, []);

    return (
        <View className="flex-1 bg-gray-200">
            <SafeAreaView className="flex flex-row items-center justify-between bg-gray-200  py-8 px-6">
                <TouchableOpacity onPress={() => { router.back() }} activeOpacity={0.7}>
                    <Feather name="arrow-left" size={34} />
                </TouchableOpacity>
                <Text className="font-heading text-center text-3xl">Serviços</Text>
                <View></View>
            </SafeAreaView>
            <View className="border-b-[1px] border-gray-300 py-3">
                <SearchInput
                    value={search}
                    onChangeText={setSearch}
                    actionButton={() => { setSearch('') }}
                    isFilled={!!search}
                    placeholder="Pesquisar"
                />
            </View>
            <ScrollView>
                {
                    search !== '' && filteredServices.length > 0 ? (
                        filteredServices.map((provider) => (
                            <CardList
                                key={provider.id}
                                id={Number(provider.id)}
                                description={provider.description}
                            >
                                <Feather name="settings" size={28} />
                            </CardList>
                        ))
                    ) : search !== '' && filteredServices.length === 0 ? (
                        <View className="flex items-center justify-center mt-20">
                            <Text className="text-gray-500 font-body text-md">Sem resultados na pesquisa</Text>
                        </View>
                    ) : (
                        providers.slice(0, 10).map((service) => (  // Mostra apenas os 10 primeiros
                            <CardList
                                key={service.id}
                                id={service.id}
                                type="Serviço"
                                description={service.description}
                            >
                                <Feather name="settings" size={28} />
                            </CardList>
                        ))
                    )
                }
            </ScrollView>
        </View>
    )
}