/*Função: definir o fluxo de navegação entre as telas de autenticação: Login, Register, ResetPassword
Sobreposição de telas: Stack Navigator, 3 funções para manipular o empilhamento:
push(): empilha a tela atual sobre a anterior
back(): remove a tela atual e retorna à tela anterior empilhada
replace(): subtitui a tela atual pela próxima */

import { useAuth } from "@/contexts/AuthContext";
import { Redirect, Stack } from "expo-router";

const AuthLayout = () => {
  const { token, isLoading } = useAuth();
  {
    /* Posteriormente colocar um componente de loading */
  }
  if (isLoading) return null;

  if (token) {
    return <Redirect href="/(tabs)/explorer" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Login" }} />
      <Stack.Screen name="register" options={{ title: "Cadastro" }} />
      <Stack.Screen
        name="resetPassword"
        options={{ title: "Esqueci minha senha" }}
      />
    </Stack>
  );
};
export default AuthLayout;