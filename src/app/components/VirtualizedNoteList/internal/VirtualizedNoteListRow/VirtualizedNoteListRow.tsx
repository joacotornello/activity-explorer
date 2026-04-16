import { NoteListItem } from '@shared/ui/composite/NoteListItem';
import { t } from '@shared/i18n';
import { Text } from '@shared/ui/atomic/Text';
import { type RowComponentProps } from 'react-window';

import type { VirtualizedNoteListRowProps } from './VirtualizedNoteListRow.types';
import "./VirtualizedNoteListRow.scss";

const VirtualizedNoteListRow = ({
  ariaAttributes,
  hasMore,
  index,
  notes,
  onMeasureRow,
  onSelectNote,
  selectedNoteId,
  style,
}: RowComponentProps<VirtualizedNoteListRowProps>) => {
  const note = notes[index];

  if (!note) {
    if (hasMore || index !== notes.length) {
      return null;
    }

    return (
      <div
        {...ariaAttributes}
        className="app-virtualized-note-list__item app-virtualized-note-list__item--end"
        style={style}
      >
        <Text aria-live="polite" as="p" color="tertiary" size="sm">
          {t('feed.state.endOfList')}
        </Text>
      </div>
    );
  }

  return (
    <div
      {...ariaAttributes}
      className="app-virtualized-note-list__item"
      data-note-id={note.id}
      style={style}
    >
      <div
        ref={(element) => {
          onMeasureRow(note.id, element);
        }}
        className="app-virtualized-note-list__item-inner"
      >
        <NoteListItem
          note={note}
          selected={note.id === selectedNoteId}
          onSelect={onSelectNote}
        />
      </div>
    </div>
  );
};

export { VirtualizedNoteListRow };