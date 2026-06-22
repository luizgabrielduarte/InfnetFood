import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { ORDERS } from '../data/orders';
import { useTheme } from '../context/ThemeContext';

export default function OrdersScreen() {
  const { colors } = useTheme();

  function renderOrder({ item }) {
    return (
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.restaurant, { color: colors.text }]}>
            {item.restaurantName}
          </Text>
          <Text style={[styles.status, { color: colors.primary }]}>
            {item.status}
          </Text>
        </View>
        <Text style={[styles.date, { color: colors.subtext }]}>{item.date}</Text>

        {item.items.map((product, index) => (
          <Text key={index} style={[styles.itemLine, { color: colors.text }]}>
            {product.quantity}x {product.name}
          </Text>
        ))}

        <Text style={[styles.total, { color: colors.text }]}>
          Total: R$ {item.total.toFixed(2)}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {ORDERS.length === 0 ? (
        <Text style={[styles.empty, { color: colors.subtext }]}>
          Você ainda não fez nenhum pedido.
        </Text>
      ) : (
        <FlatList
          data={ORDERS}
          keyExtractor={(item) => item.id}
          renderItem={renderOrder}
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
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  restaurant: { fontSize: 16, fontWeight: 'bold' },
  status: { fontSize: 13, fontWeight: 'bold' },
  date: { fontSize: 12, marginBottom: 8 },
  itemLine: { fontSize: 14 },
  total: { fontSize: 15, fontWeight: 'bold', marginTop: 8 },
  empty: { textAlign: 'center', marginTop: 24 },
});