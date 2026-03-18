import { Button } from "@/components/ui/button";
import { TemplateData } from "@/components/TemplateModal";
import NeonCard from "@/components/NeonCard";

interface TemplateCardProps {
  template: TemplateData;
  onViewDetails: (template: TemplateData) => void;
  onUseTemplate: (template: TemplateData) => void;
}

export default function TemplateCard({
  template,
  onViewDetails,
  onUseTemplate,
}: TemplateCardProps) {
  return (
    <NeonCard className="h-full [transform-style:preserve-3d]">
      <div className="relative aspect-[4/3] overflow-hidden border-b border-white/10">
        <img
          src={template.preview}
          alt={template.title}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />

        <div className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/90">
          {template.tag}
        </div>

        <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/55 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Button
            size="sm"
            variant="outline"
            className="border-white/30 bg-black/30 text-white hover:bg-black/50"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(template);
            }}
          >
            View Details
          </Button>
          <Button
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={(e) => {
              e.stopPropagation();
              onUseTemplate(template);
            }}
          >
            Use Now
          </Button>
        </div>
      </div>

      <div className="space-y-3 p-5 md:p-6">
        <h3 className="bg-gradient-to-r from-white via-[#ff8b8b] to-[#ff2d8f] bg-clip-text text-lg font-bold tracking-[0.02em] text-transparent transition-all duration-300 group-hover:drop-shadow-[0_0_10px_rgba(255,45,45,0.45)]">
          {template.title}
        </h3>
        <p className="line-clamp-2 text-sm text-white/70">{template.description}</p>
        <div className="flex items-center justify-between text-xs text-white/65">
          <span className="capitalize tracking-[0.04em]">{template.category}</span>
          <span>{template.downloads.toLocaleString()} downloads</span>
        </div>
      </div>
    </NeonCard>
  );
}
