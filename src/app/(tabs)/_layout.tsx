import { Tabs } from "expo-router";
import "../../components/ui/styles";
import React from "react";
import { StatusBar } from "expo-status-bar";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const RootLayout = () => {
    return (
        <React.Fragment>
            <StatusBar style="auto"/>
            <Tabs screenOptions={{
                tabBarActiveTintColor: "#420350ff",
                tabBarInactiveTintColor: "#f9ddffff",
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: "#824590ff",
                }
            }}>             
                <Tabs.Screen name="explore" options={{title: 'Pesquisar',tabBarIcon: ({ color }) => (<FontAwesome5 name="search" size={24} color={color} />),}} />
                <Tabs.Screen name="account" options={{ title: 'Minha Conta', tabBarIcon: ({ color }) => (<FontAwesome5 name="user-circle" size={24} color={color} />),}} />
                <Tabs.Screen name="reservations" options={{ title: 'Reservas',tabBarIcon: ({ color }) => (<FontAwesome5 name="briefcase" size={24} color={color} />),}} />
            </Tabs>
        </React.Fragment>
    )
}

export default RootLayout;
