import { CloseIcon } from '@shared/ui/icons';

import { t } from '@shared/i18n';
import { IconButton } from '@shared/ui/atomic/IconButton';
import { Surface } from '@shared/ui/atomic/Surface';
import { Text } from '@shared/ui/atomic/Text';
import { NoteMetadataList } from '@shared/ui/composite/NoteMetadataList';
import { NoteTitleBanner } from '@shared/ui/composite/NoteTitleBanner';
import type { NoteDetailsPanelProps } from './NoteDetailsPanel.types';

import './NoteDetailsPanel.scss';

const NoteDetailsPanel = ({ note, onClose }: NoteDetailsPanelProps) => {
  return (
    <Surface
      aria-labelledby="note-details-title"
      as="aside"
      className="app-note-details-panel"
      padding="lg"
    >
      <div className="app-note-details-panel__header">
        <div>
          <Text
            as="p"
            className="app-note-details-panel__eyebrow"
            color="tertiary"
          >
            {t('common.actions.selected')}
          </Text>
          <Text
            as="h2"
            className="app-note-details-panel__title"
            id="note-details-title"
          >
            {t('noteDetails.title')}
          </Text>
        </div>

        <IconButton
          icon={<CloseIcon />}
          label={t('noteDetails.actions.close')}
          onClick={onClose}
        />
      </div>

      <NoteTitleBanner
        color={note.color}
        text={note.text}
      />

      <NoteMetadataList note={note} />
    </Surface>
  );
};

export { NoteDetailsPanel };
