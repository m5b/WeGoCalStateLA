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
} from 'lucide-react-native';
import Colors from '../../constant/Colors';
import WebLayout from '../../components/WebLayout';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

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
      description: 'Take scientifically-backed assessments to understand your mental health',
      icon: Brain,
      color: Colors.PRIMARY,
      action: () => navigateToScreen('quizzes'),
    },
    {
      title: 'Daily Wellness Tracking',
      description: 'Monitor your mood, sleep, and stress levels with visual insights',
      icon: Heart,
      color: Colors.ERROR,
      action: () => navigateToScreen('daily'),
    },
    {
      title: 'Campus Resources',
      description: 'Access mental health resources and support services at Cal State LA',
      icon: BookOpen,
      color: Colors.SUCCESS,
      action: () => navigateToScreen('resources'),
    },
  ];

  const quickStats = [
    { label: 'Active Users', value: '2,847', icon: Users, color: Colors.PRIMARY },
    { label: 'Assessments Taken', value: '15,293', icon: Brain, color: Colors.SECONDARY },
    { label: 'Resources Available', value: '127', icon: BookOpen, color: Colors.SUCCESS },
    { label: 'Success Stories', value: '1,456', icon: Award, color: Colors.INFO },
  ];

  const recentActivities = [
    {
      title: 'New Mental Health Workshop',
      description: 'Join us for a mindfulness and stress management workshop',
      time: '2 hours ago',
      type: 'event',
    },
    {
      title: 'Weekly Wellness Report Available',
      description: 'Your personalized wellness insights are ready to view',
      time: '1 day ago',
      type: 'report',
    },
    {
      title: 'New Resource Added',
      description: 'Crisis support hotlines and emergency contacts updated',
      time: '3 days ago',
      type: 'resource',
    },
  ];

  return (
    <WebLayout>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <LinearGradient
          colors={[Colors.PRIMARY, '#1e40af', Colors.SECONDARY]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroSection}
        >
          <View style={styles.heroContent}>
            <View style={styles.heroText}>
              <Text style={styles.heroTitle}>
                Transform Your Wellness Journey
              </Text>
              <Text style={styles.heroSubtitle}>
                Discover personalized mental health resources, track your progress, and connect with support at Cal State LA
              </Text>
              <View style={styles.heroButtons}>
                <TouchableOpacity
                  style={styles.ctaButton}
                  onPress={() => navigateToScreen('daily')}
                >
                  <Text style={styles.ctaButtonText}>Start Today</Text>
                  <ArrowRight size={18} color={Colors.WHITE} />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.heroStats}>
              {quickStats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <View key={index} style={styles.statCard}>
                    <View style={[styles.statIcon, { backgroundColor: stat.color + '15' }]}>
                      <IconComponent size={24} color={stat.color} />
                    </View>
                    <Text style={styles.statValue}>{stat.value}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </LinearGradient>

        {/* Main Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Core Features</Text>
          <View style={styles.featuresGrid}>
            {heroFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.featureCard}
                  onPress={feature.action}
                >
                  <View style={[styles.featureIcon, { backgroundColor: feature.color + '15' }]}>
                    <IconComponent size={32} color={feature.color} />
                  </View>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                  <View style={styles.featureAction}>
                    <Text style={styles.featureActionText}>Learn More</Text>
                    <ArrowRight size={16} color={Colors.PRIMARY} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => navigateToScreen('daily')}
            >
              <Heart size={24} color={Colors.ERROR} />
              <Text style={styles.quickActionTitle}>Daily Check-in</Text>
              <Text style={styles.quickActionSubtitle}>Track your mood today</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => navigateToScreen('progress')}
            >
              <TrendingUp size={24} color={Colors.SUCCESS} />
              <Text style={styles.quickActionTitle}>View Progress</Text>
              <Text style={styles.quickActionSubtitle}>See your wellness trends</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => navigateToScreen('events')}
            >
              <Calendar size={24} color={Colors.INFO} />
              <Text style={styles.quickActionTitle}>Upcoming Events</Text>
              <Text style={styles.quickActionSubtitle}>Join wellness activities</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => navigateToScreen('chat')}
            >
              <Users size={24} color={Colors.SECONDARY} />
              <Text style={styles.quickActionTitle}>Chat Support</Text>
              <Text style={styles.quickActionSubtitle}>Get instant help</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Updates</Text>
          <View style={styles.activitiesContainer}>
            {recentActivities.map((activity, index) => (
              <View key={index} style={styles.activityCard}>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityDescription}>{activity.description}</Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
                <ArrowRight size={16} color={Colors.GRAY} />
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2024 WeGoToCalStateLA - Mental Health & Wellness Platform
          </Text>
          <Text style={styles.footerSubtext}>
            Supporting the mental health and wellbeing of Cal State LA students
          </Text>
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
    minHeight: 600,
    paddingVertical: 80,
    paddingHorizontal: 48,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    gap: 60,
  },
  heroText: {
    flex: 1,
    alignItems: 'flex-start',
  },
  heroButtons: {
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 32,
    paddingVertical: 18,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  heroTitle: {
    fontSize: 56,
    fontWeight: '800',
    color: 'white',
    textAlign: 'left',
    marginBottom: 24,
    lineHeight: 64,
    letterSpacing: -1,
  },
  heroSubtitle: {
    fontSize: 22,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'left',
    lineHeight: 32,
    marginBottom: 40,
    fontWeight: '400',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 32,
    paddingVertical: 18,
    borderRadius: 16,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  ctaButtonText: {
    color: Colors.PRIMARY,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  heroStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 24,
    padding: 32,
    marginTop: 20,
    backdropFilter: 'blur(10px)',
  },
  statCard: {
    alignItems: 'center',
    minWidth: 140,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '500',
  },
  section: {
    paddingVertical: 40,
    paddingHorizontal: 40,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    marginBottom: 32,
    textAlign: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 24,
  },
  featureCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: 24,
    padding: 40,
    width: '30%',
    minWidth: 320,
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    transform: [{ translateY: 0 }],
  },
  featureIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featureTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.PRIMARY,
    marginBottom: 16,
    letterSpacing: -0.3,
    lineHeight: 28,
  },
  featureDescription: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 26,
    marginBottom: 24,
    fontWeight: '400',
    letterSpacing: -0.1,
  },
  featureAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureActionText: {
    fontSize: 16,
    color: Colors.PRIMARY,
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 24,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  quickActionCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: 20,
    padding: 32,
    width: '23%',
    minWidth: 240,
    alignItems: 'center',
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    transform: [{ scale: 1 }],
  },
  quickActionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.PRIMARY,
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  quickActionSubtitle: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '400',
  },
  activitiesContainer: {
    gap: 16,
  },
  activityCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 14,
    color: Colors.DARK_GRAY,
    marginBottom: 8,
    lineHeight: 20,
  },
  activityTime: {
    fontSize: 12,
    color: Colors.GRAY,
  },
  footer: {
    backgroundColor: '#0f172a',
    paddingVertical: 60,
    paddingHorizontal: 40,
    marginTop: 40,
  },
  footerContent: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 40,
  },
  footerSection: {
    flex: 1,
    minWidth: 250,
  },
  footerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  footerText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 24,
    marginBottom: 16,
    fontWeight: '400',
  },
  footerLink: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 12,
    fontWeight: '500',
  },
  footerBottom: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 24,
    marginTop: 40,
    alignItems: 'center',
  },
  footerBottomText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
  footerSubtext: {
    fontSize: 14,
    color: Colors.GRAY,
    textAlign: 'center',
  },
});