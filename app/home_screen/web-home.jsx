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
import { Calendar, Brain, BookOpen, Heart, TrendingUp, Clock, Users, Award, ArrowRight, Star, CheckCircle, Shield, Zap, Target, Activity, BarChart3, Plus, Bell } from 'lucide-react-native';
import Colors from '../../constant/Colors';
import WebLayout from '../../components/WebLayout';

const { width } = Dimensions.get('window');

export default function WebHomeScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  
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

  const dashboardCards = [
    {
      title: 'Daily Check-in',
      description: 'Track your mood and wellness',
      icon: Heart,
      color: '#EF4444',
      bgColor: '#FEF2F2',
      action: () => navigateToScreen('daily'),
      status: 'Complete today',
      progress: 85,
    },
    {
      title: 'Assessments',
      description: 'Mental health screenings',
      icon: Brain,
      color: '#3B82F6',
      bgColor: '#EFF6FF',
      action: () => navigateToScreen('quizzes'),
      status: '2 available',
      progress: null,
    },
    {
      title: 'Resources',
      description: 'Campus support & guides',
      icon: BookOpen,
      color: '#10B981',
      bgColor: '#F0FDF4',
      action: () => navigateToScreen('resources'),
      status: '127 resources',
      progress: null,
    },
    {
      title: 'Progress',
      description: 'View your wellness trends',
      icon: BarChart3,
      color: '#8B5CF6',
      bgColor: '#F5F3FF',
      action: () => navigateToScreen('progress'),
      status: 'Updated today',
      progress: null,
    },
  ];

  const weeklyStats = [
    { label: 'Mood Score', value: '7.2', icon: Heart, color: '#EF4444', change: '+0.8', unit: '/10' },
    { label: 'Check-ins', value: '5', icon: Calendar, color: '#3B82F6', change: '+2', unit: '/7' },
    { label: 'Streak', value: '12', icon: Target, color: '#10B981', change: '+3', unit: 'days' },
    { label: 'Progress', value: '85', icon: TrendingUp, color: '#8B5CF6', change: '+12%', unit: '%' },
  ];

  const quickActions = [
    {
      title: 'Start Check-in',
      description: 'Log your mood today',
      icon: Plus,
      color: '#EF4444',
      action: () => navigateToScreen('daily'),
    },
    {
      title: 'Take Assessment',
      description: 'PHQ-9 available',
      icon: Brain,
      color: '#3B82F6',
      action: () => navigateToScreen('quizzes'),
    },
    {
      title: 'Browse Resources',
      description: 'Find support',
      icon: BookOpen,
      color: '#10B981',
      action: () => navigateToScreen('resources'),
    },
  ];

  const recentActivities = [
    {
      title: 'Daily Check-in Completed',
      time: '2 hours ago',
      icon: CheckCircle,
      color: '#10B981',
    },
    {
      title: 'GAD-7 Assessment',
      time: 'Yesterday',
      icon: Brain,
      color: '#3B82F6',
    },
    {
      title: 'Resource Viewed: Stress Management',
      time: '2 days ago',
      icon: BookOpen,
      color: '#8B5CF6',
    },
  ];

  const wellnessTips = [
    {
      title: 'Take Deep Breaths',
      description: 'Practice 4-7-8 breathing for instant calm',
      icon: Heart,
    },
    {
      title: 'Stay Hydrated',
      description: 'Drink water regularly throughout the day',
      icon: Target,
    },
    {
      title: 'Move Your Body',
      description: 'Even 5 minutes of movement helps',
      icon: Activity,
    },
  ];

  return (
    <WebLayout>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Dashboard Header */}
        <View style={styles.dashboardHeader}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.welcomeText}>Welcome back!</Text>
              <Text style={styles.dashboardTitle}>Your Wellness Dashboard</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Bell size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>This Week</Text>
            <View style={styles.periodSelector}>
              {['week', 'month'].map((period) => (
                <TouchableOpacity
                  key={period}
                  style={[
                    styles.periodButton,
                    selectedPeriod === period && styles.periodButtonActive
                  ]}
                  onPress={() => setSelectedPeriod(period)}
                >
                  <Text style={[
                    styles.periodButtonText,
                    selectedPeriod === period && styles.periodButtonTextActive
                  ]}>
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.statsGrid}>
            {weeklyStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <View key={index} style={styles.statCard}>
                  <View style={styles.statHeader}>
                    <View style={[styles.statIcon, { backgroundColor: stat.color + '15' }]}>
                      <IconComponent size={16} color={stat.color} />
                    </View>
                    <Text style={[styles.statChange, { color: '#10B981' }]}>{stat.change}</Text>
                  </View>
                  <Text style={styles.statValue}>{stat.value}<Text style={styles.statUnit}>{stat.unit}</Text></Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Main Dashboard Cards */}
        <View style={styles.mainSection}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          
          <View style={styles.dashboardGrid}>
            {dashboardCards.map((card, index) => {
              const IconComponent = card.icon;
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.dashboardCard}
                  onPress={card.action}
                >
                  <View style={styles.cardHeader}>
                    <View style={[styles.cardIcon, { backgroundColor: card.bgColor }]}>
                      <IconComponent size={24} color={card.color} />
                    </View>
                    {card.progress && (
                      <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                          <View style={[styles.progressFill, { width: `${card.progress}%`, backgroundColor: card.color }]} />
                        </View>
                        <Text style={styles.progressText}>{card.progress}%</Text>
                      </View>
                    )}
                  </View>
                  
                  <Text style={styles.cardTitle}>{card.title}</Text>
                  <Text style={styles.cardDescription}>{card.description}</Text>
                  
                  <View style={styles.cardFooter}>
                    <Text style={[styles.cardStatus, { color: card.color }]}>{card.status}</Text>
                    <ArrowRight size={16} color="#9CA3AF" />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Two Column Layout */}
        <View style={styles.twoColumnSection}>
          {/* Quick Actions */}
          <View style={styles.leftColumn}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsContainer}>
              {quickActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.quickActionCard}
                    onPress={action.action}
                  >
                    <View style={[styles.quickActionIcon, { backgroundColor: action.color + '15' }]}>
                      <IconComponent size={20} color={action.color} />
                    </View>
                    <View style={styles.quickActionContent}>
                      <Text style={styles.quickActionTitle}>{action.title}</Text>
                      <Text style={styles.quickActionDescription}>{action.description}</Text>
                    </View>
                    <ArrowRight size={16} color="#9CA3AF" />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Recent Activities */}
          <View style={styles.rightColumn}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <View style={styles.activitiesContainer}>
              {recentActivities.map((activity, index) => {
                const IconComponent = activity.icon;
                return (
                  <View key={index} style={styles.activityCard}>
                    <View style={[styles.activityIcon, { backgroundColor: activity.color + '15' }]}>
                      <IconComponent size={16} color={activity.color} />
                    </View>
                    <View style={styles.activityContent}>
                      <Text style={styles.activityTitle}>{activity.title}</Text>
                      <Text style={styles.activityTime}>{activity.time}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Wellness Tips Section */}
        <View style={styles.wellnessSection}>
          <Text style={styles.sectionTitle}>Daily Wellness Tips</Text>
          
          <View style={styles.wellnessGrid}>
            {wellnessTips.map((tip, index) => {
              const IconComponent = tip.icon;
              return (
                <View key={index} style={styles.wellnessTipCard}>
                  <View style={[styles.wellnessTipIcon, { backgroundColor: Colors.PRIMARY + '15' }]}>
                    <IconComponent size={20} color={Colors.PRIMARY} />
                  </View>
                  <Text style={styles.wellnessTipTitle}>{tip.title}</Text>
                  <Text style={styles.wellnessTipDescription}>{tip.description}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </WebLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  // Dashboard Header
  dashboardHeader: {
    paddingHorizontal: width < 640 ? 16 : width < 1024 ? 24 : 32,
    paddingVertical: width < 640 ? 16 : width < 1024 ? 20 : 24,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    flexDirection: width < 640 ? 'column' : 'row',
    justifyContent: 'space-between',
    alignItems: width < 640 ? 'flex-start' : 'center',
    gap: width < 640 ? 12 : 0,
  },
  headerContent: {
    flexDirection: width < 640 ? 'column' : 'row',
    justifyContent: 'space-between',
    alignItems: width < 640 ? 'flex-start' : 'center',
    width: '100%',
    maxWidth: 1200,
    alignSelf: 'center',
    gap: width < 640 ? 12 : 0,
  },
  welcomeText: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  dashboardTitle: {
    fontSize: width < 640 ? 24 : width < 1024 ? 26 : 28,
    fontWeight: '700',
    color: '#1e293b',
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Stats Overview
  statsSection: {
    paddingHorizontal: width < 640 ? 16 : width < 1024 ? 24 : 32,
    paddingVertical: width < 640 ? 16 : width < 1024 ? 20 : 24,
    backgroundColor: 'white',
    marginBottom: width < 640 ? 16 : width < 1024 ? 20 : 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 4,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  periodButtonActive: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  periodButtonText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  periodButtonTextActive: {
    color: '#1e293b',
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: width < 640 ? 'column' : 'row',
    gap: width < 640 ? 12 : width < 1024 ? 16 : 20,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    minWidth: width < 640 ? '100%' : 200,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statChange: {
    fontSize: 12,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  statUnit: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '400',
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  // Main Sections
  mainSection: {
    paddingHorizontal: width < 640 ? 16 : width < 1024 ? 24 : 32,
    paddingVertical: width < 640 ? 16 : width < 1024 ? 20 : 24,
    backgroundColor: 'white',
    marginBottom: width < 640 ? 16 : width < 1024 ? 20 : 24,
  },
  // Dashboard Cards
  dashboardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: width < 640 ? 12 : width < 1024 ? 16 : 20,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  dashboardCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: width < 640 ? 16 : width < 1024 ? 18 : 20,
    width: width < 640 ? '100%' : width < 1024 ? '48%' : '31%',
    minWidth: width < 640 ? 0 : 280,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    alignItems: 'flex-end',
  },
  progressBar: {
    width: 60,
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  // Two Column Layout
  twoColumnSection: {
    flexDirection: width < 768 ? 'column' : 'row',
    gap: width < 640 ? 16 : width < 1024 ? 20 : 24,
    paddingHorizontal: width < 640 ? 16 : width < 1024 ? 24 : 32,
    marginBottom: width < 640 ? 16 : width < 1024 ? 20 : 24,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  leftColumn: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  rightColumn: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  // Quick Actions
  quickActionsContainer: {
    gap: 12,
  },
  quickActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 12,
  },
  quickActionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionContent: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  quickActionDescription: {
    fontSize: 12,
    color: '#64748b',
  },
  // Recent Activities
  activitiesContainer: {
    gap: 12,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 12,
  },
  activityIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#64748b',
  },
  // Wellness Tips
  wellnessSection: {
    paddingHorizontal: width < 640 ? 16 : width < 1024 ? 24 : 32,
    paddingVertical: width < 640 ? 16 : width < 1024 ? 20 : 24,
    backgroundColor: 'white',
    marginBottom: width < 640 ? 16 : width < 1024 ? 20 : 24,
  },
  wellnessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: width < 640 ? 12 : width < 1024 ? 14 : 16,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  wellnessTipCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: width < 640 ? 12 : width < 1024 ? 14 : 16,
    width: width < 640 ? '100%' : width < 1024 ? '48%' : '31%',
    minWidth: width < 640 ? 0 : 200,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  wellnessTipIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  wellnessTipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  wellnessTipDescription: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 16,
  },
});