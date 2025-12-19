import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { PipelineTier } from "@/types/pipeline";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const TIER_ORDER: PipelineTier[] = ['CORE', 'GM', 'ELITE'];

export function isTierUnlocked(currentTier: PipelineTier, requiresTier: PipelineTier): boolean {
  return TIER_ORDER.indexOf(currentTier) >= TIER_ORDER.indexOf(requiresTier);
}
