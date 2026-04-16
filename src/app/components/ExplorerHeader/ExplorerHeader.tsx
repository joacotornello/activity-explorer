import { t } from '@shared/i18n';
import { Text } from '@shared/ui/atomic/Text';
import { ResultSummary } from '@shared/ui/composite/ResultSummary';
import type { ExplorerHeaderProps } from './ExplorerHeader.types';

import './ExplorerHeader.scss';

const ExplorerHeader = ({
  activeFilterCount,
  title = t('app.title'),
  totalVisible,
}: ExplorerHeaderProps) => {
  return (
    <header className="app-explorer-header">
      <div className="app-explorer-header__top">
        <div className="app-explorer-header__copy">
          <Text
            as="h1"
            className="app-explorer-header__title"
            id="activity-feed-title"
            size="xl"
            weight="medium"
          >
            {title}
          </Text>
          <ResultSummary
            activeFilterCount={activeFilterCount}
            totalVisible={totalVisible}
          />
        </div>
      </div>
    </header>
  );
};

export { ExplorerHeader };
