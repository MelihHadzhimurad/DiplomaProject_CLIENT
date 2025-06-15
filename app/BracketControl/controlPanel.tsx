import { Stack } from "expo-router";
import { Pressable, SafeAreaView, Text } from "react-native";
import { styles } from "../globalStyles";

export default function controlPanel() {
    /*const rawId = useSearchParams();
    const deviceId = decodeURIComponent(rawId.toString()).split("=")[1];
    const [isConnected, setIsConnected] = useState(false);
    const manager = useBleManager();

    if(!isConnected) {
        try {
        manager.connectToDevice(deviceId).then(device => {
        showAlert("Свързано към усторйство "+device.name);
        setIsConnected(true);
        }) } 
        catch (error) { 
            showAlert('Неуспешно свързване: '+ error);
            router.back();
        }
    }
    
    function disconnectFromDevice(deviceId:string) {
        try {
            manager.cancelDeviceConnection(deviceId).then(device => {
            showAlert("Успешно раздвояване ");
            router.push("/BracketControl/scanningScreen");
            setIsConnected(false);
            return;
            })
        } catch (error) { showAlert('Неуспешно раздовяване: '+ error); router.back(); }
    }*/

    return(
        <SafeAreaView style={styles.control_panel_container}>
            <Stack.Screen
                options={{
                title: "Контролен панел",
                headerBackVisible: false
                }}
            />
            <Text style={[styles.input_fields, styles.espMessageField]}></Text>
            <Pressable
                style={styles.button}>
                <Text style={styles.button_text}>Отключи</Text>
            </Pressable>
            <Pressable
                style={styles.button}>
                <Text style={styles.button_text}>Зaтягане</Text>
            </Pressable>
            <Pressable
                style={styles.button}>
                <Text style={styles.button_text}>Зaключи</Text>
            </Pressable>
            <Pressable
                style={[styles.button, styles.disconnect_button]}>
                <Text style={styles.button_text}>Раздвояване</Text>
            </Pressable>
            <Text></Text>
        </SafeAreaView>
    );

}