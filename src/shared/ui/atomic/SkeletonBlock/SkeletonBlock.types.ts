import type { CSSProperties } from 'react';

type SkeletonBlockShape = 'circle' | 'line' | 'rectangle';

interface SkeletonBlockProps {
  className?: string;
  height?: string;
  shape?: SkeletonBlockShape;
  style?: CSSProperties;
  width?: string;
}

export type { SkeletonBlockProps, SkeletonBlockShape };
