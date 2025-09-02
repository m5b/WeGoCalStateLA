import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Chrome as Home, Calendar, Brain, BookOpen, User, MessageCircle, Heart, TrendingUp, Clock } from 'lucide-react-native';
import Colors from '../../constant/Colors';
import WebHomeScreen from './web-home';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  // Return web version for web platform
  if (Platform.OS === 'web') {
    return <WebHomeScreen />;
  }

  const [activeTab, setActiveTab] = useState('home');

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
      case 'profile':
        router.push('/profile');
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

  const quickActions = [
    {
      id: 'daily',
      title: 'Daily Check-in',
      subtitle: 'How are you feeling today?',
      icon: Heart,
      color: Colors.GREEN,
      route: 'daily'
    },
    {
      id: 'quiz',
      title: 'Wellness Quiz',
      subtitle: 'Take a mental health assessment',
      icon: Brain,
      color: Colors.PRIMARY,
      route: 'quizzes'
    },
    {
      id: 'resources',
      title: 'Resources',
      subtitle: 'Find help and support',
      icon: BookOpen,
      color: Colors.INFO,
      route: 'resources'
    },
    {
      id: 'progress',
      title: 'My Progress',
      subtitle: 'Track your wellness journey',
      icon: TrendingUp,
      color: Colors.SECONDARY,
      route: 'profile'
    }
  ];

  const TabButton = ({ icon: Icon, label, isActive, onPress }) => (
    <TouchableOpacity 
      style={[styles.tabButton, isActive && styles.activeTabButton]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Icon 
        size={24} 
        color={isActive ? Colors.WHITE : Colors.LIGHT_BLUE} 
      />
      <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[Colors.PRIMARY, Colors.DARK_BLUE]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Welcome Back!</Text>
          <Text style={styles.headerSubtitle}>Cal State LA Golden Eagles</Text>
        </View>
      </LinearGradient>

      {/* Main Content */}
      <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
        <View style={styles.contentPadding}>
          {/* Welcome Card */}
          <View style={styles.welcomeCard}>
            <Text style={styles.welcomeTitle}>Your Wellness Journey</Text>
            <Text style={styles.welcomeText}>
              Take charge of your mental health with personalized tools and resources designed for Cal State LA students.
            </Text>
          </View>

          {/* Quick Actions */}
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionCard}
                onPress={() => navigateToScreen(action.route)}
                activeOpacity={0.8}
              >
                <View style={[styles.actionIconContainer, { backgroundColor: action.color + '20' }]}>
                  <action.icon size={28} color={action.color} />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Today's Highlight */}
          <View style={styles.highlightCard}>
            <View style={styles.highlightHeader}>
              <Clock size={20} color={Colors.SECONDARY} />
              <Text style={styles.highlightTitle}>Today's Focus</Text>
            </View>
            <Text style={styles.highlightText}>
              "Mental health is not a destination, but a process. It's about how you drive, not where you're going."
            </Text>
            <View style={styles.highlightFooter}>
              <Text style={styles.highlightAuthor}>- Noam Shpancer</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Floating Chatbot Button */}
      <TouchableOpacity
        style={styles.chatButton}
        onPress={() => navigateToScreen('chat')}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[Colors.SECONDARY, Colors.DARK_GOLD]}
          style={styles.chatButtonGradient}
        >
          <MessageCircle size={28} color={Colors.BLACK} />
        </LinearGradient>
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <LinearGradient
          colors={[Colors.PRIMARY, Colors.DARK_BLUE]}
          style={styles.navGradient}
        >
          <View style={styles.tabContainer}>
            <TabButton
              icon={Home}
              label="Home"
              isActive={activeTab === 'home'}
              onPress={() => setActiveTab('home')}
            />
            <TabButton
              icon={Calendar}
              label="Events"
              isActive={activeTab === 'events'}
              onPress={() => {
                setActiveTab('events');
                navigateToScreen('events');
              }}
            />
            <TabButton
              icon={Brain}
              label="Quizzes"
              isActive={activeTab === 'quizzes'}
              onPress={() => {
                setActiveTab('quizzes');
                navigateToScreen('quizzes');
              }}
            />
            <TabButton
              icon={BookOpen}
              label="Resources"
              isActive={activeTab === 'resources'}
              onPress={() => {
                setActiveTab('resources');
                navigateToScreen('resources');
              }}
            />
            <TabButton
              icon={User}
              label="Profile"
              isActive={activeTab === 'profile'}
              onPress={() => {
                setActiveTab('profile');
                navigateToScreen('profile');
              }}
            />
          </View>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT_GRAY,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 25,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.WHITE,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.LIGHT_GOLD,
    fontWeight: '500',
  },
  mainContent: {
    flex: 1,
  },
  contentPadding: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  welcomeCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: 16,
    padding: 24,
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
    borderLeftWidth: 4,
    borderLeftColor: Colors.SECONDARY,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    marginBottom: 12,
  },
  welcomeText: {
    fontSize: 16,
    color: Colors.GRAY,
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  actionCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: 16,
    padding: 20,
    width: (width - 60) / 2,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    textAlign: 'center',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: Colors.GRAY,
    textAlign: 'center',
    lineHeight: 16,
  },
  highlightCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: Colors.PRIMARY,
  },
  highlightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  highlightTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    marginLeft: 8,
  },
  highlightText: {
    fontSize: 16,
    color: Colors.DARK_GRAY,
    lineHeight: 24,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  highlightFooter: {
    alignItems: 'flex-end',
  },
  highlightAuthor: {
    fontSize: 14,
    color: Colors.GRAY,
    fontWeight: '500',
  },
  chatButton: {
    position: 'absolute',
    right: 20,
    bottom: 110,
    width: 60,
    height: 60,
    borderRadius: 30,
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  chatButtonGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navGradient: {
    paddingTop: 12,
    paddingBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabButton: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    minWidth: 60,
  },
  activeTabButton: {
    backgroundColor: Colors.LIGHT_BLUE + '30',
  },
  tabLabel: {
    fontSize: 12,
    color: Colors.LIGHT_BLUE,
    marginTop: 4,
    fontWeight: '500',
  },
  activeTabLabel: {
    color: Colors.WHITE,
    fontWeight: 'bold',
  },
});