import { Button } from "@react-navigation/elements";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{
        margin: 10,
      }}>Изберете опция:</Text>
      <Button>Вход</Button>
    </View>
  );
}
