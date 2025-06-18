import { router } from "expo-router";
import { Button, SafeAreaView } from "react-native";
import { styles } from "../globalStyles";

const { useStripe, CardField } = require("@stripe/stripe-react-native");
const { useState } = require("react");

const PaymentForm = ({ clientSecretProp }) => {
    const { confirmPayment } = useStripe();
    const [cardDetails, setCardDetails] = useState();

    const processPay = async () => {
        try {
            const { clientSecret } = clientSecretProp;

            const { paymentIntent, error } = await confirmPayment(clientSecret, {
                type: 'Card',
                billingDetails: {
                    email: 'melihchohacimurat10@gmail.com',
                }
            });

            if(error) {
                showAlert("Плащането е неуспешно!" + error.message);
            } else if(paymentIntent) {
                showAlert("Плащането е успешно!");
            }
        }catch(error) {
            showAlert("Грешка! Изплащането не може да се извърши");
        }

        try {
            const response = await fetch('https://localhost:7028/fine/confirm', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        'paymentId': paymentIntent
                    })
                });
            
                const result = await response.text();
            
                if(!response.ok) {
                    showAlert("Грешка!")
                    return;
                }
            
                router.replace({ pathname: "/BracketControl/scanningScreen",
                                 params: {
                                    "rawUnlockCode": result
                                 }
                 });
            
            }catch(error) {
                showAlert("Грешка!\nОпитайте пак.");
                setCarId("");
            }
    }

    return(
        <SafeAreaView style={{ padding: 20, justifyContent:'center' }}>
            <CardField
                postalCodeEnabled={false}
                onCardChange={(card) => setCardDetails(card)}
                style={{ height: 50, marginBottom: 20, marginTop: "70%" }}
            />
            <Button style={ styles.button } title="Потвърди" onPress={processPay} />
        </SafeAreaView>
    );
}

export default PaymentForm;