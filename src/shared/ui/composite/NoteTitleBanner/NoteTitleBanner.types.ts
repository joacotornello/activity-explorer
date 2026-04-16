import type { ReactNode } from 'react';

import type { NoteColor } from '@entities/note/model/types';

interface NoteTitleBannerProps {
  text: ReactNode;
  color: NoteColor;
}

export type { NoteTitleBannerProps };
