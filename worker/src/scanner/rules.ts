import { Rule } from '../types/index.js';

const TRUSTED_DOMAINS = [
  // Big Tech & Cloud
  'google.com',
  'gmail.com',
  'apple.com',
  'icloud.com',
  'microsoft.com',
  'outlook.com',
  'live.com',
  'azure.com',
  'cloudflare.com',
  'amazon.com',
  'aws.amazon.com',
  'alibaba.com',
  'baidu.com',
  'openai.com',
  
  // Social & Communication
  'facebook.com',
  'instagram.com',
  'whatsapp.com',
  'messenger.com',
  'twitter.com',
  'x.com',
  'linkedin.com',
  'discord.com',
  'slack.com',
  'zoom.us',
  
  // Developer & Code
  'github.com',
  'gitlab.com',
  'npmjs.com',
  'stackoverflow.com',
  'vscode.dev',
  'codesandbox.io',
  'replit.com',
  'vercel.com',
  'netlify.com',
  
  // Browser & Security
  'mozilla.org',
  'firefox.com',
  'chrome.com',
  'chromium.org',
  'letsencrypt.org',
  'w3.org',
  'caniuse.com',
  
  // Payment & Banking
  'paypal.com',
  'stripe.com',
  'visa.com',
  'mastercard.com',
  'americanexpress.com',
  'revolut.com',
  'wise.com',
  'squareup.com',
  
  // Video & Streaming
  'youtube.com',
  'netflix.com',
  'spotify.com',
  'twitch.tv',
  'hulu.com',
  'vimeo.com',
  
  // Email & Marketing
  'mailchimp.com',
  'sendgrid.com',
  'proton.me',
  'zoho.com',
  'yahoo.com',
  'yandex.com',
  
  // Education
  'coursera.org',
  'edx.org',
  'udemy.com',
  'khanacademy.org',
  'duolingo.com',
  
  // News & Reference
  'bbc.com',
  'cnn.com',
  'nytimes.com',
  'wikipedia.org',
  'theguardian.com',
  'forbes.com',
  
  // Others
  'canva.com',
  'dropbox.com',
  'mega.nz',
  'weebly.com',
  'notion.so',
  'figma.com',
  'airbnb.com',
  'booking.com',
  'uber.com',
];



