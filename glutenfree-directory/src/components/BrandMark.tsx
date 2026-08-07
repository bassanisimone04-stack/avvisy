// Marchio: pin da mappa che si apre in un piatto visto dall'alto, con un
// piccolo cuore al centro — geolocalizzazione + cibo + sicurezza in un segno.
export default function BrandMark({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path
        d="M50 6C29 6 13 22.6 13 43c0 29 37 51 37 51s37-22 37-51C87 22.6 71 6 50 6Z"
        fill="#1b4332"
      />
      <circle cx="50" cy="42" r="24" fill="#fafaf7" />
      <circle cx="50" cy="42" r="24" fill="none" stroke="#1b4332" strokeWidth="2" />
      <path
        d="M50 51c-8.5-6.2-14.5-11-14.5-17.4a8 8 0 0 1 14.5-4.6 8 8 0 0 1 14.5 4.6C64.5 40 58.5 44.8 50 51Z"
        fill="#c2431f"
      />
    </svg>
  );
}
