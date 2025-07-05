import crypto from 'crypto';

type ScanRule = (page: PageInfo) => RuleMatch | null;

export class PageScanner {
  private rules: ScanRule[] = [];

  addRule(rule: ScanRule) {
    this.rules.push(rule);
  }

  scan(page: PageInfo): ScanResult {
    const matches: RuleMatch[] = [];

    for (const rule of this.rules) {
      const result = rule(page);
      if (result) matches.push(result);
    }

    const isMalicious = matches.length > 0;
    const threatTypes = Array.from(new Set(matches.map(r => r.threatType)));
    const matchedRules = matches.map(r => r.ruleId);
    const reasons = matches.map(r => r.reason);
    const detectedBy = ['custom-rules'];

    const severityRank = { low: 1, medium: 2, high: 3, critical: 4 };
    const maxSeverity = matches.reduce((prev, curr) =>
      severityRank[curr.severity] > severityRank[prev] ? curr.severity : prev,
      'low' as 'low' | 'medium' | 'high' | 'critical'
    );

    return {
      id: this.hashUrl(page.url),
      url: page.url,
      isMalicious,
      threatTypes,
      severity: maxSeverity,
      detectedAt: new Date().toISOString(),
      detectedBy,
      reasons,
      matchedRules,
      pageMetadata: {
        title: page.title,
        metaDescription: page.metaTags?.description,
      },
      screenshot: page.screenshot,
    };
  }

  private hashUrl(url: string): string {
    return crypto.createHash('sha256').update(url).digest('hex');
  }
}