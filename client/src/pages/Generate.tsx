/**
 * AdCraft AI - Generate Page
 * Design: Dark Premium Tech
 * Layout: Two-Column (Input + Preview)
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import DownloadModal from "@/components/DownloadModal";
import SaveDraftModal from "@/components/SaveDraftModal";
import ShareModal from "@/components/ShareModal";
import AISuggestModal from "@/components/AISuggestModal";
import FilterPresetsPanel from "@/components/FilterPresetsPanel";
import { useImageDownload } from "@/hooks/useImageDownload";
import { useImageFilters } from "@/hooks/useImageFilters";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/useToast";
import ImageSettingsPanel from "@/components/ImageSettingsPanel";
import {
  Wand2,
  Download,
  Copy,
  Settings2,
  Upload,
  Sparkles,
  AlertCircle,
  X,
  RefreshCw,
  Save,
  Share2,
} from "lucide-react";

interface TemplateData {
  id: number;
  title: string;
  category: string;
  tag: string;
  downloads: number;
  description?: string;
  features?: string[];
}

export default function Generate() {
  const { t } = useLanguage();
  const { success: showSuccess, info: showInfo, error: showError } = useToast();
  const [prompt, setPrompt] = useState("");
  const [headline, setHeadline] = useState("Flash Sale");
  const [subtext, setSubtext] = useState("50% OFF");
  const [cta, setCta] = useState("Shop Now");
  const [selectedSize, setSelectedSize] = useState("1080x1080");
  const [selectedResolution, setSelectedResolution] = useState("150");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateData | null>(null);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isSaveDraftModalOpen, setIsSaveDraftModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<HTMLCanvasElement[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string>();
  const [isAISuggestModalOpen, setIsAISuggestModalOpen] = useState(false);

  const { createCanvasImage } = useImageDownload();
  const { filters, updateFilter, resetFilters, getFilterStyle } = useImageFilters();

  const sizes = [
    { label: "1:1 (1080x1080)", value: "1080x1080" },
    { label: "4:5 (1080x1350)", value: "1080x1350" },
    { label: "9:16 (1080x1920)", value: "1080x1920" },
    { label: "16:9 (1920x1080)", value: "1920x1080" },
  ];

  const resolutions = [
    { label: "72 PPI (Fast)", value: "72" },
    { label: "150 PPI (Clear)", value: "150" },
    { label: "300 PPI (Premium)", value: "300" },
  ];

  // Load template or draft from sessionStorage on mount
  useEffect(() => {
    const storedTemplate = sessionStorage.getItem("selectedTemplate");
    if (storedTemplate) {
      const template: TemplateData = JSON.parse(storedTemplate);
      setSelectedTemplate(template);
      setHeadline(template.title);
      sessionStorage.removeItem("selectedTemplate");
    }
  }, []);

  // Load editing draft from sessionStorage
  useEffect(() => {
    const editingDraft = sessionStorage.getItem("editingDraft");
    if (editingDraft) {
      try {
        const draft = JSON.parse(editingDraft);
        setHeadline(draft.headline || "Flash Sale");
        setSubtext(draft.subtext || "50% OFF");
        setCta(draft.cta || "Shop Now");
        setSelectedSize(draft.size || "1080x1080");
        setPrompt(draft.prompt || "");
        showSuccess("Draft loaded successfully!");
        sessionStorage.removeItem("editingDraft");
      } catch (error) {
        console.error("Failed to load draft:", error);
      }
    }
  }, []);

  const handleGenerate = () => {
    showInfo("Generating 4 image variations...");
    setIsGenerating(true);
    
    // Simulate generating 4 variations
    setTimeout(() => {
      const [width, height] = selectedSize.split("x").map(Number);
      const images: HTMLCanvasElement[] = [];

      // Generate 4 variations with slight color variations
      for (let i = 0; i < 4; i++) {
        const canvas = createCanvasImage(width, height, headline, subtext, cta);
        images.push(canvas);
      }

      setGeneratedImages(images);
      setSelectedImageIndex(0);
      // Convert first image to data URL for sharing
      images[0].toBlob((blob) => {
        if (blob) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setImageDataUrl(reader.result as string);
          };
          reader.readAsDataURL(blob);
        }
      });
      showSuccess("4 image variations generated successfully!");
      setIsGenerating(false);
    }, 2000);
  };

  const handleClearTemplate = () => {
    setSelectedTemplate(null);
    showInfo("Template cleared");
  };

  const handleResetForm = () => {
    setHeadline("Flash Sale");
    setSubtext("50% OFF");
    setCta("Shop Now");
    setPrompt("");
    setSelectedSize("1080x1080");
    setSelectedTemplate(null);
    setGeneratedImages([]);
    showInfo("Form reset to default");
  };

  const handleDownloadImage = (index: number) => {
    setSelectedImageIndex(index);
    setIsDownloadModalOpen(true);
    showInfo("Select a format to download");
  };

  const handleCopyImage = async (index: number) => {
    try {
      const canvas = generatedImages[index];
      canvas.toBlob(async (blob) => {
        if (blob) {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob }),
          ]);
          // Show toast notification
          alert("Image copied to clipboard!");
        }
      });
    } catch (error) {
      console.error("Failed to copy image:", error);
    }
  };

  const handleRegenerateImage = (index: number) => {
    setIsGenerating(true);
    setTimeout(() => {
      const [width, height] = selectedSize.split("x").map(Number);
      const newCanvas = createCanvasImage(width, height, headline, subtext, cta);
      const newImages = [...generatedImages];
      newImages[index] = newCanvas;
      setGeneratedImages(newImages);
      setIsGenerating(false);
    }, 1500);
  };

  const handleApplySuggestion = (suggestion: any) => {
    setHeadline(suggestion.headline);
    setSubtext(suggestion.subtext);
    setCta(suggestion.cta);
    showSuccess("Ad copy updated with AI suggestion!");
  };

  const currentImage = selectedImageIndex !== null ? generatedImages[selectedImageIndex] : null;

  return (
    <div className="min-h-screen bg-transparent text-foreground">
      <Header
        title={t("generate.title")}
        subtitle={t("hero.titleHighlight")}
        showSearch={false}
        rightActions={
          <div className="flex gap-2">
            <Button 
              onClick={() => setIsAISuggestModalOpen(true)}
              variant="outline" 
              size="sm"
              className="gap-2"
            >
              <Sparkles className="w-4 h-4" />
              AI Suggest
            </Button>
            <Button 
              onClick={() => setIsSaveDraftModalOpen(true)}
              variant="outline" 
              size="sm"
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              Save Draft
            </Button>
            <Button 
              onClick={() => setIsShareModalOpen(true)}
              disabled={!currentImage}
              variant="outline" 
              size="sm"
              className="gap-2 disabled:opacity-50"
            >
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            <Button 
              onClick={() => setIsDownloadModalOpen(true)}
              disabled={!currentImage}
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 red-glow-hover disabled:opacity-50" 
              size="sm"
            >
              <Download className="w-4 h-4" />
              {t("generate.download")}
            </Button>
          </div>
        }
      />

      <div className="container py-8">
        <Breadcrumb items={[{ label: t("generate.title"), active: true }]} />

        {/* Template Info Banner */}
        {selectedTemplate && (
          <div className="mb-6 bg-primary/10 border border-primary/30 rounded-lg p-4 flex items-start justify-between">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold font-poppins mb-1">Using Template: {selectedTemplate.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedTemplate.category} • {selectedTemplate.tag}
                </p>
              </div>
            </div>
            <button
              onClick={handleClearTemplate}
              className="p-1 text-muted-foreground hover:text-foreground transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Input Panel */}
          <div className="space-y-6">
            {/* AI Prompt */}
            <div className="bg-card border border-border rounded-lg p-6">
              <label className="block text-sm font-semibold mb-3 font-poppins">
                <Sparkles className="w-4 h-4 inline mr-2 text-primary" />
                {t("generate.promptLabel")}
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t("generate.promptPlaceholder")}
                className="w-full h-24 px-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
              <p className="text-xs text-muted-foreground mt-2">
                ยิ่งอธิบายละเอียด ผลลัพธ์ยิ่งดี
              </p>
            </div>

            {/* Text Content */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h3 className="font-semibold font-poppins">{t("generate.textContent")}</h3>

              <div>
                <label className="block text-sm font-medium mb-2">{t("generate.headline")}</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder={t("generate.headlineExample")}
                  className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t("generate.subtext")}</label>
                <input
                  type="text"
                  value={subtext}
                  onChange={(e) => setSubtext(e.target.value)}
                  placeholder={t("generate.subtextExample")}
                  className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t("generate.cta")}</label>
                <input
                  type="text"
                  value={cta}
                  onChange={(e) => setCta(e.target.value)}
                  placeholder={t("generate.ctaExample")}
                  className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div className="bg-card border border-border rounded-lg p-6">
              <label className="block text-sm font-semibold mb-4 font-poppins">
                <Upload className="w-4 h-4 inline mr-2 text-primary" />
                {t("generate.uploadImage")}
              </label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Drag and drop or click to upload
                </p>
              </div>
            </div>

            {/* Image Settings */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h3 className="font-semibold font-poppins flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-primary" />
                {t("generate.settings")}
              </h3>

              <div>
                <label className="block text-sm font-medium mb-2">{t("generate.size")}</label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {sizes.map((size) => (
                    <option key={size.value} value={size.value}>
                      {size.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t("generate.resolution")}</label>
                <select
                  value={selectedResolution}
                  onChange={(e) => setSelectedResolution(e.target.value)}
                  className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {resolutions.map((res) => (
                    <option key={res.value} value={res.value}>
                      {res.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Advanced Image Filters */}
            <ImageSettingsPanel
              filters={filters}
              onFilterChange={updateFilter}
              onReset={resetFilters}
            />

            {/* Filter Presets */}
            <FilterPresetsPanel
              currentFilters={filters}
              onLoadPreset={(loadedFilters) => {
                Object.keys(loadedFilters).forEach((key) => {
                  updateFilter(key as keyof typeof filters, loadedFilters[key as keyof typeof filters]);
                });
              }}
            />

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-lg red-glow-hover disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <span className="animate-spin mr-2">⚡</span>
                  {t("generate.createImage")}...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5 mr-2" />
                  {t("generate.createImage")}
                </>
              )}
            </Button>
          </div>

          {/* Right: Preview Panel */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold font-poppins mb-4">{t("generate.preview")}</h3>

              {isGenerating ? (
                <div className="w-full aspect-square bg-gradient-to-br from-primary/20 to-secondary rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Generating image...</p>
                  </div>
                </div>
              ) : currentImage ? (
                <div className="w-full bg-secondary rounded-lg flex items-center justify-center overflow-hidden">
                  <canvas
                    ref={(el) => {
                      if (el && currentImage) {
                        const ctx = el.getContext("2d");
                        if (ctx) {
                          el.width = currentImage.width;
                          el.height = currentImage.height;
                          ctx.drawImage(currentImage, 0, 0);
                        }
                      }
                    }}
                    className="max-w-full max-h-[500px]"
                    style={getFilterStyle()}
                  />
                </div>
              ) : (
                <div className="w-full aspect-square bg-gradient-to-br from-primary/20 to-secondary rounded-lg flex items-center justify-center border border-primary/30">
                  <div className="text-center">
                    <Sparkles className="w-12 h-12 text-primary/50 mx-auto mb-2" />
                    <p className="text-muted-foreground">Preview will appear here</p>
                  </div>
                </div>
              )}
            </div>

            {/* Generated Images */}
            {generatedImages.length > 0 && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold font-poppins mb-4">Generated Variations</h3>

                <div className="grid grid-cols-2 gap-4">
                  {generatedImages.map((canvas, idx) => (
                    <div
                      key={idx}
                      className={`group relative bg-secondary rounded-lg aspect-square flex items-center justify-center border-2 transition cursor-pointer ${
                        selectedImageIndex === idx
                          ? "border-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedImageIndex(idx)}
                    >
                      <canvas
                        ref={(el) => {
                          if (el) {
                            el.width = canvas.width;
                            el.height = canvas.height;
                            const ctx = el.getContext("2d");
                            if (ctx) {
                              ctx.drawImage(canvas, 0, 0);
                            }
                          }
                        }}
                        className="w-full h-full rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 rounded-lg">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadImage(idx);
                          }}
                          className="p-2 bg-primary hover:bg-primary/90 rounded-lg transition"
                          title="Download"
                        >
                          <Download className="w-4 h-4 text-white" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyImage(idx);
                          }}
                          className="p-2 bg-secondary hover:bg-secondary/80 border border-border rounded-lg transition"
                          title="Copy to clipboard"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRegenerateImage(idx);
                          }}
                          className="p-2 bg-secondary hover:bg-secondary/80 border border-border rounded-lg transition"
                          title="Regenerate"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Tools */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold font-poppins mb-4">{t("generate.aiTools")}</h3>

              <div className="space-y-2">
                {[
                  t("generate.backgroundRemove"),
                  t("generate.objectRemove"),
                  t("generate.aiRewriteText"),
                  t("generate.generateAdCopy"),
                ].map((tool, idx) => (
                  <button
                    key={idx}
                    className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-left text-sm hover:border-primary/50 transition flex items-center justify-between"
                  >
                    <span>{tool}</span>
                    <Wand2 className="w-4 h-4 text-primary" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Download Modal */}
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        headline={headline}
        subtext={subtext}
        cta={cta}
        selectedSize={selectedSize}
      />

      {/* Save Draft Modal */}
      <SaveDraftModal
        isOpen={isSaveDraftModalOpen}
        onClose={() => setIsSaveDraftModalOpen(false)}
        headline={headline}
        subtext={subtext}
        cta={cta}
        size={selectedSize}
        resolution={selectedResolution}
        prompt={prompt}
        templateId={selectedTemplate?.id}
        imageData={imageDataUrl}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        headline={headline}
        subtext={subtext}
        cta={cta}
        size={selectedSize}
        imageData={imageDataUrl}
      />

      {/* AI Suggest Modal */}
      <AISuggestModal
        open={isAISuggestModalOpen}
        onOpenChange={setIsAISuggestModalOpen}
        onApply={handleApplySuggestion}
        category={selectedTemplate?.category || "product"}
        currentHeadline={headline}
        currentSubtext={subtext}
        currentCta={cta}
      />
    </div>
  );
}
