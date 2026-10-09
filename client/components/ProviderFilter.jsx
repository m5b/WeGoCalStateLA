import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../constant/Colors';

const OPTIONS = [
  { id: 'all', label: 'All' },
  { id: 'csula', label: 'Cal State LA' },
  { id: 'other', label: 'Outside CSULA' },
];

// Lets families narrow a list of resources by who provides them.
export default function ProviderFilter({ resources, value, onChange }) {
  return (
    <View style={styles.row} accessibilityRole="radiogroup" accessibilityLabel="Provided by">
      <Text style={styles.label}>Provided by:</Text>
      {OPTIONS.map((option) => {
        const count = option.id === 'all'
          ? resources.length
          : resources.filter((resource) => resource.provider === option.id).length;
        const active = value === option.id;
        return (
          <TouchableOpacity
            key={option.id}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => onChange(option.id)}
            accessibilityRole="radio"
            accessibilityState={{ checked: active }}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>
              {option.label} ({count})
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export function filterByProvider(resources, value) {
  return value === 'all' ? resources : resources.filter((resource) => resource.provider === value);
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.PRIMARY,
    marginRight: 4,
  },
  chip: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 18,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    backgroundColor: 'white',
  },
  chipActive: {
    borderColor: Colors.PRIMARY,
    backgroundColor: Colors.PRIMARY,
  },
  chipText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.PRIMARY,
  },
  chipTextActive: {
    color: Colors.WHITE,
    fontWeight: '700',
  },
});