import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';

import AuthContainer from '../ui/AuthContainer';
import PasswordField from '../ui/PasswordField';
import TextField from '../ui/TextField';

// ──────────────────────────────────────────────
// Tipagens
// ──────────────────────────────────────────────
type FormField = 'email' | 'cpf' | 'currentPassword' | 'newPassword' | 'confirmPassword';

interface Errors {
  email?: string;
  cpf?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

type Touched = Partial<Record<FormField, boolean>>;

// ──────────────────────────────────────────────
// Validações
// ──────────────────────────────────────────────
const isValidEmail = (email: string): boolean => {
  // Regex simples e segura para RN/JS
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

const cleanCpf = (value: string) => value.replace(/\D/g, '');
const isValidCpf = (value: string): boolean => {
  // Aqui só verifico tamanho (11) para exemplo.
  // Se quiser validação completa do CPF, dá para implementar logo abaixo.
  const onlyDigits = cleanCpf(value);
  return onlyDigits.length === 11;
};

const MIN_PASSWORD_LENGTH = 6;

// ──────────────────────────────────────────────
export default function ProfileScreen() {
  const router = useRouter();
  const { width } = Dimensions.get('window');

  // ─── Dados do perfil ───────────────────────────────
  const [name, setName] = useState('Aspas');
  const [email, setEmail] = useState('Aspas@gmail.com');
  const [cpf, setCpf] = useState('8738291111');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  // ─── Alteração de senha ────────────────────────────
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // ─── Estados de UI ─────────────────────────────────
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [touched, setTouched] = useState<Touched>({});

  // ─── Erros ─────────────────────────────────────────
  const errors = useMemo<Errors>(() => {
    const err: Errors = {};

    // Perfil
    if (touched.email) {
      if (!email) err.email = 'E-mail é obrigatório';
      else if (!isValidEmail(email)) err.email = 'E-mail inválido';
    }

    if (touched.cpf && cpf) {
      if (!isValidCpf(cpf)) {
        err.cpf = 'CPF inválido (11 dígitos)';
      }
    }

    // Senha
    if (touched.currentPassword && !currentPassword) {
      err.currentPassword = 'Senha atual é obrigatória';
    }

    if (touched.newPassword) {
      if (!newPassword) {
        err.newPassword = 'Nova senha é obrigatória';
      } else if (newPassword.length < MIN_PASSWORD_LENGTH) {
        err.newPassword = `Mínimo ${MIN_PASSWORD_LENGTH} caracteres`;
      }
    }

    if (touched.confirmPassword) {
      if (!confirmPassword) {
        err.confirmPassword = 'Confirmação é obrigatória';
      } else if (newPassword && confirmPassword !== newPassword) {
        err.confirmPassword = 'As senhas não coincidem';
      }
    }

    return err;
  }, [email, cpf, currentPassword, newPassword, confirmPassword, touched]);

  // ─── Condições de habilitação dos botões ───────────
  const profileIsValid = Boolean(email && isValidEmail(email) && name.trim() && (!cpf || isValidCpf(cpf)));
  const canSaveProfile = profileIsValid && !savingProfile;

  const passwordIsValid =
    currentPassword.length > 0 &&
    newPassword.length >= MIN_PASSWORD_LENGTH &&
    confirmPassword === newPassword;

  const canChangePassword = passwordIsValid && !savingPassword;

  // ─── Seleção de imagem ─────────────────────────────
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria para selecionar uma foto.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setProfilePhoto(result.assets[0].uri);
      // TODO: upload para backend:
      // await uploadProfilePhoto(result.assets[0].uri);
    }
  };

