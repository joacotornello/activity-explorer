import { Text } from '../Text';
import type { VisuallyHiddenProps } from './VisuallyHidden.types';

import './VisuallyHidden.scss';

const VisuallyHidden = ({ children }: VisuallyHiddenProps) => (
  <Text as="span" className="ui-visually-hidden">
    {children}
  </Text>
);

export { VisuallyHidden };
