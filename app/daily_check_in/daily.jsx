import React, { useState } from 'react';
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
import { ArrowLeft, Save, BarChart } from 'lucide-react-native';
import Colors from '../../constant/Colors';
import WebDailyCheckInScreen from './web-daily';

const { width } = Dimensions.get('window');

export default function DailyCheckInScreen() {
  // Render web version on web platform
  if (Platform.OS === 'web') {
    return <WebDailyCheckInScreen />;
  }
  const [mood, setMood] = useState(null);
  const [sleepQuality, setSleepQuality] = useState(null);
  const [stressLevel, setStressLevel] = useState(null);
  const [date, setDate] = useState(new Date());

  const moods = [
    { value: 5, label: 'Great', emoji: '😁', color: Colors.SUCCESS },
    { value: 4, label: 'Good', emoji: '🙂', color: Colors.INFO },
    { value: 3, label: 'Okay', emoji: '😐', color: Colors.SECONDARY },
    { value: 2, label: 'Not Great', emoji: '😕', color: Colors.WARNING },
    { value: 1, label: 'Poor', emoji: '😞', color: Colors.ERROR }
  ];

  const sleepOptions = [
    { value: 5, label: 'Excellent', color: Colors.SUCCESS },
    { value: 4, label: 'Good', color: Colors.INFO },
    { value: 3, label: 'Fair', color: Colors.SECONDARY },
    { value: 2, label: 'Poor', color: Colors.WARNING },
    { value: 1, label: 'Very Poor', color: Colors.ERROR }
  ];

  const stressOptions = [
    { value: 1, label: 'None', color: Colors.SUCCESS },
    { value: 2, label: 'Mild', color: Colors.INFO },
    { value: 3, label: 'Moderate', color: Colors.SECONDARY },
    { value: 4, label: 'High', color: Colors.WARNING },
    { value: 5, label: 'Severe', color: Colors.ERROR }
  ];

  const isAllAnswered = () => {
    return mood !== null && sleepQuality !== null && stressLevel !== null;
  };

  const handleSave = () => {
    // This would save the check-in data to AsyncStorage or context
    // For now, we'll just navigate to the progress screen
    router.push('/daily_check_in/progress');
  };

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
          <Text style={styles.headerTitle}>Daily Check-In</Text>
          <View style={styles.headerSpacer} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.contentPadding}>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>
              {date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
          </View>

          {/* Mood Section */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>How are you feeling today?</Text>
            <View style={styles.moodContainer}>
              {moods.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.moodButton,
                    mood === item.value && { borderColor: item.color, borderWidth: 2 }
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
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Sleep Quality Section */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>How well did you sleep last night?</Text>
            <View style={styles.optionsContainer}>
              {sleepOptions.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.optionButton,
                    sleepQuality === item.value && { backgroundColor: item.color + '20', borderColor: item.color }
                  ]}
                  onPress={() => setSleepQuality(item.value)}
                >
                  <Text style={[
                    styles.optionText,
                    sleepQuality === item.value && { color: item.color, fontWeight: 'bold' }
                  ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Stress Level Section */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>What's your stress level today?</Text>
            <View style={styles.optionsContainer}>
              {stressOptions.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.optionButton,
                    stressLevel === item.value && { backgroundColor: item.color + '20', borderColor: item.color }
                  ]}
                  onPress={() => setStressLevel(item.value)}
                >
                  <Text style={[
                    styles.optionText,
                    stressLevel === item.value && { color: item.color, fontWeight: 'bold' }
                  ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, !isAllAnswered() && styles.disabledButton]}
              onPress={handleSave}
              disabled={!isAllAnswered()}
            >
              <LinearGradient
                colors={isAllAnswered() ? [Colors.PRIMARY, Colors.DARK_BLUE] : [Colors.GRAY, Colors.GRAY_DARK]}
                style={styles.actionGradient}
              >
                <Save size={20} color={Colors.WHITE} />
                <Text style={styles.actionText}>Save Today's Check-In</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/daily_check_in/progress')}
            >
              <LinearGradient
                colors={[Colors.SECONDARY, Colors.DARK_GOLD]}
                style={styles.actionGradient}
              >
                <BarChart size={20} color={Colors.WHITE} />
                <Text style={styles.actionText}>View Progress</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.WHITE,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentPadding: {
    padding: 20,
  },
  dateContainer: {
    marginBottom: 15,
  },
  dateText: {
    fontSize: 16,
    color: Colors.TEXT_SECONDARY,
    textAlign: 'center',
  },
  sectionCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.TEXT,
    marginBottom: 15,
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  moodButton: {
    width: (width - 80) / 5,
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.BORDER,
  },
  moodEmoji: {
    fontSize: 28,
    marginBottom: 5,
  },
  moodLabel: {
    fontSize: 12,
    color: Colors.TEXT,
    textAlign: 'center',
  },
  optionsContainer: {
    flexDirection: 'column',
    width: '100%',
  },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: Colors.LIGHT_GRAY,
    borderWidth: 1,
    borderColor: Colors.BORDER,
  },
  optionText: {
    fontSize: 16,
    color: Colors.TEXT,
    textAlign: 'center',
  },
  actionsContainer: {
    marginVertical: 20,
  },
  actionButton: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  disabledButton: {
    opacity: 0.7,
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  actionText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});