import React, { useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Colors } from '../constant/Colors';
import { dateForEventTime, formatEventDate, formatEventTime, parseEventDate } from '../utils/eventDateTime';

export default function DateTimeInput({ type, value, onChange, disabled = false }) {
  const [visible, setVisible] = useState(false);
  const [draft, setDraft] = useState(new Date());
  const selected = type === 'date' ? parseEventDate(value) : dateForEventTime(value);
  const displayValue = type === 'date' && selected
    ? selected.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : value;
  const format = type === 'date' ? formatEventDate : formatEventTime;

  function openPicker() {
    if (disabled) return;
    const initial = selected || new Date();
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: initial, mode: type, is24Hour: false,
        display: type === 'date' ? 'calendar' : 'spinner',
        onChange: (event, date) => { if (event.type === 'set' && date) onChange(format(date)); },
      });
    } else {
      setDraft(initial);
      setVisible(true);
    }
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={openPicker} disabled={disabled} accessibilityRole="button"
        accessibilityLabel={type === 'date' ? 'Choose event date' : 'Choose event time'}
        style={styles.field}>
        <Text style={[styles.value, !value && styles.placeholder]}>{displayValue || (type === 'date' ? 'Choose date' : 'Choose time')}</Text>
      </Pressable>
      <Modal visible={visible} transparent animationType="slide" onRequestClose={() => setVisible(false)}>
        <View style={styles.overlay}>
          <View style={styles.sheet} accessibilityViewIsModal>
            <Text style={styles.title}>{type === 'date' ? 'Choose event date' : 'Choose event time'}</Text>
            <DateTimePicker value={draft} mode={type} display={type === 'date' ? 'inline' : 'spinner'}
              minuteInterval={1} themeVariant="light" locale={type === 'time' ? 'en-US' : undefined}
              onChange={(_event, date) => { if (date) setDraft(date); }} />
            <View style={styles.actions}>
              <Pressable onPress={() => setVisible(false)} accessibilityRole="button" style={styles.button}><Text>Cancel</Text></Pressable>
              <Pressable onPress={() => { onChange(format(draft)); setVisible(false); }} accessibilityRole="button" style={styles.button}><Text style={styles.done}>Done</Text></Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  field: { paddingVertical: 12 },
  value: { color: Colors.TEXT, fontSize: 14 },
  placeholder: { color: Colors.TEXT_MUTED },
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.35)' },
  sheet: { backgroundColor: Colors.WHITE, padding: 20, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  title: { fontSize: 18, fontWeight: '600', color: Colors.TEXT },
  actions: { flexDirection: 'row', justifyContent: 'space-between' },
  button: { padding: 16 },
  done: { fontWeight: '700', color: Colors.SECONDARY },
});
