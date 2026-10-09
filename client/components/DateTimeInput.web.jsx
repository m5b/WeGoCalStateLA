import React, { useEffect, useState } from 'react';
import { parseEventTime } from '../utils/eventDateTime';

const emptyTime = { hour: '', minute: '00', period: 'AM' };
const controlStyle = {
  minWidth: 0, border: 'none', backgroundColor: 'transparent', fontSize: 14,
  color: '#111827', fontFamily: 'inherit', cursor: 'pointer', padding: '12px 2px',
};

export default function DateTimeInput({ type, value, onChange, disabled = false }) {
  const [parts, setParts] = useState(() => parseEventTime(value) || emptyTime);
  useEffect(() => setParts(parseEventTime(value) || emptyTime), [value]);

  if (type === 'time') {
    function updatePart(key, nextValue) {
      if (key === 'hour' && !/^(?:[1-9]|1[0-2])$/.test(nextValue)) return;
      const next = { ...parts, [key]: nextValue };
      setParts(next);
      onChange(next.hour ? next.hour + ':' + next.minute + ' ' + next.period : '');
    }
    return (
      <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0, gap: 2 }}>
        <select aria-label="Event hour" value={parts.hour} disabled={disabled}
          onChange={(event) => updatePart('hour', event.target.value)} style={{ ...controlStyle, flex: 1 }}>
          <option value="" disabled>Hour</option>
          {Array.from({ length: 12 }, (_, i) => String(i + 1)).map((hour) => <option key={hour} value={hour}>{hour}</option>)}
        </select>
        <span aria-hidden="true">:</span>
        <select aria-label="Event minute" value={parts.minute} disabled={disabled}
          onChange={(event) => updatePart('minute', event.target.value)} style={{ ...controlStyle, flex: 1 }}>
          {Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0')).map((minute) => <option key={minute} value={minute}>{minute}</option>)}
        </select>
        <select aria-label="Event AM or PM" value={parts.period} disabled={disabled}
          onChange={(event) => updatePart('period', event.target.value)} style={controlStyle}>
          <option value="AM">AM</option><option value="PM">PM</option>
        </select>
      </div>
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
