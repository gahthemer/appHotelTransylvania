/* A funçao dele e definir o fluxo de navegacao entre as telas de autenticacao:
login
register
esquecer senha*/

import { Stack } from "expo-router";
import { StackScreen } from "react-native-screens";

const AuthLayout = () => {
    return(
        <Stack>
            <Stack screenOptions={{headerShown:false}}/>
            <Stack.Screen name="index" options={{title: "Login"}}/>
            { /*<Stack.Screen name="register" options={{title: "Cadastro"}}/>*/}
           { /*<Stack.Screen name="resetPassword" options={{title: "Esqueci minha"}}/>*/}
        </Stack>
    )
}

export default AuthLayout;