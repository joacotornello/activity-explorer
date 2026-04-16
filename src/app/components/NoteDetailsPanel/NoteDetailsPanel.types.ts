import type { StickyNote } from '@entities/note/model/types';

type NoteDetailsPanelProps = {
  note: StickyNote;
  onClose: () => void;
};

export type { NoteDetailsPanelProps };
