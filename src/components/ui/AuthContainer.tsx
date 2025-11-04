import{FontAwesome} from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

type Props = {
    title:string;
    subtitle?:string;
    icon?:keyof typeof FontAwesome.glyphMap;
    /*children: React.ReactNode;*/
}


export default function AuthContainer({title,subtitle,icon,/*children*/}: Props){
    return(
        <View>
            <FontAwesome name={icon} size={25} color="blue"/>
            <Text>{title}</Text>
            <Text>{subtitle}</Text>
        </View>
    );
}