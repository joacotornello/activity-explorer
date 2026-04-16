import { Badge } from '@shared/ui/atomic/Badge';
import { Text } from '@shared/ui/atomic/Text';
import { VisuallyHidden } from '@shared/ui/atomic/VisuallyHidden';
import { t } from '@shared/i18n';

import { getNoteAriaLabel, getNoteDisplayMeta } from './NoteListItem.handlers';
import type { NoteListItemProps } from './NoteListItem.types';

import './NoteListItem.scss';

const NoteListItem = ({ note, onSelect, selected }: NoteListItemProps) => {
  const displayMeta = getNoteDisplayMeta(note);

  return (
    <button
      aria-label={getNoteAriaLabel(note, selected)}
      aria-pressed={selected}
      className={`ui-note-list-item${selected ? ' is-selected' : ''}`}
      type="button"
      onClick={() => onSelect(note.id)}
    >
      <Text
        as="span"
        aria-hidden="true"
        className={`ui-note-list-item__accent ui-note-list-item__accent--${note.color}`}
      />

      <Text as="span" className="ui-note-list-item__body">
        <Text as="span" className="ui-note-list-item__header">
          <Text as="span" className="ui-note-list-item__author-row">
            <Text as="span" className="ui-note-list-item__author-name" weight="semibold" size="md">
              {note.author.name}
            </Text>
            <Badge tone={note.color}>{displayMeta.colorLabel}</Badge>
            {selected ? <Badge tone="blue">{t('feed.badges.selected')}</Badge> : null}
          </Text>

          <time
            className="ui-note-list-item__time"
            dateTime={note.createdAt}
            title={displayMeta.absoluteTime}
          >
            {displayMeta.absoluteTime}
          </time>
        </Text>

        <Text as="span" className="ui-note-list-item__content" color="secondary">
          {note.text}
        </Text>

        <VisuallyHidden>
          {selected ? t('a11y.selection.selected') : t('a11y.selection.notSelected')}
        </VisuallyHidden>
      </Text>
    </button>
  );
};

export { NoteListItem };
