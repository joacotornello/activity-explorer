import type { IconProps } from './Icon.types';

const SwatchIcon = (props: IconProps) => (
  <svg
    aria-hidden="true"
    fill="none"
    height="16"
    viewBox="0 0 16 16"
    width="16"
    {...props}
  >
    <path
      d="M3.25 8.75 8 3.75l4.75 5-4.75 4.5-4.75-4.5Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1"
    />
  </svg>
);

export { SwatchIcon };
