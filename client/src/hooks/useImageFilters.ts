import { useState, useCallback } from 'react';

export interface ImageFilters {
  brightness: number; // 0-200 (100 = normal)
  contrast: number;   // 0-200 (100 = normal)
  saturation: number; // 0-200 (100 = normal)
  blur: number;       // 0-20 (0 = no blur)
  opacity: number;    // 0-100 (100 = fully opaque)
}

const DEFAULT_FILTERS: ImageFilters = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  opacity: 100,
};

export const useImageFilters = () => {
  const [filters, setFilters] = useState<ImageFilters>(DEFAULT_FILTERS);

  const updateFilter = useCallback(
    (key: keyof ImageFilters, value: number) => {
      setFilters((prev) => ({
        ...prev,
        [key]: Math.max(0, Math.min(value, key === 'opacity' ? 100 : 200)),
      }));
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const getFilterStyle = useCallback((): React.CSSProperties => {
    return {
      filter: `
        brightness(${filters.brightness}%)
        contrast(${filters.contrast}%)
        saturate(${filters.saturation}%)
        blur(${filters.blur}px)
        opacity(${filters.opacity}%)
      `.trim(),
    };
  }, [filters]);

  const getFilterString = useCallback((): string => {
    return `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) blur(${filters.blur}px) opacity(${filters.opacity}%)`;
  }, [filters]);

  return {
    filters,
    updateFilter,
    resetFilters,
    getFilterStyle,
    getFilterString,
  };
};
