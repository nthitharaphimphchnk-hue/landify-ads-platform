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
    <nav className="flex items-center gap-2 text-sm mb-6">
      <a
        href="/"
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition"
      >
        <Home className="w-4 h-4" />
        <span>Home</span>
      </a>

      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          {item.href ? (
            <a
              href={item.href}
              className="text-muted-foreground hover:text-foreground transition"
            >
              {item.label}
            </a>
          ) : (
            <span className={item.active ? "text-foreground font-medium" : "text-muted-foreground"}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
