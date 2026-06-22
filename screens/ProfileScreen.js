import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const MOCKED_NAME = 'Usuário Teste';
const MOCKED_EMAIL_FALLBACK = 'usuario@teste.com';

export default function ProfileScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const email = user?.email || MOCKED_EMAIL_FALLBACK;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Ionicons
        name="person-circle"
        size={120}
        color={colors.subtext}
        style={styles.avatar}
      />
      <Text style={[styles.name, { color: colors.text }]}>{MOCKED_NAME}</Text>
      <Text style={[styles.email, { color: colors.subtext }]}>{email}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  avatar: { marginBottom: 16 },
  name: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  email: { fontSize: 14 },
});