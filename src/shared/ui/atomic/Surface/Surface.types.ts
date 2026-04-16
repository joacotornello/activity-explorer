import type { HTMLAttributes, ReactNode } from 'react';

type SurfaceElement = 'div' | 'section' | 'article' | 'aside' | 'main' | 'li';

type SurfaceProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  interactive?: boolean;
  selected?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  as?: SurfaceElement;
};

export type { SurfaceProps };
