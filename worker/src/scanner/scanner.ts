import crypto from 'crypto';
import {rules} from './rules.js';
import {
  ScanResult,
  PageInfo,
  Rule,
  ScanIssue
} from '../types/index.js'


export class Scanner {
  private rules: Rule[] = [];
  
  constructor(initialRules ? : Rule[]) {
    if (initialRules) this.rules.push(...initialRules);
  }
  
  addRule(rule: Rule) {
    this.rules.push(rule);
  }
  
  async scan(page: PageInfo): Promise<ScanResult> {
    const issues: ScanIssue[] = [];
    
    for (const rule of this.rules) {
      try {
        if (rule.match(page)) {
          issues.push({
            ruleId: rule.id,
            description: rule.description,
            severity: rule.severity,
          });
        }
      } catch (err) {
        console.warn(`Rule "${rule.id}" failed:`, err);
      }
    }
    
    return {
      id: crypto.randomUUID?.() || Date.now().toString(),
      url: page.url,
      issues,
      passed: issues.length === 0,
    };
  }
}