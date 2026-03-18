/**
 * AdCraft AI - Share Link Hook
 * Generates shareable links for designs
 */

import { useCallback } from "react";

export interface ShareData {
  id: string;
  headline: string;
  subtext: string;
  cta: string;
  size: string;
  imageData?: string;
  createdAt: number;
}

const SHARE_STORAGE_KEY = "adcraft_shares";

export function useShareLink() {
  const generateShareLink = useCallback(
    (
      headline: string,
      subtext: string,
      cta: string,
      size: string,
      imageData?: string
    ) => {
      const shareId = `share_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const shareData: ShareData = {
        id: shareId,
        headline,
        subtext,
        cta,
        size,
        imageData,
        createdAt: Date.now(),
      };

      // Store share data in localStorage
      const shares = JSON.parse(
        localStorage.getItem(SHARE_STORAGE_KEY) || "{}"
      );
      shares[shareId] = shareData;
      localStorage.setItem(SHARE_STORAGE_KEY, JSON.stringify(shares));

      // Generate shareable URL
      const baseUrl = window.location.origin;
      const shareUrl = `${baseUrl}/share/${shareId}`;

      return {
        shareId,
        shareUrl,
        shareData,
      };
    },
    []
  );

  const getShareData = useCallback((shareId: string) => {
    const shares = JSON.parse(
      localStorage.getItem(SHARE_STORAGE_KEY) || "{}"
    );
    return shares[shareId] || null;
  }, []);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }, []);

  return {
    generateShareLink,
    getShareData,
    copyToClipboard,
  };
}
