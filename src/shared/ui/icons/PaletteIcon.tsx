import type { IconProps } from './Icon.types';

const PaletteIcon = (props: IconProps) => (
  <svg
    aria-hidden="true"
    fill="none"
    height="20"
    viewBox="0 0 20 20"
    width="20"
    {...props}
  >
    <path
      d="M10 3.333c-3.682 0-6.667 2.8-6.667 6.25 0 3.451 2.985 6.25 6.667 6.25h.833a1.667 1.667 0 1 0 0-3.333h-.208a1.25 1.25 0 0 1 0-2.5H12.5c2.301 0 4.167-1.866 4.167-4.167 0-1.38-1.12-2.5-2.5-2.5H10Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1"
    />
    <circle cx="6.25" cy="9.167" fill="currentColor" r="1.042" />
    <circle cx="8.75" cy="6.667" fill="currentColor" r="1.042" />
    <circle cx="12.083" cy="6.667" fill="currentColor" r="1.042" />
  </svg>
);

export { PaletteIcon };
