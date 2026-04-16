import type { IconButtonProps } from './IconButton.types';

import './IconButton.scss';

const IconButton = ({
  className,
  icon,
  label,
  type = 'button',
  ...buttonProps
}: IconButtonProps) => (
  <button
    aria-label={label}
    className={['ui-icon-button', className ?? ''].filter(Boolean).join(' ')}
    type={type}
    {...buttonProps}
  >
    {icon}
  </button>
);

export { IconButton };
