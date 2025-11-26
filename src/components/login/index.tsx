import { Text } from "@react-navigation/elements";
import { useRouter } from "expo-router";
import { Dimensions, TouchableOpacity, View } from "react-native";
import AuthContainer from "../ui/AuthContainer";
import PasswordField from "../ui/PasswordField";
import { global } from "../ui/styles";
import TextField from "../ui/TextField";



const RenderLogin = () => {
    const router = useRouter();
    const {width,height} = Dimensions.get("window");
    return(
        
        <AuthContainer
                title="Bem-vindo"
                subtitle="Faça seu login para continuar!"
                icon="hotel">

            <View style ={global.content}>

            <TextField
                label = "E-mail"
                icon = "email"
                placeholder="user@email.com"
                keyboardType="email-address"
                >
            </TextField>

            <PasswordField
                label="Senha"
                icon="lock"
                placeholder="*********"
        />

        <View style={{marginTop:height * 0.03}}>
            <TouchableOpacity onPress={() => router.push("/(auth)/resetPassword")}>
                <Text style = {{color:"#",fontSize:17}}>Esqueci minha senha</Text>
            </TouchableOpacity>

            </View>
        <View>
        <TouchableOpacity onPress={() => router.push("../explore")} style={{alignItems:"center",marginTop:height * 0.03}}>
            <Text style={global.primaryButtonText}>Entrar</Text>
        </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/(auth)/register")} style={{alignItems:"center",marginTop:height * 0.03}}>
                <Text style = {{color:"#",fontSize:17,fontWeight:600}}>Cadastre-se</Text>
            </TouchableOpacity>
        </View>
    </View>

        </AuthContainer>
    
    )
};

export default RenderLogin;