import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { RotateCcw, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ImageFilters } from "@/hooks/useImageFilters";

interface ImageSettingsPanelProps {
  filters: ImageFilters;
  onFilterChange: (key: keyof ImageFilters, value: number) => void;
  onReset: () => void;
}

export default function ImageSettingsPanel({
  filters,
  onFilterChange,
  onReset,
}: ImageSettingsPanelProps) {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  const settings = [
    {
      key: "brightness" as const,
      label: t("generate.brightness") || "Brightness",
      min: 0,
      max: 200,
      step: 1,
      unit: "%",
    },
    {
      key: "contrast" as const,
      label: t("generate.contrast") || "Contrast",
      min: 0,
      max: 200,
      step: 1,
      unit: "%",
    },
    {
      key: "saturation" as const,
      label: t("generate.saturation") || "Saturation",
      min: 0,
      max: 200,
      step: 1,
      unit: "%",
    },
    {
      key: "blur" as const,
      label: t("generate.blur") || "Blur",
      min: 0,
      max: 20,
      step: 0.5,
      unit: "px",
    },
    {
      key: "opacity" as const,
      label: t("generate.opacity") || "Opacity",
      min: 0,
      max: 100,
      step: 1,
      unit: "%",
    },
  ];

  return (
    <div className="glass-panel glass-panel-hover overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="tool-row m-2 flex w-[calc(100%-1rem)] items-center justify-between px-4 py-3 text-left"
      >
        <h3 className="panel-headline text-sm font-semibold">
          {t("generate.advancedSettings") || "Advanced Settings"}
        </h3>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="space-y-4 border-t border-white/10 px-4 py-4">
          {settings.map((setting) => (
            <div key={setting.key}>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium panel-subtext">{setting.label}</label>
                <span className="text-xs panel-subtext">
                  {filters[setting.key]}
                  {setting.unit}
                </span>
              </div>
              <Slider
                value={[filters[setting.key]]}
                onValueChange={(value) =>
                  onFilterChange(setting.key, value[0])
                }
                min={setting.min}
                max={setting.max}
                step={setting.step}
                className="w-full"
              />
            </div>
          ))}

          {/* Reset Button */}
          <Button
            onClick={onReset}
            variant="outline"
            size="sm"
            className="w-full gap-2 mt-4"
          >
            <RotateCcw className="w-4 h-4" />
            {t("generate.resetFilters") || "Reset"}
          </Button>
        </div>
      )}
    </div>
  );
}
