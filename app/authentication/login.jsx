import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Eye, EyeOff, Mail, Lock, User, Sparkles, Shield, CircleCheck as CheckCircle, GraduationCap } from 'lucide-react-native';
import Colors from '../../constant/Colors';
import { responsive } from '../../utils/responsive';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      router.push('/home_screen/home');
    }, 1500);
  };

  const handleForgotPassword = () => {
    router.push('/authentication/reset_password');
  };

  const handleSignUp = () => {
    router.push('/authentication/signup');
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
                  Supporting student mental health and academic success through comprehensive wellness tools and resources.
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

            {/* Right Side - Login Form */}
            <View style={styles.webRightSide}>
              <View style={styles.loginFormContainer}>
                <View style={styles.formHeader}>
                  <Text style={styles.formTitle}>Welcome Back</Text>
                  <Text style={styles.formSubtitle}>Sign in to your WeGo account</Text>
                </View>

                <View style={styles.loginForm}>
                  <View style={styles.inputContainer}>
                    <View style={styles.inputIconContainer}>
                      <Mail size={20} color="#9CA3AF" />
                    </View>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Email Address"
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

                  <TouchableOpacity
                    style={styles.forgotPassword}
                    onPress={handleForgotPassword}
                  >
                    <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.loginButton, isLoading && styles.disabledButton]}
                    onPress={handleLogin}
                    disabled={isLoading}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={[Colors.PRIMARY, '#1e40af']}
                      style={styles.buttonGradient}
                    >
                      <Text style={styles.loginButtonText}>
                        {isLoading ? 'Signing In...' : 'Sign In'}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <View style={styles.signupContainer}>
                    <Text style={styles.signupText}>Don't have an account? </Text>
                    <TouchableOpacity onPress={handleSignUp}>
                      <Text style={styles.signupLink}>Create Account</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Support Information */}
                <View style={styles.supportInfo}>
                  <Text style={styles.supportTitle}>Need Help?</Text>
                  <Text style={styles.supportText}>
                    Contact Cal State LA Student Health & Psychological Services at (323) 343-3300
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Mobile version (existing code)
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
            <Text style={styles.headerTitle}>Welcome Back</Text>
            <View style={styles.headerSpacer} />
          </View>
        </LinearGradient>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.contentPadding}>
            {/* University Branding */}
            <View style={styles.brandingCard}>
              <User size={80} color={Colors.PRIMARY} />
              <Text style={styles.universityTitle}>Cal State LA</Text>
              <Text style={styles.universitySubtitle}>Golden Eagles Mental Wellness</Text>
            </View>

            {/* Login Form */}
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Sign In to Your Account</Text>
              
              <View style={styles.inputContainer}>
                <View style={styles.inputIconContainer}>
                  <Mail size={20} color={Colors.GRAY} />
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="Email Address"
                  placeholderTextColor={Colors.GRAY}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
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

              <TouchableOpacity
                style={styles.forgotPassword}
                onPress={handleForgotPassword}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.loginButton, isLoading && styles.disabledButton]}
                onPress={handleLogin}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[Colors.SECONDARY, Colors.DARK_GOLD]}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.loginButtonText}>
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Don't have an account? </Text>
                <TouchableOpacity onPress={handleSignUp}>
                  <Text style={styles.signupLink}>Sign Up</Text>
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
  // Web Styles
  webContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  navbar: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 16,
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  navContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: width < 640 ? 16 : 32,
  },
  navBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  navLogo: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.PRIMARY + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBrandText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1e293b',
    letterSpacing: -0.5,
  },
  backToHome: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  backToHomeText: {
    fontSize: 14,
    color: Colors.PRIMARY,
    fontWeight: '500',
  },
  webScrollView: {
    flex: 1,
  },
  webMainContent: {
    flexDirection: width < 1024 ? 'column' : 'row',
    minHeight: '100vh',
  },
  webLeftSide: {
    flex: 1,
    backgroundColor: Colors.PRIMARY,
    padding: width < 640 ? 32 : width < 1024 ? 48 : 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandingSection: {
    maxWidth: 500,
    alignItems: 'center',
    textAlign: 'center',
  },
  universityLogo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  universityTitle: {
    fontSize: width < 640 ? 32 : 42,
    fontWeight: '900',
    color: Colors.WHITE,
    marginBottom: 12,
    letterSpacing: -1,
  },
  universitySubtitle: {
    fontSize: width < 640 ? 18 : 22,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 24,
    fontWeight: '500',
    textAlign: 'center',
  },
  universityDescription: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 28,
    textAlign: 'center',
    marginBottom: 48,
  },
  trustFeatures: {
    gap: 20,
    alignItems: 'center',
  },
  trustFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trustFeatureText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  webRightSide: {
    flex: 1,
    backgroundColor: 'white',
    padding: width < 640 ? 32 : width < 1024 ? 48 : 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginFormContainer: {
    width: '100%',
    maxWidth: 400,
  },
  formHeader: {
    marginBottom: 40,
    alignItems: 'center',
  },
  formTitle: {
    fontSize: width < 640 ? 28 : 32,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  formSubtitle: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '400',
  },
  loginForm: {
    marginBottom: 40,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 32,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: Colors.PRIMARY,
    fontWeight: '500',
  },
  loginButton: {
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonGradient: {
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 16,
    color: '#64748b',
  },
  signupLink: {
    fontSize: 16,
    color: Colors.PRIMARY,
    fontWeight: '600',
  },
  supportInfo: {
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
  
  // Mobile Styles (existing)
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
  brandingCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  formCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    textAlign: 'center',
    marginBottom: 20,
  },
  supportCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  supportContact: {
    fontSize: 16,
    color: Colors.SECONDARY,
    fontWeight: 'bold',
  },
  
  // Web Styles
  webContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
  },
  webLoginSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: width < 640 ? 40 : 60,
    paddingHorizontal: width < 640 ? 16 : 32,
  },
  webLoginContent: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  webBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'white',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  webBackText: {
    fontSize: 14,
    color: Colors.PRIMARY,
    fontWeight: '500',
  },
  webLoginCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: width < 640 ? 32 : 40,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 24,
  },
  webBrandSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  webBrandIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: Colors.PRIMARY + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  webBrandTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.PRIMARY,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  webBrandSubtitle: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  webFormSection: {
    width: '100%',
  },
  webFormTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 8,
  },
  webFormSubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 32,
  },
  webInputContainer: {
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
  webInputIconContainer: {
    marginRight: 12,
  },
  webTextInput: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '400',
  },
  webPasswordToggle: {
    padding: 4,
  },
  webForgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 32,
  },
  webForgotPasswordText: {
    fontSize: 14,
    color: Colors.PRIMARY,
    fontWeight: '500',
  },
  webLoginButton: {
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  webButtonGradient: {
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  webDisabledButton: {
    opacity: 0.7,
  },
  webLoginButtonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  webSignupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  webSignupText: {
    fontSize: 16,
    color: '#64748b',
  },
  webSignupLink: {
    fontSize: 16,
    color: Colors.PRIMARY,
    fontWeight: '600',
  },
  webSupportInfo: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  webSupportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center',
  },
  webSupportText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    textAlign: 'center',
  },
});