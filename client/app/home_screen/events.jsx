import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  Star,
  Trophy,
  Heart,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react-native';
import { Colors } from '../../constant/Colors';
import { getFeed } from '../../services/threads'; // threadStore

const { width } = Dimensions.get('window');

// ------- Event Card -------
function EventCard({ title, date, location, description, onPress, imageUrl }) {
  return (
    <TouchableOpacity
      activeOpacity={0.95}
      onPress={onPress}
      style={eventStyles.card}
    >
      {/* Image on top */}
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={eventStyles.eventImage}
        />
      ) : null}

      {/* Text content with left accent */}
      <View style={eventStyles.contentRow}>
        <View style={eventStyles.leftAccent} />
        <View style={eventStyles.inner}>
          <Text style={eventStyles.title}>{title}</Text>
          <Text style={eventStyles.date}>{date}</Text>
          <Text style={eventStyles.location}>{location}</Text>

          {description ? (
            <Text style={eventStyles.description}>{description}</Text>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function EventsScreen() {
  const [todayInspiration] = useState(
    'Remember: Every small step towards wellness is a victory worth celebrating.'
  );

  const [events, setEvents] = useState([]);          //holds event data
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  // load threads → convert to events
  useEffect(() => {
    async function loadEvents() {
      try {
        const threads = await getFeed(); // threads

        const mapped = threads
          .filter(t => t.imageUri || t.location || t.date || t.time)
          .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
          .map(t => ({
            id: t.id,
            title: t.caption || 'Shared Event',
            date: t.date || '',
            time: t.time || '',
            location: t.location || '',
            imageUrl: t.imageUri || null,
          }));

        setEvents(mapped);
        setCurrentEventIndex(0);
      } catch (e) {
        console.warn('Failed to load events', e);
      }
    }

    loadEvents();
  }, []);

  const scores = [
    { label: 'Daily Check-ins', value: '7 days', icon: Heart, color: Colors.GREEN },
    { label: 'Quizzes Completed', value: '3', icon: Trophy, color: Colors.SECONDARY },
    { label: 'Wellness Score', value: '85%', icon: Star, color: Colors.PRIMARY },
  ];

  const handleNextEvent = () => {
    if (!events.length) return;
    setCurrentEventIndex(prev => (prev + 1) % events.length);
  };

  const handlePrevEvent = () => {
    if (!events.length) return;
    setCurrentEventIndex(prev => (prev - 1 + events.length) % events.length);
  };

  const hasEvents = events.length > 0;
  const current = hasEvents ? events[currentEventIndex] : null;

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

        {/* Upcoming Events - Carousel */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>

          {hasEvents ? (
            <>
              <View style={styles.carouselRow}>
                {/* Left Arrow */}
                <TouchableOpacity
                  onPress={handlePrevEvent}
                  style={styles.arrowButton}
                  disabled={events.length <= 1}
                >
                  <ChevronLeft
                    size={26}
                    color={events.length <= 1 ? Colors.GRAY : Colors.PRIMARY}
                  />
                </TouchableOpacity>

                {/* Card container keeps arrows close to card */}
                <View style={styles.carouselCardContainer}>
                  <EventCard
                    title={current.title}
                    date={`${current.date}${current.time ? ` at ${current.time}` : ''}`}
                    location={current.location}
                    description={current.description}
                    imageUrl={current.imageUrl}
                    onPress={() => router.push(`/events/${current.id}`)}
                  />
                </View>

                {/* Right Arrow */}
                <TouchableOpacity
                  onPress={handleNextEvent}
                  style={styles.arrowButton}
                  disabled={events.length <= 1}
                >
                  <ChevronRight
                    size={26}
                    color={events.length <= 1 ? Colors.GRAY : Colors.PRIMARY}
                  />
                </TouchableOpacity>
              </View>

              {/* Dots indicator */}
              <View className="dotsRow" style={styles.dotsRow}>
                {events.map((event, index) => (
                  <View
                    key={event.id}
                    style={[
                      styles.dot,
                      index === currentEventIndex && styles.dotActive,
                    ]}
                  />
                ))}
              </View>
            </>
          ) : (
            <Text style={styles.noEventsText}>
              No events yet. Share one from the Threads tab!
            </Text>
          )}
        </View>

        {/* Progress Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
          <View style={styles.scoresGrid}>
            {scores.map((score, index) => (
              <View key={index} style={styles.scoreCard}>
                <View style={styles.scoreBorder} />
                <View style={styles.scoreContent}>
                  <View
                    style={[
                      styles.scoreIconContainer,
                      { backgroundColor: score.color + '20' },
                    ]}
                  >
                    <score.icon size={24} color={score.color} />
                  </View>
                  <Text style={styles.scoreLabel}>{score.label}</Text>
                  <Text style={[styles.scoreValue, { color: score.color }]}>
                    {score.value}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const eventStyles = StyleSheet.create({
  card: {
    width: Math.min(360, width - 40),
    backgroundColor: Colors.WHITE,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  eventImage: {
    width: '100%',
    height: 180,
  },
  contentRow: {
    flexDirection: 'row',
    backgroundColor: Colors.WHITE,
  },
  leftAccent: {
    width: 6,
    backgroundColor: Colors.PRIMARY,
  },
  inner: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.PRIMARY,
    marginBottom: 6,
  },
  date: {
    color: Colors.PRIMARY,
    fontWeight: '600',
    marginBottom: 6,
  },
  location: {
    color: Colors.GRAY,
    marginBottom: 10,
  },
  description: {
    color: Colors.DARK_GRAY || '#333',
    fontSize: 14,
    lineHeight: 20,
  },
});

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
    textAlign: 'center',
  },
  // carousel
  carouselRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  carouselCardContainer: {
    width: Math.min(360, width - 40),
    alignItems: 'center',
  },
  arrowButton: {
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    columnGap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.GRAY,
    opacity: 0.4,
  },
  dotActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.PRIMARY,
    opacity: 1,
  },
  // progress cards
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
  noEventsText: {
  color: Colors.TEXT_MUTED,
  textAlign: "center",
  marginTop: 10,
  fontSize: 16,
},

});
