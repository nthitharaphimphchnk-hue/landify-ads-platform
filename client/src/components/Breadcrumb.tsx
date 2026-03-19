/**
 * AdCraft AI - Breadcrumb Component
 * Design: Dark Premium Tech
 */

import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="glass-panel mb-6 inline-flex items-center gap-2 px-4 py-3 text-sm">
      <a
        href="/"
        className="tool-row flex items-center gap-2 rounded-full px-3 py-2 text-muted-foreground hover:text-foreground"
      >
        <Home className="w-4 h-4" />
        <span>Home</span>
      </a>

      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <ChevronRight className="h-4 w-4 text-primary/70" />
          {item.href ? (
            <a
              href={item.href}
              className="tool-row rounded-full px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              {item.label}
            </a>
          ) : (
            <span
              className={
                item.active
                  ? "rounded-full border border-primary/30 bg-primary/15 px-3 py-2 font-medium text-foreground shadow-[0_0_16px_rgba(255,45,45,0.18)]"
                  : "text-muted-foreground"
              }
            >
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
