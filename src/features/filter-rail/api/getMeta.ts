import type { NotesMetaResponse } from '../../../../server/api/contracts/notes';
import { apiClient } from '@shared/api/client';

const metaQueryKey = ['notes-meta'] as const;

const getMeta = (signal?: AbortSignal): Promise<NotesMetaResponse> =>
  apiClient.get<NotesMetaResponse>('/api/meta', {
    ...(signal ? { signal } : {}),
  });

export { metaQueryKey, getMeta };
