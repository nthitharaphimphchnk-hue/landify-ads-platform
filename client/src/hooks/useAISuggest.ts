/**
 * AdCraft AI - useAISuggest Hook
 * Generates AI-powered suggestions for ad copy
 */

import { useState, useCallback } from "react";

export interface AISuggestion {
  headline: string;
  subtext: string;
  cta: string;
}

const adCopySuggestions: Record<string, AISuggestion[]> = {
  flash_sale: [
    {
      headline: "⚡ FLASH SALE",
      subtext: "Limited Time Only - Up to 70% OFF",
      cta: "Grab Now",
    },
    {
      headline: "🔥 MEGA SALE",
      subtext: "Ends Today - Don't Miss Out",
      cta: "Shop Fast",
    },
    {
      headline: "💥 CLEARANCE",
      subtext: "Huge Discounts on Everything",
      cta: "Claim Offer",
    },
  ],
  product: [
    {
      headline: "Discover Premium Quality",
      subtext: "Handpicked for Excellence",
      cta: "View Details",
    },
    {
      headline: "Upgrade Your Lifestyle",
      subtext: "Experience the Difference",
      cta: "Learn More",
    },
    {
      headline: "Limited Stock Available",
      subtext: "Premium Products at Great Prices",
      cta: "Order Now",
    },
  ],
  affiliate: [
    {
      headline: "Make Money Online",
      subtext: "Join Thousands of Successful Affiliates",
      cta: "Start Earning",
    },
    {
      headline: "Passive Income Opportunity",
      subtext: "Simple. Effective. Profitable.",
      cta: "Get Started",
    },
    {
      headline: "Turn Clicks into Cash",
      subtext: "Proven System for Success",
      cta: "Join Free",
    },
  ],
  ecommerce: [
    {
      headline: "New Collection Available",
      subtext: "Trending Styles Just Arrived",
      cta: "Shop Collection",
    },
    {
      headline: "Free Shipping on Orders",
      subtext: "No Minimum Purchase Required",
      cta: "Start Shopping",
    },
    {
      headline: "Exclusive Member Benefits",
      subtext: "Join Our VIP Club Today",
      cta: "Become VIP",
    },
  ],
  service: [
    {
      headline: "Transform Your Business",
      subtext: "Professional Solutions for Growth",
      cta: "Get Consultation",
    },
    {
      headline: "Expert Support 24/7",
      subtext: "Always Here to Help You Succeed",
      cta: "Contact Us",
    },
    {
      headline: "Trusted by Thousands",
      subtext: "Industry-Leading Service Quality",
      cta: "Learn More",
    },
  ],
};

export function useAISuggest() {
  const [loading, setLoading] = useState(false);

  const generateSuggestions = useCallback(
    async (
      category: string = "product",
      prompt?: string
    ): Promise<AISuggestion[]> => {
      setLoading(true);

      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Get suggestions based on category
        const suggestions = adCopySuggestions[category] || adCopySuggestions.product;

        // Shuffle and return top 3
        const shuffled = [...suggestions].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 3);
      } catch (error) {
        console.error("Failed to generate suggestions:", error);
        return adCopySuggestions.product;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const improveCopy = useCallback(
    async (
      headline: string,
      subtext: string,
      cta: string,
      category: string = "product"
    ): Promise<AISuggestion> => {
      setLoading(true);

      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1200));

        // Get category suggestions
        const suggestions = adCopySuggestions[category] || adCopySuggestions.product;

        // Return a random suggestion as improvement
        return suggestions[Math.floor(Math.random() * suggestions.length)];
      } catch (error) {
        console.error("Failed to improve copy:", error);
        return { headline, subtext, cta };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    generateSuggestions,
    improveCopy,
  };
}
