export interface RuleMatch {
  ruleId: string;
  reason: string;
  threatType: string; // e.g. 'phishing', 'malware'
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface PageInfo {
  url: string;
  title?: string;
  htmlContent?: string;
  metaTags?: Record<string, string>;
  screenshot?: string;
}

export interface ScanResult {
  id: string;
  url: string;
  isMalicious: boolean;
  threatTypes: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  detectedAt: string;
  detectedBy: string[];
  reasons: string[];
  matchedRules: string[];
  pageMetadata?: {
    title?: string;
    metaDescription?: string;
  };
  screenshot?: string;
  additionalInfo?: Record<string, any>;
}