import { Button, SafeAreaView } from "react-native";
import { styles } from "../globalStyles";

const { useStripe, CardField, CardForm } = require("@stripe/stripe-react-native");
const { useState } = require("react");

const PaymentForm = () => {
    const { confirmPayment } = useStripe();
    const [cardDetails, setCardDetails] = useState();

    const processPay = async () => {
        try {
            const response = await fetch('');
            const { clientSecret } = await response.json();

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
    }

    return(
        <SafeAreaView style={{padding: 20, alignItems: 'center', justifyContent: 'center'}}>
            <CardForm
            onFormComplete={(card) => setCardDetails(card)}
            style={{height: 300}}/>
            <Button style={styles.button} title="Потвърди" onPress={processPay}/>
        </SafeAreaView>
    );
}

export default PaymentForm;