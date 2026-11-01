export function Mark({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden>
      <path d="M32 5 53 12.5V30c0 14-9 23.5-21 28.5C20 53.5 11 44 11 30V12.5Z" fill="#15213a" />
      <path d="M23 17h18v24l-3 2.2-3-2.2-3 2.2-3-2.2-3 2.2-3-2.2Z" fill="#f5f0e6" />
      <path d="M27 23h10M27 28h10M27 33h6" stroke="#15213a" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="44" cy="44" r="9" fill="#e4572e" stroke="#f5f0e6" strokeWidth="2.5" />
      <path d="M44 39.5V44l3 2" stroke="#f5f0e6" strokeWidth="2.4" strokeLinecap="round" fill="none" />
    </svg>
  );
}
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Mark size={30} />
      <span className="font-serif text-[1.32rem] tracking-tight leading-none">Warranty<span className="text-verm italic">Vault</span></span>
    </span>
  );
}
