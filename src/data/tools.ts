import { 
  FileText, 
  Mail, 
  MessageSquare, 
  Mic, 
  FileSearch, 
  SpellCheck, 
  AlignLeft, 
  BookOpen, 
  Feather,
  BookOpenCheck,
  Image,
  Youtube,
  FileVideo,
  Hash,
  Type,
  PenTool,
  Baby,
  Newspaper,
  Instagram,
  UserCheck,
  LucideIcon
} from 'lucide-react';

export interface Tool {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  category: string;
}

export const tools: Tool[] = [
  // Student AI Tools
  {
    id: 'application-writer',
    title: 'Application Writer',
    description: 'Write formal applications for leave, permission, and requests',
    icon: FileText,
    category: 'student'
  },
  {
    id: 'letter-writer',
    title: 'Letter Writer',
    description: 'Write formal and informal letters for any purpose',
    icon: Mail,
    category: 'student'
  },
  {
    id: 'debate-writer',
    title: 'Debate Writer',
    description: 'Create compelling debate speeches on any topic',
    icon: MessageSquare,
    category: 'student'
  },
  {
    id: 'speech-writer',
    title: 'Speech Writer',
    description: 'Generate speeches for various occasions',
    icon: Mic,
    category: 'student'
  },
  {
    id: 'summary-generator',
    title: 'Summary Generator',
    description: 'Summarize long texts into simple explanations',
    icon: FileSearch,
    category: 'student'
  },
  {
    id: 'grammar-corrector',
    title: 'Grammar Corrector',
    description: 'Fix grammar, spelling, and improve sentence structure',
    icon: SpellCheck,
    category: 'student'
  },
  {
    id: 'paragraph-writer',
    title: 'Paragraph Writer',
    description: 'Write well-structured paragraphs on any topic',
    icon: AlignLeft,
    category: 'student'
  },
  {
    id: 'essay-writer',
    title: 'Essay Writer',
    description: 'Generate comprehensive essays with introduction, body, and conclusion',
    icon: BookOpen,
    category: 'student'
  },
  {
    id: 'composition-writer',
    title: 'Composition Writer',
    description: 'Write creative compositions in narrative, descriptive, or reflective style',
    icon: Feather,
    category: 'student'
  },
  {
    id: 'story-generator',
    title: 'Story Generator',
    description: 'Generate creative stories based on topic and class level',
    icon: BookOpenCheck,
    category: 'student'
  },
  {
    id: 'ai-humanizer',
    title: 'AI Humanizer',
    description: 'Make AI-generated text sound more natural and human-written',
    icon: UserCheck,
    category: 'student'
  },
  
  // AI Writing Tools
  {
    id: 'content-writer',
    title: 'AI Content Writer',
    description: 'Create content for kids stories, blog posts, Instagram captions and more',
    icon: PenTool,
    category: 'writer'
  },
  {
    id: 'kids-story',
    title: 'Kids Story Writer',
    description: 'Write engaging stories for children',
    icon: Baby,
    category: 'writer'
  },
  {
    id: 'blog-post',
    title: 'Blog Post Writer',
    description: 'Create SEO-friendly blog posts on any topic',
    icon: Newspaper,
    category: 'writer'
  },
  {
    id: 'instagram-caption',
    title: 'Instagram Caption',
    description: 'Generate catchy Instagram captions with hashtags',
    icon: Instagram,
    category: 'writer'
  },
  
  // Image Tools
  {
    id: 'image-generator',
    title: 'AI Image Generator',
    description: 'Generate stunning images from text descriptions',
    icon: Image,
    category: 'image'
  },
  
  // Social Media Tools
  {
    id: 'youtube-title',
    title: 'Clickbait Title Generator',
    description: 'Generate engaging YouTube video titles',
    icon: Youtube,
    category: 'social'
  },
  {
    id: 'youtube-script',
    title: 'Script Writer',
    description: 'Write complete YouTube video scripts',
    icon: FileVideo,
    category: 'social'
  },
  {
    id: 'youtube-description',
    title: 'SEO Description Generator',
    description: 'Create SEO-friendly YouTube descriptions',
    icon: Type,
    category: 'social'
  },
  {
    id: 'youtube-tags',
    title: 'Tag Generator',
    description: 'Generate relevant tags for YouTube videos',
    icon: Hash,
    category: 'social'
  }
];

export const classOptions = [
  { value: 'class-7', label: 'Class 7' },
  { value: 'class-8', label: 'Class 8' },
  { value: 'class-9', label: 'Class 9' },
  { value: 'class-10', label: 'Class 10' },
  { value: 'class-11', label: 'Class 11' },
  { value: 'class-12', label: 'Class 12' },
  { value: 'university', label: 'University' },
];
