import { px } from '~/modules/helpers';

export default function Spinner({ size = 12 }: { size?: number }): JSX.Element {
  return (
    <svg
      height={px(size)}
      preserveAspectRatio="xMidYMid"
      version="1.1"
      viewBox="0 0 16.0 16.0"
      width={px(size)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path
          d="M8,0 L8,2.4 C4.907208,2.4 2.4,4.907208 2.4,8 L0,8 C0,3.58172 3.58172,0 8,0 Z"
          fill="currentColor"
        />
        <path
          d="M8,0 C12.41824,0 16,3.58172 16,8 C16,12.41824 12.41824,16 8,16 C3.58172,16 0,12.41824 0,8 C0,3.58172 3.58172,0 8,0 Z M8,2.4 C4.907208,2.4 2.4,4.907208 2.4,8 C2.4,11.0928 4.907208,13.6 8,13.6 C11.0928,13.6 13.6,11.0928 13.6,8 C13.6,4.907208 11.0928,2.4 8,2.4 Z"
          fill="currentColor"
          fillOpacity="0.3"
        />
      </g>
    </svg>
  );
}
