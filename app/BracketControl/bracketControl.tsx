import { Stack, useLocalSearchParams } from "expo-router";
import { SafeAreaView, Text } from "react-native";
import { styles } from "../globalStyles";

export default function BracketControl() {

    const { permissionKey } = useLocalSearchParams();

    return(
        <SafeAreaView style={styles.container} >
            <Stack.Screen
                options={{
                title: "Контролен панел"
                }}
            />

            <Text>{permissionKey}</Text>
        </SafeAreaView>
    );
}