import { KeyboardAvoidingView } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export function InitialConfig() {
    return (
        <GestureHandlerRootView>
            <KeyboardAvoidingView behavior='position' enabled >
                
            </KeyboardAvoidingView>
        </GestureHandlerRootView>
    )
}