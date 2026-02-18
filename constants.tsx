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
  FileType,
  GraduationCap,
  BookOpen,
  ScrollText,
  MessageCircle,
  Mic2,
  Languages,
  Feather
} from 'lucide-react';
import { Tool, ToolCategory } from './types';

// Fallback for ScanEye if not present in older Lucide versions
const ScanIcon = Eye;

export const TOOLS: Tool[] = [
  // --- VIRAL / POPULAR TOOLS (Top Priority) ---
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

  // --- STUDENT AI TOOLS ---
  {
    id: 'student-application',
    name: 'Application Writer',
    description: 'Write formal applications for school, college, or jobs.',
    category: ToolCategory.STUDENT,
    icon: FileText,
    path: '/tools/student/application',
    isNew: true
  },
  {
    id: 'student-essay',
    name: 'Essay Writer',
    description: 'Generate academic essays with proper introduction and conclusion.',
    category: ToolCategory.STUDENT,
    icon: BookOpen,
    path: '/tools/student/essay',
    popular: true
  },
  {
    id: 'student-paragraph',
    name: 'Paragraph Writer',
    description: 'Write perfectly structured paragraphs for any grade level.',
    category: ToolCategory.STUDENT,
    icon: AlignLeft,
    path: '/tools/student/paragraph',
    isNew: true
  },
  {
    id: 'student-summary',
    name: 'Summary Generator',
    description: 'Summarize text or topics into concise notes.',
    category: ToolCategory.STUDENT,
    icon: FileText,
    path: '/tools/student/summary'
  },
  {
    id: 'student-grammar',
    name: 'Grammar Improver',
    description: 'Fix grammar and improve sentence structure.',
    category: ToolCategory.STUDENT,
    icon: Languages,
    path: '/tools/student/grammar'
  },
  {
    id: 'student-composition',
    name: 'Composition Writer',
    description: 'Creative compositions tailored to specific word counts.',
    category: ToolCategory.STUDENT,
    icon: Feather,
    path: '/tools/student/composition'
  },
  {
    id: 'student-letter',
    name: 'Letter Writer',
    description: 'Formal and informal letters (applications, complaints, friendly).',
    category: ToolCategory.STUDENT,
    icon: ScrollText,
    path: '/tools/student/letter'
  },
  {
    id: 'student-story',
    name: 'Story Writer',
    description: 'Create engaging stories based on prompts or morals.',
    category: ToolCategory.STUDENT,
    icon: Sparkles,
    path: '/tools/student/story'
  },
  {
    id: 'student-speech',
    name: 'Speech Writer',
    description: 'Write persuasive speeches for assembly or debate.',
    category: ToolCategory.STUDENT,
    icon: Mic2,
    path: '/tools/student/speech'
  },
  {
    id: 'student-debate',
    name: 'Debate Writer',
    description: 'Generate arguments for or against a motion.',
    category: ToolCategory.STUDENT,
    icon: MessageCircle,
    path: '/tools/student/debate'
  },

  // --- SOCIAL MEDIA TOOLS ---
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
    id: 'social-caption',
    name: 'Social Captions',
    description: 'Engaging captions for Instagram, Twitter, and LinkedIn.',
    category: ToolCategory.SOCIAL,
    icon: Sparkles,
    path: '/tools/social/captions'
  },

  // --- IMAGE & UTILITY TOOLS ---
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
  }
];

export const CATEGORIES = [
  { id: ToolCategory.ALL, icon: Layout },
  { id: ToolCategory.STUDENT, icon: GraduationCap },
  { id: ToolCategory.WRITING, icon: PenTool },
  { id: ToolCategory.IMAGE, icon: Image },
  { id: ToolCategory.SOCIAL, icon: Youtube },
];