export type EmailTone = 
  | 'professional'
  | 'casual'
  | 'persuasive'
  | 'urgent'
  | 'friendly'
  | 'empathetic'
  | 'sales';

export type EmailLength = 'short' | 'medium' | 'long';

export interface EmailGenerateConfig {
  topic: string;
  tone: EmailTone;
  length: EmailLength;
  recipientName?: string;
  senderName?: string;
  additionalContext?: string;
  useMockMode?: boolean;
}

export interface EmailDraft {
  id: string;
  topic: string;
  tone: EmailTone;
  length: EmailLength;
  content: string;
  createdAt: string;
  wordCount: number;
  charCount: number;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'pro' | 'enterprise';
  emailsGenerated: number;
  maxQuota: number;
  avatarUrl?: string;
}

export interface PricingTier {
  id: 'free' | 'pro' | 'enterprise';
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  highlighted?: boolean;
  ctaText: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}
