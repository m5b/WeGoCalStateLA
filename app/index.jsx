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
  MessageCircle, BookOpen, Zap, Phone, Mail, MapPin,
  ChevronRight, Play, Quote, Menu, X
} from 'lucide-react-native';
import Colors from '../constant/Colors';
import WebLayout from '../components/WebLayout';

const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

SplashScreen.preventAutoHideAsync();

export default function LandingPage() {
  if (isWeb) {
    return <WebLandingPage />;
  }
  return <MobileSplashScreen />;
}

function WebLandingPage() {
  const features = [
    {
      icon: Heart,
      title: 'Daily Wellness Check-ins',
      description: 'Track your mental health with personalized daily assessments and mood monitoring.',
      color: '#ef4444',
    },
    {
      icon: Brain,
      title: 'Professional Assessments',
      description: 'Access validated mental health screening tools like PHQ-9 and GAD-7.',
      color: Colors.PRIMARY,
    },
    {
      icon: Users,
      title: 'Campus Community',
      description: 'Connect with fellow Golden Eagles and participate in wellness events.',
      color: '#06b6d4',
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Your mental health data is protected with enterprise-grade security.',
      color: '#10b981',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'Psychology Major',
      content: 'This platform helped me stay on top of my mental health during finals week. The daily check-ins are a game changer.',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    },
    {
      name: 'Marcus L.',
      role: 'Engineering Student',
      content: 'Having access to professional assessments right on campus made seeking help so much easier.',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    },
    {
      name: 'Elena R.',
      role: 'Graduate Student',
      content: 'The community events helped me connect with others who understand the academic pressure.',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
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
                Your Mental Wellness{'\n'}
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
                <View style={styles.trustItem}>
                  <CheckCircle size={16} color={Colors.SUCCESS} />
                  <Text style={styles.trustText}>Free for Students</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.heroVisual}>
              <View style={styles.heroImageContainer}>
                <Image
                  source={{ uri: 'https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop' }}
                  style={styles.heroImage}
                />
                <View style={styles.heroOverlay}>
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
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statsContainer}>
            <View style={styles.statsGrid}>
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <View key={index} style={styles.statCard}>
                    <IconComponent size={32} color={Colors.PRIMARY} />
                    <Text style={styles.statValue}>{stat.value}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <View style={styles.featuresContainer}>
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
                    <View style={[styles.featureIcon, { backgroundColor: feature.color + '15' }]}>
                      <IconComponent size={32} color={feature.color} />
                    </View>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={styles.featureDescription}>{feature.description}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Testimonials Section */}
        <View style={styles.testimonialsSection}>
          <View style={styles.testimonialsContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>What Golden Eagles Are Saying</Text>
              <Text style={styles.sectionDescription}>
                Real stories from students who've transformed their mental wellness journey
              </Text>
            </View>
            
            <View style={styles.testimonialsGrid}>
              {testimonials.map((testimonial, index) => (
                <View key={index} style={styles.testimonialCard}>
                  <View style={styles.testimonialQuote}>
                    <Quote size={24} color={Colors.PRIMARY + '40'} />
                  </View>
                  <View style={styles.testimonialRating}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={16} color={Colors.SECONDARY} fill={Colors.SECONDARY} />
                    ))}
                  </View>
                  <Text style={styles.testimonialContent}>"{testimonial.content}"</Text>
                  <View style={styles.testimonialAuthor}>
                    <Image source={{ uri: testimonial.avatar }} style={styles.testimonialAvatar} />
                    <View style={styles.testimonialInfo}>
                      <Text style={styles.testimonialName}>{testimonial.name}</Text>
                      <Text style={styles.testimonialRole}>{testimonial.role}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <View style={styles.ctaContainer}>
            <View style={styles.ctaContent}>
              <Zap size={48} color={Colors.SECONDARY} />
              <Text style={styles.ctaTitle}>Ready to Start Your Wellness Journey?</Text>
              <Text style={styles.ctaDescription}>
                Join thousands of Cal State LA students who are already taking control of their mental health.
              </Text>
              <View style={styles.ctaButtons}>
                <TouchableOpacity style={styles.ctaPrimaryButton} onPress={navigateToApp}>
                  <Text style={styles.ctaPrimaryButtonText}>Get Started Now</Text>
                  <ArrowRight size={20} color={Colors.WHITE} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.ctaSecondaryButton} onPress={navigateToLogin}>
                  <Text style={styles.ctaSecondaryButtonText}>Sign In</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.ctaNote}>Free for all Cal State LA students • No credit card required</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerContainer}>
            <View style={styles.footerContent}>
              <View style={styles.footerBrand}>
                <View style={styles.footerLogo}>
                  <Sparkles size={24} color={Colors.PRIMARY} />
                </View>
                <Text style={styles.footerBrandText}>WeGo</Text>
                <Text style={styles.footerBrandSubtext}>
                  Mental Health & Wellness Platform for Cal State LA
                </Text>
              </View>
              
              <View style={styles.footerLinks}>
                <View style={styles.footerColumn}>
                  <Text style={styles.footerColumnTitle}>Platform</Text>
                  <TouchableOpacity style={styles.footerLink}>
                    <Text style={styles.footerLinkText}>Features</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.footerLink}>
                    <Text style={styles.footerLinkText}>Assessments</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.footerLink}>
                    <Text style={styles.footerLinkText}>Resources</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.footerLink}>
                    <Text style={styles.footerLinkText}>Community</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.footerColumn}>
                  <Text style={styles.footerColumnTitle}>Support</Text>
                  <TouchableOpacity style={styles.footerLink}>
                    <Text style={styles.footerLinkText}>Help Center</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.footerLink}>
                    <Text style={styles.footerLinkText}>Crisis Resources</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.footerLink}>
                    <Text style={styles.footerLinkText}>Contact Us</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.footerLink}>
                    <Text style={styles.footerLinkText}>Privacy Policy</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.footerColumn}>
                  <Text style={styles.footerColumnTitle}>Contact</Text>
                  <View style={styles.contactItem}>
                    <Phone size={16} color="#64748b" />
                    <Text style={styles.contactText}>(323) 343-3300</Text>
                  </View>
                  <View style={styles.contactItem}>
                    <Mail size={16} color="#64748b" />
                    <Text style={styles.contactText}>wellness@calstatela.edu</Text>
                  </View>
                  <View style={styles.contactItem}>
                    <MapPin size={16} color="#64748b" />
                    <Text style={styles.contactText}>5151 State University Dr, LA</Text>
                  </View>
                </View>
              </View>
            </View>
            
            <View style={styles.footerBottom}>
              <Text style={styles.footerCopyright}>
                © 2024 California State University, Los Angeles. All rights reserved.
              </Text>
              <View style={styles.footerBottomLinks}>
                <TouchableOpacity>
                  <Text style={styles.footerBottomLink}>Terms of Service</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={styles.footerBottomLink}>Privacy Policy</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={styles.footerBottomLink}>Accessibility</Text>
                </TouchableOpacity>
              </View>
            </View>
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
    backgroundColor: '#f8fafc',
  },
  
  // Hero Section
  heroSection: {
    paddingVertical: width < 640 ? 60 : width < 1024 ? 80 : 120,
    paddingHorizontal: width < 640 ? 16 : width < 1024 ? 32 : 60,
    backgroundColor: 'white',
    marginHorizontal: width < 640 ? 16 : width < 1024 ? 24 : 32,
    marginBottom: width < 640 ? 16 : width < 1024 ? 20 : 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  heroContent: {
    flexDirection: width < 1024 ? 'column' : 'row',
    alignItems: 'center',
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    gap: width < 640 ? 40 : width < 1024 ? 60 : 80,
  },
  heroText: {
    flex: 1,
    alignItems: width < 1024 ? 'center' : 'flex-start',
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 32,
    gap: 8,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
  },
  heroTitle: {
    fontSize: width < 640 ? 36 : width < 1024 ? 48 : 64,
    fontWeight: '900',
    color: '#1e293b',
    lineHeight: width < 640 ? 44 : width < 1024 ? 56 : 72,
    marginBottom: 32,
    letterSpacing: -2,
    textAlign: width < 1024 ? 'center' : 'left',
  },
  heroTitleAccent: {
    color: Colors.PRIMARY,
  },
  heroDescription: {
    fontSize: width < 640 ? 18 : 22,
    color: '#64748b',
    textAlign: width < 1024 ? 'center' : 'left',
    lineHeight: width < 640 ? 28 : 34,
    marginBottom: 48,
    fontWeight: '400',
  },
  heroButtons: {
    flexDirection: width < 640 ? 'column' : 'row',
    gap: 20,
    marginBottom: 48,
    width: width < 640 ? '100%' : 'auto',
  },
  primaryButton: {
    backgroundColor: Colors.PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 18,
    borderRadius: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: Colors.WHITE,
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    paddingHorizontal: 32,
    paddingVertical: 18,
    borderRadius: 12,
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#475569',
    fontSize: 18,
    fontWeight: '600',
  },
  trustIndicators: {
    flexDirection: width < 640 ? 'column' : 'row',
    gap: width < 640 ? 16 : 32,
    alignItems: 'center',
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
    justifyContent: 'center',
    display: width < 768 ? 'none' : 'flex',
  },
  heroImageContainer: {
    position: 'relative',
    width: width < 1024 ? 400 : 500,
    height: width < 1024 ? 320 : 400,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 40,
    elevation: 20,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
  },
  heroCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 24,
    backdropFilter: 'blur(10px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  heroCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  heroCardTitle: {
    fontSize: 18,
    fontWeight: '700',
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
    paddingVertical: width < 640 ? 60 : 80,
    backgroundColor: 'white',
    marginHorizontal: width < 640 ? 16 : width < 1024 ? 24 : 32,
    marginBottom: width < 640 ? 16 : width < 1024 ? 20 : 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statsContainer: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: width < 640 ? 16 : 32,
  },
  statsGrid: {
    flexDirection: width < 640 ? 'column' : 'row',
    gap: width < 640 ? 32 : 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statCard: {
    alignItems: 'center',
    gap: 12,
    flex: width < 640 ? 0 : 1,
  },
  statValue: {
    fontSize: width < 640 ? 36 : 48,
    fontWeight: '900',
    color: '#1e293b',
    letterSpacing: -1,
  },
  statLabel: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
    textAlign: 'center',
  },
  
  // Features Section
  featuresSection: {
    paddingVertical: width < 640 ? 80 : 120,
    backgroundColor: 'white',
    marginHorizontal: width < 640 ? 16 : width < 1024 ? 24 : 32,
    marginBottom: width < 640 ? 16 : width < 1024 ? 20 : 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  featuresContainer: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: width < 640 ? 16 : 32,
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: 80,
  },
  sectionTitle: {
    fontSize: width < 640 ? 32 : 48,
    fontWeight: '900',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: -1,
  },
  sectionDescription: {
    fontSize: 20,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 32,
    maxWidth: 600,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 40,
    justifyContent: 'center',
  },
  featureCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    padding: 40,
    width: width < 640 ? '100%' : width < 1024 ? '45%' : '45%',
    minWidth: width < 640 ? 0 : 320,
    maxWidth: 480,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 8,
  },
  featureIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  featureTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  featureDescription: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 26,
  },
  
  // Testimonials Section
  testimonialsSection: {
    paddingVertical: width < 640 ? 80 : 120,
    backgroundColor: 'white',
    marginHorizontal: width < 640 ? 16 : width < 1024 ? 24 : 32,
    marginBottom: width < 640 ? 16 : width < 1024 ? 20 : 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  testimonialsContainer: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: width < 640 ? 16 : 32,
  },
  testimonialsGrid: {
    flexDirection: width < 768 ? 'column' : 'row',
    gap: 40,
    justifyContent: 'center',
  },
  testimonialCard: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    padding: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 8,
    maxWidth: width < 768 ? '100%' : 380,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  testimonialQuote: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  testimonialRating: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 24,
  },
  testimonialContent: {
    fontSize: 18,
    color: '#374151',
    lineHeight: 28,
    marginBottom: 32,
    fontStyle: 'italic',
  },
  testimonialAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 24,
  },
  testimonialAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  testimonialInfo: {
    flex: 1,
  },
  testimonialName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  testimonialRole: {
    fontSize: 14,
    color: '#64748b',
  },
  
  // CTA Section
  ctaSection: {
    paddingVertical: width < 640 ? 80 : 120,
    backgroundColor: '#1e293b',
    marginHorizontal: width < 640 ? 16 : width < 1024 ? 24 : 32,
    marginBottom: width < 640 ? 16 : width < 1024 ? 20 : 24,
    borderRadius: 12,
  },
  ctaContainer: {
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: width < 640 ? 16 : 32,
  },
  ctaContent: {
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: width < 640 ? 32 : 48,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 24,
    letterSpacing: -1,
  },
  ctaDescription: {
    fontSize: 20,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 48,
  },
  ctaButtons: {
    flexDirection: width < 640 ? 'column' : 'row',
    gap: 20,
    marginBottom: 24,
    width: width < 640 ? '100%' : 'auto',
  },
  ctaPrimaryButton: {
    backgroundColor: Colors.SECONDARY,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    justifyContent: 'center',
  },
  ctaPrimaryButtonText: {
    color: '#1e293b',
    fontSize: 18,
    fontWeight: '700',
  },
  ctaSecondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#475569',
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 12,
    justifyContent: 'center',
  },
  ctaSecondaryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  ctaNote: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  
  // Footer
  footer: {
    backgroundColor: '#0f172a',
    paddingVertical: width < 640 ? 60 : 80,
    marginHorizontal: width < 640 ? 16 : width < 1024 ? 24 : 32,
    borderRadius: 12,
  },
  footerContainer: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: width < 640 ? 16 : 32,
  },
  footerContent: {
    flexDirection: width < 768 ? 'column' : 'row',
    gap: width < 768 ? 40 : 80,
    marginBottom: 60,
  },
  footerBrand: {
    flex: 1,
    maxWidth: width < 768 ? '100%' : 300,
    alignItems: width < 768 ? 'center' : 'flex-start',
  },
  footerLogo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.PRIMARY + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  footerBrandText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  footerBrandSubtext: {
    fontSize: 16,
    color: '#94a3b8',
    lineHeight: 24,
    textAlign: width < 768 ? 'center' : 'left',
  },
  footerLinks: {
    flexDirection: width < 768 ? 'column' : 'row',
    gap: width < 768 ? 32 : 80,
    flex: 2,
  },
  footerColumn: {
    flex: 1,
    alignItems: width < 768 ? 'center' : 'flex-start',
  },
  footerColumnTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 20,
  },
  footerLink: {
    marginBottom: 12,
  },
  footerLinkText: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  footerBottom: {
    flexDirection: width < 768 ? 'column' : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 40,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    gap: width < 768 ? 16 : 0,
  },
  footerCopyright: {
    fontSize: 14,
    color: '#64748b',
    textAlign: width < 768 ? 'center' : 'left',
  },
  footerBottomLinks: {
    flexDirection: 'row',
    gap: 32,
  },
  footerBottomLink: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  
  // Mobile Splash Screen Styles
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