import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Platform,
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
import { 
  Heart, Brain, Users, Shield, Sparkles, ArrowRight, 
  CheckCircle, Star, Award, TrendingUp, Calendar, 
  MessageCircle, BookOpen, Zap 
} from 'lucide-react-native';
import Colors from '../constant/Colors';
import WebLayout from '../components/WebLayout';

const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

SplashScreen.preventAutoHideAsync();

export default function LandingPage() {
  // Return web version for web platform
  if (isWeb) {
    return <WebLandingPage />;
  }

  // Mobile version (existing splash screen)
  return <MobileSplashScreen />;
}

function WebLandingPage() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: Heart,
      title: 'Daily Wellness Check-ins',
      description: 'Track your mental health with personalized daily assessments and mood monitoring.',
      color: '#ef4444',
      bgColor: '#fef2f2',
    },
    {
      icon: Brain,
      title: 'Professional Assessments',
      description: 'Access validated mental health screening tools like PHQ-9 and GAD-7.',
      color: '#8b5cf6',
      bgColor: '#f3f4f6',
    },
    {
      icon: Users,
      title: 'Campus Community',
      description: 'Connect with fellow Golden Eagles and participate in wellness events.',
      color: '#06b6d4',
      bgColor: '#ecfeff',
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Your mental health data is protected with enterprise-grade security.',
      color: '#10b981',
      bgColor: '#f0fdf4',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'Psychology Major',
      content: 'This platform helped me stay on top of my mental health during finals week. The daily check-ins are a game changer.',
      rating: 5,
    },
    {
      name: 'Marcus L.',
      role: 'Engineering Student',
      content: 'Having access to professional assessments right on campus made seeking help so much easier.',
      rating: 5,
    },
    {
      name: 'Elena R.',
      role: 'Graduate Student',
      content: 'The community events helped me connect with others who understand the academic pressure.',
      rating: 5,
    },
  ];

  const stats = [
    { label: 'Active Students', value: '2,500+', icon: Users },
    { label: 'Daily Check-ins', value: '15,000+', icon: Heart },
    { label: 'Wellness Events', value: '50+', icon: Calendar },
    { label: 'Success Rate', value: '94%', icon: TrendingUp },
  ];

  const navigateToApp = () => {
    router.push('/home_screen/home');
  };

  const navigateToLogin = () => {
    router.push('/authentication/login');
  };

  return (
    <WebLayout>
      <ScrollView style={styles.webContainer} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroContent}>
            <View style={styles.heroText}>
              <View style={styles.badgeContainer}>
                <Sparkles size={16} color={Colors.SECONDARY} />
                <Text style={styles.badgeText}>Cal State LA Mental Health Platform</Text>
              </View>
              
              <Text style={styles.heroTitle}>
                Your Mental Wellness{' '}
                <Text style={styles.heroTitleAccent}>Journey Starts Here</Text>
              </Text>
              
              <Text style={styles.heroDescription}>
                Join thousands of Golden Eagles taking charge of their mental health with 
                personalized tools, professional assessments, and a supportive campus community.
              </Text>
              
              <View style={styles.heroButtons}>
                <TouchableOpacity style={styles.primaryButton} onPress={navigateToApp}>
                  <Text style={styles.primaryButtonText}>Get Started Free</Text>
                  <ArrowRight size={20} color={Colors.WHITE} />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.secondaryButton} onPress={navigateToLogin}>
                  <Text style={styles.secondaryButtonText}>Sign In</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.trustIndicators}>
                <View style={styles.trustItem}>
                  <Shield size={16} color={Colors.SUCCESS} />
                  <Text style={styles.trustText}>HIPAA Compliant</Text>
                </View>
                <View style={styles.trustItem}>
                  <Award size={16} color={Colors.SUCCESS} />
                  <Text style={styles.trustText}>University Approved</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.heroVisual}>
              <View style={styles.heroCard}>
                <View style={styles.heroCardHeader}>
                  <Heart size={24} color={Colors.PRIMARY} />
                  <Text style={styles.heroCardTitle}>Daily Check-in</Text>
                </View>
                <Text style={styles.heroCardDescription}>
                  How are you feeling today?
                </Text>
                <View style={styles.moodOptions}>
                  {['😊', '😐', '😔'].map((emoji, index) => (
                    <TouchableOpacity key={index} style={styles.moodOption}>
                      <Text style={styles.moodEmoji}>{emoji}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <View key={index} style={styles.statCard}>
                  <IconComponent size={24} color={Colors.PRIMARY} />
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Everything You Need for Mental Wellness</Text>
            <Text style={styles.sectionDescription}>
              Comprehensive tools designed specifically for Cal State LA students
            </Text>
          </View>
          
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <View key={index} style={styles.featureCard}>
                  <View style={[styles.featureIcon, { backgroundColor: feature.bgColor }]}>
                    <IconComponent size={24} color={feature.color} />
                  </View>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Testimonials Section */}
        <View style={styles.testimonialsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>What Golden Eagles Are Saying</Text>
            <Text style={styles.sectionDescription}>
              Real stories from students who've transformed their mental wellness journey
            </Text>
          </View>
          
          <View style={styles.testimonialsGrid}>
            {testimonials.map((testimonial, index) => (
              <View key={index} style={styles.testimonialCard}>
                <View style={styles.testimonialRating}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} color={Colors.SECONDARY} fill={Colors.SECONDARY} />
                  ))}
                </View>
                <Text style={styles.testimonialContent}>"{testimonial.content}"</Text>
                <View style={styles.testimonialAuthor}>
                  <Text style={styles.testimonialName}>{testimonial.name}</Text>
                  <Text style={styles.testimonialRole}>{testimonial.role}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <View style={styles.ctaContent}>
            <Zap size={32} color={Colors.SECONDARY} />
            <Text style={styles.ctaTitle}>Ready to Start Your Wellness Journey?</Text>
            <Text style={styles.ctaDescription}>
              Join thousands of Cal State LA students who are already taking control of their mental health.
            </Text>
            <View style={styles.ctaButtons}>
              <TouchableOpacity style={styles.ctaPrimaryButton} onPress={navigateToApp}>
                <Text style={styles.ctaPrimaryButtonText}>Get Started Now</Text>
                <ArrowRight size={20} color={Colors.WHITE} />
              </TouchableOpacity>
            </View>
            <Text style={styles.ctaNote}>Free for all Cal State LA students</Text>
          </View>
        </View>
      </ScrollView>
    </WebLayout>
  );
}

