import { Label } from "@react-navigation/elements";
import TextField from "../ui/TextFild";
import AuthContainer from "../ui/AuthContainer";
import { Dimensions, TouchableOpacity, View } from "react-native";
import PasswordField from "../ui/PasswordField";
import { global } from "../ui/styles";
import { Text } from "@react-navigation/elements";
import { useRouter } from "expo-router";



const RenderReset = () => {
    const router = useRouter();
    const {width,height} = Dimensions.get("window");
    return(
        
        <AuthContainer
                title="Redefinição de senha"
                subtitle="Digite seu email para receber redefinir sua senha"
                icon="hotel">

            <TextField
                label = "Seu e-mail"
                icon = "email"
                placeholder="user@email.com"
                keyboardType="email-address"
                >
            </TextField>
        <View>
        <TouchableOpacity style={[global.primaryButton]}>
            <Text style={global.primaryButtonText}>Entrar</Text>
        </TouchableOpacity>
        <View style={{alignItems: "center", marginTop: height * 0.04}}>
            <TouchableOpacity onPress={() => router.back()}>
                <Text style={{color: "#2F4156", fontWeight: 600, fontSize: 17}}>Já possui uma conta? Faça Login</Text>
            </TouchableOpacity>
        
        </View>
        </View>

        </AuthContainer>
    
    )
};

export default RenderReset;