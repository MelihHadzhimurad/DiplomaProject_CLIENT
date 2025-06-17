import { Stack } from "expo-router";
import { SafeAreaView } from "react-native";

export default function bracketCheck() {
    return(
        <SafeAreaView>
            <Stack.Screen
                options={{ title: "Проверка за скоба" }}
            />

        </SafeAreaView>
    );
}