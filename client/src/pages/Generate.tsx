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
  Upload,
  Sparkles,
  AlertCircle,
  X,
  RefreshCw,
  Save,
  Share2,
  Type,
  Shapes,
  LayoutTemplate,
  ZoomIn,
  ZoomOut,
  Move,
  Maximize2,
  Minimize2,
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
  const [activeTool, setActiveTool] = useState("ai-generate");
  const [zoom, setZoom] = useState(100);
  const [isFullscreenCanvas, setIsFullscreenCanvas] = useState(false);

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

  const updateZoom = (nextZoom: number) => {
    setZoom(Math.max(50, Math.min(150, nextZoom)));
  };

  const handleCanvasWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -5 : 5;
    updateZoom(zoom + delta);
  };

  const currentImage = selectedImageIndex !== null ? generatedImages[selectedImageIndex] : null;
  const toolSections = [
    { id: "templates", label: "Templates", icon: LayoutTemplate },
    { id: "text", label: "Text", icon: Type },
    { id: "uploads", label: "Uploads", icon: Upload },
    { id: "elements", label: "Elements", icon: Shapes },
    { id: "ai-generate", label: "AI Generate", icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-transparent text-foreground">
      <Header
        title={t("generate.title")}
        subtitle={t("hero.titleHighlight")}
        showSearch={false}
        rightActions={
          <div className="flex gap-2">
            <Button
              onClick={() => setIsSaveDraftModalOpen(true)}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              Save
            </Button>
            <Button
              onClick={() => setIsShareModalOpen(true)}
              disabled={!currentImage}
              variant="outline"
              size="sm"
              className="gap-2 disabled:opacity-50"
            >
              <Share2 className="w-4 h-4" />
              Export
            </Button>
            <Button
              onClick={() => setIsDownloadModalOpen(true)}
              disabled={!currentImage}
              size="sm"
              className="gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
          </div>
        }
      />

      <div className="w-full max-w-none px-3 py-4 md:px-4 lg:px-5">
        <Breadcrumb items={[{ label: t("generate.title"), active: true }]} />

        <div className="mb-4 flex gap-2 overflow-x-auto lg:hidden">
          {toolSections.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`editor-chip flex items-center gap-2 whitespace-nowrap px-4 py-2 text-xs transition ${
                activeTool === tool.id ? "border-primary/35 bg-primary/20 text-white shadow-[0_0_14px_rgba(255,45,45,0.2)]" : ""
              }`}
            >
              <tool.icon className="h-4 w-4" />
              {tool.label}
            </button>
          ))}
        </div>

        <div
          className={`grid grid-cols-1 gap-3 lg:h-[calc(100vh-170px)] ${
            isFullscreenCanvas
              ? "lg:grid-cols-[minmax(0,1.5fr)]"
              : "lg:grid-cols-[180px_minmax(0,2.35fr)_220px]"
          }`}
        >
          {/* Left Sidebar */}
          <aside
            className={`glass-panel hidden p-4 lg:flex lg:flex-col ${
              isFullscreenCanvas ? "lg:hidden" : ""
            }`}
          >
            <h3 className="panel-headline mb-4 text-sm font-semibold uppercase tracking-[0.18em]">Tools</h3>
            <div className="space-y-2">
              {toolSections.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className={`tool-row flex w-full items-center gap-3 px-4 py-3 text-left text-sm ${
                    activeTool === tool.id ? "border-primary/35 bg-primary/20 text-white" : "text-white/80"
                  }`}
                >
                  <tool.icon className="h-4 w-4 text-primary" />
                  <span>{tool.label}</span>
                </button>
              ))}
            </div>
            <div className="mt-6 space-y-2">
              <Button onClick={() => setIsAISuggestModalOpen(true)} variant="outline" size="sm" className="w-full gap-2">
                <Sparkles className="h-4 w-4" />
                AI Suggest
              </Button>
              <Button onClick={handleResetForm} variant="ghost" size="sm" className="w-full gap-2">
                <RefreshCw className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </aside>

          {/* Center Canvas */}
          <main className="glass-panel flex min-h-[calc(100vh-250px)] flex-col p-2 sm:p-3 lg:min-h-0">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="panel-headline text-lg font-semibold font-poppins">{t("generate.preview")}</h3>
                <p className="panel-subtext text-xs">Canva-style live canvas workspace</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateZoom(zoom - 10)}
                  className="icon-3d-button p-2 text-white/80"
                  title="Zoom out"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <div className="editor-chip min-w-16 px-3 py-2 text-center text-xs font-semibold text-white/85">
                  {zoom}%
                </div>
                <button className="icon-3d-button p-2 text-white/80" title="Pan">
                  <Move className="h-4 w-4" />
                </button>
                <button
                  onClick={() => updateZoom(zoom + 10)}
                  className="icon-3d-button p-2 text-white/80"
                  title="Zoom in"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsFullscreenCanvas((value) => !value)}
                  className="icon-3d-button p-2 text-white/80"
                  title={isFullscreenCanvas ? "Exit fullscreen" : "Fullscreen"}
                >
                  {isFullscreenCanvas ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div
              className="preview-frame canvas-stage-grid relative flex flex-1 items-center justify-center overflow-hidden rounded-[24px] p-1.5 sm:p-2"
              onWheel={handleCanvasWheel}
              style={{
                backgroundImage:
                  "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('/brand/editor-canvas-bg.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {isGenerating ? (
                <div className="text-center">
                  <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary/30 border-t-primary"></div>
                  <p className="panel-subtext">Generating image...</p>
                </div>
              ) : currentImage ? (
                <div
                  className="preview-frame w-full max-w-[1400px] overflow-hidden p-2 transition-transform duration-200 ease-out"
                  style={{
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: "center center",
                  }}
                >
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
                    className="h-auto max-h-[82vh] w-full rounded-[14px]"
                    style={getFilterStyle()}
                  />
                </div>
              ) : (
                <div
                  className="glass-panel w-full max-w-[1400px] p-8 text-center transition-transform duration-200 ease-out"
                  style={{
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: "center center",
                  }}
                >
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/25 bg-primary/12 shadow-[0_0_18px_rgba(255,45,45,0.22)]">
                    <Sparkles className="h-8 w-8 text-primary/70" />
                  </div>
                  <p className="panel-headline text-base">Canvas ready</p>
                  <p className="panel-subtext mt-2 text-sm">ปรับ prompt และ settings ทางขวา แล้วกดสร้างภาพเพื่อแสดงผลบน canvas</p>
                </div>
              )}
            </div>

            {generatedImages.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {generatedImages.map((canvas, idx) => (
                  <div
                    key={idx}
                    className={`group preview-frame relative cursor-pointer overflow-hidden p-2 ${
                      selectedImageIndex === idx ? "border border-primary/40" : ""
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
                      className="h-full w-full rounded-[12px]"
                    />
                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/55 opacity-0 transition group-hover:opacity-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadImage(idx);
                        }}
                        className="icon-3d-button p-2 text-white"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyImage(idx);
                        }}
                        className="icon-3d-button p-2 text-white"
                        title="Copy"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRegenerateImage(idx);
                        }}
                        className="icon-3d-button p-2 text-white"
                        title="Regenerate"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>

          {/* Right Settings Panel */}
          <aside
            className={`glass-panel space-y-4 p-4 sm:p-5 ${
              isFullscreenCanvas ? "hidden" : ""
            }`}
          >
            <div className="mb-1 flex items-center justify-between">
              <h3 className="panel-headline text-sm font-semibold uppercase tracking-[0.16em]">Settings</h3>
              <Button onClick={() => setIsAISuggestModalOpen(true)} variant="outline" size="sm" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Suggest
              </Button>
            </div>

            {selectedTemplate && (
              <div className="tool-row flex items-start justify-between p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="mt-0.5 h-4 w-4 text-primary" />
                  <div>
                    <p className="panel-headline text-sm">{selectedTemplate.title}</p>
                    <p className="panel-subtext text-xs">{selectedTemplate.category} • {selectedTemplate.tag}</p>
                  </div>
                </div>
                <button onClick={handleClearTemplate} className="text-white/70 transition hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.12em] panel-subtext">{t("generate.headline")}</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder={t("generate.headlineExample")}
                  className="glass-input w-full px-4 py-3 text-sm text-foreground focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.12em] panel-subtext">{t("generate.subtext")}</label>
                <input
                  type="text"
                  value={subtext}
                  onChange={(e) => setSubtext(e.target.value)}
                  placeholder={t("generate.subtextExample")}
                  className="glass-input w-full px-4 py-3 text-sm text-foreground focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.12em] panel-subtext">{t("generate.cta")}</label>
                <input
                  type="text"
                  value={cta}
                  onChange={(e) => setCta(e.target.value)}
                  placeholder={t("generate.ctaExample")}
                  className="glass-input w-full px-4 py-3 text-sm text-foreground focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.12em] panel-subtext">{t("generate.promptLabel")}</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t("generate.promptPlaceholder")}
                className="glass-input h-28 w-full resize-none px-4 py-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.12em] panel-subtext">{t("generate.size")}</label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="glass-input w-full px-4 py-3 text-sm text-foreground focus:outline-none"
                >
                  {sizes.map((size) => (
                    <option key={size.value} value={size.value}>
                      {size.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.12em] panel-subtext">{t("generate.resolution")}</label>
                <select
                  value={selectedResolution}
                  onChange={(e) => setSelectedResolution(e.target.value)}
                  className="glass-input w-full px-4 py-3 text-sm text-foreground focus:outline-none"
                >
                  {resolutions.map((res) => (
                    <option key={res.value} value={res.value}>
                      {res.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="tool-row p-4 text-center">
              <Upload className="mx-auto mb-2 h-6 w-6 text-primary/80" />
              <p className="panel-subtext text-xs">Drag and drop or click to upload</p>
            </div>

            <ImageSettingsPanel
              filters={filters}
              onFilterChange={updateFilter}
              onReset={resetFilters}
            />
            <FilterPresetsPanel
              currentFilters={filters}
              onLoadPreset={(loadedFilters) => {
                Object.keys(loadedFilters).forEach((key) => {
                  updateFilter(key as keyof typeof filters, loadedFilters[key as keyof typeof filters]);
                });
              }}
            />

            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-6 text-base font-semibold text-primary-foreground disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <span className="mr-2 animate-spin">⚡</span>
                  {t("generate.createImage")}...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-5 w-5" />
                  {t("generate.createImage")}
                </>
              )}
            </Button>
          </aside>
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
