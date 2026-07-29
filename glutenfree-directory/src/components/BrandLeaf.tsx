export default function BrandLeaf({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path
        d="M50 6C27 14 14 34 12 58c-2 22 14 36 38 36s40-14 38-36C86 34 73 14 50 6Z"
        fill="#1a9c5c"
        stroke="#0a0a0a"
        strokeWidth="4.5"
        strokeLinejoin="round"
      />
      <path d="M50 20c3 22-9 39-28 49" fill="none" stroke="#0a0a0a" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
