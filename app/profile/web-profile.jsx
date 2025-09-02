import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  Switch,
  Alert,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Settings, Bell, Shield, CircleHelp as HelpCircle, LogOut, ChevronRight, CreditCard as Edit2, Save, Mail, GraduationCap, Calendar, Award, Activity, Target, TrendingUp, Heart, Brain, CircleCheck as CheckCircle, Star, Trophy, Zap, Clock, ChartBar as BarChart } from 'lucide-react-native';
import Colors from '../../constant/Colors';
import WebLayout from '../../components/WebLayout';

const { width } = Dimensions.get('window');

export default function WebProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [dataSharing, setDataSharing] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  // User profile data
  const [userData, setUserData] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@calstatela.edu',
    studentId: '304598765',
    major: 'Computer Science',
    year: 'Junior',
    joinedDate: 'September 2023',
  });

  // Mock wellness data
  const wellnessStats = [
    { label: 'Check-ins Completed', value: '28', icon: CheckCircle, color: Colors.SUCCESS, trend: '+12%' },
    { label: 'Current Wellness Score', value: '85%', icon: Star, color: Colors.PRIMARY, trend: '+5%' },
    { label: 'Assessments Taken', value: '5', icon: Brain, color: Colors.INFO, trend: '+2' },
    { label: 'Days Active', value: '42', icon: Activity, color: Colors.SECONDARY, trend: '+7' },
  ];

  const recentActivity = [
    { type: 'Daily Check-in', date: 'Today', status: 'completed', color: Colors.SUCCESS, score: '4.2/5' },
    { type: 'PHQ-9 Assessment', date: 'Yesterday', status: 'completed', color: Colors.INFO, score: '6/27' },
    { type: 'Daily Check-in', date: '2 days ago', status: 'completed', color: Colors.SUCCESS, score: '3.8/5' },
    { type: 'GAD-7 Assessment', date: '3 days ago', status: 'completed', color: Colors.WARNING, score: '8/21' },
    { type: 'Daily Check-in', date: '4 days ago', status: 'completed', color: Colors.SUCCESS, score: '4.5/5' },
  ];

  const achievements = [
    { 
      title: 'First Check-in', 
      description: 'Completed your first daily wellness check-in', 
      icon: Trophy, 
      earned: true,
      date: 'Sept 15, 2023'
    },
    { 
      title: 'Week Warrior', 
      description: 'Completed check-ins for 7 consecutive days', 
      icon: Award, 
      earned: true,
      date: 'Sept 22, 2023'
    },
    { 
      title: 'Assessment Pro', 
      description: 'Completed 5 mental health assessments', 
      icon: Brain, 
      earned: true,
      date: 'Oct 5, 2023'
    },
    { 
      title: 'Wellness Champion', 
      description: 'Maintained 80%+ wellness score for a month', 
      icon: Star, 
      earned: false,
      progress: '75%'
    },
    { 
      title: 'Consistency King', 
      description: 'Complete check-ins for 30 consecutive days', 
      icon: Target, 
      earned: false,
      progress: '60%'
    },
    { 
      title: 'Resource Explorer', 
      description: 'Accessed 10 different campus resources', 
      icon: Zap, 
      earned: false,
      progress: '40%'
    },
  ];

  const handleSaveProfile = () => {
    setIsEditing(false);
    Alert.alert('Success', 'Profile information updated successfully!');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => router.replace('/authentication/login')
        },
      ]
    );
  };

  return (
    <WebLayout>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <LinearGradient
          colors={[Colors.PRIMARY, '#1e40af']}
          style={styles.heroSection}
        >
          <View style={styles.heroContent}>
            <View style={styles.profileHeader}>
              <View style={styles.profileImageSection}>
                <View style={styles.profileImageContainer}>
                  <View style={styles.profileImage}>
                    <User size={72} color={Colors.WHITE} />
                  </View>
                  <TouchableOpacity style={styles.changePhotoButton}>
                    <Edit2 size={16} color={Colors.PRIMARY} />
                    <Text style={styles.changePhotoText}>Change Photo</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{userData.name}</Text>
                <Text style={styles.profileRole}>{userData.major} • {userData.year}</Text>
                <Text style={styles.profileEmail}>{userData.email}</Text>
                <View style={styles.profileMeta}>
                  <View style={styles.metaItem}>
                    <Calendar size={18} color={Colors.WHITE + 'CC'} />
                    <Text style={styles.metaText}>Joined {userData.joinedDate}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <GraduationCap size={18} color={Colors.WHITE + 'CC'} />
                    <Text style={styles.metaText}>Student ID: {userData.studentId}</Text>
                  </View>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.editProfileButton}
                onPress={() => setIsEditing(!isEditing)}
              >
                <Edit2 size={20} color={Colors.PRIMARY} />
                <Text style={styles.editProfileText}>
                  {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.mainContent}>
          {/* Wellness Dashboard */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Activity size={28} color={Colors.PRIMARY} />
              <Text style={styles.sectionTitle}>Wellness Dashboard</Text>
              <TouchableOpacity 
                style={styles.viewAllButton}
                onPress={() => router.push('/daily_check_in/progress')}
              >
                <BarChart size={16} color={Colors.PRIMARY} />
                <Text style={styles.viewAllText}>View Detailed Analytics</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.statsGrid}>
              {wellnessStats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <View key={index} style={styles.statCard}>
                    <View style={styles.statHeader}>
                      <View style={[styles.statIcon, { backgroundColor: stat.color + '12' }]}>
                        <IconComponent size={28} color={stat.color} />
                      </View>
                      <View style={styles.trendIndicator}>
                        <TrendingUp size={16} color={Colors.SUCCESS} />
                        <Text style={styles.trendText}>{stat.trend}</Text>
                      </View>
                    </View>
                    <Text style={styles.statValue}>{stat.value}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Profile Information */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <User size={28} color={Colors.PRIMARY} />
              <Text style={styles.sectionTitle}>Profile Information</Text>
            </View>
            
            {isEditing ? (
              <View style={styles.editForm}>
                <View style={styles.formGrid}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Full Name</Text>
                    <TextInput
                      style={styles.textInput}
                      value={userData.name}
                      onChangeText={(text) => setUserData({...userData, name: text})}
                      placeholder="Enter your full name"
                    />
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Email Address</Text>
                    <TextInput
                      style={styles.textInput}
                      value={userData.email}
                      onChangeText={(text) => setUserData({...userData, email: text})}
                      placeholder="Enter your email"
                      keyboardType="email-address"
                    />
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Major</Text>
                    <TextInput
                      style={styles.textInput}
                      value={userData.major}
                      onChangeText={(text) => setUserData({...userData, major: text})}
                      placeholder="Enter your major"
                    />
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Academic Year</Text>
                    <TextInput
                      style={styles.textInput}
                      value={userData.year}
                      onChangeText={(text) => setUserData({...userData, year: text})}
                      placeholder="Enter your academic year"
                    />
                  </View>
                </View>
                
                <View style={styles.formActions}>
                  <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                    <LinearGradient
                      colors={[Colors.SUCCESS, '#16a34a']}
                      style={styles.saveButtonGradient}
                    >
                      <Save size={20} color={Colors.WHITE} />
                      <Text style={styles.saveButtonText}>Save Changes</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={() => setIsEditing(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.infoGrid}>
                <View style={styles.infoCard}>
                  <Mail size={24} color={Colors.PRIMARY} />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Email Address</Text>
                    <Text style={styles.infoValue}>{userData.email}</Text>
                  </View>
                </View>
                
                <View style={styles.infoCard}>
                  <GraduationCap size={24} color={Colors.PRIMARY} />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Student ID</Text>
                    <Text style={styles.infoValue}>{userData.studentId}</Text>
                  </View>
                </View>
                
                <View style={styles.infoCard}>
                  <User size={24} color={Colors.PRIMARY} />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Major</Text>
                    <Text style={styles.infoValue}>{userData.major}</Text>
                  </View>
                </View>
                
                <View style={styles.infoCard}>
                  <Calendar size={24} color={Colors.PRIMARY} />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Academic Year</Text>
                    <Text style={styles.infoValue}>{userData.year}</Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Recent Activity */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Clock size={28} color={Colors.PRIMARY} />
              <Text style={styles.sectionTitle}>Recent Wellness Activity</Text>
              <TouchableOpacity style={styles.viewAllButton}>
                <Text style={styles.viewAllText}>View All Activity</Text>
                <ChevronRight size={16} color={Colors.PRIMARY} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.activityList}>
              {recentActivity.map((activity, index) => (
                <View key={index} style={styles.activityItem}>
                  <View style={[styles.activityDot, { backgroundColor: activity.color }]} />
                  <View style={styles.activityContent}>
                    <View style={styles.activityHeader}>
                      <Text style={styles.activityType}>{activity.type}</Text>
                      <Text style={styles.activityScore}>{activity.score}</Text>
                    </View>
                    <Text style={styles.activityDate}>{activity.date}</Text>
                  </View>
                  <View style={[styles.activityStatus, { backgroundColor: activity.color + '12' }]}>
                    <CheckCircle size={16} color={activity.color} />
                    <Text style={[styles.activityStatusText, { color: activity.color }]}>Completed</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Achievements */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Trophy size={28} color={Colors.PRIMARY} />
              <Text style={styles.sectionTitle}>Wellness Achievements</Text>
              <View style={styles.achievementStats}>
                <Text style={styles.achievementStatsText}>3 of 6 earned</Text>
              </View>
            </View>
            
            <View style={styles.achievementsGrid}>
              {achievements.map((achievement, index) => {
                const IconComponent = achievement.icon;
                return (
                  <View key={index} style={[
                    styles.achievementCard,
                    !achievement.earned && styles.achievementLocked
                  ]}>
                    <View style={styles.achievementHeader}>
                      <View style={[
                        styles.achievementIcon,
                        { backgroundColor: achievement.earned ? Colors.SECONDARY + '15' : '#f1f5f9' }
                      ]}>
                        <IconComponent 
                          size={28} 
                          color={achievement.earned ? Colors.SECONDARY : '#94a3b8'} 
                        />
                      </View>
                      {achievement.earned && (
                        <View style={styles.earnedBadge}>
                          <CheckCircle size={16} color={Colors.SUCCESS} />
                          <Text style={styles.earnedText}>Earned</Text>
                        </View>
                      )}
                    </View>
                    
                    <Text style={[
                      styles.achievementTitle,
                      !achievement.earned && { color: '#94a3b8' }
                    ]}>
                      {achievement.title}
                    </Text>
                    <Text style={[
                      styles.achievementDescription,
                      !achievement.earned && { color: '#94a3b8' }
                    ]}>
                      {achievement.description}
                    </Text>
                    
                    {achievement.earned ? (
                      <Text style={styles.achievementDate}>Earned on {achievement.date}</Text>
                    ) : (
                      <View style={styles.progressContainer}>
                        <Text style={styles.progressText}>Progress: {achievement.progress}</Text>
                        <View style={styles.progressBar}>
                          <View style={[
                            styles.progressFill, 
                            { width: achievement.progress, backgroundColor: Colors.PRIMARY }
                          ]} />
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </View>

          {/* Settings */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Settings size={28} color={Colors.PRIMARY} />
              <Text style={styles.sectionTitle}>Settings & Preferences</Text>
            </View>
            
            <View style={styles.settingsGrid}>
              <View style={styles.settingCard}>
                <View style={styles.settingHeader}>
                  <Bell size={24} color={Colors.PRIMARY} />
                  <Text style={styles.settingTitle}>Notifications</Text>
                </View>
                <Text style={styles.settingDescription}>
                  Receive reminders for daily check-ins and wellness activities
                </Text>
                <View style={styles.settingControl}>
                  <Switch
                    value={notificationsEnabled}
                    onValueChange={setNotificationsEnabled}
                    trackColor={{ false: '#e2e8f0', true: Colors.PRIMARY + '40' }}
                    thumbColor={notificationsEnabled ? Colors.PRIMARY : '#94a3b8'}
                  />
                </View>
              </View>
              
              <View style={styles.settingCard}>
                <View style={styles.settingHeader}>
                  <Shield size={24} color={Colors.PRIMARY} />
                  <Text style={styles.settingTitle}>Data Sharing</Text>
                </View>
                <Text style={styles.settingDescription}>
                  Allow anonymous data sharing for mental health research (helps improve services)
                </Text>
                <View style={styles.settingControl}>
                  <Switch
                    value={dataSharing}
                    onValueChange={setDataSharing}
                    trackColor={{ false: '#e2e8f0', true: Colors.PRIMARY + '40' }}
                    thumbColor={dataSharing ? Colors.PRIMARY : '#94a3b8'}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Support & Help */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <HelpCircle size={28} color={Colors.PRIMARY} />
              <Text style={styles.sectionTitle}>Support & Resources</Text>
            </View>
            
            <View style={styles.supportGrid}>
              <TouchableOpacity style={styles.supportCard}>
                <View style={styles.supportIcon}>
                  <HelpCircle size={24} color={Colors.INFO} />
                </View>
                <Text style={styles.supportTitle}>Help Center</Text>
                <Text style={styles.supportDescription}>Find answers to common questions</Text>
                <ChevronRight size={20} color={Colors.GRAY} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.supportCard}>
                <View style={styles.supportIcon}>
                  <Shield size={24} color={Colors.SUCCESS} />
                </View>
                <Text style={styles.supportTitle}>Privacy Policy</Text>
                <Text style={styles.supportDescription}>Learn how we protect your data</Text>
                <ChevronRight size={20} color={Colors.GRAY} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.supportCard}>
                <View style={styles.supportIcon}>
                  <Award size={24} color={Colors.SECONDARY} />
                </View>
                <Text style={styles.supportTitle}>Terms of Service</Text>
                <Text style={styles.supportDescription}>Review our terms and conditions</Text>
                <ChevronRight size={20} color={Colors.GRAY} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.supportCard}>
                <View style={styles.supportIcon}>
                  <Heart size={24} color={Colors.ERROR} />
                </View>
                <Text style={styles.supportTitle}>Contact Support</Text>
                <Text style={styles.supportDescription}>Get help from our support team</Text>
                <ChevronRight size={20} color={Colors.GRAY} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Logout */}
          <View style={styles.logoutSection}>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <LogOut size={24} color={Colors.ERROR} />
              <View style={styles.logoutContent}>
                <Text style={styles.logoutTitle}>Sign Out</Text>
                <Text style={styles.logoutDescription}>Sign out of your WeGo account</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Version Info */}
          <View style={styles.versionSection}>
            <Text style={styles.versionText}>WeGo App v1.0.0</Text>
            <Text style={styles.versionSubtext}>Cal State LA Mental Health & Wellness Platform</Text>
            <Text style={styles.versionSubtext}>© 2024 California State University, Los Angeles</Text>
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
    paddingVertical: 80,
    paddingHorizontal: 60,
  },
  heroContent: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 48,
  },
  profileImageSection: {
    alignItems: 'center',
  },
  profileImageContainer: {
    alignItems: 'center',
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: Colors.WHITE,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.WHITE,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  changePhotoText: {
    color: Colors.PRIMARY,
    fontSize: 14,
    fontWeight: '600',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 42,
    fontWeight: '800',
    color: Colors.WHITE,
    marginBottom: 12,
    letterSpacing: -1,
  },
  profileRole: {
    fontSize: 22,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
    fontWeight: '500',
  },
  profileEmail: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 20,
    fontWeight: '400',
  },
  profileMeta: {
    flexDirection: 'row',
    gap: 32,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  editProfileText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.PRIMARY,
    letterSpacing: -0.2,
  },
  mainContent: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 60,
    paddingBottom: 80,
  },
  section: {
    backgroundColor: Colors.WHITE,
    borderRadius: 24,
    padding: 40,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.PRIMARY,
    flex: 1,
    letterSpacing: -0.5,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.PRIMARY + '10',
    borderRadius: 12,
  },
  viewAllText: {
    fontSize: 14,
    color: Colors.PRIMARY,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 24,
    flexWrap: 'wrap',
  },
  statCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    padding: 28,
    width: '23%',
    minWidth: 220,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 4,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  statIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.SUCCESS + '15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendText: {
    fontSize: 12,
    color: Colors.SUCCESS,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.PRIMARY,
    marginBottom: 8,
    letterSpacing: -1,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  editForm: {
    // Edit form styles
  },
  formGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 32,
    marginBottom: 32,
  },
  inputGroup: {
    width: '48%',
    minWidth: 280,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.PRIMARY,
    marginBottom: 12,
    letterSpacing: -0.1,
  },
  textInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: Colors.PRIMARY,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  formActions: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  saveButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    gap: 12,
  },
  saveButtonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: '700',
  },
  cancelButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  cancelButtonText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '600',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 24,
    width: '48%',
    minWidth: 280,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.PRIMARY,
    letterSpacing: -0.2,
  },
  activityList: {
    gap: 20,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  activityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  activityContent: {
    flex: 1,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  activityType: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.PRIMARY,
  },
  activityScore: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  activityDate: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  activityStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  activityStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
  },
  achievementCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    padding: 28,
    width: '31%',
    minWidth: 300,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 4,
  },
  achievementLocked: {
    opacity: 0.7,
  },
  achievementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  achievementIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  earnedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.SUCCESS + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  earnedText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.SUCCESS,
  },
  achievementTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.PRIMARY,
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  achievementDescription: {
    fontSize: 15,
    color: '#64748b',
    lineHeight: 22,
    marginBottom: 16,
    fontWeight: '400',
  },
  achievementDate: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '500',
  },
  progressContainer: {
    // Progress styles
  },
  progressText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  achievementStats: {
    backgroundColor: Colors.SECONDARY + '15',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  achievementStatsText: {
    fontSize: 14,
    color: Colors.SECONDARY,
    fontWeight: '600',
  },
  settingsGrid: {
    flexDirection: 'row',
    gap: 32,
    flexWrap: 'wrap',
  },
  settingCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    padding: 32,
    width: '48%',
    minWidth: 320,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  settingTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.PRIMARY,
    letterSpacing: -0.2,
  },
  settingDescription: {
    fontSize: 15,
    color: '#64748b',
    lineHeight: 22,
    marginBottom: 20,
    fontWeight: '400',
  },
  settingControl: {
    alignItems: 'flex-start',
  },
  supportGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
  },
  supportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 24,
    width: '48%',
    minWidth: 320,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  supportIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.PRIMARY,
    marginBottom: 4,
    flex: 1,
  },
  supportDescription: {
    fontSize: 14,
    color: '#64748b',
    flex: 1,
  },
  logoutSection: {
    paddingVertical: 40,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    backgroundColor: Colors.WHITE,
    borderRadius: 20,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 2,
    borderColor: Colors.ERROR + '20',
  },
  logoutContent: {
    flex: 1,
  },
  logoutTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.ERROR,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  logoutDescription: {
    fontSize: 15,
    color: '#64748b',
    fontWeight: '400',
  },
  versionSection: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  versionText: {
    fontSize: 16,
    color: Colors.PRIMARY,
    fontWeight: '600',
  },
  versionSubtext: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '400',
  },
});