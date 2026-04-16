import type { SurfaceProps } from './Surface.types';

import './Surface.scss';

const Surface = ({
  as = 'div',
  children,
  className,
  interactive = false,
  padding = 'md',
  selected = false,
  ...surfaceProps
}: SurfaceProps) => {
  const Component = as;
  const classes = [
    'ui-surface',
    `ui-surface--${padding}`,
    interactive ? 'ui-surface--interactive' : '',
    selected ? 'is-selected' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Component className={classes} {...surfaceProps}>
      {children}
    </Component>
  );
};

export { Surface };
