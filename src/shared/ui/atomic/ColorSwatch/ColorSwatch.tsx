import { Text } from '@shared/ui/atomic/Text';
import type { ColorSwatchProps } from './ColorSwatch.types';

import './ColorSwatch.scss';

const ColorSwatch = ({ color, size = 'md' }: ColorSwatchProps) => (
  <Text
    as="span"
    aria-hidden="true"
    className={`ui-color-swatch ui-color-swatch--${color} ui-color-swatch--${size}`}
  />
);

export { ColorSwatch };
