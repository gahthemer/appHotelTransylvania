import { Text } from "@react-navigation/elements";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, Dimensions, TouchableOpacity, View, Alert } from "react-native";
import AuthContainer from "../ui/AuthContainer";
import { global } from "../ui/styles";
import TextField from "../ui/TextField";
import { FontAwesome5, FontAwesome6, MaterialIcons } from "@expo/vector-icons";

// Opcional: tipagem para ícone, caso seu TextField use essa mesma estrutura
type NameIcon =
  | { lib: "MaterialIcons"; name: keyof typeof MaterialIcons.glyphMap }
  | { lib: "FontAwesome6"; name: keyof typeof FontAwesome6.glyphMap }
  | { lib: "FontAwesome5"; name: keyof typeof FontAwesome5.glyphMap };

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

const RenderReset = () => {
  const router = useRouter();
  const { width, height } = Dimensions.get("window");

  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState<{ email?: boolean }>({});
  const [loading, setLoading] = useState(false);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (touched.email && !email) e.email = "E-mail obrigatório";
    if (touched.email && email && !isValidEmail(email)) e.email = "Digite um e-mail válido";
    return e;
  }, [email, touched]);

  const canSubmit = !!email && Object.keys(errors).length === 0 && !loading;

  const handleSendReset = async () => {
    if (!canSubmit) return;
    try {
      setLoading(true);
      // Simulação de requisição para enviar e-mail de redefinição
      await new Promise((res) => setTimeout(res, 1500));
      Alert.alert("Pronto!", "Se o e-mail existir, você receberá instruções para redefinir a senha.");
      router.back();
    } catch (err) {
      Alert.alert("Erro", "Não foi possível enviar o e-mail. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer
      title="Redefinição de senha"
      subtitle="Digite seu e-mail para redefinir sua senha"
      icon="hotel"
    >
      <View style={global.content}>
        <TextField
          label="Seu e-mail"
          icon={{ lib: "MaterialIcons", name: "email" }} // ← aqui está o ajuste do icon
          placeholder="user@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          errorText={errors.email /* ou errorMessage, conforme seu TextField */}
        />

        <TouchableOpacity
          style={[global.primaryButton, (!canSubmit || loading) && { opacity: 0.6 }]}
          onPress={handleSendReset}
          disabled={!canSubmit || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={global.primaryButtonText}>Enviar</Text>
          )}
        </TouchableOpacity>

        <View style={{ alignItems: "center", marginTop: height * 0.04 }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ color: "#2F4156", fontWeight: "600", fontSize: 17 }}>
              Já possui uma conta? Faça Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </AuthContainer>
  );
};

export default RenderReset;
``