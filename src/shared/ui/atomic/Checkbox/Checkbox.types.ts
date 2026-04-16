import type { ReactNode } from 'react';

interface CheckboxProps {
  checked: boolean;
  disabled?: boolean;
  label: ReactNode;
  onChange: (nextChecked: boolean) => void;
}

export type { CheckboxProps };
