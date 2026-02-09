import { TouchableOpacity, View, Text, Dimensions } from "react-native";
import AuthContainer from "../ui/AuthContainer";
import PasswordField from "../ui/PasswordField";
import TextField from "../ui/TextField";
import { global } from "../ui/styles";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";

function isValidEmail(email:string){
    return /^[^\s@&='"!]@[^\s@&='"!].[^\s@&='"!]$/.test(email);
}

const RenderRegister = () => {
const router = useRouter();
const [nome, setNome] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [passwordConfirm, setPasswordConfirm] = useState("");
const [cpf, setCPF] = useState("");
const [telefone, setTelefone] = useState("");
const [loading, setLoading] = useState("");
const [touched, setTouched] = useState<{email?:boolean; password?: boolean; passwordConfirm?:boolean, cpf?: boolean; telefone?: boolean}>({});

const errors = useMemo(() => {
    const error: Record<string, string> = {};
    if(touched.email && !email) error.email = "E-mail obrigatório"
    if(touched.password && !password) error.password = "Senha obrigatória"
    if(touched.password && password && password.length < 6) error.password = "No mínimo 6 caracteres para a senha";
    if(touched.email && email && !isValidEmail(email)) error.email = "Digite um e-mail válido";

    return error; 
}, [email, password, touched])

const canSubmit = nome && cpf && telefone && email && password && passwordConfirm && Object.keys(errors).length === 0


const { width, height} = Dimensions.get('window');
return (
        <AuthContainer
            title="Bem-vindo"
            subtitle="Faça seu cadastro para continuar!"
            icon="hotel">
    
            <TextField
                label="Nome:"
                placeholder="Digite Seu Nome:"
                value={nome}
            />

            <TextField
                label="CPF:"
                placeholder="999.999.999-9"
                value={cpf}
            />

            <TextField
                label="Telefone:"
                icon={{ lib: "MaterialIcons", name: "call" }}
                placeholder="99 99999-9999"
                autoComplete="tel"
                value={telefone}
            />

            <TextField
                label="E-mail"
                icon={{ lib: "MaterialIcons", name: "email" }}
                placeholder="user@email.com"
                value={email}
            />  

            <PasswordField
                label="Senha"
                icon={{ lib: "MaterialIcons", name: "password" }}
                placeholder="*********"
                value={password}
            />

            <PasswordField
                label="Senha"
                icon={{ lib: "MaterialIcons", name: "password" }}
                placeholder="*********"
                value={passwordConfirm}
            />

            <TouchableOpacity style={[global.primaryButton]}>
            <Text style={global.primaryButtonText}>Cadastrar</Text>
        </TouchableOpacity>
        <View style={{alignItems: "center", marginTop: height * 0.03}}>
            <View style={{backgroundColor: "#7c8390ff", width: width * 0.5, height: height * 0.001,
                borderRadius: 10, marginTop: height * 0.03}}></View>
        </View>
        </AuthContainer>
    )
};

export default RenderRegister;
