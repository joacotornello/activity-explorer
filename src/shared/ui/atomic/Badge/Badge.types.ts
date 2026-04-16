import type { ReactNode } from 'react';

import type { NoteColor } from '@entities/note/model/types';

interface BadgeProps {
  tone: NoteColor | 'neutral';
  children: ReactNode;
}

export type { BadgeProps };
