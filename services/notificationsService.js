import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForLocalNotificationsAsync() {
  if (Platform.OS === 'web') return false;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

// Agenda uma sequência de notificações simulando o status do pedido evoluindo
export async function scheduleOrderStatusNotifications() {
  if (Platform.OS === 'web') return false;

  const granted = await registerForLocalNotificationsAsync();
  if (!granted) return false;

  const steps = [
    { title: 'Pedido confirmado', body: 'Recebemos seu pedido!', seconds: 1 },
    { title: 'Pedido em preparo', body: 'Seu pedido está sendo preparado.', seconds: 8 },
    { title: 'Saiu para entrega', body: 'Seu pedido saiu para entrega.', seconds: 16 },
    { title: 'Pedido entregue', body: 'Seu pedido foi entregue. Bom apetite!', seconds: 24 },
  ];

  for (const step of steps) {
    await Notifications.scheduleNotificationAsync({
      content: { title: step.title, body: step.body },
      trigger: { seconds: step.seconds },
    });
  }

  return true;
}