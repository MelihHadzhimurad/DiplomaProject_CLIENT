import { router, Stack } from "expo-router";
import { useState } from "react";
import { Pressable, SafeAreaView, Text, TextInput } from "react-native";
import { PaymentAlert, showAlert } from "../Auxiliary/auxiliary";
import { styles } from "../globalStyles";

export default function bracketCheck() {

    const [carId, setCarId] = useState("");

    const makeRequest = async () => {
        try {
            const response = await fetch('https://localhost:7028/fine/checkforfine', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'carId': carId
                })
            });
    
            const result = await response.json();
    
            if(!response.ok) {
                if (response.status === 404){ 
                    showAlert("Няма активни скоби за посочения автомобил")
                    return;
                }
            }
    
            PaymentAlert(result.amount, result.paymentId, router);
    
        }catch(error) {
            showAlert("Грешка!\nОпитайте пак.");
            setCarId("");
        }
    }

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
                onPress={() => makeRequest()}>
                <Text style={styles.button_text}>Провери</Text>
            </Pressable>

        </SafeAreaView>
    );
}