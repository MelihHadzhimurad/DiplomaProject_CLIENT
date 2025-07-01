import { router } from "expo-router";
import { Button, SafeAreaView } from "react-native";
import { showAlert } from "../Auxiliary/auxiliary";
import { styles } from "../globalStyles";

const { useStripe, CardField } = require("@stripe/stripe-react-native");
const { useState } = require("react");

const PaymentForm = ({ clientSecretProp }) => {
    const { confirmPayment } = useStripe();
    const [cardDetails, setCardDetails] = useState();

    const processPay = async () => {
        try {
            const paymentIntentClientSecret = clientSecretProp;

            const { paymentIntent, error } = await confirmPayment(paymentIntentClientSecret, {
                paymentMethodType: 'Card',
                billingDetails: {
                    email: 'melihchohacimurat10@gmail.com',
                }
            });

            if(error) {
                showAlert("Плащането е неуспешно!" + error.message);
                console.log(error);
            } else if(paymentIntent) {
                showAlert("Плащането е успешно!");
                return paymentIntent.id;
                
            }
        }catch(error) {
            showAlert("Грешка! Изплащането не може да се извърши");
        }
    }

    const fetchUnlockCode = async (paymentIdParam) => {
        try {
            const response = await fetch('http://192.168.1.15:5291/fine/confirm', {
                    method: 'POST',
                    headers: {
                        'Accept':'text/plain',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        'paymentIntent': paymentIdParam
                    })
                });
            
                const result = await response.text();

                console.log("Server response - ", result);
            
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
                console.log(error);
            }
    }

    const paymentConfirmed = async () => {
        const paymentIdentifier = await processPay();
        await fetchUnlockCode(paymentIdentifier);
    }

    return(
        <SafeAreaView style={{ padding: 20, justifyContent:'center' }}>
            <CardField
                postalCodeEnabled={false}
                onCardChange={(card) => setCardDetails(card)}
                style={{ height: 50, marginBottom: 20, marginTop: "70%" }}
            />
            <Button style={ styles.button } title="Потвърди" onPress={paymentConfirmed} />
        </SafeAreaView>
    );
}

export default PaymentForm;