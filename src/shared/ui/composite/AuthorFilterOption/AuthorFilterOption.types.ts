import type { AuthorFacet } from '@shared/ui/model';

interface AuthorFilterOptionProps {
  author: AuthorFacet;
  checked: boolean;
  onToggle: (authorId: string) => void;
}

export type { AuthorFilterOptionProps };
