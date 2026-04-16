import { t } from '@shared/i18n';
import { SkeletonBlock } from '@shared/ui/atomic/SkeletonBlock';
import { VisuallyHidden } from '@shared/ui/atomic/VisuallyHidden';
import type { LoadingStateProps } from './LoadingState.types';

import './LoadingState.scss';

const LoadingState = ({
  children,
  className,
  label = t('common.status.loading'),
}: LoadingStateProps) => {
  const classes = ['ui-loading-state', className].filter(Boolean).join(' ');

  return (
    <div
      aria-label={label}
      aria-live="polite"
      className={classes}
      role="status"
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children ?? (
        <SkeletonBlock
          className="ui-loading-state__fallback"
          height="var(--spacing-md)"
          width="8rem"
        />
      )}
    </div>
  );
};

export { LoadingState };
