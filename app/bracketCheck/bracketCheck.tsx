import { router, Stack } from "expo-router";
import { useState } from "react";
import { Pressable, SafeAreaView, Text, TextInput } from "react-native";
import { PaymentAlert } from "../Auxiliary/auxiliary";
import { styles } from "../globalStyles";

export default function bracketCheck() {

    const [carId, setCarId] = useState("");

    return(
        <SafeAreaView style={styles.container}>
            <Stack.Screen
                options={{ title: "Проверка за скоба" }}
            />
            <Text style={styles.header}>Въведете регистрационен номер</Text>

            <TextInput 
                style={styles.input_fields}
                value={carId}
                onChangeText={setCarId} />



            <Pressable
                style={styles.button}
                onPress={() => PaymentAlert(40, router)}>
                <Text style={styles.button_text}>Провери</Text>
            </Pressable>

        </SafeAreaView>
    );
}