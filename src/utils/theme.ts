import { MetricKey } from '../types/company'

/**
 * Sapio Design System
 * Centralized theme tokens for consistent styling across the application
 */

// Muted, sophisticated color palettes for metric tiles
export const metricColorPalettes: Record<
  MetricKey,
  {
    bg: string
    iconBg: string
    iconText: string
    accent: string
  }
> = {
  marketCap: {
    bg: 'bg-gradient-to-br from-slate-50 to-blue-50/30',
    iconBg: 'bg-slate-500/15',
    iconText: 'text-slate-600',
    accent: 'text-slate-800',
  },
  revenue: {
    bg: 'bg-gradient-to-br from-emerald-50/60 to-teal-50/40',
    iconBg: 'bg-emerald-500/15',
    iconText: 'text-emerald-600',
    accent: 'text-emerald-800',
  },
  salesGrowth: {
    bg: 'bg-gradient-to-br from-purple-50/50 to-violet-50/30',
    iconBg: 'bg-purple-500/15',
    iconText: 'text-purple-600',
    accent: 'text-purple-800',
  },
  netIncome: {
    bg: 'bg-gradient-to-br from-green-50/60 to-emerald-50/40',
    iconBg: 'bg-green-500/15',
    iconText: 'text-green-600',
    accent: 'text-green-800',
  },
  profitMargin: {
    bg: 'bg-gradient-to-br from-cyan-50/50 to-sky-50/30',
    iconBg: 'bg-cyan-500/15',
    iconText: 'text-cyan-600',
    accent: 'text-cyan-800',
  },
  totalDebt: {
    bg: 'bg-gradient-to-br from-orange-50/60 to-amber-50/40',
    iconBg: 'bg-orange-500/15',
    iconText: 'text-orange-600',
    accent: 'text-orange-800',
  },
  peRatio: {
    bg: 'bg-gradient-to-br from-indigo-50/60 to-blue-50/40',
    iconBg: 'bg-indigo-500/15',
    iconText: 'text-indigo-600',
    accent: 'text-indigo-800',
  },
}

// Shadow scale for premium, subtle elevation
export const shadows = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  // Hover states
  hoverSm: 'hover:shadow-md',
  hoverMd: 'hover:shadow-lg',
  hoverLg: 'hover:shadow-xl',
}

// Typography tokens for consistent text styling
export const typography = {
  // Letter spacing
  tracking: {
    tight: 'tracking-tight',
    normal: 'tracking-normal',
    wide: 'tracking-wide',
    wider: 'tracking-wider',
    widest: 'tracking-widest',
  },
  // Font weights
  weight: {
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold',
  },
  // Common text sizes
  size: {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl',
  },
}

// Border styles
export const borders = {
  subtle: 'border border-white/40',
  medium: 'border border-white/50',
  glass: 'border border-white/20',
}

// Spacing scale (common gaps and padding)
export const spacing = {
  cardPadding: 'p-6',
  cardPaddingLg: 'p-8',
  gridGap: 'gap-6',
  iconSize: {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-11 h-11',
  },
}

// Animation and transition tokens
export const transitions = {
  default: 'transition-all duration-300',
  fast: 'transition-all duration-200',
  slow: 'transition-all duration-500',
}
