import { Stack } from "expo-router";
import { BleProvider } from "./Auxiliary/bleContextProvider";
import { colors } from "./constants";

export default function RootLayout() {
  return (
    <BleProvider>
        <Stack
          screenOptions={{
          headerStyle: {
          backgroundColor: colors.button_color,
          },

          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "bold"
          },

          headerTintColor: colors.secondary_text_color
          }} />
    </BleProvider>
  );
}
