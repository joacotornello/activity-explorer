import type { TimeRangePreset } from '@entities/note/model/types';

interface TimeRangeFilterGroupProps {
  value: TimeRangePreset;
  onChange: (value: TimeRangePreset) => void;
}

export type { TimeRangeFilterGroupProps };
