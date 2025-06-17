import { StyleSheet } from "react-native";
import { colors } from "./constants";

export const styles = StyleSheet.create({
    container: {
        height: "100%",
        backgroundColor: colors.background_color,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },

    header: {
        margin: 20,
        color: colors.secondary_text_color,
        fontWeight: "bold",
        fontSize: 20,
        textAlign: "center"
    },

    button: {
        backgroundColor: colors.button_color,
        width: '50%',
        height: '10%',
        justifyContent: "center",
        margin: 10,
        borderRadius: 25,
    },

    button_text: {
        color: colors.button_text_color,
        textAlign: "center",
        fontSize: 15,
        fontWeight: "600"  
    },

    input_fields: {
        borderColor: " #003459",
        borderWidth: 2,
        width: "70%",
        height: "10%",
        borderRadius: 25,
        marginBottom: 20
    },

    input_headers: {
        color: colors.button_text_color,
        fontSize: 15,
        fontWeight: "600",
        width: "70%",
        textAlign: "left",
        paddingLeft: 20
    },

    device: {
        marginVertical: 10,
        backgroundColor:colors.device_button_color,
        alignContent: "center",
        justifyContent: "center",
        padding:10,
        margin:10,
        borderRadius:20,
        borderWidth: 2
    },

    control_panel_container: {
        backgroundColor: colors.background_color,
        display: "flex",
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
    }, 
    
    espMessageField: {
        marginTop: 40,
        marginBottom: 70
    },

    disconnect_button: {
        marginTop: 70
    },

    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalContainer: {
        width: '90%',
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#fff',
        elevation: 5,
    },

    label: {
        fontWeight: 'bold',
        marginTop: 10,
    },

    input: {
        borderWidth: 1,
        borderColor: '#aaa',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginTop: 5,
    }
    
});
