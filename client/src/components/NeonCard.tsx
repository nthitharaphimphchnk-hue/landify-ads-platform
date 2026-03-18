import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface NeonCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function NeonCard({ children, className, onClick }: NeonCardProps) {
  return (
    <article
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-[14px]",
        "transform-gpu [transform:translateY(0)_scale(1)] [transform-style:preserve-3d]",
        "shadow-[0_0_20px_rgba(255,45,45,0.25),0_0_60px_rgba(255,45,45,0.15)]",
        "transition-all duration-500 ease-out",
        "hover:border-[#ff2d2d]/60 hover:shadow-[0_0_30px_rgba(255,45,45,0.4),0_0_70px_rgba(255,45,45,0.2)]",
        "hover:[transform:translateY(-10px)_scale(1.03)_rotateX(4deg)]",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-60">
        <div className="absolute inset-0 rounded-[inherit] bg-[linear-gradient(120deg,rgba(255,45,45,0.25),transparent_30%,rgba(168,85,247,0.18)_65%,transparent)]" />
      </div>
      <div className="pointer-events-none absolute inset-[1px] rounded-[calc(1rem-1px)] border border-white/6" />
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute inset-0 bg-gradient-to-br from-[#ff2d2d]/10 via-transparent to-[#a855f7]/10" />
        <div className="neon-sweep absolute inset-0" />
      </div>
      {children}
    </article>
  );
}
