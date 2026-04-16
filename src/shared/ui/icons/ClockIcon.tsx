import type { IconProps } from './Icon.types';

const ClockIcon = (props: IconProps) => (
  <svg
    aria-hidden="true"
    fill="none"
    height="16"
    viewBox="0 0 16 16"
    width="16"
    {...props}
  >
    <circle cx="8" cy="8" r="5.25" stroke="currentColor" strokeWidth="1" />
    <path
      d="M8 5.25v3l2 1.5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1"
    />
  </svg>
);

export { ClockIcon };
