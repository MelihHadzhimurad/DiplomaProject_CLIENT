import { router, Stack } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { showAlert } from "../Auxiliary/auxiliary";
import { styles } from "../globalStyles";

export default function login() {

    const[username, setUsername] = useState("");
    const[password, setPassword] = useState("");

    const loginRequest = async () => {
        try {
            const response = await fetch('https://localhost:7028/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: {username},
                    password: {password}
                })
            });

            const result = await response.text()
            
            setPassword("");
            setUsername("");

            if(!response.ok) {
                if (response.status === 404) { showAlert("Невалидни данни!"); }
                else { showAlert("Неуспешно влизане!\nОпитайте пак."); }
            }

            router.push({ pathname: "/BracketControl/scanningScreen",
                          params: { "rawToken": encodeURIComponent(result) }
            });
        }catch(error) { showAlert("Неуспешно влизане!\nОпитайте пак."); }
    };

    return(
        <SafeAreaView style={styles.container}>
            <Stack.Screen
                options={{ title: "Автентикация" }}
            />

            <Text style={styles.input_headers}>Потребителско име:</Text>
            <TextInput
                style={styles.input_fields}
                value={username}
                onChangeText={setUsername} />

            <Text style={styles.input_headers}>Парола:</Text>
            <TextInput 
                style={styles.input_fields}
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword} />
            
            <Pressable
                style={styles.button}
                onPress={() => router.push({ pathname: "/BracketControl/scanningScreen",
                          params: { "rawToken": encodeURIComponent("someKey") }
            })} >
                    <Text style={styles.button_text}>Потвърди</Text>
            </Pressable>
            
        </SafeAreaView>
    );
}