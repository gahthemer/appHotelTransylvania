import { Dimensions, StyleSheet } from "react-native";
const{ width,height }= Dimensions.get("window");


export const global = StyleSheet.create({
   safeArea: {
        flex: 1,
        backgroundColor: "#fff"
    },
    keyboardAvoiding: {
        flex: 1
    },
    container: {
        paddingHorizontal: width * 0.07,
        paddingVertical: height * 0.07
    },
    header: {
        alignItems: "center",
        marginBottom: height * 0.03
    },
    title: {
        fontSize: 25,
        fontWeight: "800",
        /*Para atribuir cor: color:*/
    },
    subtitle: {
        fontSize: 17,
        color: "purple",
        marginTop: height * 0.01
    },
    content: {
        backgroundColor: "#f3eef8ff",
        borderRadius: 10,
        padding: width * 0.02,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2
    },
    //Inputs
    inputGroup: {
        marginBottom: height * 0.02,
    },
    label: {
        fontSize: 17,
        fontWeight: "600",
        color: "#120715ff",
        marginBottom: height * 0.01
    },
    inputIcon: {
        backgroundColor: "#fff",
        paddingLeft: width * 0.02,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#420350ff",
        borderRadius: 10
    },
    input: {
        flex: 1,
        fontSize: 17,
        color: "#000",
        paddingHorizontal: width * 0.01
    },
    eyeIcon: {
        position: "absolute",
        right: 12,
        top: 42
    },
    inputError: {
        backgroundColor: "#fed5d5ff",
        borderColor: "rgba(139, 0, 0, 1)",
    },
    errorText: {
        color: "red",
        fontWeight: "600",
        fontSize: 15,
        marginTop: height * 0.01   
    },
    primaryButton: {
        backgroundColor: "#420350ff",
        borderRadius: 10,
        padding: width * 0.025,
        marginTop: width * 0.02,
        alignItems: "center"
    },
    primaryButtonDisabled: {
        backgroundColor: "#9ca3af",
        borderRadius: 10,
    },
    primaryButtonText: {
        color: "#fff",
        fontSize: 17,
        fontWeight: 600
    }
})  
