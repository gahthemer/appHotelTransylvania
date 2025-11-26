import { Text } from "@react-navigation/elements";
import { router } from "expo-router";
import { Dimensions, TouchableOpacity, View } from "react-native";
import AuthContainer from "../ui/AuthContainer";
import PasswordField from "../ui/PasswordField";
import { global } from "../ui/styles";
import TextField from "../ui/TextField";


const Renderregister = () => {
    const {width,height} = Dimensions.get("window");
    return(
        
        <AuthContainer
                title="Bem-vindo"
                subtitle="Faça seu login para continuar!"
                icon="hotel">

            <TextField
                label = "Nome"
                placeholder="Digite seu nome"
                icon = "person-outline"
                keyboardType="email-address"
                >
            </TextField>   

            <TextField
                label = "cpf"
                placeholder="000.000.000-00"
                keyboardType="email-address"
                >
            </TextField>
            <TextField
                label = "Telefone"
                icon = "phone-android" 
                placeholder="(00)-0000-00000"
                keyboardType="email-address"
                >
            </TextField>
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
                

            <PasswordField
                label="Confirme a sua senha"
                icon="lock"
                placeholder="*********"
                
        />
        <View>
        <TouchableOpacity style={[global.primaryButton]}>
            <Text style={global.primaryButtonText}>Cadastrar</Text>
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

export default Renderregister;