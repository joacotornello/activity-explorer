import type { ActivityFeedUrlState } from '../../filter-rail/model/searchParams.types';

export type NotesPageRequest = Partial<ActivityFeedUrlState> & {
  cursor?: string;
  limit?: number;
  signal?: AbortSignal;
};
