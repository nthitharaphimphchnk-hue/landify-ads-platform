/**
 * AdCraft AI - Template Modal Component
 * Design: Dark Premium Tech
 * Shows template details and allows navigation to Generate page
 */

import { Button } from "@/components/ui/button";
import { X, Sparkles, Download, Eye } from "lucide-react";

export interface TemplateData {
  id: number;
  title: string;
  category: string;
  tag: string;
  downloads: number;
  description?: string;
  features?: string[];
  preview?: string;
}

interface TemplateModalProps {
  template: TemplateData | null;
  isOpen: boolean;
  onClose: () => void;
  onUseTemplate: (template: TemplateData) => void;
}

export default function TemplateModal({
  template,
  isOpen,
  onClose,
  onUseTemplate,
}: TemplateModalProps) {
  if (!isOpen || !template) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-card border-b border-border flex items-center justify-between p-6">
            <h2 className="text-2xl font-bold font-poppins">{template.title}</h2>
            <button
              onClick={onClose}
              className="p-2 text-muted-foreground hover:text-foreground transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Preview Image */}
            <div className="relative w-full aspect-video overflow-hidden rounded-lg border border-primary/30 bg-gradient-to-br from-primary/20 to-secondary">
              {template.preview ? (
                <>
                  <img
                    src={template.preview}
                    alt={template.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                </>
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Sparkles className="w-16 h-16 text-primary/50" />
                </div>
              )}
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-secondary rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">Category</p>
                <p className="font-semibold capitalize">{template.category}</p>
              </div>
              <div className="bg-secondary rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">Status</p>
                <p className="font-semibold text-primary">{template.tag}</p>
              </div>
              <div className="bg-secondary rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">Downloads</p>
                <p className="font-semibold">{template.downloads.toLocaleString()}</p>
              </div>
              <div className="bg-secondary rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">Rating</p>
                <p className="font-semibold">⭐ 4.8/5</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold font-poppins mb-2">Description</h3>
              <p className="text-muted-foreground">
                {template.description ||
                  `This is a professional ${template.category} template designed to help you create stunning ads that convert. Perfect for ${
                    template.category === "promotion"
                      ? "sales and promotions"
                      : template.category === "product"
                      ? "product showcases"
                      : "affiliate marketing"
                  }.`}
              </p>
            </div>

            {/* Features */}
            <div>
              <h3 className="font-semibold font-poppins mb-3">Key Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(template.features || [
                  "Fully customizable text",
                  "High-quality design",
                  "Multiple color schemes",
                  "Mobile optimized",
                  "Ready to use",
                  "Professional layouts",
                ]).map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Size Info */}
            <div className="bg-secondary rounded-lg p-4">
              <h3 className="font-semibold font-poppins mb-2">Available Sizes</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div>1080x1080 (1:1)</div>
                <div>1080x1350 (4:5)</div>
                <div>1080x1920 (9:16)</div>
                <div>1920x1080 (16:9)</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-card border-t border-border p-6 flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button
              onClick={() => onUseTemplate(template)}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold red-glow-hover"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Use This Template
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
