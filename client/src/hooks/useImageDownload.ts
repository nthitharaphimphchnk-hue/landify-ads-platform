/**
 * AdCraft AI - Image Download Hook
 * Handles image download in multiple formats (JPG, PNG, WebP)
 */

export type ImageFormat = 'jpg' | 'png' | 'webp';

interface DownloadOptions {
  filename?: string;
  format?: ImageFormat;
  quality?: number; // 0-1, for JPG and WebP
}

export const useImageDownload = () => {
  /**
   * Create a canvas-based image from SVG or canvas element
   */
  const createCanvasImage = (
    width: number = 1080,
    height: number = 1080,
    headline: string = 'Flash Sale',
    subtext: string = '50% OFF',
    cta: string = 'Shop Now'
  ): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get canvas context');

    // Background gradient (Red to Dark)
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#ff2d2d');
    gradient.addColorStop(1, '#0b0b0b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add grid pattern
    ctx.strokeStyle = 'rgba(255, 45, 45, 0.1)';
    ctx.lineWidth = 1;
    const gridSize = 50;
    for (let i = 0; i < width; i += gridSize) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let i = 0; i < height; i += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    // Draw headline
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${Math.round(width / 12)}px Poppins, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(headline, width / 2, height / 3);

    // Draw subtext
    ctx.fillStyle = '#ff2d2d';
    ctx.font = `bold ${Math.round(width / 8)}px Poppins, sans-serif`;
    ctx.fillText(subtext, width / 2, height / 2);

    // Draw CTA button
    const buttonWidth = Math.round(width / 3);
    const buttonHeight = Math.round(height / 12);
    const buttonX = (width - buttonWidth) / 2;
    const buttonY = (height * 2) / 3;

    ctx.fillStyle = '#ff2d2d';
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${Math.round(width / 24)}px Poppins, sans-serif`;
    ctx.fillText(cta, width / 2, buttonY + buttonHeight / 2);

    return canvas;
  };

  /**
   * Download image in specified format
   */
  const downloadImage = (
    canvas: HTMLCanvasElement,
    options: DownloadOptions = {}
  ) => {
    const {
      filename = 'adcraft-image',
      format = 'png',
      quality = 0.95,
    } = options;

    try {
      let mimeType: string;
      let fileExtension: string;

      switch (format) {
        case 'jpg':
          mimeType = 'image/jpeg';
          fileExtension = '.jpg';
          break;
        case 'webp':
          mimeType = 'image/webp';
          fileExtension = '.webp';
          break;
        case 'png':
        default:
          mimeType = 'image/png';
          fileExtension = '.png';
          break;
      }

      // Convert canvas to blob and download
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            throw new Error('Failed to create blob');
          }

          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${filename}${fileExtension}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        },
        mimeType,
        quality
      );
    } catch (error) {
      console.error('Download failed:', error);
      throw error;
    }
  };

  /**
   * Download image with specific size and format
   */
  const downloadWithSize = (
    size: string,
    headline: string,
    subtext: string,
    cta: string,
    format: ImageFormat = 'png'
  ) => {
    const [width, height] = size.split('x').map(Number);
    const canvas = createCanvasImage(width, height, headline, subtext, cta);
    downloadImage(canvas, {
      filename: `adcraft-${width}x${height}`,
      format,
    });
  };

  /**
   * Get file size estimate for different formats
   */
  const estimateFileSize = (width: number, height: number, format: ImageFormat): string => {
    const pixels = width * height;
    let sizeKB = 0;

    switch (format) {
      case 'jpg':
        sizeKB = (pixels * 0.5) / 1024;
        break;
      case 'webp':
        sizeKB = (pixels * 0.3) / 1024;
        break;
      case 'png':
      default:
        sizeKB = (pixels * 1.5) / 1024;
        break;
    }

    if (sizeKB > 1024) {
      return `${(sizeKB / 1024).toFixed(2)} MB`;
    }
    return `${sizeKB.toFixed(2)} KB`;
  };

  return {
    createCanvasImage,
    downloadImage,
    downloadWithSize,
    estimateFileSize,
  };
};
