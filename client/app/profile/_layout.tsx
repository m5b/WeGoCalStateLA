import { Redirect, Slot } from 'expo-router';
import { ActivityIndicator, SafeAreaView, StyleSheet } from 'react-native';
import { Colors } from '../../constant/Colors';
import { useAuth } from '../../context/AuthContext';

export default function ProfileLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator accessibilityLabel="Checking sign-in status" color={Colors.PRIMARY} />
      </SafeAreaView>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/authentication/login" />;
  }

  return <Slot />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
  },
});
