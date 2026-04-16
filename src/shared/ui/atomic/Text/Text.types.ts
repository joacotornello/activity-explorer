import type { HTMLAttributes, ReactNode } from 'react';

type TextElement = 'h1' | 'h2' | 'h3' | 'p' | 'span';
type TextColor = 'primary' | 'secondary' | 'tertiary' | 'inverse' | 'disabled';
type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';

interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: TextElement;
  children?: ReactNode;
  color?: TextColor;
  size?: TextSize;
  weight?: TextWeight;
}

export type { TextColor, TextElement, TextProps };
