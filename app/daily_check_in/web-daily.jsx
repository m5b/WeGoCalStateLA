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
import { Typography, Spacing, BorderRadius, Shadows, Breakpoints } from '../../constant/DesignSystem';
import WebLayout from '../../components/WebLayout';
import { responsive, isBreakpoint, getContainerMaxWidth } from '../../utils/responsive';

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
    { value: 4, label: 'Good', emoji: '🙂', color: Colors.INFO, description: 'Generally positive and content', gradient: [Colors.INFO, Colors.INFO + '80'] },
    { value: 3, label: 'Neutral', emoji: '😐', color: Colors.GRAY_500, description: 'Neither good nor bad', gradient: [Colors.GRAY_500, Colors.GRAY_400] },
    { value: 2, label: 'Low', emoji: '😕', color: Colors.WARNING, description: 'Feeling down or unmotivated', gradient: [Colors.WARNING, Colors.WARNING + '80'] },
    { value: 1, label: 'Poor', emoji: '😞', color: Colors.ERROR, description: 'Struggling significantly today', gradient: [Colors.ERROR, Colors.ERROR + '80'] }
  ];

  const sleepOptions = [
    { value: 5, label: 'Excellent', color: Colors.SUCCESS, description: '8+ hours, felt refreshed', icon: Star, gradient: [Colors.SUCCESS, Colors.SUCCESS + '80'] },
    { value: 4, label: 'Good', color: Colors.INFO, description: '7-8 hours, mostly rested', icon: CheckCircle, gradient: [Colors.INFO, Colors.INFO + '80'] },
    { value: 3, label: 'Fair', color: Colors.GRAY_500, description: '6-7 hours, somewhat tired', icon: Clock, gradient: [Colors.GRAY_500, Colors.GRAY_400] },
    { value: 2, label: 'Poor', color: Colors.WARNING, description: '4-6 hours, quite tired', icon: Coffee, gradient: [Colors.WARNING, Colors.WARNING + '80'] },
    { value: 1, label: 'Very Poor', color: Colors.ERROR, description: 'Less than 4 hours, exhausted', icon: Moon, gradient: [Colors.ERROR, Colors.ERROR + '80'] }
  ];

  const stressOptions = [
    { value: 1, label: 'Minimal', color: Colors.SUCCESS, description: 'Calm and relaxed', icon: Smile, gradient: [Colors.SUCCESS, Colors.SUCCESS + '80'] },
    { value: 2, label: 'Low', color: Colors.INFO, description: 'Slightly tense but manageable', icon: Sun, gradient: [Colors.INFO, Colors.INFO + '80'] },
    { value: 3, label: 'Moderate', color: Colors.GRAY_500, description: 'Noticeable stress levels', icon: Activity, gradient: [Colors.GRAY_500, Colors.GRAY_400] },
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
                <Heart size={24} color={Colors.PRIMARY_600} />
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
                    colors={mood === item.value ? item.gradient : [Colors.GRAY_50, Colors.GRAY_100]}
                    style={styles.modernCardGradient}
                  >
                    <View style={styles.modernCardContent}>
                      <Text style={styles.modernOptionEmoji}>{item.emoji}</Text>
                      <Text style={[
                        styles.modernOptionLabel,
                        mood === item.value && { color: Colors.GRAY_900 }
                      ]}>
                        {item.label}
                      </Text>
                      <Text style={[
                        styles.modernOptionDescription,
                        mood === item.value && { color: Colors.GRAY_700 }
                      ]}>
                        {item.description}
                      </Text>
                    </View>
                    {mood === item.value && (
                      <View style={styles.selectedIndicator}>
                        <CheckCircle size={20} color={Colors.GRAY_900} />
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
                <Moon size={24} color={Colors.PRIMARY_600} />
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
                      colors={sleepQuality === item.value ? item.gradient : [Colors.GRAY_50, Colors.GRAY_100]}
                      style={styles.modernCardGradient}
                    >
                      <View style={styles.modernCardContent}>
                        <View style={[
                          styles.modernOptionIcon,
                          sleepQuality === item.value && { backgroundColor: Colors.GRAY_800 + '20' }
                        ]}>
                          <IconComponent 
                            size={24} 
                            color={sleepQuality === item.value ? Colors.GRAY_900 : item.color} 
                          />
                        </View>
                        <Text style={[
                          styles.modernOptionLabel,
                          sleepQuality === item.value && { color: Colors.GRAY_900 }
                        ]}>
                          {item.label}
                        </Text>
                        <Text style={[
                          styles.modernOptionDescription,
                          sleepQuality === item.value && { color: Colors.GRAY_700 }
                        ]}>
                          {item.description}
                        </Text>
                      </View>
                      {sleepQuality === item.value && (
                        <View style={styles.selectedIndicator}>
                          <CheckCircle size={20} color={Colors.GRAY_900} />
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
                <Brain size={24} color={Colors.PRIMARY_600} />
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
                      colors={stressLevel === item.value ? item.gradient : [Colors.GRAY_50, Colors.GRAY_100]}
                      style={styles.modernCardGradient}
                    >
                      <View style={styles.modernCardContent}>
                        <View style={[
                          styles.modernOptionIcon,
                          stressLevel === item.value && { backgroundColor: Colors.GRAY_800 + '20' }
                        ]}>
                          <IconComponent 
                            size={24} 
                            color={stressLevel === item.value ? Colors.GRAY_900 : item.color} 
                          />
                        </View>
                        <Text style={[
                          styles.modernOptionLabel,
                          stressLevel === item.value && { color: Colors.GRAY_900 }
                        ]}>
                          {item.label}
                        </Text>
                        <Text style={[
                          styles.modernOptionDescription,
                          stressLevel === item.value && { color: Colors.GRAY_700 }
                        ]}>
                          {item.description}
                        </Text>
                      </View>
                      {stressLevel === item.value && (
                        <View style={styles.selectedIndicator}>
                          <CheckCircle size={20} color={Colors.GRAY_900} />
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
                  colors={isAllAnswered() ? [Colors.PRIMARY_600, Colors.PRIMARY_700] : [Colors.GRAY_300, Colors.GRAY_400]}
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
                <BarChart size={20} color={Colors.PRIMARY_600} />
                <Text style={styles.modernSecondaryButtonText}>View Progress Analytics</Text>
                <ChevronRight size={16} color={Colors.GRAY_500} />
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
    backgroundColor: Colors.BACKGROUND_SECONDARY,
  },
  heroSection: {
    ...responsive({
      paddingVertical: { xs: Spacing[16], sm: Spacing[20], md: Spacing[20] * 2 },
      paddingHorizontal: { xs: Spacing[4], sm: Spacing[6], md: Spacing[20] },
    }),
    backgroundColor: Colors.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: Colors.BORDER,
  },
  heroContent: {
    maxWidth: getContainerMaxWidth(),
    alignSelf: 'center',
    width: '100%',
  },
  heroHeader: {
    ...responsive({
      flexDirection: { xs: 'column', sm: 'row' },
      alignItems: { xs: 'center', sm: 'center' },
      marginBottom: { xs: Spacing[8], sm: Spacing[10], md: Spacing[12] },
      gap: { xs: Spacing[6], sm: Spacing[8], md: Spacing[12] },
      textAlign: { xs: 'center', sm: 'left' },
    }),
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.PRIMARY_50,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.web.lg,
  },
  heroText: {
    flex: 1,
  },
  heroTitle: {
    ...responsive({
      fontSize: { xs: Typography.fontSize['2xl'], sm: Typography.fontSize['3xl'], md: Typography.fontSize['4xl'] },
      textAlign: { xs: 'center', sm: 'left' },
    }),
    fontWeight: Typography.fontWeight.black,
    color: Colors.PRIMARY_900,
    marginBottom: Spacing[2],
    letterSpacing: Typography.letterSpacing.tight,
    lineHeight: Typography.lineHeight.tight,
  },
  heroSubtitle: {
    fontSize: Typography.fontSize.lg,
    color: Colors.TEXT_SECONDARY,
    fontWeight: Typography.fontWeight.medium,
    letterSpacing: Typography.letterSpacing.normal,
  },
  heroDescription: {
    fontSize: Typography.fontSize.base,
    color: Colors.TEXT_SECONDARY,
    lineHeight: Typography.lineHeight.relaxed,
    marginTop: Spacing[8],
    maxWidth: 600,
  },
  // Progress Indicator Styles
  progressContainer: {
    marginTop: Spacing[12],
    backgroundColor: Colors.WHITE,
    borderRadius: BorderRadius.xl,
    padding: Spacing[8],
    borderWidth: 1,
    borderColor: Colors.BORDER,
    ...Shadows.web.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[6],
  },
  progressText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.TEXT,
  },
  progressPercentage: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.PRIMARY_600,
  },
  progressBarContainer: {
    marginBottom: Spacing[6],
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: Colors.GRAY_200,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.PRIMARY_500,
    borderRadius: BorderRadius.full,
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
    fontSize: Typography.fontSize.xs,
    color: Colors.GRAY_500,
    fontWeight: Typography.fontWeight.medium,
  },
  progressStepTextCompleted: {
    color: Colors.PRIMARY_600,
    fontWeight: Typography.fontWeight.semibold,
  },
  mainContent: {
    maxWidth: getContainerMaxWidth(),
    alignSelf: 'center',
    width: '100%',
    ...responsive({
      paddingHorizontal: { xs: Spacing[4], sm: Spacing[6], md: Spacing[20] },
    }),
  },
  // Modern Section Styles
  modernSection: {
    backgroundColor: Colors.WHITE,
    borderRadius: BorderRadius.xl,
    padding: Spacing[20],
    marginBottom: Spacing[12],
    ...Shadows.web.md,
    borderWidth: 1,
    borderColor: Colors.BORDER,
  },
  modernSectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing[8],
    gap: Spacing[8],
  },
  sectionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.PRIMARY_50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitleContainer: {
    flex: 1,
  },
  modernSectionTitle: {
    fontSize: Typography.fontSize['4xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.TEXT,
    marginBottom: Spacing[1],
    letterSpacing: Typography.letterSpacing.tight,
  },
  modernSectionDescription: {
    fontSize: Typography.fontSize.base,
    color: Colors.TEXT_SECONDARY,
    lineHeight: Typography.lineHeight.relaxed,
  },
  // Modern Options Grid
  modernOptionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    ...responsive({
      gap: { xs: Spacing[3], sm: Spacing[4], md: Spacing[8] },
      justifyContent: { xs: 'center', sm: 'space-between' },
    }),
  },
  modernOptionCard: {
    ...responsive({
      width: { xs: '45%', sm: '30%', md: '18%' },
      minWidth: { xs: 140, sm: 160, md: 180 },
    }),
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.web.sm,
    borderWidth: 1,
    borderColor: Colors.BORDER,
  },
  modernSelectedCard: {
    ...Shadows.lg,
    borderColor: Colors.PRIMARY_300,
    borderWidth: 2,
  },
  modernCardGradient: {
    ...responsive({
      padding: { xs: Spacing[4], sm: Spacing[6], md: Spacing[8] },
      minHeight: { xs: 120, sm: 130, md: 140 },
    }),
    justifyContent: 'space-between',
  },
  modernCardContent: {
    alignItems: 'center',
    flex: 1,
  },
  modernOptionEmoji: {
    fontSize: 32,
    marginBottom: Spacing[2],
  },
  modernOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.GRAY_100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing[2],
  },
  modernOptionLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.GRAY_900,
    marginBottom: Spacing[1],
    textAlign: 'center',
  },
  modernOptionDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.snug,
  },
  selectedIndicator: {
    position: 'absolute',
    top: Spacing[2],
    right: Spacing[2],
  },
  // Modern Actions Section
  modernActionsSection: {
    paddingVertical: Spacing[12],
    paddingHorizontal: Spacing[12],
    backgroundColor: Colors.WHITE,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing[20],
    ...Shadows.web.md,
    borderWidth: 1,
    borderColor: Colors.BORDER,
  },
  modernActionContainer: {
    marginBottom: Spacing[8],
  },
  modernSaveButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.web.sm,
  },
  modernSaveButtonEnabled: {
    ...Shadows.lg,
  },
  modernSaveButtonDisabled: {
    opacity: 0.6,
  },
  modernButtonGradient: {
    paddingVertical: Spacing[8],
    paddingHorizontal: Spacing[12],
    minHeight: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  modernSaveButtonText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.WHITE,
    letterSpacing: Typography.letterSpacing.wide,
  },
  modernSaveButtonTextDisabled: {
    color: Colors.GRAY_500,
  },
  modernSecondaryButton: {
    backgroundColor: Colors.BACKGROUND_SECONDARY,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    paddingVertical: Spacing[6],
    paddingHorizontal: Spacing[8],
  },
  secondaryButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[2],
  },
  modernSecondaryButtonText: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.PRIMARY_600,
  },
  incompleteNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[2],
    backgroundColor: Colors.WARNING + '10',
    borderRadius: BorderRadius.lg,
    padding: Spacing[8],
    borderWidth: 1,
    borderColor: Colors.WARNING + '30',
    marginTop: Spacing[8],
  },
  incompleteText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.WARNING,
    fontWeight: Typography.fontWeight.medium,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed,
    flex: 1,
  },
});