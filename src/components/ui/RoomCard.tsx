import { MaterialIcons, FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { global } from "./styles";

type Infos = { title?: string; text: string; price: number };
type NameIcon =
  | { lib: "MaterialIcons"; name: keyof typeof MaterialIcons.glyphMap }
  | { lib: "FontAwesome6"; name: keyof typeof FontAwesome6.glyphMap }
  | { lib: "FontAwesome5"; name: keyof typeof FontAwesome5.glyphMap };
type Props = {
  //image?:
  label?: string;
  description?: Infos;
  icon?: NameIcon;
};
const RoomCard = ({ label, description, icon }: Props) => {
  return (
    <View style={global.content}>
      <View>{/* imagem */}</View>
      <View>
        {!!label && <Text style={global.title}>{label}</Text>}
        <View>
          <View>
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
            {!!description && (
              <View>
                <View>
                  {!!description.title && <Text>{description.title}</Text>}
                  <Text>{description.text}</Text>
                  <Text>R$ {description.price}</Text>
                </View>
              </View>
            )}
          </View>
          <View></View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    description: {
            backgroundColor:"purple",
            borderRadius:10,
            shadowColor: "#000",
            shadowOpacity:0.05,
            shadowRadius:10,
            elevation:2,
    }
});
export default RoomCard;
