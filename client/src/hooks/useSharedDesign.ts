/**
 * AdCraft AI - useSharedDesign Hook
 * Manages shared design data retrieval and updates
 */

import { useCallback, useState, useEffect } from "react";

export interface SharedDesign {
  id: string;
  headline: string;
  subtext: string;
  cta: string;
  size: string;
  prompt?: string;
  imageData?: string;
  createdAt: number;
  expiresAt?: number;
}

export function useSharedDesign() {
  const [sharedDesigns, setSharedDesigns] = useState<Map<string, SharedDesign>>(
    new Map()
  );

  // Load shared designs from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("adcraft_shared_designs");
      if (stored) {
        const designs = JSON.parse(stored);
        setSharedDesigns(new Map(Object.entries(designs)));
      }
    } catch (error) {
      console.error("Failed to load shared designs:", error);
    }
  }, []);

  const saveSharedDesign = useCallback(
    (design: SharedDesign) => {
      const newDesigns = new Map(sharedDesigns);
      newDesigns.set(design.id, design);
      setSharedDesigns(newDesigns);

      // Persist to localStorage
      const obj = Object.fromEntries(newDesigns);
      localStorage.setItem("adcraft_shared_designs", JSON.stringify(obj));

      return design.id;
    },
    [sharedDesigns]
  );

  const getSharedDesign = useCallback(
    (id: string) => {
      return sharedDesigns.get(id) || null;
    },
    [sharedDesigns]
  );

  const deleteSharedDesign = useCallback(
    (id: string) => {
      const newDesigns = new Map(sharedDesigns);
      newDesigns.delete(id);
      setSharedDesigns(newDesigns);

      // Persist to localStorage
      const obj = Object.fromEntries(newDesigns);
      localStorage.setItem("adcraft_shared_designs", JSON.stringify(obj));
    },
    [sharedDesigns]
  );

  const generateShareLink = useCallback(
    (
      headline: string,
      subtext: string,
      cta: string,
      size: string,
      prompt?: string,
      imageData?: string
    ) => {
      const shareId = `share_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const design: SharedDesign = {
        id: shareId,
        headline,
        subtext,
        cta,
        size,
        prompt,
        imageData,
        createdAt: Date.now(),
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
      };

      saveSharedDesign(design);

      // Generate shareable link
      const baseUrl = window.location.origin;
      const shareUrl = `${baseUrl}/share/${shareId}`;

      return { shareId, shareUrl, design };
    },
    [saveSharedDesign]
  );

  return {
    sharedDesigns,
    saveSharedDesign,
    getSharedDesign,
    deleteSharedDesign,
    generateShareLink,
  };
}
