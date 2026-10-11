import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Phone, MessageSquare, Shield, ChevronRight, Bookmark } from 'lucide-react-native';
import { Colors } from '../../constant/Colors';
import { isWeb, width } from '../../utils/responsive';
import WebLayout from '../../components/WebLayout';
import { resourceCategories } from '../../constant/ResourceCategories';
import { useSavedResources } from '../../hooks/useSavedResources';

// removed unused screenWidth

const emergencyContacts = [
  { title: 'Crisis Text Line', detail: 'Text HOME to 741741', icon: MessageSquare },
  { title: 'Suicide & Crisis Lifeline', detail: 'Call 988', icon: Phone },
  { title: 'Campus Safety', detail: '(323) 343-3700', icon: Shield },
];

function EmergencyBar({ style }) {
  return (
    <View style={[styles.emergencyBar, style]}>
      <View style={styles.emergencyBarLabel}>
        <Text style={styles.emergencyBarLabelText}>Experiencing an emergency?</Text>
      </View>
      <View style={styles.emergencyBarItems}>
        {emergencyContacts.map((contact, index) => (
          <View key={contact.title} style={styles.emergencyBarItem}>
            {index > 0 && width >= 640 && <Text style={styles.emergencyBarDivider}>|</Text>}
            <contact.icon size={14} color={Colors.ERROR} />
            <Text style={styles.emergencyBarText}>
              <Text style={styles.emergencyBarTitle}>{contact.title}: </Text>
              {contact.detail}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function ResourceScreen() {
const { savedIds } = useSavedResources();
  


  // campusServices array removed (unused)

  if (isWeb) {
    return (
      <WebLayout>
        <ScrollView style={styles.webContainer} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.webHeaderSection}>
            <View style={styles.webHeaderContent}>
              <Text style={styles.webHeaderTitle}>Family & Community Resources</Text>
              <Text style={styles.webHeaderSubtitle}>
                Find trusted services and information to help you support your student
              </Text>
            </View>
          </View>

                    {/* Emergency Contacts */}
          <EmergencyBar style={styles.webEmergencyBar} />

          {/* Resource Categories */}
          <View style={styles.webSection}>
            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.webSectionTitle, styles.sectionHeaderTitle]}>Wellness Resources</Text>
              <TouchableOpacity
                style={styles.savedLink}
                onPress={() => router.push('/resources/saved')}
              >
                <Bookmark size={20} color={Colors.PRIMARY} />
                <Text style={styles.savedLinkText}>Saved Resources ({savedIds.length})</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.webCategoriesGrid}>
              {resourceCategories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={styles.webCategoryCard}
                  onPress={() => router.push(`/resources/${category.id}`)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.webCategoryIcon, { backgroundColor: category.color + '20' }]}>
                    <category.icon size={32} color={category.color} />
                  </View>
                  
                  <View style={styles.webCategoryContent}>
                    <Text style={styles.webCategoryTitle}>{category.title}</Text>
                    <Text style={styles.webCategoryDescription}>{category.description}</Text>
                  </View>
                  
                  <ChevronRight size={24} color="#64748b" />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Support Information */}
          <View style={styles.webSupportSection}>
            <View style={styles.webSupportCard}>
              <Text style={styles.webSupportTitle}>Need Additional Support?</Text>
              <Text style={styles.webSupportText}>
                Cal State LA Student Health & Psychological Services offers comprehensive mental health support:
              </Text>
              <View style={styles.webSupportDetails}>
                <Text style={styles.webSupportItem}>• Individual counseling sessions</Text>
                <Text style={styles.webSupportItem}>• Group therapy programs</Text>
                <Text style={styles.webSupportItem}>• Crisis intervention services</Text>
                <Text style={styles.webSupportItem}>• Psychiatric services</Text>
              </View>
              <View style={styles.webContactInfo}>
                <Text style={styles.webContactTitle}>Contact Information:</Text>
                <Text style={styles.webContactDetails}>Phone: (323) 343-3300</Text>
                <Text style={styles.webContactDetails}>Location: Health Center, Room 110</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </WebLayout>
    );
  }

  // Mobile version (existing code)
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[Colors.PRIMARY, Colors.DARK_BLUE]}
        style={styles.header}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={Colors.WHITE} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Family & Community Resources</Text>
          <View style={styles.headerSpacer} />
        </View>
        <Text style={styles.headerSubtitle}>
          Find trusted services and information to help you support your student
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.contentPadding}>
          {/* Welcome Message */}
          <View style={styles.welcomeCard}>
            <Text style={styles.welcomeTitle}>Resources for families and supporters</Text>
            <Text style={styles.welcomeText}>
              Access comprehensive support services designed specifically for Golden Eagles. 
              Explore campus and community services that can help your student and family navigate the university journey.
            </Text>
          </View>

          {/* Emergency Contacts */}
          <EmergencyBar style={styles.mobileEmergencyBar} />

          {/* Resource Categories */}
            <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, styles.sectionHeaderTitle]}>Wellness Resources</Text>
            <TouchableOpacity
              style={styles.savedLink}
              onPress={() => router.push('/resources/saved')}
            >
              <Bookmark size={20} color={Colors.PRIMARY} />
              <Text style={styles.savedLinkText}>Saved Resources ({savedIds.length})</Text>
            </TouchableOpacity>
          </View>
          {resourceCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryCard}
              onPress={() => router.push(`/resources/${category.id}`)}
              activeOpacity={0.8}
            >
              <View style={[styles.categoryIconContainer, { backgroundColor: category.color + '20' }]}>
                <category.icon size={32} color={category.color} />
              </View>
              
              <View style={styles.categoryContent}>
                <Text style={styles.categoryTitle}>{category.title}</Text>
                <Text style={styles.categoryDescription}>{category.description}</Text>
              </View>
              
              <View style={styles.categoryArrow}>
                <ChevronRight size={24} color={Colors.GRAY} />
              </View>
            </TouchableOpacity>
          ))}

          {/* Additional Support */}
          <View style={styles.supportCard}>
            <Text style={styles.supportTitle}>Need Additional Support?</Text>
            <Text style={styles.supportText}>
              Cal State LA Student Health & Psychological Services offers comprehensive mental health support:
            </Text>
            <View style={styles.supportDetails}>
              <Text style={styles.supportItem}>• Individual counseling sessions</Text>
              <Text style={styles.supportItem}>• Group therapy programs</Text>
              <Text style={styles.supportItem}>• Crisis intervention services</Text>
              <Text style={styles.supportItem}>• Psychiatric services</Text>
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>Contact Information:</Text>
              <Text style={styles.contactDetails}>Phone: (323) 343-3300</Text>
              <Text style={styles.contactDetails}>Location: Health Center, Room 110</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    sectionHeaderRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 24,
  },
  sectionHeaderTitle: {
    marginBottom: 0,
  },
  savedLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 48,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.PRIMARY,
    backgroundColor: 'white',
  },
  savedLinkText: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.PRIMARY,
  },
    emergencyBar: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 8,
    overflow: 'hidden',
  },
  emergencyBarLabel: {
    backgroundColor: Colors.ERROR,
    justifyContent: 'center',
    paddingHorizontal: width < 640 ? 8 : 12,
    maxWidth: width < 640 ? 96 : undefined,
  },
  emergencyBarLabelText: {
    color: Colors.WHITE,
    fontSize: width < 640 ? 11 : 13,
    fontWeight: '800',
    textAlign: 'center'
  },
  emergencyBarItems: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    columnGap: 12,
    rowGap: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  emergencyBarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  emergencyBarDivider: {
    color: '#fca5a5',
    marginRight: 6,
  },
  emergencyBarText: {
    flexShrink: 1,
    fontSize: 13,
    color: '#1e293b',
  },
  emergencyBarTitle: {
    fontWeight: '700',
  },
  webEmergencyBar: {
    marginHorizontal: width < 640 ? 16 : width < 1024 ? 24 : 32,
    marginBottom: width < 640 ? 16 : width < 1024 ? 20 : 24,
  },
  mobileEmergencyBar: {
    marginBottom: 24,
  },
  // Web Styles
  /* duplicate webContainer removed */
  webHeroSection: {
    paddingVertical: width < 640 ? 60 : width < 1024 ? 80 : 100,
    paddingHorizontal: width < 640 ? 16 : width < 1024 ? 32 : 60,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  webHeroContent: {
    flexDirection: width < 1024 ? 'column' : 'row',
    alignItems: 'center',
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    gap: width < 640 ? 40 : width < 1024 ? 60 : 80,
  },
  webHeroText: {
    flex: 1,
  },
  webHeroTitle: {
    fontSize: width < 640 ? 32 : width < 1024 ? 42 : 48,
    fontWeight: '800',
    color: Colors.PRIMARY,
    textAlign: width < 1024 ? 'center' : 'left',
    marginBottom: width < 640 ? 20 : 24,
    letterSpacing: -1,
    lineHeight: width < 640 ? 40 : width < 1024 ? 50 : 56,
  },
  webHeroSubtitle: {
    fontSize: width < 640 ? 18 : 20,
    color: '#64748b',
    textAlign: width < 1024 ? 'center' : 'left',
    lineHeight: width < 640 ? 28 : 32,
    marginBottom: 40,
    fontWeight: '400',
  },
  webHeroStats: {
    flexDirection: width < 640 ? 'column' : 'row',
    gap: width < 640 ? 24 : 40,
    alignItems: 'center',
  },
  webHeroStat: {
    alignItems: 'center',
  },
  webHeroStatNumber: {
    fontSize: width < 640 ? 28 : 32,
    fontWeight: '800',
    color: Colors.PRIMARY,
    marginBottom: 8,
    letterSpacing: -1,
  },
  webHeroStatLabel: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    fontWeight: '500',
  },
  webHeroVisual: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webHeroCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: width < 640 ? 32 : 48,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.1,
    shadowRadius: 32,
    elevation: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  webHeroCardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.PRIMARY,
    marginTop: 24,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  webHeroCardText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
  },
  webEmergencySection: {
    backgroundColor: '#fef2f2',
    paddingVertical: width < 640 ? 60 : 80,
    paddingHorizontal: width < 640 ? 16 : width < 1024 ? 32 : 60,
  },
  webSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 48,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  webSectionTitleContainer: {
    flex: 1,
  },
  webSectionTitle: {
    fontSize: width < 640 ? 28 : width < 1024 ? 32 : 36,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  webSectionDescription: {
    fontSize: 18,
    color: '#64748b',
    lineHeight: 28,
    fontWeight: '400',
  },
  /* duplicate webEmergency styles removed to satisfy lint */
  webServicesSection: {
    paddingVertical: width < 640 ? 60 : 80,
    paddingHorizontal: width < 640 ? 16 : width < 1024 ? 32 : 60,
    backgroundColor: 'white',
  },
  webServicesGrid: {
    flexDirection: width < 768 ? 'column' : 'row',
    gap: width < 640 ? 20 : 32,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  webServiceCard: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    padding: width < 640 ? 24 : 32,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 4,
    minWidth: width < 640 ? 0 : 320,
  },
  webServiceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  webServiceIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webServiceTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    flex: 1,
    letterSpacing: -0.2,
  },
  webServiceDescription: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 24,
    marginBottom: 24,
  },
  webServiceDetails: {
    gap: 12,
    marginBottom: 24,
  },
  webServiceDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  webServiceDetailText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  webServiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  webServiceButtonText: {
    fontSize: 14,
    color: Colors.PRIMARY,
    fontWeight: '600',
  },
  webCategoriesSection: {
    backgroundColor: '#f8fafc',
    paddingVertical: width < 640 ? 60 : 80,
    paddingHorizontal: width < 640 ? 16 : width < 1024 ? 32 : 60,
  },
  /* duplicate webCategories styles removed to satisfy lint; keeping footer/action below */
  webCategoryFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  webCategoryAction: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.PRIMARY,
  },
  
  // Mobile Styles (existing)
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT_GRAY,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.WHITE + '20',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.WHITE,
  },
  headerSpacer: {
    width: 40,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.LIGHT_GOLD,
    textAlign: 'center',
    marginTop: 8,
  },
  content: {
    flex: 1,
  },
  contentPadding: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  welcomeCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: 16,
    padding: 24,
    marginTop: 20,
    marginBottom: 24,
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
    color: Colors.DARK_GRAY,
    lineHeight: 24,
  },
  emergencySection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    marginBottom: 16,
  },
  emergencyCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: Colors.ERROR,
  },
  emergencyIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.ERROR + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  emergencyContent: {
    flex: 1,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    marginBottom: 2,
  },
  emergencySubtitle: {
    fontSize: 14,
    color: Colors.GRAY,
    fontWeight: '600',
  },
  categoryCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
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
  categoryIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryContent: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    marginBottom: 6,
  },
  categoryDescription: {
    fontSize: 14,
    color: Colors.GRAY,
    lineHeight: 20,
  },
  categoryArrow: {
    marginLeft: 12,
  },
  supportCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: 16,
    padding: 24,
    marginTop: 20,
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: Colors.INFO,
  },
  supportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    marginBottom: 12,
  },
  supportText: {
    fontSize: 16,
    color: Colors.DARK_GRAY,
    lineHeight: 24,
    marginBottom: 16,
  },
  supportDetails: {
    marginBottom: 20,
  },
  supportItem: {
    fontSize: 14,
    color: Colors.GRAY,
    lineHeight: 20,
    marginBottom: 4,
  },
  contactInfo: {
    backgroundColor: Colors.PRIMARY + '10',
    borderRadius: 12,
    padding: 16,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    marginBottom: 8,
  },
  contactDetails: {
    fontSize: 14,
    color: Colors.DARK_GRAY,
    marginBottom: 2,
  },
  
  // Web Styles
  webContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  webHeaderSection: {
    backgroundColor: 'white',
    paddingVertical: width < 640 ? 40 : width < 1024 ? 60 : 80,
    paddingHorizontal: width < 640 ? 16 : width < 1024 ? 32 : 60,
    marginHorizontal: width < 640 ? 16 : width < 1024 ? 24 : 32,
    marginBottom: width < 640 ? 16 : width < 1024 ? 20 : 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  webHeaderContent: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    alignItems: 'center',
  },
  webHeaderTitle: {
    fontSize: width < 640 ? 32 : width < 1024 ? 42 : 56,
    fontWeight: '900',
    color: Colors.PRIMARY,
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -1.5,
  },
  webHeaderSubtitle: {
    fontSize: width < 640 ? 16 : 18,
    color: Colors.SECONDARY,
    textAlign: 'center',
    fontWeight: '500',
  },
  webSection: {
    backgroundColor: 'white',
    paddingVertical: width < 640 ? 40 : width < 1024 ? 50 : 60,
    paddingHorizontal: width < 640 ? 16 : width < 1024 ? 32 : 60,
    marginHorizontal: width < 640 ? 16 : width < 1024 ? 24 : 32,
    marginBottom: width < 640 ? 16 : width < 1024 ? 20 : 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  /* duplicate webSectionTitle removed */
  webEmergencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: width < 640 ? 16 : width < 1024 ? 20 : 24,
    maxWidth: 1200,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  webEmergencyCard: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: width < 640 ? 16 : width < 1024 ? 20 : 24,
    width: width < 640 ? '100%' : '31%',
    minWidth: width < 640 ? 0 : 250,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderLeftWidth: 4,
    borderLeftColor: Colors.ERROR,
    gap: 16,
  },
  webEmergencyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.ERROR + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  webEmergencyContent: {
    flex: 1,
  },
  webEmergencyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.PRIMARY,
    marginBottom: 4,
  },
  webEmergencySubtitle: {
    fontSize: 14,
    color: Colors.ERROR,
    fontWeight: '600',
  },
  webCategoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: width < 640 ? 16 : width < 1024 ? 20 : 24,
    maxWidth: 1200,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  webCategoryCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: width < 640 ? 20 : width < 1024 ? 24 : 28,
    width: width < 640 ? '100%' : '48%',
    minWidth: width < 640 ? 0 : 350,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
    gap: 16,
  },
  webCategoryIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webCategoryContent: {
    flex: 1,
  },
  webCategoryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.PRIMARY,
    marginBottom: 8,
  },
  webCategoryDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  webSupportSection: {
    paddingVertical: 40,
    paddingHorizontal: width < 640 ? 16 : width < 1024 ? 32 : 60,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  webSupportCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: width < 640 ? 24 : width < 1024 ? 28 : 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  webSupportTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.PRIMARY,
    marginBottom: 16,
  },
  webSupportText: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 24,
    marginBottom: 20,
  },
  webSupportDetails: {
    marginBottom: 24,
  },
  webSupportItem: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 8,
  },
  webContactInfo: {
    backgroundColor: Colors.PRIMARY + '10',
    borderRadius: 12,
    padding: 16,
  },
  webContactTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.PRIMARY,
    marginBottom: 8,
  },
  webContactDetails: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
});
