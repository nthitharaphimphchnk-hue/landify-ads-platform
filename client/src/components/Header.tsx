/**
 * AdCraft AI - Header Component
 * Design: Dark Premium Tech
 * Used in: Dashboard, Generate, Templates
 */

import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Bell, Mail, Menu, X, Home, Wand2, LayoutTemplate, ImageIcon } from "lucide-react";
import { useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
  rightActions?: React.ReactNode;
}

export default function Header({
  title = "Dashboard",
  subtitle = "",
  showSearch = true,
  rightActions,
}: HeaderProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  const navItems = [
    { path: "/", label: t("nav.home"), icon: Home },
    { path: "/dashboard", label: t("nav.dashboard"), icon: ImageIcon },
    { path: "/generate", label: t("nav.generate"), icon: Wand2 },
    { path: "/templates", label: t("nav.templates"), icon: LayoutTemplate },
  ];

  const isActive = (path: string) => location === path;

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/25 backdrop-blur-md">
        <div className="container py-4 flex items-center justify-between">
          {/* Left: Logo + Title */}
          <a href="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-transparent">
              <img
                src="/brand/landify-logo.png"
                alt="Landify logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-lg font-poppins neon-text text-3d interactive-text">{title}</h1>
              {subtitle && <p className="subtext text-xs text-muted-foreground">{subtitle}</p>}
            </div>
          </a>

          {/* Center: Search (Desktop) */}
          {showSearch && (
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder={t("nav.search")}
                  className="w-full rounded-xl border border-white/10 bg-white/8 px-4 py-2 text-sm text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_18px_rgba(0,0,0,0.22)] backdrop-blur-md placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          )}

          {/* Right: Actions */}
          <div className="flex items-center gap-4">
            {rightActions}

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Notifications */}
            <button className="icon-3d-button relative hidden p-2 text-muted-foreground hover:text-foreground md:block">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
            </button>

            {/* Messages */}
            <button className="icon-3d-button hidden p-2 text-muted-foreground hover:text-foreground md:block">
              <Mail className="w-5 h-5" />
            </button>

            {/* User Avatar */}
            <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm hidden md:flex">
              A
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="icon-3d-button p-2 text-muted-foreground hover:text-foreground md:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-black/55 backdrop-blur-md">
            <nav className="container py-4 space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.path}
                  href={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`nav-3d flex items-center gap-3 px-4 py-3 transition ${
                    isActive(item.path)
                      ? "nav-3d-active text-primary-foreground"
                      : "text-foreground"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </a>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Desktop Navigation Bar */}
      <nav className="sticky top-16 z-30 hidden border-b border-white/10 bg-black/20 backdrop-blur-md md:block">
        <div className="container flex gap-2 py-3">
          {navItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              className={`nav-3d flex items-center gap-2 px-4 py-2 transition ${
                isActive(item.path)
                  ? "nav-3d-active text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{item.label}</span>
            </a>
          ))}
        </div>
      </nav>
    </>
  );
}
