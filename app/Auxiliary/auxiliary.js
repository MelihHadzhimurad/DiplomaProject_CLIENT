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

export function PaymentAlert(amount, paymentIntent, router) {
    Alert.alert(
      "Глоба на стойност "+ amount +"лв",
      "Желаете ли да я платите",
      [
        {
          text: "Отказ",
          onPress: () => {},
          style: 'cancel'
        },
        {
          text: "Плати",
          onPress: () => { router.replace({ pathname: "/bracketCheck/paymentScreen",
                                           params: {
                                              "rawIntent": encodeURIComponent(paymentIntent)
                                           }
                            });
                          }
        }
      ],
      { cancelable: false }
    );
}