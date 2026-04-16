import notes from '../../data/notes.json';

import type { StickyNote } from '../../../src/entities/note/model/types';
import { queryNotes } from './queryNotes';

const seededNotes = notes as StickyNote[];

describe('queryNotes', () => {
  it('keeps full dataset when filters are empty', () => {
    const response = queryNotes(seededNotes, {
      limit: 5,
      authors: [],
      colors: [],
      timeRange: 'all',
    });

    expect(response.total).toBe(seededNotes.length);
    expect(response.items).toHaveLength(5);
    expect(response.items.map((note) => note.id)).toEqual([
      'note_001',
      'note_002',
      'note_003',
      'note_004',
      'note_005',
    ]);
  });

  it('filters notes by author, color, and time range', () => {
    const response = queryNotes(seededNotes, {
      limit: 30,
      authors: ['user_1'],
      colors: ['yellow'],
      timeRange: 'month',
    });

    expect(response.total).toBeGreaterThan(0);
    expect(response.items.every((note) => note.author.id === 'user_1')).toBe(true);
    expect(response.items.every((note) => note.color === 'yellow')).toBe(true);
    expect(
      response.items.every(
        (note) =>
          new Date(note.createdAt).getTime() >=
          new Date('2026-03-16T18:00:00.000Z').getTime(),
      ),
    ).toBe(true);
  });

  it('treats today as current seed-data day for deterministic demo data', () => {
    const response = queryNotes(seededNotes, {
      limit: 30,
      authors: [],
      colors: [],
      timeRange: 'today',
    });

    expect(response.total).toBe(2);
    expect(response.items.map((note) => note.id)).toEqual(['note_001', 'note_002']);
  });

  it('paginates with stable cursors even when timestamps match', () => {
    const fixtureNotes: StickyNote[] = [
      {
        id: 'note_a',
        text: 'Newest A',
        color: 'yellow',
        author: { id: 'user_1', name: 'Sarah Chen' },
        createdAt: '2026-04-15T12:00:00.000Z',
      },
      {
        id: 'note_b',
        text: 'Newest B',
        color: 'blue',
        author: { id: 'user_2', name: 'Jorge Silva' },
        createdAt: '2026-04-15T12:00:00.000Z',
      },
      {
        id: 'note_c',
        text: 'Older C',
        color: 'green',
        author: { id: 'user_3', name: 'Mina Park' },
        createdAt: '2026-04-14T09:00:00.000Z',
      },
      {
        id: 'note_d',
        text: 'Older D',
        color: 'red',
        author: { id: 'user_4', name: 'Avery Johnson' },
        createdAt: '2026-04-13T09:00:00.000Z',
      },
    ];

    const firstPage = queryNotes(fixtureNotes, {
      limit: 2,
      authors: [],
      colors: [],
      timeRange: 'all',
    });

    expect(firstPage.items.map((note) => note.id)).toEqual(['note_a', 'note_b']);
    expect(firstPage.hasMore).toBe(true);
    expect(firstPage.nextCursor).toEqual(expect.any(String));

    const secondPage = queryNotes(fixtureNotes, {
      limit: 2,
      authors: [],
      colors: [],
      timeRange: 'all',
      ...(firstPage.nextCursor ? { cursor: firstPage.nextCursor } : {}),
    });

    expect(secondPage.items.map((note) => note.id)).toEqual(['note_c', 'note_d']);
    expect(secondPage.hasMore).toBe(false);
    expect(secondPage.nextCursor).toBeNull();
  });

  it('uses note id as stable tie-breaker for equal timestamps', () => {
    const fixtureNotes: StickyNote[] = [
      {
        id: 'note_b',
        text: 'Same time B',
        color: 'yellow',
        author: { id: 'user_1', name: 'Sarah Chen' },
        createdAt: '2026-04-15T12:00:00.000Z',
      },
      {
        id: 'note_a',
        text: 'Same time A',
        color: 'blue',
        author: { id: 'user_2', name: 'Jorge Silva' },
        createdAt: '2026-04-15T12:00:00.000Z',
      },
    ];

    const response = queryNotes(fixtureNotes, {
      limit: 2,
      authors: [],
      colors: [],
      timeRange: 'all',
    });

    expect(response.items.map((note) => note.id)).toEqual(['note_a', 'note_b']);
  });
});
