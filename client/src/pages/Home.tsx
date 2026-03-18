import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Sparkles, Zap, Download, Grid3x3, Share2 } from "lucide-react";
import Header from "@/components/Header";
import NeonCard from "@/components/NeonCard";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  const featureCards = [
    {
      title: t("features.feature1.title"),
      description: t("features.feature1.desc"),
      image: "/template-media/template-12.png",
      icon: Sparkles,
      label: "AI Visuals",
    },
    {
      title: t("features.feature2.title"),
      description: t("features.feature2.desc"),
      image: "/template-media/template-13.png",
      icon: Grid3x3,
      label: "Template Hub",
    },
    {
      title: t("features.feature3.title"),
      description: t("features.feature3.desc"),
      image: "/template-media/template-14.png",
      icon: Download,
      label: "Fast Export",
    },
    {
      title: t("features.feature4.title"),
      description: t("features.feature4.desc"),
      image: "/template-media/template-15.png",
      icon: Zap,
      label: "Live Preview",
    },
    {
      title: t("features.feature5.title"),
      description: t("features.feature5.desc"),
      image: "/template-media/template-01.png",
      icon: Share2,
      label: "Social Ready",
    },
    {
      title: t("features.feature6.title"),
      description: t("features.feature6.desc"),
      image: "/template-media/template-02.png",
      icon: Sparkles,
      label: "One Click",
    },
  ];

  return (
    <div className="min-h-screen bg-transparent text-foreground">
      <Header title="AdCraft AI" subtitle={t("hero.titleHighlight")} />

      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center px-4 md:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,45,45,0.24)_0%,rgba(0,0,0,0.2)_35%,rgba(0,0,0,0.02)_75%)]" />

        <div className="hero-fade-in relative z-10 mx-auto max-w-4xl space-y-8 text-center">
          <h1 className="text-5xl font-bold font-poppins leading-tight text-3d md:text-7xl">
            {t("hero.title")}
            <span className="gold-neon-text interactive-text"> {t("hero.titleHighlight")}</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-white/85 md:text-xl">
            {t("hero.description")}
          </p>

          <div className="flex justify-center">
            <Link href="/generate">
              <Button className="bg-primary px-10 py-6 text-lg font-semibold text-primary-foreground red-glow-hover group hover:bg-primary/90">
                {t("hero.ctaStart")}
                <ArrowRight className="ml-2 transition group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 md:px-8 bg-black/20 backdrop-blur-sm border-y border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-poppins mb-4">
              {t("features.title")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("features.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3 [perspective:1200px]">
            {featureCards.map((feature) => {
              const Icon = feature.icon;

              return (
                <NeonCard key={feature.title} className="h-full">
                  <div className="relative aspect-[16/10] overflow-hidden border-b border-white/10">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary/18 px-3 py-1.5 shadow-[0_0_14px_rgba(255,45,45,0.35)] backdrop-blur-xl">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-primary/25 bg-primary/20 shadow-[0_0_16px_rgba(255,45,45,0.35)]">
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-orbitron text-[10px] tracking-[0.18em] text-white/80">
                        {feature.label}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 p-6">
                    <h3 className="text-xl font-semibold font-poppins text-white drop-shadow-[0_0_10px_rgba(255,0,0,0.4)]">
                      {feature.title}
                    </h3>
                    <p className="text-sm leading-7 text-white/70">
                      {feature.description}
                    </p>
                  </div>
                </NeonCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-poppins mb-4">
              {t("howItWorks.title")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("howItWorks.subtitle")}
            </p>
          </div>

          <div className="relative">
            <img
              src="/brand/howto-youtube.png"
              alt="How it works video"
              className="w-full h-auto rounded-xl border border-border"
            />
          </div>
        </div>
      </section>

      {/* Templates Showcase */}
      <section className="py-20 px-4 md:px-8 bg-black/18 backdrop-blur-sm border-y border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-poppins mb-4">
              {t("templates.title")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("templates.subtitle")}
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-[0_0_20px_rgba(255,45,45,0.3),0_0_40px_rgba(255,45,45,0.2)] backdrop-blur-xl transition-all duration-500 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(255,45,45,0.45),0_0_60px_rgba(168,85,247,0.25)]">
            <img
              src="/template-media/template-11.png"
              alt="Templates showcase"
              className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
          </div>

          <div className="text-center mt-12">
            <Link href="/templates">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-8 py-6 red-glow-hover group">
                {t("templates.viewAll")}
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 rounded-xl p-12 text-center">
            <h2 className="text-4xl md:text-5xl font-bold font-poppins mb-6">
              {t("cta.title")}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t("cta.description")}
            </p>
            <Link href="/generate">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-10 py-6 red-glow-hover group">
                {t("cta.button")}
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-4 md:px-8 bg-black/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold font-poppins mb-4">{t("footer.brand")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("footer.tagline")}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t("footer.product")}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/generate" className="hover:text-primary transition">
                    {t("nav.generate")}
                  </Link>
                </li>
                <li>
                  <Link href="/templates" className="hover:text-primary transition">
                    {t("nav.templates")}
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-primary transition">
                    {t("nav.dashboard")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t("footer.company")}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition">
                    {t("footer.about")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    {t("footer.contact")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    {t("footer.blog")}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t("footer.legal")}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition">
                    {t("footer.privacy")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    {t("footer.terms")}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {t("footer.copyright")}
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-primary transition">
                {t("footer.social")}
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition">
                Instagram
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition">
                Twitter
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
