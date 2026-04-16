import notes from './notes.json';

import { NOTE_COLORS, type StickyNote } from '@entities/note/model/types';

const seededNotes = notes as StickyNote[];

describe('seeded notes dataset', () => {
  it('provides enough variety for filters and pagination work', () => {
    expect(seededNotes).toHaveLength(60);
    expect(new Set(seededNotes.map((note) => note.author.id)).size).toBe(6);
    expect(new Set(seededNotes.map((note) => note.color))).toEqual(
      new Set(NOTE_COLORS),
    );
  });

  it('spans recent and older activity windows', () => {
    const createdAtValues = seededNotes.map((note) =>
      new Date(note.createdAt).getTime(),
    );
    const newestTimestamp = Math.max(...createdAtValues);
    const oldestTimestamp = Math.min(...createdAtValues);
    const dayInMilliseconds = 24 * 60 * 60 * 1000;

    expect(newestTimestamp - oldestTimestamp).toBeGreaterThan(30 * dayInMilliseconds);
    expect(
      seededNotes.some(
        (note) =>
          newestTimestamp - new Date(note.createdAt).getTime() <= dayInMilliseconds,
      ),
    ).toBe(true);
    expect(
      seededNotes.some(
        (note) =>
          newestTimestamp - new Date(note.createdAt).getTime() > 7 * dayInMilliseconds,
      ),
    ).toBe(true);
  });
});
