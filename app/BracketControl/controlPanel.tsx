import { Buffer } from 'buffer';
import * as Location from 'expo-location';
import { router, Stack } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import { useState } from "react";
import { Pressable, SafeAreaView, Text, TextInput, View } from "react-native";
import { Device } from "react-native-ble-plx";
import { showAlert } from "../Auxiliary/auxiliary";
import { useBleManager } from "../Auxiliary/bleContextProvider";
import { styles } from "../globalStyles";

export default function controlPanel() {
    const rawId = useSearchParams();
    const rawToken = useSearchParams();
    
    const permissionKey = decodeURIComponent(rawToken.toString()).split("=")[1];
    const [bracketid, setBracketid] = useState("");
    const [carNumber, setCarNumber] = useState("");
    
    const inspectorServiceUUID = "0bc17447-65e5-49b8-bf0d-d611b909bfac";
    const messageCharacteristicUUID = "0538af52-6bcd-4e39-b82c-38defaa620e9";
    const controlCharacteristicUUID = "85dd6465-3ed9-4a65-8697-fb2fde22d06e";
    
    const manager = useBleManager();
    const deviceId = decodeURIComponent(rawId.toString()).split("=")[1].split("&")[0];
    const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [message, setMessage] = useState(""); 

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

    const makeRequest = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                showAlert("Услугите за местоположение не са разрешени!");
                return;
            }

            let loc;

            for (let count = 0; count <= 5; count++) {
            loc = await Location.getCurrentPositionAsync({ accuracy:Location.Accuracy.High });

            if(loc.coords.latitude === 0 || loc.coords.longitude === 0) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                continue;
                }
                break;
            }

            const response = await fetch('http://192.168.1.15:5291/fine/addnewfine', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': permissionKey
                },
                body: JSON.stringify({
                    'bracketId': bracketid,
                    'carNumber': carNumber,
                    'latitude': loc?.coords.latitude,
                    'longtitude': loc?.coords.longitude,
                    'zone': "green"
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
                            return;
                        
                        case '2':
                            showAlert("За колата има активна скоба!\nПроверете пак.");
                            return;
                    
                        default:
                            alert(response.status);
                            return;
                    }
                }
                else { showAlert("Неуспешно завършване!\nОпитайте пак."); return; }
            }

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

            <View
            style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                    <TextInput
                    style={[styles.input_fields, styles.control_input]}
                    placeholder='Регистрационен номер'
                    value={carNumber}
                    onChangeText={setCarNumber} />

                <TextInput
                    style={[styles.input_fields, styles.control_input]}
                    placeholder='Идентификатор скоба'
                    value={bracketid}
                    onChangeText={setBracketid}/>
            </View>

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
                onPress={() => makeRequest()}>
                <Text style={styles.button_text}>Зaключи</Text>
            </Pressable>
            <Pressable
                style={[styles.button, styles.disconnect_button]}
                onPress={() => disconnectFromDevice(deviceId)}>
                <Text style={styles.button_text}>Раздвояване</Text>
            </Pressable>
        </SafeAreaView>
    );

}