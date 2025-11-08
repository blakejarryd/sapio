interface IconProps {
  className?: string
}

export default function RevenueIcon({ className = '' }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Dollar sign with circular border */}
      <circle cx="12" cy="12" r="9" />
      <path d="M12 6v12M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 2s2.5 0.5 2.5 2a2.5 2.5 0 0 1-5 0" />
    </svg>
  )
}
