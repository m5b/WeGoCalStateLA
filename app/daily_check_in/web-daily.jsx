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
import { Save, ChartBar as BarChart, Calendar, Moon, Brain, Heart, TrendingUp, CircleCheck as CheckCircle, Clock, Target, Award, Zap, Activity, Star, Sun, Coffee, Smile } from 'lucide-react-native';
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
    { value: 5, label: 'Excellent', color: Colors.SUCCESS, description: '8+ hours, felt refreshed', icon: Star },
    { value: 4, label: 'Good', color: Colors.INFO, description: '7-8 hours, mostly rested', icon: CheckCircle },
    { value: 3, label: 'Fair', color: Colors.SECONDARY, description: '6-7 hours, somewhat tired', icon: Clock },
    { value: 2, label: 'Poor', color: Colors.WARNING, description: '4-6 hours, quite tired', icon: Coffee },
    { value: 1, label: 'Very Poor', color: Colors.ERROR, description: 'Less than 4 hours, exhausted', icon: Moon }
  ];

  const stressOptions = [
    { value: 1, label: 'Minimal', color: Colors.SUCCESS, description: 'Calm and relaxed', icon: Smile },
    { value: 2, label: 'Low', color: Colors.INFO, description: 'Slightly tense but manageable', icon: Sun },
    { value: 3, label: 'Moderate', color: Colors.SECONDARY, description: 'Noticeable stress levels', icon: Activity },
    { value: 4, label: 'High', color: Colors.WARNING, description: 'Feeling overwhelmed', icon: Zap },
    { value: 5, label: 'Severe', color: Colors.ERROR, description: 'Extremely stressed and anxious', icon: Brain }
  ];

  const isAllAnswered = () => {
    return mood !== null && sleepQuality !== null && stressLevel !== null;
  };

  const handleSave = () => {
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

  const getScoreMessage = (score) => {
    if (score >= 80) return "Excellent wellness today! Keep up the great work.";
    if (score >= 60) return "Good wellness levels. You're doing well overall.";
    if (score >= 40) return "Moderate wellness. Consider some self-care activities.";
    if (score >= 20) return "Lower wellness today. Take time for yourself.";
    return "Challenging day. Remember, it's okay to seek support.";
  };

  const tips = [
    {
      icon: Heart,
      title: 'Mood Enhancement',
      tip: 'Try a 5-minute gratitude practice or listen to uplifting music',
      color: Colors.ERROR,
    },
    {
      icon: Moon,
      title: 'Sleep Optimization',
      tip: 'Establish a consistent bedtime routine and limit screen time before bed',
      color: Colors.INFO,
    },
    {
      icon: Brain,
      title: 'Stress Management',
      tip: 'Practice deep breathing exercises or take a short mindful walk',
      color: Colors.PRIMARY,
    }
  ];

  return (
    <WebLayout>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <LinearGradient
          colors={[Colors.PRIMARY + '08', '#f8fafc']}
          style={styles.heroSection}
        >
          <View style={styles.heroContent}>
            <View style={styles.heroHeader}>
              <View style={styles.heroIcon}>
                <Calendar size={36} color={Colors.PRIMARY} />
              </View>
              <View style={styles.heroText}>
                <Text style={styles.heroTitle}>Daily Wellness Check-In</Text>
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
                  <Text style={styles.scoreLabel}>Today's Wellness Score</Text>
                  <Text style={[styles.scoreValue, { color: getScoreColor(getWellnessScore()) }]}>
                    {getWellnessScore()}%
                  </Text>
                  <Text style={styles.scoreMessage}>{getScoreMessage(getWellnessScore())}</Text>
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
              <Heart size={28} color={Colors.PRIMARY} />
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
                      borderWidth: 3,
                      backgroundColor: item.color + '08',
                      transform: [{ scale: 1.02 }]
                    }
                  ]}
                  onPress={() => setMood(item.value)}
                >
                  <Text style={styles.moodEmoji}>{item.emoji}</Text>
                  <Text style={[
                    styles.moodLabel,
                    mood === item.value && { color: item.color, fontWeight: '700' }
                  ]}>
                    {item.label}
                  </Text>
                  <Text style={styles.moodDescription}>{item.description}</Text>
                  {mood === item.value && (
                    <View style={styles.selectedIndicator}>
                      <CheckCircle size={20} color={item.color} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Sleep Quality Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Moon size={28} color={Colors.PRIMARY} />
              <Text style={styles.sectionTitle}>How well did you sleep last night?</Text>
            </View>
            <Text style={styles.sectionDescription}>
              Quality sleep is crucial for mental health and daily performance
            </Text>
            
            <View style={styles.optionsGrid}>
              {sleepOptions.map((item) => {
                const IconComponent = item.icon;
                return (
                  <TouchableOpacity
                    key={item.value}
                    style={[
                      styles.optionCard,
                      sleepQuality === item.value && { 
                        backgroundColor: item.color + '12', 
                        borderColor: item.color,
                        borderWidth: 2
                      }
                    ]}
                    onPress={() => setSleepQuality(item.value)}
                  >
                    <View style={styles.optionHeader}>
                      <View style={styles.optionIconContainer}>
                        <IconComponent size={20} color={item.color} />
                      </View>
                      <Text style={[
                        styles.optionLabel,
                        sleepQuality === item.value && { color: item.color, fontWeight: '700' }
                      ]}>
                        {item.label}
                      </Text>
                      {sleepQuality === item.value && (
                        <CheckCircle size={20} color={item.color} />
                      )}
                    </View>
                    <Text style={styles.optionDescription}>{item.description}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Stress Level Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Brain size={28} color={Colors.PRIMARY} />
              <Text style={styles.sectionTitle}>What's your stress level today?</Text>
            </View>
            <Text style={styles.sectionDescription}>
              Understanding your stress helps identify triggers and coping strategies
            </Text>
            
            <View style={styles.optionsGrid}>
              {stressOptions.map((item) => {
                const IconComponent = item.icon;
                return (
                  <TouchableOpacity
                    key={item.value}
                    style={[
                      styles.optionCard,
                      stressLevel === item.value && { 
                        backgroundColor: item.color + '12', 
                        borderColor: item.color,
                        borderWidth: 2
                      }
                    ]}
                    onPress={() => setStressLevel(item.value)}
                  >
                    <View style={styles.optionHeader}>
                      <View style={styles.optionIconContainer}>
                        <IconComponent size={20} color={item.color} />
                      </View>
                      <Text style={[
                        styles.optionLabel,
                        stressLevel === item.value && { color: item.color, fontWeight: '700' }
                      ]}>
                        {item.label}
                      </Text>
                      {stressLevel === item.value && (
                        <CheckCircle size={20} color={item.color} />
                      )}
                    </View>
                    <Text style={styles.optionDescription}>{item.description}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Wellness Tips Section */}
          <View style={styles.tipsSection}>
            <View style={styles.sectionHeader}>
              <Zap size={28} color={Colors.PRIMARY} />
              <Text style={styles.sectionTitle}>Personalized Wellness Tips</Text>
            </View>
            <View style={styles.tipsGrid}>
              {tips.map((tip, index) => {
                const IconComponent = tip.icon;
                return (
                  <View key={index} style={styles.tipCard}>
                    <View style={[styles.tipIcon, { backgroundColor: tip.color + '12' }]}>
                      <IconComponent size={24} color={tip.color} />
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
                  colors={isAllAnswered() ? [Colors.PRIMARY, '#1e40af'] : ['#94a3b8', '#64748b']}
                  style={styles.actionGradient}
                >
                  <Save size={28} color={Colors.WHITE} />
                  <View style={styles.actionText}>
                    <Text style={styles.actionTitle}>Save Today's Check-In</Text>
                    <Text style={styles.actionSubtitle}>Record your wellness data and get insights</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionCard, styles.secondaryAction]}
                onPress={() => router.push('/daily_check_in/progress')}
              >
                <LinearGradient
                  colors={[Colors.SECONDARY, '#e6a416']}
                  style={styles.actionGradient}
                >
                  <BarChart size={28} color={Colors.WHITE} />
                  <View style={styles.actionText}>
                    <Text style={styles.actionTitle}>View Progress Analytics</Text>
                    <Text style={styles.actionSubtitle}>Track your wellness journey over time</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            
            {!isAllAnswered() && (
              <View style={styles.incompleteNotice}>
                <Clock size={20} color={Colors.WARNING} />
                <Text style={styles.incompleteText}>
                  Please complete all sections above to save your daily check-in and receive personalized insights
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
    paddingVertical: 100,
    paddingHorizontal: 60,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  heroContent: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    gap: 32,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.PRIMARY + '12',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.PRIMARY,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  heroText: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 52,
    fontWeight: '900',
    color: Colors.PRIMARY,
    marginBottom: 12,
    letterSpacing: -1.2,
    lineHeight: 60,
  },
  heroDate: {
    fontSize: 22,
    color: '#64748b',
    fontWeight: '500',
    letterSpacing: -0.2,
  },
  scoreContainer: {
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    borderRadius: 24,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    minWidth: 280,
  },
  scoreLabel: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 12,
    fontWeight: '500',
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: -1.5,
    marginBottom: 8,
  },
  scoreMessage: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    fontWeight: '500',
  },
  heroSubtitle: {
    fontSize: 20,
    color: '#64748b',
    lineHeight: 32,
    maxWidth: 800,
    fontWeight: '400',
  },
  mainContent: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 60,
  },
  section: {
    backgroundColor: Colors.WHITE,
    borderRadius: 24,
    padding: 48,
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
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.PRIMARY,
    letterSpacing: -0.8,
    flex: 1,
  },
  sectionDescription: {
    fontSize: 18,
    color: '#64748b',
    marginBottom: 40,
    lineHeight: 28,
    fontWeight: '400',
  },
  moodGrid: {
    flexDirection: 'row',
    gap: 24,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moodCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    padding: 32,
    width: '18%',
    minWidth: 200,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 4,
    position: 'relative',
  },
  moodEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  moodLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.PRIMARY,
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  moodDescription: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '400',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  optionsGrid: {
    gap: 20,
  },
  optionCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  optionLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.PRIMARY,
    flex: 1,
    letterSpacing: -0.2,
  },
  optionDescription: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 24,
    fontWeight: '400',
  },
  tipsSection: {
    backgroundColor: '#f8fafc',
    borderRadius: 24,
    padding: 48,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  tipsGrid: {
    flexDirection: 'row',
    gap: 32,
    flexWrap: 'wrap',
  },
  tipCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 32,
    flex: 1,
    minWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
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
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  tipTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.PRIMARY,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  tipText: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 26,
    fontWeight: '400',
  },
  actionsSection: {
    paddingVertical: 80,
    paddingHorizontal: 48,
    backgroundColor: 'white',
    borderRadius: 24,
    marginBottom: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 32,
    marginBottom: 24,
  },
  actionCard: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
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
    padding: 32,
    gap: 20,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    color: Colors.WHITE,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  actionSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },
  incompleteNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: Colors.WARNING + '10',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.WARNING + '30',
  },
  incompleteText: {
    fontSize: 16,
    color: Colors.WARNING,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 24,
  },
});