import { MetadataItem } from '@shared/ui/atomic/MetadataItem';
import { getNoteMetadataItems } from './NoteMetadataList.handlers';
import type { NoteMetadataListProps } from './NoteMetadataList.types';

import './NoteMetadataList.scss';

const NoteMetadataList = ({ note }: NoteMetadataListProps) => (
  <dl className="ui-note-metadata-list">
    {getNoteMetadataItems(note).map((item) => (
      <MetadataItem
        key={item.label}
        icon={item.icon}
        label={item.label}
        value={item.value}
      />
    ))}
  </dl>
);

export { NoteMetadataList };
