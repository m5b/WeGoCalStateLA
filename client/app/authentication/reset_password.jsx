import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, SafeAreaView, KeyboardAvoidingView, ActivityIndicator, Platform } from 'react-native';
import WebLayout from '../../components/WebLayout';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowLeft, GraduationCap, Mail, Lock, KeyRound, Eye, EyeOff } from 'lucide-react-native';
import Colors from '../../constant/Colors';
import { isWeb, width } from '../../utils/responsive';
import {
  requestPasswordReset,
  verifyPasswordResetOtp,
  completePasswordReset,
} from '../../services/authService';

const STEP = { EMAIL: 'email', OTP: 'otp', PASSWORD: 'password', DONE: 'done' };

export default function ResetPasswordScreen() {
  const [step, setStep] = useState(STEP.EMAIL);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  const parseError = (err, fallback) => {
    if (err.status === 400 && err.data) return Object.values(err.data).join('\n');
    if (err.data && typeof err.data === 'object') {
      const msg = Object.values(err.data)[0];
      if (msg) return msg;
    }
    return fallback;
  };

  const submitEmail = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    setIsLoading(true);
    setErrorMessage('');
    try {
      await requestPasswordReset(email.trim());
      setInfoMessage(`If an account exists for ${email.trim()}, we sent it a 6-digit code.`);
      setStep(STEP.OTP);
    } catch (err) {
      setErrorMessage(parseError(err, 'Something went wrong. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  const submitOtp = async () => {
    if (!/^\d{6}$/.test(otp)) {
      Alert.alert('Error', 'Enter the 6-digit code from your email');
      return;
    }
    setIsLoading(true);
    setErrorMessage('');
    try {
      await verifyPasswordResetOtp(otp);
      setInfoMessage('');
      setStep(STEP.PASSWORD);
    } catch (err) {
      setErrorMessage(parseError(err, 'Incorrect or expired code. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      await requestPasswordReset(email.trim());
      setInfoMessage('A new code was sent, if that account exists.');
    } catch (err) {
      setErrorMessage(parseError(err, 'Could not resend the code. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  const submitPassword = async () => {
    if (!password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in both password fields');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    setErrorMessage('');
    try {
      await completePasswordReset(password);
      setStep(STEP.DONE);
    } catch (err) {
      setErrorMessage(parseError(err, 'Could not reset your password. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  const stepTitle = {
    [STEP.EMAIL]: 'Reset Your Password',
    [STEP.OTP]: 'Check Your Email',
    [STEP.PASSWORD]: 'Set a New Password',
    [STEP.DONE]: 'Password Updated',
  }[step];

  const stepSubtitle = {
    [STEP.EMAIL]: 'Enter the email on your account',
    [STEP.OTP]: 'Enter the 6-digit code we sent you',
    [STEP.PASSWORD]: 'Choose a new password',
    [STEP.DONE]: 'You can now sign in with your new password',
  }[step];

  const form = (
    <View style={styles.formCard}>
      <View style={styles.formHeader}>
        <Text style={styles.formTitle}>{stepTitle}</Text>
        <Text style={styles.formSubtitle}>{stepSubtitle}</Text>
      </View>

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      {infoMessage ? <Text style={styles.infoText}>{infoMessage}</Text> : null}

      {step === STEP.EMAIL && (
        <>
          <View style={styles.inputContainer}>
            <Mail size={20} color="#9CA3AF" />
            <TextInput
              style={styles.textInput}
              placeholder="Email Address"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="go"
              onSubmitEditing={submitEmail}
            />
          </View>
          <TouchableOpacity
            style={[styles.primaryButton, isLoading && styles.disabledButton]}
            onPress={submitEmail}
            disabled={isLoading}
          >
            <LinearGradient colors={[Colors.PRIMARY, '#1e40af']} style={styles.buttonGradient}>
              <Text style={styles.primaryButtonText}>{isLoading ? 'Sending...' : 'Send reset code'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </>
      )}

      {step === STEP.OTP && (
        <>
          <View style={styles.inputContainer}>
            <KeyRound size={20} color="#9CA3AF" />
            <TextInput
              style={styles.textInput}
              placeholder="6-digit code"
              placeholderTextColor="#9CA3AF"
              value={otp}
              onChangeText={(v) => setOtp(v.replace(/[^0-9]/g, '').slice(0, 6))}
              keyboardType="number-pad"
              returnKeyType="go"
              onSubmitEditing={submitOtp}
            />
          </View>
          <TouchableOpacity
            style={[styles.primaryButton, isLoading && styles.disabledButton]}
            onPress={submitOtp}
            disabled={isLoading}
          >
            <LinearGradient colors={[Colors.PRIMARY, '#1e40af']} style={styles.buttonGradient}>
              <Text style={styles.primaryButtonText}>{isLoading ? 'Verifying...' : 'Verify code'}</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={resendOtp} disabled={isLoading} style={{ marginTop: 16 }}>
            <Text style={styles.linkText}>Didn't get a code? Resend</Text>
          </TouchableOpacity>
        </>
      )}

      {step === STEP.PASSWORD && (
        <>
          <View style={styles.inputContainer}>
            <Lock size={20} color="#9CA3AF" />
            <TextInput
              style={styles.textInput}
              placeholder="New password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={20} color="#9CA3AF" /> : <Eye size={20} color="#9CA3AF" />}
            </TouchableOpacity>
          </View>
          <Text style={styles.hintText}>
            8-21 characters, with uppercase, lowercase, a number, and a special character (@$!%*?&amp;).
          </Text>
          <View style={styles.inputContainer}>
            <Lock size={20} color="#9CA3AF" />
            <TextInput
              style={styles.textInput}
              placeholder="Confirm new password"
              placeholderTextColor="#9CA3AF"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              returnKeyType="go"
              onSubmitEditing={submitPassword}
            />
          </View>
          <TouchableOpacity
            style={[styles.primaryButton, isLoading && styles.disabledButton]}
            onPress={submitPassword}
            disabled={isLoading}
          >
            <LinearGradient colors={[Colors.PRIMARY, '#1e40af']} style={styles.buttonGradient}>
              <Text style={styles.primaryButtonText}>{isLoading ? 'Saving...' : 'Reset password'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </>
      )}

      {step === STEP.DONE && (
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.replace('/authentication/login')}
        >
          <LinearGradient colors={[Colors.PRIMARY, '#1e40af']} style={styles.buttonGradient}>
            <Text style={styles.primaryButtonText}>Go to sign in</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}

      <View style={styles.signupContainer}>
        <TouchableOpacity onPress={() => router.push('/authentication/login')}>
          <Text style={styles.signupLink}>Back to sign in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return isWeb ? (
    <WebLayout>
      <View style={styles.webMainContent}>
        <View style={styles.webLeftSide}>
          <View style={styles.brandingSection}>
            <View style={styles.universityLogo}>
              <GraduationCap size={80} color={Colors.PRIMARY} />
            </View>
            <Text style={styles.universityTitle}>Cal State LA</Text>
            <Text style={styles.universitySubtitle}>Cal State LA Wellbeing Platform</Text>
          </View>
        </View>
        <View style={styles.webRightSide}>{form}</View>
      </View>
    </WebLayout>
  ) : (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.PRIMARY_900 }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.mobileScrollContainer}>
          <View style={styles.mobileHeader}>
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={Colors.WHITE} />
            </TouchableOpacity>
            <Text style={styles.mobileHeaderTitle}>Reset Password</Text>
          </View>
          <View style={styles.mobileFormWrapper}>{form}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  webMainContent: {
    flexDirection: width < 1024 ? 'column' : 'row',
    minHeight: 'calc(100vh - 60px)',
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  webLeftSide: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: width < 640 ? 24 : width < 1024 ? 40 : 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandingSection: { maxWidth: 500, alignItems: 'center' },
  universityLogo: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 32, borderWidth: 4, borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  universityTitle: { fontSize: width < 640 ? 32 : 42, fontWeight: '900', color: Colors.WHITE, marginBottom: 12 },
  universitySubtitle: { fontSize: width < 640 ? 18 : 22, color: 'rgba(255, 255, 255, 0.9)', fontWeight: '500', textAlign: 'center' },
  webRightSide: { flex: 1, backgroundColor: 'white', padding: width < 640 ? 32 : width < 1024 ? 48 : 64, justifyContent: 'center', alignItems: 'center' },
  formCard: { width: '100%', maxWidth: 400 },
  formHeader: { marginBottom: 32, alignItems: 'center' },
  formTitle: { fontSize: width < 640 ? 26 : 30, fontWeight: '800', color: '#1e293b', marginBottom: 8, textAlign: 'center' },
  formSubtitle: { fontSize: 16, color: '#64748b', textAlign: 'center' },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: '#e2e8f0',
    borderRadius: 12, marginBottom: 14, paddingHorizontal: 16, backgroundColor: '#f8fafc', height: 56, gap: 12,
  },
  textInput: { flex: 1, fontSize: 16, color: '#1e293b' },
  hintText: { fontSize: 12, color: '#64748b', marginBottom: 14, marginTop: -4 },
  primaryButton: { borderRadius: 12, marginTop: 8, marginBottom: 8 },
  buttonGradient: { paddingVertical: 18, borderRadius: 12, alignItems: 'center' },
  primaryButtonText: { color: Colors.WHITE, fontSize: 16, fontWeight: '600' },
  disabledButton: { opacity: 0.7 },
  linkText: { color: Colors.PRIMARY, fontSize: 14, fontWeight: '600', textAlign: 'center' },
  signupContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 24 },
  signupLink: { fontSize: 15, color: Colors.PRIMARY, fontWeight: '600' },
  errorText: { color: '#EF4444', fontSize: 14, fontWeight: '500', marginBottom: 12, textAlign: 'center' },
  infoText: { color: Colors.PRIMARY, fontSize: 14, fontWeight: '500', marginBottom: 12, textAlign: 'center' },
  mobileScrollContainer: { flexGrow: 1, paddingVertical: 20, backgroundColor: Colors.PRIMARY_900 },
  mobileHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, gap: 15 },
  mobileHeaderTitle: { fontSize: 20, fontWeight: '700', color: Colors.WHITE },
  mobileFormWrapper: { backgroundColor: Colors.WHITE, borderRadius: 20, margin: 16, padding: 24 },
});