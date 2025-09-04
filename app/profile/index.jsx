import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TextInput,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Settings, Bell, Shield, CircleHelp as HelpCircle, LogOut, ChevronRight, CreditCard as Edit2 } from 'lucide-react-native';
import Colors from '../../constant/Colors';
import WebLayout from '../../components/WebLayout';

export default function ProfileScreen() {
  if (Platform.OS === 'web') {
    return (
      <WebLayout>
        <ScrollView style={styles.webContainer} showsVerticalScrollIndicator={false}>
          {/* Profile Header */}
          <View style={styles.webProfileHeader}>
            <View style={styles.webProfileContent}>
              <View style={styles.webProfileImageSection}>
                <Image 
                  source={{ uri: 'https://randomuser.me/api/portraits/lego/1.jpg' }} 
                  style={styles.webProfileImage} 
                />
                <TouchableOpacity style={styles.webChangePhotoButton}>
                  <Text style={styles.webChangePhotoText}>Change Photo</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.webProfileInfo}>
                <Text style={styles.webProfileName}>{userData.name}</Text>
                <Text style={styles.webProfileRole}>Cal State LA Student</Text>
                <Text style={styles.webProfileEmail}>{userData.email}</Text>
              </View>
            </View>
          </View>

          {/* Profile Information */}
          <View style={styles.webSection}>
            <Text style={styles.webSectionTitle}>Profile Information</Text>
            {renderWebProfileInfo()}
          </View>

          {/* Settings */}
          <View style={styles.webSection}>
            <Text style={styles.webSectionTitle}>Settings</Text>
            <View style={styles.webSettingsGrid}>
              <View style={styles.webSettingCard}>
                <Bell size={24} color={Colors.PRIMARY} />
                <Text style={styles.webSettingTitle}>Notifications</Text>
                <Switch
                  trackColor={{ false: '#e2e8f0', true: Colors.PRIMARY + '40' }}
                  thumbColor={notificationsEnabled ? Colors.PRIMARY : '#9ca3af'}
                  onValueChange={setNotificationsEnabled}
                  value={notificationsEnabled}
                />
              </View>
              
              <View style={styles.webSettingCard}>
                <Shield size={24} color={Colors.PRIMARY} />
                <Text style={styles.webSettingTitle}>Data Sharing</Text>
                <Switch
                  trackColor={{ false: '#e2e8f0', true: Colors.PRIMARY + '40' }}
                  thumbColor={dataSharing ? Colors.PRIMARY : '#9ca3af'}
                  onValueChange={setDataSharing}
                  value={dataSharing}
                />
              </View>
            </View>
          </View>

          {/* Support */}
          <View style={styles.webSection}>
            <Text style={styles.webSectionTitle}>Support</Text>
            <View style={styles.webSupportGrid}>
              <TouchableOpacity style={styles.webSupportCard}>
                <Text style={styles.webSupportText}>Help Center</Text>
                <ChevronRight size={20} color="#64748b" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.webSupportCard}>
                <Text style={styles.webSupportText}>Privacy Policy</Text>
                <ChevronRight size={20} color="#64748b" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.webSupportCard}>
                <Text style={styles.webSupportText}>Terms of Service</Text>
                <ChevronRight size={20} color="#64748b" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.webSupportCard}>
                <Text style={styles.webSupportText}>About WeGoToCalStateLA</Text>
                <ChevronRight size={20} color="#64748b" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Logout */}
          <View style={styles.webLogoutSection}>
            <TouchableOpacity 
              style={styles.webLogoutButton}
              onPress={handleLogout}
            >
              <LogOut size={20} color="#ef4444" />
              <Text style={styles.webLogoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </WebLayout>
    );
  }

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

  const renderProfileInfo = () => {
    if (isEditing) {
      return (
        <View style={styles.editForm}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.textInput}
              value={userData.name}
              onChangeText={(text) => setUserData({...userData, name: text})}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.textInput}
              value={userData.email}
              keyboardType="email-address"
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
            <Text style={styles.inputLabel}>Year</Text>
            <TextInput
              style={styles.textInput}
              value={userData.year}
              onChangeText={(text) => setUserData({...userData, year: text})}
            />
          </View>
          
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSaveProfile}
          >
            <LinearGradient
              colors={[Colors.PRIMARY, Colors.DARK_BLUE]}
              style={styles.saveButtonGradient}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      );
    }
    
    return (
      <View style={styles.profileInfo}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Name</Text>
          <Text style={styles.infoValue}>{userData.name}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{userData.email}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Student ID</Text>
          <Text style={styles.infoValue}>{userData.studentId}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Major</Text>
          <Text style={styles.infoValue}>{userData.major}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Year</Text>
          <Text style={styles.infoValue}>{userData.year}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Joined</Text>
          <Text style={styles.infoValue}>{userData.joinedDate}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => setIsEditing(true)}
        >
          <LinearGradient
            colors={[Colors.SECONDARY, Colors.DARK_GOLD]}
            style={styles.editButtonGradient}
          >
            <Edit2 size={16} color={Colors.WHITE} />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[Colors.PRIMARY, Colors.DARK_BLUE]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.profileImageContainer}>
            <Image 
              source={{ uri: 'https://randomuser.me/api/portraits/lego/1.jpg' }} 
              style={styles.profileImage} 
            />
            <TouchableOpacity style={styles.changePhotoButton}>
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>{userData.name}</Text>
          <Text style={styles.profileRole}>Cal State LA Student</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <User size={20} color={Colors.PRIMARY} />
            <Text style={styles.sectionTitle}>Profile Information</Text>
          </View>
          {renderProfileInfo()}
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Settings size={20} color={Colors.PRIMARY} />
            <Text style={styles.sectionTitle}>Settings</Text>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Bell size={20} color={Colors.TEXT_SECONDARY} />
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <Switch
              trackColor={{ false: Colors.LIGHT_GRAY, true: Colors.PRIMARY_LIGHT }}
              thumbColor={notificationsEnabled ? Colors.PRIMARY : Colors.GRAY}
              onValueChange={setNotificationsEnabled}
              value={notificationsEnabled}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Settings size={20} color={Colors.TEXT_SECONDARY} />
              <Text style={styles.settingText}>Dark Mode</Text>
            </View>
            <Switch
              trackColor={{ false: Colors.LIGHT_GRAY, true: Colors.PRIMARY_LIGHT }}
              thumbColor={darkModeEnabled ? Colors.PRIMARY : Colors.GRAY}
              onValueChange={setDarkModeEnabled}
              value={darkModeEnabled}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Shield size={20} color={Colors.TEXT_SECONDARY} />
              <Text style={styles.settingText}>Data Sharing</Text>
            </View>
            <Switch
              trackColor={{ false: Colors.LIGHT_GRAY, true: Colors.PRIMARY_LIGHT }}
              thumbColor={dataSharing ? Colors.PRIMARY : Colors.GRAY}
              onValueChange={setDataSharing}
              value={dataSharing}
            />
          </View>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <HelpCircle size={20} color={Colors.PRIMARY} />
            <Text style={styles.sectionTitle}>Support</Text>
          </View>
          
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Help Center</Text>
            <ChevronRight size={20} color={Colors.TEXT_SECONDARY} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Privacy Policy</Text>
            <ChevronRight size={20} color={Colors.TEXT_SECONDARY} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Terms of Service</Text>
            <ChevronRight size={20} color={Colors.TEXT_SECONDARY} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>About WeGoToCalStateLA</Text>
            <ChevronRight size={20} color={Colors.TEXT_SECONDARY} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <LogOut size={20} color={Colors.ERROR} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: 'center',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.WHITE,
  },
  changePhotoButton: {
    marginTop: 8,
  },
  changePhotoText: {
    color: Colors.WHITE,
    fontSize: 14,
    fontWeight: '500',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.WHITE,
    marginBottom: 5,
  },
  profileRole: {
    fontSize: 16,
    color: Colors.WHITE_OPACITY_80,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: Colors.WHITE,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.TEXT,
    marginLeft: 10,
  },
  profileInfo: {
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.LIGHT_GRAY,
  },
  infoLabel: {
    fontSize: 16,
    color: Colors.TEXT_SECONDARY,
  },
  infoValue: {
    fontSize: 16,
    color: Colors.TEXT,
    fontWeight: '500',
  },
  editButton: {
    marginTop: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  editButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  editButtonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  editForm: {
    marginTop: 10,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: Colors.TEXT_SECONDARY,
    marginBottom: 5,
  },
  textInput: {
    backgroundColor: Colors.LIGHT_GRAY,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.TEXT,
  },
  saveButton: {
    marginTop: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  saveButtonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.LIGHT_GRAY,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    color: Colors.TEXT,
    marginLeft: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.LIGHT_GRAY,
  },
  menuText: {
    fontSize: 16,
    color: Colors.TEXT,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.WHITE,
    borderRadius: 15,
    padding: 18,
    marginBottom: 20,
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.ERROR,
    marginLeft: 10,
  },
  versionContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  versionText: {
    fontSize: 14,
    color: Colors.TEXT_SECONDARY,
  },
});