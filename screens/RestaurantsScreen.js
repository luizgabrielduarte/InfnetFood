import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { RESTAURANTS } from '../data/restaurants';
import { useTheme } from '../context/ThemeContext';

function buildMapHtml(restaurants) {
  const center = restaurants[0];
  const markers = restaurants
    .map(
      (r) => `
        L.marker([${r.latitude}, ${r.longitude}])
          .addTo(map)
          .bindPopup(${JSON.stringify(r.name)});
      `
    )
    .join('\n');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <style>
          html, body, #map { height: 100%; margin: 0; padding: 0; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script>
          const map = L.map('map').setView([${center.latitude}, ${center.longitude}], 15);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap'
          }).addTo(map);
          ${markers}
        </script>
      </body>
    </html>
  `;
}

export default function RestaurantsScreen({ navigation }) {
  const mapHtml = buildMapHtml(RESTAURANTS);
  const { colors } = useTheme();

  function renderRestaurant({ item }) {
    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.card }]}
        onPress={() => navigation.navigate('RestaurantDetails', { restaurant: item })}
      >
        <Text style={[styles.cardTitle, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.cardAddress, { color: colors.subtext }]}>
          {item.address}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.mapContainer}>
        {Platform.OS === 'web' ? (
          <View style={[styles.mapFallback, { backgroundColor: colors.card }]}>
            <Text style={[styles.mapFallbackText, { color: colors.subtext }]}>
              O mapa interativo funciona apenas no app (iOS/Android via Expo
              Go). Veja os restaurantes na lista abaixo.
            </Text>
          </View>
        ) : (
          <WebView
            originWhitelist={['*']}
            source={{ html: mapHtml }}
            style={styles.map}
          />
        )}
      </View>

      <Text style={[styles.title, { color: colors.text }]}>
        Restaurantes no Centro do Rio
      </Text>

      <FlatList
        data={RESTAURANTS}
        keyExtractor={(item) => item.id}
        renderItem={renderRestaurant}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  mapContainer: {
    height: 220,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  map: { flex: 1 },
  mapFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  mapFallbackText: {
    textAlign: 'center',
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  list: { paddingBottom: 16 },
  card: {
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
  cardAddress: { fontSize: 13, marginTop: 2 },
});