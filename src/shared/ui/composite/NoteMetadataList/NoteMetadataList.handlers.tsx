import {
  formatNoteColorLabel,
  formatNoteDateTime,
} from '@entities/note/lib/formatters';
import type { StickyNote } from '@entities/note/model/types';
import { t } from '@shared/i18n';
import { Badge } from '@shared/ui/atomic/Badge';
import { ClockIcon, SwatchIcon, UserIcon } from '@shared/ui/icons';

const getNoteMetadataItems = (note: StickyNote) => [
  {
    icon: <UserIcon />,
    label: t('noteDetails.fields.author'),
    value: note.author.name,
  },
  {
    icon: <SwatchIcon />,
    label: t('noteDetails.fields.color'),
    value: <Badge tone={note.color}>{formatNoteColorLabel(note.color)}</Badge>,
  },
  {
    icon: <ClockIcon />,
    label: t('noteDetails.fields.created'),
    value: formatNoteDateTime(note.createdAt),
  },
];

export { getNoteMetadataItems };
