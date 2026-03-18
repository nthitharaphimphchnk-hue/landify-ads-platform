import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { useBatchDownload } from "@/hooks/useBatchDownload";
import { Download, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface BatchDownloadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDesigns: Array<{ id: string; name: string; canvas: HTMLCanvasElement }>;
}

export default function BatchDownloadModal({
  open,
  onOpenChange,
  selectedDesigns,
}: BatchDownloadModalProps) {
  const { t } = useLanguage();
  const { downloadAsZip, isDownloading, progress } = useBatchDownload();
  const [format, setFormat] = useState<"png" | "jpg" | "webp">("png");
  const [quality, setQuality] = useState(90);

  const handleDownload = async () => {
    try {
      await downloadAsZip(selectedDesigns, { format, quality });
      onOpenChange(false);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const totalSize = selectedDesigns.length;
  const estimatedSize = {
    png: totalSize * 2.5,
    jpg: totalSize * 0.8,
    webp: totalSize * 0.6,
  }[format];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Download Multiple Designs</DialogTitle>
          <DialogDescription>
            Download {totalSize} design{totalSize !== 1 ? "s" : ""} as ZIP file
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Format Selection */}
          <div className="space-y-2">
            <Label htmlFor="format">File Format</Label>
            <Select value={format} onValueChange={(value: any) => setFormat(value)}>
              <SelectTrigger id="format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="png">PNG (Lossless)</SelectItem>
                <SelectItem value="jpg">JPG (Web)</SelectItem>
                <SelectItem value="webp">WebP (Modern)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quality Slider */}
          {format !== "png" && (
            <div className="space-y-2">
              <Label htmlFor="quality">Quality: {quality}%</Label>
              <Slider
                id="quality"
                min={50}
                max={100}
                step={5}
                value={[quality]}
                onValueChange={(value) => setQuality(value[0])}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Higher quality = larger file size
              </p>
            </div>
          )}

          {/* File Size Info */}
          <div className="bg-secondary border border-border rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4 text-primary" />
              <span className="font-medium">Estimated ZIP Size</span>
            </div>
            <p className="text-lg font-semibold text-primary">
              ~{estimatedSize.toFixed(1)} MB
            </p>
            <p className="text-xs text-muted-foreground">
              {totalSize} image{totalSize !== 1 ? "s" : ""} × {format.toUpperCase()}
            </p>
          </div>

          {/* Progress Bar */}
          {isDownloading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Downloading...</span>
                <span className="font-semibold">{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {/* Format Comparison */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-3">Format Comparison</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span>PNG:</span>
                <span className="text-muted-foreground">Lossless, larger file</span>
              </div>
              <div className="flex justify-between">
                <span>JPG:</span>
                <span className="text-muted-foreground">Compressed, smaller file</span>
              </div>
              <div className="flex justify-between">
                <span>WebP:</span>
                <span className="text-muted-foreground">Modern, best compression</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDownloading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDownload}
            disabled={isDownloading || selectedDesigns.length === 0}
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 red-glow-hover"
          >
            <Download className="w-4 h-4" />
            {isDownloading ? `Downloading... ${progress}%` : "Download ZIP"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
