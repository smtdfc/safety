import { Rule } from '../types/index.js';

export const rules: Rule[] = [
  {
    id: 'clickbait-title',
    description: 'Page title contains clickbait keywords like FREE, BONUS, GIFT, or MONEY',
    severity: 'medium',
    match: (page) => /free|bonus|gift|money|win|claim/i.test(page.pageMetadata.title),
  },
  {
    id: 'shortened-redirect',
    description: 'Redirect URL uses suspicious shortening services like bit.ly or t.co',
    severity: 'high',
    match: (page) => /bit\.ly|t\.co|tinyurl\.com|goo\.gl|shorturl\.at/i.test(page.pageMetadata.redirect),
  },
  {
    id: 'password-input-detected',
    description: 'Page contains a password input field',
    severity: 'high',
    match: (page) => /type\s*=\s*["']?password["']?/i.test(page.content),
  },
  {
    id: 'phishing-phrases',
    description: 'Page content contains phishing-related phrases',
    severity: 'high',
    match: (page) =>
      /verify your account|login to claim|your session expired|account suspended/i.test(page.content),
  },
  {
    id: 'urgent-action-phrases',
    description: 'Page urges user to act quickly with phrases like "limited time offer"',
    severity: 'medium',
    match: (page) => /act now|limited time|only today|urgent action required/i.test(page.content),
  },
  {
    id: 'form-without-https',
    description: 'Form action points to HTTP instead of HTTPS',
    severity: 'high',
    match: (page) => /<form[^>]+action=["']http:\/\//i.test(page.content),
  },
  {
    id: 'suspicious-form-fields',
    description: 'Form contains both email and password inputs (login mimic)',
    severity: 'high',
    match: (page) =>
      /type=["']?(email)["']?/i.test(page.content) &&
      /type=["']?(password)["']?/i.test(page.content),
  },
  {
    id: 'script-from-bad-source',
    description: 'Page includes script from suspicious domains',
    severity: 'medium',
    match: (page) =>
      /<script[^>]+src=["']?(http:\/\/|\/\/)?(malware-site\.|suspiciouscdn\.|cdn-scam\.net)/i.test(page.content),
  },
  {
    id: 'hidden-iframe',
    description: 'Page contains a hidden iframe (used in many phishing kits)',
    severity: 'medium',
    match: (page) => /<iframe[^>]+style=["'][^"']*display:\s*none/i.test(page.content),
  },
  {
    id: 'obfuscated-javascript',
    description: 'Page contains heavily obfuscated JavaScript code',
    severity: 'medium',
    match: (page) => /eval\(function\(|window\[["']?["']?\]\s*=/i.test(page.content),
  },
  {
    id: 'no-title-tag',
    description: 'Page has no title tag (commonly seen in generated scam pages)',
    severity: 'low',
    match: (page) => !/<title>.*<\/title>/i.test(page.content),
  },
  {
    id: 'excessive-uppercase',
    description: 'Page contains too many all-uppercase words (common in scams)',
    severity: 'medium',
    match: (page) => {
      const matches = page.content.match(/\b[A-Z]{5,}\b/g);
      return matches !== null && matches.length > 10;
    }
  },
  {
    id: 'contains-crypto-terms',
    description: 'Page mentions cryptocurrency giveaway or airdrop',
    severity: 'high',
    match: (page) =>
      /crypto|airdrop|bitcoin|ethereum|wallet address|send eth|send btc/i.test(page.content),
  },
  {
    id: 'domain-in-title',
    description: 'Title includes a suspicious domain name (e.g., "login-facebook.com")',
    severity: 'high',
    match: (page) =>
      /[a-z0-9-]+(\.com|\.net|\.org)/i.test(page.pageMetadata.title) &&
      /login|verify|secure/i.test(page.pageMetadata.title),
  },
  {
    id: 'no-doctype-declared',
    description: 'Page has no DOCTYPE declaration (common in fake, minimal HTML)',
    severity: 'low',
    match: (page) => !/<!doctype html>/i.test(page.content),
  },
  {
    id: 'suspicious-brand-mismatch',
    description: 'Title mentions a known brand but domain does not match',
    severity: 'high',
    match: (page) => {
      const title = page.pageMetadata.title.toLowerCase();
      const url = page.url.toLowerCase();
      return (
        /(paypal|facebook|microsoft|netflix|apple|amazon)/.test(title) &&
        !url.includes('paypal') &&
        !url.includes('facebook') &&
        !url.includes('microsoft') &&
        !url.includes('netflix') &&
        !url.includes('apple') &&
        !url.includes('amazon')
      );
    }
  },
  {
    id: 'multiple-forms',
    description: 'Page contains multiple form tags (often seen in scam pages)',
    severity: 'medium',
    match: (page) => {
      const match = page.content.match(/<form/gi);
      return match !== null && match.length > 2;
    }
  },
  {
    id: 'auto-download',
    description: 'Page triggers a file download on load',
    severity: 'high',
    match: (page) =>
      /<a[^>]+download=|window\.location\.href\s*=\s*["'][^"']+\.exe["']/i.test(page.content),
  },
  {
    id: 'javascript-obfuscation',
    description: 'JavaScript uses obfuscation patterns like charCodeAt + eval',
    severity: 'high',
    match: (page) =>
      /charCodeAt\(|fromCharCode\(|eval\(/i.test(page.content) &&
      /String\.fromCharCode/.test(page.content),
  },
  {
    id: 'suspicious-language',
    description: 'Page uses language often found in scam/fake pages',
    severity: 'medium',
    match: (page) =>
      /you have been selected|click below to continue|congratulations|dear customer/i.test(page.content),
  },
  {
    id: 'no-meta-charset',
    description: 'Page does not declare a meta charset (common in auto-generated scam)',
    severity: 'low',
    match: (page) => !/<meta[^>]+charset=/i.test(page.content),
  },
  {
    id: 'link-text-mismatch',
    description: 'Anchor text and href domain mismatch (e.g., text says “paypal.com” but link goes elsewhere)',
    severity: 'high',
    match: (page) => {
      const re = /<a [^>]*href=["']([^"']+)["'][^>]*>([^<]+)<\/a>/gi;
      let m;
      while ((m = re.exec(page.content))) {
        const href = m[1];
        const text = m[2];
        if (/https?:\/\//.test(href) && !href.includes(text.trim())) {
          return true;
        }
      }
      return false;
    },
  },
  {
    id: 'homograph-idn',
    description: 'Domain contains visually deceptive characters (IDN homograph attack)',
    severity: 'high',
    match: (page) =>
      /[\u0400-\u04FF\u0370-\u03FF\u4E00-\u9FFF]/.test(new URL(page.url).hostname),
  },
  {
    id: 'excessive-subdomains',
    description: 'URL uses many subdomains, maybe phishing (~4+ levels)',
    severity: 'medium',
    match: (page) => {
      const hostname = new URL(page.url).hostname;
      return hostname.split('.').length >= 5;
    },
  },
  {
    id: 'open-redirect-param',
    description: 'URL contains open-redirect param (?redirect= or ?url=)',
    severity: 'medium',
    match: (page) =>
      /[?&](url|redirect|next)=https?:\/\//i.test(page.url),
  },
  {
    id: 'tabnabbing-meta-refresh',
    description: 'Page contains meta-refresh redirect (used in tabnabbing)',
    severity: 'medium',
    match: (page) => /<meta http-equiv=["']refresh["'] content=["'][0-9]+;url=/i.test(page.content),
  },
  {
    id: 'cloned-brand-logo',
    description: 'Page references images from brand domains but is on different host',
    severity: 'medium',
    match: (page) => {
      const imgRe = /<img[^>]+src=["']([^"']+)["']/gi;
      let m;
      const host = new URL(page.url).hostname;
      while ((m = imgRe.exec(page.content))) {
        const src = m[1];
        try {
          const imgHost = new URL(src, page.url).hostname;
          if (/(paypal|facebook|google|apple)\./i.test(imgHost) && !host.includes(RegExp.$1)) {
            return true;
          }
        } catch {}
      }
      return false;
    },
  },
  {
    id: 'invalid-ssl-http',
    description: 'Page loaded over HTTP (not HTTPS)',
    severity: 'medium',
    match: (page) => page.url.startsWith('http://'),
  },
  {
    id: 'nested-iframe-redirect',
    description: 'Page contains nested iframe redirecting to another domain',
    severity: 'high',
    match: (page) => {
      const re = /<iframe[^>]+src=["'](https?:\/\/[^"']+)["']/gi;
      let m;
      while ((m = re.exec(page.content))) {
        const srcHost = new URL(m[1]).hostname;
        if (!new URL(page.url).hostname.includes(srcHost)) return true;
      }
      return false;
    }
  },
  {
    id: 'brand-mention-text-only',
    description: 'Title mentions brand but no asset reference (logo, favicon)',
    severity: 'low',
    match: (page) => {
      const title = page.pageMetadata.title.toLowerCase();
      if (/(paypal|facebook|google|apple)/.test(title)) {
        if (!/<img[^>]+(favicon|logo)/i.test(page.content)) return true;
      }
      return false;
    },
  },
  {
    id: 'mailto-password-field',
    description: 'Form uses mailto for password (scam tactic)',
    severity: 'high',
    match: (page) => /<form[^>]+action=["']mailto:[^"']+["'][^>]*>/.test(page.content) &&
      /type=["']?password["']?/i.test(page.content),
  },
  
];