
import { LucideIcon } from 'lucide-react';

export enum ToolCategory {
  CHECKER = 'checker',
  TEXT = 'text',
  CONVERTER = 'converter',
  GENERATOR = 'generator',
  DEVELOPER = 'developer',
  IMAGE = 'image',
  MISC = 'misc',
  DOWNLOAD = 'download',
  PREVIEW = 'preview'
}

export interface ToolMetadata {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: ToolCategory;
  popular?: boolean;
  enabled?: boolean; // New field for admin control
  isNew?: boolean;   // Created via admin
}

export interface CategoryInfo {
  id: ToolCategory;
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ToolPageProps {
  metadata: ToolMetadata;
}

export interface User {
  uid?: string; // Firebase UID
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  plan: 'free' | 'golden' | 'custom';
  memberSince: string; // ISO Date string
  planExpiry?: string;
  lastActive?: string;
  isBanned?: boolean;
}

export interface BillingHistoryItem {
  id: string;
  date: string;
  description: string;
  amount: string;
  status: 'paid' | 'pending' | 'failed';
  invoiceUrl?: string;
}

export type PaymentMethodType = 'bkash' | 'nagad' | 'rocket' | 'bank';

export interface PaymentRequest {
  id?: string;
  userId: string;
  email: string;
  plan: 'golden' | 'custom';
  amount: string;
  method: PaymentMethodType;
  senderNumber: string;
  transactionId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any; // Firestore Timestamp
  rejectionReason?: string;
}

export interface BlogPost {
  id?: string;
  title: string;
  excerpt: string;
  content: string; // HTML or Markdown
  imageUrl?: string;
  author: string;
  date: string;
  category: string;
  slug?: string;
}

export interface ContactMessage {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  createdAt: any;
  read: boolean;
}

export interface UserReport {
  id?: string;
  type: 'bug' | 'feature' | 'feedback' | 'other';
  subject: string;
  message: string;
  email?: string;
  status: 'new' | 'reviewed' | 'resolved';
  createdAt: any;
}

export interface SocialLink {
  platform: string; // 'twitter', 'github', 'discord', 'facebook', 'linkedin'
  url: string;
}

export interface SiteConfig {
  footerText: string;
  contactEmail: string;
  socials: SocialLink[];
  pages: {
    about: string;
    privacy: string;
    terms: string;
    roadmap: string;
  };
  pricing: {
    goldenMonthly: string;
    goldenYearly: string;
  }
}