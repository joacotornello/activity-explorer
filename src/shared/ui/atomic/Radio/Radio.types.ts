import type { ReactNode } from 'react';

interface RadioProps {
  checked: boolean;
  label: ReactNode;
  name: string;
  value: string;
  onChange: (value: string) => void;
}

export type { RadioProps };
