import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";
import { global } from "./styles";
 
 
 
type Props = TextInputProps & {
    label : string;
    errorText?: string;
    icon?: keyof typeof MaterialIcons.glyphMap;
}
 
const TextField = ({label, errorText,icon,style,...restInputProps} : Props) => {

    return (
        <View style = {global.inputGroup}>
            <Text style ={global.label}>{label}</Text>
            <View style = {[global.inputIcon, errorText ? global.inputError : null]}>
                {!! icon && (
                    <View>
                        <MaterialIcons name={icon} size={18} color="pruple" />
                    </View>
                )}
                <TextInput
                    keyboardAppearance="dark"
                    placeholderTextColor="#9ca3af"
                    style={[global.input]}
                    {...restInputProps}
                />
            </View>
            {!! errorText && 
                <text style={global.errorText}>{errorText}</text>
            }
        </View>
    )
};
    export default TextField;