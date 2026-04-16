import type { NotesResponse } from '../../../../server/api/contracts/notes';
import { DEFAULT_NOTES_PAGE_SIZE } from '@entities/note/model/types';
import { normalizeActivityFeedUrlState } from '../../filter-rail/model/searchParams';
import type { ActivityFeedUrlState } from '../../filter-rail/model/searchParams.types';
import { apiClient } from '@shared/api/client';
import type { ApiSearchParams } from '@shared/api/client.types';
import type { NotesPageRequest } from './getNotes.types';

const getNotesQueryKey = (input: Partial<ActivityFeedUrlState>) =>
  ['notes', normalizeActivityFeedUrlState(input)] as const;

const buildNotesRequestSearchParams = (
  input: NotesPageRequest,
): ApiSearchParams => {
  const normalizedFilters = normalizeActivityFeedUrlState(input);

  return {
    limit: input.limit ?? DEFAULT_NOTES_PAGE_SIZE,
    cursor: input.cursor,
    authors:
      normalizedFilters.authors.length > 0
        ? normalizedFilters.authors.join(',')
        : undefined,
    colors:
      normalizedFilters.colors.length > 0
        ? normalizedFilters.colors.join(',')
        : undefined,
    timeRange: normalizedFilters.timeRange,
  };
};

const getNotes = ({
  signal,
  ...input
}: NotesPageRequest): Promise<NotesResponse> =>
  apiClient.get<NotesResponse>('/api/notes', {
    searchParams: buildNotesRequestSearchParams(input),
    ...(signal ? { signal } : {}),
  });

export { buildNotesRequestSearchParams, getNotesQueryKey, getNotes };
