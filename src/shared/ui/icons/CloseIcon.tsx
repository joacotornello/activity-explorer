import type { IconProps } from './Icon.types';

const CloseIcon = (props: IconProps) => (
  <svg
    aria-hidden="true"
    fill="none"
    height="16"
    viewBox="0 0 16 16"
    width="16"
    {...props}
  >
    <path
      d="m4 4 8 8M12 4l-8 8"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1"
    />
  </svg>
);

export { CloseIcon };
