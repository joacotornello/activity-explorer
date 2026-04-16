import type { StickyNote } from '../../../src/entities/note/model/types';

export type NoteCursor = Pick<StickyNote, 'createdAt' | 'id'>;

export const compareNotes = (
  left: StickyNote,
  right: StickyNote,
): number => {
  const timestampDifference =
    new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime();

  if (timestampDifference !== 0) {
    return -timestampDifference;
  }

  return left.id.localeCompare(right.id);
};

export const encodeCursor = (note: StickyNote): string => {
  const payload: NoteCursor = {
    createdAt: note.createdAt,
    id: note.id,
  };

  return Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
};

export const decodeCursor = (value: string): NoteCursor => {
  let parsedValue: unknown;

  try {
    parsedValue = JSON.parse(
      Buffer.from(value, 'base64url').toString('utf8'),
    ) as unknown;
  } catch {
    throw new Error('Invalid cursor.');
  }

  if (
    typeof parsedValue !== 'object' ||
    parsedValue === null ||
    !('createdAt' in parsedValue) ||
    !('id' in parsedValue) ||
    typeof parsedValue.createdAt !== 'string' ||
    typeof parsedValue.id !== 'string'
  ) {
    throw new Error('Invalid cursor.');
  }

  return {
    createdAt: parsedValue.createdAt,
    id: parsedValue.id,
  };
};