  // ─── Handlers de salvamento (simulados) ────────────
  const handleSaveProfile = async () => {
    if (!canSaveProfile) return;

    setSavingProfile(true);
    try {
      // Simulação de API
      await new Promise((resolve) => setTimeout(resolve, 1400));
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível atualizar o perfil. Tente novamente.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!canChangePassword) return;

    setSavingPassword(true);
    try {
      // Simulação de API
      await new Promise((resolve) => setTimeout(resolve, 1800));
      Alert.alert('Sucesso', 'Senha alterada com sucesso!');

      // Limpar campos
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTouched({});
      setShowPasswordModal(false);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível alterar a senha. Verifique os dados e tente novamente.');
    } finally {
      setSavingPassword(false);
    }
  };

  // ─── Render ────────────────────────────────────────
  return (
    <AuthContainer>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Foto de perfil */}
        <View style={styles.header}>
          <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
            <View style={styles.avatarWrapper}>
              {profilePhoto ? (
                <Image
                  source={{ uri: profilePhoto }}
                  style={styles.avatar}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarIcon}>✎</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>

          <Text style={styles.nameText}>{name || 'Usuário'}</Text>
          <Text style={styles.emailText}>{email || 'email@exemplo.com'}</Text>
        </View>

        {/* ─── Editar perfil ─── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações pessoais</Text>

          <TextField
            label="Nome"
            value={name}
            onChangeText={setName}
            placeholder="Seu nome"
            onBlur={() => setTouched((prev) => ({ ...prev,
            }))}
            autoCapitalize="words"
          />

          <TextField
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            placeholder="email@exemplo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
          />

          <TextField
            label="CPF"
            value={cpf}
            onChangeText={setCpf}
            placeholder="Somente números"
            keyboardType="number-pad"
            onBlur={() => setTouched((prev) => ({ ...prev, cpf: true }))}
          />

          <TouchableOpacity
            style={[styles.primaryBtn, !canSaveProfile && styles.disabledBtn]}
            onPress={handleSaveProfile}
            disabled={!canSaveProfile}
          >
            {savingProfile ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.primaryBtnText}>Salvar Perfil</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* ─── Alterar senha ─── */}
        <View style={styles.section}>
          <TouchableOpacity
            onPress={() => setShowPasswordModal(true)}
            style={styles.changePassBtn}
          >
            <Text style={styles.changePassText}>Alterar Senha</Text>
          </TouchableOpacity>
        </View>

        {/* ─── MODAL DE ALTERAR SENHA ─── */}
        <Modal
          visible={showPasswordModal}
          animationType="slide"
          transparent
          onRequestClose={() => setShowPasswordModal(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Alterar Senha</Text>

              <PasswordField
                label="Senha atual"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                onBlur={() => setTouched((p) => ({ ...p, currentPassword: true }))}
              />

              <PasswordField
                label="Nova senha"
                value={newPassword}
                onChangeText={setNewPassword}
                onBlur={() => setTouched((p) => ({ ...p, newPassword: true }))}
              />

              <PasswordField
                label="Confirmar nova senha"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                onBlur={() => setTouched((p) => ({ ...p, confirmPassword: true }))}
              />

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  onPress={() => {
                    setShowPasswordModal(false);
                    setTouched({});
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  style={styles.secondaryBtn}
                >
                  <Text style={styles.secondaryBtnText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleChangePassword}
                  style={[styles.primaryBtn, !canChangePassword && styles.disabledBtn]}
                  disabled={!canChangePassword}
                >
                  {savingPassword ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.primaryBtnText}>Confirmar</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </AuthContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: 16,
    paddingBottom: 48,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarWrapper: {
    width: 112,
    height: 112,
    borderRadius: 56,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#673AB7',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    flex: 1,
    backgroundColor: '#EEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarIcon: {
    fontSize: 28,
    color: '#888',
  },
  nameText: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
  emailText: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginTop: 20,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  primaryBtn: {
    backgroundColor: '#673AB7',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
  disabledBtn: {
    opacity: 0.6,
  },
  changePassBtn: {
    backgroundColor: '#673AB7',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  changePassText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.35)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
    color: '#222',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  secondaryBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCC',
    backgroundColor: '#FFF',
  },
  secondaryBtnText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 16,
  },
});