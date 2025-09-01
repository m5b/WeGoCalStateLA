import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Star,
  Trophy,
  Heart
} from 'lucide-react-native';
import Colors from '../../constant/Colors';

const { width } = Dimensions.get('window');

export default function EventsScreen() {
  const [todayInspiration] = useState(
    "Remember: Every small step towards wellness is a victory worth celebrating."
  );

  const events = [
    {
      id: 1,
      title: 'Mindfulness Meditation Session',
      date: 'Today',
      time: '3:00 PM',
      location: 'Student Union',
      category: 'Mental Health'
    },
    {
      id: 2,
      title: 'Stress Management Workshop',
      date: 'Tomorrow',
      time: '1:00 PM',
      location: 'Wellness Center',
      category: 'Workshop'
    },
    {
      id: 3,
      title: 'Golden Eagles Support Group',
      date: 'Wednesday',
      time: '5:00 PM',
      location: 'Health Center',
      category: 'Support'
    }
  ];

  const scores = [
    { label: 'Daily Check-ins', value: '7 days', icon: Heart, color: Colors.GREEN },
    { label: 'Quizzes Completed', value: '3', icon: Trophy, color: Colors.SECONDARY },
    { label: 'Wellness Score', value: '85%', icon: Star, color: Colors.PRIMARY }
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
          <Text style={styles.headerTitle}>Events & Progress</Text>
          <View style={styles.headerSpacer} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Daily Inspiration */}
        <View style={styles.inspirationCard}>
          <Text style={styles.inspirationLabel}>Daily Inspiration</Text>
          <Text style={styles.inspirationText}>{todayInspiration}</Text>
        </View>

        {/* Upcoming Events */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          {events.map((event) => (
            <View key={event.id} style={styles.eventCard}>
              <View style={styles.eventBorder} />
              <View style={styles.eventContent}>
                <View style={styles.eventHeader}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{event.category}</Text>
                  </View>
                </View>
                <View style={styles.eventDetails}>
                  <View style={styles.eventDetailRow}>
                    <Calendar size={16} color={Colors.PRIMARY} />
                    <Text style={styles.eventDate}>{event.date}</Text>
                  </View>
                  <View style={styles.eventDetailRow}>
                    <Clock size={16} color={Colors.SECONDARY} />
                    <Text style={styles.eventTime}>{event.time}</Text>
                  </View>
                  <View style={styles.eventDetailRow}>
                    <MapPin size={16} color={Colors.GRAY} />
                    <Text style={styles.eventLocation}>{event.location}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Progress Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
          <View style={styles.scoresGrid}>
            {scores.map((score, index) => (
              <View key={index} style={styles.scoreCard}>
                <View style={styles.scoreBorder} />
                <View style={styles.scoreContent}>
                  <View style={[styles.scoreIconContainer, { backgroundColor: score.color + '20' }]}>
                    <score.icon size={24} color={score.color} />
                  </View>
                  <Text style={styles.scoreLabel}>{score.label}</Text>
                  <Text style={[styles.scoreValue, { color: score.color }]}>{score.value}</Text>
                </View>
              </View>
            ))}
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
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  content: {
    flex: 1,
  },
  contentPadding: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  inspirationCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: 16,
    padding: 20,
    marginVertical: 20,
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: Colors.SECONDARY,
  },
  inspirationLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.SECONDARY,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  inspirationText: {
    fontSize: 16,
    color: Colors.DARK_GRAY,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    marginBottom: 16,
  },
  eventCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: 16,
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventBorder: {
    width: 4,
    backgroundColor: Colors.PRIMARY,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  eventContent: {
    flex: 1,
    padding: 20,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    flex: 1,
    marginRight: 12,
  },
  categoryBadge: {
    backgroundColor: Colors.LIGHT_BLUE + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    color: Colors.PRIMARY,
    fontWeight: '600',
  },
  eventDetails: {
    gap: 8,
  },
  eventDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventDate: {
    fontSize: 14,
    color: Colors.PRIMARY,
    marginLeft: 8,
    fontWeight: '600',
  },
  eventTime: {
    fontSize: 14,
    color: Colors.SECONDARY,
    marginLeft: 8,
    fontWeight: '600',
  },
  eventLocation: {
    fontSize: 14,
    color: Colors.GRAY,
    marginLeft: 8,
  },
  scoresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  scoreCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: 16,
    width: (width - 60) / 2,
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scoreBorder: {
    width: 4,
    backgroundColor: Colors.SECONDARY,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  scoreContent: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  scoreIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreLabel: {
    fontSize: 12,
    color: Colors.GRAY,
    textAlign: 'center',
    marginBottom: 4,
    fontWeight: '500',
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});