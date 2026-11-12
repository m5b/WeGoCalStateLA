import React, { useState, useCallback } from 'react';
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
import { router, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  CalendarDays,
  Lock,
} from 'lucide-react-native';
import { Colors } from '../../constant/Colors';
import { getEvents } from '../../services/events';
import WebLayout from '../../components/WebLayout';
import Pagination from '../../components/Pagination';
import { formatEventDate } from '../../utils/formatEventDate';

const { width } = Dimensions.get('window');
const DAY_MS = 24 * 60 * 60 * 1000;
const UPCOMING_WINDOW_DAYS = 30;
// How many events fit on one page of each list, and how tall a card is. Every card is the same size
// whether or not the event has a picture, so the rows line up.
const UPCOMING_PER_PAGE = width >= 1000 ? 3 : width >= 700 ? 2 : 1;
const LATER_PER_PAGE = width >= 1200 ? 10 : 6;
const EVENT_CARD_HEIGHT = 330;
const LATER_EVENT_CARD_HEIGHT = 250;
const EVENT_CARD_WIDTH =
  width >= 1200 ? 260 : Math.min(320, width - 88);
const LATER_EVENT_CARD_WIDTH =
  width >= 1200 ? 175 : EVENT_CARD_WIDTH;
const LATER_GRID_GAP = 12;
const LATER_GRID_MAX_WIDTH = LATER_EVENT_CARD_WIDTH * 5 + LATER_GRID_GAP * 4;
const EVENT_CARD_BACKGROUND = '#fff8d6';
const EVENT_TEXT_COLOR = '#000000';

function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function parseEventDate(date) {
  if (!date) return null;
  const isoDateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date.trim());
  const parsed = isoDateMatch
    ? new Date(
      Number(isoDateMatch[1]),
      Number(isoDateMatch[2]) - 1,
      Number(isoDateMatch[3])
    )
    : new Date(date);
  if (Number.isNaN(parsed.getTime())) return null;
  parsed.setHours(0, 0, 0, 0);
  return parsed;
}

function getEventTitle(event) {
  return (event.title || event.caption || event.text || '').trim();
}

