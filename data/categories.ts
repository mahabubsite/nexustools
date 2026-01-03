import { 
  CheckCircle2, 
  Type, 
  RefreshCcw, 
  Zap, 
  Code2, 
  Image as ImageIcon, 
  Box,
  Download,
  Monitor
} from 'lucide-react';
import { CategoryInfo, ToolCategory } from '../types';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: ToolCategory.DOWNLOAD,
    label: 'Downloader Tools',
    description: 'Download videos and thumbnails from social media.',
    icon: Download,
    color: 'text-cyan-500 bg-cyan-50',
  },
  {
    id: ToolCategory.PREVIEW,
    label: 'Code Preview',
    description: 'Test and debug HTML, CSS, and JavaScript in real-time.',
    icon: Monitor,
    color: 'text-orange-500 bg-orange-50',
  },
  {
    id: ToolCategory.TEXT,
    label: 'Text Tools',
    description: 'Manipulate, parse, and format text strings.',
    icon: Type,
    color: 'text-blue-500 bg-blue-50',
  },
  {
    id: ToolCategory.DEVELOPER,
    label: 'Developer Tools',
    description: 'Formatters, validators, and minifiers for coding.',
    icon: Code2,
    color: 'text-emerald-500 bg-emerald-50',
  },
  {
    id: ToolCategory.GENERATOR,
    label: 'Generators',
    description: 'Create hashes, passwords, and dummy data.',
    icon: Zap,
    color: 'text-amber-500 bg-amber-50',
  },
  {
    id: ToolCategory.CONVERTER,
    label: 'Converters',
    description: 'Convert data between different formats.',
    icon: RefreshCcw,
    color: 'text-violet-500 bg-violet-50',
  },
  {
    id: ToolCategory.CHECKER,
    label: 'Checkers',
    description: 'Analyze data, headers, and lookups.',
    icon: CheckCircle2,
    color: 'text-rose-500 bg-rose-50',
  },
  {
    id: ToolCategory.IMAGE,
    label: 'Image Tools',
    description: 'Resize, crop, and convert images.',
    icon: ImageIcon,
    color: 'text-pink-500 bg-pink-50',
  },
  {
    id: ToolCategory.MISC,
    label: 'Misc Tools',
    description: 'Other useful utilities and calculators.',
    icon: Box,
    color: 'text-slate-500 bg-slate-50',
  }
];