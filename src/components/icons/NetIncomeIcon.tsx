interface IconProps {
  className?: string
}

export default function NetIncomeIcon({ className = '' }: IconProps) {
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
      {/* Shield with checkmark */}
      <path d="M12 2L4 6v6c0 5 3 9 8 11 5-2 8-6 8-11V6l-8-4z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  )
}
