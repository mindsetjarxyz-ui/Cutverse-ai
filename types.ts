import { LucideIcon } from 'lucide-react';

export enum ToolCategory {
  ALL = 'All Tools',
  IMAGE = 'AI Image',
  WRITING = 'AI Writing',
  SOCIAL = 'Social Media',
  UTILITY = 'Utility',
  STUDENT = 'Student AI',
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: LucideIcon;
  path: string;
  popular?: boolean;
  isNew?: boolean;
}

export interface GenerationState {
  isLoading: boolean;
  result: string | null;
  error: string | null;
}

export interface ImageGenerationConfig {
  aspectRatio: string;
  style: string;
}

export interface TextGenerationConfig {
  tone: string;
  length: string;
  language: string;
}