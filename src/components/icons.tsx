import type { SVGProps } from "react";

// Set minimale di icone lineari (stroke) coerenti con lo stile istituzionale.
type IconProps = SVGProps<SVGSVGElement>;

function base(props: IconProps) {
  return {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...props,
  };
}

export const IconSearch = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

export const IconVerified = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3 4.5 6v5c0 4.2 2.9 7.6 7.5 9 4.6-1.4 7.5-4.8 7.5-9V6L12 3Z" />
    <path d="m9 11.5 2 2 4-4" />
  </svg>
);

export const IconCheck = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m5 12 5 5L20 6" />
  </svg>
);

export const IconClose = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const IconMenu = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const IconMapPin = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

export const IconTruck = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 6h11v9H3zM14 9h4l3 3v3h-7z" />
    <circle cx="7" cy="18" r="1.6" />
    <circle cx="17" cy="18" r="1.6" />
  </svg>
);

export const IconStore = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 9V6l1.5-2h13L20 6v3a2.5 2.5 0 0 1-5 0 2.5 2.5 0 0 1-5 0 2.5 2.5 0 0 1-5 0Z" />
    <path d="M5 11v9h14v-9M9 20v-5h6v5" />
  </svg>
);

export const IconTag = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 12V4h8l9 9-8 8-9-9Z" />
    <circle cx="7.5" cy="7.5" r="1.2" />
  </svg>
);

export const IconBox = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 7.5 12 3l9 4.5V16L12 21 3 16z" />
    <path d="M3 7.5 12 12l9-4.5M12 12v9" />
  </svg>
);

export const IconChart = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 20V4M4 20h16" />
    <path d="M8 16v-4M12 16V8M16 16v-7" />
  </svg>
);

export const IconMessage = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 5h16v11H9l-5 4z" />
  </svg>
);

export const IconDoc = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 3h8l4 4v14H6z" />
    <path d="M14 3v4h4M9 13h6M9 17h6" />
  </svg>
);

export const IconStar = (p: IconProps) => (
  <svg {...base({ fill: "currentColor", stroke: "none", ...p })}>
    <path d="m12 3 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.6l1-5.8L3.5 9.7l5.9-.9z" />
  </svg>
);

export const IconArrowRight = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const IconShield = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3 5 6v5c0 4.2 2.8 7.6 7 9 4.2-1.4 7-4.8 7-9V6l-7-3Z" />
  </svg>
);

export const IconWallet = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 7h15a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a1 1 0 0 1-1-1z" />
    <path d="M3 7V6a2 2 0 0 1 2-2h11M16 13h2" />
  </svg>
);

export const IconRecycle = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M7 8 5 12l2 1M12 5l2.2 3.7-3 .8M17 16l-2-3.5 3-.9" />
    <path d="M4.5 13a7 7 0 0 0 6.5 6M13.5 4a7 7 0 0 1 6 4M19 15a7 7 0 0 1-6 5" />
  </svg>
);

export const IconBell = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" />
    <path d="M10 20a2 2 0 0 0 4 0" />
  </svg>
);

export const IconBolt = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M13 3 4 14h6l-1 7 9-11h-6z" />
  </svg>
);

export const IconGear = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
  </svg>
);

export const IconPlus = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
