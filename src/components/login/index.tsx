import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Alert, Dimensions, Text, TouchableOpacity, View } from "react-native";
import AuthContainer from "../ui/AuthContainer";
import PasswordField from "../ui/PasswordField";
import TextField from "../ui/TextField";
import { global } from "../ui/styles";
import { useAuth } from "@/contexts/AuthContext";

function isValidEmail(email: string) {
  return /^[^\s@&='"!]@[^\s@&='"!].[^\s@&='"!]$/.test(email);
}
const RenderLogin = () => {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<{
    email?: boolean;
    password?: boolean;
  }>({});

  const errors = useMemo(() => {
    const error: Record<string, string> = {};
    if (touched.email && !email) error.email = "E-mail obrigatório";
    if (touched.password && !password) error.password = "Senha obrigatória";
    if (touched.password && password && password.length < 6)
      error.password = "No mínimo 6 caracteres para a senha";
    if (touched.email && email && !isValidEmail(email))
      error.email = "Digite um e-mail válido";
    return error;
  }, [email, password, touched]);

  const canSubmit =
    email && password && Object.keys(errors).length === 0 && !loading;

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await signIn(email.trim(),password);
      Alert.alert("Login bem-sucedido!");
      router.replace("/(tabs)/explorer");
    } catch (erro: any) {
      Alert.alert("Erro", "Falha ao tentar logar!");
    } finally {
      setLoading(false);
    }
  };

  const { width, height } = Dimensions.get("window");
  return (
    <AuthContainer
      title="Bem-vindo"
      subtitle="Faça seu login para continuar!"
      icon="hotel"
    >
      {/* children */}
      <View style={global.content}>
        <TextField
          label="E-mail"
          icon={{ lib: "MaterialIcons", name: "email" }}
          placeholder="user@email.com"
          value={email}
          onChangeText={(input) => setEmail(input)}
          errorText={errors.email}
          keyboardType="email-address"
        />

        <PasswordField
          label="Senha"
          icon={{ lib: "MaterialIcons", name: "lock" }}
          placeholder="*********"
          value={password}
          onChangeText={(input) => setPassword(input)}
          errorText={errors.password}
        />
        <TouchableOpacity
          style={[global.primaryButton]}
          onPress={handleSubmit}
          disabled={!canSubmit}
        >
          <Text style={global.primaryButtonText}>Entrar</Text>
        </TouchableOpacity>

        <View style={{ alignItems: "center", marginTop: height * 0.03 }}>
          <TouchableOpacity
            onPress={() => router.push("/(auth)/resetPassword")}
          >
            <Text style={{ color: "#420350ff", fontSize: 17, fontWeight: 600 }}>
              Esqueci minha senha
            </Text>
          </TouchableOpacity>
          <View
            style={{
              backgroundColor: "#7c8390ff",
              width: width * 0.5,
              height: height * 0.001,
              borderRadius: 10,
              marginTop: height * 0.03,
            }}
          ></View>
          <TouchableOpacity
            onPress={() => router.push("/(auth)/register")}
            style={{ marginTop: height * 0.03 }}
          >
            <Text style={{ color: "#1f1e1eff", fontWeight: 600, fontSize: 17 }}>
              Não possui uma conta? Cadastre-se agora!
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </AuthContainer>
  );
};
export default RenderLogin;
