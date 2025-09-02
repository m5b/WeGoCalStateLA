import React, { useState } from 'react';
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
import { Brain, Heart, ChevronRight, Clock, Users, Shield, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Star, Award, Activity, Target, Zap, TrendingUp, ArrowRight, FileText, Phone, MessageCircle, AlertTriangle } from 'lucide-react-native';
import Colors from '../../constant/Colors';
import { Typography, Spacing, BorderRadius, Shadows } from '../../constant/DesignSystem';
import WebLayout from '../../components/WebLayout';
import { responsive, isBreakpoint, getContainerMaxWidth } from '../../utils/responsive';

const { width } = Dimensions.get('window');

export default function WebQuizListScreen() {
  const [hoveredQuiz, setHoveredQuiz] = useState(null);

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
          
          <View style={styles.quizzesGrid}>
            {quizzes.map((quiz) => {
              const IconComponent = quiz.icon;
              const isHovered = hoveredQuiz === quiz.id;
              return (
                <TouchableOpacity
                  key={quiz.id}
                  style={[
                    styles.modernQuizCard,
                    isHovered && styles.modernQuizCardHovered
                  ]}
                  onPress={() => handleQuizPress(quiz.route)}
                  onMouseEnter={() => Platform.OS === 'web' && setHoveredQuiz(quiz.id)}
                  onMouseLeave={() => Platform.OS === 'web' && setHoveredQuiz(null)}
                  activeOpacity={0.95}
                >
                  {/* Card Header */}
                  <View style={styles.modernCardHeader}>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>{quiz.category}</Text>
                    </View>
                    <View style={styles.ratingContainer}>
                      <Star size={14} color={Colors.SECONDARY} fill={Colors.SECONDARY} />
                      <Text style={styles.ratingText}>{quiz.accuracy}</Text>
                    </View>
                  </View>

                  {/* Icon and Title */}
                  <View style={styles.modernCardContent}>
                    <LinearGradient
                      colors={[quiz.color, quiz.color + 'CC']}
                      style={styles.modernIconContainer}
                    >
                      <IconComponent size={32} color="white" />
                    </LinearGradient>
                    
                    <Text style={styles.modernQuizTitle}>{quiz.title}</Text>
                    <Text style={styles.modernQuizDescription}>{quiz.description}</Text>
                  </View>

                  {/* Stats Row */}
                  <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                      <Clock size={14} color="#64748b" />
                      <Text style={styles.statText}>{quiz.duration}</Text>
                    </View>
                    <View style={styles.statItem}>
                      <FileText size={14} color="#64748b" />
                      <Text style={styles.statText}>{quiz.questions}</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Users size={14} color="#64748b" />
                      <Text style={styles.statText}>{quiz.completions}</Text>
                    </View>
                  </View>

                  {/* Action Button */}
                  <View style={styles.modernActionContainer}>
                    <LinearGradient
                      colors={[quiz.color, quiz.color + 'CC']}
                      style={[
                        styles.modernActionButton,
                        isHovered && styles.modernActionButtonHovered
                      ]}
                    >
                      <Text style={styles.modernActionText}>Start Assessment</Text>
                      <ArrowRight 
                        size={18} 
                        color="white" 
                        style={[
                          styles.actionArrow,
                          isHovered && styles.actionArrowHovered
                        ]} 
                      />
                    </LinearGradient>
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
    paddingVertical: responsive({ xs: 60, sm: 80, md: 120 }),
    paddingHorizontal: responsive({ xs: 16, sm: 32, md: 60 }),
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  heroContent: {
    flexDirection: responsive({ xs: 'column', lg: 'row' }),
    alignItems: 'center',
    maxWidth: getContainerMaxWidth(),
    alignSelf: 'center',
    width: '100%',
    gap: responsive({ xs: 40, sm: 60, lg: 80 }),
  },
  heroText: {
    flex: 1,
  },
  heroTitle: {
    fontSize: responsive({ xs: 32, sm: 42, md: 56 }),
    fontWeight: '900',
    color: Colors.PRIMARY,
    textAlign: responsive({ xs: 'center', lg: 'left' }),
    marginBottom: responsive({ xs: 20, sm: 24, md: 32 }),
    letterSpacing: -1.5,
    lineHeight: responsive({ xs: 40, sm: 50, md: 64 }),
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
    paddingVertical: responsive({ xs: 60, sm: 80, md: 100 }),
    paddingHorizontal: responsive({ xs: 16, sm: 32, md: 60 }),
    maxWidth: getContainerMaxWidth(),
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
    justifyContent: responsive({ xs: 'center', sm: 'space-between' }),
    gap: responsive({ xs: 20, sm: 24, md: 32 }),
  },
  featureCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: responsive({ xs: 24, sm: 32, md: 40 }),
    width: responsive({ xs: '100%', sm: '48%' }),
    minWidth: responsive({ xs: 0, sm: 320 }),
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
    backgroundColor: Colors.BACKGROUND_SECONDARY,
    paddingVertical: Spacing[20],
    paddingHorizontal: Spacing[16],
  },
  quizzesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: responsive({ xs: Spacing[6], sm: Spacing[8], md: Spacing[12] }),
    maxWidth: getContainerMaxWidth(),
    alignSelf: 'center',
    justifyContent: 'center',
  },
  modernQuizCard: {
    backgroundColor: 'white',
    borderRadius: BorderRadius.xl,
    padding: responsive({ xs: Spacing[6], sm: Spacing[8], md: Spacing[12] }),
    width: responsive({ xs: '100%', sm: '48%', lg: '31%' }),
    minWidth: responsive({ xs: 0, sm: 320, md: 380 }),
    maxWidth: responsive({ xs: '100%', sm: 480 }),
    ...Shadows.web.lg,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    transition: 'all 0.3s ease',
  },
  modernQuizCardHovered: {
    transform: [{ translateY: -8 }],
    ...Shadows.web.xl,
    borderColor: Colors.PRIMARY_300,
  },
  modernCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[8],
  },
  categoryBadge: {
    backgroundColor: Colors.PRIMARY_100,
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[1],
    borderRadius: BorderRadius.full,
  },
  categoryBadgeText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.PRIMARY_700,
    fontWeight: Typography.fontWeight.semibold,
    letterSpacing: Typography.letterSpacing.wide,
    textTransform: 'uppercase',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1],
  },
  ratingText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.TEXT_SECONDARY,
    fontWeight: Typography.fontWeight.medium,
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
  modernCardContent: {
    alignItems: 'center',
    marginBottom: Spacing[8],
  },
  modernIconContainer: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing[6],
    ...Shadows.web.sm,
  },
  modernQuizTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.TEXT,
    marginBottom: Spacing[1],
    textAlign: 'center',
    letterSpacing: Typography.letterSpacing.tight,
  },
  modernQuizSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.TEXT_SECONDARY,
    marginBottom: Spacing[2],
    textAlign: 'center',
    fontWeight: Typography.fontWeight.medium,
  },
  modernQuizDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed,
    marginBottom: Spacing[6],
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[1],
    justifyContent: 'center',
    marginBottom: Spacing[8],
  },
  tag: {
    backgroundColor: Colors.GRAY_100,
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[1],
    borderRadius: BorderRadius.md,
  },
  tagText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.TEXT,
    fontWeight: Typography.fontWeight.medium,
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing[6],
    paddingHorizontal: Spacing[2],
    backgroundColor: Colors.BACKGROUND_SECONDARY,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing[8],
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1],
  },
  statText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.TEXT_SECONDARY,
    fontWeight: Typography.fontWeight.medium,
  },
  modernActionContainer: {
    marginTop: 'auto',
  },
  modernActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[2],
    paddingVertical: Spacing[6],
    paddingHorizontal: Spacing[8],
    borderRadius: BorderRadius.lg,
    ...Shadows.web.sm,
  },
  modernActionButtonHovered: {
    ...Shadows.web.md,
  },
  modernActionText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.white,
    fontWeight: Typography.fontWeight.semibold,
    letterSpacing: Typography.letterSpacing.wide,
  },
  actionArrow: {
    transition: 'transform 0.2s ease',
  },
  actionArrowHovered: {
    transform: [{ translateX: 4 }],
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