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
  score:number;
}

export interface PageContentParsed {
  url: string;
  title: string;
  textContent: string;
  
  meta: {
    charset ? : string;
    description ? : string;
    ogTitle ? : string;
    ogImage ? : string;
    ogUrl ? : string;
  };
  
  links: {
    href: string;
    text: string;
  } [];
  
  images: {
    src: string;
    alt ? : string;
  } [];
  
  scripts: {
    src ? : string;
    inlineCode ? : string;
  } [];
  
  forms: {
    action ? : string;
    method ? : string;
    hasPasswordField: boolean;
    hasEmailField: boolean;
    fields: {
      name ? : string;
      type ? : string;
    } [];
  } [];
  
  iframes: string[];
  
  canonicalUrl ? : string;
  faviconUrl ? : string;
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

export type Rule = {
  id: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  score: number;
  match: (parsed: PageContentParsed) => boolean;
};