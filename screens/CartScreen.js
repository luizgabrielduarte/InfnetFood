import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function CartScreen({ navigation }) {
  const { items, removeFromCart } = useCart();
  const { colors } = useTheme();

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  function renderItem({ item }) {
    const subtotal = item.product.price * item.quantity;
    return (
      <View style={[styles.itemRow, { backgroundColor: colors.card }]}>
        <View style={styles.itemInfo}>
          <Text style={[styles.itemName, { color: colors.text }]}>
            {item.product.name}
          </Text>
          <Text style={[styles.itemDetail, { color: colors.subtext }]}>
            {item.quantity}x R$ {item.product.price.toFixed(2)}
          </Text>
        </View>
        <Text style={[styles.itemSubtotal, { color: colors.text }]}>
          R$ {subtotal.toFixed(2)}
        </Text>
        <TouchableOpacity onPress={() => removeFromCart(item.product.id)}>
          <Text style={styles.remove}>Remover</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.empty, { color: colors.subtext }]}>
          Seu carrinho está vazio.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.product.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <Text style={[styles.totalLabel, { color: colors.text }]}>Total</Text>
        <Text style={[styles.totalValue, { color: colors.text }]}>
          R$ {total.toFixed(2)}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.checkoutButton, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate('Checkout')}
      >
        <Text style={styles.checkoutButtonText}>Finalizar pedido</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  list: { paddingBottom: 16 },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: 'bold' },
  itemDetail: { fontSize: 13 },
  itemSubtotal: { fontSize: 14, fontWeight: 'bold', marginRight: 12 },
  remove: { color: '#e53935', fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: 24 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  totalLabel: { fontSize: 18, fontWeight: 'bold' },
  totalValue: { fontSize: 18, fontWeight: 'bold' },
  checkoutButton: {
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 16,
  },
  checkoutButtonText: { color: '#fff', fontWeight: 'bold' },
});