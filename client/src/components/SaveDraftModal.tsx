/**
 * AdCraft AI - Save Draft Modal Component
 * Allows users to save their design as a draft
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useDraftManager } from "@/hooks/useDraftManager";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/useToast";
import { X, Save, AlertCircle } from "lucide-react";

interface SaveDraftModalProps {
  isOpen: boolean;
  onClose: () => void;
  headline: string;
  subtext: string;
  cta: string;
  size: string;
  resolution: string;
  prompt: string;
  templateId?: number;
  imageData?: string;
}

export default function SaveDraftModal({
  isOpen,
  onClose,
  headline,
  subtext,
  cta,
  size,
  resolution,
  prompt,
  templateId,
  imageData,
}: SaveDraftModalProps) {
  const { t } = useLanguage();
  const { success: showSuccess, error: showError } = useToast();
  const { saveDraft, getAllDrafts } = useDraftManager();
  const [draftName, setDraftName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    if (!draftName.trim()) {
      setError("Please enter a draft name");
      showError("Please enter a draft name");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      saveDraft(
        draftName,
        prompt,
        headline,
        subtext,
        cta,
        size,
        resolution,
        templateId,
        imageData
      );
      setSuccess(true);
      showSuccess(`Draft "${draftName}" saved successfully!`);
      setTimeout(() => {
        setDraftName("");
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      const errorMsg = "Failed to save draft. Please try again.";
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold font-poppins">Save as Draft</h2>
          <button
            onClick={onClose}
            className="p-1 text-muted-foreground hover:text-foreground transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="bg-primary/20 border border-primary/30 rounded-lg p-4 text-center">
            <p className="text-primary font-semibold">✓ Draft saved successfully!</p>
            <p className="text-xs text-primary/80 mt-1">Redirecting...</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Draft Name
                </label>
                <input
                  type="text"
                  value={draftName}
                  onChange={(e) => {
                    setDraftName(e.target.value);
                    setError("");
                  }}
                  placeholder="e.g., Summer Sale Campaign"
                  className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {error && (
                <div className="bg-destructive/20 border border-destructive/30 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <div className="bg-secondary/50 rounded-lg p-3 space-y-2 text-sm text-muted-foreground">
                <p>
                  <strong>Headline:</strong> {headline}
                </p>
                <p>
                  <strong>Subtext:</strong> {subtext}
                </p>
                <p>
                  <strong>CTA:</strong> {cta}
                </p>
                <p>
                  <strong>Size:</strong> {size}
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving || !draftName.trim()}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? "Saving..." : "Save Draft"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
