import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Globe, Lock } from 'lucide-react-native';
import { Colors } from '../constant/Colors';

const OPTIONS = [
  {
    isPublic: false,
    label: 'Private',
    icon: Lock,
    hint: 'Only signed-in members can see it.',
  },
  {
    isPublic: true,
    label: 'Public',
    icon: Globe,
    hint: 'Anyone can see it, even without an account.',
  },
];

// Lets the author choose who can see a thread or event.
export default function VisibilityToggle({ isPublic, onChange, disabled = false, noun = 'post' }) {
  const selected = OPTIONS.find((option) => option.isPublic === isPublic) ?? OPTIONS[0];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Who can see this {noun}?</Text>
      <View accessibilityRole="radiogroup" style={styles.row}>
        {OPTIONS.map((option) => {
          const active = option.isPublic === isPublic;
          const IconComponent = option.icon;
          return (
            <TouchableOpacity
              key={option.label}
              accessibilityRole="radio"
              accessibilityState={{ checked: active, disabled }}
              disabled={disabled}
              onPress={() => onChange(option.isPublic)}
              style={[styles.chip, active && styles.chipActive, disabled && styles.chipDisabled]}
            >
              <IconComponent size={16} color={active ? Colors.WHITE : Colors.TEXT} />
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <Text style={styles.hint}>{selected.hint}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 14,
  },
  label: {
    color: Colors.TEXT,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    backgroundColor: Colors.WHITE,
  },
  chipActive: {
    backgroundColor: Colors.PRIMARY,
    borderColor: Colors.PRIMARY,
  },
  chipDisabled: {
    opacity: 0.5,
  },
  chipText: {
    color: Colors.TEXT,
    fontWeight: '600',
  },
  chipTextActive: {
    color: Colors.WHITE,
  },
  hint: {
    color: Colors.TEXT_MUTED,
    fontSize: 12,
    marginTop: 6,
  },
});
