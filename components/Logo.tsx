interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function Logo({ size = 'md', className = '' }: LogoProps) {
  const iconSizes = {
    sm: { width: 24, height: 24 },
    md: { width: 32, height: 32 },
    lg: { width: 40, height: 40 },
  }

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Infinity icon */}
      <img
        src="/logo_transparent.svg"
        alt="Infinity"
        width={iconSizes[size].width}
        height={iconSizes[size].height}
        className="object-contain"
      />

      {/* Note text */}
      <span className={`font-bold text-slate-100 ${textSizes[size]}`}>Note</span>
    </div>
  )
}
