import { 
  Image, 
  PenTool, 
  Scissors, 
  Wand2, 
  Type, 
  Youtube, 
  Palette,
  Sparkles,
  Layout,
  FileText,
  Video,
  Eraser,
  Eye,
  Hash,
  AlignLeft,
  FileType
} from 'lucide-react';
import { Tool, ToolCategory } from './types';

// Fallback for ScanEye if not present in older Lucide versions
const ScanIcon = Eye;

export const TOOLS: Tool[] = [
  {
    id: 'image-gen',
    name: 'AI Image Generator',
    description: 'Create stunning visuals from text prompts using advanced AI.',
    category: ToolCategory.IMAGE,
    icon: Palette,
    path: '/tools/image/generator',
    popular: true
  },
  {
    id: 'content-writer',
    name: 'AI Content Writer',
    description: 'Generate articles, blogs, and essays in seconds.',
    category: ToolCategory.WRITING,
    icon: PenTool,
    path: '/tools/writing/writer',
    popular: true
  },
  {
    id: 'youtube-helper',
    name: 'YouTube All-in-One',
    description: 'The ultimate suite for YouTube creators.',
    category: ToolCategory.SOCIAL,
    icon: Youtube,
    path: '/tools/social/youtube-helper',
    isNew: true,
    popular: true
  },
  {
    id: 'youtube-script',
    name: 'YouTube Script Writer',
    description: 'Generate full engaging video scripts with hooks and CTAs.',
    category: ToolCategory.SOCIAL,
    icon: FileText,
    path: '/tools/social/youtube-script',
    isNew: true
  },
  {
    id: 'youtube-titles',
    name: 'YouTube Title Generator',
    description: 'Create viral, click-worthy titles for your videos.',
    category: ToolCategory.SOCIAL,
    icon: Type,
    path: '/tools/social/youtube-titles'
  },
  {
    id: 'youtube-desc',
    name: 'YouTube Descriptions',
    description: 'SEO-optimized video descriptions.',
    category: ToolCategory.SOCIAL,
    icon: AlignLeft,
    path: '/tools/social/youtube-desc'
  },
  {
    id: 'youtube-tags',
    name: 'YouTube Tag Generator',
    description: 'Find high-ranking keywords and tags.',
    category: ToolCategory.SOCIAL,
    icon: Hash,
    path: '/tools/social/youtube-tags'
  },
  {
    id: 'photo-enhancer',
    name: 'AI Photo Upscaler',
    description: 'Enhance and upscale images without changing the subject.',
    category: ToolCategory.IMAGE,
    icon: Wand2,
    path: '/tools/image/enhance'
  },
  {
    id: 'object-remover',
    name: 'AI Object Remover',
    description: 'Scan images to detect and remove unwanted objects.',
    category: ToolCategory.IMAGE,
    icon: Eraser,
    path: '/tools/image/object-remover',
    isNew: true
  },
  {
    id: 'bg-remover',
    name: 'Background Remover',
    description: 'Instantly remove backgrounds from images.',
    category: ToolCategory.IMAGE,
    icon: Scissors,
    path: '/tools/image/bg-remove'
  },
  {
    id: 'blog-post',
    name: 'Blog Post Creator',
    description: 'SEO-optimized full blog posts with structure.',
    category: ToolCategory.WRITING,
    icon: FileType,
    path: '/tools/writing/blog'
  },
  {
    id: 'social-caption',
    name: 'Social Captions',
    description: 'Engaging captions for Instagram, Twitter, and LinkedIn.',
    category: ToolCategory.SOCIAL,
    icon: Sparkles,
    path: '/tools/social/captions'
  }
];

export const CATEGORIES = [
  { id: ToolCategory.ALL, icon: Layout },
  { id: ToolCategory.IMAGE, icon: Image },
  { id: ToolCategory.WRITING, icon: PenTool },
  { id: ToolCategory.SOCIAL, icon: Youtube },
];