import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Save, 
  BarChart, 
  Calendar,
  Moon,
  Brain,
  Heart,
  TrendingUp,
  CheckCircle,
  Clock,
  Target,
  Award,
  Zap,
} from 'lucide-react-native';
import Colors from '../../constant/Colors';
import WebLayout from '../../components/WebLayout';

const { width } = Dimensions.get('window');

export default function WebDailyCheckInScreen() {
  const [mood, setMood] = useState(null);
  const [sleepQuality, setSleepQuality] = useState(null);
  const [stressLevel, setStressLevel] = useState(null);
  const [date, setDate] = useState(new Date());

  const moods = [
    { value: 5, label: 'Excellent', emoji: '😁', color: Colors.SUCCESS, description: 'Feeling fantastic and energized' },
    { value: 4, label: 'Good', emoji: '🙂', color: Colors.INFO, description: 'Generally positive and content' },
    { value: 3, label: 'Neutral', emoji: '😐', color: Colors.SECONDARY, description: 'Neither good nor bad' },
    { value: 2, label: 'Low', emoji: '😕', color: Colors.WARNING, description: 'Feeling down or unmotivated' },
    { value: 1, label: 'Poor', emoji: '😞', color: Colors.ERROR, description: 'Struggling significantly today' }
  ];

  const sleepOptions = [
    { value: 5, label: 'Excellent', color: Colors.SUCCESS, description: '8+ hours, felt refreshed' },
    { value: 4, label: 'Good', color: Colors.INFO, description: '7-8 hours, mostly rested' },
    { value: 3, label: 'Fair', color: Colors.SECONDARY, description: '6-7 hours, somewhat tired' },
    { value: 2, label: 'Poor', color: Colors.WARNING, description: '4-6 hours, quite tired' },
    { value: 1, label: 'Very Poor', color: Colors.ERROR, description: 'Less than 4 hours, exhausted' }
  ];

  const stressOptions = [
    { value: 1, label: 'Minimal', color: Colors.SUCCESS, description: 'Calm and relaxed' },
    { value: 2, label: 'Low', color: Colors.INFO, description: 'Slightly tense but manageable' },
    { value: 3, label: 'Moderate', color: Colors.SECONDARY, description: 'Noticeable stress levels' },
    { value: 4, label: 'High', color: Colors.WARNING, description: 'Feeling overwhelmed' },
    { value: 5, label: 'Severe', color: Colors.ERROR, description: 'Extremely stressed and anxious' }
  ];

  const isAllAnswered = () => {
    return mood !== null && sleepQuality !== null && stressLevel !== null;
  };

  const handleSave = () => {
    // This would save the check-in data to AsyncStorage or context
    // For now, we'll just navigate to the progress screen
    router.push('/daily_check_in/progress');
  };

  const getWellnessScore = () => {
    if (!isAllAnswered()) return null;
    const total = mood + sleepQuality + (6 - stressLevel); // Invert stress for scoring
    return Math.round((total / 15) * 100);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return Colors.SUCCESS;
    if (score >= 60) return Colors.INFO;
    if (score >= 40) return Colors.SECONDARY;
    if (score >= 20) return Colors.WARNING;
    return Colors.ERROR;
  };

  const tips = [
    {
      icon: Heart,
      title: 'Mood Boost',
      tip: 'Try a 5-minute gratitude practice to improve your mood'
    },
    {
      icon: Moon,
      title: 'Better Sleep',
      tip: 'Establish a consistent bedtime routine for quality rest'
    },
    {
      icon: Brain,
      title: 'Stress Relief',
      tip: 'Practice deep breathing exercises when feeling overwhelmed'
    }
  ];

  return (
    <WebLayout>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <LinearGradient
          colors={[Colors.PRIMARY + '10', Colors.LIGHT_BLUE + '05']}
          style={styles.heroSection}
        >
          <View style={styles.heroContent}>
            <View style={styles.heroHeader}>
              <View style={styles.heroIcon}>
                <Calendar size={32} color={Colors.PRIMARY} />
              </View>
              <View style={styles.heroText}>
                <Text style={styles.heroTitle}>Daily Check-In</Text>
                <Text style={styles.heroDate}>
                  {date.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </Text>
              </View>
              {isAllAnswered() && (
                <View style={styles.scoreContainer}>
                  <Text style={styles.scoreLabel}>Wellness Score</Text>
                  <Text style={[styles.scoreValue, { color: getScoreColor(getWellnessScore()) }]}>
                    {getWellnessScore()}%
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.heroSubtitle}>
              Take a moment to reflect on your mental and physical well-being today.
              Your daily check-ins help track patterns and guide your wellness journey.
            </Text>
          </View>
        </LinearGradient>

        <View style={styles.mainContent}>
          {/* Mood Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Heart size={24} color={Colors.PRIMARY} />
              <Text style={styles.sectionTitle}>How are you feeling today?</Text>
            </View>
            <Text style={styles.sectionDescription}>
              Rate your overall emotional state and mood for today
            </Text>
            
            <View style={styles.moodGrid}>
              {moods.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.moodCard,
                    mood === item.value && { 
                      borderColor: item.color, 
                      borderWidth: 2,
                      backgroundColor: item.color + '10'
                    }
                  ]}
                  onPress={() => setMood(item.value)}
                >
                  <Text style={styles.moodEmoji}>{item.emoji}</Text>
                  <Text style={[
                    styles.moodLabel,
                    mood === item.value && { color: item.color, fontWeight: 'bold' }
                  ]}>
                    {item.label}
                  </Text>
                  <Text style={styles.moodDescription}>{item.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Sleep Quality Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Moon size={24} color={Colors.PRIMARY} />
              <Text style={styles.sectionTitle}>How well did you sleep last night?</Text>
            </View>
            <Text style={styles.sectionDescription}>
              Quality sleep is crucial for mental health and daily performance
            </Text>
            
            <View style={styles.optionsGrid}>
              {sleepOptions.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.optionCard,
                    sleepQuality === item.value && { 
                      backgroundColor: item.color + '15', 
                      borderColor: item.color,
                      borderWidth: 2
                    }
                  ]}
                  onPress={() => setSleepQuality(item.value)}
                >
                  <View style={styles.optionHeader}>
                    <Text style={[
                      styles.optionLabel,
                      sleepQuality === item.value && { color: item.color, fontWeight: 'bold' }
                    ]}>
                      {item.label}
                    </Text>
                    {sleepQuality === item.value && (
                      <CheckCircle size={20} color={item.color} />
                    )}
                  </View>
                  <Text style={styles.optionDescription}>{item.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Stress Level Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Brain size={24} color={Colors.PRIMARY} />
              <Text style={styles.sectionTitle}>What's your stress level today?</Text>
            </View>
            <Text style={styles.sectionDescription}>
              Understanding your stress helps identify triggers and coping strategies
            </Text>
            
            <View style={styles.optionsGrid}>
              {stressOptions.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.optionCard,
                    stressLevel === item.value && { 
                      backgroundColor: item.color + '15', 
                      borderColor: item.color,
                      borderWidth: 2
                    }
                  ]}
                  onPress={() => setStressLevel(item.value)}
                >
                  <View style={styles.optionHeader}>
                    <Text style={[
                      styles.optionLabel,
                      stressLevel === item.value && { color: item.color, fontWeight: 'bold' }
                    ]}>
                      {item.label}
                    </Text>
                    {stressLevel === item.value && (
                      <CheckCircle size={20} color={item.color} />
                    )}
                  </View>
                  <Text style={styles.optionDescription}>{item.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Wellness Tips Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Zap size={24} color={Colors.PRIMARY} />
              <Text style={styles.sectionTitle}>Daily Wellness Tips</Text>
            </View>
            <View style={styles.tipsGrid}>
              {tips.map((tip, index) => {
                const IconComponent = tip.icon;
                return (
                  <View key={index} style={styles.tipCard}>
                    <View style={[styles.tipIcon, { backgroundColor: Colors.PRIMARY + '15' }]}>
                      <IconComponent size={20} color={Colors.PRIMARY} />
                    </View>
                    <Text style={styles.tipTitle}>{tip.title}</Text>
                    <Text style={styles.tipText}>{tip.tip}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Actions Section */}
          <View style={styles.actionsSection}>
            <View style={styles.actionsGrid}>
              <TouchableOpacity 
                style={[
                  styles.actionCard,
                  styles.primaryAction,
                  !isAllAnswered() && styles.disabledAction
                ]}
                onPress={handleSave}
                disabled={!isAllAnswered()}
              >
                <LinearGradient
                  colors={isAllAnswered() ? [Colors.PRIMARY, Colors.DARK_BLUE] : [Colors.GRAY, Colors.GRAY_DARK]}
                  style={styles.actionGradient}
                >
                  <Save size={24} color={Colors.WHITE} />
                  <View style={styles.actionText}>
                    <Text style={styles.actionTitle}>Save Check-In</Text>
                    <Text style={styles.actionSubtitle}>Record today's wellness data</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionCard, styles.secondaryAction]}
                onPress={() => router.push('/daily_check_in/progress')}
              >
                <LinearGradient
                  colors={[Colors.SECONDARY, Colors.DARK_GOLD]}
                  style={styles.actionGradient}
                >
                  <BarChart size={24} color={Colors.WHITE} />
                  <View style={styles.actionText}>
                    <Text style={styles.actionTitle}>View Progress</Text>
                    <Text style={styles.actionSubtitle}>Track your wellness journey</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            
            {!isAllAnswered() && (
              <View style={styles.incompleteNotice}>
                <Clock size={16} color={Colors.WARNING} />
                <Text style={styles.incompleteText}>
                  Please complete all sections to save your check-in
                </Text>
              </View>
            )}
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
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 24,
  },
  heroIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.PRIMARY + '15',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  heroText: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: '800',
    color: Colors.PRIMARY,
    marginBottom: 8,
    letterSpacing: -1,
    lineHeight: 56,
  },
  heroDate: {
    fontSize: 20,
    color: '#64748b',
    fontWeight: '500',
  },
  scoreContainer: {
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    borderRadius: 20,
    padding: 24,
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  scoreLabel: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 8,
    fontWeight: '500',
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -1,
  },
  heroSubtitle: {
    fontSize: 20,
    color: '#64748b',
    lineHeight: 30,
    maxWidth: 700,
    fontWeight: '400',
  },
  mainContent: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 40,
  },
  section: {
    marginBottom: 60,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.PRIMARY,
    letterSpacing: -0.5,
  },
  sectionDescription: {
    fontSize: 16,
    color: Colors.GRAY,
    marginBottom: 32,
    lineHeight: 24,
  },
  moodGrid: {
    flexDirection: 'row',
    gap: 20,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moodCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: 16,
    padding: 24,
    width: '18%',
    minWidth: 180,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY,
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  moodEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  moodLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.PRIMARY,
    marginBottom: 8,
  },
  moodDescription: {
    fontSize: 12,
    color: Colors.GRAY,
    textAlign: 'center',
    lineHeight: 16,
  },
  optionsGrid: {
    gap: 16,
  },
  optionCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY,
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.PRIMARY,
  },
  optionDescription: {
    fontSize: 14,
    color: Colors.GRAY,
    lineHeight: 20,
  },
  tipsGrid: {
    maxWidth: 1100,
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 32,
  },
  tipCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 32,
    flex: 1,
    minWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  tipIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  tipTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.PRIMARY,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  tipText: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 24,
    fontWeight: '400',
  },
  actionsSection: {
    paddingVertical: 60,
    paddingHorizontal: 48,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    marginBottom: 60,
  },
  actionsGrid: {
    maxWidth: 900,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 24,
    marginBottom: 20,
  },
  actionCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryAction: {
    // Primary action styles
  },
  secondaryAction: {
    // Secondary action styles
  },
  disabledAction: {
    opacity: 0.6,
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    gap: 16,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    color: Colors.WHITE,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  actionSubtitle: {
    color: Colors.WHITE + 'CC',
    fontSize: 16,
    fontWeight: '500',
  },
  incompleteNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.WARNING + '10',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.WARNING + '30',
  },
  incompleteText: {
    fontSize: 14,
    color: Colors.WARNING,
    fontWeight: '500',
  },
});