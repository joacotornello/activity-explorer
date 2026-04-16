import type { CSSProperties } from 'react';
import type { SkeletonBlockProps } from './SkeletonBlock.types';

import './SkeletonBlock.scss';

type SkeletonBlockStyle = CSSProperties & {
  '--ui-skeleton-height'?: string;
  '--ui-skeleton-width'?: string;
};

const SkeletonBlock = ({
  className,
  height = 'var(--spacing-md)',
  shape = 'line',
  style,
  width = '100%',
}: SkeletonBlockProps) => {
  const classes = ['ui-skeleton-block', `ui-skeleton-block--${shape}`, className]
    .filter(Boolean)
    .join(' ');

  const skeletonStyle: SkeletonBlockStyle = {
    ...style,
    '--ui-skeleton-height': height,
    '--ui-skeleton-width': width,
  };

  return <span aria-hidden="true" className={classes} style={skeletonStyle} />;
};

export { SkeletonBlock };
