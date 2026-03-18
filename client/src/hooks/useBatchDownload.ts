import { useState } from "react";

interface BatchDownloadOptions {
  format: "png" | "jpg" | "webp";
  quality: number;
}

export function useBatchDownload() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const downloadAsZip = async (
    images: { id: string; canvas: HTMLCanvasElement; name: string }[],
    options: BatchDownloadOptions
  ) => {
    if (images.length === 0) return;

    setIsDownloading(true);
    setProgress(0);

    try {
      // Dynamic import JSZip
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      // Add images to ZIP
      for (let i = 0; i < images.length; i++) {
        const { canvas, name } = images[i];
        const extension = options.format;

        // Convert canvas to blob
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob(
            (blob) => resolve(blob!),
            `image/${options.format === "jpg" ? "jpeg" : options.format}`,
            options.quality / 100
          );
        });

        // Add to ZIP
        zip.file(`${name}.${extension}`, blob);

        // Update progress
        setProgress(Math.round(((i + 1) / images.length) * 100));
      }

      // Generate ZIP file
      const zipBlob = await zip.generateAsync({ type: "blob" });

      // Download ZIP
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `adcraft-designs-${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setProgress(100);
    } catch (error) {
      console.error("Failed to create ZIP:", error);
      throw error;
    } finally {
      setIsDownloading(false);
      setProgress(0);
    }
  };

  return {
    downloadAsZip,
    isDownloading,
    progress,
  };
}
