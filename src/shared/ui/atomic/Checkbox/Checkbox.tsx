import { Text } from '../Text';
import type { CheckboxProps } from './Checkbox.types';

import './Checkbox.scss';

const Checkbox = ({ checked, disabled = false, label, onChange }: CheckboxProps) => (
  <label className={`ui-checkbox${disabled ? ' is-disabled' : ''}`}>
    <input
      checked={checked}
      disabled={disabled}
      type="checkbox"
      onChange={(event) => onChange(event.currentTarget.checked)}
    />
    <Text as="span" className="ui-checkbox__label">
      {label}
    </Text>
  </label>
);

export { Checkbox };
