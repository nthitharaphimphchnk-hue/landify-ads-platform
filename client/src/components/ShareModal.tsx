/**
 * AdCraft AI - Share Modal Component
 * Allows users to share their design via link
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useShareLink } from "@/hooks/useShareLink";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/useToast";
import { X, Copy, Check, Share2 } from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  headline: string;
  subtext: string;
  cta: string;
  size: string;
  imageData?: string;
}

export default function ShareModal({
  isOpen,
  onClose,
  headline,
  subtext,
  cta,
  size,
  imageData,
}: ShareModalProps) {
  const { t } = useLanguage();
  const { success: showSuccess, error: showError, info: showInfo } = useToast();
  const { generateShareLink, copyToClipboard } = useShareLink();
  const [shareUrl, setShareUrl] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateLink = async () => {
    setIsGenerating(true);
    try {
      const { shareUrl: url } = generateShareLink(
        headline,
        subtext,
        cta,
        size,
        imageData
      );
      setShareUrl(url);
      showSuccess("Share link generated successfully!");
    } catch (error) {
      console.error("Failed to generate share link:", error);
      showError("Failed to generate share link. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = async () => {
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setIsCopied(true);
      showSuccess("Link copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    } else {
      showError("Failed to copy link. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold font-poppins flex items-center gap-2">
            <Share2 className="w-5 h-5 text-primary" />
            Share Design
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-muted-foreground hover:text-foreground transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {!shareUrl ? (
            <>
              <div className="bg-secondary/50 rounded-lg p-4 space-y-2 text-sm">
                <p className="text-muted-foreground">
                  Generate a shareable link to let others view your design
                </p>
                <div className="space-y-1">
                  <p>
                    <strong>Headline:</strong> {headline}
                  </p>
                  <p>
                    <strong>Subtext:</strong> {subtext}
                  </p>
                  <p>
                    <strong>CTA:</strong> {cta}
                  </p>
                </div>
              </div>

              <Button
                onClick={handleGenerateLink}
                disabled={isGenerating}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isGenerating ? "Generating..." : "Generate Share Link"}
              </Button>
            </>
          ) : (
            <>
              <div className="bg-secondary/50 rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-2">Share URL</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 px-3 py-2 bg-secondary border border-border rounded text-sm text-foreground"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="p-2 bg-primary hover:bg-primary/90 text-white rounded transition"
                  >
                    {isCopied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Share on:</p>
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => {
                      showInfo("Facebook sharing feature coming soon!");
                    }}
                    className="px-3 py-2 bg-secondary border border-border rounded text-sm hover:border-primary/50 transition"
                  >
                    Facebook
                  </button>
                  <button 
                    onClick={() => {
                      showInfo("Twitter sharing feature coming soon!");
                    }}
                    className="px-3 py-2 bg-secondary border border-border rounded text-sm hover:border-primary/50 transition"
                  >
                    Twitter
                  </button>
                  <button 
                    onClick={() => {
                      showInfo("LinkedIn sharing feature coming soon!");
                    }}
                    className="px-3 py-2 bg-secondary border border-border rounded text-sm hover:border-primary/50 transition"
                  >
                    LinkedIn
                  </button>
                </div>
              </div>

              <Button
                onClick={() => setShareUrl("")}
                variant="outline"
                className="w-full"
              >
                Generate New Link
              </Button>
            </>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
