interface SparklineProps {
  data: { year: number; value: number }[]
  color?: string
  width?: number
  height?: number
}

export default function Sparkline({
  data,
  color = '#64748b',
  width = 80,
  height = 24
}: SparklineProps) {
  if (!data || data.length < 2) return null

  // Sort by year to ensure correct order
  const sortedData = [...data].sort((a, b) => a.year - b.year)

  const values = sortedData.map(d => d.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min

  // Avoid division by zero for flat lines
  const normalizedValues = range === 0
    ? values.map(() => 0.5)
    : values.map(v => (v - min) / range)

  // Create SVG path
  const padding = 2
  const effectiveWidth = width - padding * 2
  const effectiveHeight = height - padding * 2
  const stepX = effectiveWidth / (sortedData.length - 1)

  const pathData = normalizedValues
    .map((value, index) => {
      const x = padding + index * stepX
      const y = padding + effectiveHeight - value * effectiveHeight
      return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
    })
    .join(' ')

  return (
    <svg
      width={width}
      height={height}
      className="inline-block"
      viewBox={`0 0 ${width} ${height}`}
    >
      {/* Gradient fill under the line */}
      <defs>
        <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>

      {/* Fill area under line */}
      <path
        d={`${pathData} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`}
        fill={`url(#gradient-${color})`}
      />

      {/* Line */}
      <path
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
