import type { IconProps } from './Icon.types';

const FilterIcon = (props: IconProps) => (
  <svg
    aria-hidden="true"
    fill="none"
    height="20"
    viewBox="0 0 20 20"
    width="20"
    {...props}
  >
    <path
      d="M2.5 4.167c0-.46.373-.834.833-.834h13.334a.833.833 0 0 1 .62 1.39l-5.62 6.216a.833.833 0 0 0-.214.56v4.334a.833.833 0 0 1-1.356.648l-2.5-2.084a.833.833 0 0 1-.3-.641V11.5a.833.833 0 0 0-.214-.56L2.713 4.723a.833.833 0 0 1-.213-.556Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.75"
    />
  </svg>
);

export { FilterIcon };