// ------- Event Card -------
function EventCard({ title, date, location, description, author, onPress, imageUrl, isPublic = true, locked = false, compact = false }) {
  return (
    <TouchableOpacity
      activeOpacity={0.95}
      onPress={onPress}
      style={[
        eventStyles.card,
        compact && eventStyles.compactCard,
      ]}
    >
      {/* Every card has a picture area of the same size: the event's picture, or a plain panel without one. */}
      {imageUrl && !locked ? (
        <Image
          source={{ uri: imageUrl }}
          style={[
            eventStyles.eventImage,
            compact && eventStyles.compactImage,
          ]}
        />
      ) : (
        <View
          style={[
            eventStyles.eventImage,
            eventStyles.imagePlaceholder,
            compact && eventStyles.compactImage,
          ]}
        >
          {locked ? (
            <Lock size={compact ? 22 : 30} color={Colors.TEXT_MUTED} />
          ) : (
            <CalendarDays size={compact ? 22 : 30} color={Colors.TEXT_MUTED} />
          )}
        </View>
      )}
      {!isPublic ? (
        <View style={eventStyles.privateBadgeFloating}>
          <Lock size={11} color={Colors.WHITE} />
          <Text style={eventStyles.privateBadgeText}>Private</Text>
        </View>
      ) : null}

      {/* Text content */}
      <View style={eventStyles.contentRow}>
        <View style={eventStyles.leftAccent} />
        <View style={[eventStyles.inner, compact && eventStyles.compactInner]}>
          <Text numberOfLines={2} style={[eventStyles.title, compact && eventStyles.compactTitle]}>{title}</Text>
          {author ? <Text numberOfLines={1} style={eventStyles.author}>by {author}</Text> : null}
          {date ? <Text style={[eventStyles.date, compact && eventStyles.compactDate]}>{date}</Text> : null}
          {location ? (
            <Text style={[eventStyles.location, compact && eventStyles.compactLocation]}>
              {location}
            </Text>
          ) : null}

          {description ? (
            <Text
              numberOfLines={compact ? 2 : 3}
              style={[eventStyles.description, compact && eventStyles.compactDescription]}
            >
              {description}
            </Text>
          ) : null}

          {locked ? (
            <Text style={[eventStyles.description, compact && eventStyles.compactDescription]}>
              Sign in to see the details.
            </Text>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function EventsScreen() {
  const [todayInspiration] = useState(
    'Events shown in this evaluation are sample content. Tell us what kinds of gatherings would be useful to your family.'
  );

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [laterEvents, setLaterEvents] = useState([]);
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [laterPage, setLaterPage] = useState(1);

  useFocusEffect(
    useCallback(() => {
      async function loadEvents() {
        try {
          const events = await getEvents();

          const today = startOfToday();
          const upcomingCutoff = new Date(today.getTime() + UPCOMING_WINDOW_DAYS * DAY_MS);

          const mapped = events
            .map(event => {
              const title = getEventTitle(event);
              const eventDate = parseEventDate(event.date);

              if (!title || !eventDate) return null;

              return {
                id: event.id,
                title,
                date: event.date || '',
                time: event.time || '',
                location: event.location || '',
                description: event.description || (event.text && event.text !== title ? event.text : ''),
                imageUrl: event.imageUri || null,
                author: event.author || '',
                isPublic: event.isPublic,
                locked: event.locked,
                eventDate,
              };
            })
            .filter(Boolean)
            .filter(event => event.eventDate >= today)
            .sort((a, b) => a.eventDate - b.eventDate);

          setUpcomingEvents(mapped.filter(event => event.eventDate <= upcomingCutoff));
          setLaterEvents(mapped.filter(event => event.eventDate > upcomingCutoff));
          setUpcomingPage(1);
          setLaterPage(1);
        } catch (e) {
          console.warn('Failed to load events', e);
        }
      }

      loadEvents();
    }, [])
  );

  // Each list is shown a page at a time, with page numbers underneath.
  const upcomingPages = Math.max(1, Math.ceil(upcomingEvents.length / UPCOMING_PER_PAGE));
  const laterPages = Math.max(1, Math.ceil(laterEvents.length / LATER_PER_PAGE));

  const hasUpcomingEvents = upcomingEvents.length > 0;
  const visibleUpcomingEvents = upcomingEvents.slice(
    (upcomingPage - 1) * UPCOMING_PER_PAGE,
    upcomingPage * UPCOMING_PER_PAGE
  );
  const visibleLaterEvents = laterEvents.slice(
    (laterPage - 1) * LATER_PER_PAGE,
    laterPage * LATER_PER_PAGE
  );

  return (
    <WebLayout>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <LinearGradient
          colors={[Colors.PRIMARY, Colors.DARK_BLUE]}
          style={styles.header}
        >
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => router.replace('/home_screen/home')}
              style={styles.backButton}
            >
              <ArrowLeft size={24} color={Colors.WHITE} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Community Events</Text>
            <TouchableOpacity
              onPress={() => router.push('/home_screen/create_event')}
              style={styles.createButton}
            >
              <Text style={styles.createButtonText}>+ Create</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Daily Inspiration */}
          <View style={styles.inspirationCard}>
            <Text style={styles.inspirationLabel}>Evaluation note</Text>
            <Text style={styles.inspirationText}>{todayInspiration}</Text>
          </View>

          {/* Upcoming Events - Carousel */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {upcomingEvents.length} Upcoming Events
            </Text>

            {hasUpcomingEvents ? (
              <>
                <View style={styles.carouselCardsContainer}>
                  {visibleUpcomingEvents.map(event => (
                    <EventCard
                      key={event.id}
                      title={event.title}
                      date={`${formatEventDate(event.date)}${event.time ? ` at ${event.time}` : ''}`}
                      location={event.location}
                      description={event.description}
                      imageUrl={event.imageUrl}
                      author={event.author}
                      isPublic={event.isPublic}
                      locked={event.locked}
                      onPress={() =>
                        router.push({
                          pathname: '/home_screen/details',
                          params: { eventId: event.id },
                        })
                      }
                    />
                  ))}
                </View>
                <Pagination page={upcomingPage} totalPages={upcomingPages} onChange={setUpcomingPage} />
              </>
            ) : (
              <Text style={styles.noEventsText}>
                No upcoming events yet. Create one to get started!
              </Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Later Events ({laterEvents.length})</Text>
            {visibleLaterEvents.length ? (
              <>
              <View style={styles.laterEventsGrid}>
                {visibleLaterEvents.map(event => (
                  <EventCard
                    key={event.id}
                    title={event.title}
                    date={`${formatEventDate(event.date)}${event.time ? ` at ${event.time}` : ''}`}
                    location={event.location}
                    description={event.description}
                    imageUrl={event.imageUrl}
                    author={event.author}
                    isPublic={event.isPublic}
                    locked={event.locked}
                    compact
                    onPress={() =>
                      router.push({
                        pathname: '/home_screen/details',
                        params: { eventId: event.id },
                      })
                    }
                  />
                ))}
              </View>
              <Pagination page={laterPage} totalPages={laterPages} onChange={setLaterPage} />
              </>
            ) : (
              <Text style={styles.noEventsText}>
                No events scheduled more than 30 days out yet.
              </Text>
            )}
          </View>

        </ScrollView>
      </SafeAreaView>
    </WebLayout>
  );
}

const eventStyles = StyleSheet.create({
  card: {
    width: EVENT_CARD_WIDTH,
    height: EVENT_CARD_HEIGHT,
    backgroundColor: EVENT_CARD_BACKGROUND,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  compactCard: {
    width: LATER_EVENT_CARD_WIDTH,
    height: LATER_EVENT_CARD_HEIGHT,
  },
  eventImage: {
    width: '100%',
    height: 132,
    resizeMode: 'cover',
  },
  compactImage: {
    height: 94,
  },
  contentRow: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: EVENT_CARD_BACKGROUND,
  },
  leftAccent: {
    width: 6,
    backgroundColor: Colors.PRIMARY,
  },
  inner: {
    flex: 1,
    padding: 12,
    overflow: 'hidden',
  },
  compactInner: {
    padding: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: EVENT_TEXT_COLOR,
    marginBottom: 4,
  },
  compactTitle: {
    fontSize: 13,
    marginBottom: 3,
  },
  privateBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: Colors.BLACK,
  },
  privateBadgeText: {
    color: Colors.WHITE,
    fontSize: 11,
    fontWeight: '700',
  },
  author: {
    color: EVENT_TEXT_COLOR,
    opacity: 0.7,
    fontSize: 12,
    marginBottom: 4,
  },
  date: {
    color: EVENT_TEXT_COLOR,
    fontWeight: '600',
    marginBottom: 4,
    fontSize: 12,
  },
  compactDate: {
    fontSize: 11,
    marginBottom: 3,
  },
  location: {
    color: EVENT_TEXT_COLOR,
    marginBottom: 8,
    fontSize: 12,
  },
  compactLocation: {
    fontSize: 11,
    marginBottom: 6,
  },
  description: {
    color: EVENT_TEXT_COLOR,
    fontSize: 12,
    lineHeight: 17,
  },
  compactDescription: {
    fontSize: 11,
    lineHeight: 15,
  },
  // The picture area when an event has no picture (or is private and locked).
  imagePlaceholder: {
    backgroundColor: '#fde9a6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // The "Private" tag sits on the picture area so the text underneath lines up on every card.
  privateBadgeFloating: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: Colors.BLACK,
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
  createButton: {
    backgroundColor: Colors.BRAND_GOLD,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
  },
  createButtonText: {
    color: Colors.PRIMARY,
    fontWeight: '700',
    fontSize: 14,
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
  carouselCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    maxWidth: EVENT_CARD_WIDTH * 3 + 32,
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
  laterEventsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: LATER_GRID_GAP,
    maxWidth: LATER_GRID_MAX_WIDTH,
    alignSelf: 'center',
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
