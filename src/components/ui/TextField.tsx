import { FontAwesome5, FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";
import { global } from "./styles";

//Bibliotecas de ícones aceitas
type NameIcon =
  | { lib: "MaterialIcons"; name: keyof typeof MaterialIcons.glyphMap }
  | { lib: "FontAwesome6"; name: keyof typeof FontAwesome6.glyphMap }
  | { lib: "FontAwesome5"; name: keyof typeof FontAwesome5.glyphMap };
type Props = TextInputProps & {
  label: string;
  errorText?: string;
  icon?: NameIcon;
};
const TextField = ({
  label,
  errorText,
  icon,
  style,
  ...restInputProps
}: Props) => {
  return (
    <View style={global.inputGroup}>
      <Text style={global.label}>{label}</Text>
      <View style={[global.inputIcon, errorText ? global.inputError : null]}>
        {!!icon && (
          <View>
            {icon.lib === "MaterialIcons" && (
              <MaterialIcons name={icon.name} size={23} color="purple" />
            )}
            {icon.lib === "FontAwesome5" && (
              <FontAwesome5 name={icon.name} size={23} color="purple" />
            )}
            {icon.lib === "FontAwesome6" && (
              <FontAwesome6 name={icon.name} size={23} color="purple" />
            )}
          </View>
        )}
        <TextInput
          keyboardAppearance="dark"
          placeholderTextColor="#9ca3af"
          style={[global.input, style]}
          /* const TextField = (props: Props) => {
                        const label = props.label;
                        const errorText = props.errorText;
                        const style = props.style;
                        const value = props.value;
                        const onChangeText = props.onChangeText;
                        const placeholder = props.placeholder;
                        const autoCapitalize = props.autoCapitalize;
                        const keyboardType = props.keyboardType;
                    } */
          {...restInputProps}
        />
      </View>
      {!!errorText && <Text style={global.errorText}>{errorText}</Text>}
    </View>
  );
};

export default TextField;
