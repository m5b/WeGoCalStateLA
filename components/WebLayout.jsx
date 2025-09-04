import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  ScrollView,
} from 'react-native';
import { router, usePathname } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Home, Calendar, Brain, BookOpen, User, MessageCircle, Heart, TrendingUp, 
  Menu, X, Shield, Sparkles, Bell, Search, ChevronDown, Settings, LogOut, 
  HelpCircle, ChevronRight
} from 'lucide-react-native';
import Colors from '../constant/Colors';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

export default function WebLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigationItems = [
    {
      name: 'Dashboard',
      icon: Home,
      route: '/home_screen/home',
      active: pathname === '/home_screen/home' || pathname === '/',
      description: 'Overview & insights',
      badge: null,
    },
    {
      name: 'Daily Check-in',
      icon: Heart,
      route: '/daily_check_in/daily',
      active: pathname.includes('/daily_check_in'),
      description: 'Track wellness',
      badge: 'New',
    },
    {
      name: 'Assessments',
      icon: Brain,
      route: '/quizzes/quiz_list',
      active: pathname.includes('/quizzes'),
      description: 'Mental health tools',
      badge: null,
    },
    {
      name: 'Progress',
      icon: TrendingUp,
      route: '/daily_check_in/progress',
      active: pathname.includes('/progress'),
      description: 'Analytics & trends',
      badge: null,
    },
    {
      name: 'Events',
      icon: Calendar,
      route: '/home_screen/events',
      active: pathname === '/home_screen/events',
      description: 'Campus activities',
      badge: '3',
    },
    {
      name: 'Resources',
      icon: BookOpen,
      route: '/resources/resource',
      active: pathname.includes('/resources'),
      description: 'Support services',
      badge: null,
    },
    {
      name: 'AI Assistant',
      icon: MessageCircle,
      route: '/chat_bot/chatbotui',
      active: pathname.includes('/chat_bot'),
      description: 'Get instant help',
      badge: null,
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
      {/* Modern Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          {/* Left Section */}
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={20} color="#374151" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.brandContainer}
              onPress={() => router.push('/')}
            >
              <View style={styles.brandIcon}>
                <Sparkles size={20} color={Colors.PRIMARY} />
              </View>
              <Text style={styles.brandText}>WeGo</Text>
            </TouchableOpacity>
          </View>

          {/* Center Section - Search */}
          <View style={styles.headerCenter}>
            <View style={styles.searchContainer}>
              <Search size={16} color="#9CA3AF" />
              <Text style={styles.searchPlaceholder}>Search resources, events...</Text>
            </View>
          </View>

          {/* Right Section */}
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton}>
              <Bell size={18} color="#6B7280" />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.iconButton}>
              <HelpCircle size={18} color="#6B7280" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.userMenuButton}
              onPress={() => setUserMenuOpen(!userMenuOpen)}
            >
              <View style={styles.avatar}>
                <User size={16} color="#FFFFFF" />
              </View>
              <ChevronDown size={14} color="#6B7280" />
            </TouchableOpacity>
            
            {/* User Dropdown Menu */}
            {userMenuOpen && (
              <View style={styles.userDropdown}>
                <TouchableOpacity 
                  style={styles.dropdownItem}
                  onPress={() => {
                    navigateToScreen('/profile');
                    setUserMenuOpen(false);
                  }}
                >
                  <User size={16} color="#6B7280" />
                  <Text style={styles.dropdownText}>Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dropdownItem}>
                  <Settings size={16} color="#6B7280" />
                  <Text style={styles.dropdownText}>Settings</Text>
                </TouchableOpacity>
                <View style={styles.dropdownDivider} />
                <TouchableOpacity style={styles.dropdownItem}>
                  <LogOut size={16} color="#EF4444" />
                  <Text style={[styles.dropdownText, { color: '#EF4444' }]}>Sign out</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>

      <View style={styles.mainContainer}>
        {/* Modern Sidebar */}
        {sidebarOpen && (
          <>
            <TouchableOpacity 
              style={styles.overlay} 
              onPress={() => setSidebarOpen(false)}
              activeOpacity={1}
            />
            <View style={styles.sidebar}>
              <View style={styles.sidebarContent}>
                <View style={styles.sidebarHeader}>
                  <View style={styles.sidebarBrand}>
                    <View style={styles.sidebarBrandIcon}>
                      <Sparkles size={20} color={Colors.PRIMARY} />
                    </View>
                    <Text style={styles.sidebarBrandText}>WeGo Platform</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.sidebarClose}
                    onPress={() => setSidebarOpen(false)}
                  >
                    <X size={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>
                
                <ScrollView style={styles.sidebarNav} showsVerticalScrollIndicator={false}>
                  <View style={styles.navSection}>
                    <Text style={styles.navSectionTitle}>Main</Text>
                    {navigationItems.slice(0, 5).map((item, index) => {
                      const IconComponent = item.icon;
                      return (
                        <TouchableOpacity
                          key={index}
                          style={[
                            styles.navItem,
                            item.active && styles.navItemActive,
                          ]}
                          onPress={() => navigateToScreen(item.route)}
                        >
                          <View style={styles.navItemLeft}>
                            <View style={[
                              styles.navItemIcon,
                              item.active && styles.navItemIconActive
                            ]}>
                              <IconComponent
                                size={18}
                                color={item.active ? Colors.PRIMARY : '#6B7280'}
                              />
                            </View>
                            <View style={styles.navItemContent}>
                              <Text style={[
                                styles.navItemText,
                                item.active && styles.navItemTextActive,
                              ]}>
                                {item.name}
                              </Text>
                              <Text style={styles.navItemDescription}>
                                {item.description}
                              </Text>
                            </View>
                          </View>
                          {item.badge && (
                            <View style={[
                              styles.navBadge,
                              item.badge === 'New' && styles.navBadgeNew
                            ]}>
                              <Text style={[
                                styles.navBadgeText,
                                item.badge === 'New' && styles.navBadgeTextNew
                              ]}>
                                {item.badge}
                              </Text>
                            </View>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                  
                  <View style={styles.navSection}>
                    <Text style={styles.navSectionTitle}>Support</Text>
                    {navigationItems.slice(5).map((item, index) => {
                      const IconComponent = item.icon;
                      return (
                        <TouchableOpacity
                          key={index + 5}
                          style={[
                            styles.navItem,
                            item.active && styles.navItemActive,
                          ]}
                          onPress={() => navigateToScreen(item.route)}
                        >
                          <View style={styles.navItemLeft}>
                            <View style={[
                              styles.navItemIcon,
                              item.active && styles.navItemIconActive
                            ]}>
                              <IconComponent
                                size={18}
                                color={item.active ? Colors.PRIMARY : '#6B7280'}
                              />
                            </View>
                            <View style={styles.navItemContent}>
                              <Text style={[
                                styles.navItemText,
                                item.active && styles.navItemTextActive,
                              ]}>
                                {item.name}
                              </Text>
                              <Text style={styles.navItemDescription}>
                                {item.description}
                              </Text>
                            </View>
                          </View>
                          {item.badge && (
                            <View style={[
                              styles.navBadge,
                              item.badge === 'New' && styles.navBadgeNew
                            ]}>
                              <Text style={[
                                styles.navBadgeText,
                                item.badge === 'New' && styles.navBadgeTextNew
                              ]}>
                                {item.badge}
                              </Text>
                            </View>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                    
                    <TouchableOpacity style={styles.navItem}>
                      <View style={styles.navItemLeft}>
                        <View style={styles.navItemIcon}>
                          <HelpCircle size={18} color="#6B7280" />
                        </View>
                        <View style={styles.navItemContent}>
                          <Text style={styles.navItemText}>Help Center</Text>
                          <Text style={styles.navItemDescription}>Get support</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
                
                <View style={styles.sidebarFooter}>
                  <View style={styles.emergencyCard}>
                    <View style={styles.emergencyHeader}>
                      <Shield size={16} color="#DC2626" />
                      <Text style={styles.emergencyTitle}>Emergency Support</Text>
                    </View>
                    <Text style={styles.emergencyText}>24/7 Crisis Hotline: 988</Text>
                  </View>
                </View>
              </View>
            </View>
          </>
        )}

        {/* Main Content */}
        <View style={styles.content}>
          <View style={styles.contentInner}>
            {children}
          </View>
        </View>
      </View>
      
      {/* Click outside to close menus */}
      {(sidebarOpen || userMenuOpen) && (
        <TouchableOpacity 
          style={styles.globalOverlay}
          onPress={() => {
            setSidebarOpen(false);
            setUserMenuOpen(false);
          }}
          activeOpacity={1}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  
  // Header Styles
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 16,
    zIndex: 100,
    position: 'sticky',
    top: 0,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: width < 768 ? 16 : width < 1024 ? 24 : 32,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerCenter: {
    flex: 1,
    maxWidth: width < 768 ? 0 : 400,
    marginHorizontal: width < 768 ? 0 : 32,
    display: width < 768 ? 'none' : 'flex',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    position: 'relative',
  },
  
  // Header Components
  menuButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.PRIMARY + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchPlaceholder: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '400',
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  userMenuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userDropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    minWidth: 180,
    zIndex: 1000,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 4,
  },
  
  // Layout
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
  },
  
  // Sidebar Styles
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 1,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: width < 640 ? width * 0.85 : 280,
    backgroundColor: '#FFFFFF',
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 16,
  },
  sidebarContent: {
    flex: 1,
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sidebarBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sidebarBrandIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: Colors.PRIMARY + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sidebarBrandText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.3,
  },
  sidebarClose: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  sidebarNav: {
    flex: 1,
    paddingVertical: 16,
  },
  navSection: {
    marginBottom: 24,
  },
  navSectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 12,
    borderRadius: 8,
    gap: 12,
  },
  navItemActive: {
    backgroundColor: Colors.PRIMARY + '10',
    borderLeftWidth: 3,
    borderLeftColor: Colors.PRIMARY,
  },
  navItemIcon: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  navItemContent: {
    flex: 1,
  },
  navItemText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  navItemTextActive: {
    color: Colors.PRIMARY,
    fontWeight: '600',
  },
  navItemDescription: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '400',
    marginTop: 2,
  },
  navBadge: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 18,
    alignItems: 'center',
  },
  navBadgeNew: {
    backgroundColor: Colors.PRIMARY,
  },
  navBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
  },
  navBadgeTextNew: {
    color: 'white',
  },
  sidebarFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  emergencyCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  emergencyTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#DC2626',
    letterSpacing: -0.1,
  },
  emergencyText: {
    fontSize: 12,
    color: '#991B1B',
    fontWeight: '400',
    lineHeight: 16,
  },
  
  // Content Area
  content: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: width < 640 ? 16 : width < 1024 ? 20 : 24,
  },
  contentInner: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  globalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
});