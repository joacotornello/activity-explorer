import type { TimeRangePreset } from '@entities/note/model/types';

import { Radio } from '@shared/ui/atomic/Radio';
import { timeRangeOptions } from './TimeRangeFilterGroup.handlers';
import type { TimeRangeFilterGroupProps } from './TimeRangeFilterGroup.types';

import './TimeRangeFilterGroup.scss';

const TimeRangeFilterGroup = ({
  onChange,
  value,
}: TimeRangeFilterGroupProps) => (
  <div className="ui-time-range-filter-group">
    {timeRangeOptions.map((option) => (
      <Radio
        key={option.value}
        checked={value === option.value}
        label={option.label}
        name="time-range"
        value={option.value}
        onChange={(nextValue) => onChange(nextValue as TimeRangePreset)}
      />
    ))}
  </div>
);

export { TimeRangeFilterGroup };
