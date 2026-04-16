import { Checkbox } from '@shared/ui/atomic/Checkbox';
import { ColorSwatch } from '@shared/ui/atomic/ColorSwatch';
import { Text } from '@shared/ui/atomic/Text';
import type { ColorFilterOptionProps } from './ColorFilterOption.types';

import './ColorFilterOption.scss';

const ColorFilterOption = ({
  checked,
  facet,
  onToggle,
}: ColorFilterOptionProps) => (
  <div className="ui-color-filter-option">
    <Checkbox
      checked={checked}
      label={
        <Text as="span" className="ui-color-filter-option__label">
          <ColorSwatch color={facet.color} size="md" />
          <Text as="span" className="ui-color-filter-option__name">
            {facet.label}
          </Text>
        </Text>
      }
      onChange={() => onToggle(facet.color)}
    />
  </div>
);

export { ColorFilterOption };
