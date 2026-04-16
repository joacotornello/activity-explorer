import { Text } from '@shared/ui/atomic/Text';
import type { NoteTitleBannerProps } from './NoteTitleBanner.types';

import './NoteTitleBanner.scss';

const NoteTitleBanner = ({ color, text }: NoteTitleBannerProps) => (
  <Text className={`ui-note-title-banner ui-note-title-banner--${color}`}>
    {text}
  </Text>
);

export { NoteTitleBanner };
