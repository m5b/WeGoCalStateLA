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
import {
  Home,
  Calendar,
  Brain,
  BookOpen,
  User,
  MessageCircle,
  Heart,
  TrendingUp,
  Menu,
  X,
} from 'lucide-react-native';
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
    },
    {
      name: 'Events',
      icon: Calendar,
      route: '/home_screen/events',
      active: pathname === '/home_screen/events',
    },
    {
      name: 'Assessments',
      icon: Brain,
      route: '/quizzes/quiz_list',
      active: pathname.includes('/quizzes'),
    },
    {
      name: 'Daily Check-in',
      icon: Heart,
      route: '/daily_check_in/daily',
      active: pathname.includes('/daily_check_in'),
    },
    {
      name: 'Resources',
      icon: BookOpen,
      route: '/resources/resource',
      active: pathname.includes('/resources'),
    },
    {
      name: 'Profile',
      icon: User,
      route: '/profile',
      active: pathname.includes('/profile'),
    },
    {
      name: 'Chat Bot',
      icon: MessageCircle,
      route: '/chat_bot/chatbotui',
      active: pathname.includes('/chat_bot'),
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
        colors={[Colors.PRIMARY, Colors.LIGHT_BLUE]}
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
              <Text style={styles.headerButtonText}>Chat</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => navigateToScreen('/profile')}
            >
              <User size={20} color={Colors.WHITE} />
              <Text style={styles.headerButtonText}>Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.mainContainer}>
        {/* Sidebar */}
        {sidebarOpen && (
          <View style={styles.sidebar}>
            <LinearGradient
              colors={[Colors.WHITE, Colors.LIGHT_GRAY]}
              style={styles.sidebarGradient}
            >
              <View style={styles.sidebarHeader}>
                <Text style={styles.sidebarTitle}>Navigation</Text>
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
                      <IconComponent
                        size={20}
                        color={item.active ? Colors.PRIMARY : Colors.GRAY}
                      />
                      <Text
                        style={[
                          styles.sidebarItemText,
                          item.active && styles.sidebarItemTextActive,
                        ]}
                      >
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </LinearGradient>
          </View>
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
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 32,
  },
  menuButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: Colors.WHITE + '25',
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.WHITE,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    color: Colors.LIGHT_GOLD,
    fontWeight: '500',
    letterSpacing: -0.2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: Colors.WHITE + '25',
    gap: 8,
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerButtonText: {
    color: Colors.WHITE,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 300,
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 4,
      height: 0,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  sidebarGradient: {
    flex: 1,
  },
  sidebarHeader: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  sidebarTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.PRIMARY,
    letterSpacing: -0.3,
  },
  sidebarContent: {
    flex: 1,
    padding: 20,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 6,
    gap: 14,
  },
  sidebarItemActive: {
    backgroundColor: Colors.PRIMARY + '12',
    borderLeftWidth: 4,
    borderLeftColor: Colors.PRIMARY,
    shadowColor: Colors.PRIMARY,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  sidebarItemText: {
    fontSize: 16,
    color: '#475569',
    fontWeight: '500',
    letterSpacing: -0.2,
  },
  sidebarItemTextActive: {
    color: Colors.PRIMARY,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  contentWithSidebar: {
    marginLeft: 0,
  },
});