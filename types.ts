export type CloudProvider = 'AWS' | 'Azure' | 'GCP';

export enum InsightType {
  OPTIMIZATION = 'OPTIMIZATION',
  PRICING = 'PRICING',
  GUIDE = 'GUIDE',
  WARNING = 'WARNING'
}

export interface InsightStep {
  title: string;
  description: string;
}

export interface PricingTier {
  name: string;
  costEstimate: string;
  features: string[];
  justification: string;
}

export interface InsightDetail {
  steps?: InsightStep[];
  pricingTable?: PricingTier[];
  technicalDetails?: string;
}

export interface InsightTile {
  id: string;
  title: string;
  headline: string;
  rationale: string;
  type: InsightType;
  detail: InsightDetail;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  isThinking?: boolean;
}

export interface UserContext {
  prompt: string;
  provider: CloudProvider;
}