import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Pressable, StyleSheet, Modal, ScrollView, useWindowDimensions } from 'react-native';
import { ChevronRight, X } from 'lucide-react-native';
import { Colors } from '../constant/Colors';

// "Before you go": a list of what to bring and steps, shown in a pop-up panel so
// families know what to expect before they leave for an outside website.
// actionLabel/onAction repeat the card's main button at the bottom of the panel.
export default function ResourceGuide({ resource, actionLabel, onAction }) {
  const [open, setOpen] = useState(false);
  const { width } = useWindowDimensions();
  const isPhone = width < 600;
  const guide = resource.guide;

  if (!guide) return null;

  // guide.inline: show the steps right on the card instead of behind a button.
  // Only 211 LA uses this, since its card has room to spare.
  if (guide.inline) {
    return (
      <View style={styles.inline}>
        <Text style={styles.sectionTitle}>How it works</Text>
        {guide.note ? <Text style={styles.note}>{guide.note}</Text> : null}
        {guide.steps.map((step, index) => (
          <View key={step} style={styles.stepRow}>
            <View style={styles.stepCircle}>
              <Text style={styles.stepNumber}>{index + 1}</Text>
            </View>
            <Text style={styles.itemText}>{step}</Text>
          </View>
        ))}
      </View>
    );
  }

  // Resources with only steps have nothing to bring, so the button says "How it works".
  const buttonLabel = guide.checklist ? "What You'll Need" : 'How it works';

  return (
    <View style={styles.container}>
      {/* Pressable gives us "hovered" on the web, so the button can change color under the mouse. */}
      <Pressable
        style={({ hovered, pressed }) => [styles.toggle, (hovered || pressed) && styles.toggleHover]}
        onPress={() => setOpen(true)}
        accessibilityRole="button"
      >
        <Text style={styles.toggleText}>{buttonLabel}</Text>
        <ChevronRight size={20} color={Colors.PRIMARY} strokeWidth={2.5} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        {/* Dark backdrop; tapping it closes the panel. On phones the panel sits at the bottom. */}
        <Pressable
          style={[styles.backdrop, isPhone && styles.backdropPhone]}
          onPress={() => setOpen(false)}
          accessibilityLabel="Close"
        >
          {/* This Pressable stops taps inside the panel from closing it. */}
          <Pressable style={[styles.sheet, isPhone && styles.sheetPhone]} onPress={() => {}}>
            <View style={styles.sheetHeader}>
              <View style={styles.sheetHeading}>
                <Text style={styles.sheetEyebrow}>Before you go</Text>
                <Text style={styles.sheetTitle}>{resource.title}</Text>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setOpen(false)}
                accessibilityRole="button"
                accessibilityLabel="Close"
              >
                <X size={24} color={Colors.PRIMARY} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.sheetBody} contentContainerStyle={styles.sheetBodyContent}>
              {guide.note ? <Text style={styles.note}>{guide.note}</Text> : null}

              {guide.checklist ? (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>{guide.checklistTitle ?? "What you'll need"}</Text>
                  {guide.checklist.map((item) => (
                    <View key={item} style={styles.bulletRow}>
                      <Text style={styles.bullet}>{'\u2022'}</Text>
                      <Text style={styles.itemText}>{item}</Text>
                    </View>
                  ))}
                </View>
              ) : null}

              {guide.steps ? (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Steps</Text>
                  {guide.steps.map((step, index) => (
                    <View key={step} style={styles.stepRow}>
                      <View style={styles.stepCircle}>
                        <Text style={styles.stepNumber}>{index + 1}</Text>
                      </View>
                      <Text style={styles.itemText}>{step}</Text>
                    </View>
                  ))}
                </View>
              ) : null}

            </ScrollView>

            {onAction ? (
              <View style={styles.sheetFooter}>
                <TouchableOpacity style={styles.footerButton} onPress={onAction} accessibilityRole="button">
                  <Text style={styles.footerButtonText}>{actionLabel}</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },
  inline: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  // Same size and shape as the card's other two buttons.
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
  },
  toggleHover: {
    backgroundColor: Colors.PRIMARY_100,
  },
  toggleText: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.PRIMARY,
  },
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
  },
  backdropPhone: {
    justifyContent: 'flex-end',
    padding: 0,
  },
  sheet: {
    width: '100%',
    maxWidth: 520,
    maxHeight: '85%',
    borderRadius: 16,
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  sheetPhone: {
    maxWidth: '100%',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  sheetHeading: {
    flex: 1,
  },
  sheetEyebrow: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.SECONDARY,
    marginBottom: 4,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.PRIMARY,
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: '#f1f5f9',
  },
  sheetBody: {
    flexShrink: 1,
  },
  sheetBodyContent: {
    padding: 20,
  },
  sheetFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  footerButton: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: Colors.PRIMARY_500,
  },
  footerButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.PRIMARY,
  },
  note: {
    fontSize: 15,
    lineHeight: 22,
    color: '#1e293b',
    marginBottom: 12,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.SECONDARY,
    marginBottom: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 4,
  },
  bullet: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.PRIMARY,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 8,
  },
  stepCircle: {
    width: 24,
    height: 24,
    flexShrink: 0,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.PRIMARY_500,
  },
  stepNumber: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.PRIMARY,
  },
  itemText: {
    flexShrink: 1,
    fontSize: 15,
    lineHeight: 22,
    color: '#1e293b',
  },
});
