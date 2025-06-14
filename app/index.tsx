import { Stack, useRouter } from "expo-router";
import { Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./globalStyles";

export const screenOptions = {
  headerShown: true,
  headerTitle: 'Начална страница',
  headerStyle: { backgroundColor: '#6200ee' },
  headerTintColor: '#fff',
};

export default function Index() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Начална страница"
        }}
      />
      
      <Text style={styles.header}>Добре дошли в онлайн платформата на градска мобилност!</Text>
      
      <Pressable
        style={styles.button}
        onPress={() => router.push("/login/login")} >
        <Text style={styles.button_text}>Вход</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() => router.push("/bracketCheck/bracketCheck")} >
        <Text style={styles.button_text}>Проверка за поставена скоба</Text>
      </Pressable>
    </SafeAreaView>
  );
}
