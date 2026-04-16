import type { ReactNode } from 'react';

type SidebarProps = {
  children: ReactNode;
  closeLabel: string;
  labelledBy?: string;
  onClose: () => void;
  open: boolean;
};

export type { SidebarProps };
