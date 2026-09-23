export interface AgentItem {
  id: string;
  num: string;
  category: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  launchTime: string;
  channels: string[];
  price: string;
  priceNumber: number;
  caseLink: string;
  caseTitle: string;
  features: string[];
  integrations: string[];
  exampleResult: string;
}

export interface CaseStudy {
  id: string;
  category: 'services' | 'clinic' | 'b2b' | 'retail';
  categoryName: string;
  title: string;
  client: string;
  agentUsed: string;
  metrics: { label: string; value: string; positive?: boolean }[];
  problem: string;
  solution: string;
  timeline: string;
  quote: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  category: 'general' | 'technical' | 'security' | 'pricing';
}

export type AgentTone = 'professional' | 'friendly' | 'concise' | 'street';

export interface ToneSetting {
  id: AgentTone;
  name: string;
  nameEn: string;
  badge: string;
  subtitle: string;
  description: string;
  traits: {
    formality: number;
    empathy: number;
    conciseness: number;
  };
  samplePhrase: string;
  iconName: 'Briefcase' | 'Smile' | 'Zap' | 'Flame';
}

export interface SimulatorMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  time: string;
  tone?: AgentTone;
  meta?: {
    crmAction?: string;
    extractedFields?: Record<string, string>;
    statusTag?: string;
    confidence?: number;
  };
}
