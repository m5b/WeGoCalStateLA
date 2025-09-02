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
import {
  User,
  Settings,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Edit2,
  Save,
  Mail,
  GraduationCap,
  Calendar,
  Award,
  Activity,
  Target,
  TrendingUp,
  Heart,
  Brain,
  Moon,
  CheckCircle,
  Star,
  Trophy,
} from 'lucide-react-native';
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
    { label: 'Check-ins Completed', value: '28', icon: CheckCircle, color: Colors.SUCCESS },
    { label: 'Wellness Score', value: '85%', icon: Star, color: Colors.PRIMARY },
    { label: 'Assessments Taken', value: '5', icon: Brain, color: Colors.INFO },
    { label: 'Days Active', value: '42', icon: Activity, color: Colors.SECONDARY },
  ];

  const recentActivity = [
    { type: 'Daily Check-in', date: 'Today', status: 'completed', color: Colors.SUCCESS },
    { type: 'PHQ-9 Assessment', date: 'Yesterday', status: 'completed', color: Colors.INFO },
    { type: 'Daily Check-in', date: '2 days ago', status: 'completed', color: Colors.SUCCESS },
    { type: 'GAD-7 Assessment', date: '3 days ago', status: 'completed', color: Colors.WARNING },
  ];

  const achievements = [
    { title: 'First Check-in', description: 'Completed your first daily check-in', icon: Trophy, earned: true },
    { title: 'Week Warrior', description: 'Completed check-ins for 7 consecutive days', icon: Award, earned: true },
    { title: 'Assessment Pro', description: 'Completed 5 mental health assessments', icon: Brain, earned: true },
    { title: 'Wellness Champion', description: 'Maintained 80%+ wellness score for a month', icon: Star, earned: false },
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
          colors={[Colors.PRIMARY, Colors.DARK_BLUE]}
          style={styles.heroSection}
        >
          <View style={styles.heroContent}>
            <View style={styles.profileHeader}>
              <View style={styles.profileImageContainer}>
                <View style={styles.profileImage}>
                  <User size={60} color={Colors.WHITE} />
                </View>
                <TouchableOpacity style={styles.changePhotoButton}>
                  <Text style={styles.changePhotoText}>Change Photo</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{userData.name}</Text>
                <Text style={styles.profileRole}>{userData.major} • {userData.year}</Text>
                <Text style={styles.profileEmail}>{userData.email}</Text>
                <View style={styles.profileMeta}>
                  <View style={styles.metaItem}>
                    <Calendar size={16} color={Colors.WHITE + 'CC'} />
                    <Text style={styles.metaText}>Joined {userData.joinedDate}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <GraduationCap size={16} color={Colors.WHITE + 'CC'} />
                    <Text style={styles.metaText}>ID: {userData.studentId}</Text>
                  </View>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.editProfileButton}
                onPress={() => setIsEditing(!isEditing)}
              >
                <Edit2 size={20} color={Colors.PRIMARY} />
                <Text style={styles.editProfileText}>
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.mainContent}>
          {/* Wellness Dashboard */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Activity size={24} color={Colors.PRIMARY} />
              <Text style={styles.sectionTitle}>Wellness Dashboard</Text>
            </View>
            
            <View style={styles.statsGrid}>
              {wellnessStats.map((stat, index) => {
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

          {/* Profile Information */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <User size={24} color={Colors.PRIMARY} />
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
                    />
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Email Address</Text>
                    <TextInput
                      style={styles.textInput}
                      value={userData.email}
                      onChangeText={(text) => setUserData({...userData, email: text})}
                    />
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Major</Text>
                    <TextInput
                      style={styles.textInput}
                      value={userData.major}
                      onChangeText={(text) => setUserData({...userData, major: text})}
                    />
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Academic Year</Text>
                    <TextInput
                      style={styles.textInput}
                      value={userData.year}
                      onChangeText={(text) => setUserData({...userData, year: text})}
                    />
                  </View>
                </View>
                
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                  <LinearGradient
                    colors={[Colors.SUCCESS, Colors.SUCCESS + 'DD']}
                    style={styles.saveButtonGradient}
                  >
                    <Save size={20} color={Colors.WHITE} />
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.infoGrid}>
                <View style={styles.infoCard}>
                  <Mail size={20} color={Colors.PRIMARY} />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Email</Text>
                    <Text style={styles.infoValue}>{userData.email}</Text>
                  </View>
                </View>
                
                <View style={styles.infoCard}>
                  <GraduationCap size={20} color={Colors.PRIMARY} />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Student ID</Text>
                    <Text style={styles.infoValue}>{userData.studentId}</Text>
                  </View>
                </View>
                
                <View style={styles.infoCard}>
                  <User size={20} color={Colors.PRIMARY} />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Major</Text>
                    <Text style={styles.infoValue}>{userData.major}</Text>
                  </View>
                </View>
                
                <View style={styles.infoCard}>
                  <Calendar size={20} color={Colors.PRIMARY} />
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
              <TrendingUp size={24} color={Colors.PRIMARY} />
              <Text style={styles.sectionTitle}>Recent Activity</Text>
            </View>
            
            <View style={styles.activityList}>
              {recentActivity.map((activity, index) => (
                <View key={index} style={styles.activityItem}>
                  <View style={[styles.activityDot, { backgroundColor: activity.color }]} />
                  <View style={styles.activityContent}>
                    <Text style={styles.activityType}>{activity.type}</Text>
                    <Text style={styles.activityDate}>{activity.date}</Text>
                  </View>
                  <View style={[styles.activityStatus, { backgroundColor: activity.color + '15' }]}>
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
              <Trophy size={24} color={Colors.PRIMARY} />
              <Text style={styles.sectionTitle}>Achievements</Text>
            </View>
            
            <View style={styles.achievementsGrid}>
              {achievements.map((achievement, index) => {
                const IconComponent = achievement.icon;
                return (
                  <View key={index} style={[
                    styles.achievementCard,
                    !achievement.earned && styles.achievementLocked
                  ]}>
                    <View style={[
                      styles.achievementIcon,
                      { backgroundColor: achievement.earned ? Colors.SECONDARY + '15' : Colors.GRAY + '15' }
                    ]}>
                      <IconComponent 
                        size={24} 
                        color={achievement.earned ? Colors.SECONDARY : Colors.GRAY} 
                      />
                    </View>
                    <Text style={[
                      styles.achievementTitle,
                      !achievement.earned && { color: Colors.GRAY }
                    ]}>
                      {achievement.title}
                    </Text>
                    <Text style={[
                      styles.achievementDescription,
                      !achievement.earned && { color: Colors.GRAY }
                    ]}>
                      {achievement.description}
                    </Text>
                    {achievement.earned && (
                      <View style={styles.earnedBadge}>
                        <CheckCircle size={16} color={Colors.SUCCESS} />
                        <Text style={styles.earnedText}>Earned</Text>
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
              <Settings size={24} color={Colors.PRIMARY} />
              <Text style={styles.sectionTitle}>Settings & Preferences</Text>
            </View>
            
            <View style={styles.settingsList}>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Bell size={20} color={Colors.PRIMARY} />
                  <Text style={styles.settingText}>Push Notifications</Text>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: Colors.LIGHT_GRAY, true: Colors.PRIMARY + '40' }}
                  thumbColor={notificationsEnabled ? Colors.PRIMARY : Colors.GRAY}
                />
              </View>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Shield size={20} color={Colors.PRIMARY} />
                  <Text style={styles.settingText}>Data Sharing for Research</Text>
                </View>
                <Switch
                  value={dataSharing}
                  onValueChange={setDataSharing}
                  trackColor={{ false: Colors.LIGHT_GRAY, true: Colors.PRIMARY + '40' }}
                  thumbColor={dataSharing ? Colors.PRIMARY : Colors.GRAY}
                />
              </View>
            </View>
          </View>

          {/* Support & Help */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <HelpCircle size={24} color={Colors.PRIMARY} />
              <Text style={styles.sectionTitle}>Support & Help</Text>
            </View>
            
            <View style={styles.menuList}>
              <TouchableOpacity style={styles.menuItem}>
                <Text style={styles.menuText}>Help Center</Text>
                <ChevronRight size={20} color={Colors.GRAY} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.menuItem}>
                <Text style={styles.menuText}>Privacy Policy</Text>
                <ChevronRight size={20} color={Colors.GRAY} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.menuItem}>
                <Text style={styles.menuText}>Terms of Service</Text>
                <ChevronRight size={20} color={Colors.GRAY} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.menuItem}>
                <Text style={styles.menuText}>Contact Support</Text>
                <ChevronRight size={20} color={Colors.GRAY} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Logout */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color={Colors.ERROR} />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>

          {/* Version Info */}
          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>WeGo App v1.0.0</Text>
            <Text style={styles.versionText}>Cal State LA Mental Health Platform</Text>
          </View>
        </View>
      </ScrollView>
    </WebLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  heroSection: {
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  heroContent: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 40,
  },
  profileImageContainer: {
    alignItems: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.WHITE + '20',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.WHITE,
    marginBottom: 12,
  },
  changePhotoButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.WHITE + '20',
    borderRadius: 20,
  },
  changePhotoText: {
    color: Colors.WHITE,
    fontSize: 14,
    fontWeight: '500',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.WHITE,
    marginBottom: 8,
  },
  profileRole: {
    fontSize: 20,
    color: Colors.WHITE + 'DD',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: Colors.WHITE + 'CC',
    marginBottom: 16,
  },
  profileMeta: {
    flexDirection: 'row',
    gap: 24,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: Colors.WHITE + 'CC',
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  editProfileText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
  },
  mainContent: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 40,
    paddingBottom: 60,
  },
  section: {
    backgroundColor: Colors.WHITE,
    borderRadius: 20,
    padding: 32,
    marginBottom: 32,
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 24,
    flexWrap: 'wrap',
  },
  statCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: 16,
    padding: 24,
    width: '22%',
    minWidth: 200,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY,
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.GRAY,
    textAlign: 'center',
  },
  editForm: {
    // Edit form styles
  },
  formGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    marginBottom: 24,
  },
  inputGroup: {
    width: '48%',
    minWidth: 250,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.PRIMARY,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: Colors.LIGHT_GRAY,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.PRIMARY,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY,
  },
  saveButton: {
    alignSelf: 'flex-start',
    borderRadius: 12,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    gap: 8,
  },
  saveButtonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.LIGHT_GRAY + '50',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    minWidth: 250,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.GRAY,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.PRIMARY,
  },
  activityList: {
    gap: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.LIGHT_GRAY,
  },
  activityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  activityContent: {
    flex: 1,
  },
  activityType: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.PRIMARY,
    marginBottom: 2,
  },
  activityDate: {
    fontSize: 14,
    color: Colors.GRAY,
  },
  activityStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
    backgroundColor: Colors.WHITE,
    borderRadius: 16,
    padding: 20,
    width: '48%',
    minWidth: 280,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY,
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  achievementLocked: {
    opacity: 0.6,
  },
  achievementIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    marginBottom: 6,
  },
  achievementDescription: {
    fontSize: 14,
    color: Colors.GRAY,
    lineHeight: 20,
    marginBottom: 12,
  },
  earnedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  earnedText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.SUCCESS,
  },
  settingsList: {
    gap: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.LIGHT_GRAY,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    fontSize: 16,
    color: Colors.PRIMARY,
    fontWeight: '500',
  },
  menuList: {
    gap: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.LIGHT_GRAY,
  },
  menuText: {
    fontSize: 16,
    color: Colors.PRIMARY,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: Colors.WHITE,
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: Colors.ERROR + '30',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.ERROR,
  },
  versionContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  versionText: {
    fontSize: 14,
    color: Colors.GRAY,
    marginBottom: 4,
  },
});