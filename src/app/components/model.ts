import type {
  NoteColor,
  StickyNote,
  TimeRangePreset,
} from '@entities/note/model/types';

import type { ActivityFeedUrlState } from '../../features/filter-rail/model/searchParams.types';
import type { AuthorFacet, ColorFacet } from '@shared/ui/model';

type Note = StickyNote;

type FiltersState = Pick<ActivityFeedUrlState, 'authors' | 'colors' | 'timeRange'>;

type TimeRange = TimeRangePreset;

export type {
  ActivityFeedUrlState,
  AuthorFacet,
  ColorFacet,
  FiltersState,
  Note,
  NoteColor,
  TimeRange,
};
