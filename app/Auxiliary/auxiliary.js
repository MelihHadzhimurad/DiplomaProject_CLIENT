import { Alert } from "react-native";

export function showAlert(message) {
  Alert.alert(
    '', // no title
    message,
    [
      { text: 'Затвори', onPress: () => {} }
    ],
    { cancelable: true }
  );
}