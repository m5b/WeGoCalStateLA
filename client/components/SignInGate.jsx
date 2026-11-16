import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { MessagesSquare, Calendar } from 'lucide-react-native';
import { Colors } from '../constant/Colors';

const GATE_COPY = {
  threads: {
    icon: MessagesSquare,
    title: 'Join the conversation',
    message:
      'Create a free account to read and share in Community threads. Ask questions, swap advice, and connect with other families and loved ones of Cal State LA students.',
  },
  events: {
    icon: Calendar,
    title: "Don't miss what's happening",
    message:
      'Create a free account to see upcoming Cal State LA events for families and loved ones. Find workshops, meetups, and new ways to connect with others supporting a student.',
  },
};

// Wraps a screen's content: when `locked`, blurs it, hides it from screen
// readers, and shows the sign-in card on top. Anything outside it (like the
// navbar) stays as is.
export function GatedContent({ variant, locked, children }) {
  return (
    <View style={styles.gatedContainer}>
      <View
        style={styles.gatedContainer}
        aria-hidden={locked || undefined}
        accessibilityElementsHidden={locked}
        importantForAccessibility={locked ? 'no-hide-descendants' : 'auto'}
      >
        {children}
      </View>
      {locked && <SignInGate variant={variant} />}
    </View>
  );
}

export default function SignInGate({ variant }) {
  const copy = GATE_COPY[variant] ?? GATE_COPY.threads;
  const IconComponent = copy.icon;

  return (
    <View style={styles.container}>
      <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFill} />
      {/* Extra wash so the blur reads clearly on platforms with weaker blur support */}
      <View style={[StyleSheet.absoluteFill, styles.wash]} />

      <View accessibilityRole="alert" style={styles.card}>
        <View style={styles.iconCircle}>
          <IconComponent size={28} color={Colors.BLACK} />
        </View>
        <Text style={styles.title}>{copy.title}</Text>
        <Text style={styles.message}>{copy.message}</Text>

        <TouchableOpacity
          accessibilityRole="button"
          activeOpacity={0.8}
          style={styles.primaryButton}
          onPress={() => router.push('/authentication/signup')}
        >
          <Text style={styles.primaryButtonText}>Create an account</Text>
        </TouchableOpacity>

        <View style={styles.signInRow}>
          <Text style={styles.signInPrompt}>Already have an account?</Text>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => router.push('/authentication/login')}
          >
            <Text style={styles.signInLink}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gatedContainer: {
    flex: 1,
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    zIndex: 50,
  },
  wash: {
    backgroundColor: Platform.OS === 'web' ? 'rgba(248, 250, 252, 0.35)' : 'rgba(248, 250, 252, 0.6)',
  },
  card: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: Colors.WHITE,
    borderRadius: 16,
    borderTopWidth: 4,
    borderTopColor: Colors.BRAND_GOLD,
    paddingHorizontal: 28,
    paddingVertical: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 12,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.LIGHT_GOLD,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.GRAY_800,
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: 24,
  },
  primaryButton: {
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: Colors.BRAND_GOLD,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.BLACK,
  },
  signInRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
  },
  signInPrompt: {
    fontSize: 14,
    color: Colors.TEXT_MUTED,
  },
  signInLink: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.BLACK,
    textDecorationLine: 'underline',
  },
});
