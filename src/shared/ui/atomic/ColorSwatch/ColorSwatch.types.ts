import type { NoteColor } from '@entities/note/model/types';

interface ColorSwatchProps {
  color: NoteColor;
  size?: 'sm' | 'md';
}

export type { ColorSwatchProps };
