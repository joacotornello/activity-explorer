import type { ReactNode } from 'react';

interface CollapsibleProps {
  children: ReactNode;
  maxVisibleItems: number;
  expandButtonAriaLabel: string;
  className?: string;
  contentClassName?: string;
  expandButtonLabel?: string;
}

interface CollapsibleItemProps {
  children: ReactNode;
}

export type { CollapsibleProps, CollapsibleItemProps };
