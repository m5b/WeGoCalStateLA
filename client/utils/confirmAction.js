import { Alert, Platform } from 'react-native';

// Shows a destructive-action confirmation and runs onConfirm if accepted.
// Alert.alert buttons don't render on web, so web falls back to window.confirm.
export function confirmAction({ title, message, confirmText = 'Delete', onConfirm }) {
  if (Platform.OS === 'web') {
    if (globalThis.confirm?.(message)) onConfirm();
    return;
  }
  Alert.alert(title, message, [
    { text: 'Cancel', style: 'cancel' },
    { text: confirmText, style: 'destructive', onPress: onConfirm },
  ]);
}
