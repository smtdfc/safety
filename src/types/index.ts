export interface ScanResult {
  id: string;
  url: string;
  issues: ScanIssue[];
  passed: boolean;
  passedRules: {
    ruleId: string;
    description: string;
  } [];
  skippedRules: {
    ruleId: string;
    description: string;
    error: string;
  } [];
  riskScore: number;
}

export interface ScanIssue {
  ruleId: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  score: number;
}


export interface PageInfo {
  url: string;
  pageMetadata: {
    title: string;
    redirect: string;
  },
  content: string;
  accessTime: string;
}
