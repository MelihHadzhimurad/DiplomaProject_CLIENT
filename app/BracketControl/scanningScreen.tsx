import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, PermissionsAndroid, Platform, Pressable, SafeAreaView, Text } from "react-native";
import { BleManager, Device, State } from 'react-native-ble-plx';
import { showAlert } from '../Auxiliary/auxiliary';
import { colors } from "../constants";
import { styles } from "../globalStyles";

export default function BracketControl() {

    const { permissionKey } = useLocalSearchParams();
    const [ devices, setDevices ] = useState<Device[]>([]);
    const manager = new BleManager();
    const [scanFlag, setScanFlag] = useState(false);
    const [isConnected, setIsConnected] = useState(false);


    async function connectToDevice(deviceId:string) {
        try {
            await manager.connectToDevice(deviceId).then(device => {
                showAlert("свързано към усторйство "+device.name);
                setIsConnected(true);
            })
        } catch (error) { showAlert('Неуспешно свързване: '+ error); }
    }

    async function disconnectFromDevice(deviceId:string) {
        try {
            await manager.cancelDeviceConnection(deviceId).then(device => {
                showAlert("Успешно раздвояване ");
                setIsConnected(false);
            })
        } catch (error) { showAlert('Неуспешно раздовяване: '+ error); }
    }

    useEffect(() => {
        if (!scanFlag) { return; }
        const scanForDevices = async () => {
            const state = await manager.state();

            if(state !== State.PoweredOn) {
                showAlert("Bluetooth e изключен!");
                setScanFlag(false);
                return;
            }

            setDevices([]);

            
            if (Platform.OS === 'android') {
                await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);          
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

    return(
        <SafeAreaView style={styles.container} >
            <Stack.Screen
                options={{
                title: "Намиране на устройство"
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
                            if(isConnected) { disconnectFromDevice(item.id) }
                            else { connectToDevice(item.id) }
                        }}>

                        <Text>{ item.name }</Text>
                    </Pressable>
                )}
                ListEmptyComponent={<Text>Не са намерени устройства!</Text>} />
        </SafeAreaView>
    );
}