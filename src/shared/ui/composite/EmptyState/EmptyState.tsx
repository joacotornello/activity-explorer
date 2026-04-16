import { Text } from '@shared/ui/atomic/Text';
import type { EmptyStateProps } from './EmptyState.types';

import './EmptyState.scss';

const EmptyState = ({ action, description, title }: EmptyStateProps) => (
  <section aria-live="polite" className="ui-empty-state" role="status">
    <Text as="h2" className="ui-empty-state__title">
      {title}
    </Text>

    <Text as="p" className="ui-empty-state__description" color="secondary">
      {description}
    </Text>

    {action}
  </section>
);

export { EmptyState };
