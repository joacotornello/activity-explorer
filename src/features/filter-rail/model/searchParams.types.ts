import type { TimeRangePreset, NoteColor } from '@entities/note/model/types';

type ActivityFeedUrlState = Readonly<{
  authors: string[];
  colors: NoteColor[];
  timeRange: TimeRangePreset;
}>;

type ActivityFeedUrlStateInput = {
  authors?: readonly string[];
  colors?: readonly string[];
  timeRange?: string;
};

export type { ActivityFeedUrlState, ActivityFeedUrlStateInput };
