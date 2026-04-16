import type { NoteColor } from '@entities/note/model/types';

type AuthorFacet = {
  id: string;
  name: string;
};

type ColorFacet = {
  color: NoteColor;
  label: string;
};

export type { AuthorFacet, ColorFacet };
