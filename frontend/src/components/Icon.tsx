import React from 'react';

/** Ícones de traço contínuo (stroke 1.5, cantos arredondados) — substituem todos os emojis do site. */
export type IconName =
  | 'camera' | 'reel' | 'invite' | 'orbit' | 'chat' | 'mail' | 'instagram' | 'pin'
  | 'check' | 'sun' | 'close' | 'play' | 'arrow' | 'arrow-up-right' | 'mic' | 'code' | 'academy' | 'globe';

const PATHS: Record<IconName, React.ReactNode> = {
  camera: (
    <>
      <path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h9A1.5 1.5 0 0 1 15 8.5v7a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 3 15.5z" />
      <path d="m15 10.5 4.6-2.6a.6.6 0 0 1 .9.5v7.2a.6.6 0 0 1-.9.5L15 13.5" />
      <circle cx="7" cy="4.5" r="1.5" />
      <circle cx="11.5" cy="4.5" r="1.5" />
    </>
  ),
  reel: (
    <>
      <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
      <path d="M10.5 9.5v5l4-2.5z" />
      <path d="M10 18.5h4" />
    </>
  ),
  invite: (
    <>
      <path d="M3.5 7.5A1.5 1.5 0 0 1 5 6h14a1.5 1.5 0 0 1 1.5 1.5v10A1.5 1.5 0 0 1 19 19H5a1.5 1.5 0 0 1-1.5-1.5z" />
      <path d="m4 7 8 6 8-6" />
      <path d="M17.5 2.5v2M16.5 3.5h2" />
    </>
  ),
  orbit: (
    <>
      <circle cx="12" cy="12" r="3" />
      <ellipse cx="12" cy="12" rx="9.5" ry="4" transform="rotate(-25 12 12)" />
      <circle cx="19.6" cy="8.4" r="1.2" />
    </>
  ),
  chat: (
    <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9a1.5 1.5 0 0 1-1.5 1.5H10l-4.5 4v-4h0A1.5 1.5 0 0 1 4 14.5zM8 9h8M8 12h5" />
  ),
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="1.5" />
      <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
    </>
  ),
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r=".6" fill="currentColor" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-6.5-6.2-6.5-11A6.5 6.5 0 0 1 18.5 10c0 4.8-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.3" />
    </>
  ),
  check: <path d="m5 12.5 4.2 4L19 7" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6 6 18" />,
  play: <path d="M8 5.5v13l10.5-6.5z" />,
  arrow: <path d="M4 12h15M13.5 6.5 19 12l-5.5 5.5" />,
  'arrow-up-right': <path d="M7 17 17 7M8.5 7H17v8.5" />,
  mic: (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M9 21h6" />
    </>
  ),
  code: <path d="m8.5 7-5 5 5 5M15.5 7l5 5-5 5M13.5 4.5l-3 15" />,
  academy: (
    <>
      <path d="m2.5 9 9.5-4.5L21.5 9 12 13.5z" />
      <path d="M6.5 11v4.5c0 1.4 2.5 3 5.5 3s5.5-1.6 5.5-3V11M21.5 9v5" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.6 2.6 3.8 5.6 3.8 9S14.6 18.4 12 21c-2.6-2.6-3.8-5.6-3.8-9S9.4 5.6 12 3z" />
    </>
  )
};

export const Icon: React.FC<{ name: IconName; size?: number; className?: string; title?: string }> = ({
  name,
  size = 20,
  className,
  title
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`mz-icon ${className ?? ''}`}
    role={title ? 'img' : undefined}
    aria-hidden={title ? undefined : true}
  >
    {title ? <title>{title}</title> : null}
    {PATHS[name]}
  </svg>
);
