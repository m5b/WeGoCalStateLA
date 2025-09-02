import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowLeft,
  Brain,
  Heart,
  ChevronRight,
  Clock,
  Users,
  Shield
} from 'lucide-react-native';
import Colors from '../../constant/Colors';
import WebQuizListScreen from './web-quiz-list';

const { width } = Dimensions.get('window');

export default function QuizListScreen() {
  // Render web version on web platform
  if (Platform.OS === 'web') {
    return <WebQuizListScreen />;
  }

  const quizzes = [
    {
      id: 'gad7',
      title: 'GAD-7 Anxiety Assessment',
      description: 'Generalized Anxiety Disorder 7-item scale to assess anxiety symptoms',
      duration: '2-3 minutes',
      questions: '7 questions',
      icon: Brain,
      color: Colors.PRIMARY,
      route: '/quizzes/gad_7Disclaimer'
    },
    {
      id: 'phq9',
      title: 'PHQ-9 Depression Screening',
      description: 'Patient Health Questionnaire to screen for depression symptoms',
      duration: '3-4 minutes',
      questions: '9 questions',
      icon: Heart,
      color: Colors.ERROR,
      route: '/quizzes/phq_9Disclaimer'
    }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Confidential',
      description: 'Your responses are private and secure'
    },
    {
      icon: Users,
      title: 'Professional',
      description: 'Clinically validated assessment tools'
    },
    {
      icon: Clock,
      title: 'Quick',
      description: 'Takes just a few minutes to complete'
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
          <Text style={styles.headerTitle}>Wellness Assessments</Text>
          <View style={styles.headerSpacer} />
        </View>
        <Text style={styles.headerSubtitle}>
          Take a moment to check in with your mental health
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.contentPadding}>
          {/* Information Card */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>About These Assessments</Text>
            <Text style={styles.infoText}>
              These are evidence-based screening tools used by mental health professionals. 
              They can help you understand your current mental health status and guide you toward appropriate resources.
            </Text>
            
            <View style={styles.featuresContainer}>
              {features.map((feature, index) => (
                <View key={index} style={styles.featureRow}>
                  <View style={styles.featureIconContainer}>
                    <feature.icon size={20} color={Colors.SECONDARY} />
                  </View>
                  <View style={styles.featureContent}>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={styles.featureDescription}>{feature.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Quiz Cards */}
          <Text style={styles.sectionTitle}>Available Assessments</Text>
          {quizzes.map((quiz) => (
            <TouchableOpacity
              key={quiz.id}
              style={styles.quizCard}
              onPress={() => router.push(quiz.route)}
              activeOpacity={0.8}
            >
              <View style={[styles.quizIconContainer, { backgroundColor: quiz.color + '20' }]}>
                <quiz.icon size={32} color={quiz.color} />
              </View>
              
              <View style={styles.quizContent}>
                <Text style={styles.quizTitle}>{quiz.title}</Text>
                <Text style={styles.quizDescription}>{quiz.description}</Text>
                
                <View style={styles.quizMeta}>
                  <View style={styles.metaItem}>
                    <Clock size={16} color={Colors.GRAY} />
                    <Text style={styles.metaText}>{quiz.duration}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Brain size={16} color={Colors.GRAY} />
                    <Text style={styles.metaText}>{quiz.questions}</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.quizArrow}>
                <ChevronRight size={24} color={Colors.GRAY} />
              </View>
            </TouchableOpacity>
          ))}

          {/* Disclaimer */}
          <View style={styles.disclaimerCard}>
            <Text style={styles.disclaimerTitle}>Important Notice</Text>
            <Text style={styles.disclaimerText}>
              These assessments are for educational purposes and should not replace professional medical advice. 
              If you're experiencing a mental health crisis, please contact the Crisis Text Line (text HOME to 741741) 
              or call 988 for the Suicide & Crisis Lifeline.
            </Text>
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
  infoCard: {
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
    borderLeftColor: Colors.PRIMARY,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: Colors.DARK_GRAY,
    lineHeight: 24,
    marginBottom: 20,
  },
  featuresContainer: {
    gap: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.SECONDARY + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 14,
    color: Colors.GRAY,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    marginBottom: 16,
  },
  quizCard: {
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
  quizIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  quizContent: {
    flex: 1,
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    marginBottom: 6,
  },
  quizDescription: {
    fontSize: 14,
    color: Colors.GRAY,
    lineHeight: 20,
    marginBottom: 12,
  },
  quizMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: Colors.GRAY,
    fontWeight: '500',
  },
  quizArrow: {
    marginLeft: 12,
  },
  disclaimerCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: Colors.WARNING,
  },
  disclaimerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 14,
    color: Colors.GRAY,
    lineHeight: 20,
  },
});