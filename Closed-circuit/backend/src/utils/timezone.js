import { config } from '../config/env.js';

export function getAppTimezone() {
  return config.timezone || 'Asia/Kolkata';
}

export function getTodayDateString(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: getAppTimezone(),
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export function getNowInTimezone(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: getAppTimezone(),
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(date);

  const lookup = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return {
    year: Number(lookup.year),
    month: Number(lookup.month),
    day: Number(lookup.day),
    hour: Number(lookup.hour) % 24,
    minute: Number(lookup.minute),
    second: Number(lookup.second),
  };
}

export function parsePreferredTime(preferredTime) {
  const match = String(preferredTime || '').trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) {
    return null;
  }

  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const period = match[3].toUpperCase();

  if (hour < 1 || hour > 12 || minute < 0 || minute > 59) {
    return null;
  }

  if (period === 'AM') {
    if (hour === 12) hour = 0;
  } else if (hour !== 12) {
    hour += 12;
  }

  return { hour, minute };
}

export function buildScheduledDate(preferredDate, preferredTime) {
  const dateMatch = String(preferredDate || '').trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const timeParts = parsePreferredTime(preferredTime);

  if (!dateMatch || !timeParts) {
    return null;
  }

  const target = {
    year: Number(dateMatch[1]),
    month: Number(dateMatch[2]),
    day: Number(dateMatch[3]),
    hour: timeParts.hour,
    minute: timeParts.minute,
  };

  const base = Date.UTC(target.year, target.month - 1, target.day, target.hour - 5, target.minute, 0);

  for (let offsetMs = -14 * 60 * 60 * 1000; offsetMs <= 14 * 60 * 60 * 1000; offsetMs += 60 * 1000) {
    const candidate = new Date(base + offsetMs);
    const parts = getNowInTimezone(candidate);

    if (
      parts.year === target.year &&
      parts.month === target.month &&
      parts.day === target.day &&
      parts.hour === target.hour &&
      parts.minute === target.minute
    ) {
      return candidate;
    }
  }

  return null;
}

export function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

/** Display preferred date as `09 Jun` for SMS templates. */
export function formatPreferredCallDateDisplay(preferredDate) {
  const match = String(preferredDate || '').trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    return String(preferredDate || '').trim();
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const utcDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));

  return new Intl.DateTimeFormat('en-GB', {
    timeZone: getAppTimezone(),
    day: '2-digit',
    month: 'short',
  }).format(utcDate);
}
