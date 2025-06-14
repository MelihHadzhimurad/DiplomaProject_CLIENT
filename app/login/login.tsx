import { Stack } from "expo-router";
import { Pressable, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../globalStyles";

export default function login() {
    return(
        <SafeAreaView style={styles.container}>
            <Stack.Screen
                options={{ title: "Автентикация" }}
            />

            <Text style={styles.input_headers}>Потребителско име:</Text>
            <TextInput
                style={styles.input_fields} />

            <Text style={styles.input_headers}>Парола:</Text>
            <TextInput 
                style={styles.input_fields}
                secureTextEntry={true} />
            
            <Pressable
                style={styles.button}
                onPress={() => alert("Грешни данни!")} >
                    <Text style={styles.button_text}>Потвърди</Text>
            </Pressable>
            
        </SafeAreaView>
    );
}