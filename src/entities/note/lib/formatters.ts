import { t } from '@shared/i18n';
import type { NoteColor } from '../model/types';

const absoluteDateFormatter = new Intl.DateTimeFormat('en', {
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  month: 'short',
});

const relativeTimeFormatter = new Intl.RelativeTimeFormat('en', {
  numeric: 'auto',
});

const relativeUnits = [
  ['day', 86_400],
  ['hour', 3_600],
  ['minute', 60],
] as const;

const colorTranslationKeyByColor: Record<NoteColor, string> = {
  blue: 'colors.blue',
  green: 'colors.green',
  purple: 'colors.purple',
  red: 'colors.red',
  yellow: 'colors.yellow',
};

const getSafeDate = (value: string): Date | null => {
  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
};

const getAuthorInitials = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((segment) => segment.charAt(0).toUpperCase())
    .join('');

const formatNoteColorLabel = (color: NoteColor): string =>
  t(colorTranslationKeyByColor[color]);

const formatNoteDateTime = (value: string): string => {
  const date = getSafeDate(value);

  return date === null ? value : absoluteDateFormatter.format(date);
};

const formatNoteRelativeTime = (
  value: string,
  referenceDate: Date = new Date(),
): string => {
  const date = getSafeDate(value);

  if (date === null) {
    return value;
  }

  const diffInSeconds = Math.round((date.getTime() - referenceDate.getTime()) / 1000);

  if (Math.abs(diffInSeconds) < 60) {
    return 'Just now';
  }

  for (const [unit, secondsPerUnit] of relativeUnits) {
    if (Math.abs(diffInSeconds) >= secondsPerUnit) {
      return relativeTimeFormatter.format(
        Math.round(diffInSeconds / secondsPerUnit),
        unit,
      );
    }
  }

  return relativeTimeFormatter.format(diffInSeconds, 'second');
};

export {
  formatNoteColorLabel,
  formatNoteDateTime,
  formatNoteRelativeTime,
  getAuthorInitials,
};
