/**
 * AdCraft AI - AI Suggest Modal Component
 * Design: Dark Premium Tech
 */

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAISuggest, AISuggestion } from "@/hooks/useAISuggest";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sparkles, Copy, Check, Loader2 } from "lucide-react";

interface AISuggestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (suggestion: AISuggestion) => void;
  category?: string;
  currentHeadline?: string;
  currentSubtext?: string;
  currentCta?: string;
}

export default function AISuggestModal({
  open,
  onOpenChange,
  onApply,
  category = "product",
  currentHeadline = "",
  currentSubtext = "",
  currentCta = "",
}: AISuggestModalProps) {
  const { t } = useLanguage();
  const { loading, generateSuggestions } = useAISuggest();
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerateSuggestions = async () => {
    const newSuggestions = await generateSuggestions(category);
    setSuggestions(newSuggestions);
    setSelectedIndex(null);
  };

  const handleApply = (suggestion: AISuggestion) => {
    onApply(suggestion);
    onOpenChange(false);
  };

  const handleCopy = (suggestion: AISuggestion, index: number) => {
    const text = `${suggestion.headline}\n${suggestion.subtext}\n${suggestion.cta}`;
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-poppins">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Ad Copy Suggestions
          </DialogTitle>
          <DialogDescription>
            Get AI-powered suggestions for your ad copy. Choose the one you like
            or apply directly to your design.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Generate Button */}
          {suggestions.length === 0 ? (
            <Button
              onClick={handleGenerateSuggestions}
              disabled={loading}
              className="w-full gap-2 bg-primary hover:bg-primary/90"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating Suggestions...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate AI Suggestions
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleGenerateSuggestions}
              disabled={loading}
              variant="outline"
              className="w-full gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Regenerating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Regenerate Suggestions
                </>
              )}
            </Button>
          )}

          {/* Suggestions Grid */}
          {suggestions.length > 0 && (
            <div className="grid grid-cols-1 gap-3">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border transition cursor-pointer ${
                    selectedIndex === index
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedIndex(index)}
                >
                  <div className="space-y-2 mb-3">
                    <p className="font-semibold text-sm text-primary">
                      {suggestion.headline}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {suggestion.subtext}
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {suggestion.cta}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApply(suggestion);
                      }}
                      size="sm"
                      className="flex-1 gap-2 bg-primary hover:bg-primary/90"
                    >
                      Apply
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(suggestion, index);
                      }}
                      size="sm"
                      variant="outline"
                      className="gap-2"
                    >
                      {copiedIndex === index ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Info */}
          <div className="bg-secondary border border-border rounded-lg p-3 text-sm">
            <p className="text-muted-foreground">
              💡 Suggestions are based on proven ad copy patterns. Mix and match
              to create your perfect ad!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
