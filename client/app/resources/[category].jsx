import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Info, Users, MapPin, Phone, Globe, Calendar, ChevronRight } from 'lucide-react-native';
import WebLayout from '../../components/WebLayout';
import { Colors } from '../../constant/Colors';
import { resourceCategories } from '../../constant/ResourceCategories';
import ResourceCard from '../../components/ResourceCard';
import ProviderFilter, { filterByProvider } from '../../components/ProviderFilter';
import { useSavedResources } from '../../hooks/useSavedResources';

const placeholderResource = {
  name: 'Resource name',
  description: 'A short description of what this resource offers and how it can help families support their student.',
  audience: 'Who it is for',
  location: 'Location or "Online"',
  phone: '(000) 000-0000',
};
const placeholderResources = [placeholderResource, placeholderResource, placeholderResource];

// Shown for categories that have no real resources yet.
function PlaceholderCard({ resource }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{resource.name}</Text>
      <Text style={styles.cardDescription}>{resource.description}</Text>
      <View style={styles.cardDetail}>
        <Users size={16} color={Colors.GRAY} />
        <Text style={styles.cardDetailText}>{resource.audience}</Text>
      </View>
      <View style={styles.cardDetail}>
        <MapPin size={16} color={Colors.GRAY} />
        <Text style={styles.cardDetailText}>{resource.location}</Text>
      </View>
      <View style={styles.cardDetail}>
        <Phone size={16} color={Colors.GRAY} />
        <Text style={styles.cardDetailText}>{resource.phone}</Text>
      </View>
      <View style={styles.cardButton}>
        <Globe size={16} color={Colors.PRIMARY} />
        <Text style={styles.cardButtonText}>Visit website</Text>
      </View>
    </View>
  );
}

const templateEvent = {
  title: '[Insert event title here]',
  date: '[Insert date and time here]',
  location: '[Insert location here]',
  description: '[Insert event description here]',
};
const templateEvents = [templateEvent, templateEvent, templateEvent];

function TemplateEventCard({ event, color }) {
  return (
    <View style={styles.eventCard}>
      <View style={[styles.eventAccent, { backgroundColor: color }]} />
      <View style={styles.eventInner}>
        <Text style={styles.templateBadge}>TEMPLATE</Text>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <Text style={styles.eventDate}>{event.date}</Text>
        <Text style={styles.eventLocation}>{event.location}</Text>
        <Text style={styles.eventDescription}>{event.description}</Text>
      </View>
    </View>
  );
}

function CategoryEvents({ category }) {
  return (
    <View style={styles.eventsSection}>
      <View style={styles.eventsHeader}>
        <View style={styles.eventsHeaderTitle}>
          <Calendar size={22} color={Colors.PRIMARY} />
          <Text style={styles.sectionTitle}>Upcoming {category.title} Events</Text>
        </View>
        <TouchableOpacity
          style={styles.eventsLink}
          onPress={() => router.push('/home_screen/events')}
        >
          <Text style={styles.eventsLinkText}>See all events</Text>
          <ChevronRight size={18} color={Colors.PRIMARY} />
        </TouchableOpacity>
      </View>
      <Text style={styles.eventsNote}>
        Preview only: events tagged with this category will appear here.
      </Text>
      <View style={styles.grid}>
        {templateEvents.map((event, index) => (
          <TemplateEventCard key={index} event={event} color={category.color} />
        ))}
      </View>
    </View>
  );
}

export default function ResourceCategoryScreen() {
  const { category: categoryId } = useLocalSearchParams();
  const category = resourceCategories.find((item) => item.id === categoryId);
  const resources = category?.resources ?? [];
  const hasResources = resources.length > 0;
  const [provider, setProvider] = useState('all');
  const { savedIds, toggleSaved } = useSavedResources();
  const visibleResources = filterByProvider(resources, provider);

  return (
    <WebLayout>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <TouchableOpacity
            style={styles.backLink}
            onPress={() => router.push('/resources/resource')}
          >
            <ArrowLeft size={18} color={Colors.PRIMARY} />
            <Text style={styles.backLinkText}>All resources</Text>
          </TouchableOpacity>

            {category ? (
            <>
              <View style={styles.header}>
                <View style={[styles.headerIcon, { backgroundColor: category.color + '20' }]}>
                  <category.icon size={36} color={category.color} />
                </View>
                <Text style={styles.headerTitle}>{category.title}</Text>
                <Text style={styles.headerDescription}>{category.description}</Text>
              </View>

                            {hasResources ? (
                <>
                  <ProviderFilter resources={resources} value={provider} onChange={setProvider} />
                  <View style={styles.grid}>
                    {visibleResources.map((resource) => (
                      <ResourceCard
                        key={resource.id}
                        resource={resource}
                        category={category}
                        saved={savedIds.includes(resource.id)}
                        onToggleSave={toggleSaved}
                      />
                    ))}
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.notice}>
                    <Info size={18} color={Colors.SECONDARY} />
                    <Text style={styles.noticeText}>
                      Resources for this category are coming soon. The cards below show how each one will appear.
                    </Text>
                  </View>

                  <View style={styles.grid}>
                    {placeholderResources.map((resource, index) => (
                      <PlaceholderCard key={index} resource={resource} />
                    ))}
                  </View>
                </>
              )}

              <CategoryEvents category={category} />
            </>
          ) : (
            <Text style={styles.headerTitle}>Category not found</Text>
          )}
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
  content: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    padding: 24,
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    paddingVertical: 8,
    marginBottom: 16,
  },
  backLinkText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.PRIMARY,
  },
  header: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 48,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 24
  },
  headerIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 40,
    fontWeight: '900',
    color: Colors.PRIMARY,
    textAlign: 'center',
    marginBottom: 12,
  },
  headerDescription: {
    fontSize: 18,
    color: Colors.SECONDARY,
    textAlign: 'center',
  },
    notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.PRIMARY_50,
    borderWidth: 1,
    borderColor: Colors.PRIMARY_200,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  noticeText: {
    flex: 1,
    fontSize: 14,
    color: Colors.SECONDARY,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
  },
  card: {
    flexGrow: 1,
    flexBasis: 300,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#cbd5e1',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#94a3b8',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 16,
  },
  cardDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  cardDetailText: {
    fontSize: 14,
    color: '#94a3b8',
  },
  cardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.PRIMARY,
  },

    eventsSection: {
    marginTop: 40,
    paddingTop: 32,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  eventsHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 8,
  },
  eventsHeaderTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.PRIMARY,
  },
  eventsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  eventsLinkText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.PRIMARY,
  },
  eventsNote: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 20,
  },
  eventCard: {
    flexDirection: 'row',
    flexGrow: 1,
    flexBasis: 300,
    backgroundColor: '#fff8d6',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  eventAccent: {
    width: 6,
  },
  eventInner: {
    flex: 1,
    padding: 14,
  },
  templateBadge: {
    alignSelf: 'flex-start',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: Colors.SECONDARY,
    backgroundColor: 'white',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: 8,
    overflow: 'hidden',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 13,
    color: '#000',
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 13,
    color: '#000',
  },
});