import React from 'react';

const timeOptions = [];

for (let hour = 0; hour < 24; hour++) {
  for (let minute = 0; minute < 60; minute += 30) {
    const value =
      `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

    const displayHour = hour % 12 || 12;
    const period = hour < 12 ? 'AM' : 'PM';

    const label =
      `${displayHour}:${String(minute).padStart(2, '0')} ${period}`;

    timeOptions.push({ value, label });
  }
}

export default function DateTimeInput({ type, value, onChange }) {
  if (type === 'time') {
    return (
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={{
          flex: 1,
          width: '100%',
          border: 'none',
          outline: 'none',
          backgroundColor: 'transparent',
          fontSize: 16,
          color: '#111827',
          fontFamily: 'inherit',
          cursor: 'pointer',
        }}
      >
        <option value="">Select time</option>

        {timeOptions.map((option) => (
          <option key={option.value} value={option.label}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      type="date"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      style={{
        flex: 1,
        width: '100%',
        border: 'none',
        outline: 'none',
        backgroundColor: 'transparent',
        fontSize: 16,
        color: '#111827',
        fontFamily: 'inherit',
        cursor: 'pointer',
      }}
    />
  );
}