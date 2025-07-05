export interface ScanResult {
  id: string; 
  url: string; 
  issues: ScanIssue[]; 
  passed: boolean;
}

export interface ScanIssue {
  ruleId: string;
  description: string; 
  severity: 'low' | 'medium' | 'high';
}

export type Rule = {
  id: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  match: (page: PageInfo) => boolean;
};

export interface PageInfo{
  url: string;
  pageMetadata:{
    title:string;
    redirect:string;
  },
  content:string;
  accessTime:string;
}