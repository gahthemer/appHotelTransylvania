import { Label } from "@react-navigation/elements";
import { Dimensions, StyleSheet } from "react-native";
import Login from "../../app/(auth)";
const{ width,height }= Dimensions.get("window");


export const global = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
    },
    keyboardAvoiding: {
        flex:1
    },
    container: {
        paddingHorizontal: width * 0.07,
        paddingVertical: height * 0.07,
    },
    header: {
        alignItems:"center",
        marginBottom: height * 0.03,
    },

    title: {
        fontSize: 25,
        fontWeight: "800",
    },
    subtitle: {
        fontSize: 17,
        color: "purple",
        marginTop:  height * 0.02,
    },
    content: {
        backgroundColor:"#9c5abbc9",
        borderRadius:10,
        padding: width * 0.02,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius:10,
        shadowOffset:{width:0,height:2},
        elevation: 2,
    },
    inputGroup: {
        marginBottom: height * 0.02,

    },
    label: {
      fontSize: 14,
      fontWeight:"600",
      color: "#420350ff",
      marginBottom: height * 0.01  
    },

    inputIcon: {
        backgroundColor: "#fff",
        paddingLeft:width * 0.02,
        flexDirection: "row",
        alignItems: "center",
        borderWidth:2,
        borderColor: "#420350ff",
        borderRadius:10
    },

    inputError: {
        backgroundColor:"#fed5d5ff",
        borderColor:"rgba(139,0,0,1)",

    },
    input: {
        flex:1,
        fontSize:16,
        color:"#000",
        fontWeight:"600",
        paddingHorizontal: width * 0.02
    },
    errorText: {
        color:"red",
        fontWeight: "600",
        fontSize:15,
        marginTop: height * 0.01
    },
    eyeIcon: {
        position: "absolute",
        right:12,
        top:42
    },
    primaryButton: {
        backgroundColor:"#9c5abbc9",
        borderRadius:10,
        alignItems:"center",
    },
    primaryButtonDisacled: {
        backgroundColor:"#420350ff",
        borderRadius:10,
    },
    primaryButtonText: {
        color: "#fff"
    }
})