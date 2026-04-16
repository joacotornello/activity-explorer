import { Text } from '../Text';
import type { BadgeProps } from './Badge.types';

import './Badge.scss';

const Badge = ({ children, tone }: BadgeProps) => (
  <Text as="span" className={`ui-badge ui-badge--${tone}`}>
    {children}
  </Text>
);

export { Badge };
