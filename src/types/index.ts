

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