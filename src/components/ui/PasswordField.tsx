import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import TextField from "./TextFild";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { global } from "./styles";
 
 
type Props =  React.ComponentProps<typeof TextField>;
 
const PasswordField = (props: Props) => {
    /*React.useState*/
    const [show, setShow] = useState(false);  // mostrar senha
   
    return (
        <View>
            <TextField
            {...props}
 
            icon={props.icon ?? "lock"}
            secureTextEntry={!show}
            autoCapitalize="none"
            autoCorrect={false}
            />
    
        <TouchableOpacity style={global.eyeIcon} onPress={() => setShow((sv) => !sv)}>
            <Ionicons name = {show ? "eye" : "eye-off"} size={20}/>
        </TouchableOpacity>

         </View>    
    );
};
 
 
export default PasswordField;
 