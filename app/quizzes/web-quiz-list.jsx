import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Brain,
  Heart,
  ChevronRight,
  Clock,
  Users,
  Shield,
  CheckCircle,
  AlertCircle,
  Star,
  Award,
} from 'lucide-react-native';
import Colors from '../../constant/Colors';
import WebLayout from '../../components/WebLayout';

const { width } = Dimensions.get('window');

export default function WebQuizListScreen() {
  const quizzes = [
    {
      id: 'gad7',
      title: 'GAD-7 Anxiety Assessment',
      description: 'Generalized Anxiety Disorder 7-item scale to assess anxiety symptoms and their severity',
      longDescription: 'The GAD-7 is a validated screening tool used by healthcare professionals to identify probable cases of generalized anxiety disorder and assess symptom severity.',
      duration: '2-3 minutes',
      questions: '7 questions',
      icon: Brain,
      color: Colors.PRIMARY,
      route: '/quizzes/gad_7Disclaimer',
      difficulty: 'Easy',
      accuracy: '89%',
      completions: '2,847',
    },
    {
      id: 'phq9',
      title: 'PHQ-9 Depression Screening',
      description: 'Patient Health Questionnaire to screen for depression symptoms and monitor treatment progress',
      longDescription: 'The PHQ-9 is a multipurpose instrument for screening, diagnosing, monitoring and measuring the severity of depression.',
      duration: '3-4 minutes',
      questions: '9 questions',
      icon: Heart,
      color: Colors.ERROR,
      route: '/quizzes/phq_9Disclaimer',
      difficulty: 'Easy',
      accuracy: '91%',
      completions: '3,156',
    }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Confidential & Secure',
      description: 'Your responses are private and encrypted'
    },
    {
      icon: CheckCircle,
      title: 'Clinically Validated',
      description: 'Based on established psychological assessments'
    },
    {
      icon: Users,
      title: 'Professional Support',
      description: 'Connect with campus mental health resources'
    }
  ];

  const benefits = [
    'Get personalized insights about your mental health',
    'Track your progress over time with detailed analytics',
    'Receive tailored recommendations and resources',
    'Connect with appropriate campus support services',
    'Understand when to seek professional help',
  ];

  const handleQuizPress = (route) => {
    router.push(route);
  };

  return (
    <WebLayout>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <LinearGradient
          colors={[Colors.PRIMARY + '10', Colors.LIGHT_BLUE + '05']}
          style={styles.heroSection}
        >
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Mental Health Assessments</Text>
            <Text style={styles.heroSubtitle}>
              Take scientifically-backed assessments to better understand your mental health.
              These tools can help identify symptoms and guide you toward appropriate resources.
            </Text>
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>5,000+</Text>
                <Text style={styles.statLabel}>Assessments Completed</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>90%</Text>
                <Text style={styles.statLabel}>Accuracy Rate</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>24/7</Text>
                <Text style={styles.statLabel}>Available</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why Take These Assessments?</Text>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <View key={index} style={styles.featureCard}>
                  <View style={[styles.featureIcon, { backgroundColor: Colors.PRIMARY + '15' }]}>
                    <IconComponent size={24} color={Colors.PRIMARY} />
                  </View>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Assessments Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Assessments</Text>
          <View style={styles.quizzesContainer}>
            {quizzes.map((quiz, index) => {
              const IconComponent = quiz.icon;
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.quizCard}
                  onPress={() => handleQuizPress(quiz.route)}
                >
                  <View style={styles.quizHeader}>
                    <View style={[styles.quizIconContainer, { backgroundColor: quiz.color + '15' }]}>
                      <IconComponent size={32} color={quiz.color} />
                    </View>
                    <View style={styles.quizBadges}>
                      <View style={styles.badge}>
                        <Star size={12} color={Colors.SECONDARY} />
                        <Text style={styles.badgeText}>{quiz.accuracy}</Text>
                      </View>
                      <View style={styles.badge}>
                        <Users size={12} color={Colors.SUCCESS} />
                        <Text style={styles.badgeText}>{quiz.completions}</Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.quizContent}>
                    <Text style={styles.quizTitle}>{quiz.title}</Text>
                    <Text style={styles.quizDescription}>{quiz.description}</Text>
                    <Text style={styles.quizLongDescription}>{quiz.longDescription}</Text>
                    
                    <View style={styles.quizMeta}>
                      <View style={styles.metaItem}>
                        <Clock size={16} color={Colors.GRAY} />
                        <Text style={styles.metaText}>{quiz.duration}</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Brain size={16} color={Colors.GRAY} />
                        <Text style={styles.metaText}>{quiz.questions}</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Award size={16} color={Colors.GRAY} />
                        <Text style={styles.metaText}>{quiz.difficulty}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.quizAction}>
                      <Text style={styles.actionText}>Start Assessment</Text>
                      <ChevronRight size={20} color={Colors.PRIMARY} />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Benefits Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What You'll Get</Text>
          <View style={styles.benefitsContainer}>
            {benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <CheckCircle size={20} color={Colors.SUCCESS} />
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Disclaimer Section */}
        <View style={styles.section}>
          <View style={styles.disclaimerCard}>
            <View style={styles.disclaimerHeader}>
              <AlertCircle size={24} color={Colors.WARNING} />
              <Text style={styles.disclaimerTitle}>Important Notice</Text>
            </View>
            <Text style={styles.disclaimerText}>
              These assessments are screening tools and not diagnostic instruments. They cannot replace 
              professional clinical judgment. If you're experiencing a mental health crisis, please 
              contact emergency services or the campus counseling center immediately.
            </Text>
            <View style={styles.emergencyInfo}>
              <Text style={styles.emergencyTitle}>Crisis Resources:</Text>
              <Text style={styles.emergencyText}>• Campus Counseling: (323) 343-3371</Text>
              <Text style={styles.emergencyText}>• Crisis Hotline: 988</Text>
              <Text style={styles.emergencyText}>• Emergency: 911</Text>
            </View>
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
    paddingHorizontal: 48,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  heroContent: {
    maxWidth: 900,
    alignSelf: 'center',
    width: '100%',
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: '800',
    color: Colors.PRIMARY,
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: -1,
    lineHeight: 56,
  },
  heroSubtitle: {
    fontSize: 20,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: 40,
    fontWeight: '400',
    maxWidth: 700,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: 600,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.GRAY,
    textAlign: 'center',
  },
  section: {
    paddingVertical: 80,
    paddingHorizontal: 48,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    backgroundColor: '#fafbfc',
  },
  sectionTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.PRIMARY,
    marginBottom: 60,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  featuresGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 24,
  },
  featureCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: 16,
    padding: 24,
    width: '30%',
    minWidth: 280,
    alignItems: 'center',
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY,
  },
  featureIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 14,
    color: Colors.GRAY,
    textAlign: 'center',
    lineHeight: 20,
  },
  quizzesContainer: {
    gap: 32,
    maxWidth: 1100,
    alignSelf: 'center',
  },
  quizCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: 24,
    padding: 40,
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    transform: [{ translateY: 0 }],
  },
  quizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  quizIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quizBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.LIGHT_GRAY,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    color: Colors.DARK_GRAY,
    fontWeight: '600',
  },
  quizContent: {
    flex: 1,
  },
  quizTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.PRIMARY,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  quizDescription: {
    fontSize: 17,
    color: '#64748b',
    marginBottom: 12,
    lineHeight: 26,
    fontWeight: '400',
  },
  quizLongDescription: {
    fontSize: 15,
    color: Colors.GRAY,
    marginBottom: 24,
    lineHeight: 22,
  },
  quizMeta: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 32,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  metaText: {
    fontSize: 15,
    color: '#64748b',
    fontWeight: '500',
  },
  quizAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    shadowColor: Colors.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  actionText: {
    fontSize: 17,
    color: 'white',
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  benefitsContainer: {
    gap: 20,
    maxWidth: 800,
    alignSelf: 'center',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    backgroundColor: Colors.WHITE,
    padding: 20,
    borderRadius: 12,
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  benefitText: {
    fontSize: 17,
    color: '#334155',
    flex: 1,
    lineHeight: 26,
    fontWeight: '400',
  },
  disclaimerCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 16,
    padding: 32,
    maxWidth: 900,
    alignSelf: 'center',
    borderLeftWidth: 6,
    borderLeftColor: Colors.SECONDARY,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  disclaimerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  disclaimerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#92400e',
    letterSpacing: -0.2,
  },
  disclaimerText: {
    fontSize: 16,
    color: '#92400e',
    lineHeight: 24,
    marginBottom: 20,
    fontWeight: '400',
  },
  emergencyInfo: {
    backgroundColor: Colors.WHITE,
    borderRadius: 12,
    padding: 16,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.ERROR,
    marginBottom: 8,
  },
  emergencyText: {
    fontSize: 14,
    color: Colors.DARK_GRAY,
    marginBottom: 4,
  },
});