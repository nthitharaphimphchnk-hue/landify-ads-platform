/**
 * AdCraft AI - Download Modal Component
 * Design: Dark Premium Tech
 * Allows users to select download format and size
 */

import { Button } from "@/components/ui/button";
import { X, Download, FileJson, Image } from "lucide-react";
import { useState } from "react";
import { useImageDownload, ImageFormat } from "@/hooks/useImageDownload";
import { useToast } from "@/hooks/useToast";

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  headline: string;
  subtext: string;
  cta: string;
  selectedSize: string;
}

export default function DownloadModal({
  isOpen,
  onClose,
  headline,
  subtext,
  cta,
  selectedSize,
}: DownloadModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<ImageFormat>("png");
  const [isDownloading, setIsDownloading] = useState(false);
  const { success: showSuccess, error: showError, info: showInfo } = useToast();
  const { downloadWithSize, estimateFileSize } = useImageDownload();

  const formats = [
    {
      id: "png" as ImageFormat,
      label: "PNG",
      description: "Lossless compression, best quality",
      icon: Image,
      color: "text-blue-500",
    },
    {
      id: "jpg" as ImageFormat,
      label: "JPG",
      description: "Smaller file size, good for web",
      icon: FileJson,
      color: "text-yellow-500",
    },
    {
      id: "webp" as ImageFormat,
      label: "WebP",
      description: "Modern format, best compression",
      icon: Image,
      color: "text-green-500",
    },
  ];

  const [width, height] = selectedSize.split("x").map(Number);
  const fileSize = estimateFileSize(width, height, selectedFormat);

  const handleDownload = async () => {
    showInfo(`Preparing ${selectedFormat.toUpperCase()} download...`);
    setIsDownloading(true);
    try {
      downloadWithSize(selectedSize, headline, subtext, cta, selectedFormat);
      showSuccess(`Image downloaded as ${selectedFormat.toUpperCase()}!`);
      setTimeout(() => {
        setIsDownloading(false);
        onClose();
      }, 500);
    } catch (error) {
      console.error("Download failed:", error);
      showError("Failed to download image. Please try again.");
      setIsDownloading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-lg shadow-2xl max-w-2xl w-full">
          {/* Header */}
          <div className="border-b border-border flex items-center justify-between p-6">
            <h2 className="text-2xl font-bold font-poppins">Download Image</h2>
            <button
              onClick={onClose}
              className="p-2 text-muted-foreground hover:text-foreground transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Image Info */}
            <div className="bg-secondary rounded-lg p-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Size</p>
                  <p className="font-semibold">
                    {width}x{height}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Estimated Size
                  </p>
                  <p className="font-semibold">{fileSize}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Format</p>
                  <p className="font-semibold uppercase">{selectedFormat}</p>
                </div>
              </div>
            </div>

            {/* Format Selection */}
            <div>
              <h3 className="font-semibold font-poppins mb-4">Select Format</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {formats.map((format) => (
                  <button
                    key={format.id}
                    onClick={() => setSelectedFormat(format.id)}
                    className={`p-4 rounded-lg border-2 transition ${
                      selectedFormat === format.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <format.icon className={`w-6 h-6 mb-2 ${format.color}`} />
                    <h4 className="font-semibold mb-1">{format.label}</h4>
                    <p className="text-xs text-muted-foreground">
                      {format.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Format Details */}
            <div className="bg-secondary rounded-lg p-4">
              <h4 className="font-semibold mb-2">Format Comparison</h4>
              <div className="space-y-2 text-sm">
                {selectedFormat === "png" && (
                  <>
                    <p>✓ Lossless compression preserves all image details</p>
                    <p>✓ Best for images with text and graphics</p>
                    <p>✓ Larger file size than JPG/WebP</p>
                    <p>✓ Supports transparency</p>
                  </>
                )}
                {selectedFormat === "jpg" && (
                  <>
                    <p>✓ Lossy compression reduces file size significantly</p>
                    <p>✓ Good quality at smaller file sizes</p>
                    <p>✓ Best for web and social media</p>
                    <p>✓ No transparency support</p>
                  </>
                )}
                {selectedFormat === "webp" && (
                  <>
                    <p>✓ Modern format with superior compression</p>
                    <p>✓ 25-35% smaller than JPG</p>
                    <p>✓ Supports both lossy and lossless</p>
                    <p>✓ Excellent for web performance</p>
                  </>
                )}
              </div>
            </div>

            {/* Preview */}
            <div>
              <h3 className="font-semibold font-poppins mb-3">Preview</h3>
              <div className="w-full bg-gradient-to-br from-primary/20 to-secondary rounded-lg p-4 flex items-center justify-center min-h-[200px]">
                <div className="text-center">
                  <Image className="w-12 h-12 text-primary/50 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Image preview will appear here
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {headline} • {subtext} • {cta}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-border p-6 flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold red-glow-hover disabled:opacity-50"
            >
              {isDownloading ? (
                <>
                  <span className="animate-spin mr-2">⚡</span>
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download {selectedFormat.toUpperCase()}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
