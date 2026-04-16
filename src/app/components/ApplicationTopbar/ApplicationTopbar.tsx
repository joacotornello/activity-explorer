import { t } from '@shared/i18n';
import { Text } from '@shared/ui/atomic/Text';

import './ApplicationTopbar.scss';

const ApplicationTopbar = () => (
  <div className="app-application-topbar">
    <a
      className="app-application-topbar__skip-link"
      href="#activity-feed-title"
    >
      {t('feed.aria.region')}
    </a>

    <Text
      as="p"
      className="app-application-topbar__title"
      color="inverse"
      size="xl"
      weight="medium"
    >
      {t('app.title')}
    </Text>
  </div>
);

export { ApplicationTopbar };
