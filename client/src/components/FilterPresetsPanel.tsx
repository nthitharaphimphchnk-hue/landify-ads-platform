import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Save,
  Trash2,
  ChevronDown,
  Check,
  X,
  Edit2,
  Copy,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/useToast";
import { FilterPreset, useFilterPresets } from "@/hooks/useFilterPresets";
import { ImageFilters } from "@/hooks/useImageFilters";

interface FilterPresetsPanelProps {
  currentFilters: ImageFilters;
  onLoadPreset: (filters: ImageFilters) => void;
}

export default function FilterPresetsPanel({
  currentFilters,
  onLoadPreset,
}: FilterPresetsPanelProps) {
  const { t } = useLanguage();
  const { success: showSuccess, error: showError } = useToast();
  const { presets, savePreset, deletePreset, updatePreset } =
    useFilterPresets();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [presetName, setPresetName] = useState("");
  const [presetDescription, setPresetDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const handleSavePreset = () => {
    if (!presetName.trim()) {
      showError(t("filterPresets.nameRequired") || "Preset name is required");
      return;
    }

    if (editingId) {
      updatePreset(editingId, presetName, presetDescription);
      showSuccess(
        t("filterPresets.presetUpdated") || "Preset updated successfully"
      );
      setEditingId(null);
    } else {
      savePreset(presetName, currentFilters, presetDescription);
      showSuccess(
        t("filterPresets.presetSaved") || "Preset saved successfully"
      );
    }

    setPresetName("");
    setPresetDescription("");
    setIsSaveModalOpen(false);
  };

  const handleDeletePreset = (id: string) => {
    if (confirm(t("filterPresets.confirmDelete") || "Delete this preset?")) {
      deletePreset(id);
      showSuccess(
        t("filterPresets.presetDeleted") || "Preset deleted successfully"
      );
    }
  };

  const handleLoadPreset = (preset: FilterPreset) => {
    onLoadPreset(preset.filters);
    showSuccess(
      t("filterPresets.presetLoaded") || "Preset loaded successfully"
    );
  };

  const handleEditPreset = (preset: FilterPreset) => {
    setEditingId(preset.id);
    setEditName(preset.name);
    setEditDescription(preset.description || "");
    setPresetName(preset.name);
    setPresetDescription(preset.description || "");
    setIsSaveModalOpen(true);
  };

  const handleDuplicatePreset = (preset: FilterPreset) => {
    const newName = `${preset.name} (Copy)`;
    savePreset(newName, preset.filters, preset.description);
    showSuccess(
      t("filterPresets.presetDuplicated") || "Preset duplicated successfully"
    );
  };

  return (
    <div className="glass-panel glass-panel-hover overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="tool-row m-2 flex w-[calc(100%-1rem)] items-center justify-between px-4 py-3 text-left"
      >
        <h3 className="panel-headline text-sm font-semibold">
          {t("filterPresets.title") || "Filter Presets"}
        </h3>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="max-h-96 space-y-3 overflow-y-auto border-t border-white/10 px-4 py-4">
          {/* Save New Preset Button */}
          <Button
            onClick={() => {
              setEditingId(null);
              setPresetName("");
              setPresetDescription("");
              setIsSaveModalOpen(true);
            }}
            variant="outline"
            size="sm"
            className="w-full gap-2"
          >
            <Save className="w-4 h-4" />
            {t("filterPresets.saveNewPreset") || "Save Current as Preset"}
          </Button>

          {/* Presets List */}
          {presets.length > 0 ? (
            <div className="space-y-2">
              {presets.map((preset) => (
                <div
                  key={preset.id}
                  className="tool-row space-y-2 rounded-[18px] p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="panel-headline truncate text-sm font-medium">
                        {preset.name}
                      </h4>
                      {preset.description && (
                        <p className="panel-subtext truncate text-xs">
                          {preset.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      onClick={() => handleLoadPreset(preset)}
                      variant="ghost"
                      size="sm"
                      className="flex-1 text-xs gap-1"
                    >
                      <Check className="w-3 h-3" />
                      {t("filterPresets.apply") || "Apply"}
                    </Button>
                    <Button
                      onClick={() => handleEditPreset(preset)}
                      variant="ghost"
                      size="sm"
                      className="flex-1 text-xs gap-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      {t("filterPresets.edit") || "Edit"}
                    </Button>
                    <Button
                      onClick={() => handleDuplicatePreset(preset)}
                      variant="ghost"
                      size="sm"
                      className="flex-1 text-xs gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      {t("filterPresets.duplicate") || "Copy"}
                    </Button>
                    <Button
                      onClick={() => handleDeletePreset(preset.id)}
                      variant="ghost"
                      size="sm"
                      className="flex-1 text-xs gap-1 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                      {t("filterPresets.delete") || "Delete"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="panel-subtext py-4 text-center text-xs">
              {t("filterPresets.noPresets") || "No presets saved yet"}
            </p>
          )}
        </div>
      )}

      {/* Save Preset Modal */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md space-y-4 p-6">
            <h2 className="panel-headline font-semibold font-poppins">
              {editingId
                ? t("filterPresets.editPreset") || "Edit Preset"
                : t("filterPresets.savePreset") || "Save as Preset"}
            </h2>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium panel-subtext">
                  {t("filterPresets.presetName") || "Preset Name"}
                </label>
                <input
                  type="text"
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  placeholder={
                    t("filterPresets.namePlaceholder") || "e.g., Vibrant Look"
                  }
                  className="glass-input w-full px-3 py-2 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium panel-subtext">
                  {t("filterPresets.description") || "Description (Optional)"}
                </label>
                <textarea
                  value={presetDescription}
                  onChange={(e) => setPresetDescription(e.target.value)}
                  placeholder={
                    t("filterPresets.descriptionPlaceholder") ||
                    "Add notes about this preset..."
                  }
                  className="glass-input w-full resize-none px-3 py-2 text-sm focus:outline-none"
                  rows={3}
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-2">
              <Button
                onClick={handleSavePreset}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {editingId
                  ? t("filterPresets.updatePreset") || "Update"
                  : t("filterPresets.savePreset") || "Save"}
              </Button>
              <Button
                onClick={() => {
                  setIsSaveModalOpen(false);
                  setEditingId(null);
                  setPresetName("");
                  setPresetDescription("");
                }}
                variant="outline"
                className="flex-1"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
