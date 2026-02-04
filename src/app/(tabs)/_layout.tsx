/*Função: definir o fluxo de navegação entre as telas disponíveis em Tab Navigator:
Explorar, Reservas, Perfil*/
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{ tabBarActiveTintColor: "#420350ff", tabBarInactiveTintColor: "#7c7c7cff",
        headerShown: false, tabBarStyle: { backgroundColor: "#fef6ffff" } }}>
      
      <Tabs.Screen
        name="explorer"
        options={{ title: "Explorar", tabBarIcon: ({ color }) => 
          (<FontAwesome size={25} name="search" color={color} />) }} />

     <Tabs.Screen
        name="reservations"
        options={{ title: "Reservar", tabBarIcon: ({ color }) => 
          (<MaterialCommunityIcons size={25} name="bag-suitcase" color={color} />) }} />

     <Tabs.Screen
        name="account"
        options={{ title: "Minha conta", tabBarIcon: ({ color }) => 
          (<MaterialCommunityIcons size={25} name="account" color={color} />) }} />

    </Tabs>
  );
};
export default TabLayout;
