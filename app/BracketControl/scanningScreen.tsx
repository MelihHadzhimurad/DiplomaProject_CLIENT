import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, PermissionsAndroid, Platform, Pressable, SafeAreaView, Text } from "react-native";
import { Device, State } from 'react-native-ble-plx';
import { showAlert } from '../Auxiliary/auxiliary';
import { useBleManager } from "../Auxiliary/bleContextProvider";
import { colors } from "../constants";
import { styles } from "../globalStyles";

export default function BracketControl() {

    const { rawUnlockCode } = useLocalSearchParams();
    const unlockCode = decodeURIComponent(rawUnlockCode.toString());

    const { rawToken } = useLocalSearchParams();
    const [ devices, setDevices ] = useState<Device[]>([]);
    const manager = useBleManager();
    const [scanFlag, setScanFlag] = useState(false);

    useEffect(() => {
        if (!scanFlag) { return; }
        const scanForDevices = async () => {
            const state = await manager.state();

            if(state !== State.PoweredOn) {
                showAlert("Bluetooth e изключен, включете!");
                setScanFlag(false);
                return;
            }

            setDevices([]);

            
            if (Platform.OS === 'android') {
                await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
                await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
                await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT);
                await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN);          
            }

             manager.startDeviceScan(null, null, (error, device) => {
                if(error) {
                    showAlert(error.message);
                    setScanFlag(false);
                    return;
                }

                if (device) {
                    if (device.name?.startsWith("Скоба")) {
                        setDevices((prevDevices) => {
                        // Avoid duplicates by device id
                        if (prevDevices.find((d) => d.id === device.id)) {
                            return prevDevices;
                        }
                        return [...prevDevices, device];
                        });
                    }   
                }
            });

            setTimeout(() => {
                manager.stopDeviceScan();
                setScanFlag(false);
                }, 10000);
                    
            };

        scanForDevices();
    }, [scanFlag]);

    const unlockBracket = (deviceId: string) => {
        const manager = useBleManager();
        const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
        const userServiceUUID = "db51410d-d238-4ab7-b28a-ce3207118b0a";
        const messageCharacteristicUUID = "af56e78f-b47e-40e7-a8f6-2869b4bef7e2";
        const commandCharacteristicUUID = "b804ebc2-09ce-43f9-bc88-46d5ee064ca5";
        
        try {
            manager.connectToDevice(deviceId).then(async device => {
            showAlert("Успешно свързване");
            setConnectedDevice(device);
            await device.discoverAllServicesAndCharacteristics();
            
            const base64cmd = Buffer.from(unlockCode, 'utf-8').toString('base64');
            connectedDevice?.writeCharacteristicWithResponseForService(
            userServiceUUID,
            commandCharacteristicUUID,
            base64cmd).then(async value => {
                
            const readedMessage = connectedDevice?.readCharacteristicForService(
                userServiceUUID,
                messageCharacteristicUUID).then(data => {
                    if(data.value !== null) {
                        showAlert(Buffer.from(data.value, 'base64').toString('utf-8'));
                    }
                    }).catch (error => { 
                        showAlert("Грешка при четене на данни!");
                    });

            }).catch(error => {
                showAlert("Грешка при изпращане на команда"+error);
            });

            }) } 
            catch (error) { 
            showAlert('Неуспешно свързване, опитайте пак');
        }
    }

    return(
        <SafeAreaView style={styles.container} >
            <Stack.Screen
                options={{
                title: "Намиране на устройство",
                headerBackVisible: false
                }}
            />

            <Pressable
                style={styles.button}
                onPress={() => setScanFlag(true)}>
                <Text style={styles.button_text}>Сканирай за устройства</Text>
            </Pressable>
            <FlatList
                style={{
                    width: "70%",
                    height: "100%" }}

                contentContainerStyle={{
                    alignItems: "center", 
                    justifyContent: "flex-start", 
                    height:"100%", 
                    borderTopWidth:3, 
                    borderTopColor: colors.button_text_color }}

                data={devices}
                keyExtractor={(item) => item.id}

                renderItem={({ item }) => (
                    <Pressable
                        style={styles.device}
                        onPress={() =>{ 
                            if(rawToken !== null || rawToken !== "")
                            {
                                router.push({ pathname: "/BracketControl/controlPanel",
                                              params: { "rawDeviceId": encodeURIComponent(item.id),
                                                        "rawToken": rawToken}});
                            } else
                            {
                                unlockBracket(item.id);
                            }}}>
                        <Text>{ item.name }</Text>
                    </Pressable>
                )}
                ListEmptyComponent={<Text>Не са намерени устройства!</Text>} />
        </SafeAreaView>
    );
}