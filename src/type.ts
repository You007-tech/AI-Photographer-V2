/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Photographer {
  id: string;
  name: string;
  avatar: string;
  styles: string[];
  bio: string;
  rating: number;
  completedJobs: number;
  location: string;
  pricePerSession: number;
  cameraSetup: string;
  portfolio: string[];
  matchRate?: number;
}

export interface PhotoStyle {
  name: string;
  englishName: string;
  matchRate: number;
  description: string;
  filterAdvice: string;
  locationAdvice: string;
  timeAdvice: string;
  cameraSettings: string;
}

export interface PoseSuggestion {
  id: string;
  title: string;
  description: string;
  keyPoints: string[];
  silhouetteSvgCode?: string; // Standard SVG representation or description
}

export interface ScriptStep {
  stepNumber: number;
  title: string;
  shotType: string; // e.g., Close-up, Medium shot, Full shot
  pose: string;
  composition: string;
  props: string;
  timing: string;
}

export interface ShootingScript {
  theme: string;
  style: string;
  brief: string;
  steps: ScriptStep[];
}

export interface CompositionAdvice {
  techniqueName: string;
  generalDescription: string;
  issuesIdentified: string[];
  directions: string[];
  cameraAngle: string;
}

export interface EditingAdvice {
  exposure: string;
  temperature: string;
  tint: string;
  highlights: string;
  shadows: string;
  cropping: string;
  presetName: string;
  generalSummary: string;
}

export interface StyleAnalysisResult {
  styles: PhotoStyle[];
  composition: CompositionAdvice;
  editing: EditingAdvice;
  recommendedPhotographerIds: string[];
}

export interface Booking {
  id: string;
  photographerId: string;
  photographerName: string;
  photographerAvatar: string;
  date: string;
  timeSlot: string;
  shootType: string;
  status: 'pending' | 'confirmed' | 'completed';
  aiScript?: ShootingScript;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  imageUrl: string;
  caption: string;
  likes: number;
  hasLiked?: boolean;
  styleTag: string;
  photographerName?: string;
  comments: { author: string; text: string; date: string }[];
  date: string;
}
