import { Slot, Stack } from "expo-router";

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { StatusBar } from "expo-status-bar";
import { Loading } from "../components/loading";
import { SQLiteProvider } from "expo-sqlite";
import { initializeDatabase } from "../databases/initializeDatabase";
import { useEffect } from "react";
import { taskFetch } from "../tasks/backgroundFetch";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Carregar as fontes antes de iniciar a aplicação
// Obs: Temos que configurar dentro do tailwind.config.js no extend, para fazer junção as fontes com tailwindcss
export default function Layout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  useEffect(() => {
    taskFetch();
  }, []);

  if (!fontsLoaded) {
    return <Loading />
  }

  return (
    <SQLiteProvider databaseName="speed.db" onInit={initializeDatabase}>
      <GestureHandlerRootView>
        <StatusBar translucent backgroundColor="transparent" />
        <Stack screenOptions={{ headerShown: false }} />
      </GestureHandlerRootView>
    </SQLiteProvider>
  )
}