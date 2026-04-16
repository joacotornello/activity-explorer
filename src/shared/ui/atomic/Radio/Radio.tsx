import { Text } from '../Text';
import type { RadioProps } from './Radio.types';

import './Radio.scss';

const Radio = ({ checked, label, name, onChange, value }: RadioProps) => (
  <label className={`ui-radio ${checked ? 'is-checked' : ''}`}>
    <input
      checked={checked}
      name={name}
      type="radio"
      value={value}
      onChange={() => onChange(value)}
    />
    <Text as="span" className="ui-radio__label">
      {label}
    </Text>
  </label>
);

export { Radio };
