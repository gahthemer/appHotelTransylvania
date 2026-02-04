import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import TextField from "./TextField";
import { global } from "./styles";

type Props = React.ComponentProps<typeof TextField>;

const PasswordField = (restInputProps: Props) => {
    /*React.useState*/
    const [show, setShow] = useState(false);
    return (
        <View>
            <TextField
            {...restInputProps}
            secureTextEntry={!show}
            autoCorrect={false}
            />

            <TouchableOpacity style={global.eyeIcon} onPress={() => setShow((showTrue) => !showTrue)}>
                <Ionicons name={show ? "eye-outline" : "eye-off-outline"} size={23} 
                color="#000"/>
            </TouchableOpacity> 
        
        </View>
    );
};
export default PasswordField;