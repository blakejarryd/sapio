interface IconProps {
  className?: string
}

export default function SalesGrowthIcon({ className = '' }: IconProps) {
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
      {/* Growth chart with arrow */}
      <polyline points="3 17 9 11 13 15 21 7" />
      <polyline points="16 7 21 7 21 12" />
    </svg>
  )
}
