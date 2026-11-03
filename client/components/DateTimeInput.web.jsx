import React from 'react';
import { parseEventTime } from '../utils/eventDateTime';

const timeOptions = Array.from({ length: 96 }, (_, index) => {
  const hour = Math.floor(index / 4);
  const minute = String((index % 4) * 15).padStart(2, '0');
  return (hour % 12 || 12) + ':' + minute + (hour < 12 ? ' AM' : ' PM');
});
const controlStyle = {
  minWidth: 0, border: 'none', backgroundColor: 'transparent', fontSize: 14,
  color: '#111827', fontFamily: 'inherit', cursor: 'pointer', padding: '12px 2px',
};

export default function DateTimeInput({ type, value, onChange, disabled = false }) {
  if (type === 'time') {
    const selectedTime = parseEventTime(value) ? value : '';
    // Keep an exact AI-populated time visible even when it is between presets.
    const extraTime = selectedTime && !timeOptions.includes(selectedTime) ? selectedTime : null;
    return (
      <select aria-label="Event time" value={selectedTime} disabled={disabled}
        onChange={(event) => {
          const nextTime = event.target.value;
          if (timeOptions.includes(nextTime) || nextTime === extraTime) onChange(nextTime);
        }} style={{ ...controlStyle, flex: 1, width: '100%' }}>
        <option value="" disabled>Select time</option>
        {extraTime && <option value={extraTime}>{extraTime}</option>}
        {timeOptions.map((time) => <option key={time} value={time}>{time}</option>)}
      </select>
    );
  }

  return (
    <input type="date" aria-label="Event date" value={value} disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      onClick={(event) => {
        try { event.currentTarget.showPicker?.(); } catch { /* Native input remains usable if showPicker is unavailable. */ }
      }}
      style={{ ...controlStyle, flex: 1, width: '100%' }} />
  );
}
