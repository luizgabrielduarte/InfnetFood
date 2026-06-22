import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import { useCart } from '../context/CartContext';
import { PAYMENT_METHODS } from '../data/paymentMethods';
import { fetchAddressByCep } from '../services/cepService';
import { scheduleOrderStatusNotifications } from '../services/notificationsService';
import { useTheme } from '../context/ThemeContext';

export default function CheckoutScreen({ navigation }) {
  const { items, clearCart } = useCart();
  const { colors } = useTheme();
  const [cep, setCep] = useState('');
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [errors, setErrors] = useState({});
  const successOpacity = useRef(new Animated.Value(0)).current;

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  async function handleSearchCep() {
    setCepError('');
    setCepLoading(true);
    try {
      const result = await fetchAddressByCep(cep);
      setAddress(
        `${result.street}, ${result.neighborhood} - ${result.city}/${result.state}`
      );
    } catch (err) {
      setCepError(err.message);
    } finally {
      setCepLoading(false);
    }
  }

  function validate() {
    const newErrors = {};
    if (!address.trim()) newErrors.address = 'Informe o endereço de entrega.';
    if (!paymentMethod) newErrors.paymentMethod = 'Selecione um método de pagamento.';
    return newErrors;
  }

  function handleConfirm() {
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Notificações locais simulando a evolução do status do pedido
    scheduleOrderStatusNotifications();

    // Animação simples de confirmação (fade in/out do banner verde)
    Animated.sequence([
      Animated.timing(successOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.delay(900),
      Animated.timing(successOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      clearCart();
      navigation.navigate('Orders');
    });
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
    <View style={[styles.wrapper, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Resumo do pedido
        </Text>
        {items.map((item) => {
          const subtotal = item.product.price * item.quantity;
          return (
            <View style={styles.itemRow} key={item.product.id}>
              <Text style={[styles.itemName, { color: colors.text }]}>
                {item.quantity}x {item.product.name}
              </Text>
              <Text style={[styles.itemSubtotal, { color: colors.text }]}>
                R$ {subtotal.toFixed(2)}
              </Text>
            </View>
          );
        })}
        <Text style={[styles.total, { color: colors.text }]}>
          Total: R$ {total.toFixed(2)}
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Endereço de entrega
        </Text>

        <View style={styles.cepRow}>
          <TextInput
            style={[
              styles.input,
              styles.cepInput,
              { borderColor: colors.border, color: colors.text },
            ]}
            placeholder="CEP (ex: 01310930)"
            placeholderTextColor={colors.subtext}
            keyboardType="numeric"
            value={cep}
            onChangeText={setCep}
            maxLength={9}
          />
          <TouchableOpacity
            style={[styles.cepButton, { backgroundColor: colors.primary }]}
            onPress={handleSearchCep}
            disabled={cepLoading}
          >
            <Text style={styles.cepButtonText}>
              {cepLoading ? '...' : 'Buscar'}
            </Text>
          </TouchableOpacity>
        </View>
        {cepError ? <Text style={styles.error}>{cepError}</Text> : null}

        <TextInput
          style={[
            styles.input,
            styles.addressInput,
            { borderColor: colors.border, color: colors.text },
          ]}
          placeholder="Rua, número, bairro"
          placeholderTextColor={colors.subtext}
          value={address}
          onChangeText={setAddress}
        />
        {errors.address ? <Text style={styles.error}>{errors.address}</Text> : null}

        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Método de pagamento
        </Text>
        <View style={styles.paymentOptions}>
          {PAYMENT_METHODS.map((method) => {
            const selected = paymentMethod === method;
            return (
              <TouchableOpacity
                key={method}
                style={[
                  styles.paymentOption,
                  { borderColor: colors.primary },
                  selected && { backgroundColor: colors.primary },
                ]}
                onPress={() => setPaymentMethod(method)}
              >
                <Text
                  style={[
                    styles.paymentOptionText,
                    { color: selected ? '#fff' : colors.primary },
                  ]}
                >
                  {method}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {errors.paymentMethod ? (
          <Text style={styles.error}>{errors.paymentMethod}</Text>
        ) : null}

        <TouchableOpacity
          style={[styles.confirmButton, { backgroundColor: colors.primary }]}
          onPress={handleConfirm}
        >
          <Text style={styles.confirmButtonText}>Confirmar pedido</Text>
        </TouchableOpacity>
      </ScrollView>

      <Animated.View
        style={[styles.successBanner, { opacity: successOpacity }]}
        pointerEvents="none"
      >
        <Text style={styles.successText}>Pedido confirmado!</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  container: { flex: 1 },
  content: { padding: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  itemName: { fontSize: 14 },
  itemSubtotal: { fontSize: 14, fontWeight: 'bold' },
  total: { fontSize: 16, fontWeight: 'bold', marginTop: 8 },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
  },
  cepRow: { flexDirection: 'row', alignItems: 'center' },
  cepInput: { flex: 1, marginRight: 8 },
  cepButton: {
    borderRadius: 6,
    paddingHorizontal: 16,
    justifyContent: 'center',
    height: 46,
  },
  cepButtonText: { color: '#fff', fontWeight: 'bold' },
  addressInput: { marginTop: 10 },
  error: { color: 'red', marginTop: 4 },
  paymentOptions: { flexDirection: 'row', flexWrap: 'wrap' },
  paymentOption: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 8,
    marginBottom: 8,
  },
  paymentOptionText: { fontWeight: 'bold' },
  confirmButton: {
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 24,
  },
  confirmButtonText: { color: '#fff', fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: 24 },
  successBanner: {
    position: 'absolute',
    top: 16,
    left: 20,
    right: 20,
    backgroundColor: '#2ecc71',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  successText: { color: '#fff', fontWeight: 'bold' },
});