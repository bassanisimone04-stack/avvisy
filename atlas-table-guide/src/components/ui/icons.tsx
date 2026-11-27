import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };
const base = ({ size = 20, ...p }: P) => ({ width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true, focusable: false, ...p });

export const SearchIcon = (p: P) => <svg {...base(p)}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>;
export const HeartIcon = ({ filled, ...p }: P & { filled?: boolean }) => <svg {...base(p)} fill={filled ? "currentColor" : "none"}><path d="M12 20s-7-4.4-9.3-9C1.2 7.8 3.3 4.5 6.6 4.5c2 0 3.3 1.1 4.1 2.3h2.6c.8-1.2 2.1-2.3 4.1-2.3 3.3 0 5.4 3.3 3.9 6.5C19 15.6 12 20 12 20Z" /></svg>;
export const UserIcon = (p: P) => <svg {...base(p)}><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></svg>;
export const MenuIcon = (p: P) => <svg {...base(p)}><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
export const CloseIcon = (p: P) => <svg {...base(p)}><path d="M6 6l12 12M18 6 6 18" /></svg>;
export const ChevronDown = (p: P) => <svg {...base(p)}><path d="m6 9 6 6 6-6" /></svg>;
export const ChevronRight = (p: P) => <svg {...base(p)}><path d="m9 6 6 6-6 6" /></svg>;
export const ChevronLeft = (p: P) => <svg {...base(p)}><path d="m15 6-6 6 6 6" /></svg>;
export const GridIcon = (p: P) => <svg {...base(p)}><rect x="4" y="4" width="7" height="7" rx="1" /><rect x="13" y="4" width="7" height="7" rx="1" /><rect x="4" y="13" width="7" height="7" rx="1" /><rect x="13" y="13" width="7" height="7" rx="1" /></svg>;
export const MapIcon = (p: P) => <svg {...base(p)}><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z" /><path d="M9 4v14M15 6v14" /></svg>;
export const FilterIcon = (p: P) => <svg {...base(p)}><path d="M4 6h16M7 12h10M10 18h4" /></svg>;
export const CheckIcon = (p: P) => <svg {...base(p)}><path d="m5 12 5 5 9-10" /></svg>;
export const ShareIcon = (p: P) => <svg {...base(p)}><circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4" /></svg>;
export const ExternalIcon = (p: P) => <svg {...base(p)}><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></svg>;
export const PinIcon = (p: P) => <svg {...base(p)}><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>;
export const ClockIcon = (p: P) => <svg {...base(p)}><circle cx="12" cy="12" r="8" /><path d="M12 8v4l3 2" /></svg>;
export const InfoIcon = (p: P) => <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></svg>;
export const AlertIcon = (p: P) => <svg {...base(p)}><path d="M12 3 2 20h20L12 3Z" /><path d="M12 10v4M12 17h.01" /></svg>;
export const CompassIcon = (p: P) => <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" /></svg>;
export const GlobeIcon = (p: P) => <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.7 3.5 5.7 3.5 9s-1 6.3-3.5 9c-2.5-2.7-3.5-5.7-3.5-9s1-6.3 3.5-9Z" /></svg>;
export const DownloadIcon = (p: P) => <svg {...base(p)}><path d="M12 4v11M7 10l5 5 5-5M5 20h14" /></svg>;
export const LocateIcon = (p: P) => <svg {...base(p)}><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /><circle cx="12" cy="12" r="7" /></svg>;
