import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { router, usePathname } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Chrome as Home, Calendar, Brain, BookOpen, User, MessageCircle, Heart, TrendingUp, Menu, X, Shield, Award, Activity } from 'lucide-react-native';
import Colors from '../constant/Colors';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

export default function WebLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navigationItems = [
    {
      name: 'Home',
      icon: Home,
      route: '/home_screen/home',
      active: pathname === '/home_screen/home' || pathname === '/',
      description: 'Dashboard and overview',
    },
    {
      name: 'Daily Check-in',
      icon: Heart,
      route: '/daily_check_in/daily',
      active: pathname.includes('/daily_check_in'),
      description: 'Track your daily wellness',
    },
    {
      name: 'Assessments',
      icon: Brain,
      route: '/quizzes/quiz_list',
      active: pathname.includes('/quizzes'),
      description: 'Mental health screenings',
    },
    {
      name: 'Progress',
      icon: TrendingUp,
      route: '/daily_check_in/progress',
      active: pathname.includes('/progress'),
      description: 'View your wellness trends',
    },
    {
      name: 'Events',
      icon: Calendar,
      route: '/home_screen/events',
      active: pathname === '/home_screen/events',
      description: 'Campus wellness events',
    },
    {
      name: 'Resources',
      icon: BookOpen,
      route: '/resources/resource',
      active: pathname.includes('/resources'),
      description: 'Campus support services',
    },
    {
      name: 'Chat Support',
      icon: MessageCircle,
      route: '/chat_bot/chatbotui',
      active: pathname.includes('/chat_bot'),
      description: 'AI wellness assistant',
    },
    {
      name: 'Profile',
      icon: User,
      route: '/profile',
      active: pathname.includes('/profile'),
      description: 'Account and settings',
    },
  ];

  const navigateToScreen = (route) => {
    router.push(route);
    setSidebarOpen(false);
  };

  if (!isWeb) {
    return children;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[Colors.PRIMARY, '#1e40af']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <X size={24} color={Colors.WHITE} />
            ) : (
              <Menu size={24} color={Colors.WHITE} />
            )}
          </TouchableOpacity>
          
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>WeGoToCalStateLA</Text>
            <Text style={styles.headerSubtitle}>Mental Health & Wellness Platform</Text>
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => navigateToScreen('/chat_bot/chatbotui')}
            >
              <MessageCircle size={20} color={Colors.WHITE} />
              <Text style={styles.headerButtonText}>Support Chat</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => navigateToScreen('/daily_check_in/daily')}
            >
              <Heart size={20} color={Colors.WHITE} />
              <Text style={styles.headerButtonText}>Check-in</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => navigateToScreen('/profile')}
            >
              <User size={20} color={Colors.PRIMARY} />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.mainContainer}>
        {/* Sidebar */}
        {sidebarOpen && (
          <>
            <TouchableOpacity 
              style={styles.overlay} 
              onPress={() => setSidebarOpen(false)}
              activeOpacity={1}
            />
            <View style={styles.sidebar}>
              <LinearGradient
                colors={['#ffffff', '#f8fafc']}
                style={styles.sidebarGradient}
              >
                <View style={styles.sidebarHeader}>
                  <View style={styles.sidebarBrand}>
                    <View style={styles.brandIcon}>
                      <Shield size={24} color={Colors.PRIMARY} />
                    </View>
                    <View>
                      <Text style={styles.sidebarTitle}>Navigation</Text>
                      <Text style={styles.sidebarSubtitle}>Golden Eagles Wellness</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.sidebarContent}>
                  {navigationItems.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.sidebarItem,
                          item.active && styles.sidebarItemActive,
                        ]}
                        onPress={() => navigateToScreen(item.route)}
                      >
                        <View style={[
                          styles.sidebarItemIcon,
                          item.active && styles.sidebarItemIconActive
                        ]}>
                          <IconComponent
                            size={20}
                            color={item.active ? Colors.PRIMARY : '#64748b'}
                          />
                        </View>
                        <View style={styles.sidebarItemContent}>
                          <Text
                            style={[
                              styles.sidebarItemText,
                              item.active && styles.sidebarItemTextActive,
                            ]}
                          >
                            {item.name}
                          </Text>
                          <Text style={styles.sidebarItemDescription}>
                            {item.description}
                          </Text>
                        </View>
                        {item.active && <View style={styles.activeIndicator} />}
                      </TouchableOpacity>
                    );
                  })}
                </View>
                
                <View style={styles.sidebarFooter}>
                  <View style={styles.emergencyCard}>
                    <Text style={styles.emergencyTitle}>Need Immediate Help?</Text>
                    <Text style={styles.emergencyText}>Crisis Hotline: 988</Text>
                    <Text style={styles.emergencyText}>Campus: (323) 343-3371</Text>
                  </View>
                </View>
              </LinearGradient>
            </View>
          </>
        )}

        {/* Main Content */}
        <View style={[styles.content, sidebarOpen && styles.contentWithSidebar]}>
          {children}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafbfc',
  },
  header: {
    paddingTop: 24,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 40,
    maxWidth: 1400,
    alignSelf: 'center',
  },
  menuButton: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.WHITE,
    marginBottom: 4,
    letterSpacing: -0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.LIGHT_GOLD,
    fontWeight: '500',
    letterSpacing: -0.2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerButtonText: {
    color: Colors.WHITE,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 380,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 8, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 20,
  },
  sidebarGradient: {
    flex: 1,
  },
  sidebarHeader: {
    padding: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  sidebarBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  brandIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.PRIMARY + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sidebarTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.PRIMARY,
    letterSpacing: -0.5,
  },
  sidebarSubtitle: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  sidebarContent: {
    flex: 1,
    padding: 24,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 8,
    gap: 16,
    position: 'relative',
  },
  sidebarItemActive: {
    backgroundColor: Colors.PRIMARY + '08',
    shadowColor: Colors.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  sidebarItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
  },
  sidebarItemIconActive: {
    backgroundColor: Colors.PRIMARY + '15',
  },
  sidebarItemContent: {
    flex: 1,
  },
  sidebarItemText: {
    fontSize: 16,
    color: '#475569',
    fontWeight: '600',
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  sidebarItemTextActive: {
    color: Colors.PRIMARY,
    fontWeight: '700',
  },
  sidebarItemDescription: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '400',
  },
  activeIndicator: {
    position: 'absolute',
    right: 0,
    top: '50%',
    marginTop: -12,
    width: 4,
    height: 24,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 2,
  },
  sidebarFooter: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  emergencyCard: {
    backgroundColor: Colors.ERROR + '10',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: Colors.ERROR,
  },
  emergencyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.ERROR,
    marginBottom: 8,
    letterSpacing: -0.1,
  },
  emergencyText: {
    fontSize: 13,
    color: '#dc2626',
    fontWeight: '500',
    marginBottom: 4,
  },
  content: {
    flex: 1,
    maxWidth: 1400,
    alignSelf: 'center',
    width: '100%',
  },
  contentWithSidebar: {
    marginLeft: 0,
  },
});