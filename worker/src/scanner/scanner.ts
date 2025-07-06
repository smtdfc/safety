import { v4 as uuidv4 } from 'uuid';
import { rules } from './rules.js';
import { parseHTMLContent } from './parser.js';

import {
  ScanResult,
  PageInfo,
  Rule,
  ScanIssue
} from '../types/index.js';

export class Scanner {
  private rules: Rule[] = rules;
  
  constructor(initialRules ? : Rule[]) {
    if (initialRules) this.rules.push(...initialRules);
  }
  
  addRule(rule: Rule) {
    this.rules.push(rule);
  }
  
  async scan(page: PageInfo): Promise < ScanResult > {
    const issues: ScanIssue[] = [];
    const passedRules: { ruleId: string;description: string } [] = [];
    const skippedRules: { ruleId: string;description: string;error: string } [] = [];
    let riskScore = 0;
    
    const parsed = parseHTMLContent(page.content, page.url);
    
    for (const rule of this.rules) {
      try {
        if (rule.match(parsed)) {
          issues.push({
            ruleId: rule.id,
            description: rule.description,
            severity: rule.severity,
            score: rule.score,
          });
          riskScore += rule.score;
        } else {
          passedRules.push({
            ruleId: rule.id,
            description: rule.description,
          });
        }
      } catch (err) {
        skippedRules.push({
          ruleId: rule.id,
          description: rule.description,
          error: 'Rule execution failed',
        });
        console.warn(`Rule "${rule.id}" failed:`, err);
      }
    }
    
    return {
      id: uuidv4(),
      url: page.url,
      issues,
      passed: issues.length === 0,
      passedRules,
      skippedRules,
      riskScore,
    };
  }
}