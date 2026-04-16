import type { NotesMetaResponse } from '../../api/contracts/notes';
import {
  NOTE_COLORS,
  TIME_RANGE_PRESETS,
  type StickyNote,
} from '../../../src/entities/note/model/types';

const colorLabels: Record<(typeof NOTE_COLORS)[number], string> = {
  red: 'Red',
  yellow: 'Yellow',
  blue: 'Blue',
  green: 'Green',
  purple: 'Purple',
};

export const getMeta = (notes: StickyNote[]): NotesMetaResponse => {
  const timestamps = notes.map((note) => new Date(note.createdAt).getTime());
  // Unique authors by id
  const authorMap = new Map<string, { id: string; name: string }>();
  notes.forEach((note) => {
    if (!authorMap.has(note.author.id)) {
      authorMap.set(note.author.id, {
        id: note.author.id,
        name: note.author.name,
      });
    }
  });
  // Unique colors present in notes
  const colorSet = new Set<(typeof NOTE_COLORS)[number]>();
  notes.forEach((note) => {
    colorSet.add(note.color);
  });

  return {
    total: notes.length,
    authors: Array.from(authorMap.values()).sort((left, right) =>
      left.name.localeCompare(right.name),
    ),
    colors: Array.from(colorSet).sort().map((color) => ({
      id: color,
      label: colorLabels[color],
    })),
    timeBounds: {
      min: new Date(Math.min(...timestamps)).toISOString(),
      max: new Date(Math.max(...timestamps)).toISOString(),
    },
    timeRangePresets: [...TIME_RANGE_PRESETS],
  };
};
