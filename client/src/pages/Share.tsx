/**
 * AdCraft AI - Share Page
 * Design: Dark Premium Tech
 * Allows users to view and edit shared designs
 */

import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import { useSharedDesign } from "@/hooks/useSharedDesign";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/useToast";
import { useDraftManager } from "@/hooks/useDraftManager";
import {
  Edit,
  Copy,
  Check,
  Download,
  Share2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

export default function Share() {
  const { t } = useLanguage();
  const { info: showInfo, success: showSuccess, error: showError } = useToast();
  const [, navigate] = useLocation();
  const [match, params] = useRoute("/share/:shareId");
  const { getSharedDesign } = useSharedDesign();
  const { saveDraft } = useDraftManager();
  const [design, setDesign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (match && params?.shareId) {
      const sharedDesign = getSharedDesign(params.shareId);
      if (sharedDesign) {
        setDesign(sharedDesign);
        showSuccess("Shared design loaded!");
      } else {
        showError("Design not found or link has expired");
      }
      setLoading(false);
    }
  }, [match, params, getSharedDesign, showSuccess, showError]);

  const handleEditDesign = () => {
    if (design) {
      // Save to sessionStorage for Generate page to load
      sessionStorage.setItem("editingDraft", JSON.stringify(design));
      showInfo("Loading design in editor...");
      setTimeout(() => {
        navigate("/generate");
      }, 500);
    }
  };

  const handleSaveAsDraft = () => {
    if (design) {
      const draftName = `Shared: ${design.headline}`;
      saveDraft(
        draftName,
        design.prompt || "",
        design.headline,
        design.subtext,
        design.cta,
        design.size,
        "150",
        undefined,
        design.imageData
      );
      showSuccess("Design saved to your drafts!");
    }
  };

  const handleCopyLink = async () => {
    const shareUrl = window.location.href;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      showSuccess("Link copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      showError("Failed to copy link");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Loading shared design...</p>
        </div>
      </div>
    );
  }

  if (!design) {
    return (
      <div className="min-h-screen bg-transparent">
        <Header />
        <div className="container py-20">
          <div className="max-w-2xl mx-auto">
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
              <h1 className="text-2xl font-bold font-poppins mb-2">
                Design Not Found
              </h1>
              <p className="text-muted-foreground mb-6">
                The design you're looking for doesn't exist or the link has expired.
              </p>
              <Button onClick={() => navigate("/")} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      <Header />
      <Breadcrumb
        items={[
          { label: "Shared Design", active: true },
        ]}
      />

      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-poppins mb-2">
              Shared Design
            </h1>
            <p className="text-muted-foreground">
              View and edit this design shared with you
            </p>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Preview */}
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                {/* Image Preview */}
                <div className="bg-secondary aspect-square flex items-center justify-center">
                  {design.imageData ? (
                    <img
                      src={design.imageData}
                      alt="Shared design"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="w-24 h-24 bg-muted rounded-lg mb-4 mx-auto flex items-center justify-center">
                        <span className="text-muted-foreground">No image</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Design Details */}
                <div className="p-6 space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Headline</p>
                    <p className="text-lg font-semibold">{design.headline}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Subtext</p>
                    <p className="text-base">{design.subtext}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">CTA Button</p>
                    <p className="text-base">{design.cta}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Size</p>
                      <p className="text-sm font-mono">{design.size}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Created
                      </p>
                      <p className="text-sm">
                        {new Date(design.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Sidebar */}
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <h3 className="font-semibold font-poppins">Actions</h3>

                <Button
                  onClick={handleEditDesign}
                  className="w-full gap-2 bg-primary hover:bg-primary/90"
                >
                  <Edit className="w-4 h-4" />
                  Edit Design
                </Button>

                <Button
                  onClick={handleSaveAsDraft}
                  variant="outline"
                  className="w-full gap-2"
                >
                  <Download className="w-4 h-4" />
                  Save as Draft
                </Button>

                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  className="w-full gap-2"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Link
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => navigate("/")}
                  variant="outline"
                  className="w-full gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </Button>
              </div>

              {/* Share Info */}
              <div className="bg-secondary border border-border rounded-lg p-4 text-sm">
                <div className="flex items-start gap-2 mb-2">
                  <Share2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold mb-1">Shared Design</p>
                    <p className="text-xs text-muted-foreground">
                      This design was shared with you. You can edit it and save
                      it to your drafts.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