function MobileSplashScreen() {
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
  // Web Landing Page Styles
  webContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  
  // Hero Section
  heroSection: {
    paddingHorizontal: 32,
    paddingVertical: 80,
    backgroundColor: '#ffffff',
  },
  heroContent: {
    maxWidth: 1200,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 60,
  },
  heroText: {
    flex: 1,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 24,
    gap: 8,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: '800',
    color: '#1e293b',
    lineHeight: 56,
    marginBottom: 24,
  },
  heroTitleAccent: {
    color: Colors.PRIMARY,
  },
  heroDescription: {
    fontSize: 20,
    color: '#64748b',
    lineHeight: 30,
    marginBottom: 32,
  },
  heroButtons: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  primaryButton: {
    backgroundColor: Colors.PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryButtonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
  },
  secondaryButtonText: {
    color: '#475569',
    fontSize: 16,
    fontWeight: '600',
  },
  trustIndicators: {
    flexDirection: 'row',
    gap: 24,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trustText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  
  // Hero Visual
  heroVisual: {
    flex: 1,
    alignItems: 'center',
  },
  heroCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    width: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 40,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  heroCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  heroCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  heroCardDescription: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 20,
  },
  moodOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  moodOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  moodEmoji: {
    fontSize: 24,
  },
  
  // Stats Section
  statsSection: {
    paddingHorizontal: 32,
    paddingVertical: 60,
    backgroundColor: '#f8fafc',
  },
  statsGrid: {
    maxWidth: 1200,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 40,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1e293b',
  },
  statLabel: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  
  // Features Section
  featuresSection: {
    paddingHorizontal: 32,
    paddingVertical: 80,
    backgroundColor: '#ffffff',
  },
  sectionHeader: {
    maxWidth: 800,
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: 60,
  },
  sectionTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 16,
  },
  sectionDescription: {
    fontSize: 18,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 28,
  },
  featuresGrid: {
    maxWidth: 1200,
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 32,
  },
  featureCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 32,
    width: '48%',
    minWidth: 280,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 2,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  featureDescription: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 24,
  },
  
  // Testimonials Section
  testimonialsSection: {
    paddingHorizontal: 32,
    paddingVertical: 80,
    backgroundColor: '#f8fafc',
  },
  testimonialsGrid: {
    maxWidth: 1200,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 32,
  },
  testimonialCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 2,
  },
  testimonialRating: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 16,
  },
  testimonialContent: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  testimonialAuthor: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 16,
  },
  testimonialName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  testimonialRole: {
    fontSize: 14,
    color: '#64748b',
  },
  
  // CTA Section
  ctaSection: {
    paddingHorizontal: 32,
    paddingVertical: 80,
    backgroundColor: '#1e293b',
  },
  ctaContent: {
    maxWidth: 800,
    alignSelf: 'center',
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  ctaDescription: {
    fontSize: 18,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 32,
  },
  ctaButtons: {
    marginBottom: 16,
  },
  ctaPrimaryButton: {
    backgroundColor: Colors.SECONDARY,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  ctaPrimaryButtonText: {
    color: '#1e293b',
    fontSize: 16,
    fontWeight: '600',
  },
  ctaNote: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  
  // Mobile Splash Screen Styles (existing)
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