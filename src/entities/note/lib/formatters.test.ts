import {
  formatNoteColorLabel,
  formatNoteDateTime,
  formatNoteRelativeTime,
  getAuthorInitials,
} from './formatters';

describe('formatters', () => {
  it('returns up to two initials from author name', () => {
    expect(getAuthorInitials('Sarah Chen')).toBe('SC');
    expect(getAuthorInitials('   Mural   ')).toBe('M');
  });

  it('maps note colors to translated labels', () => {
    expect(formatNoteColorLabel('yellow')).toBe('Yellow');
  });

  it('formats note timestamps with absolute date and time', () => {
    expect(formatNoteDateTime('2026-04-15T12:00:00.000Z')).toMatch(/Apr 15,/);
  });

  it('formats recent notes with relative time', () => {
    expect(
      formatNoteRelativeTime('2026-04-15T11:50:00.000Z', new Date('2026-04-15T12:00:00.000Z')),
    ).toBe('10 minutes ago');
  });
});
