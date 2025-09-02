import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Calendar,
  Brain,
  BookOpen,
  Heart,
  TrendingUp,
  Clock,
  Users,
  Award,
  ArrowRight,
  Star,
  CheckCircle,
  Shield,
  Zap,
  Target,
  Activity,
} from 'lucide-react-native';
import Colors from '../../constant/Colors';
import WebLayout from '../../components/WebLayout';

const { width } = Dimensions.get('window');

export default function WebHomeScreen() {
  const navigateToScreen = (screen) => {
    switch (screen) {
      case 'events':
        router.push('/home_screen/events');
        break;
      case 'quizzes':
        router.push('/quizzes/quiz_list');
        break;
      case 'resources':
        router.push('/resources/resource');
        break;
      case 'daily':
        router.push('/daily_check_in/daily');
        break;
      case 'progress':
        router.push('/daily_check_in/progress');
        break;
      case 'chat':
        router.push('/chat_bot/chatbotui');
        break;
      default:
        break;
    }
  };

  const heroFeatures = [
    {
      title: 'Mental Health Assessments',
      description: 'Take scientifically-backed assessments including GAD-7 and PHQ-9 to understand your mental health status with professional-grade screening tools.',
      icon: Brain,
      color: Colors.PRIMARY,
      action: () => navigateToScreen('quizzes'),
      stats: '5,000+ completed',
    },
    {
      title: 'Daily Wellness Tracking',
      description: 'Monitor your mood, sleep quality, and stress levels with intuitive daily check-ins and comprehensive visual analytics.',
      icon: Heart,
      color: Colors.ERROR,
      action: () => navigateToScreen('daily'),
      stats: '89% user retention',
    },
    {
      title: 'Campus Resources Hub',
      description: 'Access comprehensive mental health resources, counseling services, and support programs specifically for Cal State LA students.',
      icon: BookOpen,
      color: Colors.SUCCESS,
      action: () => navigateToScreen('resources'),
      stats: '127 resources available',
    },
  ];

  const quickStats = [
    { label: 'Active Students', value: '2,847', icon: Users, color: Colors.PRIMARY, change: '+12%' },
    { label: 'Assessments Completed', value: '15,293', icon: Brain, color: Colors.SECONDARY, change: '+8%' },
    { label: 'Daily Check-ins', value: '8,456', icon: Heart, color: Colors.ERROR, change: '+15%' },
    { label: 'Resources Accessed', value: '23,891', icon: BookOpen, color: Colors.SUCCESS, change: '+22%' },
  ];

  const testimonials = [
    {
      text: "This platform helped me understand my anxiety patterns and connect with the right resources on campus.",
      author: "Sarah M.",
      role: "Psychology Major, Junior",
      rating: 5,
    },
    {
      text: "The daily check-ins became part of my routine and really helped me track my mental health journey.",
      author: "Marcus T.",
      role: "Engineering Student, Senior",
      rating: 5,
    },
    {
      text: "Having access to professional assessments and campus resources in one place is incredibly valuable.",
      author: "Elena R.",
      role: "Business Major, Sophomore",
      rating: 5,
    },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Confidential & Secure',
      description: 'Your mental health data is encrypted and protected with enterprise-grade security.',
    },
    {
      icon: CheckCircle,
      title: 'Clinically Validated',
      description: 'All assessments are based on established psychological screening tools used by professionals.',
    },
    {
      icon: Zap,
      title: 'Real-time Insights',
      description: 'Get immediate feedback and personalized recommendations based on your responses.',
    },
    {
      icon: Target,
      title: 'Goal Tracking',
      description: 'Set wellness goals and track your progress with detailed analytics and trends.',
    },
  ];

  return (
    <WebLayout>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <LinearGradient
          colors={['#003DA5', '#1e40af', '#FFB81C']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroSection}
        >
          <View style={styles.heroContent}>
            <View style={styles.heroText}>
              <Text style={styles.heroTitle}>
                Transform Your Mental Wellness Journey
              </Text>
              <Text style={styles.heroSubtitle}>
                Comprehensive mental health platform designed specifically for Cal State LA Golden Eagles. 
                Access professional assessments, track your progress, and connect with campus resources.
              </Text>
              <View style={styles.heroButtons}>
                <TouchableOpacity
                  style={styles.ctaButton}
                  onPress={() => navigateToScreen('daily')}
                >
                  <Text style={styles.ctaButtonText}>Start Your Journey</Text>
                  <ArrowRight size={20} color={Colors.PRIMARY} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => navigateToScreen('quizzes')}
                >
                  <Text style={styles.secondaryButtonText}>Take Assessment</Text>
                  <Brain size={18} color="white" />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.heroStatsContainer}>
              <View style={styles.heroStats}>
                {quickStats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <View key={index} style={styles.statCard}>
                      <View style={[styles.statIcon, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
                        <IconComponent size={28} color="white" />
                      </View>
                      <Text style={styles.statValue}>{stat.value}</Text>
                      <Text style={styles.statLabel}>{stat.label}</Text>
                      <Text style={styles.statChange}>{stat.change} this month</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Features Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Comprehensive Mental Health Support</Text>
            <Text style={styles.sectionSubtitle}>
              Evidence-based tools and resources designed to support your mental wellness throughout your academic journey
            </Text>
          </View>
          
          <View style={styles.featuresGrid}>
            {heroFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.featureCard}
                  onPress={feature.action}
                >
                  <View style={styles.featureHeader}>
                    <View style={[styles.featureIcon, { backgroundColor: feature.color + '15' }]}>
                      <IconComponent size={36} color={feature.color} />
                    </View>
                    <View style={styles.featureStats}>
                      <Text style={styles.featureStatsText}>{feature.stats}</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                  
                  <View style={styles.featureAction}>
                    <Text style={styles.featureActionText}>Get Started</Text>
                    <ArrowRight size={18} color={feature.color} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Benefits Section */}
        <View style={styles.benefitsSection}>
          <View style={styles.benefitsContent}>
            <Text style={styles.benefitsTitle}>Why Choose WeGoToCalStateLA?</Text>
            <View style={styles.benefitsGrid}>
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <View key={index} style={styles.benefitCard}>
                    <View style={[styles.benefitIcon, { backgroundColor: Colors.PRIMARY + '15' }]}>
                      <IconComponent size={24} color={Colors.PRIMARY} />
                    </View>
                    <Text style={styles.benefitTitle}>{feature.title}</Text>
                    <Text style={styles.benefitDescription}>{feature.description}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Testimonials Section */}
        <View style={styles.testimonialsSection}>
          <Text style={styles.testimonialsTitle}>What Golden Eagles Are Saying</Text>
          <View style={styles.testimonialsGrid}>
            {testimonials.map((testimonial, index) => (
              <View key={index} style={styles.testimonialCard}>
                <View style={styles.testimonialRating}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} color={Colors.SECONDARY} fill={Colors.SECONDARY} />
                  ))}
                </View>
                <Text style={styles.testimonialText}>"{testimonial.text}"</Text>
                <View style={styles.testimonialAuthor}>
                  <Text style={styles.authorName}>{testimonial.author}</Text>
                  <Text style={styles.authorRole}>{testimonial.role}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* CTA Section */}
        <LinearGradient
          colors={[Colors.PRIMARY, Colors.DARK_BLUE]}
          style={styles.ctaSection}
        >
          <View style={styles.ctaContent}>
            <Text style={styles.ctaTitle}>Ready to Start Your Wellness Journey?</Text>
            <Text style={styles.ctaSubtitle}>
              Join thousands of Cal State LA students who are taking control of their mental health
            </Text>
            <View style={styles.ctaButtons}>
              <TouchableOpacity
                style={styles.ctaPrimaryButton}
                onPress={() => navigateToScreen('daily')}
              >
                <Text style={styles.ctaPrimaryText}>Begin Daily Check-in</Text>
                <Heart size={20} color={Colors.PRIMARY} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.ctaSecondaryButton}
                onPress={() => navigateToScreen('quizzes')}
              >
                <Text style={styles.ctaSecondaryText}>Take Assessment</Text>
                <Brain size={18} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <View style={styles.footerSection}>
              <Text style={styles.footerTitle}>WeGoToCalStateLA</Text>
              <Text style={styles.footerText}>
                Supporting the mental health and wellbeing of Cal State LA students through 
                evidence-based tools and comprehensive campus resources.
              </Text>
              <View style={styles.footerStats}>
                <Text style={styles.footerStat}>2,847+ Active Users</Text>
                <Text style={styles.footerStat}>15,293+ Assessments</Text>
                <Text style={styles.footerStat}>127 Resources</Text>
              </View>
            </View>
            
            <View style={styles.footerSection}>
              <Text style={styles.footerSectionTitle}>Quick Links</Text>
              <TouchableOpacity onPress={() => navigateToScreen('quizzes')}>
                <Text style={styles.footerLink}>Mental Health Assessments</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigateToScreen('daily')}>
                <Text style={styles.footerLink}>Daily Check-in</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigateToScreen('resources')}>
                <Text style={styles.footerLink}>Campus Resources</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigateToScreen('chat')}>
                <Text style={styles.footerLink}>Chat Support</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.footerSection}>
              <Text style={styles.footerSectionTitle}>Support</Text>
              <Text style={styles.footerLink}>Crisis Hotline: 988</Text>
              <Text style={styles.footerLink}>Campus Counseling: (323) 343-3371</Text>
              <Text style={styles.footerLink}>Emergency: 911</Text>
              <Text style={styles.footerLink}>help@calstatela.edu</Text>
            </View>
          </View>
          
          <View style={styles.footerBottom}>
            <Text style={styles.footerBottomText}>
              © 2024 California State University, Los Angeles. All rights reserved.
            </Text>
            <Text style={styles.footerBottomText}>
              Mental Health & Wellness Platform for Golden Eagles
            </Text>
          </View>
        </View>
      </ScrollView>
    </WebLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafbfc',
  },
  heroSection: {
    minHeight: 700,
    paddingVertical: 100,
    paddingHorizontal: 60,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 1400,
    alignSelf: 'center',
    width: '100%',
    gap: 80,
  },
  heroText: {
    flex: 1,
    alignItems: 'flex-start',
  },
  heroTitle: {
    fontSize: 64,
    fontWeight: '900',
    color: 'white',
    textAlign: 'left',
    marginBottom: 32,
    lineHeight: 72,
    letterSpacing: -1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    fontSize: 24,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'left',
    lineHeight: 36,
    marginBottom: 48,
    fontWeight: '400',
    maxWidth: 600,
  },
  heroButtons: {
    flexDirection: 'row',
    gap: 24,
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 20,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
  ctaButtonText: {
    color: Colors.PRIMARY,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    gap: 12,
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  heroStatsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  heroStats: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 32,
    padding: 40,
    backdropFilter: 'blur(20px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statCard: {
    alignItems: 'center',
    marginBottom: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  statIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  statValue: {
    fontSize: 36,
    fontWeight: '900',
    color: 'white',
    marginBottom: 8,
    letterSpacing: -1,
  },
  statLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 4,
  },
  statChange: {
    fontSize: 14,
    color: Colors.SECONDARY,
    fontWeight: '600',
  },
  section: {
    paddingVertical: 100,
    paddingHorizontal: 60,
    maxWidth: 1400,
    alignSelf: 'center',
    width: '100%',
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: 80,
  },
  sectionTitle: {
    fontSize: 48,
    fontWeight: '800',
    color: Colors.PRIMARY,
    marginBottom: 24,
    textAlign: 'center',
    letterSpacing: -1,
    lineHeight: 56,
  },
  sectionSubtitle: {
    fontSize: 20,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 32,
    maxWidth: 800,
    fontWeight: '400',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 40,
  },
  featureCard: {
    backgroundColor: 'white',
    borderRadius: 32,
    padding: 48,
    width: '30%',
    minWidth: 380,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.08,
    shadowRadius: 32,
    elevation: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    transform: [{ translateY: 0 }],
  },
  featureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  featureIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  featureStats: {
    backgroundColor: Colors.SECONDARY + '15',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  featureStatsText: {
    fontSize: 14,
    color: Colors.SECONDARY,
    fontWeight: '600',
  },
  featureTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.PRIMARY,
    marginBottom: 20,
    letterSpacing: -0.5,
    lineHeight: 36,
  },
  featureDescription: {
    fontSize: 18,
    color: '#64748b',
    lineHeight: 28,
    marginBottom: 32,
    fontWeight: '400',
    letterSpacing: -0.1,
  },
  featureAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.PRIMARY + '10',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  featureActionText: {
    fontSize: 18,
    color: Colors.PRIMARY,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  benefitsSection: {
    backgroundColor: '#f8fafc',
    paddingVertical: 100,
    paddingHorizontal: 60,
  },
  benefitsContent: {
    maxWidth: 1400,
    alignSelf: 'center',
    width: '100%',
  },
  benefitsTitle: {
    fontSize: 48,
    fontWeight: '800',
    color: Colors.PRIMARY,
    textAlign: 'center',
    marginBottom: 80,
    letterSpacing: -1,
  },
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 32,
  },
  benefitCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 40,
    width: '48%',
    minWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  benefitIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  benefitTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.PRIMARY,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  benefitDescription: {
    fontSize: 17,
    color: '#64748b',
    lineHeight: 26,
    fontWeight: '400',
  },
  testimonialsSection: {
    paddingVertical: 100,
    paddingHorizontal: 60,
    backgroundColor: 'white',
  },
  testimonialsTitle: {
    fontSize: 48,
    fontWeight: '800',
    color: Colors.PRIMARY,
    textAlign: 'center',
    marginBottom: 80,
    letterSpacing: -1,
  },
  testimonialsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 32,
    maxWidth: 1400,
    alignSelf: 'center',
  },
  testimonialCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 24,
    padding: 40,
    width: '30%',
    minWidth: 320,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
  },
  testimonialRating: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 20,
  },
  testimonialText: {
    fontSize: 18,
    color: '#334155',
    lineHeight: 28,
    marginBottom: 24,
    fontStyle: 'italic',
    fontWeight: '400',
  },
  testimonialAuthor: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 20,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.PRIMARY,
    marginBottom: 4,
  },
  authorRole: {
    fontSize: 14,
    color: '#64748b',
  },
  ctaSection: {
    paddingVertical: 100,
    paddingHorizontal: 60,
  },
  ctaContent: {
    maxWidth: 900,
    alignSelf: 'center',
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 48,
    fontWeight: '800',
    color: 'white',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: -1,
    lineHeight: 56,
  },
  ctaSubtitle: {
    fontSize: 22,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 48,
    fontWeight: '400',
  },
  ctaButtons: {
    flexDirection: 'row',
    gap: 24,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  ctaPrimaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 20,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  ctaPrimaryText: {
    color: Colors.PRIMARY,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  ctaSecondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    gap: 12,
  },
  ctaSecondaryText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  footer: {
    backgroundColor: '#0f172a',
    paddingVertical: 80,
    paddingHorizontal: 60,
  },
  footerContent: {
    maxWidth: 1400,
    alignSelf: 'center',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 60,
    marginBottom: 60,
  },
  footerSection: {
    flex: 1,
    minWidth: 280,
  },
  footerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  footerSectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginBottom: 24,
    letterSpacing: -0.3,
  },
  footerText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 26,
    marginBottom: 24,
    fontWeight: '400',
  },
  footerStats: {
    gap: 8,
  },
  footerStat: {
    fontSize: 14,
    color: Colors.SECONDARY,
    fontWeight: '600',
  },
  footerLink: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
    fontWeight: '500',
    letterSpacing: -0.1,
  },
  footerBottom: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 40,
    alignItems: 'center',
    gap: 8,
  },
  footerBottomText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    fontWeight: '400',
  },
});