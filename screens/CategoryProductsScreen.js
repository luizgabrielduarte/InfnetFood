import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { PRODUCTS } from '../data/products';
import { useTheme } from '../context/ThemeContext';

export default function CategoryProductsScreen({ navigation, route }) {
  const { categoryId, categoryName } = route.params;
  const products = PRODUCTS[categoryId] || [];
  const { colors } = useTheme();

  function renderProduct({ item }) {
    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.card }]}
        onPress={() => navigation.navigate('ProductDetails', { product: item })}
      >
        <Text style={[styles.cardTitle, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.cardPrice, { color: colors.primary }]}>
          R$ {item.price.toFixed(2)}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {products.length === 0 ? (
        <Text style={[styles.empty, { color: colors.subtext }]}>
          Nenhum produto encontrado em {categoryName}.
        </Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={renderProduct}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  list: { paddingBottom: 16 },
  card: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  cardPrice: { fontSize: 14 },
  empty: { textAlign: 'center', marginTop: 24 },
});