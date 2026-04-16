import type { TextProps } from './Text.types';

import './Text.scss';

const Text = ({
  as = 'p',
  children,
  className,
  size = "sm",
  color = 'primary',
  weight = "normal",
  ...textProps
}: TextProps) => {
  const Component = as;
  const classes = [
    'ui-text',
    `ui-text--${color}`,
    `ui-text--${size}`,
    `ui-text--${weight}`,
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Component className={classes} {...textProps}>
      {children}
    </Component>
  );
};

export { Text };
