import { Dimensions, StyleSheet } from "react-native";
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
        backgroundColor:"purple",
        borderRadius:10,
        padding: width * 0.02,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius:10,
        shadowOffset:{width:0,height:2},
        elevation: 2,
    },
})