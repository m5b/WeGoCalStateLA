import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, Alert, Dimensions, SafeAreaView, KeyboardAvoidingView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Sparkles, ArrowLeft, GraduationCap, Shield, CheckCircle, User, Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import Colors from '../../constant/Colors';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

export default function SignupScreen() {
  // Do not implement mocked signup flows; Google OAuth delegates to backend.
  // Email inputs are present for future expansion but are not wired.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleSignup = () => {
    // Backend partner: ensure server exposes `/api/auth/google` to start OAuth.
    // On successful callback, set JWT cookie and redirect back to client app.
    if (isWeb) {
      window.location.href = '/api/auth/google';
    } else {
      Alert.alert('Google Sign Up', 'Google sign-up is available on web in this dev build.');
    }
  };

  if (isWeb) {
    return (
      <View style={styles.webContainer}>
        {/* Navigation Header */}
        <View style={styles.navbar}>
          <View style={styles.navContent}>
            <TouchableOpacity 
              style={styles.navBrand}
              onPress={() => router.push('/')}
            >
              <View style={styles.navLogo}>
                <Sparkles size={24} color={Colors.PRIMARY} />
              </View>
              <Text style={styles.navBrandText}>WeGo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.backToHome}
              onPress={() => router.push('/')}
            >
              <ArrowLeft size={20} color={Colors.PRIMARY} />
              <Text style={styles.backToHomeText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.webScrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.webMainContent}>
            {/* Left Side - Branding */}
            <View style={styles.webLeftSide}>
              <View style={styles.brandingSection}>
                <View style={styles.universityLogo}>
                  <GraduationCap size={80} color={Colors.PRIMARY} />
                </View>
                <Text style={styles.universityTitle}>Cal State LA</Text>
                <Text style={styles.universitySubtitle}>Golden Eagles Mental Wellness Platform</Text>
                <Text style={styles.universityDescription}>
                  Join the WeGo community to access wellness tools, threads, and resources.
                </Text>
                
                <View style={styles.trustFeatures}>
                  <View style={styles.trustFeature}>
                    <Shield size={20} color={Colors.SUCCESS} />
                    <Text style={styles.trustFeatureText}>HIPAA Compliant</Text>
                  </View>
                  <View style={styles.trustFeature}>
                    <CheckCircle size={20} color={Colors.SUCCESS} />
                    <Text style={styles.trustFeatureText}>University Approved</Text>
                  </View>
                  <View style={styles.trustFeature}>
                    <User size={20} color={Colors.SUCCESS} />
                    <Text style={styles.trustFeatureText}>Free for Students</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Right Side - Signup Form */}
            <View style={styles.webRightSide}>
              <View style={styles.loginFormContainer}>
                <View style={styles.formHeader}>
                  <Text style={styles.formTitle}>Create Your Account</Text>
                  <Text style={styles.formSubtitle}>Sign up to get started with WeGo</Text>
                </View>

                {/* Google Sign Up */}
                <View style={styles.socialContainer}>
                  <TouchableOpacity
                    style={styles.googleAltButton}
                    onPress={handleGoogleSignup}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.googleAltButtonText}>Sign up with Google</Text>
                  </TouchableOpacity>
                </View>

                {/* Divider */}
                <View style={styles.dividerRow}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Optional email sign-up placeholders (not wired) */}
                <View style={styles.loginForm}>
                  <View style={styles.inputContainer}>
                    <View style={styles.inputIconContainer}>
                      <Mail size={20} color="#9CA3AF" />
                    </View>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Email Address / Username"
                      placeholderTextColor="#9CA3AF"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <View style={styles.inputIconContainer}>
                      <Lock size={20} color="#9CA3AF" />
                    </View>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Password"
                      placeholderTextColor="#9CA3AF"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity 
                      style={styles.passwordToggle}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff size={20} color="#9CA3AF" />
                      ) : (
                        <Eye size={20} color="#9CA3AF" />
                      )}
                    </TouchableOpacity>
                  </View>
                  {/* Backend partner: add submit handler to create account via email when ready. */}
                </View>

                {/* Link to login */}
                <View style={styles.forgotLinksContainer}>
                  <TouchableOpacity onPress={() => router.push('/authentication/login')}>
                    <Text style={styles.signupLink}>Already have an account? Log in</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Mobile layout matching login page style
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        {/* Header */}
        <LinearGradient
          colors={[Colors.PRIMARY, Colors.DARK_BLUE]}
          style={styles.header}
        >
          <View style={styles.headerRow}>
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <ArrowLeft size={24} color={Colors.WHITE} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create Account</Text>
            <View style={styles.headerSpacer} />
          </View>
        </LinearGradient>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.contentPadding}>
            {/* Signup Form */}
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Create Your Account</Text>

              {/* Social Signup */}
              <View style={styles.socialContainer}>
                <TouchableOpacity
                  style={styles.googleButton}
                  onPress={handleGoogleSignup}
                  activeOpacity={0.85}
                >
                  <Text style={styles.googleButtonText}>Sign up with Google</Text>
                </TouchableOpacity>
              </View>

              {/* Divider */}
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.inputIconContainer}>
                  <Mail size={20} color={Colors.GRAY} />
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="Email Address / Username"
                  placeholderTextColor={Colors.GRAY}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                />
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.inputIconContainer}>
                  <Lock size={20} color={Colors.GRAY} />
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="Password"
                  placeholderTextColor={Colors.GRAY}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  returnKeyType="go"
                />
                <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} color={Colors.GRAY} />
                  ) : (
                    <Eye size={20} color={Colors.GRAY} />
                  )}
                </TouchableOpacity>
              </View>

              {/* Link to login */}
              <View style={styles.forgotLinksContainer}>
                <TouchableOpacity onPress={() => router.push('/authentication/login')}>
                  <Text style={styles.signupLink}>Already have an account? Log in</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Support Information */}
            <View style={styles.supportCard}>
              <Text style={styles.supportTitle}>Need Help?</Text>
              <Text style={styles.supportText}>
                Contact Cal State LA Student Health & Psychological Services
              </Text>
              <Text style={styles.supportContact}>(323) 343-3300</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Mobile Styles (aligned with login)
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT_GRAY,
  },
  keyboardContainer: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.WHITE + '20',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.WHITE,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentPadding: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  formCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  webContainer: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  webScrollView: {
    flex: 1,
  },
  navbar: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingHorizontal: width < 640 ? 16 : 24,
    paddingVertical: 12,
  },
  navContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  navBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  navLogo: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: Colors.PRIMARY + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBrandText: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.PRIMARY,
    letterSpacing: -0.3,
  },
  backToHome: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  backToHomeText: {
    color: Colors.PRIMARY,
    fontSize: 14,
    fontWeight: '600',
  },
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
  brandingSection: {
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
  },
  universityLogo: {
    width: 120,
    height: 120,
    borderRadius: 16,
    backgroundColor: '#0b1220',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  universityTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  universitySubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#cbd5e1',
    marginBottom: 12,
  },
  universityDescription: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 24,
  },
  trustFeatures: {
    flexDirection: 'row',
    gap: 16,
  },
  trustFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trustFeatureText: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '600',
  },
  webRightSide: {
    flex: 1,
    padding: width < 640 ? 24 : width < 1024 ? 40 : 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginFormContainer: {
    width: '100%',
    maxWidth: 400,
  },
  formHeader: {
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  formSubtitle: {
    fontSize: 14,
    color: '#475569',
  },
  socialContainer: {
    gap: 12,
    marginBottom: 24,
  },
  googleButton: {
    height: 48,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleButtonText: {
    color: '#1e293b',
    fontSize: 15,
    fontWeight: '600',
  },
  googleAltButton: {
    height: 48,
    borderRadius: 10,
    backgroundColor: Colors.PRIMARY + '10',
    borderWidth: 2,
    borderColor: Colors.PRIMARY + '30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleAltButtonText: {
    color: Colors.PRIMARY,
    fontSize: 15,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  loginForm: {
    gap: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 16,
    backgroundColor: '#f8fafc',
    height: 56,
  },
  inputIconContainer: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '400',
  },
  passwordToggle: {
    padding: 4,
  },
  forgotLinksContainer: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signupLink: {
    color: Colors.PRIMARY,
    fontWeight: '600',
  },
  supportCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  supportText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
});