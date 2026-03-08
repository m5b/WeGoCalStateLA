import React, { useState, useRef } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Eye, EyeOff, Mail, Lock, User, Sparkles, Shield, CircleCheck as CheckCircle, GraduationCap } from 'lucide-react-native';
import { Colors } from '../../constant/Colors';
import { isWeb, width } from '../../utils/responsive';
import { useAuth } from '../../context/AuthContext';
import { initiateGoogleLogin, checkAuth, loginWithEmail } from '../../services/authService';

// Removed unused screenWidth from Dimensions

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const passwordRef = useRef(null);

  const [errorMessage, setErrorMessage] = useState('');

  const handleGoogleAuth = async () => {
    try {
      setOauthLoading(true);

      if (isWeb) {
        await initiateGoogleLogin();
      } else {
        const result = await initiateGoogleLogin();

        if (result.type === 'success') {
          const userData = await checkAuth();
          if (userData && userData.userId) {
            login(userData);
            router.push('/home_screen/home');
          } else {
            Alert.alert('Error', 'Failed to authenticate. Please try again.');
          }
        } else if (result.type === 'cancel') {
          console.log('User cancelled OAuth');
        } else {
          Alert.alert('Error', 'Google login failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('OAuth error:', error);
      Alert.alert('Error', 'An error occurred during login. Please try again.');
    } finally {
      setOauthLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      await loginWithEmail(email.trim(), password);

      const userData = await checkAuth();

      if (userData && userData.userId) {
        login(userData);
        router.push('/home_screen/home');
      } else {
        setErrorMessage('Login succeeded but failed to load user data.');
      }
    } catch (err) {
      if (err.status === 400 && err.data) {
        const messages = Object.values(err.data).join('\n');
        if (isWeb) {
          setErrorMessage(messages);
        } else {
          Alert.alert('Validation Error', messages);
        }
      } else if (err.status === 401) {
        const msg = 'Invalid email or password.';
        if (isWeb) {
          setErrorMessage(msg);
        } else {
          Alert.alert('Login Failed', msg);
        }
      } else if (err.status === 404) {
        const msg = 'No account found with this email.';
        if (isWeb) {
          setErrorMessage(msg);
        } else {
          Alert.alert('Login Failed', msg);
        }
      } else {
        const msg = 'An unexpected error occurred. Please try again.';
        if (isWeb) {
          setErrorMessage(msg);
        } else {
          Alert.alert('Error', msg);
        }
      }
    } finally {
      setIsLoading(false);
    }
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

                {/* Social Login */}
                <View style={styles.socialContainer}>
                  <TouchableOpacity
                    style={[styles.googleButton, oauthLoading && styles.buttonDisabled]}
                    onPress={handleGoogleAuth}
                    activeOpacity={0.85}
                    disabled={oauthLoading}
                  >
                    {oauthLoading ? (
                      <ActivityIndicator color={Colors.PRIMARY} />
                    ) : (
                      <View style={styles.googleButtonContent}>
                        <View style={styles.googleIconWrapper}>
                          <Text style={styles.googleIconText}>G</Text>
                        </View>
                        <Text style={styles.googleButtonText}>Continue with Google</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>

                {/* Divider */}
                <View style={styles.dividerRow}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or</Text>
                  <View style={styles.dividerLine} />
                </View>

                <View style={styles.loginForm}>
                  {errorMessage ? (
                    <Text style={styles.errorText}>{errorMessage}</Text>
                  ) : null}

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
                      returnKeyType="next"
                      onSubmitEditing={() => passwordRef.current && passwordRef.current.focus()}
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
                      ref={passwordRef}
                      returnKeyType="go"
                      onSubmitEditing={handleLogin}
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
                    <Text style={styles.signupText}>Don’t have an account? </Text>
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
            {/* Login Form */}
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Sign In to Your Account</Text>
              {/* Social Login */}
              <View style={styles.socialContainer}>
                <TouchableOpacity
                  style={[styles.googleButton, oauthLoading && styles.buttonDisabled]}
                  onPress={handleGoogleAuth}
                  activeOpacity={0.85}
                  disabled={oauthLoading}
                >
                  {oauthLoading ? (
                    <ActivityIndicator color={Colors.PRIMARY} />
                  ) : (
                    <View style={styles.googleButtonContent}>
                      <View style={styles.googleIconWrapper}>
                        <Text style={styles.googleIconText}>G</Text>
                      </View>
                      <Text style={styles.googleButtonText}>Continue with Google</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>

              {/* Divider */}
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              {errorMessage ? (
                <Text style={styles.errorText}>{errorMessage}</Text>
              ) : null}

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
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current && passwordRef.current.focus()}
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
                  ref={passwordRef}
                  returnKeyType="go"
                  onSubmitEditing={handleLogin}
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
                <Text style={styles.signupText}>Don’t have an account? </Text>
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
  // Web container and layout fixes
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
  /* duplicate formTitle removed */
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
  /* duplicate webContainer removed */
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
    fontWeight: 'bold',
  },
  // Duplicate keys below are commented out to resolve ESLint no-dupe-keys
  // disabledButton: {
  //   opacity: 0.7,
  // },
  // signupContainer: {
  //   flexDirection: 'row',
  //   justifyContent: 'center',
  //   marginTop: 15,
  // },
  // signupText: {
  //   color: Colors.TEXT_SECONDARY,
  // },
  // signupLink: {
  //   color: Colors.PRIMARY,
  //   fontWeight: 'bold',
  // },
  // supportCard: {
  //   backgroundColor: Colors.WHITE,
  //   borderRadius: 20,
  //   padding: 20,
  //   marginTop: 20,
  //   marginBottom: 30,
  //   alignItems: 'center',
  //   shadowColor: Colors.BLACK,
  //   shadowOffset: {
  //     width: 0,
  //     height: 4,
  //   },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 8,
  //   elevation: 5,
  // },
  // supportTitle: {
  //   fontSize: 18,
  //   fontWeight: 'bold',
  //   color: Colors.TEXT,
  // },
  // supportText: {
  //   fontSize: 14,
  //   color: Colors.TEXT_SECONDARY,
  //   textAlign: 'center',
  //   marginBottom: 5,
  // },
  // supportContact: {
  //   fontSize: 16,
  //   color: Colors.PRIMARY,
  //   fontWeight: 'bold',
  // },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  googleIconWrapper: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIconText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
    textAlign: 'center',
  },
});