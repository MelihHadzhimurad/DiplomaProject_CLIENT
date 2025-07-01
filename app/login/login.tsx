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
            const response = await fetch('http://192.168.1.15:5291/auth', {
                method: 'POST',
                headers: {
                    'Accept':'text/plain',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userName: username,
                    password: password
                })
            });

            const result = await response.text()
            
            setPassword("");
            setUsername("");

            if(!response.ok) {
                if (response.status === 404) {
                    showAlert("Невалидни данни!");
                    return;
                 }
                else { showAlert(response.status.toString()); return; }
            }

            router.push({ pathname: "/BracketControl/scanningScreen",
                          params: { "rawToken": encodeURIComponent(result) }
            });
        }catch(error) { alert(error); }
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
                onPress={() => loginRequest()} >
                    <Text style={styles.button_text}>Потвърди</Text>
            </Pressable>
            
        </SafeAreaView>
    );
}