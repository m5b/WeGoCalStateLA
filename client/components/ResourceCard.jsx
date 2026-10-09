import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { MapPin, Phone, Globe, Bookmark } from 'lucide-react-native';
import { Colors } from '../constant/Colors';

const ACTION_LABELS = { call: 'Call', website: 'Visit website' };

function callPhone(phone) {
  const digits = phone.replace(/[^0-9]/g, '');
  Linking.openURL(`tel:${digits}`);
}

function openWebsite(website) {
  Linking.openURL(website);
}

// "https://www.211la.org" -> "211la.org", for showing a website as text.
function shortUrl(website) {
  return website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
}

function openAction(resource) {
  if (resource.action === 'call') {
    callPhone(resource.phone);
  } else {
    openWebsite(resource.website);
  }
}

export default function ResourceCard({ resource, category, saved, onToggleSave }) {
  const isCsula = resource.provider === 'csula';

  return (
    <View style={styles.card}>
      {/* Image spot: the category icon until real logos or photos are added. */}
      <View style={[styles.imageSpot, { backgroundColor: category.color + '20' }]}>
        <category.icon size={40} color={category.color} />
      </View>

      <View style={styles.body}>
        <Text style={[styles.badge, isCsula ? styles.badgeCsula : styles.badgeOther]}>
          {isCsula ? 'Cal State LA' : 'Outside CSULA'}
        </Text>
        <Text style={styles.title}>{resource.title}</Text>
        <Text style={styles.name}>{resource.name}</Text>
        <Text style={styles.description}>{resource.description}</Text>

        <View style={styles.detail}>
          <MapPin size={18} color={Colors.GRAY} />
          <Text style={styles.detailText}>{resource.location}</Text>
        </View>
        {resource.phone ? (
          <TouchableOpacity
            style={styles.detail}
            onPress={() => callPhone(resource.phone)}
            accessibilityRole="link"
          >
            <Phone size={18} color={Colors.GRAY} />
            <Text style={[styles.detailText, styles.detailLink]}>{resource.phone}</Text>
          </TouchableOpacity>
        ) : null}
        {/* When the main button is Call, still offer the website as a smaller link. */}
        {resource.action === 'call' && resource.website ? (
          <TouchableOpacity
            style={styles.detail}
            onPress={() => openWebsite(resource.website)}
            accessibilityRole="link"
          >
            <Globe size={18} color={Colors.GRAY} />
            <Text style={[styles.detailText, styles.detailLink]}>{shortUrl(resource.website)}</Text>
          </TouchableOpacity>
        ) : null}

        <View style={styles.spacer} />

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => openAction(resource)}
          accessibilityRole={resource.action === 'call' ? 'button' : 'link'}
        >
          {resource.action === 'call' ? (
            <Phone size={20} color={Colors.PRIMARY} />
          ) : (
            <Globe size={20} color={Colors.PRIMARY} />
          )}
          <Text style={styles.actionText}>{ACTION_LABELS[resource.action]}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveButton, saved && styles.saveButtonSaved]}
          onPress={() => onToggleSave(resource.id)}
          accessibilityRole="button"
          accessibilityState={{ selected: saved }}
        >
          <Bookmark
            size={18}
            color={saved ? Colors.WHITE : Colors.PRIMARY}
            fill={saved ? Colors.WHITE : 'none'}
          />
          <Text style={[styles.saveText, saved && styles.saveTextSaved]}>
            {saved ? 'Saved' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexGrow: 1,
    flexBasis: 300,
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  imageSpot: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    padding: 24,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: 'hidden',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 12,
  },
  badgeCsula: {
    backgroundColor: Colors.PRIMARY_500,
    color: Colors.PRIMARY,
  },
  badgeOther: {
    backgroundColor: '#e2e8f0',
    color: '#1e293b',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.PRIMARY,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.SECONDARY,
    marginTop: 4,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#1e293b',
    marginTop: 12,
    marginBottom: 14,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  detailText: {
    flexShrink: 1,
    fontSize: 15,
    color: '#475569',
  },
    detailLink: {
    color: Colors.PRIMARY,
    textDecorationLine: 'underline',
  },
  spacer: {
    flex: 1,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    minHeight: 52,
    marginTop: 12,
    borderRadius: 12,
    backgroundColor: Colors.PRIMARY_500,
  },
  actionText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.PRIMARY,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 48,
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.PRIMARY,
    backgroundColor: 'white',
  },
  saveButtonSaved: {
    backgroundColor: Colors.PRIMARY,
  },
  saveText: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.PRIMARY,
  },
  saveTextSaved: {
    color: Colors.WHITE,
  },
});