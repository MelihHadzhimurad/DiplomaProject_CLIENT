import { StripeProvider } from '@stripe/stripe-react-native';
import { Stack } from 'expo-router';
import { useSearchParams } from 'expo-router/build/hooks';
import PaymentForm from './paymentForm';

export default function PaymentScreen() {

    const rawIntent = useSearchParams();
    const clientSecret = decodeURIComponent(rawIntent.toString()).split("=")[1];

    return(
        <StripeProvider publishableKey='pk_test_51RZxGw4JTMPhrYaVuTZ9siucxi3V7xr0F3QYo0hD5kXrbWK2yR2eZdHhG9rrqHTTMf6GjV975XYIVZ0gaSAS4s0E006Hr42A0G'>
                <Stack.Screen
                options={{ title: "Плащане" }}
                />
                <PaymentForm clientSecretProp={clientSecret} />
        </StripeProvider>
    );
}