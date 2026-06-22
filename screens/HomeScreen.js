import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORIES } from '../data/categories';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();
  const { colors } = useTheme();
  const email = user?.email;

  // Botões de acesso direto ao Carrinho, Perfil e Configurações no cabeçalho
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate('Cart')}
          >
            <Ionicons name="cart-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons name="person-circle-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name="settings-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, colors]);

  function renderCategory({ item }) {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate('CategoryProducts', {
            categoryId: item.id,
            categoryName: item.name,
          })
        }
      >
        <Text style={styles.cardText}>{item.name}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        {email ? (
          <Text style={[styles.greeting, { color: colors.subtext }]}>
            Olá, {email}
          </Text>
        ) : null}
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logout}>Sair</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.quickLinks}>
        <TouchableOpacity
          style={[styles.quickLink, { backgroundColor: colors.card }]}
          onPress={() => navigation.navigate('Orders')}
        >
          <Ionicons name="receipt-outline" size={20} color={colors.primary} />
          <Text style={[styles.quickLinkText, { color: colors.primary }]}>
            Pedidos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.quickLink, { backgroundColor: colors.card }]}
          onPress={() => navigation.navigate('Restaurants')}
        >
          <Ionicons name="restaurant-outline" size={20} color={colors.primary} />
          <Text style={[styles.quickLinkText, { color: colors.primary }]}>
            Restaurantes
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.title, { color: colors.text }]}>Categorias</Text>

      <FlatList
        data={CATEGORIES}
        keyExtractor={(item) => item.id}
        renderItem={renderCategory}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: { fontSize: 14 },
  logout: { color: '#e53935', fontWeight: 'bold' },
  quickLinks: { flexDirection: 'row', marginBottom: 16 },
  quickLink: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 12,
    marginHorizontal: 4,
  },
  quickLinkText: { marginLeft: 6, fontWeight: 'bold' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  list: { paddingBottom: 16 },
  card: {
    backgroundColor: '#2e64e5',
    padding: 18,
    borderRadius: 8,
    marginBottom: 12,
  },
  cardText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  headerButtons: { flexDirection: 'row', alignItems: 'center' },
  headerButton: { marginLeft: 14 },
});