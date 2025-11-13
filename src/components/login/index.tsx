import { Label } from "@react-navigation/elements";
import TextField from "../ui/TextFild";
import AuthContainer from "../ui/AuthContainer";
import { TouchableOpacity, View } from "react-native";
import PasswordField from "../ui/PasswordField";
import { global } from "../ui/styles";
import { Text } from "@react-navigation/elements";


const RenderLogin = () => {
    return(
        
        <AuthContainer
                title="Bem-vindo"
                subtitle="Faça seu login para continuar!"
                icon="hotel">

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

        <TouchableOpacity style={[global.primaryButton]}>
            <Text style={global.primaryButtonText}>Entrar</Text>
        </TouchableOpacity>

        </AuthContainer>
    
    )
};

export default RenderLogin;