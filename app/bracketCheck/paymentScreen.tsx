import { StripeProvider } from '@stripe/stripe-react-native';
import PaymentForm from './paymentForm';

export default function PaymentScreen() {
    return(
        <StripeProvider publishableKey='pk_test_51RZxGw4JTMPhrYaVuTZ9siucxi3V7xr0F3QYo0hD5kXrbWK2yR2eZdHhG9rrqHTTMf6GjV975XYIVZ0gaSAS4s0E006Hr42A0G'>
                <PaymentForm />
        </StripeProvider>
    );
}