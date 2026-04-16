import { Text } from '../Text';
import type { ButtonProps } from './Button.types';

import './Button.scss';

const Button = ({
  children,
  className,
  leadingIcon,
  selected,
  size = 'md',
  type = 'button',
  variant = 'primary',
  ...buttonProps
}: ButtonProps) => {
  const classes = [
    'ui-button',
    `ui-button--${variant}`,
    `ui-button--${size}`,
    selected ? 'is-selected' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      aria-pressed={
        buttonProps['aria-pressed'] === undefined
          ? selected
          : buttonProps['aria-pressed']
      }
      className={classes}
      type={type}
      {...buttonProps}
    >
      {leadingIcon ? (
        <Text as="span" className="ui-button__icon">
          {leadingIcon}
        </Text>
      ) : null}
      {children}
    </button>
  );
};

export { Button };
