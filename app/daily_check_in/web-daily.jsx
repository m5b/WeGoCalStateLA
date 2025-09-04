import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Save, ChartBar as BarChart, Calendar, Moon, Brain, Heart, TrendingUp, CircleCheck as CheckCircle, Clock, Target, Award, Zap, Activity, Star, Sun, Coffee, Smile, ArrowRight, ChevronRight } from 'lucide-react-native';
import Colors from '../../constant/Colors';
import WebLayout from '../../components/WebLayout';

const { width } = Dimensions.get('window');

export default function WebDailyCheckInScreen() {
  const [mood, setMood] = useState(null);
  const [sleepQuality, setSleepQuality] = useState(null);
  const [stressLevel, setStressLevel] = useState(null);
  const [date, setDate] = useState(new Date());
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progressAnimation] = useState(new Animated.Value(0));
  const [completionAnimation] = useState(new Animated.Value(0));

  // Calculate progress percentage
  const getProgress = () => {
    let completed = 0;
    if (mood !== null) completed++;
    if (sleepQuality !== null) completed++;
    if (stressLevel !== null) completed++;
    return (completed / 3) * 100;
  };

  // Animate progress bar
  useEffect(() => {
    Animated.timing(progressAnimation, {
      toValue: getProgress(),
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [mood, sleepQuality, stressLevel]);

  // Animate completion
  useEffect(() => {
    if (isAllAnswered()) {
      Animated.spring(completionAnimation, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      completionAnimation.setValue(0);
    }
  }, [mood, sleepQuality, stressLevel]);

  const moods = [
    { value: 5, label: 'Excellent', emoji: '😁', color: Colors.SUCCESS, description: 'Feeling fantastic and energized', gradient: [Colors.SUCCESS, Colors.SUCCESS + '80'] },
    { value: 4, label: 'Good', emoji: '🙂', color: '#3B82F6', description: 'Generally positive and content', gradient: ['#3B82F6', '#3B82F6' + '80'] },
    { value: 3, label: 'Neutral', emoji: '😐', color: '#6B7280', description: 'Neither good nor bad', gradient: ['#6B7280', '#9CA3AF'] },
    { value: 2, label: 'Low', emoji: '😕', color: Colors.WARNING, description: 'Feeling down or unmotivated', gradient: [Colors.WARNING, Colors.WARNING + '80'] },
    { value: 1, label: 'Poor', emoji: '😞', color: Colors.ERROR, description: 'Struggling significantly today', gradient: [Colors.ERROR, Colors.ERROR + '80'] }
  ];

  const sleepOptions = [
    { value: 5, label: 'Excellent', color: Colors.SUCCESS, description: '8+ hours, felt refreshed', icon: Star, gradient: [Colors.SUCCESS, Colors.SUCCESS + '80'] },
    { value: 4, label: 'Good', color: '#3B82F6', description: '7-8 hours, mostly rested', icon: CheckCircle, gradient: ['#3B82F6', '#3B82F6' + '80'] },
    { value: 3, label: 'Fair', color: '#6B7280', description: '6-7 hours, somewhat tired', icon: Clock, gradient: ['#6B7280', '#9CA3AF'] },
    { value: 2, label: 'Poor', color: Colors.WARNING, description: '4-6 hours, quite tired', icon: Coffee, gradient: [Colors.WARNING, Colors.WARNING + '80'] },
    { value: 1, label: 'Very Poor', color: Colors.ERROR, description: 'Less than 4 hours, exhausted', icon: Moon, gradient: [Colors.ERROR, Colors.ERROR + '80'] }
  ];

  const stressOptions = [
    { value: 1, label: 'Minimal', color: Colors.SUCCESS, description: 'Calm and relaxed', icon: Smile, gradient: [Colors.SUCCESS, Colors.SUCCESS + '80'] },
    { value: 2, label: 'Low', color: '#3B82F6', description: 'Slightly tense but manageable', icon: Sun, gradient: ['#3B82F6', '#3B82F6' + '80'] },
    { value: 3, label: 'Moderate', color: '#6B7280', description: 'Noticeable stress levels', icon: Activity, gradient: ['#6B7280', '#9CA3AF'] },
    { value: 4, label: 'High', color: Colors.WARNING, description: 'Feeling overwhelmed', icon: Zap, gradient: [Colors.WARNING, Colors.WARNING + '80'] },
    { value: 5, label: 'Severe', color: Colors.ERROR, description: 'Extremely stressed and anxious', icon: Brain, gradient: [Colors.ERROR, Colors.ERROR + '80'] }
  ];

  const isAllAnswered = () => {
    return mood !== null && sleepQuality !== null && stressLevel !== null;
  };

  const handleSave = async () => {
    if (!isAllAnswered()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const checkInData = {
        date: date.toISOString().split('T')[0],
        mood,
        sleepQuality,
        stressLevel,
        wellnessScore: getWellnessScore(),
        timestamp: new Date().toISOString()
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Saving check-in data:', checkInData);
      
      router.push('/daily_check_in/progress');
    } catch (error) {
      console.error('Error saving check-in:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWellnessScore = () => {
    if (!isAllAnswered()) return null;
    const total = mood + sleepQuality + (6 - stressLevel); // Invert stress for scoring
    return Math.round((total / 15) * 100);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return Colors.SUCCESS;
    if (score >= 60) return '#3B82F6';
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
      color: '#3B82F6',
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
            
            {/* Progress Indicator */}
            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressText}>Progress</Text>
                <Text style={styles.progressPercentage}>{Math.round(getProgress())}%</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBackground}>
                  <Animated.View 
                    style={[
                      styles.progressBarFill,
                      {
                        width: progressAnimation.interpolate({
                          inputRange: [0, 100],
                          outputRange: ['0%', '100%'],
                          extrapolate: 'clamp',
                        })
                      }
                    ]}
                  />
                </View>
              </View>
              <View style={styles.progressSteps}>
                <View style={[styles.progressStep, mood !== null && styles.progressStepCompleted]}>
                  <Text style={[styles.progressStepText, mood !== null && styles.progressStepTextCompleted]}>Mood</Text>
                </View>
                <View style={[styles.progressStep, sleepQuality !== null && styles.progressStepCompleted]}>
                  <Text style={[styles.progressStepText, sleepQuality !== null && styles.progressStepTextCompleted]}>Sleep</Text>
                </View>
                <View style={[styles.progressStep, stressLevel !== null && styles.progressStepCompleted]}>
                  <Text style={[styles.progressStepText, stressLevel !== null && styles.progressStepTextCompleted]}>Stress</Text>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.mainContent}>
          {/* Mood Section */}
          <View style={styles.modernSection}>
            <View style={styles.modernSectionHeader}>
              <View style={styles.sectionIconContainer}>
                <Heart size={24} color={Colors.PRIMARY} />
              </View>
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.modernSectionTitle}>How are you feeling today?</Text>
                <Text style={styles.modernSectionDescription}>
                  Rate your overall emotional state and mood for today
                </Text>
              </View>
            </View>
            <View style={styles.modernOptionsGrid}>
              {moods.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.modernOptionCard,
                    mood === item.value && styles.modernSelectedCard
                  ]}
                  onPress={() => setMood(item.value)}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={mood === item.value ? item.gradient : ['#f9fafb', '#f3f4f6']}
                    style={styles.modernCardGradient}
                  >
                    <View style={styles.modernCardContent}>
                      <Text style={styles.modernOptionEmoji}>{item.emoji}</Text>
                      <Text style={[
                        styles.modernOptionLabel,
                        mood === item.value && { color: '#111827' }
                      ]}>
                        {item.label}
                      </Text>
                      <Text style={[
                        styles.modernOptionDescription,
                        mood === item.value && { color: '#374151' }
                      ]}>
                        {item.description}
                      </Text>
                    </View>
                    {mood === item.value && (
                      <View style={styles.selectedIndicator}>
                        <CheckCircle size={20} color="#111827" />
                      </View>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Sleep Quality Section */}
          <View style={styles.modernSection}>
            <View style={styles.modernSectionHeader}>
              <View style={styles.sectionIconContainer}>
                <Moon size={24} color={Colors.PRIMARY} />
              </View>
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.modernSectionTitle}>How well did you sleep last night?</Text>
                <Text style={styles.modernSectionDescription}>
                  Quality sleep is crucial for mental health and daily performance
                </Text>
              </View>
            </View>
            <View style={styles.modernOptionsGrid}>
              {sleepOptions.map((item) => {
                const IconComponent = item.icon;
                return (
                  <TouchableOpacity
                    key={item.value}
                    style={[
                      styles.modernOptionCard,
                      sleepQuality === item.value && styles.modernSelectedCard
                    ]}
                    onPress={() => setSleepQuality(item.value)}
                    activeOpacity={0.7}
                  >
                    <LinearGradient
                      colors={sleepQuality === item.value ? item.gradient : ['#f9fafb', '#f3f4f6']}
                      style={styles.modernCardGradient}
                    >
                      <View style={styles.modernCardContent}>
                        <View style={[
                          styles.modernOptionIcon,
                          sleepQuality === item.value && { backgroundColor: '#1f2937' + '20' }
                        ]}>
                          <IconComponent 
                            size={24} 
                            color={sleepQuality === item.value ? '#111827' : item.color} 
                          />
                        </View>
                        <Text style={[
                          styles.modernOptionLabel,
                          sleepQuality === item.value && { color: '#111827' }
                        ]}>
                          {item.label}
                        </Text>
                        <Text style={[
                          styles.modernOptionDescription,
                          sleepQuality === item.value && { color: '#374151' }
                        ]}>
                          {item.description}
                        </Text>
                      </View>
                      {sleepQuality === item.value && (
                        <View style={styles.selectedIndicator}>
                          <CheckCircle size={20} color="#111827" />
                        </View>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Stress Level Section */}
          <View style={styles.modernSection}>
            <View style={styles.modernSectionHeader}>
              <View style={styles.sectionIconContainer}>
                <Brain size={24} color={Colors.PRIMARY} />
              </View>
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.modernSectionTitle}>What's your stress level today?</Text>
                <Text style={styles.modernSectionDescription}>
                  Understanding your stress helps identify triggers and coping strategies
                </Text>
              </View>
            </View>
            <View style={styles.modernOptionsGrid}>
              {stressOptions.map((item) => {
                const IconComponent = item.icon;
                return (
                  <TouchableOpacity
                    key={item.value}
                    style={[
                      styles.modernOptionCard,
                      stressLevel === item.value && styles.modernSelectedCard
                    ]}
                    onPress={() => setStressLevel(item.value)}
                    activeOpacity={0.7}
                  >
                    <LinearGradient
                      colors={stressLevel === item.value ? item.gradient : ['#f9fafb', '#f3f4f6']}
                      style={styles.modernCardGradient}
                    >
                      <View style={styles.modernCardContent}>
                        <View style={[
                          styles.modernOptionIcon,
                          stressLevel === item.value && { backgroundColor: '#1f2937' + '20' }
                        ]}>
                          <IconComponent 
                            size={24} 
                            color={stressLevel === item.value ? '#111827' : item.color} 
                          />
                        </View>
                        <Text style={[
                          styles.modernOptionLabel,
                          stressLevel === item.value && { color: '#111827' }
                        ]}>
                          {item.label}
                        </Text>
                        <Text style={[
                          styles.modernOptionDescription,
                          stressLevel === item.value && { color: '#374151' }
                        ]}>
                          {item.description}
                        </Text>
                      </View>
                      {stressLevel === item.value && (
                        <View style={styles.selectedIndicator}>
                          <CheckCircle size={20} color="#111827" />
                        </View>
                      )}
                    </LinearGradient>
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
          <View style={styles.modernActionsSection}>
            <Animated.View 
              style={[
                styles.modernActionContainer,
                {
                  transform: [{
                    scale: completionAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.02],
                      extrapolate: 'clamp',
                    })
                  }]
                }
              ]}
            >
              <TouchableOpacity 
                style={[
                  styles.modernSaveButton,
                  !isAllAnswered() && styles.modernSaveButtonDisabled,
                  isAllAnswered() && styles.modernSaveButtonEnabled
                ]}
                onPress={handleSave}
                disabled={!isAllAnswered() || isSubmitting}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={isAllAnswered() ? [Colors.PRIMARY, '#1e40af'] : ['#d1d5db', '#9ca3af']}
                  style={styles.modernButtonGradient}
                >
                  {isSubmitting ? (
                    <View style={styles.loadingContainer}>
                      <Text style={styles.modernSaveButtonText}>Saving...</Text>
                    </View>
                  ) : (
                    <View style={styles.buttonContent}>
                      <Text style={[
                        styles.modernSaveButtonText,
                        !isAllAnswered() && styles.modernSaveButtonTextDisabled
                      ]}>
                        {isAllAnswered() ? 'Complete Check-in' : 'Complete All Sections'}
                      </Text>
                      {isAllAnswered() && (
                        <ArrowRight size={20} color={Colors.WHITE} />
                      )}
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
            
            <TouchableOpacity 
              style={styles.modernSecondaryButton}
              onPress={() => router.push('/daily_check_in/progress')}
              activeOpacity={0.7}
            >
              <View style={styles.secondaryButtonContent}>
                <BarChart size={20} color={Colors.PRIMARY} />
                <Text style={styles.modernSecondaryButtonText}>View Progress Analytics</Text>
                <ChevronRight size={16} color="#6b7280" />
              </View>
            </TouchableOpacity>
            
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
    backgroundColor: '#f8fafc',
  },
  heroSection: {
    paddingVertical: width < 640 ? 40 : width < 1024 ? 60 : 80,
    paddingHorizontal: width < 640 ? 16 : width < 1024 ? 32 : 60,
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
    flexDirection: width < 640 ? 'column' : 'row',
    alignItems: 'center',
    marginBottom: width < 640 ? 24 : width < 1024 ? 32 : 40,
    gap: width < 640 ? 20 : width < 1024 ? 24 : 32,
    textAlign: width < 640 ? 'center' : 'left',
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.PRIMARY + '15',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },
  heroText: {
    flex: 1,
  },
  heroTitle: {
    fontSize: width < 640 ? 28 : width < 1024 ? 36 : 42,
    textAlign: width < 640 ? 'center' : 'left',
    fontWeight: '800',
    color: Colors.PRIMARY,
    marginBottom: 8,
    letterSpacing: -1,
  },
  heroDate: {
    fontSize: width < 640 ? 16 : 18,
    color: '#64748b',
    fontWeight: '500',
    textAlign: width < 640 ? 'center' : 'left',
  },
  scoreContainer: {
    alignItems: width < 640 ? 'center' : 'flex-end',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
    fontWeight: '500',
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: -1,
  },
  scoreMessage: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
  heroSubtitle: {
    fontSize: width < 640 ? 16 : 18,
    color: '#64748b',
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: width < 640 ? 24 : 28,
    textAlign: width < 640 ? 'center' : 'left',
    marginBottom: 32,
  },
  // Progress Indicator Styles
  progressContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.PRIMARY,
  },
  progressBarContainer: {
    marginBottom: 16,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.PRIMARY,
    borderRadius: 4,
  },
  progressSteps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressStep: {
    alignItems: 'center',
    flex: 1,
  },
  progressStepCompleted: {
    // Additional styles for completed steps
  },
  progressStepText: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  progressStepTextCompleted: {
    color: Colors.PRIMARY,
    fontWeight: '600',
  },
  mainContent: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: width < 640 ? 16 : width < 1024 ? 32 : 60,
  },
  // Modern Section Styles
  modernSection: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: width < 640 ? 24 : width < 1024 ? 32 : 40,
    marginBottom: width < 640 ? 24 : 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  modernSectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 32,
    gap: 16,
  },
  sectionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.PRIMARY + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitleContainer: {
    flex: 1,
  },
  modernSectionTitle: {
    fontSize: width < 640 ? 20 : width < 1024 ? 24 : 28,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  modernSectionDescription: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 24,
  },
  // Modern Options Grid
  modernOptionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: width < 640 ? 12 : width < 1024 ? 16 : 20,
    justifyContent: width < 640 ? 'center' : 'space-between',
  },
  modernOptionCard: {
    width: width < 640 ? '48%' : width < 1024 ? '30%' : '18%',
    minWidth: width < 640 ? 140 : width < 1024 ? 160 : 180,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  modernSelectedCard: {
    shadowOpacity: 0.15,
    shadowRadius: 16,
    borderColor: Colors.PRIMARY + '50',
    borderWidth: 2,
  },
  modernCardGradient: {
    padding: width < 640 ? 16 : width < 1024 ? 20 : 24,
    minHeight: width < 640 ? 120 : width < 1024 ? 130 : 140,
    justifyContent: 'space-between',
  },
  modernCardContent: {
    alignItems: 'center',
    flex: 1,
  },
  modernOptionEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  modernOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  modernOptionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
    textAlign: 'center',
  },
  modernOptionDescription: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 16,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  // Tips Section
  tipsSection: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: width < 640 ? 24 : width < 1024 ? 32 : 40,
    marginBottom: width < 640 ? 24 : 32,
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
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: width < 640 ? 20 : width < 1024 ? 24 : 28,
    fontWeight: '700',
    color: Colors.PRIMARY,
    letterSpacing: -0.5,
  },
  tipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: width < 640 ? 16 : 20,
    justifyContent: width < 640 ? 'center' : 'space-between',
  },
  tipCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 20,
    width: width < 640 ? '100%' : width < 1024 ? '48%' : '31%',
    minWidth: width < 640 ? 0 : 280,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  tipIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  // Modern Actions Section
  modernActionsSection: {
    paddingVertical: width < 640 ? 32 : 40,
    paddingHorizontal: width < 640 ? 24 : 32,
    backgroundColor: 'white',
    borderRadius: 20,
    marginBottom: width < 640 ? 40 : 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  modernActionContainer: {
    marginBottom: 20,
  },
  modernSaveButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  modernSaveButtonEnabled: {
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  modernSaveButtonDisabled: {
    opacity: 0.6,
  },
  modernButtonGradient: {
    paddingVertical: 20,
    paddingHorizontal: 32,
    minHeight: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modernSaveButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.WHITE,
    letterSpacing: 0.3,
  },
  modernSaveButtonTextDisabled: {
    color: '#6b7280',
  },
  modernSecondaryButton: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  secondaryButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  modernSecondaryButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.PRIMARY,
  },
  incompleteNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: Colors.WARNING + '10',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.WARNING + '30',
    marginTop: 20,
  },
  incompleteText: {
    fontSize: 14,
    color: Colors.WARNING,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 20,
    flex: 1,
  },
});