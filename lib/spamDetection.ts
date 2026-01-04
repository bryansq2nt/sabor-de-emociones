// Spam detection utilities

const SPAM_KEYWORDS = [
  'crypto',
  'bitcoin',
  'ethereum',
  'backlinks',
  'seo service',
  'marketing agency',
  'digital marketing',
  'increase traffic',
  'buy followers',
  'cheap viagra',
  'casino',
  'gambling',
  'loan',
  'debt',
  'investment opportunity',
  'make money fast',
  'work from home',
  'get rich quick',
];

const URL_REGEX = /https?:\/\/[^\s]+/gi;

export function detectSpam(text: string): { isSpam: boolean; reason?: string } {
  const lowerText = text.toLowerCase();

  // Check for too many URLs
  const urls = lowerText.match(URL_REGEX);
  if (urls && urls.length > 2) {
    return { isSpam: true, reason: 'too_many_urls' };
  }

  // Check for spam keywords
  for (const keyword of SPAM_KEYWORDS) {
    if (lowerText.includes(keyword)) {
      return { isSpam: true, reason: 'spam_keyword' };
    }
  }

  // Check for repeated characters (e.g., "aaaaaaa" or "1111111")
  const repeatedCharPattern = /(.)\1{10,}/;
  if (repeatedCharPattern.test(text)) {
    return { isSpam: true, reason: 'repeated_characters' };
  }

  return { isSpam: false };
}

export function validateOrigin(origin: string | null, referer: string | null): boolean {
  if (!origin && !referer) {
    return false;
  }

  const allowedDomains = [
    'sabordeemociones.com',
    'www.sabordeemociones.com',
    'localhost:3000',
    'localhost',
    '127.0.0.1:3000',
    '127.0.0.1',
  ];

  const checkUrl = origin || referer || '';
  
  return allowedDomains.some(domain => {
    return checkUrl.includes(domain);
  });
}

