import { cn } from "@/lib/utils"

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'pink' | 'blue' | 'purple' | 'yellow' | 'green' | 'black';
  className?: string;
}

export function Badge({ children, variant = 'purple', className }: BadgeProps) {
  const variants = {
    pink: "bg-pastel-pink text-black",
    blue: "bg-pastel-blue text-black",
    purple: "bg-pastel-purple text-black",
    yellow: "bg-pastel-yellow text-black",
    green: "bg-pastel-green text-black",
    black: "bg-black text-white",
  }

  return (
    <span className={cn(
      "px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider",
      variants[variant],
      className
    )}>
      {children}
    </span>
  )
}
