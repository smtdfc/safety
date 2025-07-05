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
];