import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

const  TabLayout = () =>   {
    return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#420350ff',
        tabBarInactiveTintColor: "#bac4d6ff",
        headerShown:false,
        tabBarStyle:{
            backgroundColor:"#7c4988ff",
        }
    }}>
        <Tabs.Screen
        name="explore"
        options={{
        title: 'Explore',
        tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
    />
    <Tabs.Screen
        name="reservations"
        options={{
        title: 'Reservations',
        tabBarIcon: ({ color }) => <FontAwesome size={28} name="suitcase" color={color} />,
        }}
    />

    <Tabs.Screen
        name="account"
        options={{
        title: 'Account',
        tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} />,
        }}
    />
    </Tabs>
);
}

export default TabLayout;
