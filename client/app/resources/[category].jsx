import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Info, Users, MapPin, Phone, Globe } from 'lucide-react-native';
import WebLayout from '../../components/WebLayout';
import { Colors } from '../../constant/Colors';
import { resourceCategories } from '../../constant/ResourceCategories';

const placeholderResource = {
  name: 'Resource name',
  description: 'A short description of what this resource offers and how it can help families support their student.',
  audience: 'Who it is for',
  location: 'Location or "Online"',
  phone: '(000) 000-0000',
};
const placeholderResources = [placeholderResource, placeholderResource, placeholderResource];

function ResourceCard({ resource }) {
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

export default function ResourceCategoryScreen() {
  const { category: categoryId } = useLocalSearchParams();
  const category = resourceCategories.find((item) => item.id === categoryId);

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

              <View style={styles.notice}>
                <Info size={18} color={Colors.SECONDARY} />
                <Text style={styles.noticeText}>
                  Resources for this category are coming soon. The cards below show how each one will appear.
                </Text>
              </View>

              <View style={styles.grid}>
                {placeholderResources.map((resource, index) => (
                  <ResourceCard key={index} resource={resource} />
                ))}
              </View>
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
});