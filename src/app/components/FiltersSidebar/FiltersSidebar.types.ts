import type {
  AuthorFacet,
  ColorFacet,
  FiltersState,
  NoteColor,
  TimeRange,
} from '../model';

interface FiltersSidebarProps {
  authors: AuthorFacet[];
  colors: ColorFacet[];
  filters: FiltersState;
  onToggleAuthor: (authorId: string) => void;
  onToggleColor: (color: NoteColor) => void;
  onChangeTimeRange: (range: TimeRange) => void;
  onClear: () => void;
}

export type { FiltersSidebarProps };
