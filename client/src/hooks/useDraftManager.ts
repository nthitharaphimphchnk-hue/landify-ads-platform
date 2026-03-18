/**
 * AdCraft AI - Draft Manager Hook
 * Manages saving and loading design drafts from localStorage
 */

import { useState, useCallback } from "react";

export interface Draft {
  id: string;
  title: string;
  prompt: string;
  headline: string;
  subtext: string;
  cta: string;
  size: string;
  resolution: string;
  templateId?: number;
  createdAt: number;
  updatedAt: number;
  imageData?: string; // Base64 encoded canvas image
}

const STORAGE_KEY = "adcraft_drafts";
const MAX_DRAFTS = 50;

export function useDraftManager() {
  const [drafts, setDrafts] = useState<Draft[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const saveDraft = useCallback(
    (
      title: string,
      prompt: string,
      headline: string,
      subtext: string,
      cta: string,
      size: string,
      resolution: string,
      templateId?: number,
      imageData?: string
    ) => {
      const now = Date.now();
      const existingDraft = drafts.find((d) => d.title === title);

      let newDrafts: Draft[];
      if (existingDraft) {
        // Update existing draft
        newDrafts = drafts.map((d) =>
          d.id === existingDraft.id
            ? {
                ...d,
                prompt,
                headline,
                subtext,
                cta,
                size,
                resolution,
                templateId,
                imageData,
                updatedAt: now,
              }
            : d
        );
      } else {
        // Create new draft
        const newDraft: Draft = {
          id: `draft_${now}_${Math.random().toString(36).substr(2, 9)}`,
          title,
          prompt,
          headline,
          subtext,
          cta,
          size,
          resolution,
          templateId,
          createdAt: now,
          updatedAt: now,
          imageData,
        };
        newDrafts = [newDraft, ...drafts].slice(0, MAX_DRAFTS);
      }

      setDrafts(newDrafts);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newDrafts));
      return existingDraft ? existingDraft.id : newDrafts[0].id;
    },
    [drafts]
  );

  const loadDraft = useCallback((id: string) => {
    const draft = drafts.find((d) => d.id === id);
    if (draft) {
      // Store draft in sessionStorage for Generate page to load
      sessionStorage.setItem("editingDraft", JSON.stringify(draft));
    }
    return draft || null;
  }, [drafts]);

  const getEditingDraft = useCallback(() => {
    try {
      const stored = sessionStorage.getItem("editingDraft");
      if (stored) {
        const draft = JSON.parse(stored);
        sessionStorage.removeItem("editingDraft");
        return draft;
      }
    } catch {
      return null;
    }
    return null;
  }, []);

  const deleteDraft = useCallback(
    (id: string) => {
      const newDrafts = drafts.filter((d) => d.id !== id);
      setDrafts(newDrafts);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newDrafts));
    },
    [drafts]
  );

  const getAllDrafts = useCallback(() => {
    return drafts.sort((a, b) => b.updatedAt - a.updatedAt);
  }, [drafts]);

  return {
    drafts,
    saveDraft,
    loadDraft,
    deleteDraft,
    getAllDrafts,
    getEditingDraft,
  };
}
