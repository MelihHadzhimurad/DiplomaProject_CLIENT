import { Buffer } from 'buffer';
import { router, Stack } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { useState } from "react";
import { Pressable, SafeAreaView, Text } from "react-native";
import { Device } from "react-native-ble-plx";
import { showAlert } from "../Auxiliary/auxiliary";
import { useBleManager } from "../Auxiliary/bleContextProvider";
import { styles } from "../globalStyles";

export default function UserUnlockScreen() {

    const { rawId } = useLocalSearchParams();
    const { rawUnlockCode } = useLocalSearchParams();

    console.log(rawUnlockCode);
    console.log(rawId);

    const manager = useBleManager();
    const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [message, setMessage] = useState("");

    const userServiceUUID = "db51410d-d238-4ab7-b28a-ce3207118b0a";
    const messageCharacteristicUUID = "af56e78f-b47e-40e7-a8f6-2869b4bef7e2";
    const commandCharacteristicUUID = "b804ebc2-09ce-43f9-bc88-46d5ee064ca5";

    if(!rawId) { showAlert("Неуспешно свързване!"); router.back(); }

    const changeMessage = (message: string) => {
        setMessage(message);
    }

    if(!isConnected) {
        try {
            manager.connectToDevice(rawId).then(async device => {
            showAlert("Успешно свързване");
            setIsConnected(true);
            setConnectedDevice(device);
            await device.discoverAllServicesAndCharacteristics();
            readMessage();
            }) } 
            catch (error) { 
                showAlert('Неуспешно свързване: '+ error);
            }
        }
    
        function readMessage() {
        const readedMessage = connectedDevice?.readCharacteristicForService(
            userServiceUUID,
            messageCharacteristicUUID).then(data => {
                if(data.value !== null) {changeMessage(Buffer.from(data.value, 'base64').toString('utf-8'));}
            }).catch (error => { showAlert("Грешка при четене на данни!"+error) });
        }

        function writeCommand(command:string) {
            const base64cmd = Buffer.from(command, 'utf-8').toString('base64');
            connectedDevice?.writeCharacteristicWithResponseForService(
                userServiceUUID,
                commandCharacteristicUUID,
                base64cmd).then(async value => {
                readMessage();
            }).catch(error => {
                showAlert("Грешка при изпращане на команда"+error);
            });
        }

    function disconnectFromDevice(deviceId:string) {
        try {
            manager.cancelDeviceConnection(deviceId).then(device => {
            showAlert("Успешно раздвояване ");
            setConnectedDevice(null);
            router.back();
            return;
            })
        } catch (error) { showAlert('Неуспешно раздовяване: '+ error); router.back(); }
    }

    return(
        <SafeAreaView style={styles.control_panel_container}>
            <Stack.Screen
                options={{
                title: "Отключване на скоба",
                headerBackVisible: false
                }}
            />
            <Text style={styles.header}> {connectedDevice?.name} </Text>
            <Text style={[styles.input_fields, styles.espMessageField]}> { message } </Text>

            <Pressable
                style={styles.button}
                onPress={() => {writeCommand(rawUnlockCode)}}>
                <Text style={styles.button_text}>Отключи</Text>
            </Pressable>
            <Pressable
                style={[styles.button, styles.disconnect_button]}
                onPress={() => disconnectFromDevice(rawId)}>
                <Text style={styles.button_text}>Раздвояване</Text>
            </Pressable>
        </SafeAreaView>
    );
}