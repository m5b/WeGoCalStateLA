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
import { Brain, Heart, ChevronRight, Clock, Users, Shield, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Star, Award, Activity, Target, Zap, TrendingUp } from 'lucide-react-native';
import Colors from '../../constant/Colors';
import WebLayout from '../../components/WebLayout';

const { width } = Dimensions.get('window');

export default function WebQuizListScreen() {
  const quizzes = [
    {
      id: 'gad7',
      title: 'GAD-7 Anxiety Assessment',
      description: 'Generalized Anxiety Disorder 7-item scale to assess anxiety symptoms and their severity',
      longDescription: 'The GAD-7 is a validated screening tool used by healthcare professionals worldwide to identify probable cases of generalized anxiety disorder and assess symptom severity. This assessment has been clinically validated and is widely used in both research and clinical practice.',
      duration: '2-3 minutes',
      questions: '7 questions',
      icon: Brain,
      color: Colors.PRIMARY,
      route: '/quizzes/gad_7Disclaimer',
      difficulty: 'Easy',
      accuracy: '89%',
      completions: '2,847',
      category: 'Anxiety Screening',
    },
    {
      id: 'phq9',
      title: 'PHQ-9 Depression Screening',
      description: 'Patient Health Questionnaire to screen for depression symptoms and monitor treatment progress',
      longDescription: 'The PHQ-9 is a multipurpose instrument for screening, diagnosing, monitoring and measuring the severity of depression. It incorporates DSM-IV depression diagnostic criteria with other leading major depressive symptoms into a brief self-report tool.',
      duration: '3-4 minutes',
      questions: '9 questions',
      icon: Heart,
      color: Colors.ERROR,
      route: '/quizzes/phq_9Disclaimer',
      difficulty: 'Easy',
      accuracy: '91%',
      completions: '3,156',
      category: 'Depression Screening',
    }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Confidential & Secure',
      description: 'Your responses are encrypted and stored securely with HIPAA-compliant protocols'
    },
    {
      icon: CheckCircle,
      title: 'Clinically Validated',
      description: 'Based on established psychological assessments used by mental health professionals'
    },
    {
      icon: Users,
      title: 'Professional Support',
      description: 'Connect directly with Cal State LA counseling services and mental health resources'
    },
    {
      icon: Activity,
      title: 'Progress Tracking',
      description: 'Monitor your mental health journey with detailed analytics and trend analysis'
    }
  ];

  const benefits = [
    {
      icon: Target,
      title: 'Personalized Insights',
      description: 'Get tailored recommendations based on your assessment results and wellness patterns'
    },
    {
      icon: TrendingUp,
      title: 'Track Progress Over Time',
      description: 'Visualize your mental health journey with comprehensive analytics and historical data'
    },
    {
      icon: Zap,
      title: 'Immediate Results',
      description: 'Receive instant feedback and connect with appropriate campus support services'
    },
    {
      icon: Award,
      title: 'Evidence-Based Care',
      description: 'Access the same screening tools used by mental health professionals worldwide'
    },
  ];

  const handleQuizPress = (route) => {
    router.push(route);
  };

  return (
    <WebLayout>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <LinearGradient
          colors={[Colors.PRIMARY + '08', '#f8fafc']}
          style={styles.heroSection}
        >
          <View style={styles.heroContent}>
            <View style={styles.heroText}>
              <Text style={styles.heroTitle}>Mental Health Assessments</Text>
              <Text style={styles.heroSubtitle}>
                Take scientifically-backed assessments to better understand your mental health.
                These professional-grade screening tools can help identify symptoms and guide you toward appropriate resources.
              </Text>
              
              <View style={styles.heroStats}>
                <View style={styles.heroStatItem}>
                  <Text style={styles.heroStatNumber}>6,000+</Text>
                  <Text style={styles.heroStatLabel}>Assessments Completed</Text>
                </View>
                <View style={styles.heroStatItem}>
                  <Text style={styles.heroStatNumber}>90%</Text>
                  <Text style={styles.heroStatLabel}>Clinical Accuracy</Text>
                </View>
                <View style={styles.heroStatItem}>
                  <Text style={styles.heroStatNumber}>24/7</Text>
                  <Text style={styles.heroStatLabel}>Available Access</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.heroVisual}>
              <View style={styles.heroCard}>
                <Brain size={64} color={Colors.PRIMARY} />
                <Text style={styles.heroCardTitle}>Professional Grade</Text>
                <Text style={styles.heroCardText}>Clinical assessments used by healthcare providers</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Features Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Why Use Our Assessment Platform?</Text>
            <Text style={styles.sectionDescription}>
              Our platform provides the same evidence-based screening tools used by mental health professionals, 
              designed specifically for the Cal State LA community.
            </Text>
          </View>
          
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <View key={index} style={styles.featureCard}>
                  <View style={[styles.featureIcon, { backgroundColor: Colors.PRIMARY + '12' }]}>
                    <IconComponent size={28} color={Colors.PRIMARY} />
                  </View>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Assessments Section */}
        <View style={styles.assessmentsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Available Mental Health Assessments</Text>
            <Text style={styles.sectionDescription}>
              Choose from clinically validated screening tools to assess different aspects of your mental health
            </Text>
          </View>
          
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
                    <View style={styles.quizCategory}>
                      <Text style={styles.categoryText}>{quiz.category}</Text>
                    </View>
                    <View style={styles.quizBadges}>
                      <View style={styles.badge}>
                        <Star size={14} color={Colors.SECONDARY} />
                        <Text style={styles.badgeText}>{quiz.accuracy}</Text>
                      </View>
                      <View style={styles.badge}>
                        <Users size={14} color={Colors.SUCCESS} />
                        <Text style={styles.badgeText}>{quiz.completions}</Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.quizContent}>
                    <View style={styles.quizTitleRow}>
                      <View style={[styles.quizIconContainer, { backgroundColor: quiz.color + '12' }]}>
                        <IconComponent size={36} color={quiz.color} />
                      </View>
                      <View style={styles.quizTitleContent}>
                        <Text style={styles.quizTitle}>{quiz.title}</Text>
                        <Text style={styles.quizDescription}>{quiz.description}</Text>
                      </View>
                    </View>
                    
                    <Text style={styles.quizLongDescription}>{quiz.longDescription}</Text>
                    
                    <View style={styles.quizMeta}>
                      <View style={styles.metaItem}>
                        <Clock size={18} color={Colors.GRAY} />
                        <Text style={styles.metaText}>{quiz.duration}</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Brain size={18} color={Colors.GRAY} />
                        <Text style={styles.metaText}>{quiz.questions}</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Award size={18} color={Colors.GRAY} />
                        <Text style={styles.metaText}>{quiz.difficulty}</Text>
                      </View>
                    </View>
                    
                    <TouchableOpacity 
                      style={[styles.quizAction, { backgroundColor: quiz.color }]}
                      onPress={() => handleQuizPress(quiz.route)}
                    >
                      <Text style={styles.actionText}>Start Assessment</Text>
                      <ChevronRight size={20} color="white" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Benefits Section */}
        <View style={styles.benefitsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>What You'll Gain</Text>
            <Text style={styles.sectionDescription}>
              Our comprehensive platform provides valuable insights and connects you with the support you need
            </Text>
          </View>
          
          <View style={styles.benefitsGrid}>
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <View key={index} style={styles.benefitCard}>
                  <View style={[styles.benefitIcon, { backgroundColor: Colors.SECONDARY + '15' }]}>
                    <IconComponent size={24} color={Colors.SECONDARY} />
                  </View>
                  <Text style={styles.benefitTitle}>{benefit.title}</Text>
                  <Text style={styles.benefitDescription}>{benefit.description}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Disclaimer Section */}
        <View style={styles.disclaimerSection}>
          <View style={styles.disclaimerCard}>
            <View style={styles.disclaimerHeader}>
              <AlertCircle size={28} color={Colors.WARNING} />
              <Text style={styles.disclaimerTitle}>Important Medical Disclaimer</Text>
            </View>
            
            <Text style={styles.disclaimerText}>
              These assessments are screening tools and not diagnostic instruments. They cannot replace 
              professional clinical judgment or comprehensive mental health evaluation. Results should be 
              discussed with qualified healthcare providers for proper interpretation and treatment planning.
            </Text>
            
            <View style={styles.emergencyInfo}>
              <Text style={styles.emergencyTitle}>Crisis Resources Available 24/7:</Text>
              <View style={styles.emergencyGrid}>
                <View style={styles.emergencyItem}>
                  <Text style={styles.emergencyLabel}>National Crisis Hotline</Text>
                  <Text style={styles.emergencyNumber}>988</Text>
                </View>
                <View style={styles.emergencyItem}>
                  <Text style={styles.emergencyLabel}>Campus Counseling</Text>
                  <Text style={styles.emergencyNumber}>(323) 343-3371</Text>
                </View>
                <View style={styles.emergencyItem}>
                  <Text style={styles.emergencyLabel}>Emergency Services</Text>
                  <Text style={styles.emergencyNumber}>911</Text>
                </View>
              </View>
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
    paddingVertical: 120,
    paddingHorizontal: 60,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    gap: 80,
  },
  heroText: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 56,
    fontWeight: '900',
    color: Colors.PRIMARY,
    textAlign: 'left',
    marginBottom: 32,
    letterSpacing: -1.5,
    lineHeight: 64,
  },
  heroSubtitle: {
    fontSize: 22,
    color: '#64748b',
    textAlign: 'left',
    lineHeight: 34,
    marginBottom: 48,
    fontWeight: '400',
    maxWidth: 600,
  },
  heroStats: {
    flexDirection: 'row',
    gap: 40,
  },
  heroStatItem: {
    alignItems: 'center',
  },
  heroStatNumber: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.PRIMARY,
    marginBottom: 8,
    letterSpacing: -1,
  },
  heroStatLabel: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    fontWeight: '500',
  },
  heroVisual: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroCard: {
    backgroundColor: 'white',
    borderRadius: 32,
    padding: 48,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 40,
    elevation: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  heroCardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.PRIMARY,
    marginTop: 24,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  heroCardText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
  },
  section: {
    paddingVertical: 100,
    paddingHorizontal: 60,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: 80,
  },
  sectionTitle: {
    fontSize: 48,
    fontWeight: '800',
    color: Colors.PRIMARY,
    marginBottom: 24,
    textAlign: 'center',
    letterSpacing: -1,
    lineHeight: 56,
  },
  sectionDescription: {
    fontSize: 20,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 32,
    maxWidth: 800,
    fontWeight: '400',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 32,
  },
  featureCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 40,
    width: '48%',
    minWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  featureIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  featureTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.PRIMARY,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  featureDescription: {
    fontSize: 17,
    color: '#64748b',
    lineHeight: 26,
    fontWeight: '400',
  },
  assessmentsSection: {
    backgroundColor: '#f8fafc',
    paddingVertical: 100,
    paddingHorizontal: 60,
  },
  quizzesContainer: {
    gap: 48,
    maxWidth: 1200,
    alignSelf: 'center',
  },
  quizCard: {
    backgroundColor: 'white',
    borderRadius: 32,
    padding: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.08,
    shadowRadius: 32,
    elevation: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  quizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  quizCategory: {
    backgroundColor: Colors.SECONDARY + '15',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 14,
    color: Colors.SECONDARY,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  quizBadges: {
    flexDirection: 'row',
    gap: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
  },
  badgeText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
  },
  quizContent: {
    flex: 1,
  },
  quizTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 24,
    marginBottom: 24,
  },
  quizIconContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  quizTitleContent: {
    flex: 1,
  },
  quizTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.PRIMARY,
    marginBottom: 12,
    letterSpacing: -0.5,
    lineHeight: 40,
  },
  quizDescription: {
    fontSize: 19,
    color: '#64748b',
    lineHeight: 28,
    fontWeight: '400',
  },
  quizLongDescription: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 32,
    lineHeight: 26,
    backgroundColor: '#f8fafc',
    padding: 24,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.PRIMARY,
  },
  quizMeta: {
    flexDirection: 'row',
    gap: 32,
    marginBottom: 40,
    paddingVertical: 20,
    paddingHorizontal: 24,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  quizAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  actionText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  benefitsSection: {
    paddingVertical: 100,
    paddingHorizontal: 60,
    backgroundColor: 'white',
  },
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 32,
    maxWidth: 1200,
    alignSelf: 'center',
  },
  benefitCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 24,
    padding: 40,
    width: '48%',
    minWidth: 320,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 4,
  },
  benefitIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  benefitTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.PRIMARY,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  benefitDescription: {
    fontSize: 17,
    color: '#64748b',
    lineHeight: 26,
    fontWeight: '400',
  },
  disclaimerSection: {
    paddingVertical: 80,
    paddingHorizontal: 60,
    backgroundColor: '#fef3c7',
  },
  disclaimerCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 48,
    maxWidth: 1000,
    alignSelf: 'center',
    borderLeftWidth: 6,
    borderLeftColor: Colors.WARNING,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 8,
  },
  disclaimerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  disclaimerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#92400e',
    letterSpacing: -0.3,
  },
  disclaimerText: {
    fontSize: 18,
    color: '#92400e',
    lineHeight: 28,
    marginBottom: 32,
    fontWeight: '400',
  },
  emergencyInfo: {
    backgroundColor: '#fef3c7',
    borderRadius: 16,
    padding: 24,
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.ERROR,
    marginBottom: 20,
    letterSpacing: -0.2,
  },
  emergencyGrid: {
    flexDirection: 'row',
    gap: 32,
    flexWrap: 'wrap',
  },
  emergencyItem: {
    flex: 1,
    minWidth: 200,
  },
  emergencyLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
    marginBottom: 4,
  },
  emergencyNumber: {
    fontSize: 20,
    color: Colors.ERROR,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
});