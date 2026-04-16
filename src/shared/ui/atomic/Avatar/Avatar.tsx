import { Text } from '../Text';
import type { AvatarProps } from './Avatar.types';

import './Avatar.scss';

const Avatar = ({ initials, size = 'md' }: AvatarProps) => (
  <Text as="span" aria-hidden="true" className={`ui-avatar ui-avatar--${size}`}>
    {initials}
  </Text>
);

export { Avatar };
