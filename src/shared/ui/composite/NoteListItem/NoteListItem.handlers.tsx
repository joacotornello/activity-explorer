import { formatNoteColorLabel, formatNoteDateTime } from '@entities/note/lib/formatters';
import type { StickyNote } from '@entities/note/model/types';

import { t } from '@shared/i18n';

const getNoteAriaLabel = (note: StickyNote, selected: boolean): string =>
  t(selected ? 'feed.aria.selectedItem' : 'feed.aria.item', {
    author: note.author.name,
    color: formatNoteColorLabel(note.color),
    createdAt: formatNoteDateTime(note.createdAt),
  });

const getNoteDisplayMeta = (note: StickyNote) => ({
  absoluteTime: formatNoteDateTime(note.createdAt),
  colorLabel: formatNoteColorLabel(note.color),
});

export { getNoteAriaLabel, getNoteDisplayMeta };
