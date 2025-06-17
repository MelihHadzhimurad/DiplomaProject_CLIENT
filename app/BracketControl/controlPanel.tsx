import { Buffer } from 'buffer';
import * as Location from 'expo-location';
import { router, Stack } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import { useState } from "react";
import { Modal, Pressable, SafeAreaView, Text, TouchableOpacity } from "react-native";
import { Device } from "react-native-ble-plx";
import { TextInput } from 'react-native-gesture-handler';
import { View } from 'react-native-reanimated/lib/typescript/Animated';
import { showAlert } from "../Auxiliary/auxiliary";
import { useBleManager } from "../Auxiliary/bleContextProvider";
import { styles } from "../globalStyles";

export default function controlPanel() {
    const rawId = useSearchParams();
    const rawToken = useSearchParams();

    const [modalVisible, setModalVisible] = useState(false);

    
    const permissionKey = decodeURIComponent(rawToken.toString()).split("=")[1];
    const [bracketid, setBracketid] = useState("");
    const [carNumber, setCarNumber] = useState("");
    const [latitude, setLatitude] = useState(0);
    const [longtitude, setLongtitude] = useState(0);
    
    const inspectorServiceUUID = "0bc17447-65e5-49b8-bf0d-d611b909bfac";
    const messageCharacteristicUUID = "0538af52-6bcd-4e39-b82c-38defaa620e9";
    const controlCharacteristicUUID = "85dd6465-3ed9-4a65-8697-fb2fde22d06e";
    
    const manager = useBleManager();
    const deviceId = decodeURIComponent(rawId.toString()).split("=")[1];
    const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [message, setMessage] = useState(""); 

    const changeMessage = (message: string) => {
        setMessage(message);
    }

    const lockPressed = async () => {
        const loc = await Location.getCurrentPositionAsync();
        setLatitude(loc.coords.latitude);
        setLongtitude(loc.coords.longitude);

        setModalVisible(true);
    };

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

    const makeRequest = async () => {
        try {
            const response = await fetch('https://localhost:7028/fine', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': permissionKey
                },
                body: JSON.stringify({
                    'bracketId': bracketid,
                    'carNumber': carNumber,
                    'latitude': latitude,
                    'longtitude': longtitude,
                })
            });

            const result = await response.text();
            
            setBracketid("");
            setCarNumber("");

            if(!response.ok) {
                if (response.status === 400){ 
                    switch (result) {
                        case '1':
                            showAlert("Невалиден идентификатор на скоба!\nОпитайте пак.");
                            break;
                        
                        case '2':
                            showAlert("За колата има активна скоба!\nПроверете пак.");
                            break;
                    
                        default:
                            showAlert("Неуспешно завършване!\nОпитайте пак.");
                            break;
                    }
                }
                else { showAlert("Неуспешно завършване!\nОпитайте пак."); }
            }
            
            setModalVisible(false);
            writeCommand("501221065:client-"+result);

        }catch(error) {
            showAlert("Грешка!\nОпитайте пак.");
            setBracketid("");
            setCarNumber(""); 
        }
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
                onPressIn={() => {writeCommand("501221065:close")}}
                onPressOut={() => {writeCommand("501221065:stop")}}>
                <Text style={styles.button_text}>Зaтягане</Text>
            </Pressable>
            <Pressable
                style={styles.button}
                onPress={() => setModalVisible(true)}>
                <Text style={styles.button_text}>Зaключи</Text>
            </Pressable>
            <Pressable
                style={[styles.button, styles.disconnect_button]}
                onPress={() => disconnectFromDevice(deviceId)}>
                <Text style={styles.button_text}>Раздвояване</Text>
            </Pressable>
            <Text></Text>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}> // Android back button
                <View style={styles.overlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.label}>Идентификатор на скоба</Text>
                        <TextInput
                            style={styles.input}
                            value={bracketid}
                            onChangeText={setBracketid}/>

                        <Text style={styles.label}>Регистрационен номер на автомобил</Text>
                        <TextInput
                            style={styles.input}
                            value={carNumber}
                            onChangeText={setCarNumber}/>

                        <TouchableOpacity style={styles.button} onPress={makeRequest}>
                            <Text style={styles.button_text}>Потвърди</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );

}