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
        backgroundColor:"red",
        alignContent: "center",
        justifyContent: "center",
        padding:10,
        margin:10,
        borderRadius:20
    }
});
