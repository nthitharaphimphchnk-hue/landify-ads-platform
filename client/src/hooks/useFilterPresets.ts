import { useState, useCallback, useEffect } from 'react';
import { ImageFilters } from './useImageFilters';

export interface FilterPreset {
  id: string;
  name: string;
  description?: string;
  filters: ImageFilters;
  createdAt: number;
  isDefault?: boolean;
}

const STORAGE_KEY = 'adcraft_filter_presets';
const DEFAULT_PRESETS_VERSION_KEY = 'adcraft_default_presets_version';
const CURRENT_VERSION = '1';

// Default filter presets for new users
const DEFAULT_PRESETS: Omit<FilterPreset, 'createdAt'>[] = [
  {
    id: 'preset_warm_tone',
    name: 'Warm Tone',
    description: 'Cozy and inviting warm colors, perfect for lifestyle products',
    filters: {
      brightness: 110,
      contrast: 115,
      saturation: 120,
      blur: 0,
      opacity: 100,
    },
    isDefault: true,
  },
  {
    id: 'preset_vintage',
    name: 'Vintage Style',
    description: 'Classic vintage look with muted colors and soft tones',
    filters: {
      brightness: 95,
      contrast: 90,
      saturation: 85,
      blur: 0,
      opacity: 100,
    },
    isDefault: true,
  },
  {
    id: 'preset_vibrant',
    name: 'Vibrant',
    description: 'Bold and energetic colors for eye-catching ads',
    filters: {
      brightness: 105,
      contrast: 130,
      saturation: 140,
      blur: 0,
      opacity: 100,
    },
    isDefault: true,
  },
  {
    id: 'preset_professional',
    name: 'Professional',
    description: 'Clean and professional look for corporate products',
    filters: {
      brightness: 105,
      contrast: 110,
      saturation: 100,
      blur: 0,
      opacity: 100,
    },
    isDefault: true,
  },
  {
    id: 'preset_moody',
    name: 'Moody',
    description: 'Dark and dramatic mood for premium and luxury products',
    filters: {
      brightness: 85,
      contrast: 125,
      saturation: 110,
      blur: 0,
      opacity: 100,
    },
    isDefault: true,
  },
  {
    id: 'preset_soft_focus',
    name: 'Soft Focus',
    description: 'Dreamy and soft aesthetic with gentle blur',
    filters: {
      brightness: 115,
      contrast: 95,
      saturation: 105,
      blur: 3,
      opacity: 100,
    },
    isDefault: true,
  },
  {
    id: 'preset_bw_dramatic',
    name: 'B&W Dramatic',
    description: 'Black and white with high contrast for dramatic effect',
    filters: {
      brightness: 100,
      contrast: 150,
      saturation: 0,
      blur: 0,
      opacity: 100,
    },
    isDefault: true,
  },
  {
    id: 'preset_minimalist',
    name: 'Minimalist',
    description: 'Clean, minimal aesthetic with reduced saturation',
    filters: {
      brightness: 110,
      contrast: 105,
      saturation: 70,
      blur: 0,
      opacity: 100,
    },
    isDefault: true,
  },
  {
    id: 'preset_sunset',
    name: 'Sunset',
    description: 'Warm golden hour tones perfect for lifestyle content',
    filters: {
      brightness: 120,
      contrast: 120,
      saturation: 130,
      blur: 0,
      opacity: 100,
    },
    isDefault: true,
  },
  {
    id: 'preset_cool_blue',
    name: 'Cool Blue',
    description: 'Cool and fresh blue tones for tech and modern products',
    filters: {
      brightness: 105,
      contrast: 115,
      saturation: 115,
      blur: 0,
      opacity: 100,
    },
    isDefault: true,
  },
];

export const useFilterPresets = () => {
  const [presets, setPresets] = useState<FilterPreset[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load presets from localStorage on mount and initialize with defaults if needed
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const versionStored = localStorage.getItem(DEFAULT_PRESETS_VERSION_KEY);

      let presetsToUse: FilterPreset[] = [];

      if (stored) {
        const parsed = JSON.parse(stored);
        presetsToUse = Array.isArray(parsed) ? parsed : [];
      }

      // Initialize with default presets if first time or version mismatch
      if (versionStored !== CURRENT_VERSION) {
        const defaultPresetsWithTime: FilterPreset[] = DEFAULT_PRESETS.map(
          (preset) => ({
            ...preset,
            createdAt: Date.now(),
          })
        );
        presetsToUse = [...defaultPresetsWithTime, ...presetsToUse];
        localStorage.setItem(DEFAULT_PRESETS_VERSION_KEY, CURRENT_VERSION);
      }

      setPresets(presetsToUse);
    } catch (error) {
      console.error('Failed to load filter presets:', error);
      // Fallback to default presets if localStorage fails
      const defaultPresetsWithTime: FilterPreset[] = DEFAULT_PRESETS.map(
        (preset) => ({
          ...preset,
          createdAt: Date.now(),
        })
      );
      setPresets(defaultPresetsWithTime);
    }
    setIsLoaded(true);
  }, []);

  // Save presets to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
      } catch (error) {
        console.error('Failed to save filter presets:', error);
      }
    }
  }, [presets, isLoaded]);

  const savePreset = useCallback(
    (name: string, filters: ImageFilters, description?: string) => {
      const newPreset: FilterPreset = {
        id: Date.now().toString(),
        name,
        description,
        filters,
        createdAt: Date.now(),
      };

      setPresets((prev) => [newPreset, ...prev]);
      return newPreset;
    },
    []
  );

  const updatePreset = useCallback(
    (id: string, name: string, description?: string) => {
      setPresets((prev) =>
        prev.map((preset) =>
          preset.id === id
            ? { ...preset, name, description }
            : preset
        )
      );
    },
    []
  );

  const deletePreset = useCallback((id: string) => {
    setPresets((prev) => prev.filter((preset) => preset.id !== id));
  }, []);

  const getPreset = useCallback(
    (id: string) => {
      return presets.find((preset) => preset.id === id);
    },
    [presets]
  );

  const deleteAllPresets = useCallback(() => {
    setPresets([]);
  }, []);

  const resetToDefaults = useCallback(() => {
    const defaultPresetsWithTime: FilterPreset[] = DEFAULT_PRESETS.map(
      (preset) => ({
        ...preset,
        createdAt: Date.now(),
      })
    );
    setPresets(defaultPresetsWithTime);
    localStorage.setItem(DEFAULT_PRESETS_VERSION_KEY, CURRENT_VERSION);
  }, []);

  return {
    presets,
    savePreset,
    updatePreset,
    deletePreset,
    getPreset,
    deleteAllPresets,
    resetToDefaults,
    isLoaded,
  };
};
