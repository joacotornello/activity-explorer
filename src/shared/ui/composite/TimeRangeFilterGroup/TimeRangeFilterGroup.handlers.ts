import {
  TIME_RANGE_PRESETS,
  type TimeRangePreset,
} from '@entities/note/model/types';

import { t } from '@shared/i18n';

const timeRangeTranslationKeyByPreset: Record<TimeRangePreset, string> = {
  all: 'timeRange.allTime',
  today: 'timeRange.today',
  week: 'timeRange.last7Days',
  month: 'timeRange.last30Days',
};

const getTimeRangeLabel = (value: TimeRangePreset): string =>
  t(timeRangeTranslationKeyByPreset[value]);

const timeRangeOptions = TIME_RANGE_PRESETS.map((preset) => ({
  value: preset,
  label: getTimeRangeLabel(preset),
}));

export { getTimeRangeLabel, timeRangeOptions };
