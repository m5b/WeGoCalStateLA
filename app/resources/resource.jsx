import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowLeft,
  Brain,
  Heart,
  Briefcase,
  DollarSign,
  Phone,
  MessageSquare,
  Shield,
  ChevronRight
} from 'lucide-react-native';
import Colors from '../../constant/Colors';

const { width } = Dimensions.get('window');

export default function ResourceScreen() {
  const resourceCategories = [
    {
      id: 'mental',
      title: 'Mental Health Resources',
      description: 'Counseling, therapy, and mental health support services',
      icon: Brain,
      color: Colors.PRIMARY,
      route: '/resources/mental_res'
    },
    {
      id: 'physical',
      title: 'Physical Wellness',
      description: 'Fitness, nutrition, and physical health resources',
      icon: Heart,
      color: Colors.ERROR,
      route: '/resources/physical_res'
    },
    {
      id: 'career',
      title: 'Career Services',
      description: 'Job search, career counseling, and professional development',
      icon: Briefcase,
      color: Colors.INFO,
      route: '/resources/career_res'
    },
    {
      id: 'financial',
      title: 'Financial Resources',
      description: 'Financial aid, budgeting, and money management support',
      icon: DollarSign,
      color: Colors.SECONDARY,
      route: '/resources/financial_res'
    }
  ];

  const emergencyContacts = [
    {
      title: 'Crisis Text Line',
      subtitle: 'Text HOME to 741741',
      icon: MessageSquare,
      action: () => {}
    },
    {
      title: 'Suicide & Crisis Lifeline',
      subtitle: 'Call 988',
      icon: Phone,
      action: () => {}
    },
    {
      title: 'Campus Safety',
      subtitle: '(323) 343-3700',
      icon: Shield,
      action: () => {}
    }
  ];

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
          <Text style={styles.headerTitle}>Resources</Text>
          <View style={styles.headerSpacer} />
        </View>
        <Text style={styles.headerSubtitle}>
          Find support and guidance for your wellness journey
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.contentPadding}>
          {/* Welcome Message */}
          <View style={styles.welcomeCard}>
            <Text style={styles.welcomeTitle}>Cal State LA Student Resources</Text>
            <Text style={styles.welcomeText}>
              Access comprehensive support services designed specifically for Golden Eagles. 
              From mental health counseling to career guidance, we're here to help you succeed.
            </Text>
          </View>

          {/* Emergency Contacts */}
          <View style={styles.emergencySection}>
            <Text style={styles.sectionTitle}>Emergency Contacts</Text>
            {emergencyContacts.map((contact, index) => (
              <TouchableOpacity
                key={index}
                style={styles.emergencyCard}
                onPress={contact.action}
                activeOpacity={0.8}
              >
                <View style={styles.emergencyIconContainer}>
                  <contact.icon size={24} color={Colors.ERROR} />
                </View>
                <View style={styles.emergencyContent}>
                  <Text style={styles.emergencyTitle}>{contact.title}</Text>
                  <Text style={styles.emergencySubtitle}>{contact.subtitle}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Resource Categories */}
          <Text style={styles.sectionTitle}>Resource Categories</Text>
          {resourceCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryCard}
              onPress={() => router.push(category.route)}
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
});