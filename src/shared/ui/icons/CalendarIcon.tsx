import type { IconProps } from './Icon.types';

const CalendarIcon = (props: IconProps) => (
  <svg
    aria-hidden="true"
    fill="none"
    height="20"
    viewBox="0 0 20 20"
    width="20"
    {...props}
  >
    <rect
      height="12.5"
      rx="2"
      stroke="currentColor"
      strokeWidth="1"
      width="13.333"
      x="3.333"
      y="4.167"
    />
    <path
      d="M6.667 2.5v3.334M13.333 2.5v3.334M3.333 8.333h13.334"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1"
    />
  </svg>
);

export { CalendarIcon };
