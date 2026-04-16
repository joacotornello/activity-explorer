import type { IconProps } from './Icon.types';

const UserIcon = (props: IconProps) => (
  <svg
    aria-hidden="true"
    fill="none"
    height="16"
    viewBox="0 0 16 16"
    width="16"
    {...props}
  >
    <path
      d="M8 8.25A2.75 2.75 0 1 0 8 2.75a2.75 2.75 0 0 0 0 5.5ZM3.25 13.25a4.75 4.75 0 0 1 9.5 0"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1"
    />
  </svg>
);

export { UserIcon };