export const rules: Rule[] = [
  {
    id: 'clickbait-title',
    description: 'Page title contains clickbait keywords like FREE, BONUS, GIFT, or MONEY',
    severity: 'medium',
    score: 30,
    match: (parsed) => /free|bonus|gift|money|win|claim/i.test(parsed.title),
  },
  {
    id: 'shortened-redirect',
    description: 'Redirect URL uses suspicious shortening services like bit.ly or t.co',
    severity: 'high',
    score: 50,
    match: (parsed) => /bit\.ly|t\.co|tinyurl\.com|goo\.gl|shorturl\.at/i.test(parsed.url),
  },
  {
    id: 'password-input-detected',
    description: 'Page contains a password input field',
    severity: 'high',
    score: 80,
    match: (parsed) => parsed.forms.some((f) => f.hasPasswordField),
  },
  {
    id: 'suspicious-script',
    description: 'Uses obfuscated JS: eval, charCodeAt + fromCharCode',
    severity: 'high',
    score: 90,
    match: (parsed) =>
      parsed.scripts.some(
        (s) =>
        s.inlineCode &&
        /charCodeAt\(|fromCharCode\(|eval\(/.test(s.inlineCode) &&
        /String\.fromCharCode/.test(s.inlineCode)
      ),
  },
  {
    id: 'no-meta-charset',
    description: 'Page does not declare a meta charset',
    severity: 'low',
    score: 10,
    match: (parsed) => !parsed.meta.charset,
  },
  {
    id: 'too-many-uppercase',
    description: 'Text content contains too many all-uppercase words',
    severity: 'medium',
    score: 40,
    match: (parsed) => {
      const matches = parsed.textContent.match(/\b[A-Z]{5,}\b/g);
      return (matches !== null && matches.length > 10);
    },
  },
  {
    id: 'form-without-https',
    description: 'Form action is over HTTP instead of HTTPS',
    severity: 'high',
    score: 70,
    match: (parsed) => parsed.forms.some((f) => f.action?.startsWith('http://')),
  },
  {
    id: 'iframe-hidden',
    description: 'Page contains iframe from external origin',
    severity: 'medium',
    score: 30,
    match: (parsed) =>
      parsed.iframes.some((src) => {
        try {
          const host = new URL(src).hostname;
          const pageHost = new URL(parsed.url).hostname;
          return !host.includes(pageHost);
        } catch {
          return false;
        }
      }),
  },
  {
    id: 'invalid-ssl-http',
    description: 'Page is served over HTTP, not HTTPS',
    severity: 'medium',
    score: 25,
    match: (parsed) => parsed.url.startsWith('http://'),
  },
  {
    id: 'mailto-password-field',
    description: 'Form uses mailto and has password field',
    severity: 'high',
    score: 90,
    match: (parsed) =>
      parsed.forms.some(
        (f) => f.action?.startsWith('mailto:') && f.hasPasswordField
      ),
  },
  {
    id: 'trusted-domain-bonus',
    description: 'Domain is in the list of known trusted domains',
    severity: 'low',
    score: -100,
    match: (parsed) => {
      try {
        const hostname = new URL(parsed.url).hostname;
        return TRUSTED_DOMAINS.some(
          (domain) =>
          hostname === domain || hostname.endsWith(`.${domain}`)
        );
      } catch {
        return false;
      }
    },
    
  },
  {
    id: 'form-suspicious-keyword',
    description: 'Form contains suspicious input names like ssn, creditcard, or bank',
    severity: 'high',
    score: 60,
    match: (parsed) =>
      parsed.forms.some((form) =>
        form.fields.some((field) => {
          if (!field.name) return false;
          /ssn|creditcard|cvv|iban|routing|bank/i.test(field.name)
        })
      ),
  },
  {
    id: 'long-dashed-domain',
    description: 'Domain is unusually long or contains many dashes (common in phishing)',
    severity: 'medium',
    score: 40,
    match: (parsed) => {
      try {
        const hostname = new URL(parsed.url).hostname;
        return hostname.length > 50 || hostname.split('-').length > 4;
      } catch {
        return false;
      }
    },
  },
  {
    id: 'too-many-hidden-inputs',
    description: 'Form contains unusually many hidden input fields',
    severity: 'medium',
    score: 30,
    match: (parsed) =>
      parsed.forms.some((form) =>
        form.fields.filter((f) => f.type === 'hidden').length > 5
      ),
  },
  {
    id: 'suspicious-tld',
    description: 'Domain uses a suspicious or uncommon TLD like .xyz, .top, .gq',
    severity: 'medium',
    score: 35,
    match: (parsed) => {
      try {
        const hostname = new URL(parsed.url).hostname;
        return /\.(xyz|top|gq|tk|ml|cf|work|zip|review)$/.test(hostname);
      } catch {
        return false;
      }
    },
  },
  {
    id: 'suspicious-data-url',
    description: 'Page uses base64-encoded data URLs in script, image, or iframe — often used to hide payloads.',
    severity: 'high',
    score: 60,
    match: (parsed) =>
      parsed.images.some((img) => img.src.startsWith('data:')) ||
      parsed.scripts.some((s) => s.src?.startsWith('data:')) ||
      parsed.iframes.some((src) => src.startsWith('data:')),
  },
  {
    id: 'no-favicon',
    description: 'Page is missing a favicon, which is unusual for real websites.',
    severity: 'low',
    score: 15,
    match: (parsed) => !parsed.faviconUrl,
  },
  {
    id: 'no-meta-description',
    description: 'Missing meta description tag',
    severity: 'low',
    score: 10,
    match: (parsed) => !parsed.meta.description,
  },
  {
    id: 'suspicious-domain-pattern',
    description: 'Domain contains many digits or hyphens, which is common in phishing sites.',
    severity: 'medium',
    score: 40,
    match: (parsed) => {
      try {
        const hostname = new URL(parsed.url).hostname;
        const hyphenCount = (hostname.match(/-/g) || []).length;
        const digitCount = (hostname.match(/\d/g) || []).length;
        return hyphenCount > 3 || digitCount > 5;
      } catch {
        return false;
      }
    },
  },
{
  id: 'free-domain-provider',
  description: 'Domain uses a known free TLD or hosting subdomain, often abused by scammers',
  severity: 'high',
  score: 60,
  match: (parsed) => {
    try {
      const hostname = new URL(parsed.url).hostname;
      const freeTLDs = ['.tk', '.ml', '.ga', '.cf', '.gq'];
      const freeHosts = [
        '000webhostapp.com',
        'infinityfreeapp.com',
        'web.app',
      ];
      
      if (freeTLDs.some((tld) => hostname.endsWith(tld))) return true;
      return freeHosts.some((host) => hostname === host || hostname.endsWith(`.${host}`));
    } catch {
      return false;
    }
  },
},
];