import { Buffer } from 'buffer';
import { router, Stack } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import { useState } from "react";
import { Pressable, SafeAreaView, Text } from "react-native";
import { Device } from "react-native-ble-plx";
import { showAlert } from "../Auxiliary/auxiliary";
import { useBleManager } from "../Auxiliary/bleContextProvider";
import { styles } from "../globalStyles";

export default function controlPanel() {
    const rawId = useSearchParams();
    const deviceId = decodeURIComponent(rawId.toString()).split("=")[1];
    const [isConnected, setIsConnected] = useState(false);
    const manager = useBleManager();
    const inspectorServiceUUID = "0bc17447-65e5-49b8-bf0d-d611b909bfac";
    const messageCharacteristicUUID = "0538af52-6bcd-4e39-b82c-38defaa620e9";
    const controlCharacteristicUUID = "85dd6465-3ed9-4a65-8697-fb2fde22d06e";
    const [message, setMessage] = useState("");
    const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);

    const changeMessage = (message: string) => {
        setMessage(message);
    }

    if(!isConnected) {
        try {
        manager.connectToDevice(deviceId).then(async device => {
        showAlert("Успешно свързване");
        setIsConnected(true);
        setConnectedDevice(device);
        await device.discoverAllServicesAndCharacteristics();
        readMessage();
        }) } 
        catch (error) { 
            showAlert('Неуспешно свързване: '+ error);
            router.back();
        }
    }
    
    function readMessage() {
        const readedMessage = connectedDevice?.readCharacteristicForService(
            inspectorServiceUUID,
            messageCharacteristicUUID).then(data => {
                if(data.value !== null) {changeMessage(Buffer.from(data.value, 'base64').toString('utf-8'));}
            }).catch (error => { showAlert("Грешка при четене на данни!"+error) });
    }

    function writeCommand(command:string) {
        const base64cmd = Buffer.from(command, 'utf-8').toString('base64');
        connectedDevice?.writeCharacteristicWithResponseForService(
            inspectorServiceUUID,
            controlCharacteristicUUID,
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
                title: "Контролен панел",
                headerBackVisible: false
                }}
            />
            <Text style={styles.header}> {connectedDevice?.name} </Text>
            <Text style={[styles.input_fields, styles.espMessageField]}> { message } </Text>
            <Pressable
                style={styles.button}
                onPress={() => {writeCommand("501221065:open")}}>
                <Text style={styles.button_text}>Отключи</Text>
            </Pressable>
            <Pressable
                style={styles.button}
                onPress={() => {writeCommand("501221065:close")}}>
                <Text style={styles.button_text}>Зaтягане</Text>
            </Pressable>
            <Pressable
                style={styles.button}
                onPress={() => {writeCommand("501221065:client-0342152342")}}>
                <Text style={styles.button_text}>Зaключи</Text>
            </Pressable>
            <Pressable
                style={[styles.button, styles.disconnect_button]}
                onPress={() => disconnectFromDevice(deviceId)}>
                <Text style={styles.button_text}>Раздвояване</Text>
            </Pressable>
            <Text></Text>
        </SafeAreaView>
    );

}