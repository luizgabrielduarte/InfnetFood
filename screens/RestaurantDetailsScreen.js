import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const SAMPLE_MENU_ITEM = {
  name: 'Feijoada Completa',
  description: 'Feijão preto com carnes, acompanhado de arroz, couve e farofa.',
  price: 38.9,
  image: 'https://placehold.co/400x300?text=Foto+do+prato',
};

export default function RestaurantDetailsScreen({ route }) {
  const { restaurant } = route.params;
  const { colors } = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.name, { color: colors.text }]}>{restaurant.name}</Text>
      <Text style={[styles.address, { color: colors.subtext }]}>
        {restaurant.address}
      </Text>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Exemplo do cardápio
      </Text>

      <View style={[styles.menuCard, { backgroundColor: colors.card }]}>
        <Image source={{ uri: SAMPLE_MENU_ITEM.image }} style={styles.menuImage} />
        <Text style={[styles.menuName, { color: colors.text }]}>
          {SAMPLE_MENU_ITEM.name}
        </Text>
        <Text style={[styles.menuDescription, { color: colors.subtext }]}>
          {SAMPLE_MENU_ITEM.description}
        </Text>
        <Text style={[styles.menuPrice, { color: colors.primary }]}>
          R$ {SAMPLE_MENU_ITEM.price.toFixed(2)}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24 },
  name: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  address: { fontSize: 14, marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  menuCard: {
    borderRadius: 8,
    padding: 12,
  },
  menuImage: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginBottom: 10,
  },
  menuName: { fontSize: 16, fontWeight: 'bold' },
  menuDescription: { fontSize: 13, marginVertical: 4 },
  menuPrice: { fontSize: 15, fontWeight: 'bold' },
});