import type { ColorFacet } from '@shared/ui/model';

interface ColorFilterOptionProps {
  facet: ColorFacet;
  checked: boolean;
  onToggle: (color: ColorFacet['color']) => void;
}

export type { ColorFilterOptionProps };
