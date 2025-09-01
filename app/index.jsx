import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withDelay
} from 'react-native-reanimated';
import Colors from '../constant/Colors';

const { width, height } = Dimensions.get('window');

SplashScreen.preventAutoHideAsync();

export default function AppSplash() {
  const logoScale = useSharedValue(0);
  const cardOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(0);

  useEffect(() => {
    SplashScreen.hideAsync();
    
    // Animate elements in sequence
    logoScale.value = withSpring(1, { duration: 800 });
    cardOpacity.value = withDelay(300, withSpring(1, { duration: 600 }));
    buttonScale.value = withDelay(600, withSpring(1, { duration: 500 }));
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleEnterApp = () => {
    router.push('/home_screen/home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[Colors.PRIMARY, Colors.SECONDARY]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg' }}
              style={styles.logo}
            />
          </Animated.View>

          <Animated.View style={[styles.card, cardAnimatedStyle]}>
            <Text style={styles.title}>WeGoToCalStateLA</Text>
            <Text style={styles.subtitle}>Mental Health & Wellness Platform</Text>
            <Text style={styles.description}>
              Supporting Golden Eagles in their journey to mental wellness and academic success
            </Text>
            
            <Animated.View style={buttonAnimatedStyle}>
              <TouchableOpacity 
                style={styles.enterButton}
                onPress={handleEnterApp}
                activeOpacity={0.8}
              >
                <Text style={styles.enterButtonText}>Enter App</Text>
              </TouchableOpacity>
            </Animated.View>

            <Text style={styles.demoNote}>Demo Version</Text>
          </Animated.View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: Colors.WHITE,
  },
  card: {
    backgroundColor: Colors.WHITE,
    borderRadius: 20,
    padding: 30,
    marginHorizontal: 20,
    alignItems: 'center',
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 15,
    maxWidth: width * 0.9,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.DARK_BLUE,
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: Colors.GRAY,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  enterButton: {
    backgroundColor: Colors.SECONDARY,
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 20,
  },
  enterButtonText: {
    color: Colors.BLACK,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  demoNote: {
    fontSize: 14,
    color: Colors.PRIMARY,
    fontStyle: 'italic',
  },
});