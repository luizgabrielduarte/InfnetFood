import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function ProductDetailsScreen({ route }) {
  const { product } = route.params;
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState(false);
  const { addToCart } = useCart();
  const { colors } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;

  function increase() {
    setQuantity((q) => q + 1);
  }

  function decrease() {
    setQuantity((q) => (q > 1 ? q - 1 : 1));
  }

  function handleAddToCart() {
    addToCart(product, quantity);

    // Animação simples: "bump" no botão + mudança de cor/texto temporária
    setFeedback(true);
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.08, duration: 120, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();

    setTimeout(() => setFeedback(false), 1200);
  }

  const total = product.price * quantity;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.name, { color: colors.text }]}>{product.name}</Text>
      <Text style={[styles.description, { color: colors.subtext }]}>
        {product.description}
      </Text>
      <Text style={[styles.price, { color: colors.text }]}>
        R$ {product.price.toFixed(2)} / unidade
      </Text>

      <View style={styles.quantityRow}>
        <TouchableOpacity
          style={[styles.qtyButton, { backgroundColor: colors.primary }]}
          onPress={decrease}
        >
          <Text style={styles.qtyButtonText}>-</Text>
        </TouchableOpacity>

        <Text style={[styles.quantity, { color: colors.text }]}>{quantity}</Text>

        <TouchableOpacity
          style={[styles.qtyButton, { backgroundColor: colors.primary }]}
          onPress={increase}
        >
          <Text style={styles.qtyButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.total, { color: colors.text }]}>
        Total: R$ {total.toFixed(2)}
      </Text>

      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
          style={[
            styles.addButton,
            { backgroundColor: feedback ? '#2ecc71' : colors.primary },
          ]}
          onPress={handleAddToCart}
        >
          <Text style={styles.addButtonText}>
            {feedback ? 'Adicionado ✓' : 'Adicionar ao carrinho'}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  description: { fontSize: 14, marginBottom: 16 },
  price: { fontSize: 16, marginBottom: 24 },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  qtyButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyButtonText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  quantity: { fontSize: 20, marginHorizontal: 24 },
  total: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 24 },
  addButton: {
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
});