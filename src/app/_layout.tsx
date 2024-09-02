import { Slot, useRouter } from "expo-router";

import {
  useFonts,
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold
} from '@expo-google-fonts/roboto';
import { StatusBar } from "expo-status-bar";
import { Loading } from "../components/loading";

// Carregar as fontes antes de iniciar a aplicação
// Obs: Temos que configurar dentro do tailwind.config.js no extend, para fazer junção as fontes com tailwindcss
export default function Layout() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold
  });

  if (!fontsLoaded) {
    return <Loading />
  }

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" />
      <Slot />
    </>
  )
}