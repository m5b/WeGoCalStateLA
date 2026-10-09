import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import WebLayout from '../../components/WebLayout';
import ResourceCard from '../../components/ResourceCard';
import ProviderFilter, { filterByProvider } from '../../components/ProviderFilter';
import { Colors } from '../../constant/Colors';
import { resourceCategories } from '../../constant/ResourceCategories';
import { useSavedResources } from '../../hooks/useSavedResources';

// Every real resource, paired with the category it belongs to (for its icon and color).
const allResources = resourceCategories.flatMap((category) =>
  (category.resources ?? []).map((resource) => ({ ...resource, category }))
);

export default function SavedResourcesScreen() {
  const [provider, setProvider] = useState('all');
  const { savedIds, toggleSaved } = useSavedResources();

  const savedResources = allResources.filter((resource) => savedIds.includes(resource.id));
  const visibleResources = filterByProvider(savedResources, provider);

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

          <View style={styles.header}>
            <Text style={styles.headerTitle}>Saved Resources</Text>
            <Text style={styles.headerNote}>
              Resources you save are kept on this device.
            </Text>
          </View>

          {savedResources.length > 0 ? (
            <>
              <ProviderFilter resources={savedResources} value={provider} onChange={setProvider} />
              <View style={styles.grid}>
                {visibleResources.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    category={resource.category}
                    saved
                    onToggleSave={toggleSaved}
                  />
                ))}
              </View>
            </>
          ) : (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>
                Nothing saved yet. Choose Save on any resource to keep it here.
              </Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => router.push('/resources/resource')}
              >
                <Text style={styles.emptyButtonText}>Browse resources</Text>
              </TouchableOpacity>
            </View>
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
    paddingVertical: 40,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 40,
    fontWeight: '900',
    color: Colors.PRIMARY,
    marginBottom: 8,
  },
  headerNote: {
    fontSize: 17,
    color: '#475569',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
  },
  empty: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#cbd5e1',
    backgroundColor: 'white',
  },
  emptyText: {
    fontSize: 18,
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyButton: {
    minHeight: 52,
    justifyContent: 'center',
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: Colors.PRIMARY_500,
  },
  emptyButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.PRIMARY,
  },
});