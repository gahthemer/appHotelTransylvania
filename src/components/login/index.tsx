import { Label } from "@react-navigation/elements";
import TextField from "../ui/TextFild";
import AuthContainer from "../ui/AuthContainer";
import { View } from "react-native";


const RenderLogin = () => {
    return(
        <AuthContainer
                title="Bem-vindo"
                subtitle="Faça seu login para continuar!"
                icon="hotel">

            <TextField
                label = "E-mail"
                icon = "email">
            </TextField>
        </AuthContainer>
    
    )
};

export default RenderLogin;