import {
  DEFAULT_TIME_RANGE_PRESET,
  NOTE_COLORS,
  TIME_RANGE_PRESETS,
  isNoteColor,
  isTimeRangePreset,
} from './types';

describe('note model types', () => {
  it('exposes deterministic defaults for feed queries', () => {
    expect(DEFAULT_TIME_RANGE_PRESET).toBe('all');
  });

  it('keeps available filter enums explicit', () => {
    expect(NOTE_COLORS).toEqual(['red', 'yellow', 'blue', 'green', 'purple']);
    expect(TIME_RANGE_PRESETS).toEqual(['all', 'today', 'week', 'month']);
  });

  it('validates supported enum values with narrow type guards', () => {
    expect(isNoteColor('blue')).toBe(true);
    expect(isNoteColor('pink')).toBe(false);
    expect(isTimeRangePreset('today')).toBe(true);
    expect(isTimeRangePreset('last_30_days')).toBe(false);
  });
});
