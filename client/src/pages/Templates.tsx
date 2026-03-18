/**
 * AdCraft AI - Templates Page
 * Design: Dark Premium Tech
 * Layout: Grid with Filters + Modal
 */

import { useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import TemplateModal, { TemplateData } from "@/components/TemplateModal";
import TemplateCard from "@/components/TemplateCard";
import { Search, Sparkles } from "lucide-react";

export default function Templates() {
  const [, setLocation] = useLocation();
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filters = [
    { id: "all", label: "All Templates" },
    { id: "promotion", label: "Promotion" },
    { id: "product", label: "Product" },
    { id: "affiliate", label: "Affiliate" },
    { id: "trending", label: "Trending" },
  ];

  const templates: TemplateData[] = [
    {
      id: 1,
      title: "Flash Sale",
      category: "promotion",
      tag: "Trending",
      downloads: 1234,
      preview: "/template-media/template-01.png",
      description: "Eye-catching flash sale template perfect for limited-time offers and urgency-driven campaigns.",
      features: [
        "Bold typography",
        "Countdown timer ready",
        "High contrast colors",
        "Mobile responsive",
      ],
    },
    {
      id: 2,
      title: "Limited Offer",
      category: "promotion",
      tag: "Popular",
      downloads: 892,
      preview: "/template-media/template-02.png",
      description: "Professional limited offer template designed to maximize conversions with clear CTAs.",
      features: [
        "Clean layout",
        "Multiple color variants",
        "Text customizable",
        "Social media ready",
      ],
    },
    {
      id: 3,
      title: "Product Showcase",
      category: "product",
      tag: "New",
      downloads: 456,
      preview: "/template-media/template-03.png",
      description: "Elegant product showcase template ideal for highlighting your best products.",
      features: [
        "Product-focused design",
        "Image placeholder",
        "Feature highlights",
        "Professional layout",
      ],
    },
    {
      id: 4,
      title: "Mega Sale",
      category: "promotion",
      tag: "Trending",
      downloads: 2145,
      preview: "/template-media/template-04.png",
      description: "Bold mega sale template with impactful visuals for big promotional campaigns.",
      features: [
        "Large discount display",
        "Dynamic colors",
        "Eye-catching design",
        "Quick to customize",
      ],
    },
    {
      id: 5,
      title: "Earn Commission",
      category: "affiliate",
      tag: "Popular",
      downloads: 678,
      preview: "/template-media/template-05.png",
      description: "Affiliate marketing template designed to recruit partners and showcase earning potential.",
      features: [
        "Commission display",
        "Call to action",
        "Trust elements",
        "Professional design",
      ],
    },
    {
      id: 6,
      title: "New Arrivals",
      category: "product",
      tag: "New",
      downloads: 345,
      preview: "/template-media/template-06.png",
      description: "Fresh new arrivals template perfect for showcasing your latest products.",
      features: [
        "Modern design",
        "Multiple products",
        "Easy to update",
        "Conversion optimized",
      ],
    },
    {
      id: 7,
      title: "Summer Collection",
      category: "product",
      tag: "Trending",
      downloads: 1567,
      preview: "/template-media/template-07.png",
      description: "Seasonal collection template with vibrant colors and summer vibes.",
      features: [
        "Seasonal colors",
        "Collection layout",
        "Product grid",
        "Social shareable",
      ],
    },
    {
      id: 8,
      title: "Affiliate Promo",
      category: "affiliate",
      tag: "New",
      downloads: 234,
      preview: "/template-media/template-08.png",
      description: "Promotional template for affiliate programs with clear benefits and CTAs.",
      features: [
        "Benefits highlight",
        "CTA focused",
        "Professional look",
        "Easy customization",
      ],
    },
    {
      id: 9,
      title: "Black Friday",
      category: "promotion",
      tag: "Popular",
      downloads: 3456,
      preview: "/template-media/template-09.png",
      description: "Premium Black Friday template with bold design perfect for major sales events.",
      features: [
        "Bold typography",
        "High impact visuals",
        "Multiple variants",
        "Event-ready",
      ],
    },
  ];

  const filteredTemplates = templates.filter((template) => {
    const matchesFilter =
      selectedFilter === "all" ||
      template.category === selectedFilter ||
      (selectedFilter === "trending" && template.tag.toLowerCase() === "trending");
    const matchesSearch = template.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleTemplateClick = (template: TemplateData) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const handleUseTemplate = (template: TemplateData) => {
    // Store template data in sessionStorage or URL params
    sessionStorage.setItem("selectedTemplate", JSON.stringify(template));
    setIsModalOpen(false);
    // Navigate to generate page
    setLocation("/generate");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-transparent text-foreground">
      <div className="tech-bg pointer-events-none absolute inset-0" />
      <div className="particle-overlay pointer-events-none absolute inset-0 opacity-40" />

      <Header title="Templates" subtitle="Browse and use templates" showSearch={false} />

      <div className="container relative z-10 py-8">
        <Breadcrumb items={[{ label: "Templates", active: true }]} />

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-10 pr-4 text-foreground backdrop-blur-xl placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-10 flex gap-3 overflow-x-auto px-1 py-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm tracking-[0.04em] transition ${
                selectedFilter === filter.id
                  ? "border-primary/70 bg-primary/20 text-white shadow-[0_0_18px_rgba(255,45,45,0.35)]"
                  : "border-white/10 bg-white/[0.03] text-foreground hover:border-primary/40 hover:text-white"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 [perspective:1200px]">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="h-full"
              onClick={() => handleTemplateClick(template)}
            >
              <TemplateCard
                template={template}
                onViewDetails={handleTemplateClick}
                onUseTemplate={handleUseTemplate}
              />
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <Sparkles className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">No templates found</p>
          </div>
        )}
      </div>

      {/* Template Modal */}
      <TemplateModal
        template={selectedTemplate}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUseTemplate={handleUseTemplate}
      />
    </div>
  );
}
