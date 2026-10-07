import React from 'react';
import { TextInput } from 'react-native';

export default function DateTimeInput({ type, value, onChange }) {
  return (
    <TextInput
      style={{ flex: 1 }}
      value={value}
      onChangeText={onChange}
      placeholder={type === 'date' ? 'MM/DD/YYYY' : 'e.g. 3:00 PM'}
    />
  );
}